import Entry from "@/components/entry";
import { auth } from "@/auth";
import { hono } from "@/lib/hono";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const res = await hono.api.blogs[":id"].$get({
    param: {
      id
    }
  })

  const blog = await res.json()

  if (!blog) return notFound()

  const session = await auth()
  const currentUserId = session?.user?.id || null

  return (
    <div>
      <Entry
        blog={{
          ...blog,
          id: String(blog.id),
          user: {
            id: blog.userId,
            name: blog.user.name || 'Unknown User',
            email: 'unknown@example.com',
            image: blog.user.image || null,
          }
        }}
        currentUserId={currentUserId}
      />
    </div>
  );
}
