const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Kullanıcı kaydı
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Email kontrolü
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kayıtlı'
            });
        }

        // Yeni kullanıcı oluştur
        const user = await User.create({
            name,
            email,
            password
        });

        // Token oluştur
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'gizli_anahtar',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// @desc    Kullanıcı girişi
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Email ve şifre kontrolü
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen email ve şifre giriniz'
            });
        }

        // Kullanıcıyı bul
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz email veya şifre'
            });
        }

        // Şifre kontrolü
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz email veya şifre'
            });
        }

        // Token oluştur
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'gizli_anahtar',
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
}; 