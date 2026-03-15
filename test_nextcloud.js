const { createClient } = require('webdav');
require('dotenv').config();

async function testNextcloud() {
    console.log("Testing Nextcloud with URL:", process.env.NEXTCLOUD_URL);
    console.log("Username:", process.env.NEXTCLOUD_USERNAME);
    
    const client = createClient(process.env.NEXTCLOUD_URL, {
        username: process.env.NEXTCLOUD_USERNAME,
        password: process.env.NEXTCLOUD_PASSWORD,
    });

    try {
        console.log("Listing /...");
        const items = await client.getDirectoryContents('/');
        console.log("Success! Items in /:");
        items.forEach(i => console.log(` - ${i.basename} (${i.type})`));
        
        console.log("\nListing /img_site...");
        const imgItems = await client.getDirectoryContents('/img_site');
        console.log("Success! Items in /img_site:");
        imgItems.forEach(i => console.log(` - ${i.basename} (${i.type}) [Full: ${i.filename}]`));

    } catch (err) {
        console.error("Nextcloud Error:", err.message);
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        }
    }
}

testNextcloud();
