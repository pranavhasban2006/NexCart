import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiMessageSquare, FiX, FiSend, FiMinimize2 } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

const ChatSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi there! I'm your NexCart AI assistant. How can I help you today?" }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const cart = useSelector((state) => state.cart || {});

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e, textOverride = null) => {
        if (e) e.preventDefault();

        const text = textOverride || inputText;
        if (!text.trim()) return;

        const userMessage = { role: "user", content: text };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInputText("");
        setIsLoading(true);

        try {
            const apiBaseURL = import.meta.env.DEV ? "http://localhost:9000" : (import.meta.env.VITE_API_URL || "");
            
            const response = await fetch(`${apiBaseURL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    messages: newMessages,
                    cart: cart
                 })
            });

            if (!response.ok) {
                throw new Error("Network error from chat API");
            }

            // Stream integration
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let assistantReply = "";

            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
            setIsLoading(false); // streaming starts

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunkText = decoder.decode(value, { stream: true });
                assistantReply += chunkText;

                setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1].content = assistantReply;
                    return next;
                });
            }

        } catch (error) {
            console.error("Failed to send message:", error);
            setIsLoading(false);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Oops! Something went wrong connecting to the AI. Please try again." }
            ]);
        }
    };

    const suggestedReplies = [
        "Track my order",
        "What's in my cart?",
        "Find me a product",
    ];

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-[#A38EAD] text-white p-4 rounded-full shadow-2xl hover:scale-105 hover:shadow-[#A38EAD]/50 transition-all duration-300 ease-in-out"
            >
                <FiMessageSquare size={28} />
            </button>
        );
    }

    return (
        <div className="fixed top-2 bottom-2 right-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] sm:w-[400px] sm:top-4 sm:bottom-4 sm:right-4 sm:h-[calc(100%-2rem)] bg-white/90 backdrop-blur-xl shadow-2xl z-50 flex flex-col transform transition-transform duration-300 rounded-3xl border border-white/20">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#A38EAD] text-white shadow-md rounded-t-3xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                        <FiMessageSquare size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg tracking-wide">Nexcart Assistant</h3>
                        <div className="flex items-center gap-1.5 opacity-80 text-xs">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Online
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                    <FiX size={24} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                                msg.role === "user"
                                    ? "bg-[#A38EAD] text-white rounded-br-none"
                                    : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                            }`}
                        >
                            {msg.role === "assistant" ? (
                                <div className="prose prose-sm leading-relaxed text-gray-800">
                                    <ReactMarkdown>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p className="text-[15px] leading-relaxed">{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#9caebb] rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-[#9caebb] rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-[#9caebb] rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length < 3 && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                    {suggestedReplies.map((reply) => (
                        <button
                            key={reply}
                            onClick={() => handleSendMessage(null, reply)}
                            className="bg-[#A38EAD]/10 hover:bg-[#A38EAD]/20 text-[#A38EAD] text-xs px-3 py-1.5 rounded-full border border-[#A38EAD]/30 transition-colors shadow-sm font-medium"
                        >
                            {reply}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 rounded-b-3xl">
                <form
                    onSubmit={handleSendMessage}
                    className="flex gap-2 items-end bg-gray-50 p-1.5 rounded-2xl border border-gray-200 focus-within:border-[#A38EAD] focus-within:ring-2 focus-within:ring-[#A38EAD]/30 transition-all"
                >
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 max-h-32 min-h-[44px] bg-transparent text-sm resize-none focus:outline-none px-3 py-2.5 text-gray-700 placeholder-gray-400 font-medium"
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim() || isLoading}
                        className="p-3 bg-[#A38EAD] hover:bg-[#9caebb] text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md mb-0.5 mr-0.5"
                    >
                        <FiSend size={18} />
                    </button>
                </form>
            </div>
            
        </div>
    );
};

export default ChatSidebar;
