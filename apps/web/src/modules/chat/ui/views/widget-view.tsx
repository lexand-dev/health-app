"use client";

import { useAtomValue } from "jotai";
import { screenAtom } from "@/modules/chat/atoms/widget-atoms";
import { WidgetErrorScreen } from "@/modules/chat/ui/screens/widget-error-screen";
import { WidgetLoadingScreen } from "@/modules/chat/ui/screens/widget-loading-screen";
import { WidgetSelectionScreen } from "@/modules/chat/ui/screens/widget-selection-screen";
import { WidgetChatScreen } from "@/modules/chat/ui/screens/widget-chat-screen";
import { WidgetAuthScreen } from "@/modules/chat/ui/screens/widget-auth-screen";

interface Props {
  userId: string | null | undefined;
}

export const WidgetView = ({ userId }: Props) => {
  const screen = useAtomValue(screenAtom);
  console.log("User data:", userId);

  const screenComponents = {
    loading: <WidgetLoadingScreen userId={userId} />,
    error: <WidgetErrorScreen />,
    auth: <WidgetAuthScreen />,
    voice: <p>TODO: Voice</p>,
    selection: <WidgetSelectionScreen />,
    chat: <WidgetChatScreen />,
    contact: <p>TODO: Contact</p>
  };

  return (
    // TODO: Confirm whether or not "min-h-screen" and "min-w-screen" is needed
    <main className="min-h-screen min-w-2xl flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
      {screenComponents[screen]}
    </main>
  );
};
