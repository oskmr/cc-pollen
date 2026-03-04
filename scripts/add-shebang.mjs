// Add shebang to dist/cli.js after TypeScript compilation
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = resolve(__dirname, "..", "dist", "cli.js");

try {
  const content = readFileSync(cliPath, "utf8");
  if (!content.startsWith("#!/")) {
    writeFileSync(cliPath, "#!/usr/bin/env node\n" + content);
    console.log("Added shebang to dist/cli.js");
  }
} catch (e) {
  console.error("Could not add shebang:", e.message);
  process.exit(1);
}

