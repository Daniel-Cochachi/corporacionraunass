import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = 'c:/Daniel/Mis-Servicios/corporacionraunass/public';

async function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            await processDirectory(fullPath);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                const outputPath = fullPath.replace(ext, '.webp');
                
                console.log(`Converting ${fullPath} to WebP...`);
                try {
                    await sharp(fullPath)
                        .webp({ quality: 80 })
                        .toFile(outputPath);
                    console.log(`Saved ${outputPath}`);
                    
                    // Delete original file
                    fs.unlinkSync(fullPath);
                    console.log(`Deleted original: ${fullPath}`);
                } catch (err) {
                    console.error(`Error processing ${fullPath}:`, err);
                }
            }
        }
    }
}

console.log('Starting recursive image optimization...');
processDirectory(publicDir).then(() => {
    console.log('Optimization and cleanup complete!');
});
