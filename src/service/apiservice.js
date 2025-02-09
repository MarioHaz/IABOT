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
  if (lowerText.includes("hola") || lowerText.includes("buenas")) {
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
                  id: "vender",
                  title: "Vender Artículos",
                  description: "Publica tus productos",
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
                {
                  id: "asesor",
                  title: "Hablar con un asesor",
                  description: "Conecta con un agente humano",
                },
                {
                  id: "pqrs",
                  title: "PQRS",
                  description: "Peticiones, quejas, reclamos",
                },
              ],
            },
          ],
        },
      },
    });
  } else if (lowerText.includes("productos")) {

  /*****************************************************
   * 2) USER CHOOSES 'productos'
   *****************************************************/
    data = JSON.stringify({
      messaging_product: "whatsapp",
      to: number,
      type: "interactive",
      interactive: {
        type: "list",
        body: {
          text: "🔍 ¿Qué tipo de productos buscas?",
        },
        action: {
          button: "Categorías",
          sections: [
            {
              title: "Categorías Populares",
              rows: [
                {
                  id: "tecnologia",
                  title: "Tecnología",
                  description: "Celulares, laptops, accesorios",
                },
                {
                  id: "hogar",
                  title: "Hogar",
                  description: "Muebles, decoración, electrodomésticos",
                },
                {
                  id: "moda",
                  title: "Moda",
                  description: "Ropa, calzado, accesorios",
                },
              ],
            },
            {
              title: "Más Categorías",
              rows: [
                {
                  id: "deportes",
                  title: "Deportes",
                  description: "Equipos, indumentaria, suplementación",
                },
                {
                  id: "libros",
                  title: "Libros",
                  description: "Novedades y bestsellers",
                },
              ],
            },
          ],
        },
      },
    });
  } else if (lowerText.includes("vender")) {

  /*****************************************************
   * 3) USER CHOOSES 'vender'
   *****************************************************/
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: `📦 Para publicar tu producto:\n1. Visita www.somoselhueco.com/vender\n2. Crea tu anuncio con fotos\n3. ¡Listo! Te contactaremos con compradores interesados.\n\n¿Necesitas ayuda con el proceso?`,
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "guia_venta",
                title: "Sí, envíame la guía",
              },
            },
            {
              type: "reply",
              reply: {
                id: "no_gracias",
                title: "No, gracias",
              },
            },
          ],
        },
      },
    });
  } else if (lowerText.includes("rastrear")) {

  /*****************************************************
   * 4) USER CHOOSES 'rastrear'
   *****************************************************/
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: {
        body: "📦 Ingresa tu número de seguimiento (ej: SEH-12345):",
      },
    });
  } else if (lowerText.includes("asesor")) {

  /*****************************************************
   * 5) USER CHOOSES 'asesor'
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
    // *** Here you could implement logic to notify a human agent or add the user to a queue ***
  } else if (lowerText.includes("soporte")) {

  /*****************************************************
   * 6) USER CHOOSES 'soporte'
   *****************************************************/
    data = JSON.stringify({
      messaging_product: "whatsapp",
      to: number,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "¿En qué tipo de soporte necesitas ayuda?",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "envios",
                title: "Envíos/Devoluciones",
              },
            },
            {
              type: "reply",
              reply: {
                id: "pagos",
                title: "Pagos",
              },
            },
            {
              type: "reply",
              reply: {
                id: "ordenes",
                title: "Mis Órdenes",
              },
            },
          ],
        },
      },
    });
  } else if (lowerText.includes("pqrs")) {

  /*****************************************************
   * 7) USER CHOOSES 'pqrs'
   *****************************************************/
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: {
        body: `Para enviar una petición, queja o reclamo, visita nuestro formulario de PQRS en:\n\nhttps://www.somoselhueco.com/pqrs\n\nAllí podrás exponer tu caso para recibir asistencia personalizada.`,
      },
    });
  } else if (lowerText.includes("guia_venta")) {

  /*****************************************************
   * 8) USER CHOOSES 'guia_venta' (button reply)
   *****************************************************/
    data = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: number,
      type: "text",
      text: {
        body: `Aquí está la guía para vender tus productos:\n\n1. Prepara buenas fotos\n2. Describe tu producto con detalle\n3. Indica precio y método de envío\n4. Publica en www.somoselhueco.com/vender\n\nSi tienes alguna otra duda, ¡estoy aquí para ayudarte!`,
      },
    });
  } else {

  /*****************************************************
   * 9) ANY OTHER TEXT → Use OpenAI GPT-3.5 for fallback
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
