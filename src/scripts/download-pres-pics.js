const axios = require('axios');
const fs = require('fs');
const path = require('path');

// President data with direct Wikimedia URLs
const presidents = [
  {
    name: "George Washington",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg"
  },
  {
    name: "John Adams",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/7/70/John_Adams%2C_Gilbert_Stuart%2C_c1800_1815.jpg"
  },
  {
    name: "Thomas Jefferson",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Thomas_Jefferson_by_Rembrandt_Peale%2C_1800.jpg"
  },
  {
    name: "James Madison",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/1/1d/James_Madison.jpg"
  },
  {
    name: "James Monroe",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d4/James_Monroe_White_House_portrait_1819.jpg"
  },
  {
    name: "John Quincy Adams",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/4/4f/John_Quincy_Adams_by_Charles_Osgood.jpg"
  },
  {
    name: "Andrew Jackson",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/4/43/Andrew_Jackson_Head.jpg"
  },
  {
    name: "Martin Van Buren",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Martin_Van_Buren_by_Mathew_Brady_c1855-58.jpg"
  },
  {
    name: "William Henry Harrison",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/c/c5/William_Henry_Harrison_daguerreotype_edit.jpg"
  },
  {
    name: "John Tyler",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/1/1d/John_Tyler%2C_Jr.jpg"
  },
  {
    name: "James K. Polk",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/5/5e/JKP.jpg"
  },
  {
    name: "Warren G. Harding",
    imageURL: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Warren_G_Harding-Harris_%26_Ewing.jpg"
  }
  // We can add more presidents as needed
];

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filepath);
      response.data.pipe(writer);

      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    if (error.response) {
      throw new Error(`Download failed: ${error.response.status}`);
    }
    throw error;
  }
}

async function main() {
  // Create images directory
  const imagesDir = path.join(process.cwd(), 'src', 'assets', 'presidents');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  console.log('Starting download of presidential images...');
  console.log(`Saving to: ${imagesDir}\n`);

  // Track success/failure counts
  let succeeded = 0;
  let failed = 0;

  // Download each image
  for (const president of presidents) {
    const filename = president.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.jpg';
    const filepath = path.join(imagesDir, filename);
    
    process.stdout.write(`Downloading ${president.name}... `);
    
    try {
      await downloadImage(president.imageURL, filepath);
      process.stdout.write('✓\n');
      succeeded++;
    } catch (error) {
      process.stdout.write('✗\n');
      console.error(`  Error: ${error.message}`);
      failed++;
    }
  }

  // Create index.js for easy importing
  const indexContent = `// Presidential portraits
${presidents.map(p => {
  const safeName = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `import ${safeName.replace(/-/g, '')} from './${safeName}.jpg';`;
}).join('\n')}

export const presidentImages = {
  ${presidents.map(p => {
    const varName = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-/g, '');
    return `"${p.name}": ${varName}`;
  }).join(',\n  ')}
};`;

  fs.writeFileSync(path.join(imagesDir, 'index.js'), indexContent);

  // Print summary
  console.log('\nDownload Summary:');
  console.log(`✓ Successful: ${succeeded}`);
  console.log(`✗ Failed: ${failed}`);
  console.log('\nCreated index.js for importing images');
}

// Run the script
main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});