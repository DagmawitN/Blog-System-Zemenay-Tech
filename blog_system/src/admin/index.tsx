import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;
  if (!session || session.user.role !== "admin") {
    router.push("/"); // Redirect if not admin
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
    </div>
  );
}
