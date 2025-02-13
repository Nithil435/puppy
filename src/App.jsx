import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import "./App.css";

const App = () => {
    const [message, setMessage] = useState("");
    const [showGif, setShowGif] = useState(false);
    const [showFinalMessage, setShowFinalMessage] = useState(false);
    const [gifSrc, setGifSrc] = useState("");
    const [showButtons, setShowButtons] = useState(false);
    const [funnyMessage, setFunnyMessage] = useState("");
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [userMessage, setUserMessage] = useState("");
    const [responseSent, setResponseSent] = useState(false);
    const noButtonRef = useRef(null);

    useEffect(() => {
        const noButton = noButtonRef.current;
        if (noButton) {
            noButton.addEventListener("touchstart", moveNoButtonMobile);
            noButton.addEventListener("touchmove", moveNoButtonMobile);
        }

        return () => {
            if (noButton) {
                noButton.removeEventListener("touchstart", moveNoButtonMobile);
                noButton.removeEventListener("touchmove", moveNoButtonMobile);
            }
        };
    }, []);

    const funnyMessages = [
        "Come on, Puppy! Click Yes! 🥺💕",
        "You can't escape, my love! 😆",
        "Just say YES already! 😘",
        "Running away won't help! 😂",
        "You are meant to be mine! 💖",
        "No way out! Just accept it! 😜",
        "Puppy, you're mine forever! 💖",
        "Each move = one more love point for me! 🏆",
        "Why fight destiny? Say Yes! 🥰",
        "Puppy papa say yes😘 ",
    ];
    
    //touch function
    const handleTouch = () => {
        if (!message) {
            setMessage("Only your touch can unlock my heart. 💖");
            startConfetti();
        } else if (!showGif) {
            setShowGif(true);
            setGifSrc("https://media4.giphy.com/media/gjHkRHSuHqu99y9Yjt/giphy.gif");
            setMessage("Happy Valentine's Day, My Love! ❤️🎉");
        } else if (!showFinalMessage) {
            setShowFinalMessage(true);
            setMessage("I don't ask, 'Will you be my Valentine?' 💞");
            setTimeout(() => {
                setMessage(" 'Will you be my life partner from this Valentine?' 💍");
                setShowButtons(true);
            }, 2000);
        }
    };

    const startConfetti = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#ff6b81", "#ff4757", "#ff9a9e"]
        });
    };

    const handleYesClick = () => {
        startConfetti();
        setShowButtons(false);
        setMessage("");
        setGifSrc("https://media1.giphy.com/media/IzXiddo2twMmdmU8Lv/giphy.gif");
        setTimeout(() => {
            setShowMessageBox(true);
        }, 2000);
    };
    
    //random moving button
    const moveNoButton = (e) => {
        const button = e.target;
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        button.style.position = "absolute";
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;

        const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        setFunnyMessage(randomMessage);

        setTimeout(() => setFunnyMessage(""), 2000);
    };
    
    //random moving button mobile compatibility
    const moveNoButtonMobile = () => {
        if (!noButtonRef.current) return;
        const x = Math.random() * (window.innerWidth - 100);
        const y = Math.random() * (window.innerHeight - 100);
        noButtonRef.current.style.position = "absolute";
        noButtonRef.current.style.left = `${x}px`;
        noButtonRef.current.style.top = `${y}px`;

        const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        setFunnyMessage(randomMessage);

        setTimeout(() => setFunnyMessage(""), 2000);
    };

    //google sheet for storing msgs
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userMessage.trim()) {
            try {
                const formData = new FormData();
                formData.append("Message", userMessage);
    
                const response = await fetch(
                    "https://script.google.com/macros/s/AKfycbwehvjPqco9L08BzM5rbYPCoO8tLeC5dnzW5YHEBRTZOceQ29rq5YjOufeHcTIcW40e/exec",
                    {
                        method: "POST",
                        body: formData, // Send as form data
                    }
                );
    
                const text = await response.text();
    
                if (text.trim() === "Success") {
                    setResponseSent(true);
                    setUserMessage("");
                } else {
                    alert("Failed to send message: " + text);
                }
            } catch (error) {
                alert("Error sending message: " + error.message);
            }
        }
    };
    

    return (
        <div className="container" onClick={handleTouch}>
            <h1 className="title">{message}</h1>
            {showGif && <img src={gifSrc} alt="Love Gif" style={{ width: "300px" }} />}

            {showButtons && (
                <div className="button-container">
                    <button className="yes-button" onClick={handleYesClick}>Yes 💖</button>
                    <button className="no-button" ref={noButtonRef} onMouseOver={moveNoButton} onTouchStart={moveNoButtonMobile}>No 💔</button>
                </div>
            )}

            {funnyMessage && <p className="funny-message">{funnyMessage}</p>}

            {showMessageBox && !responseSent && (
                <div className="message-container">
                    <h2 className="message-prompt">Do you want to say something? 💌</h2>
                    <form className="message-box" onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder="Write your reply here..." 
                            value={userMessage} 
                            onChange={(e) => setUserMessage(e.target.value)}
                            required 
                        />
                        <button type="submit">Send 💌</button>
                    </form>
                </div>
            )}

            {responseSent && <h2 className="thank-you">Your message has been sent! 💖</h2>}
        </div>
    );
};

export default App;
