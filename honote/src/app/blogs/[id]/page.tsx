//src/app/page.tsx
import { hono } from "@/lib/hono";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Props = {
  params: { id: string }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const res = await hono.api.blogs[":id"].$get({
    param: { id: id }
  })

  const blog = await res.json()

  if (!blog) return notFound()

  return (
    <div className="max-w-3xl mx-auto px-3 mt-6">
      <Link
        href="/"
        className="inline-block text-blue-500 hover:underline mb-4"
      >
        ← Back to list
      </Link>

      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4">
        <h1 className="lg:text-xl text-lg font-bold text-gray-800 mb-4">{blog.title}</h1>
        <p className="text-gray-600 lg:text-md text-sm mb-6">{blog.content}</p>

        <div className="flex items-center justify-between text-gray-600 text-sm">
          <div className="flex items-center space-x-3">
            <Image
              src={blog.user.image || ""}
              alt="icon"
              className="w-9 h-9 rounded-full border"
              width={36}
              height={36}
            />
            <div>
              <p className="font-medium">{blog.user.name}</p>
              <p className="text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}