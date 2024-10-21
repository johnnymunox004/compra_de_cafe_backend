import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { collection } from '../models/userModels.js';
import dotenv from 'dotenv';

dotenv.config();

// Función para generar el token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id,  user: user.user, },
    process.env.JWT_SECRET,
    { expiresIn: '5s' }
  );
};

// Generar un código secreto de Google Authenticator para el usuario
const generate2FASecret = () => {
  const secret = speakeasy.generateSecret({ length: 20 });
  return secret;
};

// Generar el código QR para que el usuario lo escanee
const generateQRCode = async (secret) => {
  try {
    const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Función de login con verificación de token 2FA
async function login(req, res) {
  const { user, password, token2FA } = req.body;

  try {
    const existingUser = await collection.findOne({ user });
    if (!existingUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verificar el código de 2FA
    const isTokenValid = speakeasy.totp.verify({
      secret: existingUser.secret2FA, // El secreto almacenado en la base de datos
      encoding: 'base32',
      token: token2FA // Código ingresado por el usuario
    });

    if (!isTokenValid) {
      return res.status(401).json({ message: 'Invalid 2FA token' });
    }

    const token = generateToken(existingUser);
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Registro de un nuevo usuario y generación de código secreto 2FA
async function register(req, res) {
  const { user, password, } = req.body;

  try {
    const existingUser = await collection.findOne({ user });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar el secreto 2FA para el usuario
    const secret2FA = generate2FASecret();

    const newUser = {
      user,

      password: hashedPassword,
      date_create: new Date(),
      secret2FA: secret2FA.base32 // Guardar el secreto en la base de datos
    };

    const result = await collection.insertOne(newUser);

    // Generar el código QR para que el usuario lo escanee
    const qrCodeURL = await generateQRCode(secret2FA);
    

    // Enviar token JWT y la URL del código QR
    const token = generateToken(newUser);
    res.status(201).json({ token, qrCodeURL });
  } catch (error) {
    console.error(`Error registering: ${error}`);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Función de logout
async function logoutUser(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
}

export { login, register, logoutUser };
