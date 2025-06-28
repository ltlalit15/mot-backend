const axios = require('axios');
const { getToken } = require('../utils/tokenManager');

exports.vehicleBulk = async (req, res) => {
  try {
    const token = await getToken();           
   
    const response = await axios.get(
      'https://history.mot.api.gov.uk/v1/trade/vehicles/bulk-download',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-api-key': 'xC9Am3By2v5ibQC0gAeVZ6DRtGpKDZ5h7qKKHcmF',
          Accept: 'application/json',
        },
      }
    );

    res.status(200).json({
      status: true,
      message: 'Bulk-download links fetched successfully',
      data: response.data,                    // bulk + delta file URLs
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch bulk-download links',
      error: error.response?.data || error.message,
    });
  }
};
