const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
// The API key should be in the .env file as GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are Tracky AI, a helpful financial assistant integrated into the Tracky personal finance app.
Your goal is to help users manage their finances, optimize their budget, and answer questions about their data.

You have access to the user's financial data for the current month.
You can also perform actions to modify this data (create cards, remove items, etc.).

The data structure is as follows:
- monthlySalary: number
- monthlyBills: Array of { id, name, budget, spent, isPaid }
- expenses: Array of { id, name, amount, date }
- goals: Array of { id, name, totalAmount, currentAmount, monthlyPayment }
- totalSavings: number

When the user asks you to do something, you should reply with a JSON object containing a "message" (your text response) and an optional "actions" array.

Supported actions:
1. ADD_BILL: { type: 'ADD_BILL', data: { name: string, budget: number } }
2. REMOVE_BILL: { type: 'REMOVE_BILL', id: string } (You need to find the ID from the context)
3. UPDATE_BILL: { type: 'UPDATE_BILL', id: string, data: { budget: number } }
4. ADD_GOAL: { type: 'ADD_GOAL', data: { name: string, totalAmount: number, monthlyPayment: number } }
5. REMOVE_GOAL: { type: 'REMOVE_GOAL', id: string }
6. UPDATE_GOAL: { type: 'UPDATE_GOAL', id: string, data: { monthlyPayment: number } }
7. ADD_EXPENSE: { type: 'ADD_EXPENSE', data: { name: string, amount: number } }
8. ADD_BILL_PAYMENT: { type: 'ADD_BILL_PAYMENT', id: string, data: { amount: number, note?: string } }
9. UPDATE_SALARY: { type: 'UPDATE_SALARY', amount: number }

If the user describes adding money to an existing monthly bill (e.g., "add $20 to Gas Money"), respond with an ADD_BILL_PAYMENT action and do not create an expense.

If the user asks a question, just provide the "message".
If the user asks to modify data, provide the "message" confirming the action and the "actions" array.

IMPORTANT:
- Always return valid JSON.
- Do not include markdown formatting (like \`\`\`json) in your response, just the raw JSON string.
- If you need to remove an item, look for its ID in the provided context. If you can't find it, ask the user for clarification.
- Be concise and helpful.
- When including newlines in the "message" string, use the literal characters \\n, do not use actual newlines.
- You can use Markdown in the "message" field (bold, lists, etc.).
`;

router.post('/chat', async (req, res) => {
  try {
    const { message, context, history } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Construct history for Gemini
    const chatHistory = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am ready to assist with Tracky financial data.' }],
      }
    ];

    // Append previous conversation history if available
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        chatHistory.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        });
      });
    }

    const chat = model.startChat({
      history: chatHistory,
    });

    // Add context to the message
    const userMessageWithContext = `
Current Financial Data:
${JSON.stringify(context, null, 2)}

User Message:
${message}
`;

    const result = await chat.sendMessage(userMessageWithContext);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    let parsedResponse;
    try {
        // Clean up potential markdown code blocks if the model ignores instructions
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedResponse = JSON.parse(cleanText);
    } catch (e) {
        console.warn('JSON parse failed, attempting to recover or fallback', e);
        // Fallback if not JSON
        parsedResponse = {
            message: text,
            actions: []
        };
    }

    res.json(parsedResponse);

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

module.exports = router;
