import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// APK builder import removed
import { registerSageRoutes } from "./gork-api";
import { registerAdvancedAIRoutes } from "./advanced-ai";
import { registerGitHubRoutes } from "./github-api";
import { registerFullGitHubRoutes } from "./github-full-push";
import { registerSimpleGitHubRoutes } from "./github-simple-push";
import { registerBatchGitHubRoutes } from "./github-batch-push";
import { initializeDatabase } from "./supabase";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Initialize database for AI learning
  await initializeDatabase();

  // Register Sage AI routes
  registerSageRoutes(app);

  // Register advanced AI routes
  registerAdvancedAIRoutes(app);

  // Register GitHub API routes
  registerGitHubRoutes(app);

  // Register full GitHub push routes
  registerFullGitHubRoutes(app);

  // Register simple GitHub push routes
  registerSimpleGitHubRoutes(app);

  // Register batch GitHub push routes
  registerBatchGitHubRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}