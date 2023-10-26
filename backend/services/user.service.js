"use strict"

const DBMixin = require("../mixins/db.mixin")
const { MoleculerClientError,MoleculerErrors } = require("moleculer").Errors;
const env = require("dotenv");
const { default: MongoDbAdapter } = require("moleculer-db-adapter-mongo");
const fs = require("fs");
const url = require("url");
const sharp = require("sharp");
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
						console.log("Veri tabanında kayıtlı!");
						return userFind;
					}
					else {
						entity.wins = 0;
						entity.rank = 0;
						entity.losses = 0;
						entity.currentStatus = 1;
						entity.twoFactorAuthy = false;
						entity.userId = entity.userId;
						const newUser = await this.adapter.insert(entity)
						console.log(`Kullanıcı veri tabanına eklendi. ${newUser}`);
						return newUser;
					}
				} catch (error) {
					console.log(`Kullanıcı veri tabanına eklenemedi! ${error.message}`);
				}
				return 0;
			}
		},

		clear: {
			async handler (ctx) {
				await this.adapter.clear();
			}
		},

		find: {
			rest: "GET /find/:userId",
			// chat servisinde kullanılmak üzere eklendi. Kaldırılacak!
			async handler(ctx){
				const findId = ctx.params.userId
				const response = await this.adapter.findOne({userId: findId});
				if(!response)
					return {message: "Kullanıcı bulunamadı!"};
				return response;
			}
		},

		allUsers: {
			rest: "GET /allUsers",
			async handler(ctx) {
				//istenilen verilerin gönderilmesi gerekiyor. Şu an tüm veri gönderiliyor
				try {
					const users = await this.adapter.find({})
					const res = users.map(user => [user.name, user.profilePicture, user.userId]);
					return users;
				} catch (error) {
					console.log("Kullanıcılar gönderilemedi.", error.message);
					return 0;
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
							console.log("İsim güncellendi.");
							return 1;
						}
						else
							console.log("İsim güncellenemedi.", result);
					}
					else
						console.log("Değişiklik yapılacak kullanıcı bulunamadı.");
				} catch (error) {
					console.log("Veri tabanında değişiklik yapılamadı.", error.message);
				}
				return 0;
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
							console.log("Profil fotoğrafı güncellendi.");
							return 1;
						} else
							console.log("Profil fotoğrafı güncellenemedi.", updatedUser.result);
					}
					else
						console.log("Değişiklik yapılacak kullanıcı bulunamadı.");
				} catch (error) {
					console.log("Veri tabanında değişiklik yapılamadı.", error.message);
				}
				return 0;
			  }			  
				/* byte array olarak pp güncelleme !
				const userId = ctx.params.userId;
				const fileUri = ctx.params.filePath;
				const user = await this.adapter.findOne({userId: userId});
				console.log("user", user);
				//Alınan pathi işletim sistemine uygun bir path haline getirir.
				const filePath = url.fileURLToPath(fileUri);
				const fileStream = fs.createReadStream(filePath);
				fileStream.on('data', async (data) => {
					const update = {$set: { binaryPicture: data, updatePicture: true } };
					const result = await this.adapter.collection.updateOne(user, update);
				});
					fileStream.on('end', () => {
					return 1;
				});
				*/
		},
	},
}