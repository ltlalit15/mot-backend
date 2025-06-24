const axios = require('axios');

const { getToken } = require('../utils/tokenManager');



// URL: /api/external/mot/:reg

exports.vehicleDetails = async (req, res) => {
  try {
    const token = await getToken();
    const vehicleReg = req.params.reg;

    const response = await axios.get(
      `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${encodeURIComponent(vehicleReg)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-api-key': 'TyXPUVYKfvpnu5bVq4113OAZhWtC3qy9cq4kRjd2', 
          Accept: 'application/json',
        },
      }
    );

    res.status(200).json({
      status: true,
      message: 'Vehicle data fetched successfully',
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Failed to fetch vehicle data',
      error: error.response?.data || error.message,
    });
  }
};
