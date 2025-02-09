const https = require("https");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function EnviarMensajeWhastpapp(texto, number) {
  texto = texto.toLowerCase();

  if (texto.includes("hola")) {
    var data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: {
        preview_url: false,
        body: "🚀 Hola!, Como estás?, Bienvenido.",
      },
    });
  } else {
    var data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: {
        preview_url: false,
        body: "🚀 Hola, visita mi web anderson-bastidas.com ",
      },
    });
  }

  const options = {
    host: "graph.facebook.com",
    path: "/v15.0/113319844996763/messages",
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer EAAMRO41WQm4BO5pfawK1DhBms2OIWvj7OX29ZCNu3aBrPaqHlR1DttgpxZBo8TpiNre2aqVCOA8fAWKmD9uwEP9KqbxtZBc9xn62WeiDK9UfbosU4IgE4biLeank61RqUTjD1SdXRTZB9aZBFCxLpk74b9i06tIZAbL82fu8DoECLUv5ZBTY935HSzPwrlN0hEVjaN91fZCnA0uhZAjcpVS6vuogPQwew5oOE1TIZD",
    },
  };

  const req = https.request(options, (res) => {
    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.write(data);
  req.end();
}

module.exports = {
  EnviarMensajeWhastpapp,
};
