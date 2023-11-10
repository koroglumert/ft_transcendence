"use strict";

const { ServiceBroker, Context } = require("moleculer");
const TestService = require("../../services/chat.service");

describe("Test 'chat' service", () => {
    describe("Test actions", () => {
        const broker = new ServiceBroker({ logger: false });
        const service = broker.createService(TestService);

        beforeAll(() => broker.start());
        afterAll(() => broker.stop());

        // error dönüş değeri
        const errorResponse = {
            message: "eksik veya fazla parametre"
        }

        describe("Test 'chat.create'", () => {

            // eksik parametre testi
            it("chat created", async () => {
                const res = await broker.call("chat.create", {
                    firstId: "131351",
                });
                expect(res).toEqual(errorResponse)
            });

            // fazla parametre testi
            it("chat created", async () => {
                const res = await broker.call("chat.create", {
                    firstId: "131351",
                    firtId: "131351",
                    fistId: "131351",
                });
                expect(res).toEqual(errorResponse)
            });

            // firstId ve secondId yanlış yazılma testi
            it("chat created", async () => {
                const res = await broker.call("chat.create", {
                    firsstId: "131351",
                    secoondId: "131419",
                });
                expect(res).toEqual(errorResponse)
            });

            // başarılı chat oluşturma testi
            it("chat created", async () => {
                const res = await broker.call("chat.create", {
                    firstId: "131351",
                    secondId: "131419",
                });
                expect(res).toEqual({
                    _id: expect.any(String),
                    createdAt: expect.any(Date),
                    firstId: "131351",
                    secondId: "131419",
                    updatedAt: expect.any(Date)
                })
            });

            // başarılı chat oluşturma testi 2
            it("chat created", async () => {
                const res = await broker.call("chat.create", {
                    firstId: "131051",
                    secondId: "131418",
                });
                expect(res).toEqual({
                    _id: expect.any(String),
                    createdAt: expect.any(Date),
                    firstId: "131051",
                    secondId: "131418",
                    updatedAt: expect.any(Date)
                })
            });

            // başarılı chat oluşturma testi 3
            it("chat created", async () => {
                const res = await broker.call("chat.create", {
                    firstId: "131051",
                    secondId: "131419",
                });
                expect(res).toEqual({
                    _id: expect.any(String),
                    createdAt: expect.any(Date),
                    firstId: "131051",
                    secondId: "131419",
                    updatedAt: expect.any(Date)
                })
            });
        });

        describe("Test 'chat.get'", () => {

            // verilen id ye ait mesajları döndüğünün kontrol edildiği test
            it("chat get", async () => {
                const res = await broker.call("chat.get", { id: "131051" });
                expect(res).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        _id: expect.any(String),
                        createdAt: expect.any(Date),
                        firstId: "131051",
                        secondId: "131419",
                        updatedAt: expect.any(Date)
                    }),
                    expect.objectContaining({
                        _id: expect.any(String),
                        createdAt: expect.any(Date),
                        firstId: "131051",
                        secondId: "131418",
                        updatedAt: expect.any(Date)
                    })
                ]));
            });

            // verilen id ye ait mesajları döndüğünün kontrol edildiği test 2
            it("chat get", async () => {
                const res = await broker.call("chat.get", { id: "131351" });
                expect(res).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        _id: expect.any(String),
                        createdAt: expect.any(Date),
                        firstId: "131351",
                        secondId: "131419",
                        updatedAt: expect.any(Date)
                    }),
                ]));
            });

            // eksik parametre testi
            it("chat get", async () => {
                const res = await broker.call("chat.get", {
                    id: "131351",
                    id2: "131351"
                });
                console.log(res);
                expect(res).toEqual(errorResponse)
            });
        });
    });
});