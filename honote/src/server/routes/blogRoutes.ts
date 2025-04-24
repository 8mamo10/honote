import { createRoute, z } from "@hono/zod-openapi";
import {
  BlogIdSchema,
  BlogSchema,
  BlogsSchema,
  CreateBlogSchema,
} from "../models/blogSchemas";

export const getBlogsRoute = createRoute({
  path: "/",
  method: "get",
  description: "Get all blogs",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: BlogsSchema,
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

export const createBlogRoute = createRoute({
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

export const deleteBlogByIdRoute = createRoute({
  path: "/{id}",
  method: "delete",
  description: "Delete a blog",
  request: {
    params: BlogIdSchema,
  },
  responses: {
    204: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.null(),
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
