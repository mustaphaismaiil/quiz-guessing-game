const questions = [
  {
    question: 'Which JavaScript structure stores multiple values and can be looped over?',
    choices: ['Object', 'Array', 'Function', 'Variable'],
    answer: 'Array',
  },
  {
    question: 'Which statement checks a condition and runs code only when it is true?',
    choices: ['for loop', 'if statement', 'array method', 'object key'],
    answer: 'if statement',
  },
  {
    question: 'What is an example of an object property in JavaScript?',
    choices: ['const score = 0;', 'score: 0', 'score === 0', 'score()'],
    answer: 'score: 0',
  },
  {
    question: 'Which loop runs when the condition is true and repeats until it becomes false?',
    choices: ['do-while', 'switch', 'if', 'return'],
    answer: 'do-while',
  },
  {
    question: 'How does a function help make code reusable?',
    choices: [
      'It stores values in an object',
      'It runs the same logic whenever it is called',
      'It changes the page style automatically',
      'It defines a new array type',
    ],
    answer: 'It runs the same logic whenever it is called',
  },
];

const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const quizCard = document.getElementById('quiz-card');
const startCard = document.getElementById('start-card');
const resultCard = document.getElementById('result-card');
const questionText = document.getElementById('question-text');
const questionNumber = document.getElementById('question-number');
const scoreDisplay = document.getElementById('score');
const answersContainer = document.getElementById('answers');
const resultText = document.getElementById('result-text');

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

function getRandomQuestionOrder() {
  const copy = [...questions];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

let shuffledQuestions = getRandomQuestionOrder();

function resetGame() {
  currentQuestionIndex = 0;
  score = 0;
  selectedAnswer = null;
  scoreDisplay.textContent = `Score: ${score}`;
  shuffledQuestions = getRandomQuestionOrder();
}

function startQuiz() {
  startCard.classList.add('hidden');
  resultCard.classList.add('hidden');
  quizCard.classList.remove('hidden');
  resetGame();
  showQuestion();
}

function showQuestion() {
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`;
  questionText.textContent = currentQuestion.question;
  answersContainer.innerHTML = '';
  selectedAnswer = null;
  nextButton.disabled = true;

  currentQuestion.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.className = 'answer-btn';
    button.type = 'button';
    button.textContent = choice;
    button.addEventListener('click', () => selectAnswer(button, currentQuestion.answer));
    answersContainer.appendChild(button);
  });
}

function selectAnswer(button, correctAnswer) {
  if (selectedAnswer) {
    return;
  }

  selectedAnswer = button.textContent;
  const buttons = answersContainer.querySelectorAll('.answer-btn');

  buttons.forEach((btn) => {
    if (btn.textContent === correctAnswer) {
      btn.classList.add('correct');
    } else if (btn === button) {
      btn.classList.add('wrong');
    }
    btn.disabled = true;
  });

  if (selectedAnswer === correctAnswer) {
    score += 1;
    scoreDisplay.textContent = `Score: ${score}`;
  }

  nextButton.disabled = false;
}

function showResult() {
  quizCard.classList.add('hidden');
  resultCard.classList.remove('hidden');
  const percentage = Math.round((score / shuffledQuestions.length) * 100);
  resultText.textContent = `You answered ${score} of ${shuffledQuestions.length} questions correctly (${percentage}%). Great job using real code concepts!`;
}

function goToNextQuestion() {
  currentQuestionIndex += 1;
  if (currentQuestionIndex < shuffledQuestions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', goToNextQuestion);
restartButton.addEventListener('click', startQuiz);
