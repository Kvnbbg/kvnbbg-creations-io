const { exec } = require("child_process");
const path = require("path");
const express = require("express");
const app = express();

// Serve static files from the 'public' and 'pages' directories
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "pages")));

// Handle requests to the root URL '/'
app.get("/", (req, res) => {
  // Execute TailwindCSS command to process input.css and generate out.css in the 'public' directory
  exec(
    "npx tailwindcss -i ./input.css -o ./public/out.css",
    (err, stdout, stderr) => {
      if (err) {
        // Log any errors encountered while executing TailwindCSS command
        console.error("Error executing TailwindCSS command:", err);
        // Send a 500 Internal Server Error response if an error occurs
        return res.status(500).send("Internal Server Error");
      }
      // Send the 'index.html' file from the 'pages' directory as a response
      res.sendFile(path.join(__dirname, "pages", "index.html"));
    }
  );
});

// Start the server on port 3000
const server = app.listen(3000, () => {
  console.log("🚀 Server is running on port 3000");
});

// Graceful shutdown: handle termination signals (Ctrl+C) to shut down the server gracefully
process.on("SIGINT", () => {
  console.log("Shutting down server gracefully");
  // Close the server and perform any necessary cleanup
  server.close(() => {
    console.log("Server has been closed");
    // Exit the process with status code 0 (indicating successful termination)
    process.exit(0);
  });
});
