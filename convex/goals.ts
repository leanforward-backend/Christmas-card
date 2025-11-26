import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("goals", {
      text: args.text,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("goals").order("desc").collect();
  },
});
