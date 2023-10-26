"use strict";

const axios = require("axios");

const CLIENT_ID = 'u-s4t2ud-f57317033b8be51b1032fa71aaaf44e39b8d3dbdb62b9e73e96d8fbb683c5819';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000';
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