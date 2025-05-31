import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const GEMINI_API_KEY = "00000000";

const Chatbot = ({ triggerGreeting = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Défilement automatique vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Message de bienvenue au montage
  useEffect(() => {
    if (triggerGreeting) {
      setMessages([
        {
          sender: 'bot',
          text: 'Bonjour ! Je suis ton libraire virtuel 📚. Que souhaites-tu explorer aujourd’hui ? Une recommandation, un genre ou un auteur ?'
        }
      ]);
      setIsOpen(true);
    }
  }, [triggerGreeting]);

  // Appel à l'API Gemini
  const callGeminiAPI = async (userMessage) => {
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }]
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const botMessage = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas compris ta demande. 📚";
      return botMessage;
    } catch (error) {
      console.error("Erreur lors de l'appel à Gemini :", error);
      return "Oups, une erreur est survenue avec l'IA 🤖.";
    }
  };

  // Gestion de l'envoi de message
  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    if (input.length > 200) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Oups, ton message est un peu long ! Essaye quelque chose de plus court. 📖'
        }
      ]);
      setInput('');
      return;
    }

    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    const botReply = await callGeminiAPI(userMessage);

    setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    setIsTyping(false);
  }, [input]);

  // Gestion de la touche Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {/* Bouton de bascule du chatbot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-gradient-to-r from-amber-600 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label={isOpen ? "Fermer le chatbot" : "Ouvrir le chatbot"}
      >
        {isOpen ? '✕' : '📖'}
      </button>
      {/* Fenêtre du chatbot */}
      {isOpen && (
        <div className="mt-2 w-96 bg-amber-50 rounded-xl shadow-2xl overflow-hidden animate-slide-up border-2 border-amber-200">
          <div className="p-4 bg-gradient-to-r from-amber-600 to-red-600 text-white text-center font-bold text-lg flex items-center justify-center">
            <span role="img" aria-label="book" className="mr-2">📚</span> Libraire Virtuel
          </div>
          <div className="h-80 overflow-y-auto p-4 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-opacity-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                  msg.sender === 'bot'
                    ? 'bg-amber-500 text-white ml-2 shadow-md'
                    : 'bg-gray-200 text-black ml-auto shadow-sm'
                } transition-all duration-200`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="ml-2 flex items-center space-x-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 bg-amber-50 flex border-t border-amber-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-2 border border-amber-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              placeholder="Parlez de livres... 📖"
              aria-label="Saisir un message sur les livres"
            />
            <button
              onClick={handleSend}
              className="p-2 bg-amber-600 text-white rounded-r-lg hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Envoyer le message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
