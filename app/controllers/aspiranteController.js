import { collection, ObjectId } from "../models/aspirantes.js";
import bcrypt from "bcryptjs";

async function createAspirante(req, res) {
  const {
    nombre,
    identificacion,
    tipo_cafe,
    peso,
    precio,
    telefono,
    estado,
    estado_monetario, // Nuevo campo
  } = req.body;

  if (
    !nombre ||
    !identificacion ||
    !tipo_cafe ||
    !peso ||
    !precio ||
    !telefono ||
    !estado ||
    !estado_monetario // Validación del nuevo campo
  ) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const pesoNum = Number(peso);
  const precioNum = Number(precio);

  const precio_total = pesoNum * precioNum;

  try {
    const newAspirante = {
      nombre,
      identificacion,
      tipo_cafe,
      peso: pesoNum,
      precio: precioNum,
      telefono,
      estado,
      estado_monetario, // Agregar estado_monetario
      precio_total,
      date_create: new Date(),
    };

    await collection.insertOne(newAspirante);
    res.status(201).json({ message: "Aspirante creado exitosamente" });
  } catch (error) {
    console.error(`Error registrando aspirante: ${error}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function createEmpleados(req, res) {
  const {
    nombre,
    identificacion,
    tipo_cafe,
    peso,
    precio,
    telefono,
    estado,
    estado_monetario, // Nuevo campo
  } = req.body;

  if (
    !nombre ||
    !identificacion ||
    !tipo_cafe ||
    !peso ||
    !precio ||
    !telefono ||
    !estado ||
    !estado_monetario // Validación del nuevo campo
  ) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const newEmpleado = {
      nombre,
      identificacion,
      tipo_cafe,
      peso,
      precio,
      telefono,
      estado,
      estado_monetario, // Agregar estado_monetario
      date_create: new Date(),
    };

    await collection.insertOne(newEmpleado);
    res.status(201).json({ message: "Empleado creado exitosamente" });
  } catch (error) {
    console.error(`Error registrando empleado: ${error}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

const getAllAspirantes = async (req, res) => {
  try {
    const aspirantes = await collection.find().toArray();
    res.json(aspirantes);
  } catch (error) {
    console.error(`Error obteniendo aspirantes: ${error}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

async function getAspirante(req, res) {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const aspirante = await collection.findOne({ _id: new ObjectId(id) });
    if (aspirante) {
      res.status(200).json(aspirante);
    } else {
      res.status(404).json({ message: "Aspirante no encontrado" });
    }
  } catch (error) {
    console.error(`Error obteniendo aspirante: ${error}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function updateAspirante(req, res) {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const {
      nombre,
      identificacion,
      tipo_cafe,
      peso,
      precio,
      telefono,
      estado,
      estado_monetario, // Nuevo campo
    } = req.body;

    const pesoNum = Number(peso);
    const precioNum = Number(precio);

    if (isNaN(pesoNum) || isNaN(precioNum)) {
      return res.status(400).json({ message: "Peso y precio deben ser números válidos" });
    }

    const precio_total = pesoNum * precioNum;

    const updates = {
      nombre,
      identificacion,
      tipo_cafe,
      peso: pesoNum,
      precio: precioNum,
      precio_total,
      telefono,
      estado,
      estado_monetario, // Actualizar estado_monetario
      date_create: req.body.date_create ? new Date(req.body.date_create) : undefined,
    };

    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Aspirante no encontrado" });
    }

    const updatedAspirante = await collection.findOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Aspirante actualizado exitosamente", aspirante: updatedAspirante });
  } catch (error) {
    console.error(`Error actualizando aspirante: ${error}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function deleteAspirante(req, res) {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Aspirante no encontrado" });
    } else {
      res.status(200).json({ message: "Aspirante eliminado exitosamente" });
    }
  } catch (error) {
    console.error(`Error eliminando aspirante: ${error}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getAspiranteById(aspiranteId) {
  if (!ObjectId.isValid(aspiranteId)) {
    throw new Error("ID inválido");
  }
  const aspirante = await collection.findOne({ _id: new ObjectId(aspiranteId) });
  return aspirante;
}

async function updateAspiranteOne(aspiranteId, updatedAspiranteData) {
  if (!ObjectId.isValid(aspiranteId)) {
    throw new Error("ID inválido");
  }
  await collection.updateOne(
    { _id: new ObjectId(aspiranteId) },
    { $set: updatedAspiranteData }
  );
}

export {
  createAspirante,
  createEmpleados,
  getAspirante,
  updateAspirante,
  deleteAspirante,
  getAllAspirantes,
  getAspiranteById,
  updateAspiranteOne,
};
