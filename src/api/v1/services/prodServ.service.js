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
    console.log('paProdServItem: ', paProdServItem);
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
        }}
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
        }}
};

export const putProdServItem = async (id, paProdServItem) => {
    try {
        return await ProdServ.findOneAndUpdate({ IdProdServOK: id }, paProdServItem, {
            new: true,
        });
    } catch (error) { throw boom.badImplementation(error); }
};

export const delProdServItem = async (id) => {
    try {
        return await ProdServ.findOneAndDelete({ IdProdServOK: id });
    } catch (error) { throw boom.badImplementation(error); }
};

export const delManyProdServItem = async (filtro) => {
    try {
        return await ProdServ.deleteMany(filtro);
    } catch (error) { throw boom.badImplementation(error); }
};

// Agregar subdocumentos
export const pushObjInfoAdProd = async (id, seccion = '', objInfoAd) => {
    console.log('ID recibido:', id);
    console.log('Sección:', seccion);

    const seccionesValidas = ['estatus', 'presentaciones', 'info_ad'];
    if (!seccionesValidas.includes(seccion)) {
        console.error('Sección no válida:', seccion);
        return { success: false, error: 'Subdocumento no existe o no es válido' };
    }

    try {
        console.log('Objeto a agregar:', objInfoAd);
        const productUpdatedProd = await ProdServ.findOneAndUpdate(
            { IdProdServOK: id }, 
            { $push: { [seccion]: objInfoAd } },
            { new: true } 
        );

        if (!productUpdatedProd) {
            console.error('No se encontró el documento con IdProdServBK:', id);
            return { success: false, error: 'Documento no encontrado' };
        }

        console.log('Documento agregado:', productUpdatedProd);
        return { success: true, productUpdatedProd };
    } catch (error) {
        console.error('Error al agregar el documento:', error);
        return { success: false, error };
    }
};

export const delObjInfoAdProd = async (id, seccion = '', idSubDoc) => {

    const seccionesValidas = ['estatus', 'presentaciones', 'info_ad'];
    if (!seccionesValidas.includes(seccion)) {
        console.error('Sección no válida:', seccion);
        return { success: false, error: 'Subdocumento no existe o no es válido' };
    }

    let campo = "";
    try {
        if ( seccion === "estatus" ) {
            campo = "IdTipoEstatusOK"
        } else if ( seccion === "presentaciones" ) {
            campo = "IdPresentaOK"
        } else {
            campo = "IdEtiqueta"
        }
        const productUpdatedProd = await ProdServ.findOneAndUpdate(
            { IdProdServOK: id }, 
            { $pull: { [seccion]: { [campo]: idSubDoc } } }, 
            { new: true } 
        );

        if (!productUpdatedProd) {
            console.error('No se encontró el documento con IdProdServBK:', id);
            return { success: false, error: 'Documento no encontrado' };
        }

        console.log('Documento actualizado después de la eliminación:', productUpdatedProd);
        return { success: true, productUpdatedProd };
    } catch (error) {
        console.error('Error al intentar eliminar el subdocumento:', error);
        return { success: false, error };
    }
};

export const updateObjInfoAdProd = async (id, seccion = '', objInfoAd) => {
    console.log('ID recibido:', id);
    console.log('Sección:', seccion);

    const seccionesValidas = ['estatus', 'presentaciones', 'info_ad'];
    if (!seccionesValidas.includes(seccion)) {
        console.error('Sección no válida:', seccion);
        return { success: false, error: 'Subdocumento no existe o no es válido' };
    }
    try {
        console.log('Objeto a actualizar:', objInfoAd);
        const productUpdatedProd = await ProdServ.findOneAndUpdate(
            { IdProdServOK: id, [`${seccion}.IdTipoEstatusOK`]: objInfoAd.IdTipoEstatusOK }, 
            { $set: { [`${seccion}.$`]: objInfoAd } }, 
            { new: true } 
        );
        if (!productUpdatedProd) {
            console.error('No se encontró el documento o el subdocumento con los IDs proporcionados:', id, objInfoAd._id);
            return { success: false, error: 'Documento o subdocumento no encontrado' };
        }
        console.log('Documento actualizado:', productUpdatedProd);
        return { success: true, productUpdatedProd };
    } catch (error) {
        console.error('Error al actualizar el subdocumento:', error);
        return { success: false, error };
    }
};

