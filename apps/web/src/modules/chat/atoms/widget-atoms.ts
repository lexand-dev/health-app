import { atom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { type WidgetScreen } from "@/modules/chat/types";
import { CONTACT_SESSION_KEY } from "../constants";
import type { Id } from "@health-app/backend/convex/_generated/dataModel";

export const screenAtom = atom<WidgetScreen>("loading");
export const userIdAtom = atom<string | null>(null);
export const contactSessionIdAtomFamily = atomFamily((userId: string) => {
  return atomWithStorage<Id<"contactSessions"> | null>(
    `${CONTACT_SESSION_KEY}_${userId}`,
    null
  );
});
export const errorMessageAtom = atom<string | null>(null);
export const loadingMessageAtom = atom<string | null>(null);
export const conversationIdAtom = atom<Id<"conversations"> | null>(null);
