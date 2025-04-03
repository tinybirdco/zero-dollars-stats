"use client"
import { redirect } from "next/navigation";
import useAuth from "../lib/hooks/use-auth"
import useAnalyticsWorkspaces from "../lib/hooks/use-analytics-workspaces";
import { AddPropertyModal } from "../components/Header";

export default function Home() {
  const { token } = useAuth();
  const { data: workspaces, isValidating } = useAnalyticsWorkspaces();

  if (!token) {
    redirect('/auth/login')
  }

  if (isValidating || workspaces === undefined) {
    return <div className="flex justify-center items-center h-screen bg-neutral-08">
      <p>Loading...</p>
    </div>
  }

  if (workspaces.length === 0) {
    return <AddPropertyModal isOpen={true} onClose={null} />
  }

  redirect(`/${workspaces[0].name}`)
}
