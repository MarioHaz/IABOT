const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getCompletion() {
  const response = await openai.completions.create({
    model: "text-davinci-002",
    prompt: "que es lima?",
    temperature: 0.5,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  });
  console.log(response.data.choices[0].text);
}

getCompletion();
