// app/notifications/page.tsx

import { redirect } from "next/navigation";
import Header from "../components/Header";
import NotificationsFeed from "../components/NotificationsFeed";
import serverAuth from "@/app/libs/serverAuth";

export default async function NotificationsPage() {

  try {
    await serverAuth(); // will throw if not signed in
  } catch (error) {
    redirect("/"); // redirect to home if not authenticated
  }

  return (
    <>
      <Header showBackArrow label="Notifications" />
      <NotificationsFeed />
    </>
  );
}
