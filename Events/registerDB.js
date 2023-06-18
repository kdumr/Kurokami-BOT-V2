const db = require('mongoose');

const dotenv = require('dotenv')
dotenv.config()
const { PASSDB } = process.env

db.connect(`mongodb+srv://kurokami:${PASSDB}@kurokamibotcluster.6w00qft.mongodb.net/Discord`, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('-> Conectado ao Database');
})
.catch((error) => {
    console.error('-> Erro ao conectar ao Database:', error)
});