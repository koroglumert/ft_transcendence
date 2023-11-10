"use strict"

const DBMixin = require("../mixins/db.mixin")
const env = require('dotenv');

env.config();

module.exports = {
	name: "message",
	mixins: [DBMixin("message")],
	settings: {
		fields: ["_id", "chatId", "senderId", "text", "createdAt", "updatedAt"],
		entityValidator: {}
	},
	actions: {
		create: {
			method: "POST",
			async handler(ctx) {
				const { chatId, senderId, text } = ctx.params;
				ctx.params.createdAt = new Date();
				ctx.params.updatedAt = new Date();
				const created = ctx.params.createdAt;
				const updated = ctx.params.updatedAt;
				const response = {
					chatId, senderId, text, created, updated
				};
				try {
					const newMessage = await this.adapter.insert(response);
					const users = await ctx.call("io.getLinkedPeople");
					await ctx.call("io.sendAllMessages", { chatId: chatId, senderId: senderId, text: text });
					return newMessage;
				} catch (error) {
					return error;
				}
			}
		},
		get: {
			async handler(ctx) {
				const chatId = ctx.params.id;
				try {
					const messages = await this.adapter.find({ query: { chatId: chatId } });
					return messages;
				} catch (error) {
					console.log("catch", error);
					return error;
				}
			}
		},

		count: {
			async handler() {
				const result = this.adapter.count();
				return result;
			},
		},

		clear: {
			async handler(ctx) {
				await this.adapter.clear();
			}
		},
	}
}