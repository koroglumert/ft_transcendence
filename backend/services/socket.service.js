const SocketIOService = require("moleculer-io");

let onlineUsers = [];

module.exports = {
	name: "remote",
	mixins: [SocketIOService],
	io: { //Moleculer Web-Socket Module
		namespaces: {
			'/': {
				events: {
					'call': {
						whitelist: [
							'math.*',
						],
						onBeforeCall: async function (ctx, socket, action, params, callOptions) { //before hook
							console.log('before hook:', params)
						},
						onAfterCall: async function (ctx, socket, res) { //after hook
							console.log('after hook', res)
							// res: The respose data.
						},
					},
				},
			},
		},
	},

	settings: {
		port: 8071,
		cors: {
			origin: "http://localhost:3000",  // Tüm origin'lere izin vermek için "*"
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"], // İzin verilen HTTP yöntemleri
			allowedHeaders: [], // İzin verilen başlıklar
			exposedHeaders: [], // Cevap başlıkları
			maxAge: 3600, // İzinin önbellekleme süresi (saniye cinsinden)
			credentials: true
		},
	},

	actions: {
		addNewUser(ctx) {
			const userId = ctx.params.userId;
			!onlineUsers.some((user) => user.userId === userId) &&
				onlineUsers.push({
					userId,
					//socketId: socket.id,
				});
			console.log("onlineUsers", onlineUsers);
			return ("hello");
		}
	}
}