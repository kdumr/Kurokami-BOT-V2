const { QuickDB } = require("quick.db")
const db = new QuickDB()

const chave = 'exemplo'; // Chave que você deseja verificar

try {
  const valor = db.get(chave); // Tenta obter o valor da chave
  if (valor === undefined) {
    // Se o valor for indefinido, significa que a chave não existe
    db.set(chave, 'valor padrão'); // Cria o registro com um valor padrão
  }
} catch (error) {
  // Se ocorrer um erro ao acessar o banco de dados, pode ser que a chave não exista
  db.set(chave, 'valor padrão'); // Cria o registro com um valor padrão
}
console.log(db.get(chave))