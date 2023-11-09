"use strict";
const DBMixin = require("../mixins/db.mixin")

const env = require('dotenv');

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */

module.exports = {
	name: "lobby",

	mixins: [DBMixin("lobby")],

	settings: {

		fields: [
			"userId",
			"socketId",
		],

		entityValidator: {
			userId: "string",
			socketId: "string",
		},
	},

	actions: {
		add: {
			rest: "POST /add",
			async handler (ctx) {
				const user = {
					userId : ctx.params.userId,
					socketId: ctx.params.socketId,
				}
				try {
					const thisUser = await this.adapter.find({query: {userId: ctx.params.userId}});
					console.log("THIS USER", thisUser);
					console.log("LENGTH: ", thisUser.length);
					//if (thisUser.length == 0){
						const addedUser = await this.adapter.insert(user);
						console.log("ADDED USER: ", addedUser);
					//}
					const users = await this.adapter.find();
					console.log("ALL USERS:", users);
					return users;
				} catch (error) {
					return { success: false, message: "User lobbye eklenemedi"};
				}
			}
		},
		
		get: {
			method: "GET",
		},

		delete: {
			rest: "POST /delete",
			async handler (ctx) {
				const userIdOne = ctx.params.userIdOne;
				const userIdTwo = ctx.params.userIdTwo;
				const resultOne = await this.adapter.removeMany({userId: userIdOne});
				const resultTwo = await this.adapter.removeMany({userId: userIdTwo});
				return resultOne;
			}
		},

		clear: {
			async handler(ctx) {
					await this.adapter.clear();
			}
		},
	},
}