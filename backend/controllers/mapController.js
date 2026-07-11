const axios = require('axios'); 

// @desc    Get driving route and distance between Farmer and Buyer
// @route   POST /api/map/route
const getDeliveryRoute = async (req, res) => {
  try {
    const { pickupLat, pickupLng, dropoffLat, dropoffLng } = req.body;

    if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
      return res.status(400).json({ message: 'Missing location coordinates' });
    }

    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}?overview=full&geometries=geojson`;

    const response = await axios.get(osrmUrl);
    const data = response.data;

    if (data.code !== 'Ok') {
      return res.status(400).json({ message: 'Could not calculate route' });
    }

    const route = data.routes[0];
    const distanceKm = (route.distance / 1000).toFixed(2);
    const timeMins = Math.ceil(route.duration / 60);

    res.status(200).json({
      distance: `${distanceKm} km`,
      estimatedTime: `${timeMins} mins`,
      routeGeometry: route.geometry 
    });

  } catch (error) {
    console.error("OSRM Routing Error:", error.message);
    res.status(500).json({ message: 'Map routing failed', error: error.message });
  }
};

// @desc    Proxy search requests to OpenStreetMap safely from the server
// @route   GET /api/map/search
const searchLocation = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        format: 'json',
        q: q
      },
      headers: {
        // NEW: Adding an email tells Nominatim you are a legit developer, stopping the random blocks!
        'User-Agent': 'KhetSe-Agricultural-Marketplace/1.0 (contact: student@daiict.ac.in)',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'http://localhost:3000'
      }
    });
    
    // Send the raw, highly-accurate data straight back to the frontend
    return res.status(200).json(response.data);

  } catch (error) {
    console.error("Backend Search Error:", error.message);
    res.status(500).json({ message: 'Backend map search failed', error: error.message });
  }
};

module.exports = { getDeliveryRoute, searchLocation };