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
      v.literal("physician"),
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
  })
});
