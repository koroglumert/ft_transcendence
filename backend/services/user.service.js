"use strict"

const DBMixin = require("../mixins/db.mixin")
const { MoleculerClientError,MoleculerErrors } = require("moleculer").Errors;
const env = require("dotenv");
const { default: MongoDbAdapter } = require("moleculer-db-adapter-mongo");
const fs = require("fs");
const url = require("url");
const sharp = require("sharp");
const { update } = require("lodash");
env.config();

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */

module.exports = {
	name: "users",


	mixins: [DBMixin("users")],


	settings: {

		fields: [
			"userId",
			"name",
			"profilePicture",

			"rank",
			"wins",
			"losses",

			"currentStatus",

			"twoFactorAuthy",
			"secret"
		],

		entityValidator: {
			userId: "string",
			name: "string",
			profilePicture: "string",

			rank: "number",
			wins: "number",
			losses: "number",

			currentStatus: "string",
			twoFactorAuthy: "boolean",
			secret: "string"
		},

	},

	actions: {
		register: {
            params: {
				user: { type: "object" }
			},
			async handler(ctx){
				let entity = ctx.params.user;
				try {
					const userFind = await this.adapter.findOne({userId: entity.userId});
					if (userFind)
					{
						return (userFind);
					}
					else {
						entity.wins = 0;
						entity.rank = 0;
						entity.losses = 0;
						entity.currentStatus = 1;
						entity.twoFactorAuthy = false;
						entity.userId = entity.userId;
						entity.secret = null;
						const newUser = await this.adapter.insert(entity)
						return (newUser);
					}
				} catch (error) {
					return { success: false, message: error.message};
				}
			}
		},

		clear: {
			async handler (ctx) {
				try {
					await this.adapter.clear();
					return { success: true};
				} catch (error) {
					return { success: false };
				}
			}
		},

		find: {
			rest: "GET /find/:userId",
			// chat servisinde kullanılmak üzere eklendi. Kaldırılacak!
			async handler(ctx){
				const findId = ctx.params.userId
				const response = await this.adapter.findOne({userId: findId});
				if(!response)
					return {success: false, message: "User not found"};
				return response;
			}
		},

		allUsers: {
			rest: "GET /allUsers",
			async handler(ctx) {
				try {
					const users = await this.adapter.find({})
					return (users);
				} catch (error) {
					return { success: false, message: error.message};
				}
			}
		},

		findUser: {
			async handler (ctx) {
				const userId = ctx.params.userId;
				try {
					const user = await this.adapter.collection.findOne({ userId: userId });
					if (user) {
						console.log("User is found.", user);
					}
					else {
						console.log("User is not found.", user);
					}
					return user;
				} catch (error) {
					return { success: false , message: error.message};
				}
			}
		},

		findUsers: {
			rest: "POST /findUsers",
			async handler(ctx) {
				const userIds = ctx.params.userIds.map(item => item);
				try {
					const users = await this.adapter.find({
						query: {
							userId: { $in: userIds }
						}
					});
					if (users && users.length > 0) {
						return (users);
					} else {
						return (users);
					}
				} catch (error) {
					return { success: false, message: error.message};
				}
			}
		},

		updateName: {
			rest: "POST /updateName",
			async handler (ctx) {
				const {newName, userId} = ctx.params;
				try {
					const filter = await this.adapter.findOne( { userId: userId } );
					if (filter)
					{
						const update = { $set: { name: newName } };
						const updatedUser = await this.adapter.collection.updateOne(filter, update);
						if (updatedUser.result.ok) {
							console.log("Username updated.");
							return { success: true, message: "Username could not be updated."};
						}
						else
							return { success: false, message: "Username could not be updated."};
					}
					else
						return { success: false, message: "No user found to update."};
				} catch (error) {
					return { success: false, message: error.message};
				}
			}
		},

		updatePicture: {
			rest: "POST /updatePicture",
			async handler(ctx) {
				const { newPicture, userId } = ctx.params;
				try {
					const filter = await this.adapter.findOne( { userId: userId } );
					if (filter) {
						const update = { 
							$set: { profilePicture: newPicture } 
						};
						const updatedUser = await this.adapter.collection.updateOne(filter, update);
						if (updatedUser.result.ok == 1) {
							console.log("Profile picture updated.");
							return {success: true, message: "Profile picture updated."};
						} else
							return {success: false, message: "Profile picture could not be updated."};
					}
					else
						return {success: false, message: "No user found to update."};
				} catch (error) {
					return {success: false, message: error.message};
				}
			}
		},

		update2FactorAuthy: {
			async handler (ctx) {
				try {
					const filter = await this.adapter.findOne({ userId: ctx.params.userId });
					if (filter){
						if (ctx.params.flag == "true")
						{
							const update = {
								$set: { twoFactorAuthy: true }
							}
						}
						else if (ctx.params.flag == "false"){
							const update = {
								$set: { twoFactorAuthy: false }
							}
						}
						const updatedUser = await this.adapter.collection.updateOne(filter, update);
						if (updatedUser.result.ok == 1) {
							return (updatedUser);
						} else
							return (updatedUser);
					}
				} catch (error) {
					return {success: false, message: error.message, data: null};
				}
			}
		},

		setSecret: {
			async handler (ctx) {
				try {
					const userId = ctx.params.userId;
					const secret = ctx.params.secret;
					const filter = await this.adapter.findOne( { userId: userId } );
					if (filter){
						const update = {
							$set: { secret: secret}
						};
						const updatedUser = await this.adapter.collection.updateOne(filter, update);
						if (updatedUser.result.ok == 1) {
							console.log("Secret key is updated.");
							return updatedUser;
						} else
							console.log("Secret key could not be updated.", updatedUser.result);
						return {success: false, message: "Secret key could not be updated.", data: null};
					} else {
						return {success: false, message: "No user found to update.", data: null};
					}
				} catch (error) {
					console.log("Secret key could not be updated.");
					return { success: false, message: error.message, data: null };
				}
			}
		},
	}
}