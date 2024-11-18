import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
//imports Swagger
//imports Routes
import routeAPI from './api/v1/routes/index';
//imports Middlewares
//Config para variables de entorno
import config from './config/config';
//Declaramos la constante app igualandola a express
const app = express();
import { mongoose } from './config/database.config';
//Settings
app.set('port', config.PORT);
// Middlewares generales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Routes
const api = config.API_URL;
app.get(`${api}`, (req,res)=>{
    res.send(
        `<h1>RESTful running in root</h1> <p> eCommerce: <b>${api}/api-docs</b> for more information.</p>`
    );
})
app.get('/DrFIC', (req,res)=>{
    res.send(
        `<h1>RESTful running in DrFIC</h1> <p> eCommerce: <b>${api}/api-docs</b> for more information.</p>`
    );
})
// Routes
routeAPI(app);
// Swagger Docs
// Middleware para el manejo de errores
// Export App
export default app;