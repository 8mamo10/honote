'use client';

import { hono } from "@/lib/hono";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";

interface BlogProps {
  blog: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
  };
}

export default function Entry({ blog }: BlogProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const res = await hono.api.blogs[":id"].$delete({
        param: {
          id: blog.id
        }
      })
      if (res.status === 200) {
        window.location.href = "/"
      } else {
        alert("Failed to delete the blog.")
      }
      console.log(`Delete "${blog.title}"`);
      router.push('/');
      router.refresh();
    }
  };

  const handleUpdate = () => {
    //router.push(`/blogs/edit/${blog.id}`);
    router.push('/blogs/new');
  };

  return (
    <div className="max-w-3xl mx-auto px-3 mt-6">
      <Link
        href="/"
        className="inline-block text-blue-500 hover:underline mb-4"
      >
        ← Back to list
      </Link>

      <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 relative">
        <h1 className="lg:text-xl text-lg font-bold text-gray-800 mb-4">{blog.title}</h1>
        <p className="text-gray-600 lg:text-md text-sm mb-6">{blog.content}</p>

        <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
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

        <div className="absolute top-4 right-4 space-x-2">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}