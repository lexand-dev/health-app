"use client";

import { api } from "@health-app/backend/convex/_generated/api";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery
} from "convex/react";
import Link from "next/link";
import { WidgetView } from "@/modules/chat/ui/views/widget-view";

export default function Dashboard() {
  const user = useUser();
  const privateData = useQuery(api.privateData.get);

  if (user.isLoaded === false) {
    return <p>Loading user...</p>;
  }

  return (
    <>
      <div className=" m-auto flex flex-col py-10 space-y-8">
        <WidgetView userId={user.user?.id} />
      </div>
    </>
  );
}
