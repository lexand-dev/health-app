"use client";

import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  userIdAtom,
  screenAtom
} from "@/modules/chat/atoms/widget-atoms";
import { WidgetHeader } from "@/modules/chat/ui/components/widget-header";
import { useAction, useMutation } from "convex/react";
import { api } from "@health-app/backend/convex/_generated/api";

type InitStep = "user" | "session" | "done";

export const WidgetLoadingScreen = ({
  userId
}: {
  userId: string | null | undefined;
}) => {
  const [step, setStep] = useState<InitStep>("user");
  const [sessionValid, setSessionValid] = useState(false);

  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setOrganizationId = useSetAtom(userIdAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtom);

  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(userId || "")
  );
  console.log("WidgetLoadingScreen contactSessionId:", userId);
  // Step 1: Validate user
  const validateUser = useAction(api.public.users.validate);
  useEffect(() => {
    if (step !== "user") {
      return;
    }

    setLoadingMessage("Finding user ID...");

    if (!userId) {
      setErrorMessage("User ID is required");
      setScreen("error");
      return;
    }

    setLoadingMessage("Verifying User...");

    validateUser({ userId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(userId);
          setStep("session");
        } else {
          setErrorMessage(result.reason || "Invalid configuration");
          setScreen("error");
        }
      })
      .catch(() => {
        setErrorMessage("Unable to verify user");
        setScreen("error");
      });
  }, [
    step,
    userId,
    setErrorMessage,
    setScreen,
    setOrganizationId,
    setStep,
    validateUser,
    setLoadingMessage
  ]);

  // Step 2: Validate session (if exists)
  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  );
  useEffect(() => {
    if (step !== "session") {
      return;
    }

    setLoadingMessage("Finding contact session ID...");

    if (!contactSessionId) {
      setSessionValid(false);
      setStep("done");
      return;
    }

    setLoadingMessage("Validating session...");

    validateContactSession({ contactSessionId })
      .then((result) => {
        setSessionValid(result.valid);
        setStep("done");
      })
      .catch(() => {
        setSessionValid(false);
        setStep("done");
      });
  }, [step, contactSessionId, validateContactSession, setLoadingMessage]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }

    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? "chat" : "auth");
  }, [step, contactSessionId, sessionValid, setScreen]);

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there! 👋</p>
          <p className="text-lg">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <LoaderIcon className="animate-spin" />
        <p className="text-sm">{loadingMessage || "Loading..."}</p>
      </div>
    </>
  );
};
