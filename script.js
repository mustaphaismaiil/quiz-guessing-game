// Quiz Questions Database
const quizQuestions = [
    {
        id: 1,
        question: "What is the capital of France?",
        type: "multiple-choice",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris",
        points: 10
    },
    {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        type: "multiple-choice",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars",
        points: 10
    },
    {
        id: 3,
        question: "What is the largest ocean on Earth?",
        type: "multiple-choice",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: "Pacific Ocean",
        points: 10
    },
    {
        id: 4,
        question: "In what year did the Titanic sink?",
        type: "text-input",
        correctAnswer: "1912",
        points: 15,
        hint: "Enter a 4-digit year"
    },
    {
        id: 5,
        question: "How many continents are there?",
        type: "multiple-choice",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7",
        points: 10
    }
];

// Quiz State
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];

// DOM Elements
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultsScreen = document.getElementById("resultsScreen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const retryBtn = document.getElementById("retryBtn");

const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const currentQuestionSpan = document.getElementById("currentQuestion");
const scoreSpan = document.getElementById("score");
const progressBar = document.getElementById("progressBar");

const finalScoreSpan = document.getElementById("finalScore");
const totalQuestionsSpan = document.getElementById("totalQuestions");
const scoreMessageSpan = document.getElementById("scoreMessage");
const resultsDetailsSpan = document.getElementById("resultsDetails");

// Event Listeners
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
retryBtn.addEventListener("click", restartQuiz);

// Functions
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");
    
    loadQuestion();
}

function loadQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    
    // Update header info
    currentQuestionSpan.textContent = `${currentQuestionIndex + 1}/${quizQuestions.length}`;
    scoreSpan.textContent = `Score: ${score}`;
    
    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    progressBar.style.width = progress + "%";
    
    // Load question text
    questionText.textContent = question.question;
    
    // Clear previous answers
    answersContainer.innerHTML = "";
    nextBtn.style.display = "none";
    
    // Load answer options based on question type
    if (question.type === "multiple-choice") {
        loadMultipleChoice(question);
    } else if (question.type === "text-input") {
        loadTextInput(question);
    }
}

function loadMultipleChoice(question) {
    const optionLetters = ["A", "B", "C", "D"];
    
    question.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.className = "answer-option";
        
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "answer";
        radio.value = option;
        radio.addEventListener("change", () => {
            selectAnswer(option);
        });
        
        label.appendChild(radio);
        label.appendChild(document.createTextNode(`${optionLetters[index]}. ${option}`));
        
        answersContainer.appendChild(label);
    });
}

function loadTextInput(question) {
    const inputContainer = document.createElement("div");
    inputContainer.className = "answer-option";
    
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = question.hint || "Type your answer...";
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            selectAnswer(input.value.trim());
        }
    });
    
    const submitBtn = document.createElement("button");
    submitBtn.className = "btn btn-primary";
    submitBtn.textContent = "Submit";
    submitBtn.style.padding = "8px 16px";
    submitBtn.style.fontSize = "0.9em";
    submitBtn.addEventListener("click", () => {
        selectAnswer(input.value.trim());
    });
    
    inputContainer.appendChild(input);
    inputContainer.appendChild(submitBtn);
    answersContainer.appendChild(inputContainer);
}

function selectAnswer(answer) {
    const question = quizQuestions[currentQuestionIndex];
    const isCorrect = normalizeAnswer(answer) === normalizeAnswer(question.correctAnswer);
    
    // Store user answer
    userAnswers.push({
        questionId: question.id,
        question: question.question,
        userAnswer: answer,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect
    });
    
    // Update score
    if (isCorrect) {
        score += question.points;
        scoreSpan.textContent = `Score: ${score}`;
    }
    
    // Disable all answer options
    const allOptions = document.querySelectorAll(".answer-option");
    allOptions.forEach(option => {
        option.style.pointerEvents = "none";
    });
    
    // Show correct/incorrect feedback
    if (question.type === "multiple-choice") {
        allOptions.forEach(option => {
            const optionText = option.textContent.slice(3); // Remove letter
            if (optionText.trim() === question.correctAnswer) {
                option.classList.add("correct");
            } else if (option.querySelector("input").checked && !isCorrect) {
                option.classList.add("incorrect");
            }
        });
    } else {
        // Text input feedback
        const inputs = document.querySelectorAll("input[type='text']");
        inputs.forEach(input => {
            if (isCorrect) {
                input.parentElement.classList.add("correct");
            } else {
                input.parentElement.classList.add("incorrect");
            }
        });
    }
    
    // Show next button
    nextBtn.style.display = "block";
}

function normalizeAnswer(answer) {
    return answer.toLowerCase().trim();
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizScreen.classList.remove("active");
    resultsScreen.classList.add("active");
    
    // Calculate percentage
    const maxScore = quizQuestions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / maxScore) * 100);
    
    // Update results
    finalScoreSpan.textContent = score;
    totalQuestionsSpan.textContent = maxScore;
    
    // Show appropriate message
    let message = "";
    if (percentage === 100) {
        message = "Perfect! You're a genius! 🌟";
    } else if (percentage >= 80) {
        message = "Excellent work! Very impressive! 👏";
    } else if (percentage >= 60) {
        message = "Good job! Keep learning! 📚";
    } else if (percentage >= 40) {
        message = "Not bad! Try again to improve! 💪";
    } else {
        message = "Keep practicing! You'll do better next time! 🎯";
    }
    
    scoreMessageSpan.textContent = message;
    
    // Show detailed results
    let detailsHTML = "";
    userAnswers.forEach((answer, index) => {
        const resultClass = answer.isCorrect ? "correct" : "incorrect";
        const status = answer.isCorrect ? "✓" : "✗";
        
        detailsHTML += `
            <div class="result-item ${resultClass}">
                <strong>Q${index + 1}:</strong> ${status} 
                ${answer.isCorrect ? "Correct" : `Your answer: "${answer.userAnswer}" (Correct: "${answer.correctAnswer}")`}
            </div>
        `;
    });
    
    resultsDetailsSpan.innerHTML = detailsHTML;
}

function restartQuiz() {
    resultsScreen.classList.remove("active");
    startScreen.classList.add("active");
    
    // Reset state
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
}

// Load first question on page load (optional - user can click start)
