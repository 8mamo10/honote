import { RouteHandler } from "@hono/zod-openapi";
import { updateBlogRoute } from "../routes/blogRoutes";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const updateBlogHandler: RouteHandler<typeof updateBlogRoute> = async (
  c
) => {
  const { id, title, content } = c.req.valid("json");
  const blog = await prisma.blog.findUnique({
    where: { id: Number(id) },
  });
  if (!blog) {
    return c.json(null, 404);
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw Error("Authorization required.");
  }

  const blogs = await prisma.blog.update({
    where: {
      id,
    },
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
  return c.json(blogs, 200);
};
