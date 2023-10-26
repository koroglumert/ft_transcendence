"use strict"

const DBMixin = require("../mixins/db.mixin")
const env = require('dotenv');


/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */


module.exports = {
	name: "message",
	mixins: [DBMixin("message")],
	settings: {
		fields: ["_id", "chatId", "senderId", "text" , "createdAt", "updatedAt"],
		entityValidator: {} 
	},
	actions: {
		create: {
            method: "POST",
			async handler(ctx) {
				const {chatId, senderId, text} = ctx.params;
                const response = {
                    chatId , senderId , text
                };
                try {
                    const newMessage = await this.adapter.insert(response);
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
                 const messages = await this.adapter.find({query: {chatId: chatId}});
                 return messages;
            } catch (error) {
                 console.log("catch");
                 return error;
            }
				}
		},
				
        clear: {
			async handler (ctx) {
				await this.adapter.clear();
			}
		},
	}
}