"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useWebSocket } from "@/lib/context/webSocketContext";
import {
  useGameIdStore,
  useImageSelectionStore,
  usePlayerStore,
} from "@/stores/store";
import { ImageState } from "@/stores/store";

type image = {
  id: string;
  imageUrl: string;
  imageName: string;
  poolId: string;
};
export default function GameDashboard() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [messages, setMessages] = useState<
    Array<{ text: string; sender: "user" | "opponent" }>
  >([{ text: "Good luck! 👀", sender: "opponent" }]);
  const [inputValue, setInputValue] = useState("");
  const [guessedId, setGuessedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { isSelected, isBothSelected, setIsBothSelected, setIsSelected } = useImageSelectionStore();
  const { gameId } = useGameIdStore();
  const { player } = usePlayerStore();
  const [images, setImages] = useState<image[]>([]);
  const [imageStates, setImageStates] = useState<Record<string, ImageState>>(
    Object.fromEntries(images.map((image) => [image.id, "normal"]))
  );

  const mySocket = useWebSocket();

  const topTexts = [
    "Select An Image to Start",
    "Waiting for Opponet to Select An Image",
    "Guess Who! 🎭",
  ];

  const sendWebSocketMessage = async (type: string, data: any) => {
    if (mySocket.socket?.readyState == WebSocket.OPEN) {
      mySocket.sendMessage(type, data);
    } else console.log("No connection to websocket server!");
  };

  const handleWebSocketMessage = async (event: MessageEvent) => {
    console.log("yoo family");
    const data = await JSON.parse(event.data);
    console.log(data);
    switch (data.type) {
      case "imageSelection":
        setIsBothSelected();
        console.log("Aya aya");
        break;

      case "chat":
        //handleChat
        break;
      case "guess":
        //handleGuess
        break;

      case "start":
        //handle start
        break;
    }
  };

  useEffect(() => {
    mySocket.socket?.addEventListener("message", handleWebSocketMessage);
    return () =>
      mySocket.socket?.removeEventListener("message", handleWebSocketMessage);
  }, [mySocket]);

  useEffect(() => {
    fetch(
      "http://localhost:8080/images/a2fc9a93-46ac-4ee7-b1a5-79ce23f148c9"
    ).then((res) => {
      res.json().then((data) => {
        setImages(data.images);

        setImageStates(
          Object.fromEntries(
            data.images.map((image: image) => [image.id, "normal"])
          )
        );
      });
    });
  }, []);

  const handleSelect = async (id: string) => {
    const type =
      player == "player1"
        ? "selection1"
        : player == "player2"
        ? "selection2"
        : "";
    mySocket.sendMessage(type, { imageId: id, gameId });
    console.log("something", type, id, gameId);
    setIsSelected();

    console.log("Is Both selected: ", isBothSelected);
  };

  const handlePass = (id: number) => {
    setImageStates((prev) => ({ ...prev, [id]: "blurred" }));
    setHoveredId(null);
  };

  const handleGuess = (id: string) => {

    // Change this shii right here
    if (guessedId === null) {
      setImageStates((prev) => ({ ...prev, [id]: "selected" }));
      setGuessedId(id);
      setHoveredId(null);

      sendWebSocketMessage("guess", { guessedImage: id });
    }
  };

  const handleRestore = (id: number) => {
    setImageStates((prev) => ({ ...prev, [id]: "normal" }));
    setHoveredId(null);
  };

  const handleCopyGameId = () => {
    navigator.clipboard.writeText(gameId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages((prev) => [...prev, { text: inputValue, sender: "user" }]);
      setInputValue("");

      // Simulate opponent message after a delay
      setTimeout(() => {
        const responses = [
          "Is it still visible? 🤔",
          "Keep guessing! 🎭",
          "Getting warmer! 🔥",
          "Hmm interesting choice! 😄",
          "You got this! 💪",
        ];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];
        setMessages((prev) => [
          ...prev,
          { text: randomResponse, sender: "opponent" },
        ]);
      }, 500);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-background">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] left-[3%] w-32 h-32 bg-primary/10 rounded-full animate-float" />
        <div
          className="absolute top-[15%] right-[5%] w-24 h-24 bg-accent/10 rounded-full animate-bounce-subtle"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-[10%] left-[8%] w-28 h-28 bg-secondary/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-[20%] right-[8%] w-20 h-20 bg-primary/10 rounded-full animate-wiggle"
          style={{ animationDelay: "0.7s" }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 h-full p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-4xl font-black text-primary">
            {isBothSelected
              ? topTexts[2]
              : isSelected
              ? topTexts[1]
              : topTexts[0]}
          </h1>
          <div className="w-10" />
        </div>

        {/* Main Content Area */}
        <div className="flex gap-4 flex-1 min-h-0">
          {/* Image Grid Section */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Image Grid */}
            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-6 gap-3 auto-rows-fr h-full">
                {images.map((image: any) => {
                  const state = imageStates[image.id];
                  const isHovered = hoveredId === image.id;
                  const isGuessDisabled =
                    guessedId !== null && guessedId !== image.id;

                  return (
                    <div
                      key={image.id}
                      className="relative group"
                      onMouseEnter={() =>
                        !isGuessDisabled && setHoveredId(image.id)
                      }
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Image Container */}
                      <div
                        className={`relative w-full h-full rounded-2xl border-4 overflow-hidden cursor-pointer transition-all duration-300 ${
                          state === "selected"
                            ? "border-primary bg-primary/20 ring-4 ring-primary/50"
                            : "border-primary/30 bg-card hover:border-primary/60 hover:scale-105"
                        }`}
                      >
                        <img
                          src={image.imageUrl || "/placeholder.svg"}
                          alt={image.imageName}
                          className={`w-full h-full object-cover transition-all duration-300 ${
                            state === "blurred"
                              ? "blur-lg opacity-40"
                              : "blur-0 opacity-100"
                          }`}
                        />

                        {/* Hover Overlay */}
                        {isHovered && !isGuessDisabled && isBothSelected && (
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 p-1">
                            {state === "normal" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleGuess(image.id)
                                  }
                                  className="text-xs font-black px-2 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-110 whitespace-nowrap"
                                >
                                  👁️ Guess
                                </button>
                                <button
                                  onClick={() => handlePass(image.id)}
                                  className="text-xs font-black px-2 py-1 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all hover:scale-110 flex items-center gap-1 justify-center"
                                  title="Skip"
                                >
                                  ✕
                                </button>
                              </>
                            )}

                            {state === "blurred" && (
                              <button
                                onClick={() => handleRestore(image.id)}
                                className="text-xs font-black px-2 py-1 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all hover:scale-110 flex items-center gap-1 justify-center"
                                title="Restore"
                              >
                                ↻
                              </button>
                            )}
                          </div>
                        )}
                        {isHovered && !isGuessDisabled && !isBothSelected && (
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 p-1">
                            {state === "normal" && (
                              <>
                                <button
                                  onClick={() => handleSelect(image.id)}
                                  className="text-xs font-black px-2 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-110 whitespace-nowrap"
                                >
                                  👆 Select
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="w-80 flex flex-col bg-card border-4 border-primary/20 rounded-3xl overflow-hidden shadow-xl">
            {/* Chat Header */}
            <div className="bg-primary p-5 border-b-4 border-primary/40">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-black text-2xl text-primary-foreground">
                  💬 Chat
                </h2>
                <button
                  onClick={handleCopyGameId}
                  className="bg-primary-foreground text-primary p-2 rounded-lg hover:bg-primary-foreground/90 transition-all hover:scale-110"
                  title="Copy Game ID"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-primary-foreground/90 font-bold">
                🎮 vs Opponent
              </p>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl font-bold text-sm wrap-break-word shadow-md ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-secondary text-secondary-foreground rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="border-t-4 border-primary/20 p-3 bg-background/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Say something fun..."
                  className="flex-1 px-4 py-2 rounded-xl border-2 border-primary/30 bg-card focus:border-primary focus:outline-none font-bold text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-xl transition-all hover:scale-110 font-bold"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
