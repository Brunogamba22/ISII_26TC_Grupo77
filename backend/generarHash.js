const bcrypt = require("bcryptjs");

async function generar() {

  const adminHash = await bcrypt.hash(
    "Admin123",
    10
  );

  const medicoHash = await bcrypt.hash(
    "Medico123",
    10
  );

  console.log(adminHash);
  console.log(medicoHash);

}

generar();