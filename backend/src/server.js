const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests
  })
);

app.get('/api/news', async (req, res) => {
  try {
    const { q, page = 1, pageSize = 20 } = req.query;
    const response = await axios.get('https://content.guardianapis.com/search', {
      params: {
        'api-key': process.env.GUARDIAN_API_KEY,
        q,
        'show-fields': 'thumbnail',
        page,
        'page-size': pageSize,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Backend error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));