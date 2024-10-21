import express from 'express';
import {
  createDepartamento,
  getDepartamento,
  updateDepartamento,
  deleteDepartamento,
  getAllDepartamentos,
  assignTo,
} from '../controllers/departamentoController.js';
import { authorize } from "../middleware/authMiddleware.js";


const routesDepartamentos = express.Router();

routesDepartamentos.post('/departamentos',authorize(["Administrador"]), createDepartamento);
routesDepartamentos.get('/departamentos',authorize(["Administrador"]), getAllDepartamentos);
routesDepartamentos.get('/departamentos/:id',authorize(["Administrador"]), getDepartamento);
routesDepartamentos.put('/departamentos/:id',authorize(["Administrador"]), updateDepartamento);
routesDepartamentos.delete('/departamentos/:id',authorize(["Administrador"]), deleteDepartamento);
routesDepartamentos.post('/departamentos/assign',authorize(["Administrador"]), assignTo);


export default routesDepartamentos;
