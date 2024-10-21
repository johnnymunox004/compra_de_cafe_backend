import { client } from '../config/mongodb.js';

import { ObjectId } from 'mongodb';

// Conexión a la base de datos y colección
const db = client.db('database'); 
const collection = db.collection('notificaciones');

// Función para crear una nueva notificación
async function createNotification(req, res) {
  const { action, solicitud, quien } = req.body;

  try {
    const newNotification = {
      action,
      solicitud,
      quien,
      date_created: new Date(),
    };

    await collection.insertOne(newNotification);
    res.status(201).json({ message: "Notification created successfully" });
  } catch (error) {
    console.error(`Error creating notification: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Función para obtener todas las notificaciones
async function getAllNotifications(req, res) {
  try {
    const notifications = await collection.find().toArray();
    res.json(notifications);
  } catch (error) {
    console.error(`Error getting notifications: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Función para obtener una notificación por su ID
async function getNotification(req, res) {
  try {
    const id = req.params.id;
    const notification = await collection.findOne({ _id: new ObjectId(id) });
    if (notification) {
      res.status(200).json(notification);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    console.error(`Error getting notification: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Función para eliminar una notificación por su ID
async function deleteNotification(req, res) {
  try {
    const id = req.params.id;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Notification not found" });
    } else {
      res.status(200).json({ message: "Notification deleted successfully" });
    }
  } catch (error) {
    console.error(`Error deleting notification: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export {
  createNotification,
  getNotification,
  deleteNotification,
  getAllNotifications,
};
