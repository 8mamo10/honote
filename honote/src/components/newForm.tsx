"use client";

import { hono } from "@/lib/hono";
import { CreateBlog, CreateBlogSchema } from "@/server/models/blogSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export default function Page() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBlog>({
    resolver: zodResolver(CreateBlogSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const router = useRouter()

  const onSubmit = async (data: CreateBlog) => {
    const { title, content } = data;

    await hono.api.blogs.$post({
      json: { title, content },
    });

    router.push("/");
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white px-3">
      <div className="p-6 border border-gray-200 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Post a blog
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Title
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-black"
                  placeholder="Input title"
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Content
            </label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 h-32 text-black"
                  placeholder="Input content"
                />
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-300 py-1 px-3 rounded-full font-bold 
             hover:bg-yellow-400 hover:shadow-md 
             transition-all duration-200 ease-in-out 
             active:scale-95"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}