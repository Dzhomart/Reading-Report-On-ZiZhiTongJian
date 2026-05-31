
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

async function chat() {
  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-v4-pro',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: '你好，请介绍一下你自己' }
      ],
      thinking: { type: 'enabled' },
      reasoning_effort: 'high',
      stream: false
    });

    console.log('AI 回复:', response.choices[0].message.content);
  } catch (error) {
    console.error('调用出错:', error);
  }
}

chat();
