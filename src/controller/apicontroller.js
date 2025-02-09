const enviarmensaje = require("../service/apiservice");
const verificar = (req, res) => {
  try {
    const tokeniabot = "IABOT";
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log("Verify Token:", token);
    console.log("Challenge:", challenge);

    if (challenge != null && token != null && token === tokeniabot) {
      // Directly send back the challenge value
      return res.status(200).send(challenge);
    } else {
      console.log("Verification failed");
      return res.status(403).send("Verification failed");
    }
  } catch (e) {
    console.error("Verification error:", e);
    return res.status(500).send("Internal Server Error");
  }
};
const recibir = (req, res) => {
  try {
    var entry = req.body["entry"][0];
    var changes = entry["changes"][0];
    var value = changes["value"];
    var objetoMensaje = value["messages"];

    var tipo = objetoMensaje[0]["type"];

    console.log("objetoMensaje", objetoMensaje);
    console.log("tipo", tipo);

    if (tipo == "interactive") {
      var tipointeractivo = objetoMensaje[0]["interactive"]["type"];

      if (tipointeractivo == "button_reply") {
        var texto = objetoMensaje[0]["interactive"]["button_reply"]["id"];
        var numero = objetoMensaje[0]["from"];

        enviarmensaje.EnviarMensajeWhastpapp(texto, numero);
      } else if (tipointeractivo == "list_reply") {
        var texto = objetoMensaje[0]["interactive"]["list_reply"]["id"];
        var numero = objetoMensaje[0]["from"];

        console.log(texto);
      }
    }

    if (typeof objetoMensaje != "undefined") {
      var messages = objetoMensaje[0];
      var texto = messages["text"]["body"];
      var numero = messages["from"];

      enviarmensaje.EnviarMensajeWhastpapp(texto, numero);
    }

    res.send("EVENT_RECEIVED");
  } catch (e) {
    /* console.log(e); */
    res.send("EVENT_RECEIVED");
  }
};

module.exports = {
  verificar,
  recibir,
};
