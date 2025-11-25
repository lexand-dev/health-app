"use client";
import { useAction, useMutation } from "convex/react";
import { z } from "zod";
import { Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";

import { useForm } from "react-hook-form";
import { api } from "@health-app/backend/convex/_generated/api";
import { Button } from "@health-app/ui/components/button";
import { Form, FormField } from "@health-app/ui/components/form";

const formSchema = z.object({
  message: z.string().min(1, "Message is required")
});

type Props = {
  threadId: string;
};

export const Chat = ({ threadId }: Props) => {
  const createMessage = useAction(api.public.messages.create);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!threadId) {
      return;
    }

    form.reset();

    await createMessage({
      threadId: threadId,
      prompt: values.message
    });
  };

  const messages = useThreadMessages(
    api.public.messages.getMany,
    threadId ? { threadId: threadId } : "skip",
    {
      initialNumItems: 10
    }
  );
  return (
    <div>
      {threadId && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-medium">Messages</h2>
          <div className="space-y-4">
            {toUIMessages(messages.results ?? []).map((message) => (
              <div key={message.id} className="p-4 border rounded">
                <p>
                  <strong>{message.role}:</strong> {message.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col items-end"
        >
          <FormField
            name="message"
            control={form.control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Type your message here..."
                rows={4}
                className="border  rounded-2xl p-4 mt-4"
                style={{ width: "100%" }}
              />
            )}
          />
          <Button
            type="submit"
            disabled={!threadId}
            className="hover:scale-90 hover:bg-foreground"
          >
            <Send />
          </Button>
        </form>
      </Form>
    </div>
  );
};
