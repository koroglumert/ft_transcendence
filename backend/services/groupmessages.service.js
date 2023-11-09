"use strict"

const DBMixin = require("../mixins/db.mixin")

module.exports = {
    name: "groupmessages",
    mixins: [DBMixin("groupMessages")],
    settings: {
        fields: ["_id", "groupId", "senderId", "text", "createdAt", "updatedAt"],
        entityValidator: {
            groupName: { type: "string", min: 5 },
            password: { type: "string", min: 3, optional: true },
        }
    },
    actions: {
        create: {
            method: "POST",
            async handler(ctx) {
                const { groupId, senderId, text } = ctx.params;
                ctx.params.createdAt = new Date();
                ctx.params.updatedAt = new Date();
                const created = ctx.params.createdAt;
                const updated = ctx.params.updatedAt;
                const response = {
                    groupId, senderId, text, created, updated
                };
                try {
                    const newMessage = await this.adapter.insert(response);
                    await ctx.call('io.sendGroupMessages', {groupId: groupId, text: text});
                    return newMessage;
                } catch (error) {
                    return error;
                }
            }
        },
        get: {
            method: "GET",
            async handler(ctx) {
                const groupId = ctx.params.id;
                try {
                    const messages = await this.adapter.find({ query: { groupId: groupId } });
                    return messages;
                } catch (error) {
                    console.log("catch");
                    return error;
                }
            }
        },
        clear: {
            async handler(ctx) {
                await this.adapter.clear();
            }
        },
    }
}