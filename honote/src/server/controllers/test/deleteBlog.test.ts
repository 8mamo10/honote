import { deleteBlogHandler } from "../deleteBlog";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

// Mock the auth and prisma modules
jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    blog: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("deleteBlogHandler", () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
    // Define a mock route that uses the deleteBlogHandler
    app.delete(
      "/blogs/:id",
      zValidator("param", z.object({ id: z.string() })),
      deleteBlogHandler
    );

    jest.clearAllMocks();
  });

  it("should successfully delete a blog post", async () => {
    // Mock the auth function to return a session with a user
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: "user1",
      },
    });

    // Mock the prisma.blog.findUnique function to return a blog post
    (prisma.blog.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      userId: "user1",
      title: "Test Blog",
      content: "Test Content",
    });

    // Mock the prisma.blog.delete function to return the deleted blog post
    (prisma.blog.delete as jest.Mock).mockResolvedValue({
      id: 1,
      userId: "user1",
      title: "Test Blog",
      content: "Test Content",
    });

    // Create a mock request
    const req = new Request("http://localhost/blogs/1", {
      method: "DELETE",
    });

    // Execute the handler
    const res = await app.request(req);

    // Assert that the response is successful
    expect(res.status).toBe(200);
    expect(prisma.blog.delete).toHaveBeenCalledTimes(1);
    expect(prisma.blog.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should return 404 if the blog post does not exist", async () => {
    // Mock the auth function to return a session with a user
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: "user1",
      },
    });

    // Mock the prisma.blog.findUnique function to return null
    (prisma.blog.findUnique as jest.Mock).mockResolvedValue(null);

    // Create a mock request
    const req = new Request("http://localhost/blogs/1", {
      method: "DELETE",
    });

    // Execute the handler
    const res = await app.request(req);

    // Assert that the response is 404
    expect(res.status).toBe(404);
    expect(prisma.blog.delete).not.toHaveBeenCalled();
  });

  it("should return 403 if the user is not authorized to delete the blog post", async () => {
    // Mock the auth function to return a session with a user
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: "user2",
      },
    });

    // Mock the prisma.blog.findUnique function to return a blog post with a different user id
    (prisma.blog.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      userId: "user1",
      title: "Test Blog",
      content: "Test Content",
    });

    // Create a mock request
    const req = new Request("http://localhost/blogs/1", {
      method: "DELETE",
    });

    // Execute the handler
    const res = await app.request(req);

    // Assert that the response is 403
    expect(res.status).toBe(403);
    expect(prisma.blog.delete).not.toHaveBeenCalled();
  });

  it("should throw an error if the user is not authenticated", async () => {
    // Mock the auth function to return null (no session)
    (auth as jest.Mock).mockResolvedValue(null);

    // Create a mock request
    const req = new Request("http://localhost/blogs/1", {
      method: "DELETE",
    });

    // Execute the handler
    try {
      await app.request(req);
    } catch (e: unknown) {
      if (e instanceof Error) {
        expect(e.message).toBe("Authorization required.");
      }
      expect(prisma.blog.delete).not.toHaveBeenCalled();
    }
  });
});
