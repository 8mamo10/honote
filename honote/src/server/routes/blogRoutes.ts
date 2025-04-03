import { createRoute, z } from "@hono/zod-openapi";
import {
  BlogIdSchema,
  BlogSchema,
  BlogsSchema,
  CreateBlogSchema,
} from "../models/blogSchemas";
import { create } from "domain";

export const getBlogsRoute = createRoute({
  path: "/",
  method: "get",
  description: "Get all blogs",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: BlogSchema,
        },
      },
    },
  },
});

export const getBlogByIdRoute = createRoute({
  path: "/{id}",
  method: "get",
  description: "Get a blog",
  request: {
    params: BlogIdSchema,
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: BlogSchema,
        },
      },
    },
    404: {
      description: "Not found",
      content: {
        "application/json": {
          schema: z.null(),
        },
      },
    },
  },
});

export const CreateBlogRoute = createRoute({
  path: "/",
  method: "post",
  description: "Create a blog",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateBlogSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "OK",
      content: {
        "application/json": {
          schema: BlogSchema,
        },
      },
    },
  },
});
