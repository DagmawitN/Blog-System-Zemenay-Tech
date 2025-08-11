import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Not signed in</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}