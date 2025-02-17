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
    }, 1000);
  };

  interface TypingMetricsResult {
    wpm: number;
    netWPM: number;
    cpm: number;
    accuracy: number;
    errorRate: number;
    totalWordsTyped: number;
    correctWords: number;
    errorWords: number;
    totalCorrectCharacters: number;
    totalTypedCharacters: number;
    partialWord: string;
    isLastWordComplete: boolean;
  }

  const calculateTypingMetrics = (
    inputText: string,
    targetText: string
  ): TypingMetricsResult => {
    const inputWords = inputText.trim().split(/\s+/);
    const targetWords = targetText.trim().split(/\s+/);

    let totalCorrectCharacters = 0;
    let totalTypedCharacters = inputText.replace(/\s+/g, "").length;
    let correctWords = 0;
    let errorWords = 0;
    let totalErrors = 0;

    const minWords = Math.min(inputWords.length, targetWords.length);

    for (let i = 0; i < minWords; i++) {
      const inputWord = inputWords[i];
      const targetWord = targetWords[i];
      let wordCorrectCharacters = 0;
      let wordErrors = 0;
      const minLength = Math.min(inputWord.length, targetWord.length);

      for (let j = 0; j < minLength; j++) {
        if (inputWord[j] === targetWord[j]) {
          wordCorrectCharacters++;
        } else {
          wordErrors++;
        }
      }

      // Handle extra characters in input word
      wordErrors += Math.abs(inputWord.length - targetWord.length);
      totalErrors += wordErrors;
      totalCorrectCharacters += wordCorrectCharacters;

      // Mark word as correct if fully matched
      if (inputWord === targetWord) {
        correctWords++;
      } else {
        errorWords++;
      }
    }

    // Handle extra words in input (over-typed words)
    if (inputWords.length > targetWords.length) {
      for (let i = minWords; i < inputWords.length; i++) {
        totalErrors += inputWords[i].length;
        errorWords++;
      }
    }

    // Handle missing words in input (under-typed words)
    if (targetWords.length > inputWords.length) {
      for (let i = minWords; i < targetWords.length; i++) {
        totalErrors += targetWords[i].length;
        errorWords++;
      }
    }

    // Handle last word specifically for partial matching
    const lastWordComplete = inputText.endsWith(" ");
    const partialWord =
      !lastWordComplete && inputWords.length > 0
        ? inputWords[inputWords.length - 1]
        : "";

    // Character-based accuracy calculation
    const accuracy =
      totalTypedCharacters > 0
        ? Math.round((totalCorrectCharacters / totalTypedCharacters) * 100)
        : 0;

    const wpm = inputWords.length;
    const netWPM = correctWords;
    const cpm = totalTypedCharacters;
    const errorRate =
      totalTypedCharacters > 0
        ? Math.round((totalErrors / totalTypedCharacters) * 100)
        : 0;

    return {
      wpm,
      netWPM,
      cpm,
      accuracy,
      errorRate,
      totalWordsTyped: inputWords.length,
      correctWords,
      errorWords,
      totalCorrectCharacters,
      totalTypedCharacters,
      partialWord,
      isLastWordComplete: lastWordComplete,
    };
  };

  const calculateResults = async () => {
    clearInterval(timerRef.current as NodeJS.Timeout); // Stop timer

    // Calculate typing metrics
    const typingMetrics = calculateTypingMetrics(
      inputRef.current,
      generatedParagraph
    );

    setIsStarted(false);
    setUserInput("");
    inputRef.current = "";
    const result = {
      testLink: { _type: "reference", _ref: test._id },
      participant: { email, firstName: fullName },
      wpm: typingMetrics.wpm,
      accuracy: typingMetrics.accuracy,
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
