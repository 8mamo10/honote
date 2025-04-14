//src/app/blogs/new/page.tsx
import { auth } from "@/auth";
import NewForm from "@/components/newForm"

export default async function Page() {

  const session = await auth()

  if (!session) {
    return <div>Login</div>
  }

  return (
    <div>
      <NewForm />
    </div>
  );
}
