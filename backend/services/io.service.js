"use strict";

const env = require('dotenv');
const SocketIOService = require("moleculer-io");

env.config();
const users = [];

module.exports = {

	name: "io",
	mixins: [SocketIOService],

	settings: {
		port: 4000,
		cors: {
			origin: process.env.FRONT_URL,  // Tüm origin'lere izin vermek için "*"
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"], // İzin verilen HTTP yöntemleri
			allowedHeaders: [], // İzin verilen başlıklar
			exposedHeaders: [], // Cevap başlıkları
			maxAge: 3600, // İzinin önbellekleme süresi (saniye cinsinden)
			credentials: true
		},
	},

	actions: {

		async sendAllMessages(ctx){
			const {chatId, firstId, secondId, text} = ctx.params;

			const response = await ctx.call("message.get", {id: chatId});
			this.io.emit(`${chatId}`, response);
		},

		async sendGroupMessages(ctx){
			const {groupId, text} = ctx.params;

			const response = await ctx.call('groupmessages.get', {id: groupId});
			this.io.emit(`${groupId}`, response);
		},

		async setLinkedPeople(ctx){
			const {socketId, userId, chatId} = ctx.params;
			const user = {
				userId: userId,
				socketId: socketId,
				chatId: chatId,
			};

			const foundUsers = users.find(user => user.userId === userId);
			if (foundUsers === undefined)
				users.push(user);
			else{
				const index = users.findIndex(user => user.userId === userId);
				users[index].chatId = chatId;
			}
		},

		async getLinkedPeople(){
			this.broker.logger.info("USERS: ", users);
			return users;
		},

		async linkGamers(ctx){
			const matchId = ctx.params.matchId;
			this.io.emit(`${matchId}`, {up: true, down: false});
		},

		async sendMatch(ctx){
			const match = ctx.params.match;
			this.io.emit(`${match.userIdOne}`, {match: match});
			this.io.emit(`${match.userIdTwo}`, {match: match});
		},

		async sendMove(ctx){
			const matchId = ctx.params.matchId;
			const direction = ctx.params.direction;
			const pos = ctx.params.pos;
			const racket = ctx.params.racket;
			this.io.emit(`${matchId}MOVE`, {pos, pos, racket: racket});
		}
	},

};