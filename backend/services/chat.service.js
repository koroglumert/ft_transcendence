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
				const count = Object.keys(chat).length;
				if (!chat.firstId || !chat.secondId || count != 2)
					return { message: "eksik veya fazla parametre" }
				const response = await this.adapter.findOne({
					$and: [
						{
							$or: [
								{ firstId: chat.firstId, secondId: chat.secondId },
								{ firstId: chat.secondId, secondId: chat.firstId }
							]
						}
					]
				});
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
				const count = Object.keys(ctx.params).length;
				if (count != 1)
					return { message: "eksik veya fazla parametre" }
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