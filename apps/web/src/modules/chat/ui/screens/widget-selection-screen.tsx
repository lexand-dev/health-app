"use client";

import { WidgetHeader } from "@/modules/chat/ui/components/widget-header";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  userIdAtom,
  screenAtom
} from "../../atoms/widget-atoms";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { WidgetFooter } from "../components/widget-footer";
import { Button } from "@health-app/ui/components/button";
import { api } from "@health-app/backend/convex/_generated/api";

export const WidgetSelectionScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const conversationId = useAtomValue(conversationIdAtom);
  const userId = useAtomValue(userIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(userId || "")
  );

  const createConversation = useMutation(api.public.conversations.create);
  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId
        }
      : "skip"
  );

  const [isPending, setIsPending] = useState(false);

  const handleNewConversation = async () => {
    if (!userId) {
      setScreen("error");
      setErrorMessage("Missing user ID");
      return;
    }

    if (!contactSessionId) {
      setScreen("auth");
      return;
    }

    if (conversation && conversation?.threadId) {
      setScreen("chat");
      setConversationId(conversation._id);
      return;
    }

    setIsPending(true);
    try {
      const conversationId = await createConversation({
        contactSessionId,
        userId
      });

      setConversationId(conversationId);
      setScreen("chat");
    } catch {
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto">
        <Button
          className="h-16 w-full justify-between"
          variant="outline"
          onClick={handleNewConversation}
          disabled={isPending}
        >
          <div className="flex items-center gap-x-2">
            <MessageSquareTextIcon className="size-4" />
            <span>Start chatdd</span>
          </div>
          <ChevronRightIcon />
        </Button>
      </div>
      {/* <WidgetFooter /> */}
    </>
  );
};
