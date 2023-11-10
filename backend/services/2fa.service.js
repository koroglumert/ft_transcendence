"use strict"

const qrCode = require ('qrcode');
const { authenticator } = require("otplib");


module.exports = {
	name: "2fa",

	actions : {
		generate: {
			rest: "POST /generate",
			async handler (ctx) {
				try {
					const userId = ctx.params.userId;
					const secret = authenticator.generateSecret();
					const uri = authenticator.keyuri(userId, "FinPongs", secret);
				    const image = await qrCode.toDataURL(uri);
					const setSecret = await ctx.call("users.setSecret", { userId: userId, secret: secret });
					if (setSecret.result.ok)
						return { success: true, data: image };
					else
						return { success:false, data: null};
				  } catch (error) {
					console.error(error);
					return { success: false, error: error.message };
				  }
			},
		},

		verify: {
			rest: "POST /verify",
			async handler(ctx) {
				try {
					const token = ctx.params.token;
					const userId = ctx.params.userId;
					const user = await ctx.call("users.findUser", { userId: userId });
				
					const verified = authenticator.check(token, user.secret);
					if (verified == true)
						await ctx.call("users.update2FactorAuthy", { userId: userId, flag: "true" });
					return { success: true, verified: verified };
				  } catch (error) {
					console.error(error);
					return { success: false , error: error.message };
				  }
			}
		}
	},
}