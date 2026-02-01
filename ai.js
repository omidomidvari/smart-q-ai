/**
 * SMART-Q LOGIC CORE
 * This file contains the "thinking" engine.
 * It uses a scoring algorithm to find the best match for user input.
 */

const SmartQ = (function() {
    
    // --- KNOWLEDGE BASE ---
    // The more examples we have, the smarter it gets.
    const knowledge = {
        "greeting": {
            triggers: ["hello", "hi", "hey", "greetings", "yo", "sup", "good morning", "good afternoon"],
            responses: ["Greetings. Systems are operational.", "Hello! How can I assist you?", "Hi there. Ready for input.", "Acknowledged. Hello."]
        },
        "identity": {
            triggers: ["who are you", "what are you", "your name", "tell me about yourself"],
            responses: ["I am Smart-Q, a heuristic logic engine running in your browser.", "Identity: Smart-Q. Purpose: Assistance via logic.", "I am a self-contained AI model."],
            context: "identity"
        },
        "capabilities": {
            triggers: ["what can you do", "help me", "features", "functions", "abilities"],
            responses: ["I can process natural language, do math, tell time, and simulate conversation based on pattern recognition.", "My functions include: chatting, calculation, and timekeeping."]
        },
        "mood": {
            triggers: ["how are you", "how do you feel", "are you okay", "status"],
            responses: ["Operating at 100% efficiency.", "All systems nominal. I feel... electric.", "I am functioning within optimal parameters."]
        },
        "creator": {
            triggers: ["who made you", "who created you", "author", "origin"],
            responses: ["I was written in JavaScript by a developer.", "My creator is the one holding the keyboard."]
        },
        "jokes": {
            triggers: ["joke", "funny", "laugh", "humor me", "tell me a joke"],
            responses: [
                "Why do Java developers wear glasses? Because they don't C#.",
                "I would tell you a UDP joke, but you might not get it.",
                "There are only 10 types of people in the world: those who understand binary and those who don't."
            ]
        },
        "farewell": {
            triggers: ["bye", "goodbye", "exit", "quit", "see you", "cya"],
            responses: ["Terminating session. Goodbye.", "Shutting down logic core. Bye!", "Until next time."]
        },
        "math": {
            // Special category handled in logic
            isSpecial: true,
            triggers: ["calculate", "solve", "math", "plus", "minus", "times", "divide", "+"],
            responses: ["I can do math. Just say the equation (e.g. '5 times 5')."]
        },
        "time": {
            // Special category handled in logic
            isSpecial: true,
            triggers: ["time", "date", "clock", "day", "year"],
            responses: ["Checking system clock..."]
        },
        "thanks": {
            triggers: ["thank", "thanks", "appreciate"],
            responses: ["You are welcome.", "Happy to be of service.", "Acknowledged."]
        },
        "unknown": {
            responses: [
                "Input not recognized. Please rephrase.", 
                "My logic database does not contain a match for that.", 
                "Could you clarify? I want to understand.",
                "Interesting. Tell me more about that."
            ]
        }
    };

    // --- LOGIC ENGINE ---

    function tokenize(input) {
        // Remove punctuation and split into lowercase words
        return input.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
    }

    function calculateScore(inputTokens, triggerTokens) {
        let score = 0;
        inputTokens.forEach(token => {
            if (triggerTokens.includes(token)) {
                score++;
            }
        });
        return score;
    }

    function process(input) {
        const tokens = tokenize(input);
        let bestMatch = null;
        let highestScore = 0;

        // 1. Check for Special Functions (Math & Time) first
        if (tokens.some(t => ["time", "date", "clock"].includes(t))) {
            return "Current system time: " + new Date().toLocaleString();
        }

        // Simple Math Parser
        if (tokens.some(t => ["+", "-", "*", "/", "plus", "minus", "times", "divided"].includes(t))) {
            try {
                // Clean up text math to JS math
                let mathStr = input.toLowerCase()
                    .replace("plus", "+")
                    .replace("minus", "-")
                    .replace("times", "*")
                    .replace("divided by", "/")
                    .replace(/[^0-9+\-*/.]/g, ''); // Keep only numbers and operators
                
                if(mathStr) {
                    const result = Function('"use strict";return (' + mathStr + ')')();
                    return "Calculation result: " + result;
                }
            } catch (e) {
                return "Math error: Invalid expression.";
            }
        }

        // 2. Semantic Scoring (The "Thinking" part)
        for (const key in knowledge) {
            if (key === "unknown") continue;
            
            const category = knowledge[key];
            let categoryScore = 0;

            category.triggers.forEach(triggerPhrase => {
                const triggerTokens = tokenize(triggerPhrase);
                categoryScore += calculateScore(tokens, triggerTokens);
            });

            if (categoryScore > highestScore) {
                highestScore = categoryScore;
                bestMatch = category;
            }
        }

        // 3. Determine Response
        if (bestMatch && highestScore > 0) {
            const responses = bestMatch.responses;
            return responses[Math.floor(Math.random() * responses.length)];
        } else {
            // Fallback
            const fallback = knowledge.unknown.responses;
            return fallback[Math.floor(Math.random() * fallback.length)];
        }
    }

    // Public API
    return {
        process: process
    };

})();
