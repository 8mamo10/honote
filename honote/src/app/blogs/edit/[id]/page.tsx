import { auth } from "@/auth";
import EditForm from "@/components/editForm"
import { hono } from "@/lib/hono";
import { notFound } from "next/navigation";


type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const res = await hono.api.blogs[":id"].$get({
    param: {
      id
    }
  })
  const blog = await res.json()

  if (!blog) return notFound()

  const session = await auth()

  if (!session) {
    return <div>Login</div>
  }

  return (
    <div>
      <EditForm blog={{
        ...blog,
        id: String(blog.id),
        title: blog.title || '',
        content: blog.content || '',
        createdAt: blog.createdAt || '',
      }} />
    </div>
  );
}
