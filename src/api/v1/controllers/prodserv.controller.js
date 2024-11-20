import * as ProdServServices from '../services/prodServ.service';
import boom from '@hapi/boom';

// Todos los productos
export const getProdServList = async ( req, res, next ) => {
    
    try{

        const ProdServList = await ProdServServices.getProdServList();
        if(!ProdServList){
            throw boom.notFound('No se encontraron peoductos registrados');
        }else{
            res.status(200).json(ProdServList);
        }

    }catch ( error ){
        next(error);
    }
};

//Obtener un producto
export const getProdServItem = async ( req, res, next ) => {

    try{

        const { id } = req.params;
        console.log('id: ', id);
        const keyType = req.query.keyType || 'OK';
        console.log('key: ', keyType);
        const ProdServItem = await ProdServServices.getProdServItem( id, keyType );
        console.log(JSON.stringify(ProdServItem));

        if(!ProdServItem){
            throw boom.notFound('No se encontró el producto');
        }else{
            res.status(200).json(ProdServItem);
        }

    }catch ( error ){
        next(error);
    }
};

// Añadir un producto
export const postProdServItem = async ( req, res, next ) => {
    try {
        const paProdServItem = req.body;
        console.log('prodController: ', paProdServItem);
        const newProdServItem = await ProdServServices.postProdServItem(paProdServItem);
        if (!newProdServItem) {
          throw boom.badRequest('No se pudo crear el Producto y/o Servicio.');
        } else if (newProdServItem) {
          res.status(201).json(newProdServItem);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Añadir varios productos
export const addManyProdServ = async (req, res, next) => {  
    try {
        const productsAdded = await ProdServServices.addManyProdServ(req.body);
        if (productsAdded.fail) {
            res.status(409).json(productsAdded);
        } else if (productsAdded.success) {
            res.status(201).json(productsAdded);
        }
    } catch (error) {
        next(error);
    }
};

//Actualizar producto
export const putProdServItem = async (req, res, next) => {    
    try {
        const { id } = req.params;
        const paProdServItem = req.body;
        const updatedProdServItem = await ProdServServices.putProdServItem(id, paProdServItem );        
        if (!updatedProdServItem) {
            throw boom.badRequest('No se pudo actualizar el producto.');
        } else if (updatedProdServItem) {
            res.status(200).json(updatedProdServItem);
        }
    } catch (error) {
        next(error);
    }    
};

//Borrar producto
export const delProdServItem = async (req, res, next) => {   
    try {
        const { id } = req.params;
        const deletedProdServItem = await ProdServServices.delProdServItem(id);        
        if (!deletedProdServItem) {
            throw boom.badRequest('No se pudo borrar el producto.');
        } else if (deletedProdServItem) {
            res.status(200).json(deletedProdServItem);
        }
    } catch (error) {
        next(error);
    }
};


//Borrar varios producto
export const delManyProdServItem = async (req, res, next) => {
    try {
        const filtros = req.body;
        const deletedProdServItems = await ProdServServices.delManyProdServItem(filtros);
        if (!deletedProdServItems) {
            throw boom.badRequest('No fue posible borrar los productos.');
        } else if (deletedProdServItems) {
            res.status(200).json(deletedProdServItems);
        }
    } catch (error) {
        next(error);
    }
};


//Agregar subdocumento

export const subProdServItem = async (req, res, next) => {
    try {
        const { id, seccion } = req.params;
        const paProdServItem = req.body;

        const updatedProdServItem = await ProdServServices.pushObjInfoAdProd(id, seccion, paProdServItem );
        if (!updatedProdServItem || updatedProdServItem.success === false) {
            throw boom.badRequest('No se pudo agregar el subdocumento del producto.');
        } else if (updatedProdServItem) {
            res.status(200).json(updatedProdServItem);
        }
    } catch (error) {
        next(error);
    }
};