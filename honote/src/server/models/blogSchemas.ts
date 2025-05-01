import { z } from "@hono/zod-openapi";

export const UserSchema = z.object({
  name: z.string().nullable().openapi({
    example: "John Doe",
  }),
  image: z.string().nullable().openapi({
    example: "https://github.com",
  }),
});

export const BlogSchema = z.object({
  id: z.number().openapi({
    example: 1,
  }),
  title: z.string().openapi({
    example: "This is a title",
  }),
  content: z.string().openapi({
    example: "This is a content",
  }),
  createdAt: z.string().datetime().openapi({
    example: "2025-03-16T12:00:00Z",
  }),
  userId: z.string().openapi({
    example: "xxxxx",
  }),
  user: UserSchema,
});

export const BlogsSchema = z.array(BlogSchema);

export const BlogIdSchema = z.object({
  id: z.string().openapi({
    example: "1",
  }),
});

export const CreateBlogSchema = z.object({
  title: z.string().min(1, { message: "No title" }).openapi({
    example: "This is a title",
  }),
  content: z.string().min(1, { message: "No content" }).openapi({
    example: "This is a content",
  }),
});

export const UpdateBlogSchema = z.object({
  id: z.number().openapi({
    example: 1,
  }),
  title: z.string().min(1, { message: "No title" }).openapi({
    example: "This is a title",
  }),
  content: z.string().min(1, { message: "No content" }).openapi({
    example: "This is a content",
  }),
});

export type User = z.infer<typeof UserSchema>;
export type Blog = z.infer<typeof BlogSchema>;
export type CreateBlog = z.infer<typeof CreateBlogSchema>;
export type UpdateBlog = z.infer<typeof UpdateBlogSchema>;
