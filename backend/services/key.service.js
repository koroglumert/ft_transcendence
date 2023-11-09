"use strict";
const DBMixin = require("../mixins/db.mixin")

const env = require('dotenv');

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */

module.exports = {
	name: "key",

	actions: {
		up: {
			rest: "POST /up",
			async handler(ctx){
				const matchId = ctx.params.matchId;
				const racket = ctx.params.racket;
				const pos = ctx.params.pos;
				console.log(`${matchId}UP`, racket);
				ctx.call('io.sendMove', {matchId, matchId, direction: "UP", pos: pos, racket: racket});
				return "UP";
			}
		},

		down: {
			rest: "POST /down",
			async handler(ctx){
				const matchId = ctx.params.matchId;
				const racket = ctx.params.racket;
				const pos = ctx.params.pos;
				console.log(`${matchId}DOWN`, racket);
				ctx.call('io.sendMove', {matchId, matchId, direction: "DOWN", pos: pos, racket: racket});
				return "DOWN";
			}
		},

		move: {
			rest: "POST /move",
			async handler(ctx){
				const matchId = ctx.params.matchId;
				const racket = ctx.params.racket;
				const pos = ctx.params.pos;
				console.log(`${matchId}MOVE`, racket);
				ctx.call('io.sendMove', {matchId, matchId, pos: pos, racket: racket});
				return "MOVE";
			}
		}

	},

}