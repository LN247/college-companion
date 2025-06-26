// frontend/src/pages/AIAssistant.jsx
import React, { useState } from 'react';
import axios from 'axios';

function AIAssistant() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const askAI = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
        },
        {
          headers: {
            Authorization: `Bearer YOUR_OPENAI_API_KEY`,
            'Content-Type': 'application/json',
          }
        }
      );
      setResponse(res.data.choices[0].message.content);
    } catch (error) {
      setResponse("There was an error. Please try again.");
    }
  };

  return (
    <div>
      <h2>💬 College Companion AI Assistant</h2>
      <form onSubmit={askAI}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about studying, dressing, anything..."
        />
        <button type="submit">Ask</button>
      </form>
      <div>
        <h4>Response:</h4>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default AIAssistant;
