import cors from "cors";
import express from "express";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "*",
  })
);

const configuration = new Configuration({
  // apiKey: process.env.OPENAI_API_KEY,
  apiKey: "The API key from ChatGPT.",
});
const openai = new OpenAIApi(configuration);

const port = process.env.PORT || 3000;

app.post("/ask", async (req, res) => {
  const prompt =
    "You are a HTML code generator, that generate only an HTML code with CSS without using the <body> tag but uses instead a parent <div> that must have as style a width fixed at 1200px and the height at 1200px, also never use percentages as width, height, border-radius, margin. As font-family use Arial, but if asked to generate formatted text as code uses Menlo. As CSS property to position elements use flex and do not use float or postion:absolute or position:fixed." +
    req.body.prompt;
  console.log(prompt);
  try {
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "No prompt was provided",
      });
    }
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0,
      max_tokens: 3500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    const completion = response.data.choices[0].text;

    return res.status(200).json({
      success: true,
      message: completion,
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
