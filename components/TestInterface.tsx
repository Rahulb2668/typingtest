"use client";

import React, { useState, useEffect, useRef } from "react";

import { redirect } from "next/navigation";
interface TestInterfaceProps {
  _id: string;
  linkId: string;
  isUsed: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}
const generateSimpleParagraph = () => {
  const sentences = [
    "The sun shines bright in the blue sky.",
    "A little cat sleeps under the tree.",
    "She drinks a cup of hot tea every morning.",
    "The boy runs fast to catch the bus.",
    "They love to play football in the park.",
    "Birds sing sweet songs in the morning.",
    "The dog wags its tail when happy.",
    "Children laugh and play in the garden.",
    "A farmer grows vegetables in his field.",
    "The moon glows softly at night.",
    "She writes a letter to her best friend.",
    "The teacher reads a story to the class.",
    "We enjoy ice cream on a sunny day.",
    "The baby smiles when she sees her mother.",
    "He likes to listen to music before sleeping.",
    "They build a sandcastle on the beach.",
    "A fish swims quickly in the clear water.",
    "She picks fresh flowers from the garden.",
    "The old man walks slowly with a cane.",
    "A car drives fast on the empty road.",
  ];

  let paragraph = "";
  for (let i = 0; i < 20; i++) {
    paragraph += sentences[Math.floor(Math.random() * sentences.length)] + " ";
  }
  return paragraph.trim();
};

const TestInterface = ({ test }: { test: TestInterfaceProps }) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedParagraph, setGeneratedParagraph] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLimit] = useState(60); // Timer limit (in seconds)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit); // Time remaining in countdown (state-based)

  const timerRef = useRef<NodeJS.Timeout | null>(null); // Timer interval reference
  const timeRemainingRef = useRef(timeLimit); // Track time remaining in countdown (ref-based)
  const isTimerStartedRef = useRef(false); // Flag to track if the timer has started
  const inputRef = useRef("");
  useEffect(() => {
    setGeneratedParagraph(generateSimpleParagraph()); // Generate simple text
  }, []);

  const handleStart = async () => {
    if (!email || !fullName) {
      alert("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testId: test._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to update test");
      }

      setIsStarted(true);
    } catch (error) {
      console.error("Error updating test usage:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);

    inputRef.current = e.target.value;
    console.log("Input started");

    // Start timer only once, when the user starts typing
    if (!isTimerStartedRef.current) {
      isTimerStartedRef.current = true; // Prevent starting the timer multiple times
      startTimer();
    }
  };
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    console.log("Timer started");

    timerRef.current = setInterval(async () => {
      // Decrease time remaining and update ref
      if (timeRemainingRef.current > 0) {
        timeRemainingRef.current -= 1;
        setTimeRemaining((prev) => prev - 1);
      } else {
        clearInterval(timerRef.current as NodeJS.Timeout);
        console.log("Timer ended", userInput);
        await calculateResults();
      }

      // Update visual timer (React component will re-render if you use state here)
      console.log("Time Remaining: ", timeRemainingRef.current);
    }, 1000);
  };
  const calculateResults = async () => {
    console.log("Calculate Results", inputRef.current);
    clearInterval(timerRef.current as NodeJS.Timeout); // Stop timer

    const wordsTyped = inputRef.current.trim().split(/\s+/).length;
    const correctWords = generatedParagraph
      .trim()
      .split(/\s+/)
      .filter(
        (word, index) => word === inputRef.current.trim().split(/\s+/)[index]
      ).length;

    const accuracy =
      wordsTyped > 0 ? Math.round((correctWords / wordsTyped) * 100) : 0;
    const wpm = Math.round((wordsTyped / timeLimit) * 60);

    alert(`Test Completed! WPM: ${wpm}, Accuracy: ${accuracy}%`);
    setIsStarted(false);
    setUserInput("");
    inputRef.current = "";

    const result = {
      testLink: { _type: "reference", _ref: test._id },
      participant: { email, firstName: fullName },
      wpm: wpm,
      accuracy,
      completedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/testresult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        throw new Error("Failed to update test");
      }
      alert(`Test Completed! WPM: ${wpm}, Accuracy: ${accuracy}%`);
      redirect("/thankyou");
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">
        Typing Test created by {test.createdBy.name}
      </h1>

      {!isStarted ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleStart}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "Start Test"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-right text-xl font-mono">
            Timer: {timeRemaining}s
          </div>
          <div className="p-4 bg-gray-100 rounded-md">{generatedParagraph}</div>
          <textarea
            value={userInput}
            onChange={(e) => handleInputChange(e)}
            className="w-full p-4 border rounded-md h-40"
            placeholder="Start typing here..."
            disabled={timeRemaining <= 0}
            onPaste={(e) => e.preventDefault()}
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
          />
        </div>
      )}
    </div>
  );
};

export default TestInterface;
