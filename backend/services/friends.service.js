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
		name: "friends",


		mixins: [DBMixin("friends")],


		settings: {

			fields: [
				"userIdOne",
				"userIdTwo",
				"status"
			],

			entityValidator: {
				userIdOne: "string",
				userIdTwo: "string",
				status: "number"
			},
		},

		methods : {

			async updateFriends(friendData, status) {
				if (status == "add")
					var update = { $set: { status: 3 } }; 
				else if (status == "block")
					var update = { $set: { status: 2 } }; 
				else if (status == "unblock")
					var update = { $set: { status: 0 } };
				try {
					const result = await this.adapter.collection.updateMany(friendData, update);
					if (result.modifiedCount === 1) {
						console.log("Status güncellendi.");
					} else {
						console.log("Status güncellenmedi. { status durumunda bir değişiklik yok }");
					}
					return result.modifiedCount;
				} catch (error) {
					console.error("Hata!", error);
					throw error;
				}
				//return 0 => zaten işlem yapılmış. Örn: add butonuna zaten basılmış ve bir arkadaşlık isteği mevcut!
			},

			async createFriends (entity, status){
				try {
					if (status == "add")
						entity.status = 3;
					else if (status == "block")
						entity.status = 2;
					else if (status == "unblock")
						entity.status = 0;
					const result = await this.adapter.insert(entity);
					console.log(`Friends status eklendi ${entity}`);
					return 1;
				} catch (error) {
					console.log("Friends status ekleme başarısız!");
					return 0;
				}
			},
		},

		actions: {
			friendsData: {
				rest: "POST /friendsData",
				async handler (ctx){
					const findById = ctx.params.userId;
					try {
						const response = await this.adapter.find({
							query: { 
								$and: [
										{ userIdOne: findById },
										{ status: 1 }
									]
								}
							}
						);
						return response;
					} catch (error) {
						console.error("Hata", error);
						throw error;
					}
				}
			},

			blocksData: {
				rest: "POST /blocksData",

				async handler (ctx){
					console.log(ctx.params);
					const findById = ctx.params.userId;
					try {
						const response = await this.adapter.find({
								query: {
									$and: [
										{ userIdOne: findById },
										{ status: 2 }
									]
								}
							}
						);
						return response;

					} catch (error) {
						console.error("Hata!", error);
						throw error;
					}
				}
			},

			notifications: {
				rest: "POST /notifications",

				async handler (ctx){
					const findById = ctx.params.userId;
					try {
						const response = await this.adapter.find({
							query: {
								$and: [
									{ userIdTwo: findById },
									{ status: 3 }
								]
							}
						});
						return response;
						
					} catch (error) {
						console.error("Hata!", error);
						throw error;
					}
				}
			},

			acceptReq: {
				rest: "POST /acceptReq",
				async handler(ctx) {
					const { userIdOne, userIdTwo } = ctx.params;
					try {
						const friendData = await this.adapter.collection.findOne({
							$and: [
								{ userIdOne: userIdOne },
								{ userIdTwo: userIdTwo },
								{ status : 3 }
							]
						});
						if (friendData)
						{
							const filter = friendData;
							const update = {
								$set: { status: 1}
							};
							const updatedUser = await this.adapter.collection.updateOne(filter, update);
							if (updatedUser.result.ok == 1) {
								console.log("Status güncellendi.");
								return 1;
							} else
								console.log("Status güncellenemedi.", updatedUser.result);
						}
						else {
							console.log("Kullanıcıların bir ilişkisi yok.");
						}
					} catch (error) {
						console.log("Veri tabanında değişiklik yapılamadı.", error.message);
					}
					return 0;
				}
			},

			friendReq: {
				rest : "POST /friendReq",
				
				async handler(ctx){
					const entity = {
						userIdOne : ctx.params.userIdOne,
						userIdTwo : ctx.params.userIdTwo,
						status : null
					};
					try {
						const friendData = await this.adapter.findOne({
								$and: [
									{ userIdOne: entity.userIdOne },
									{ userIdTwo: entity.userIdTwo }
								]
							});
						if (friendData)
							return this.updateFriends(friendData, ctx.params.status);
						else
							return this.createFriends(entity, ctx.params.status);
					} catch (error) {
						console.error("Hata!", error);
						throw error;
					}
			},

			clear: {
				async handler (ctx) {
					await this.adapter.clear();
				}
			},
		},
	}
}