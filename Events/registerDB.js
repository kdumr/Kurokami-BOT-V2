const db = require('mongoose');

const dotenv = require('dotenv')
dotenv.config()
const { PASSDB } = process.env

console.log("[Database] -> [⏳] Conectando ao Banco de Dados...\n");

db.connect(`mongodb+srv://kurokami:${PASSDB}@kurokamibotcluster.6w00qft.mongodb.net/Discord`, { useNewUrlParser: true, useUnifiedTopology: true})

.then(() => {
    console.log('[Database] -> [✅] Conectado ao Bando de Dados');
})
.catch((error) => {
    console.error('[Database] ->[❌] Erro ao conectar ao Bando de Dados:', error)
});