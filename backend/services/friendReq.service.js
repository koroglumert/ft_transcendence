"use strict"

const DBMixin = require("../mixins/db.mixin")
const { MoleculerClientError,MoleculerErrors } = require("moleculer").Errors;
const env = require("dotenv");
const { default: MongoDbAdapter } = require("moleculer-db-adapter-mongo");
const { stat } = require("fs");
const _ = require('lodash');
env.config();

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */

module.exports = {
		name: "notification",


		mixins: [DBMixin("friendReq")],


		settings: {

			fields: [
				"userIdOne",
				"userIdTwo",
				"createdAt",
				"updateAt",
				"status"
			],

			entityValidator: {
				userIdOne: "string",
				userIdTwo: "string",
				status: "string",
				createdAt: "date",
				updateAt: "date"
			},
		},

		methods: {
			async createReq(ctx) {
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

			async updateReq (reqData) {
				if (reqData.status == "ACTIVE"){
					return { success: true, message: "Friend request is already exists"};
				}
				else if ( reqData.status == "PASSIVE" ) {
					const result = await this.adapter.collection.updateOne(
						{ _id: reqData._id },
						{ $set: { status: "ACTIVE", updatedAt: new Date() } });
					return { success: true, message: "Status updated to ACTIVE"};
				}
			},

			async changeReqStatus(friendData) {
				try {
					if (friendData.status == "PASSIVE"){
						return { success: true, message: "Status is already PASSIVE"};
					}
					const result = await this.adapter.collection.updateOne(
						{ _id: friendData._id },
						{ $set: { status: "PASSIVE", updatedAt: new Date() } });
					return { success: true, message: "Status updated to ACTIVE."};
				} catch (error) {
					return { success: false, message: error.message};
				}
			},
		},
		actions: {
			friendReq: {
				rest: "POST /friendReq",
				//add -> arkadaş ekleme remove->arkadaşlık isteğini geri çekme
				async handler (ctx) {
					const { userIdOne, userIdTwo, status } = ctx.params;
					try {
						const reqData = await this.adapter.findOne({$and: [{ userIdOne: userIdOne, userIdTwo: userIdTwo }] })
						if (status == "remove")
							return this.changeReqStatus(reqData);
						else if (status == "add"){
							if (reqData)
								return this.updateReq(reqData);
							else
								return this.createReq(ctx);
						}
					} catch (error) {
						return { success: false, message: error.message};
					}
				}
			},
			
			acceptReq: {
				rest: "POST /acceptReq",
				async handler (ctx) {
					
					const userIdOne = ctx.params.userIdTwo;
					const userIdTwo = ctx.params.userIdOne;
					const status = ctx.params.status;
					try {
						const reqData = await this.adapter.findOne({$and: [{ userIdOne: userIdOne, userIdTwo: userIdTwo }] })
						if (reqData)
						{
							try {
								if (reqData.status == "ACTIVE"){
									const result = await this.adapter.collection.updateOne(
										{ _id: reqData._id },
										{ $set: { status: "PASSIVE", updatedAt: new Date() } });
										if (status == "accept")
											return ctx.call("friend.handleFriend", {userIdOne: userIdOne, userIdTwo: userIdTwo, status: "add"});
										else if (status == "decline")
											return { success: true, message: "Friend request denied."};
								}
								else{
									return { success: true, message: "Status is PASSIVE"};
								}
							} catch (error) {
								return { success: false, message: error.message};
							}
						}
						else
							return { success: false, message: "Friend request not found!"};
					} catch (error) {
						return { success: false, message: error.message};
					}
				}
			},

			listReq: {
				rest: "POST /listReq",

				async handler (ctx) {
					const userIdOne = ctx.params.userIdOne;
					try {
						const friendData = await this.adapter.find({
							query:{
								$and:[{ userIdTwo: userIdOne }, {status : "ACTIVE"}]
							}
						});
						if (friendData && Array.isArray(friendData)) {

							const otherUserIds = friendData.map(item => (item.userIdOne));
							console.log(otherUserIds);
							const friendsData = await ctx.call("users.findUsers", {userIds: otherUserIds});
							return { success: true, message: "Users are listed", data: friendsData};
						} 
					} catch (error) {
						return { success: false, message: "Users not found", data: null};
					}
				}
			},

			listSearch: {
				rest: "POST /listSearch",
				async handler(ctx) {
					try {
						let userId = ctx.params.userIdOne;
						let allUser = await ctx.call("users.allUsers");
						let blockedUsers = await ctx.call("block.listBlockedYou", { userIdOne: userId });
						let friendUsers = await ctx.call("friend.listFriend", { userIdOne: userId });

						console.log("block", blockedUsers);
						console.log("friend", friendUsers);
	
						const filteredUsers = [];
				
						allUser.forEach(async (user) => {
							const isBlocked = await blockedUsers.data.some((blockedUser) => blockedUser.userIdOne === user.userId);
							const isFriend = await friendUsers.data.some((friendUser) => ((friendUser.userId === user.userId)));
							if (!isBlocked && !isFriend) {
								filteredUsers.push(user);
							}
						});
						return { success: true, message: "Users listed.", data: filteredUsers};
					} catch (error) {
						return { success: false, message: error.message, data: null};
					}
				}
			},

			clear : {
				async handler (ctx) {
					await this.adapter.clear();
				}
			}
		}
}