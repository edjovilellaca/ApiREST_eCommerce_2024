import ProdServ from '../models/ProdServ';
import boom from '@hapi/boom';
import { OK, FAIL } from '../middleware/resp.handler';
var mongoose = require('mongoose');

export const getProdServList = async() => {
    let ProdServList;
    try{
        ProdServList = await ProdServ.find();
        return(ProdServList);
    }catch(error){
        throw boom.internal(error);
    }
};

export const getProdServItem = async( id, keyType) => {
    let prodServItem;
    try{

        if(keyType == 'OK'){
            
            prodServItem = await ProdServ.findOne({
                IdProdServOK: id,
            }); 

        }else if (keyType == 'BK') {
            
            prodServItem = await ProdServ.findOne({
                IdProdServBK: id,
            });
        }

        return prodServItem;

    }catch(error){
        throw boom.internal(error);
    }
};

export const postProdServItem = async( paProdServItem ) => {

    try{

        const newProdServ = new ProdServ( paProdServItem );
        return await newProdServ.save();

    }catch(error){

        if (error.code === 11000) {

            throw FAIL(
                'El producto enviado ya está registradas en el catalogo.',
                error
            );

        } else {

            throw FAIL(
                'No se pudo agregar el producto al catalogo. Error en el servidor.',
                error
            );

        }
    }

};

export const addManyProdServ = async ( manyProdServ ) => {
    try {
        const manyProdServAdded = await cat_personas.insertMany(manyProdServ, { order: true });
        return OK('Productos(s) agregado(s) correctamente al catalogo.', manyProdServAdded);
    } catch (error) {
        if (error.code === 11000) {
            return FAIL(
                'Alguno(s) de los productos enviadas ya están registradas en el catalogo de la BD. Verifica la información e intenta de nuevo.',
                error
            );
        } else {
            return FAIL(
                'No se pudo agregar el producto al catalogo. Error en el servidor.',
                error
            );
        }
    }
};

export const putProdServItem = async (id, paProdServItem) => {
    try {
        return await ProdServ.findOneAndUpdate({ IdProdServOK: id }, paProdServItem, {
            new: true,
        });
    } catch (error) {   
        throw boom.badImplementation(error);
    }
};

export const delProdServItem = async (id) => {
    try {
        return await ProdServ.findOneAndDelete({ IdProdServOK: id });
    } catch (error) {   
        throw boom.badImplementation(error);
    }
};

export const delManyProdServItem = async (filtro) => {
    try {
        return await ProdServ.deleteMany(filtro);
    } catch (error) {   
        throw boom.badImplementation(error);
    }
};

export const pushObjInfoAdProd = async (id, seccion = '', objInfoAd) => {
    if(!seccion.match('cat_prod_serv_estatus' && !seccion.match('cat_prod_serv_archivos'))){
        return { succes: false, error: 'Subdocumento no existe' };
    }
    try {
        const productUpdatedProd = await ProdServ.findOneAndUpdate(
            { IdProdServBK: id },
            { $push: { seccion: objInfoAd } },
            { new: true }
        );
        return { succes: true, productUpdatedProd };
    } catch (error) {
        return { succes: false, error };
    }
};