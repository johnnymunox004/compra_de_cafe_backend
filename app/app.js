// app.js
import express from "express";
import cors from "cors";
import pkg from "body-parser";
import router from "./routes/index.js";
import { connect } from "./config/mongodb.js";
import cookieParser from 'cookie-parser';

const { json } = pkg;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configurar CORS para aceptar cualquier origen
app.use(cors({
  origin: '*', // Permitir cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));

app.use(json());

// Usar rutas definidas en el archivo de rutas
app.use("/api", router);

// Conectar a la base de datos
connect().catch(console.dir);

export default app;
