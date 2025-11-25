"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { WidgetHeader } from "@/modules/chat/ui/components/widget-header";
import { Button } from "@health-app/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { DicebearAvatar } from "@health-app/ui/components/dicebear-avatar";
import { useInfiniteScroll } from "@health-app/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@health-app/ui/components/infinite-scroll-trigger";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  userIdAtom,
  screenAtom
} from "../../atoms/widget-atoms";
import { useAction, useQuery } from "convex/react";
import { Form, FormField } from "@health-app/ui/components/form";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton
} from "@health-app/ui/components/ai/conversation";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools
} from "@health-app/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent
} from "@health-app/ui/components/ai/message";
import { AIResponse } from "@health-app/ui/components/ai/response";
import {
  AISuggestion,
  AISuggestions
} from "@health-app/ui/components/ai/suggestion";
import { api } from "@health-app/backend/convex/_generated/api";

const formSchema = z.object({
  message: z.string().min(1, "Message is required")
});

export const WidgetChatScreen = () => {
  const userId = useAtomValue(userIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(userId || "")
  );

  /*   const onBack = () => {
    setScreen("");
  }; */

  const conversations = useQuery(
    api.public.conversations.getMany,
    contactSessionId ? { contactSessionId } : "skip"
  );

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversations?.[0]?._id && contactSessionId
      ? {
          conversationId: conversations[0]._id,
          contactSessionId
        }
      : "skip"
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId
        }
      : "skip",
    { initialNumItems: 10 }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfiniteScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ""
    }
  });

  const createMessage = useAction(api.public.messages.create);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) {
      return;
    }

    form.reset();

    await createMessage({
      threadId: conversation.threadId,
      prompt: values.message,
      contactSessionId
    });
  };

  return (
    <>
      <WidgetHeader className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          {/* <Button onClick={onBack} size="icon" variant="transparent">
            <ArrowLeftIcon />
          </Button> */}
          <p>Chat</p>
        </div>
        <Button size="icon" variant="transparent">
          <MenuIcon />
        </Button>
      </WidgetHeader>
      <AIConversation>
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((message) => {
            return (
              <AIMessage
                from={message.role === "user" ? "user" : "assistant"}
                key={message.id}
              >
                <AIMessageContent>
                  <AIResponse>{message.text}</AIResponse>
                </AIMessageContent>
                {message.role === "assistant" && (
                  <DicebearAvatar
                    imageUrl="/logo.svg"
                    seed="assistant"
                    size={32}
                  />
                )}
              </AIMessage>
            );
          })}
        </AIConversationContent>
      </AIConversation>
      {/* TODO: Add suggestions */}
      <Form {...form}>
        <AIInput
          className="rounded-none border-x-0 border-b-0"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            disabled={conversation?.status === "closed"}
            name="message"
            render={({ field }) => (
              <AIInputTextarea
                disabled={conversation?.status === "closed"}
                onChange={field.onChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)();
                  }
                }}
                placeholder={
                  conversation?.status === "closed"
                    ? "This conversation has been resolved."
                    : "Type your message..."
                }
                value={field.value}
              />
            )}
          />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit
              disabled={
                conversation?.status === "closed" || !form.formState.isValid
              }
              status="ready"
              type="submit"
            />
          </AIInputToolbar>
        </AIInput>
      </Form>
    </>
  );
};
