const axios = require('axios');

async function test() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            username: 'admin',
            password: 'admin1234'
        });
        console.log('SUCCESS:', res.data);
    } catch (err) {
        console.error('ERROR:', err.response ? err.response.data : err.message);
    }
}

test();
