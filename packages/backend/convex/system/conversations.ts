import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";

// Internal query to get conversation by threadId and to be used by other functions internally like ai tools etc.
export const getByThreadId = internalQuery({
  args: {
    threadId: v.string()
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique();

    return conversation;
  }
});
