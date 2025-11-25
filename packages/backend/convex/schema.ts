import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean()
  }),
  users: defineTable({
    name: v.string(),
    role: v.union(
      v.literal("doctor"),
      v.literal("patient"),
      v.literal("admin")
    ),
    phone: v.optional(v.string()),
    email: v.string()
  }),
  patients: defineTable({
    name: v.string(),
    age: v.number(),
    gender: v.string(),
    medicalHistory: v.array(v.string()),
    primaryPhysicianId: v.id("users"),
    createdBy: v.string()
  }),
  devices: defineTable({
    patientId: v.id("patients"),
    deviceType: v.string(),
    // serialNumber: v.string(),
    paired: v.boolean(),
    lastSeen: v.optional(v.string()),
    metadata: v.optional(
      v.object({
        model: v.optional(v.string()),
        manufacturer: v.optional(v.string()),
        firmwareVersion: v.optional(v.string()),
        language: v.optional(v.string())
      })
    )
  }),
  healthMetrics: defineTable({
    patientId: v.id("patients"),
    deviceId: v.id("devices"),
    timestamp: v.string(),
    metrics: v.object({
      heartRate: v.optional(v.number()),
      bloodPressure: v.optional(v.string()),
      bloodOxygenLevel: v.optional(v.number()),
      steps: v.optional(v.number()),
      sleepDuration: v.optional(v.number())
    })
  }),
  conversations: defineTable({
    threadId: v.string(),
    userId: v.string(),
    contactSessionId: v.id("contactSessions"),
    status: v.union(v.literal("open"), v.literal("closed"), v.literal("scaled"))
  })
    .index("by_user_id", ["userId"])
    .index("by_contact_session_id", ["contactSessionId"])
    .index("by_thread_id", ["threadId"])
    .index("by_status_and_user_id", ["status", "userId"]),
  contactSessions: defineTable({
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        language: v.optional(v.string()),
        languages: v.optional(v.string()),
        platform: v.optional(v.string()),
        vendor: v.optional(v.string()),
        screenResolution: v.optional(v.string()),
        viewportSize: v.optional(v.string()),
        timezone: v.optional(v.string()),
        timezoneOffset: v.optional(v.number()),
        cookieEnabled: v.optional(v.boolean()),
        referrer: v.optional(v.string()),
        currentUrl: v.optional(v.string())
      })
    )
  }).index("by_organization_id", ["organizationId"])
});
