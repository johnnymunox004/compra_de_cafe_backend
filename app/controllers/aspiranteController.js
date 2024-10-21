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
  } = req.body;

  if (!nombre || !identificacion || !tipo_cafe || !peso || !precio || !telefono || !estado) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  // Convertir a números
  const pesoNum = Number(peso);
  const precioNum = Number(precio);

  // Calcular precio_total
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
      precio_total, // Agregar precio_total
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
  } = req.body;

  if (!nombre || !identificacion || !tipo_cafe || !peso || !precio ||  !telefono || !estado) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const newEmpleado = {
      nombre,
      identificacion,
      tipo_cafe,
      peso,
      precio,
      estado,
      telefono,
      date_create: new Date(),
    };

    await collection.insertOne(newEmpleado);
    res.status(201).json({ message: "Empleado creado exitosamente" });
  } catch (error) {
    console.error(`Error registrando empleado: ${error}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// Leer todos
const getAllAspirantes = async (req, res) => {
  try {
    const aspirantes = await collection.find().toArray();
    res.json(aspirantes);
  } catch (error) {
    console.error(`Error obteniendo aspirantes: ${error}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Leer uno
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

// Actualizar
async function updateAspirante(req, res) {
  try {
    const id = req.params.id;

    // Verificación de ID válido
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Obtener los datos del cuerpo de la solicitud
    const { nombre, identificacion, tipo_cafe, peso, precio, telefono, estado } = req.body;

    // Asegúrate de que 'peso' y 'precio' sean números
    const pesoNum = Number(peso);
    const precioNum = Number(precio);

    // Validación: asegurar que peso y precio sean valores numéricos válidos
    if (isNaN(pesoNum) || isNaN(precioNum)) {
      return res.status(400).json({ message: "Peso y precio deben ser números válidos" });
    }

    // Calcular el nuevo precio_total
    const precio_total = pesoNum * precioNum;

    // Actualizar los campos del aspirante
    const updates = {
      nombre,
      identificacion,
      tipo_cafe,
      peso: pesoNum,
      precio: precioNum,
      precio_total,  // Actualizar con el nuevo precio_total
      telefono,
      estado,
      date_create: req.body.date_create ? new Date(req.body.date_create) : undefined,
    };

    // Eliminar cualquier campo undefined
    Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

    // Realizar la actualización en la base de datos
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Aspirante no encontrado" });
    }

    // Enviar los datos actualizados de vuelta al cliente
    const updatedAspirante = await collection.findOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Aspirante actualizado exitosamente", aspirante: updatedAspirante });
  } catch (error) {
    console.error(`Error actualizando aspirante: ${error}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}


// Eliminar
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


// Función auxiliar para obtener aspirante por ID
async function getAspiranteById(aspiranteId) {
  if (!ObjectId.isValid(aspiranteId)) {
    throw new Error("ID inválido");
  }
  const aspirante = await collection.findOne({ _id: new ObjectId(aspiranteId) });
  return aspirante;
}

// Función auxiliar para actualizar aspirante
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
