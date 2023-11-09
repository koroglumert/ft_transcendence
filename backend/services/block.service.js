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
		name: "block",


		mixins: [DBMixin("block")],


		settings: {

			fields: [
				"userIdOne",
				"userIdTwo",
				"createdAt",
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
			async createBlock (ctx) {
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

			async updateBlock (blockData) {
				if (blockData.status == "ACTIVE"){
					return { success: true, message: "User is already blocked."};
				}
				else if ( blockData.status == "PASSIVE" ) {
					const result = await this.adapter.collection.updateOne(
						{ _id: blockData._id },
						{ $set: { status: "ACTIVE", updatedAt: new Date() } });
					return { success: true, message: "Status is updated."};
				}
			},

			async changeFriendStatus(blockData) {
				try {
					if (blockData.status == "PASSIVE"){
						return { success: true, message: "Status is already PASSIVE"};
					}
					const result = await this.adapter.collection.updateOne(
						{ _id: blockData._id },
						{ $set: { status: "PASSIVE", updatedAt: new Date() } });
					return { success: true, message: "Status updated to PASSIVE"};
				} catch (error) {
					return { success: false, message: error.message};
				}
			}
		},

		actions: {
			handleBlock: {
				rest: "POST /handleBlock",

				async handler (ctx) {
					const { userIdOne, userIdTwo, status } = ctx.params;
					try {
						const blockData = await this.adapter.findOne({$and: [{ userIdOne: userIdOne, userIdTwo: userIdTwo }] })
						if (status == "remove")
							return this.changeBlockStatus(blockData);
						else if (status == "add")
						{
							if (blockData){
								return this.updateBlock(blockData);
							}
							else {
								return this.createBlock(ctx);
							}
						}
					} catch (error) {
						return { success: false, error: error.message};
					}
				}
			},

			listBlockedYou: {
				rest: "POST /listBlockedYou",

				async handler (ctx) {
					const userIdOne = ctx.params.userIdOne;
					try {
						const blockData = await this.adapter.find({
							query:{
								$and:[{ userIdTwo: userIdOne }, {status : "ACTIVE"}]
							}
						});
						return { success: true, message: "Users listed.", data: blockData};
					} catch (error) {
						return { success: false, message: "Users not found.", data: null};
					}
				}
			},

			listBlock: {
				rest: "POST /listBlock",

				async handler (ctx) {
					const userIdOne = ctx.params.userIdOne;
					try {
						const blockData = await this.adapter.find({
							query:{
								$and:[{ userIdOne: userIdOne }, {status : "ACTIVE"}]
							}
						});
						if (blockData && Array.isArray(blockData)) {
							const otherUserIds = blockData.map(item => (item.userIdTwo));
							const blocksData = await ctx.call("users.findUsers", {userIds: otherUserIds});
							console.log("otherUser", otherUserIds);
							return { success: true, message: "Users listed", data: blocksData };
						}
					} catch (error) {
						return { success: false, message: "Kullanıcılar bulunamadı", data: null};
					}
				}
			},
			
			
			clear : {
				async handler (ctx) {
					try {
						await this.adapter.clear();
						return ({ success: true });
					} catch (error) {
						return ({ success: false })						
					}
				}
			}
		},
}