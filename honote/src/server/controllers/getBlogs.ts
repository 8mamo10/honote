import { RouteHandler } from "@hono/zod-openapi";
import { getBlogsRoute } from "../routes/blogRoutes";
import { prisma } from "@/lib/prisma";

export const getBlogsHandler: RouteHandler<typeof getBlogsRoute> = async (
  c
) => {
  const blogs = await prisma.blog.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return c.json(blogs, 200);
};
