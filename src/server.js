import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
require('./models/index')
//import routes from './routes';
//import { isAuthenticated } from './utils/isAuthenticated';

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res) => {
  res.status(404).send('Página não encontrada')
});

app.listen(3000, () => {
  console.log(`Servidor rodando na porta 3000!`);
});