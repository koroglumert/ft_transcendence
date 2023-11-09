"use strict"

const DBMixin = require("../mixins/db.mixin")

module.exports = {
	name: "chat",
	mixins: [DBMixin("chat")],
	settings: {
		fields: ["_id", "firstId", "secondId", "createdAt", "updatedAt"],
		entityValidator: {}
	},

	actions: {
		create: {
			method: "POST",
			async handler(ctx) {
				const chat = ctx.params;
				const response = await this.adapter.findOne({
					$and: [{ firstId: chat.firstId }, { secondId: chat.secondId }]
				}
				);
				if (response) {
					return response;
				}
				else {
					chat.createdAt = new Date();
					chat.updatedAt = new Date();
					const newChat = await this.adapter.insert(chat);
					return newChat;
				}
			}
		},
		get: {
			method: "GET",
			async handler(ctx) {
				const { id } = ctx.params;
				try {
					const response = await this.adapter.find({
						query: {
							$or: [
								{ firstId: id },
								{ secondId: id }
							]
						}
					});
					return response;
				} catch (error) {
					return error;
				}
			}
		},
		find: {
			rest: {
				method: "GET",
				path: "/find/:firstId/:secondId"
			},
			async handler(ctx) {
				const { firstId, secondId } = ctx.params;
				try {
					const response = await this.adapter.find({
						query: {
							$and: [
								{ firstId: firstId },
								{ secondId: secondId }
							]
						}
					});;
					return response;
				} catch (error) {
					console.log(error);
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