"use strict";

const axios = require("axios");
const env = require('dotenv');
env.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.FRONT_URL;
const AUTH_URL = 'https://api.intra.42.fr/oauth/authorize';
const TOKEN_URL = 'https://api.intra.42.fr/oauth/token';
const SCOPES = 'public';

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */



const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15);
};
const STATE = generateRandomState();

module.exports = {
	
	name: "42api",
  	actions: {
    auth: {
      rest: "GET /auth",

      async handler(ctx) {
        const authUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&state=${STATE}&response_type=code`;
				
      	ctx.meta.$statusCode = 302;
        ctx.meta.$responseHeaders = { Location: authUrl };
        return "";
      },
    },
		data: {
			rest: "GET /data",
			hooks: {

			},
			async handler(ctx){

				const { code, state } = ctx.params;
				if (state !== STATE) {
					ctx.meta.$statusCode = 302;
					console.log("STATE ESLESMEDI");
					return "State eslesmedi";
				}
				const tokenParams = new URLSearchParams();
				 tokenParams.append('grant_type', 'authorization_code');
				 tokenParams.append('client_id', CLIENT_ID);
				 tokenParams.append('client_secret', CLIENT_SECRET);
				 tokenParams.append('redirect_uri', REDIRECT_URI);
				 tokenParams.append('code', code);
				
				try {
					const tokenResponse = await axios.post(TOKEN_URL, tokenParams);
				   const accessToken = tokenResponse.data.access_token;

				   const apiResponse = await axios.get('https://api.intra.42.fr/v2/me', {
					 headers: {
					   Authorization: `Bearer ${accessToken}`,
				  },
				});
					let dataRes = {
						userId : String(apiResponse.data.id),
						name: apiResponse.data.login,
						email: apiResponse.data.email,
						profilePicture: apiResponse.data.image.link
					};
				const let1 = await ctx.call("users.register", { user: dataRes });
    			return (let1);
				} catch (error) {
					return 0;
				}
			},
		},
  },
}