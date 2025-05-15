import { auth } from "@/auth";
import EditForm from "@/components/editForm"

export default async function Page() {

  const session = await auth()

  if (!session) {
    return <div>Login</div>
  }

  return (
    <div>
      <EditForm />
    </div>
  );
}
