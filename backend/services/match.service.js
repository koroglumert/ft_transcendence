"use strict";
const DBMixin = require("../mixins/db.mixin")

const env = require('dotenv');

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */

module.exports = {
	name: "match",

	mixins: [DBMixin("matches")],

	settings: {

		fields: [
			"userIdOne",
			"userIdTwo",

			"createdAt",
			"updateAt",

			"scoreOne",
			"scoreTwo",

			"finishStatus"
		],

		entityValidator: {

		},
	},

	actions: {
		add: {
			rest: "POST /add",

			async handler(ctx){
				const {userIdOne, userIdTwo} = ctx.params;
				const match = {
					userIdOne: userIdOne,
					userIdTwo: userIdTwo,
					scoreOne: 0,
					scoreTwo: 0,
					createdAt: new Date().getTime(),
				};
				const result = await this.adapter.insert(match);
				await ctx.call('lobby.delete', {userIdOne: userIdOne, userIdTwo: userIdTwo});
				await ctx.call('match.sendData', {match: result});
				return result;
			},
		},

		get: {
			async handler(ctx){
				const matchId = ctx.params.matchId;
				const response = this.adapter.findOne({matchId: matchId});
				return response;
			},
		},

		sendData: {
			async handler(ctx){
				const match = ctx.params.match;
				console.log("SENDMATCHID", match);
				await ctx.call('io.sendMatch', {match: match});
			},
		},

		updateScore: {
			async handler(ctx){
				const matchId = ctx.params.matchId;
				const player = ctx.params.player;
				let match = await this.adapter.findById(matchId);
				console.log("foundMatch", match);
				const result = await ctx.call('match.update', {id: matchId, scoreOne: 10});
				console.log("updatedMatch", result);
				await ctx.call('io.sendMatch', {match: result});
			},
		},

		clear: {
			async handler(ctx) {
					await this.adapter.clear();
			}
		},

	},
}