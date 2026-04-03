const fs = require("fs");
const path = require("path");

/**
 * Deletes a file from the filesystem.
 * @param {string} filePath - Correct path to the file (e.g., 'uploads/image-123.jpg')
 */
const deleteFile = (filePath) => {
  if (!filePath) return;

  const fullPath = path.resolve(filePath);
  
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${fullPath}`, err);
      } else {
        console.log(`Successfully deleted file: ${fullPath}`);
      }
    });
  } else {
    console.warn(`File not found, skipping deletion: ${fullPath}`);
  }
};

module.exports = { deleteFile };
