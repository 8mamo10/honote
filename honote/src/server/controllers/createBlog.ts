import { RouteHandler } from "@hono/zod-openapi";
import { createBlogRoute } from "../routes/blogRoutes";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const createBlogHandler: RouteHandler<typeof createBlogRoute> = async (
  c
) => {
  const { title, content } = c.req.valid("json");

  const session = await auth();

  if (!session?.user?.id) {
    throw Error("Authorization required.");
  }

  const blogs = await prisma.blog.create({
    data: {
      userId: session.user.id,
      title,
      content,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });
  return c.json(blogs, 201);
};
