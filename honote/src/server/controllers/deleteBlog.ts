import { RouteHandler } from "@hono/zod-openapi";
import { deleteBlogByIdRoute } from "../routes/blogRoutes";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const deleteBlogHandler: RouteHandler<
  typeof deleteBlogByIdRoute
> = async (c) => {
  const { id } = c.req.param();
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

  if (blog.userId !== session?.user?.id) {
    return c.json(null, 403);
  }

  await prisma.blog.delete({
    where: { id: Number(id) },
  });
  return c.json(null, 200);
};
