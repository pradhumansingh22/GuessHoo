"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Users, Plus } from "lucide-react";
import { useGameIdStore } from "@/stores/store";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const { setGameId } = useGameIdStore();
  

  const [createName, setCreateName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinGameId, setJoinGameId] = useState("");

  const handleCreateGame = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log("[v0] Creating game with name:", createName);

    //send req to create a game
    const res = await fetch("http://localhost:8080/game/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player1Name: createName })
    });

    const data = await res.json();
    setGameId(data.gameId);
    // Handle create game logic here
    setCreateDialogOpen(false);
    setCreateName("");
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      "[v0] Joining game with name:",
      joinName,
      "and game ID:",
      joinGameId
    );

    
    // Handle join game logic here
    setJoinDialogOpen(false);
    setJoinName("");
    setJoinGameId("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating shapes */}
        <div className="absolute top-[10%] left-[5%] w-20 h-20 bg-primary/20 rounded-full animate-float" />
        <div
          className="absolute top-[20%] right-[8%] w-16 h-16 bg-accent/30 rounded-full animate-bounce-subtle"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-[15%] left-[12%] w-24 h-24 bg-secondary/40 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-[25%] right-[15%] w-20 h-20 bg-primary/15 rounded-full animate-bounce-subtle"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute top-[50%] left-[8%] w-12 h-12 bg-accent/20 rounded-full animate-wiggle" />
        <div
          className="absolute top-[60%] right-[10%] w-14 h-14 bg-secondary/30 rounded-full animate-float"
          style={{ animationDelay: "0.7s" }}
        />

        {/* Question marks scattered */}
        <div
          className="absolute top-[15%] right-[20%] text-6xl font-black text-primary/10 animate-bounce-subtle"
          style={{ animationDelay: "0.3s" }}
        >
          ?
        </div>
        <div
          className="absolute bottom-[20%] left-[18%] text-5xl font-black text-accent/15 animate-wiggle"
          style={{ animationDelay: "0.8s" }}
        >
          ?
        </div>
        <div
          className="absolute top-[35%] left-[25%] text-4xl font-black text-secondary/20 animate-float"
          style={{ animationDelay: "1.2s" }}
        >
          ?
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Floating badge */}
        <div className="inline-flex items-center gap-2 bg-card px-6 py-3 rounded-full shadow-lg mb-8 animate-bounce-subtle border-4 border-primary/20">
          <Sparkles className="w-5 h-5 text-accent animate-wiggle" />
          <span className="font-bold text-sm uppercase tracking-wider text-foreground">
            The Ultimate Guessing Game
          </span>
          <Sparkles className="w-5 h-5 text-accent animate-wiggle" />
        </div>

        {/* Title */}
        <h1 className="text-7xl md:text-9xl font-black mb-6 text-balance leading-none">
          <span
            className="inline-block text-primary animate-float"
            style={{ animationDelay: "0s" }}
          >
            Guess
          </span>{" "}
          <span
            className="inline-block text-accent animate-float"
            style={{ animationDelay: "0.2s" }}
          >
            Who
          </span>
          <span className="inline-block text-6xl md:text-8xl ml-2 animate-wiggle">
            ?
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl font-bold text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
          Pick your mystery image, challenge your friend, and see if they can
          guess which one you chose! 🎭✨
        </p>

        {/* CTA Button */}
        <Button
          onClick={() => setMenuOpen(true)}
          size="lg"
          className="text-2xl md:text-3xl font-black px-12 py-8 h-auto rounded-3xl shadow-2xl hover:scale-110 transition-transform duration-300 bg-primary text-primary-foreground hover:bg-primary/90 border-4 border-primary-foreground/20"
        >
          <Users className="w-8 h-8 mr-3" />
          Play Now!
        </Button>

        {/* Decorative text below button */}
        <p className="mt-6 text-sm font-bold text-muted-foreground uppercase tracking-widest animate-bounce-subtle">
          👆 Click to start the fun!
        </p>
      </div>

      {/* Game Menu Dialog */}
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="sm:max-w-md border-4 border-primary/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-center text-balance">
              Let&apos;s Get Started! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-base font-semibold text-muted-foreground">
              Choose how you want to play
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            <Button
              size="lg"
              className="w-full text-xl font-black py-7 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform"
              onClick={() => {
                setMenuOpen(false);
                setCreateDialogOpen(true);
              }}
            >
              <Plus className="w-6 h-6 mr-2" />
              Create New Game
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full text-xl font-black py-7 rounded-2xl border-4 border-primary/30 hover:bg-secondary hover:scale-105 transition-transform bg-transparent"
              onClick={() => {
                setMenuOpen(false);
                setJoinDialogOpen(true);
              }}
            >
              <Users className="w-6 h-6 mr-2" />
              Join Existing Game
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4 font-semibold">
            Invite a friend and start guessing! 🕵️
          </p>
        </DialogContent>
      </Dialog>

      {/* Create Game Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md border-4 border-primary/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-center text-balance">
              Create New Game 🎮
            </DialogTitle>
            <DialogDescription className="text-center text-base font-semibold text-muted-foreground">
              Enter your name to get started
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateGame} className="space-y-6 mt-4">
            <div className="space-y-3">
              <Label
                htmlFor="create-name"
                className="text-lg font-bold text-foreground"
              >
                Your Name
              </Label>
              <Input
                id="create-name"
                placeholder="Enter your name..."
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="h-14 text-lg font-semibold border-2 border-primary/30 focus:border-primary rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-xl font-black py-7 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform"
            >
              <Plus className="w-6 h-6 mr-2" />
              Create Game
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Join Game Dialog */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="sm:max-w-md border-4 border-primary/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black text-center text-balance">
              Join Game 🎯
            </DialogTitle>
            <DialogDescription className="text-center text-base font-semibold text-muted-foreground">
              Enter your details to join the fun
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleJoinGame} className="space-y-6 mt-4">
            <div className="space-y-3">
              <Label
                htmlFor="join-name"
                className="text-lg font-bold text-foreground"
              >
                Your Name
              </Label>
              <Input
                id="join-name"
                placeholder="Enter your name..."
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                className="h-14 text-lg font-semibold border-2 border-primary/30 focus:border-primary rounded-xl"
                required
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="game-id"
                className="text-lg font-bold text-foreground"
              >
                Game ID
              </Label>
              <Input
                id="game-id"
                placeholder="Enter game ID..."
                value={joinGameId}
                onChange={(e) => setJoinGameId(e.target.value)}
                className="h-14 text-lg font-semibold border-2 border-primary/30 focus:border-primary rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full text-xl font-black py-7 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform"
            >
              <Users className="w-6 h-6 mr-2" />
              Join Game
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
