const bcrypt = require('bcrypt');

async function testBcrypt() {
  const password = 'admin';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Hash gerado:', hash);

  const isValid = await bcrypt.compare('admin', hash);
  console.log('Senha válida?', isValid); // Deve ser true

  const isValidWrong = await bcrypt.compare('senhaerrada', hash);
  console.log('Senha inválida?', isValidWrong); // Deve ser false
}

testBcrypt();