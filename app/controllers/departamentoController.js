import { collection, ObjectId } from "../models/departamento.js";

// Crear un nuevo departamento
async function createDepartamento(req, res) {
    const { nombre, descripcion } = req.body;
  
    try {
      const newDepartamento = {
        nombre,
        descripcion,
        usuarios: [], // Array para almacenar los IDs de usuarios asignados
        date_create: new Date(),
      };
  
      await collection.insertOne(newDepartamento);
      res.status(201).json({ message: "Departamento creado exitosamente" });
    } catch (error) {
      console.error(`Error registrando departamento: ${error}`);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  // Leer todos los departamentos
  const getAllDepartamentos = async (req, res) => {
    try {
      const departamentos = await collection.find().toArray();
      res.json(departamentos);
    } catch (error) {
      console.error(`Error obteniendo departamentos: ${error}`);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  // Leer un departamento por ID
  async function getDepartamento(req, res) {
    try {
      const id = req.params.id;
      const departamento = await collection.findOne({ _id: new ObjectId(id) });
      if (departamento) {
        res.status(200).json(departamento);
      } else {
        res.status(404).json({ message: "Departamento no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  // Actualizar un departamento
  async function updateDepartamento(req, res) {
    try {
      const id = req.params.id;
      const updates = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        usuarios: req.body.usuarios, // Actualización del array de usuarios
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
        res.status(404).json({ message: "Departamento no encontrado" });
      } else {
        res.status(200).json({ message: "Departamento actualizado exitosamente" });
      }
    } catch (error) {
      console.error(`Error actualizando departamento: ${error}`);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  // Eliminar un departamento
  async function deleteDepartamento(req, res) {
    try {
      const id = req.params.id;
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        res.status(404).json({ message: "Departamento no encontrado" });
      } else {
        res.status(200).json({ message: "Departamento eliminado exitosamente" });
      }
    } catch (error) {
      console.error(`Error eliminando departamento: ${error}`);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  // Asignar usuarios a un departamento
  async function assignTo(req, res) {
    try {
      const { departamentoId, userId } = req.body;
  
      const result = await collection.updateOne(
        { _id: new ObjectId(departamentoId) },
        { $addToSet: { usuarios: new ObjectId(userId) } } // Añadir el ID de usuario al array de usuarios
      );
      if (result.matchedCount === 0) {
        res.status(404).json({ message: "Departamento no encontrado" });
      } else {
        res.status(200).json({ message: "Usuario asignado exitosamente" });
      }
    } catch (error) {
      console.error(`Error asignando usuario: ${error}`);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  // Función auxiliar para obtener departamento por ID
  async function getDepartamentoById(departamentoId) {
    const departamento = await collection.findOne({ _id: new ObjectId(departamentoId) });
    return departamento;
  }
  
  // Función auxiliar para actualizar departamento
  async function updateDepartamentoOne(departamentoId, updatedDepartamentoData) {
    await collection.updateOne(
      { _id: new ObjectId(departamentoId) },
      { $set: updatedDepartamentoData }
    );
  }
  
  export {
    createDepartamento,
    getDepartamento,
    updateDepartamento,
    deleteDepartamento,
    getAllDepartamentos,
    assignTo,
    getDepartamentoById,
    updateDepartamentoOne,
  };