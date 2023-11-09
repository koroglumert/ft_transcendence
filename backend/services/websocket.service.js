"use strict"

const SocketIOService = require("moleculer-io");
const env = require("dotenv");


env.config();


/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 * @typedef {import('moleculer-web').ApiSettingsSchema} ApiSettingsSchema API Setting Schema
 */

module.exports = {

	name: "websocket",

	mixins: [SocketIOService],

	actions: {

		processMessage: {

			async handler(ctx){
	
				const { id } = ctx.params;
				console.log("ID: ", id);
	
				this.io.of('/').emit('message', { id: id });

				return {text: text, sender: "SUNUCU"};
			}
		},

	}
}