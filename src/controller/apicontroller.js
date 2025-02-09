const verificar = (req, res) => {
  res.send("verificar");
};

const recibir = (req, res) => {
  res.send("recibir");
};

module.exports = {
  verificar,
  recibir,
};
