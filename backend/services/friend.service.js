"use strict"

const DBMixin = require("../mixins/db.mixin")
const { MoleculerClientError,MoleculerErrors } = require("moleculer").Errors;
const env = require("dotenv");
const { default: MongoDbAdapter } = require("moleculer-db-adapter-mongo");
env.config();

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */

module.exports = {
		name: "friend",


		mixins: [DBMixin("friend")],


		settings: {

			fields: [
				"userIdOne",
				"userIdTwo",
				"createdAt",
				"updatedAt",
				"status"
			],

			entityValidator: {
				userIdOne: "string",
				userIdTwo: "string",
				status: "string",
				createdAt: "date",
				updatedAt: "date"
			},
		},

		methods: {
			async createFriend (ctx) {
				const entity = {
					userIdOne: ctx.params.userIdOne,
					userIdTwo: ctx.params.userIdTwo,
					status: "ACTIVE",
					createdAt: new Date(),
					updatedAt: new Date()
				}
				try {
					const result = await this.adapter.insert(entity);
					console.log("Data added. Added ID:", result._id);
					return { success: true, message: "Data added."};
				} catch (error) {
					return { success: false, message: error.message};
				}
			},

			async updateFriend (friendData) {
				if (friendData.status == "ACTIVE"){
					return { success: true, message: "User is already a friend."};
				}
				else if ( friendData.status == "PASSIVE" ) {
					const result = await this.adapter.collection.updateOne(
						{ _id: friendData._id },
						{ $set: { status: "ACTIVE", updatedAt: new Date() } });
					return { success: true, message: "Status updated to ACTIVE"};
				}
			},

			async changeFriendStatus(friendData) {
				try {
					if (friendData.status == "PASSIVE"){
						return { success: true, message: "User is already a friend."};
					}
					const result = await this.adapter.collection.updateOne(
						{ _id: friendData._id },
						{ $set: { status: "PASSIVE", updatedAt: new Date() } });
					return { success: true, message: "Status updated to PASSIVE."};
				} catch (error) {
					return { success: false, message: error.message};
				}
			}
		},

		actions: {
			handleFriend: {
				rest: "POST /handleFriend",

				async handler (ctx) {
					const { userIdOne, userIdTwo, status } = ctx.params;
					try {
						const friendData = await this.adapter.findOne({
						$or: [
							{ userIdOne: userIdOne, userIdTwo: userIdTwo },
							{ userIdOne: userIdTwo, userIdTwo: userIdOne }]});
						if (status == "remove")
							return this.changeFriendStatus(friendData);
						else if (status == "add"){
							if (friendData)
								return this.updateFriend(friendData);
							else
								return this.createFriend(ctx);
						}
					} catch (error) {
						return { success: false, message: error.message};
					}
				}
			},

			listFriend: {
				rest: "POST /listFriend",

				async handler(ctx) {
					const userIdOne = ctx.params.userIdOne;
				
					try {
						const friendData = await this.adapter.find({
							query: {
								$and: [
									{
										$or: [
											{ userIdOne: userIdOne },
											{ userIdTwo: userIdOne }
										]
									},
									{ status: "ACTIVE" }
								]
							}
						});
						if (friendData && Array.isArray(friendData)) {
							const otherUserIds = friendData.map(item => (item.userIdOne === userIdOne ? item.userIdTwo : item.userIdOne));
							const friendsData = await ctx.call("users.findUsers", {userIds: otherUserIds});
							return { success: true, message: "Friend users are listed.", data: friendsData };
						} else {
							return { success: false , message: "Frienddata is not an array!"};
						}
					} catch (error) {
						return { success: false, message: error.message, data: null };
					}
				}
			},

			clear : {
				async handler (ctx) {
					try {
						await this.adapter.clear();
						return { success: true};
					} catch (error) {
						return ({ success: false });
					}
				}
			}
		}
}