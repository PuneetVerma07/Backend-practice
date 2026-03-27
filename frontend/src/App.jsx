import React, { useState, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";

const App = () => {
	const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null)

	const handleSendMessage = (e) => {
		e.preventDefault();

		if (inputValue.trim() === "") return;

		// Add user message to conversation history
		const newMessage = {
			id: Date.now(),
			text: inputValue,
			sender: "user",
			timestamp: new Date().toLocaleTimeString(),
		};

    setMessages([...messages, newMessage]);

    socket.emit("ai-message", inputValue)

		setInputValue("");

		
  };
  
  useEffect(() => {
    let socketInstance = io("http://localhost:3000");
    setSocket(socketInstance)

    socketInstance.on("ai-message-response", (response) => {
			// Simulate AI response
			
				const aiResponse = {
					id: Date.now() + 1,
					text: response,
					sender: "ai",
					timestamp: new Date().toLocaleTimeString(),
				};
				setMessages((prevMessages) => [...prevMessages, aiResponse]);
		
		});
    
  }, [])
  

	return (
		<div className="chat-container">
			<div className="chat-header">
				<h1>Chat Application</h1>
			</div>

			<div className="messages-container">
				{messages.length === 0 ? (
					<div className="empty-state">
						<p>Start a conversation...</p>
					</div>
				) : (
					messages.map((message) => (
						<div
							key={message.id}
							className={`message ${message.sender === "user" ? "user-message" : "ai-message"}`}
						>
							<div className="message-content">
								<p>{message.text}</p>
								<span className="timestamp">{message.timestamp}</span>
							</div>
						</div>
					))
				)}
			</div>

			<form className="input-form" onSubmit={handleSendMessage}>
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Type your message here..."
					className="message-input"
				/>
				<button type="submit" className="send-button">
					Send
				</button>
			</form>
		</div>
	);
};

export default App;
