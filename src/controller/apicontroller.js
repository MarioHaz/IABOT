const enviarmensaje = require("../service/apiservice");

const verificar = (req, res) => {
  try {
    const tokeniabot = "IABOT";
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

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
    const entry = req.body["entry"][0];
    const changes = entry["changes"][0];
    const value = changes["value"];
    const objetoMensaje = value["messages"];

    if (!objetoMensaje) {
      return res.status(200).send("No message");
    }

    // Use the first message in the array
    const message = objetoMensaje[0];
    const numero = message["from"];
    const tipo = message["type"];

    if (tipo === "interactive") {
      const interactiveType = message["interactive"]["type"];

      if (interactiveType === "button_reply") {
        const texto = message["interactive"]["button_reply"]["id"];
        enviarmensaje.EnviarMensajeWhastpapp(texto, numero);
      } else if (interactiveType === "list_reply") {
        const texto = message["interactive"]["list_reply"]["id"];
        // Now calling the function when a list option is selected.
        enviarmensaje.EnviarMensajeWhastpapp(texto, numero);
      } else if (interactiveType === "list_reply") {
        const texto = message["interactive"]["list_reply"]["id"];
        // Now calling the function when a list option is selected.
        enviarmensaje.EnviarMensajeWhastpapp(texto, numero);
      }
    } else if (tipo === "text") {
      const texto = message["text"]["body"];
      enviarmensaje.EnviarMensajeWhastpapp(texto, numero);
    }

    res.send("EVENT_RECEIVED");
  } catch (e) {
    console.error("Error processing message:", e);
    res.send("EVENT_RECEIVED");
  }
};

module.exports = {
  verificar,
  recibir,
};
