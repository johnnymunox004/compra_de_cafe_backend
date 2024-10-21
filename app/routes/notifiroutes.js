import express from "express"
import {createNotification, getNotification, deleteNotification,getAllNotifications } from '../controllers/notifiController.js'

const notifiRoutes = express.Router();



notifiRoutes.post('/notifi', createNotification);
notifiRoutes.get('/notifi', getAllNotifications);
notifiRoutes.get('/notifi/:id', getNotification);
notifiRoutes.delete('/notifi/:id',  deleteNotification);

export default notifiRoutes
