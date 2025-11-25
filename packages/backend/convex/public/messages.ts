import { ConvexError, v } from "convex/values";
import { action, query } from "../_generated/server";
import { components, internal } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";
import { saveMessage } from "@convex-dev/agent";
import { healthAgent } from "../system/ai/agents/healthAgent";

export const create = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id("contactSessions")
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.runQuery(
      internal.system.contactSessions.getOne,
      {
        contactSessionId: args.contactSessionId
      }
    );

    if (!contactSession) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session"
      });
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: args.threadId
      }
    );

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found"
      });
    }

    if (conversation.status === "closed") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Conversation is closed"
      });
    }

    // TODO: Implement subscription check
    const shouldTriggerAgent = conversation.status === "open";

    if (shouldTriggerAgent) {
      await healthAgent.generateText(
        ctx,
        { threadId: args.threadId },
        {
          prompt: args.prompt
          // TODO: add tools here for search, etc.
        }
      );
    } else {
      await saveMessage(ctx, components.agent, {
        threadId: args.threadId,
        prompt: args.prompt
      });
    }
  }
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    contactSessionId: v.id("contactSessions")
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid session"
      });
    }

    const paginated = await healthAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts
    });

    return paginated;
  }
});
