"use strict"

const DBMixin = require("../mixins/db.mixin");
const bcrypt = require("bcryptjs");

module.exports = {
    name: "groupmembers",
    mixins: [DBMixin("groupMembers")],
    settings: {
        fields: ["_id", "groupId", "userId", "groupName", "password", "createdAt", "updatedAt"],
        entityValidator: {}
    },
    actions: {
        create: {
            method: "POST",
            async handler(ctx) {
                const params = ctx.params;
                try {
                    const group = await ctx.call("group.get", { id: params.groupId });
                    const query = { $and: [{ groupId: params.groupId }, { userId: params.userId }] };
                    const response = await this.adapter.findOne(query);
                    if (response) return { message: "Zaten kayıtlısın" };
                    if (group.password != null) {
                        if (!params.password) return ({ message: "Lütfen Şifre giriniz..." });
                        const res = await bcrypt.compare(params.password, group.password);
                        if (!res)
                            return ({ message: "hatalı şifre" });
                    }
                    params.createdAt = new Date();
                    params.updatedAt = new Date();
                    const newGroupMember = {
                        groupId: params.groupId,
                        userId: params.userId,
                        groupName: group.groupName,
                        createdAt: params.createdAt,
                        updatedAt: params.updatedAt,
                    };
                    const result = await this.adapter.insert(newGroupMember);
                    return result;
                } catch (error) {
                    console.log(error);
                    return error;
                }
            }
        },
        get: {
            method: "GET",
            async handler(ctx) {
                const members = ctx.params;
                try {
                    const response = await this.adapter.find({ query: { userId: members.id } });
                    return response;
                } catch (error) {
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