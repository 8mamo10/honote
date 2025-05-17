import { RouteHandler } from "@hono/zod-openapi";
import { updateBlogRoute } from "../routes/blogRoutes";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const updateBlogHandler: RouteHandler<typeof updateBlogRoute> = async (
  c
) => {
  const idParam = c.req.param("id");
  const id = Number(idParam);
  const { title, content } = c.req.valid("json");
  const blog = await prisma.blog.findUnique({
    where: { id },
  });
  if (!blog) {
    return c.json(null, 404);
  }

  const session = await auth();

  if (!session?.user?.id) {
    throw Error("Authorization required.");
  }

  if (blog.userId !== session.user.id) {
    throw Error("Invalid users.");
  }

  const res = await prisma.blog.update({
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
  return c.json(res, 200);
};