export const addSubPresenta = async (id, presentaId, seccion = '', objInfoAd) => {
    console.log('ID recibido:', id);
    console.log('presentaId: ',presentaId);
    console.log('Sección:', seccion);

    const seccionesValidas = ['estatus', 'info_vta', 'archivos'];
    if (!seccionesValidas.includes(seccion)) {
        return { success: false, error: 'Subdocumento no existe o no es válido' };
    }
    try {
        const estatusAdd = await ProdServ.findOneAndUpdate(
            { IdProdServOK: id, 'presentaciones.IdPresentaOK': presentaId }, 
            {$push: { [`presentaciones.$.${seccion}`]: objInfoAd } },
            { new: true } 
        );
        if (!estatusAdd) {
            console.error('No se encontró el documento con IdProdServOK:', id);
            return { success: false, error: 'Documento no encontrado' };
        }
        console.log('Documento agregado:', estatusAdd);
        return { success: true, estatusAdd };
    } catch (error) {
        console.error('Error al agregar el subdocumento:', error);
        return { success: false, error };
    }
};


export const updateInfoAdProd = async (id, seccion = '', objInfoAd, infoAdId) => {
    console.log('ID recibido:', id);
    console.log('Sección:', seccion);

    const seccionesValidas = ['estatus', 'presentaciones', 'info_ad'];
    if (!seccionesValidas.includes(seccion)) {
        console.error('Sección no válida:', seccion);
        return { success: false, error: 'Subdocumento no existe o no es válido' };
    }

    try {
        console.log('Objeto a actualizar:', objInfoAd.infoAdId);

        const productUpdatedProd = await ProdServ.findOneAndUpdate(
            { IdProdServOK: id, [`${seccion}._id`]: infoAdId }, 
            { $set: { [`${seccion}.$`]: objInfoAd } }, 
            { new: true } 
        );

        if (!productUpdatedProd) {
            console.error('No se encontró el documento o el subdocumento con los IDs proporcionados:', id, objInfoAd._id);
            return { success: false, error: 'Documento o subdocumento no encontrado' };
        }

        console.log('Documento actualizado:', productUpdatedProd);
        return { success: true, productUpdatedProd };
    } catch (error) {
        console.error('Error al actualizar el subdocumento:', error);
        return { success: false, error };
    }
};

export const delInfoAdProd = async (id, seccion = '', idSubDoc) => {
    console.log('ID recibido:', id);
    console.log('Sección:', seccion);
    console.log('ID del subdocumento a eliminar:', idSubDoc);

    const seccionesValidas = ['estatus', 'presentaciones', 'info_ad'];
    if (!seccionesValidas.includes(seccion)) {
        console.error('Sección no válida:', seccion);
        return { success: false, error: 'Subdocumento no existe o no es válido' };
    }

    try {
        const productUpdatedProd = await ProdServ.findOneAndUpdate(
            { IdProdServOK: id }, 
            { $pull: { [seccion]: { _id: idSubDoc } } }, 
            { new: true } 
        );

        if (!productUpdatedProd) {
            console.error('No se encontró el documento con IdProdServBK:', id);
            return { success: false, error: 'Documento no encontrado' };
        }

        console.log('Documento actualizado después de la eliminación:', productUpdatedProd);
        return { success: true, productUpdatedProd };
    } catch (error) {
        console.error('Error al intentar eliminar el subdocumento:', error);
        return { success: false, error };
    }
};