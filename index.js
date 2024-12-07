const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware untuk parsing JSON
app.use(express.json());

// Endpoint untuk mengambil lokasi recycling berdasarkan koordinat
app.get('/recycling-locations', async (req, res) => {
    const { lat, lon, radius } = req.query;
    const apiKey = 'AIzaSyAaZsCeuDI3KtLpPO0wBleci7Q7e1U3_QY'; // Masukkan API Key Anda di sini

    // Validasi input
    if (!lat || !lon || !radius) {
        return res.status(400).json({
            error: 'Parameter lat, lon, dan radius diperlukan. Contoh: ?lat=-6.2088&lon=106.8456&radius=1000'
        });
    }

    try {
        // URL Google Places API
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;

        // Panggil Google Places API
        const response = await axios.get(url, {
            params: {
                location: `${lat},${lon}`,
                radius: radius,
                keyword: 'recycling',
                key: apiKey
            }
        });

        // Ambil hasil dari respons
        const results = response.data.results.map(place => ({
            name: place.name,
            distance_km: null, // Google API tidak memberikan langsung jarak, perlu hitung manual jika ingin
            address: place.vicinity
        }));

        // Kirimkan hasilnya ke pengguna
        res.json({ locations: results });
    } catch (error) {
        console.error('Error saat memanggil Google API:', error.message);
        res.status(500).json({ error: 'Terjadi kesalahan saat menghubungi Google Places API.' });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});