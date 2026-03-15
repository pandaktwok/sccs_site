const axios = require('axios');

async function testProxy() {
    const url = 'http://localhost:5000/api/public/file/img_site/logo_uteis/LOGO_SCCS.png';
    console.log("Testing Proxy URL:", url);
    try {
        const res = await axios.get(url, { responseType: 'arraybuffer' });
        console.log("Success! Status:", res.status);
        console.log("Content-Type:", res.headers['content-type']);
        console.log("Data Length:", res.data.length);
    } catch (err) {
        console.error("Proxy Error:", err.message);
        if (err.response) {
            console.error("Status:", err.response.status);
        }
    }
}

testProxy();
