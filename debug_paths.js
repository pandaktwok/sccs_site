require('dotenv').config();
const { createClient } = require('webdav');

const client = createClient(process.env.NEXTCLOUD_URL, {
    username: process.env.NEXTCLOUD_USERNAME,
    password: process.env.NEXTCLOUD_PASSWORD,
});

async function debugPaths() {
    console.log('Testing connection to:', process.env.NEXTCLOUD_URL);
    try {
        const root = await client.getDirectoryContents('/');
        console.log('--- ROOT ITEMS ---');
        root.forEach(i => console.log(`${i.type === 'directory' ? '[DIR]' : '[FILE]'} ${i.filename} -> basename: ${i.basename}`));

        const imgSitePath = '/img_site';
        console.log(`\n--- CONTENTS OF ${imgSitePath} ---`);
        const imgSite = await client.getDirectoryContents(imgSitePath);
        imgSite.forEach(i => console.log(`${i.type === 'directory' ? '[DIR]' : '[FILE]'} ${i.filename} -> basename: ${i.basename}`));

        const logosPath = '/img_site/logos';
        try {
            console.log(`\n--- CONTENTS OF ${logosPath} ---`);
            const logos = await client.getDirectoryContents(logosPath);
            logos.forEach(i => console.log(`${i.type === 'directory' ? '[DIR]' : '[FILE]'} ${i.filename} -> basename: ${i.basename}`));
        } catch (e) {
            console.log(`Error reading ${logosPath}:`, e.message);
        }

    } catch (err) {
        console.error('ERROR:', err.message);
    }
}

debugPaths();
