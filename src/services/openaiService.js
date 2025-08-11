const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateResponse(message) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: message,
      max_tokens: 150
    });
    return completion.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating GPT response:', error);
    return 'Sorry, I encountered an error while processing your request.';
  }
}

module.exports = { generateResponse };

