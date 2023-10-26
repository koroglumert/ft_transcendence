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
			"match_id",
			"winner_id",
			"looser_id",
			"score",
		],

		entityValidator: {

		}

	},

		actions: {

			addMatch: {

				/*rest: {
					method: "POST",
					path: "/addMatch",
				},*/

				params: {
					//winner_id: {type: "number"},
					//looser_id: {type: "number"},
					//score: {type: "number"},
				},

				async handler(ctx){

					let max = 9999;
					let min = 1000;

					let match_id = Math.floor(Math.random() * (max - min + 1)) + min;
					const winner_id = Math.floor(Math.random() * (max - min + 1)) + min;
					const looser_id = Math.floor(Math.random() * (max - min + 1)) + min;
					const score = Math.floor(Math.random() * (max - min + 1)) + min;
					
					let result = await this.adapter.find({query: {match_id: match_id}});
					console.log("RESULT_SIZE -> ", result.length);
					if (result.length > 0){
						//console.log("match_id cannot be higher than zero", match_id);
						return match_id;
					}

					let matches = await this.adapter.find();
					console.log("MATCHES -> ", matches);

					let match = {
						match_id: match_id,
						winner_id: winner_id,
						looser_id: looser_id,
						score: score,
					};

					const newMatch = await this.adapter.insert(match);

					console.log(newMatch);
					return newMatch;
				},
			},

			count: {
				async handler(){
	
					const number = this.adapter.count();
					return number;
				}
			},

			clear: {
				async handler(){
					let result = await this.adapter.clear();
					return result;
				},
			},

			findMatch: {
				async handler(){
					//Front-end ile birleştirilirken eklemeler yapılacak!!!

					const user_id = 6754; //Front-end'ten gelecek!!!

					const result = await this.adapter.find({query: {winner_id: user_id}});
					return result;
				},

			},

			//Veri tabanından bir objeyi update etme
			updateMatch: {
				async handler(){

					const user_id = 6754;
					const result = await this.adapter.findOne({match_id: user_id});
					console.log("RESULT: ", result);

					const res = await this.adapter.updateById(result._id, {$set: {looser_id: 500}});
					return res;
				}
			},
		},
}