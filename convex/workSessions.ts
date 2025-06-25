// convex/workSessions.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add or update work session for today
export const recordWorkSession = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Check if there's already a record for today
    const existingSession = await ctx.db
      .query("workSessions")
      .withIndex("by_user_date", (q) => 
        q.eq("userId", args.userId).eq("date", today)
      )
      .first();

    if (existingSession) {
      // Update existing record
      await ctx.db.patch(existingSession._id, {
        sessionsCount: existingSession.sessionsCount + 1,
      });
      return existingSession._id;
    } else {
      // Create new record
      return await ctx.db.insert("workSessions", {
        userId: args.userId,
        date: today,
        sessionsCount: 1,
        createdAt: Date.now(),
      });
    }
  },
});

// Get work sessions for a specific date range
export const getWorkSessions = query({
  args: {
    userId: v.string(),
    startDate: v.string(), // YYYY-MM-DD
    endDate: v.string(),   // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("workSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => 
        q.and(
          q.gte(q.field("date"), args.startDate),
          q.lte(q.field("date"), args.endDate)
        )
      )
      .collect();

    return sessions;
  },
});

// Get all work sessions for a user (for stats)
export const getAllWorkSessions = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Get work session stats
export const getWorkSessionStats = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("workSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const totalSessions = sessions.reduce((sum, session) => sum + session.sessionsCount, 0);
    const totalDays = sessions.length;
    const averagePerDay = totalDays > 0 ? Math.round(totalSessions / totalDays * 100) / 100 : 0;

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const daySession = sessions.find(s => s.date === dateStr);
      if (daySession && daySession.sessionsCount > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedSessions = sessions.sort((a, b) => a.date.localeCompare(b.date));
    
    for (let i = 0; i < sortedSessions.length; i++) {
      if (sortedSessions[i].sessionsCount > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return {
      totalSessions,
      totalDays,
      averagePerDay,
      currentStreak,
      longestStreak,
    };
  },
});