// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workSessions: defineTable({
    userId: v.string(),
    date: v.string(), // Format: "YYYY-MM-DD"
    sessionsCount: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"]),
});

export type WorkSession = {
  _id: string;
  userId: string;
  date: string;
  sessionsCount: number;
  createdAt: number;
};