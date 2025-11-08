import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const sensorFile =
    process.env.SENSOR_DATA_PATH ||
    path.resolve(__dirname, "../latest.json");

  return {
    base: "./",
  server: {
    host: "::",
    port: 8080,
  },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    ...(mode === "development" && {
      configureServer(server: any) {
        server.middlewares.use("/latest.json", (_req: any, res: any) => {
          fs.readFile(sensorFile, "utf8", (err, contents) => {
            if (err) {
              res.statusCode = 503;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  ok: false,
                  error: `Unable to read sensor file at ${sensorFile}`,
                })
              );
              return;
            }

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "no-cache");
            res.end(contents);
          });
        });
      },
    }),
  };
});
