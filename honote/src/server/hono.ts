import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createBlogRoute,
  getBlogByIdRoute,
  getBlogsRoute,
  deleteBlogByIdRoute,
  updateBlogRoute,
} from "./routes/blogRoutes";
import { getBlogsHandler } from "./controllers/getBlogs";
import { getBlogByIdHandler } from "./controllers/getBlogById";
import { createBlogHandler } from "./controllers/createBlog";
import { deleteBlogHandler } from "./controllers/deleteBlog";
import { updateBlogHandler } from "./controllers/updateBlog";
import { swaggerUI } from "@hono/swagger-ui";
import { basicAuth } from "hono/basic-auth";

export const app = new OpenAPIHono().basePath("/api");

const blogApp = new OpenAPIHono()
  .openapi(getBlogsRoute, getBlogsHandler)
  .openapi(getBlogByIdRoute, getBlogByIdHandler)
  .openapi(createBlogRoute, createBlogHandler)
  .openapi(deleteBlogByIdRoute, deleteBlogHandler)
  .openapi(updateBlogRoute, updateBlogHandler);

export const route = app.route("/blogs", blogApp);

app
  .doc("/specification", {
    openapi: "3.0.0",
    info: { title: "Honote API", version: "1.0.0" },
  })
  .use("/doc/*", async (c, next) => {
    const auth = basicAuth({
      username: process.env.API_DOC_BASIC_AUTH_USER!,
      password: process.env.API_DOC_BASIC_AUTH_PASS!,
    });
    return auth(c, next);
  })
  .get("/doc", swaggerUI({ url: "/api/specification" }));

export type AppType = typeof route;
export default app;
