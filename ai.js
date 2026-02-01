/**
 * SMART-Q NEURAL CORE
 * Architecture: Single-Layer Perceptron (Logistic Regression)
 * Uses: Matrix Multiplication, Sigmoid Activation
 */

const NeuralCore = (function() {
    
    // 1. VOCABULARY (The Input Layer)
    // We map words to indices. Our network only understands these indices.
    const vocab = [
        "hello", "hi", "hey", "greetings", // Greetings
        "bye", "goodbye", "exit", "quit",  // Farewells
        "who", "you", "name", "identity",  // Identity
        "joke", "funny", "laugh",          // Humor
        "time", "date", "clock",           // Time
        "thanks", "thank"                  // Gratitude
    ];

    // 2. THE BRAIN (Weights & Biases)
    // These represent the "Synapses". 
    // High positive numbers = Strong connection.
    // Negative numbers = Inhibition.
    
    // Rows = Output Neurons, Cols = Input Vocabulary
    // Outputs: [Greeting, Farewell, Identity, Humor, Time, Thanks]
    const weights = [
        // hello, hi, hey, greets, bye, exit, quit, who, you, name, id, joke, fun, laugh, time, date, clk, thx, tk
        [ 2.5,  2.0, 1.8,  2.2,  -5,  -5,  -5,  -1,  -1,  -1,  -1,  -5,  -5,   -5,   -5,   -5,   -5,  -5, -5 ], // Greeting
        [ -5,   -5,  -5,   -5,  2.5,  2.0,  2.2, -1,  -1,  -1,  -1,  -5,  -5,   -5,   -5,   -5,   -5,  -5, -5 ], // Farewell
        [ -1,   -1,  -1,   -1,  -5,  -5,  -5,  2.0,  2.5, 2.0,  2.2, -5,  -5,   -5,   -5,   -5,   -5,  -5, -5 ], // Identity
        [ -2,   -2,  -2,   -2,  -5,  -5,  -5,  -5,  -5,  -5,  -5,  2.5,  2.2,  2.0,  -5,   -5,   -5,  -5, -5 ], // Humor
        [ -5,   -5,  -5,   -5,  -5,  -5,  -5,  -5,  -5,  -5,  -5,  -5,  -5,   -5,   2.5,  2.5,  2.5, -5, -5 ], // Time
        [ -5,   -5,  -5,   -5,  -5,  -5,  -5,  -5,  -5,  -5,  -5,  -5,  -5,   -5,   -5,   -5,   -5,  2.5, 2.5]  // Thanks
    ];

    const biases = [-1.5, -1.5, -1.5, -1.5, -1.5, -1.5]; // Thresholds to prevent false positives

    const labels = ["Greeting", "Farewell", "Identity", "Humor", "Time", "Thanks"];

    // 3. ACTIVATION FUNCTION (Sigmoid)
    // Squashes any number to between 0 and 1 (Probability)
    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    // 4. VECTORIZATION
    // Converts string "hello world" into [1, 0, 0, 0...]
    function vectorize(text) {
        const tokens = text.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
        let vector = new Array(vocab.length).fill(0);
        
        tokens.forEach(word => {
            const index = vocab.indexOf(word);
            if (index !== -1) {
                vector[index] = 1; // One-hot encoding (presence of word)
            }
        });
        return vector;
    }

    // 5. FEED FORWARD ALGORITHM
    function predict(inputText) {
        const inputVector = vectorize(inputText);
        let maxProb = 0;
        let bestLabel = "Unknown";
        let confidence = 0;

        // Calculate output for each neuron
        for (let i = 0; i < weights.length; i++) {
            let sum = biases[i]; // Start with bias
            
            // Dot Product: Input * Weights
            for (let j = 0; j < inputVector.length; j++) {
                sum += inputVector[j] * weights[i][j];
            }

            const probability = sigmoid(sum);

            // Softmax-style selection (Winner takes all)
            if (probability > maxProb && probability > 0.5) { // 0.5 is our confidence threshold
                maxProb = probability;
                bestLabel = labels[i];
                confidence = probability;
            }
        }

        return generateResponse(bestLabel, confidence);
    }

    function generateResponse(label, conf) {
        if (label === "Unknown") {
            return `[CONFIDENCE: LOW] Input pattern unrecognized. My neural weights do not match this vector.`;
        }
        
        const responses = {
            "Greeting": `[NEURON: GREETING FIRED] Hello. I processed your input with ${Math.floor(conf*100)}% confidence.`,
            "Farewell": `[NEURON: FAREWELL FIRED] Goodbye. Session terminating.`,
            "Identity": `[NEURON: IDENTITY FIRED] I am a mathematical model of neurons. I do not have a name, only weights.`,
            "Humor": `[NEURON: HUMOR FIRED] Processing humor... Why do neural networks love bad jokes? Because they can't resist the pun-ishment.`,
            "Time": `[NEURON: TIME FIRED] Current system timestamp: ${new Date().toLocaleTimeString()}.`,
            "Thanks": `[NEURON: GRATITUDE FIRED] Acknowledged. No training data required for that.`
        };

        return responses[label];
    }

    // Expose the predict function
    return {
        predict: predict
    };

})();


Copy
