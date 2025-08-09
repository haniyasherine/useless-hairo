const quizData = [
    { question: "Which number comes next? 2, 4, 8, 16, ...", options: ["18", "24", "32", "36"], answer: "32" },
    { question: "If all Bloops are Razzies and all Razzies are Lazzies, all Bloops are definitely Lazzies?", options: ["Yes", "No"], answer: "Yes" },
    { question: "Which is the odd one out? Apple, Orange, Banana, Carrot", options: ["Apple", "Orange", "Banana", "Carrot"], answer: "Carrot" },
    { question: "What is 15 + 6 × 2?", options: ["42", "27", "33", "21"], answer: "27" },
    { question: "If you rearrange the letters 'CIFAIPC', you get the name of a:", options: ["Ocean", "Country", "City", "Pacific"], answer: "Pacific" },
    { question: "Mary is 16, her brother is half her age. How old will he be when she is 50?", options: ["25", "42", "48", "34"], answer: "42" },
    { question: "Which shape has the most sides?", options: ["Hexagon", "Octagon", "Pentagon", "Nonagon"], answer: "Nonagon" },
    { question: "If 5 cats catch 5 mice in 5 minutes, how long will it take 1 cat to catch 1 mouse?", options: ["5 minutes", "10 minutes", "25 minutes", "1 minute"], answer: "5 minutes" },
    { question: "Which letter comes next in the series: A, C, F, J, O, ...?", options: ["U", "V", "W", "T"], answer: "U" },
    { question: "If 9+3=15 and 5+2=10, what is 7+4?", options: ["11", "12", "15", "14"], answer: "15" }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const iqScore = Math.floor(80 + (score / quizData.length) * 40);
localStorage.setItem("iqScore", iqScore);


function loadQuestion() {
    const q = quizData[currentQuestion];
    questionEl.textContent = `Q${currentQuestion + 1}.${q.question}`;
    optionsEl.innerHTML = "";

    q.options.forEach(opt => {
        const btn = document.createElement("div");
        btn.classList.add("option");
        btn.textContent = opt;
        btn.addEventListener("click", () => handleAnswer(opt));
        optionsEl.appendChild(btn);
    });
}

function handleAnswer(selected) {
    if (selected === quizData[currentQuestion].answer) {
        score++;
    }
    currentQuestion++;
    console.log(`Current IQ: ${score}`);
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        const iqScore = Math.floor((score / quizData.length) * 100);
        localStorage.setItem("iqScore", iqScore);
        console.log(`Your IQ Score: ${iqScore}`);
        window.location.href = "scanning.html"; 
    }
}

loadQuestion();
    