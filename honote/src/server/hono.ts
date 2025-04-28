import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createBlogRoute,
  getBlogByIdRoute,
  getBlogsRoute,
  deleteBlogByIdRoute,
} from "./routes/blogRoutes";
import { getBlogsHandler } from "./controllers/getBlogs";
import { getBlogByIdHandler } from "./controllers/getBlogById";
import { createBlogHandler } from "./controllers/createBlog";
import { deleteBlogHandler } from "./controllers/deleteBlog";
import { swaggerUI } from "@hono/swagger-ui";

export const app = new OpenAPIHono().basePath("/api");

const blogApp = new OpenAPIHono()
  .openapi(getBlogsRoute, getBlogsHandler)
  .openapi(getBlogByIdRoute, getBlogByIdHandler)
  .openapi(createBlogRoute, createBlogHandler)
  .openapi(deleteBlogByIdRoute, deleteBlogHandler);

export const route = app.route("/blogs", blogApp);

app
  .doc("/specification", {
    openapi: "3.0.0",
    info: { title: "Honote API", version: "1.0.0" },
  })
  .get("/doc", swaggerUI({ url: "/api/specification" }));

export type AppType = typeof route;
export default app;
