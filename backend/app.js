require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

// MongoDB bağlantısını başlat
connectDB();

// Middleware
app.use(cors()); // Frontend ile iletişim için CORS'u etkinleştir
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend sunucusu ${PORT} portunda çalışıyor...`);
}); 