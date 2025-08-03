import React, { useState } from "react";
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';

const initialMessages = [
  { from: "bot", text: "Hi! Tell me the waste item and I'll classify it for you (e.g., 'plastic bottle', 'banana peel')." },
];

function classifyWaste(message) {
  const text = message.toLowerCase();
  if (text.includes("plastic") || text.includes("bottle") || text.includes("can") || text.includes("paper") || text.includes("cardboard")) {
    return "This is likely Recyclable waste. Please put it in the recycling bin!";
  }
  if (text.includes("banana") || text.includes("food") || text.includes("peel") || text.includes("apple") || text.includes("vegetable") || text.includes("fruit")) {
    return "This is Organic waste. Compost it if possible!";
  }
  if (text.includes("battery") || text.includes("paint") || text.includes("chemical") || text.includes("medicine")) {
    return "This is Hazardous waste. Please dispose of it at a hazardous waste facility!";
  }
  if (text.includes("mask") || text.includes("tissue") || text.includes("diaper")) {
    return "This is Biomedical waste. Please dispose of it safely!";
  }
  if (text.includes("glass")) {
    return "This is Glass waste. Please recycle it if possible!";
  }
  if (text.includes("metal")) {
    return "This is Metal waste. Please recycle it if possible!";
  }
  return "Sorry, I couldn't classify that item. Please provide more details or try another item.";
}

const CHATBOT_LOGO_URL = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"; // You can use a different logo if you want

const ChatbotText = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    const botReply = classifyWaste(input);
    setTimeout(() => {
      setMessages((msgs) => [...msgs, { from: "bot", text: botReply }]);
    }, 600);
    setInput("");
  };

  return (
    <>
      <Button
        variant="success"
        className="position-fixed bottom-0 end-0 m-5 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
        style={{ width: 60, height: 60, fontSize: "1.8rem", zIndex: 1050, background: '#B3E5FC', color: '#333', boxShadow: '0 6px 24px rgba(0,0,0,0.10)' }}
        onClick={() => setOpen(true)}
        aria-label="Open Text Chatbot"
      >
        📝
      </Button>
      <Modal show={open} onHide={() => setOpen(false)} centered size="sm">
        <Modal.Header closeButton className="bg-success text-white" style={{ background: '#B3E5FC', color: '#333', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
          <Modal.Title>
            <img
              src={CHATBOT_LOGO_URL}
              alt="Chatbot Logo"
              style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 10, verticalAlign: 'middle', background: '#fff' }}
            />
            Text Waste Classifier
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#fff", height: 400, overflowY: "auto", borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 text-${msg.from === "user" ? "end" : "start"}`}>
              <span className={`badge ${msg.from === "user" ? "bg-success" : "bg-light text-dark border"}`}>{msg.text}</span>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className="bg-white" style={{ borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
          <Form className="w-100" onSubmit={handleSend} autoComplete="off">
            <InputGroup>
              <Form.Control
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a waste item..."
              />
              <Button variant="success" type="submit" style={{ background: '#B3E5FC', color: '#333', borderRadius: 6, fontWeight: 600, border: 'none' }}>
                Send
              </Button>
            </InputGroup>
          </Form>
        </Modal.Footer>
        <div className="text-center text-muted small py-2">
          (Try: "plastic bottle", "banana peel", "battery", etc.)
        </div>
      </Modal>
    </>
  );
};

export default ChatbotText; 