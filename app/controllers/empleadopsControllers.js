import { collection, ObjectId } from "../models/empleados.js";
import bcrypt from "bcryptjs";

// Crear empleado
async function createEmpleado(req, res) {
  const {
    nombre,
    identificacion,
    edad,
    sexo,
    rol,
    dept,
    password,
    email,
    telefono,
    estado,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmpleado = {
      nombre,
      identificacion,
      edad,
      sexo,
      rol,
      dept,
      password: hashedPassword,
      email,
      telefono,
      estado,
      date_create: new Date(),
    };

    await collection.insertOne(newEmpleado);
    res.status(201).json({ message: "Empleado creado exitosamente" });
  } catch (error) {
    console.error(`Error registrando empleado: ${error}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Leer todos los empleados
const getAllEmpleados = async (req, res) => {
  try {
    const empleados = await collection.find().toArray();
    res.json(empleados);
  } catch (error) {
    console.error(`Error obteniendo empleados: ${error}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Leer un empleado
async function getEmpleado(req, res) {
  try {
    const id = req.params.id;
    const empleado = await collection.findOne({ _id: new ObjectId(id) });
    if (empleado) {
      res.status(200).json(empleado);
    } else {
      res.status(404).json({ message: "Empleado no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Actualizar empleado
async function updateEmpleado(req, res) {
  try {
    const id = req.params.id;
    const updates = {
      nombre: req.body.nombre,
      identificacion: req.body.identificacion,
      edad: req.body.edad,
      sexo: req.body.sexo,
      rol: req.body.rol,
      dept: req.body.dept,
      password: req.body.password
        ? await bcrypt.hash(req.body.password, 10)
        : undefined,
      email: req.body.email,
      telefono: req.body.telefono,
      estado: req.body.estado,
      date_create: req.body.date_create ? new Date(req.body.date_create) : undefined,
    };

    // Eliminar cualquier campo undefined
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    if (result.matchedCount === 0) {
      res.status(404).json({ message: "Empleado no encontrado" });
    } else {
      res.status(200).json({ message: "Empleado actualizado exitosamente" });
    }
  } catch (error) {
    console.error(`Error actualizando empleado: ${error}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Eliminar empleado
async function deleteEmpleado(req, res) {
  try {
    const id = req.params.id;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Empleado no encontrado" });
    } else {
      res.status(200).json({ message: "Empleado eliminado exitosamente" });
    }
  } catch (error) {
    console.error(`Error eliminando empleado: ${error}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Función auxiliar para obtener empleado por ID
async function getEmpleadoById(empleadoId) {
  const empleado = await collection.findOne({ _id: new ObjectId(empleadoId) });
  return empleado;
}

// Función auxiliar para actualizar empleado
async function updateEmpleadoOne(empleadoId, updatedEmpleadoData) {
  await collection.updateOne(
    { _id: new ObjectId(empleadoId) },
    { $set: updatedEmpleadoData }
  );
}

export {
  createEmpleado,
  getEmpleado,
  updateEmpleado,
  deleteEmpleado,
  getAllEmpleados,
  getEmpleadoById,
  updateEmpleadoOne,
};
