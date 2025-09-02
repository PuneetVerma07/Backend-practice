require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateImage(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: prompt,
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");
      return buffer;
    }
  }
}

async function generateContent(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents : prompt
    })

    return response.text;
}

client.once("clientReady", () => {
  console.log("Bot is ready!");
});

client.on("messageCreate", async (message) => {
  const isBot = message.author.bot;

    if (isBot) return;
    
    const content = await generateContent(message.content)

    if (content) {
        message.reply(content)
    }

  
});

client.login(process.env.DISCORD_BOT_TOKEN);
