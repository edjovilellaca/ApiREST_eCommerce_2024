import { Router } from 'express';
import * as prodServController from '../controllers/prodserv.controller';
const router = Router();

//Obtener todos los productos
router.get('/getProductos', prodServController.getProdServList);

//Obtener un producto
router.get('/:id', prodServController.getProdServItem);

//Añadir un producto
router.post('/', prodServController.postProdServItem);

//Añadir varios productos
router.post('/many-pwa', prodServController.addManyProdServ);

//Actualizar producto
router.put('/:id', prodServController.putProdServItem);

//Borrar producto
router.delete('/:id', prodServController.delProdServItem);

//Borrar varios productos
router.delete('/', prodServController.delManyProdServItem);

//Añadir subdocumento
router.post('/:id/:seccion', prodServController.subProdServItem);

//Eliminar subdocumento
router.delete('/:id/:seccion/:idSubDoc', prodServController.delSubProdServItem);

//Actualizar subdocumento
router.post('/update/:id/:seccion', prodServController.updateSubProdServItem);

export default router;