import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return; // Não envia se o input estiver vazio ou apenas espaços em branco

    // Add user message to the chat
    const msg = [...messages, { content: input, role: "user" }];
    setMessages(msg);
    setInput("");

    // Call OpenAI API to get the bot's response
    const response = await getOpenAIResponse(msg);
    setMessages([
      ...msg,
      { content: response, role: "assistant" },
    ]);
  };

  const getOpenAIResponse = async (userInput) => {
    // Make API request to OpenAI
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: userInput }),
    });

    const data = await response.json();
    return data.output;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Impede o comportamento padrão de nova linha
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div
        id="chat-container"
        className="overflow-y-auto p-10 rounded-md max-w-3xl mx-auto fixed bottom-0 left-0 right-0 mb-10 bg-black"
      >
        <div>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${
                message.role === "assistant" ? "text-blue-600" : "text-green-600"
              }`}
            >
              <span className="font-bold">{`${message.role}: `}</span>
              {message.role === "assistant" && <span>{message.content}</span>}
              {message.role !== "assistant" && message.content}
            </div>
          ))}
        </div>
        <div className="pt-5 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown} // Chama a função quando uma tecla é pressionada
            className="flex-1 p-2 border rounded-md text-black bg-transparent focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}