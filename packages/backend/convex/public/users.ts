import { createClerkClient } from "@clerk/backend";
import { v } from "convex/values";
import { action } from "../_generated/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || ""
});

export const validate = action({
  args: {
    userId: v.string()
  },
  handler: async (_, args) => {
    const user = await clerkClient.users.getUser(args.userId);

    if (user) {
      return { valid: true };
    } else {
      return { valid: false, reason: "User " };
    }
  }
});
