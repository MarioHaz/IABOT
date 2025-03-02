/*****************************************************
 * DEPENDENCIES & INITIAL SETUP
 *****************************************************/
const https = require("https");
const OpenAI = require("openai");

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/*****************************************************
 * HELPER: GET RESPONSE FROM OPENAI
 *****************************************************/
async function getOpenAIResponse(text) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
          Eres un asistente de atención al cliente para el marketplace "Somos el Hueco".
          Puedes responder preguntas sobre:
          - Cómo buscar productos
          - Cómo vender
          - Cómo rastrear pedidos
          - Cómo hablar con un asesor
          - Políticas de envío y devoluciones
          - PQRS (peticiones, quejas, reclamos, sugerencias)
          - Cualquier otra duda del usuario

          Responde de forma clara, concisa y amable.
          `,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
    });

    // Return the text response from the API
    return (
      completion.choices[0]?.message?.content ||
      "Lo siento, no entendí tu consulta."
    );
  } catch (error) {
    console.error("Error en OpenAI:", error);
    return "Lo siento, hubo un error procesando tu solicitud.";
  }
}

/*****************************************************
 * MAIN FUNCTION: ENVIAR MENSAJE WHATSAPP
 *****************************************************/
async function EnviarMensajeWhastpapp(texto, number) {
  // Convert the incoming text to lowercase for easier matching
  const lowerText = texto.toLowerCase();
  let data;

  /*****************************************************
   * 1) GREETING (hola, buenas) → LIST MESSAGE
   *****************************************************/
  if (
    lowerText.includes("hola") ||
    lowerText.includes("buenas") ||
    lowerText.includes("buen dia") ||
    lowerText.includes("buenos días") ||
    lowerText.includes("buenas tardes") ||
    lowerText.includes("buenas noches") ||
    lowerText.includes("buena tarde") ||
    lowerText.includes("que tal")
  ) {
    // Use a LIST message to show multiple options
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "interactive",
      interactive: {
        type: "list",
        body: {
          text: `¡Hola! 👋 Soy tu asistente de *Somos el Hueco*.\n\n¿En qué puedo ayudarte hoy? Selecciona una opción o escribe tu pregunta.`,
        },
        action: {
          button: "Ver Opciones", // The button text to view the list
          sections: [
            {
              title: "Opciones Principales",
              rows: [
                {
                  id: "productos",
                  title: "Buscar Productos",
                  description: "Explora nuestro catálogo",
                },
                {
                  id: "rastrear",
                  title: "Rastrear Pedido",
                  description: "Sigue el estado de tu compra",
                },
                {
                  id: "soporte",
                  title: "Soporte",
                  description: "Ayuda al cliente",
                },
                // Uncomment PQRS if needed:
                // {
                //   id: "pqrs",
                //   title: "PQRS",
                //   description: "Peticiones, quejas, reclamos",
                // },
              ],
            },
          ],
        },
      },
    });
  }
  // Check specific support options before the generic "soporte" condition
  else if (lowerText === "soporte_envios") {
    /*****************************************************
     * 2) SUPPORT OPTION: Envíos/Devoluciones
     *****************************************************/
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: {
        body: "Para consultas sobre envíos y devoluciones, por favor revisa nuestra política de envíos en https://www.somoselhueco.com/terms o contáctanos para asistencia adicional.",
      },
    });
  } else if (lowerText === "soporte_pagos") {
    /*****************************************************
     * 3) SUPPORT OPTION: Pagos
     *****************************************************/
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: {
        body: "Para soporte en pagos, verifica que tu método de pago esté actualizado o consulta con tu banco. Si el inconveniente persiste, contáctanos.",
      },
    });
  } else if (lowerText === "soporte_ordenes") {
    /*****************************************************
     * 4) SUPPORT OPTION: Mis Órdenes
     *****************************************************/
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: {
        body: "Para consultas sobre tus órdenes, ingresa a tu perfil, selecciona la orden correspondiente y sigue las instrucciones para ver el estado o resolver tus dudas.",
      },
    });
  } else if (lowerText.includes("productos")) {
    /*****************************************************
     * 5) USER CHOOSES 'productos'
     *****************************************************/
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: {
        body: "Para ver nuestros productos, ingresa a www.somoselhueco.com y encuentra los productos en los cuales estás interesado.",
      },
    });
  } else if (lowerText.includes("rastrear")) {
    /*****************************************************
     * 6) USER CHOOSES 'rastrear'
     *****************************************************/
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: {
        body: "📦 Para ver el estado de tu orden, ingresa a tu perfil de usuario, abre la orden que quieres revisar y da click en 'Guia de la orden'.",
      },
    });
  } else if (lowerText.includes("asesor")) {
    /*****************************************************
     * 7) USER CHOOSES 'asesor'
     *****************************************************/
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: {
        body: "Claro, enseguida te comunicaré con uno de nuestros asesores. Por favor, espera un momento...",
      },
    });
    // Here you could implement logic to notify a human agent or add the user to a queue
  } else if (lowerText.includes("soporte")) {
    /*****************************************************
     * 8) USER CHOOSES 'soporte' (generic)
     * This branch catches messages that mention 'soporte' but do not match the specific support options.
     *****************************************************/
    // Send an interactive message to choose the support area
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "¿En qué área necesitas soporte?",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "soporte_envios",
                title: "Envíos/Devoluciones",
              },
            },
            {
              type: "reply",
              reply: {
                id: "soporte_pagos",
                title: "Pagos",
              },
            },
            {
              type: "reply",
              reply: {
                id: "soporte_ordenes",
                title: "Mis Órdenes",
              },
            },
          ],
        },
      },
    });
  } else if (lowerText.includes("pqrs")) {
    /*****************************************************
     * 9) USER CHOOSES 'pqrs'
     *****************************************************/
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: {
        body: "Para enviar una petición, queja, reclamo o sugerencia, visita nuestro formulario en https://www.somoselhueco.com/pqrs. Te responderemos a la brevedad.",
      },
    });
  } else {
    /*****************************************************
     * 10) ANY OTHER TEXT → Use OpenAI GPT-3.5 for fallback
     *****************************************************/
    const aiResponse = await getOpenAIResponse(texto);
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: { body: aiResponse },
    });
  }

  /*****************************************************
   * SEND WHATSAPP MESSAGE VIA WHATSAPP CLOUD API
   *****************************************************/
  const options = {
    host: "graph.facebook.com",
    // Adjust the path to your current version if needed
    path: "/v16.0/541879115678587/messages",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
    },
  };

  const req = https.request(options, (res) => {
    let response = "";

    res.on("data", (chunk) => {
      response += chunk;
    });

    res.on("end", () => {
      console.log("WhatsApp API Response:", response);
    });
  });

  req.on("error", (err) => {
    console.error("Error sending WhatsApp message:", err);
  });

  // Write the payload (data) to the request
  req.write(data);
  req.end();
}

/*****************************************************
 * EXPORT THE FUNCTION
 *****************************************************/
module.exports = {
  EnviarMensajeWhastpapp,
};
