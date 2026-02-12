import React, { useState, useRef, useEffect } from "react"
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa"
import { MdOutlineDeleteForever } from "react-icons/md";

import { apiConnector } from "../../services/apiconnector"
import { aiEndpoints } from "../../services/apis"
import ReactMarkdown from 'react-markdown'

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Load messages from localStorage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem("chatMessages")
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages))
        } else {
            setMessages([
                { role: "assistant", content: "Hi! I'm SkillSync AI. How can I help you today?" }
            ])
        }
    }, [])

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem("chatMessages", JSON.stringify(messages))
        }
        scrollToBottom()
    }, [messages, isOpen])

    const handleSendMessage = async () => {
        if (!input.trim()) return

        const userMessage = { role: "user", content: input }
        const newMessages = [...messages, userMessage]
        setMessages(newMessages)
        setInput("")
        setLoading(true)

        try {
            // Send conversation history, excluding initial greeting if it's the default one
            const apiMessages = newMessages.filter(m => m.content !== "Hi! I'm SkillSync AI. How can I help you today?")

            const response = await apiConnector("POST", aiEndpoints.CHAT_API, {
                messages: apiMessages
            })

            if (response.data.success) {
                const aiMessage = response.data.message
                setMessages((prev) => [...prev, aiMessage])
            }
        } catch (error) {
            console.error("Chat Error:", error)
            setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }])
        } finally {
            setLoading(false)
        }
    }

    const handleClearChat = () => {
        const initialMessage = [{ role: "assistant", content: "Hi! I'm SkillSync AI. How can I help you today?" }]
        setMessages(initialMessage)
        localStorage.removeItem("chatMessages")
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-white text-emerald-500 p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-200 border-2 border-emerald-500 animate-bounce"
            >
                <FaRobot size={30} />
            </button>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] md:w-[400px] h-[500px] bg-white border border-emerald-500 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-emerald-500 p-4 flex justify-between items-center border-b border-emerald-600">
                <div className="flex items-center gap-2 text-black font-bold">
                    <FaRobot className="text-black" />
                    SkillSync AI
                </div>
                <div className="flex gap-3 text-white">
                    <button onClick={handleClearChat} className="hover:text-emerald-200 text-black" title="Clear Chat">
                        <MdOutlineDeleteForever />
                    </button>
                    <button onClick={() => setIsOpen(false)} className="hover:text-emerald-200 text-black" title="Minimize">
                        <FaTimes />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-white">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`max-w-[80%] p-3 rounded-xl text-sm shadow-sm ${msg.role === "user"
                            ? "bg-emerald-100 text-richblack-900 self-end rounded-br-none font-medium border border-emerald-200"
                            : "bg-gray-100 text-richblack-900 self-start rounded-bl-none border border-gray-200"
                            }`}
                    >
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                ))}
                {loading && (
                    <div className="self-start bg-gray-100 p-3 rounded-xl rounded-bl-none border border-gray-200 text-black">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-black rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-white text-richblack-900 p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    autoFocus
                />
                <button
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-emerald-500 text-white p-3 rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-all font-bold shadow-md"
                >
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    )
}

export default ChatBot
