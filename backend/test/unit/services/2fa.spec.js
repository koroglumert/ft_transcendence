"use strict";

const ServiceBroker = require("moleculer").ServiceBroker;
const TestService = require("../../../services/2fa.service");
const TestService = require("../../../services/users.service"); 

describe("Test '2fa' service", () => {
	let broker;

	beforeAll(() => {
		broker = new ServiceBroker({ logger: false });
		broker.createService(TestService);
		return broker.start();
	});

	afterAll(() => broker.stop());

	describe("Test 'generate' action", () => {
		it("should generate 2FA secret and return a QR code", async () => {
			const ctx = {
				params: {
					userId: "131051"
				},
				call: jest.fn(() => ({ result: { ok: true } })) // Mocked users.setSecret call
			};

			const res = await broker.call("2fa.generate", ctx);
			expect(res).toEqual(
				expect.objectContaining({ success: true, data: expect.any(String) })
			);
		});
	});

	describe("Test 'verify' action", () => {
		it("should verify the provided token", async () => {
			const ctx = {
				params: {
					token: "generatedToken",
					userId: "uniqueUserID"
				},
				call: jest.fn(() => ({ secret: "generatedSecret" })) // Mocked users.findUser call
			};

			const res = await broker.call("2fa.verify", ctx);
			expect(res).toEqual(expect.objectContaining({ success: true, verified: expect.any(Boolean) }));
		});
	});
});
