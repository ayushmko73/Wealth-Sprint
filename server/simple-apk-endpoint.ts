import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Environment variables (should be set in Replit secrets)
const EAS_TOKEN = process.env.EAS_TOKEN || "25lpE7PC4j3AIdlOXpqO5UXJrnTw6zfVXxeW7WAq";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "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";
const GITHUB_REPO = "ayushmko73/Wealth-Sprint";

export async function buildAPKSimple(req: any, res: any) {
  console.log("🚀 Starting full automation...");

  try {
    // Step 1: Git add + commit
    const commitResult = await execAsync(`git add . && git commit -m "Auto commit" || echo "⚠️ Nothing to commit"`);
    console.log("🔧 Commit Output:", commitResult.stdout);

    // Step 2: GitHub Push
    const pushResult = await execAsync(
      `git push https://oauth2:${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git`
    );
    console.log("✅ GitHub push complete");

    // Step 3: EAS Build Command (modern approach)
    const buildCmd = `EXPO_TOKEN=${EAS_TOKEN} npx eas build --platform android --non-interactive --json`;
    console.log("🔄 Starting EAS build...");
    
    const buildResult = await execAsync(buildCmd);
    
    let buildData;
    try {
      buildData = JSON.parse(buildResult.stdout);
    } catch (parseErr) {
      console.error("❌ Parse error:", buildResult.stdout);
      return res.status(500).json({ error: "Parsing error", details: buildResult.stdout });
    }

    const buildId = buildData.builds?.android?.buildId;
    if (!buildId) {
      return res.status(500).json({ error: "No build ID returned" });
    }
    
    console.log("⏳ Build started. ID:", buildId);

    // Step 4: Poll until ready (simplified)
    const pollBuild = async (): Promise<any> => {
      const statusResult = await execAsync(`EXPO_TOKEN=${EAS_TOKEN} npx eas build:status --json`);
      
      let statusData;
      try {
        statusData = JSON.parse(statusResult.stdout);
      } catch (err) {
        throw new Error("Polling JSON error");
      }

      const build = statusData.builds.find((b: any) => b.platform === "android");

      if (!build) {
        throw new Error("No Android build found");
      }

      if (build.status === "finished") {
        console.log("✅ Build finished!");
        return {
          apkUrl: build.artifacts.buildUrl,
          message: "🎉 APK build complete!"
        };
      } else if (build.status === "errored") {
        throw new Error("Expo build failed");
      } else {
        console.log("⏳ Still building...");
        // Wait 15 seconds and try again
        await new Promise(resolve => setTimeout(resolve, 15000));
        return pollBuild();
      }
    };

    // Start polling
    const result = await pollBuild();
    return res.json(result);

  } catch (error: any) {
    console.error("❌ APK Build failed!");
    console.error("❌ Error:", error.message);
    return res.status(500).json({ 
      error: "Build failed", 
      details: error.message 
    });
  }
}