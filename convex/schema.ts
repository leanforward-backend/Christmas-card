import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  goals: defineTable({
    text: v.string(),
    createdAt: v.number(),
  }),
  photos: defineTable({
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
    createdAt: v.number(),
  }),
});
