//src/app/page.tsx
import { hono } from "@/lib/hono";

export default async function Page() {
  const res = await hono.api.blogs.$get()
  const blogs = await res.json()

  if (blogs.length === 0) {
    return <div>No post</div>
  }

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
        </div>
      ))}
    </div>
  );
}