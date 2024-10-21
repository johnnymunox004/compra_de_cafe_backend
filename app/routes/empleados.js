import express from "express"
import {createEmpleado, deleteEmpleado, getAllEmpleados, getEmpleado, updateEmpleado} from '../controllers/empleadopsControllers.js'
import { authorize } from "../middleware/authMiddleware.js";

const empleadosRoutes = express.Router();



empleadosRoutes.post('/empleado',authorize(["Administrador"]), createEmpleado);
empleadosRoutes.get('/empleados',authorize(["Administrador"]), getAllEmpleados);
empleadosRoutes.get('/empleados/:id', authorize(["Administrador"]),getEmpleado);
empleadosRoutes.put('/empleados/:id',authorize(["Administrador"]),  updateEmpleado);
empleadosRoutes.delete('/empleados/:id', authorize(["Administrador"]), deleteEmpleado);

export default empleadosRoutes
