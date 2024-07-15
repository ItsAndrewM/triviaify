// "use client";

// import { useState } from "react";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";

// export function ChatRoom() {
// 	const [chatMessages, setChatMessages] = useState([
// 		{ sender: "Player 1", message: "Hey everyone!" },
// 		{ sender: "Player 3", message: "Hi there!" },
// 		{ sender: "Player 5", message: "Hello!" },
// 	]);
// 	const [newMessage, setNewMessage] = useState("");
// 	const [isLoading, setIsLoading] = useState(false);
// 	const currentUser = "Player 1";
// 	const creator = "Player 3";
// 	const handleSendMessage = async () => {
// 		setIsLoading(true);

// 		if (newMessage.trim() !== "") {
// 			setChatMessages([
// 				...chatMessages,
// 				{ sender: currentUser, message: newMessage },
// 			]);
// 			setNewMessage("");
// 		}
// 		await new Promise((resolve) => setTimeout(resolve, 1000));
// 		setIsLoading(false);
// 	};
"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSocket } from "@/hooks/useSocket";

export function ChatRoom({ sessionCode }: { sessionCode: string }) {
	const [chatMessages, setChatMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentUser, setCurrentUser] = useState("display_name"); // You'll need to set this based on user authentication
	const { socket, isConnected } = useSocket();
	const chatContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (socket && isConnected) {
			// Join the specific chat room
			socket.emit("joinRoom", sessionCode);
			console.log(`Joined room: ${sessionCode}`);

			// Listen for new messages

			socket.on("newMessage", (message) => {
				// @ts-ignore
				setChatMessages((prevMessages) => [...prevMessages, message]);
			});

			// Clean up on component unmount
			return () => {
				socket.off("newMessage");
				socket.emit("leaveRoom", sessionCode);
				console.log(`Left room: ${sessionCode}`);
			};
		}
	}, [socket, isConnected, sessionCode]);

	useEffect(() => {
		// Scroll to bottom when new messages are added
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [chatMessages]);

	const handleSendMessage = async () => {
		setIsLoading(true);

		if (newMessage.trim() !== "" && socket) {
			const messageData = {
				sender: currentUser,
				message: newMessage,
				sessionCode: sessionCode,
			};

			// Emit the message to the server
			socket.emit("sendMessage", messageData);
			console.log("New message received:", messageData);
			// @ts-ignore
			setChatMessages((prevMessages) => [...prevMessages, messageData]);
			setNewMessage("");
		}
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsLoading(false);
		console.log(socket);
	};

	console.log(chatMessages);

	return (
		<div className="mt-8">
			<h3 className="text-lg font-semibold mb-4">Group Chat</h3>
			<div
				className="bg-muted rounded-lg p-4 h-48 overflow-y-auto"
				ref={chatContainerRef}
			>
				{chatMessages.map((message, index) => (
					<div
						key={index}
						className={`flex ${
							// @ts-ignore
							message.sender === currentUser ? "justify-end" : "justify-start"
						} mb-2`}
					>
						<div
							className={`p-2 rounded-lg ${
								// @ts-ignore
								message.sender === currentUser
									? "bg-blue-500 text-white"
									: // @ts-ignore
									message.sender === "Player 3" ||
									  // @ts-ignore
									  message.sender === "Player 5"
									? "bg-muted-foreground text-white"
									: "bg-muted-foreground text-foreground"
							}`}
						>
							<span className="font-semibold">
								{/* @ts-ignore */}
								{message.sender}:
							</span>
							{/* @ts-ignore */}
							{message.message}
						</div>
					</div>
				))}
			</div>
			<div className="flex mt-4">
				<Input
					type="text"
					placeholder="Type your message..."
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className="flex-1 mr-2"
					disabled={isLoading}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !isLoading) {
							handleSendMessage();
						}
					}}
				/>
				<Button onClick={handleSendMessage} disabled={isLoading}>
					Send
				</Button>
			</div>
		</div>
	);
}
