const https = require('https');
const fs = require('fs');
const path = require('path');

// Add User-Agent to avoid 403s
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      ...new URL(url),
      headers
    };

    https.get(options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const writeStream = fs.createWriteStream(filepath);
      response.pipe(writeStream);

      writeStream.on('finish', () => {
        writeStream.close();
        resolve();
      });

      writeStream.on('error', (err) => {
        fs.unlink(filepath, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function main() {
  // Ensure directory exists
  const imagesDir = path.join(process.cwd(), 'src', 'assets', 'presidents');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Presidential image URLs - hardcoded to avoid redirects/403s
  const presidents = [
    {
      name: "Benjamin Harrison",
      imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Benjamin_Harrison%2C_head_and_shoulders_bw_photo.jpg/800px-Benjamin_Harrison%2C_head_and_shoulders_bw_photo.jpg"
    },
    {
      name: "Franklin D. Roosevelt",
      imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/FDR_1944_Color_Portrait.jpg/800px-FDR_1944_Color_Portrait.jpg"
    },
    {
      name: "Harry S. Truman",
      imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/TRUMAN_58-766-06_%28cropped%29.jpg/800px-TRUMAN_58-766-06_%28cropped%29.jpg"
    },
    // Add more presidents with direct image URLs...
  ];

  // Download each image
  for (const president of presidents) {
    const filename = `${president.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    const filepath = path.join(imagesDir, filename);

    console.log(`Downloading image for ${president.name}...`);
    try {
      await downloadImage(president.imageURL, filepath);
      console.log(`✓ Downloaded ${filename}`);
    } catch (error) {
      console.error(`× Error downloading image for ${president.name}:`, error.message);
    }
  }

  // Create index.js for easy importing
  const indexContent = presidents
    .map(president => {
      const safeName = president.name.toLowerCase().replace(/\s+/g, '-');
      return `export { default as ${safeName.replace(/-/g, '')} } from './${safeName}.jpg';`;
    })
    .join('\n');

  fs.writeFileSync(path.join(imagesDir, 'index.js'), indexContent);
  console.log('\nCreated index.js for importing');
}

main().catch(console.error);