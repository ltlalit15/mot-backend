// utils/tokenManager.js
const axios = require('axios');

let cachedToken = null;
let tokenExpiry = null;

// 🔁 Token Fetch Function
const fetchToken = async () => {
  try {
    const response = await axios.post(
      'https://login.microsoftonline.com/a455b827-244f-4c97-b5b4-ce5d13b4d00c/oauth2/v2.0/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'e8711e26-ff10-49f2-9e61-8b262496d510',
        client_secret: 'r6y8Q~fc8tKkU.AYG4pDPfIfBTpgAtriqDWH6c_B',
        scope: 'https://tapi.dvsa.gov.uk/.default',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const token = response.data.access_token;
    const expiresIn = response.data.expires_in; // 3599 seconds

    cachedToken = token;
    tokenExpiry = Date.now() + (expiresIn - 60) * 1000; // 1 minute buffer

    console.log('✅ Token fetched successfully');
  } catch (err) {
    console.error('❌ Token fetch failed:', err.response?.data || err.message);
  }
};

// ✅ Get Token (auto refresh logic)
const getToken = async () => {
  if (!cachedToken || Date.now() >= tokenExpiry) {
    await fetchToken();
  }
  return cachedToken;
};

// 🔁 Auto refresh every 55 minutes
setInterval(fetchToken, 55 * 60 * 1000);

module.exports = { getToken };
