// Import the necessary modules
import { promises as fs } from "fs";

// Array of file paths to delete
const filesToDelete = [
  "./src/design-tokens/_variables.css",
  "./src/design-tokens/variables.json",
];

// Function to delete files
async function deleteFiles(files) {
  for (const file of files) {
    try {
      await fs.unlink(file);
      console.log(`Successfully deleted: ${file}`);
    } catch (err) {
      console.error(`Error deleting file ${file}:`, err);
    }
  }
}

// Execute the deleteFiles function
deleteFiles(filesToDelete)
  .then(() => console.log("All files processed."))
  .catch((err) => console.error("Error processing files:", err));
