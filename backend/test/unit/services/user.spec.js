"use strict";
const { expect } = require("chai");
const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const UserService = require("../../../services/user.service.js");

describe("Test 'users' service", () => {
    let broker;

    before(() => {
        broker = new ServiceBroker({ logger: false });
        broker.createService(UserService);
        return broker.start();
    });

    after(() => {
        return broker.stop();
    });

    describe("Test 'users.findUser' action", () => {
        it("should return user data for a specific userId", async () => {
            const res = await broker.call("users.findUser", { userId: "137039" });
            expect(res.data).to.eql(        {
				"_id": "6538d515475b542117704443",
				"userId": "137039",
				"name": "spalta",
				"email": "spalta@student.42istanbul.com.tr",
				"profilePicture": "https://cdn.intra.42.fr/users/383d05f227d03767e25e95aacc0e811e/spalta.jpg",
				"wins": 0,
				"rank": 0,
				"losses": 0,
				"currentStatus": 1,
				"twoFactorAuthy": false,
				"secret": "EBXX4PQLC5CBWRR4"
			});
        });
    });
});
