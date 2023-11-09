"use strict"

const DBMixin = require("../mixins/db.mixin")
const { ObjectId } = require('mongodb');
const bcrypt = require("bcryptjs");

module.exports = {
	name: "group",
	mixins: [DBMixin("group")],
	settings: {
		fields: ["_id", "groupName", "password", "createdAt", "updatedAt"],
		entityValidator: {
			groupName: { type: "string", min: 5 },
			password: { type: "string", min: 3, optional: true },
		}
	},
	actions: {
		create: {
			method: "POST",
			async handler(ctx) {
				const group = ctx.params;
				const query = { groupName: group.groupName };
				try {
					const response = await this.adapter.findOne(query);
					if (response) return { message: "Lütfen farklı bir grup ismi giriniz.." };
					await this.validateEntity(group);
					if (!group.password) {
						group.password = null;
					} else {
						group.password = bcrypt.hashSync(group.password, 10);
					}
					group.createdAt = new Date();
					group.updatedAt = new Date();
					const newGroup = await this.adapter.insert(group);
					return newGroup;
				} catch (error) {
					console.log(error);
					return error;
				}
			}
		},
		get: {
			method: "GET",
			async handler(ctx) {
				const group = ctx.params;
				try {
					const query = { _id: new ObjectId(group.id) };
					const response = await this.adapter.findOne(query);
					return response;
				} catch (error) {
					return error;
				}
			}
		},
		clear: {
			async handler(ctx) {
				await this.adapter.clear();
			}
		},
	}
}