import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { APKBuilder } from "./apk-builder";
import { registerSageRoutes } from "./gork-api";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // APK Build endpoint
  app.post("/api/build-apk", async (req, res) => {
    try {
      const builder = new APKBuilder();
      
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      // Start the build process
      const result = await builder.buildAPK((status) => {
        res.write(`data: ${JSON.stringify(status)}\n\n`);
      });

      // Send final result and log to console
      res.write(`data: ${JSON.stringify(result)}\n\n`);
      
      // Log the final output to console as specified
      if (result.success && result.downloadUrl) {
        console.log('\n✅ GitHub push complete');
        console.log('🔄 Expo build started');
        console.log('⏳ Building APK...');
        console.log(`📦 APK Ready: ${result.downloadUrl}`);
      } else {
        console.log('\n❌ APK Build failed!');
        console.log(`❌ Error: ${result.error}`);
      }
      
      res.end();
    } catch (error) {
      res.write(`data: ${JSON.stringify({
        step: 'error',
        message: 'Build process failed',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })}\n\n`);
      res.end();
    }
  });

  // Register Sage AI routes
  registerSageRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
