import { components } from "../_generated/api";
import { saveMessage } from "@convex-dev/agent";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { healthAgent } from "../system/ai/agents/healthAgent";

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
    contactSessionId: v.id("contactSessions")
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);

    if (!session) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session"
      });
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found"
      });
    }

    if (conversation.contactSessionId !== session._id) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Incorrect session"
      });
    }

    return {
      _id: conversation._id,
      status: conversation.status,
      threadId: conversation.threadId
    };
  }
});

export const create = mutation({
  args: { userId: v.string(), contactSessionId: v.id("contactSessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session) {
      throw new Error("Contact session not found");
    }
    // Create a new thread for this user.
    const { threadId } = await healthAgent.createThread(ctx, {
      userId: args.userId
    });

    await saveMessage(ctx, components.agent, {
      threadId,
      message: {
        role: "assistant",
        // TODO: Later modify to widget settings' initial message
        content: "Hello, how can I help you today?"
      }
    });

    const conversationId = await ctx.db.insert("conversations", {
      userId: args.userId,
      contactSessionId: session._id,
      status: "open",
      threadId
    });

    return conversationId;
  }
});
