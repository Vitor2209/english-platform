/* =====================================================
   Inglês das Ruas - Quiz JavaScript
   Handles: API fetch, quiz logic, user interactions
   ===================================================== */

// ============ Configuration ============
const API_URL = 'https://ingles-das-ruas.onrender.com/modules/1/lessons/1';

// ============ Quiz State ============
let quizState = {
    questions: [],
    currentIndex: 0,
    score: 0,
    selectedAnswer: null,
    answered: false
};

// ============ DOM Elements ============
const elements = {
    quizCard: document.getElementById('quiz-card'),
    loadingState: document.getElementById('loading-state'),
    errorState: document.getElementById('error-state'),
    quizContent: document.getElementById('quiz-content'),
    completeState: document.getElementById('complete-state'),
    progressText: document.getElementById('progress-text'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    feedbackMessage: document.getElementById('feedback-message'),
    nextBtn: document.getElementById('next-btn'),
    retryBtn: document.getElementById('retry-btn'),
    restartBtn: document.getElementById('restart-btn'),
    finalScore: document.getElementById('final-score'),
    scoreMessage: document.getElementById('score-message')
};
const backBtn = document.getElementById('back-btn');


// ============ Home / Navigation ============
const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');


// ============ API Functions ============

/**
 * Fetches quiz questions from the API
 * Falls back to mock data if API is unavailable
 */
async function fetchQuestions() {
    showState('loading');

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // ✅ Validação correta do formato da API
        if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
            throw new Error('Formato inválido da API');
        }

        // ✅ Retornamos SOMENTE o array de perguntas
        return data.questions;

    } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
        showState('error');
        return [];
    }
}

// ============ State Management ============

/**
 * Shows a specific state (loading, error, quiz, complete)
 * @param {string} state - State to show
 */
function showState(state) {
    // Hide all states
    elements.loadingState.classList.add('hidden');
    elements.errorState.classList.add('hidden');
    elements.quizContent.classList.add('hidden');
    elements.completeState.classList.add('hidden');
    
    // Show requested state
    switch (state) {
        case 'loading':
            elements.loadingState.classList.remove('hidden');
            break;
        case 'error':
            elements.errorState.classList.remove('hidden');
            break;
        case 'quiz':
            elements.quizContent.classList.remove('hidden');
            break;
        case 'complete':
            elements.completeState.classList.remove('hidden');
            break;
    }
}

/**
 * Resets quiz state to initial values
 */
function resetQuizState() {
    quizState = {
        questions: [],
        currentIndex: 0,
        score: 0,
        selectedAnswer: null,
        answered: false
    };
}

// ============ Screen Control ============
function showHome() {
    homeScreen.classList.remove('hidden');
    quizScreen.classList.add('hidden');
}

function showQuizScreen() {
    homeScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
}


// ============ Quiz Logic ============

/**
 * Initializes the quiz by fetching questions and rendering first question
 */
async function initQuiz() {
    resetQuizState();
    
    const questions = await fetchQuestions();
    
    if (questions && questions.length > 0) {
        quizState.questions = pickTenQuestions(questions);
        showState('quiz');
        renderQuestion();
    } else {
        showState('error');
    }
}
function pickTenQuestions(allQuestions) {
    return allQuestions.slice(0, 10);
}


/**
 * Renders the current question and options
 */
function renderQuestion() {
    const { questions, currentIndex } = quizState;
    const currentQuestion = questions[currentIndex];
    
    // Reset state for new question
    quizState.selectedAnswer = null;
    quizState.answered = false;
    
    // Update progress indicator
    elements.progressText.textContent = `Pergunta ${currentIndex + 1} de ${questions.length}`;
    
    // Update question text
    elements.questionText.textContent = currentQuestion.question;
    
    // Clear previous options and feedback
    elements.optionsContainer.innerHTML = '';
    elements.feedbackMessage.classList.add('hidden');
    elements.feedbackMessage.className = 'feedback hidden';
    
    // Disable next button until answer is selected
    elements.nextBtn.disabled = true;
    elements.nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
    
    // Render options
    currentQuestion.options.forEach((option, index) => {
        const optionBtn = createOptionButton(option, index);
        elements.optionsContainer.appendChild(optionBtn);
    });
}

/**
 * Creates an option button element
 * @param {string} text - Option text
 * @param {number} index - Option index
 * @returns {HTMLButtonElement} Option button element
 */
function createOptionButton(text, index) {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.setAttribute('data-index', index);
    
    button.innerHTML = `
        <span class="option-radio">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </span>
        <span class="option-text">${text}</span>
    `;
    
    button.addEventListener('click', () => selectOption(button, text));
    
    return button;
}

/**
 * Handles option selection
 * @param {HTMLButtonElement} button - Clicked button
 * @param {string} answer - Selected answer text
 */
function selectOption(button, answer) {
    // Prevent selection if already answered
    if (quizState.answered) return;
    
    // Remove previous selection
    const allOptions = elements.optionsContainer.querySelectorAll('.option-btn');
    allOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to clicked button
    button.classList.add('selected');
    quizState.selectedAnswer = answer;
    
    // Enable next button
    elements.nextBtn.disabled = false;
}

/**
 * Validates the selected answer and shows feedback
 */
function validateAnswer() {
    if (quizState.answered || !quizState.selectedAnswer) return;
    
    quizState.answered = true;
    
    const currentQuestion = quizState.questions[quizState.currentIndex];
    const isCorrect = quizState.selectedAnswer === currentQuestion.answer;
    
    // Update score
    if (isCorrect) {
        quizState.score++;
    }
    
    // Show feedback
    showFeedback(isCorrect);
    
    // Highlight correct and incorrect options
    highlightOptions(currentQuestion.answer);
    
    // Disable all options
    const allOptions = elements.optionsContainer.querySelectorAll('.option-btn');
    allOptions.forEach(opt => opt.disabled = true);
}

/**
 * Shows feedback message
 * @param {boolean} isCorrect - Whether answer was correct
 */
function showFeedback(isCorrect) {
    elements.feedbackMessage.classList.remove('hidden', 'correct', 'incorrect');
    
    if (isCorrect) {
        elements.feedbackMessage.classList.add('correct');
        elements.feedbackMessage.textContent = '✓ Correct! Nice job!';
    } else {
        elements.feedbackMessage.classList.add('incorrect');
        elements.feedbackMessage.textContent = '✗ Incorrect. Keep practicing!';
    }
}

/**
 * Highlights correct and incorrect options after answer
 * @param {string} correctAnswer - The correct answer text
 */
function highlightOptions(correctAnswer) {
    const allOptions = elements.optionsContainer.querySelectorAll('.option-btn');
    
    allOptions.forEach(option => {
        const optionText = option.querySelector('.option-text').textContent;
        
        if (optionText === correctAnswer) {
            option.classList.remove('selected');
            option.classList.add('correct');
        } else if (option.classList.contains('selected')) {
            option.classList.add('incorrect');
        }
    });
}

/**
 * Advances to the next question or shows results
 */
function nextQuestion() {
    // First validate current answer if not already validated
    if (!quizState.answered) {
        validateAnswer();
        return;
    }
    
    quizState.currentIndex++;
    
    if (quizState.currentIndex >= quizState.questions.length) {
        showResults();
    } else {
        // Add transition animation
        elements.quizCard.style.animation = 'none';
        elements.quizCard.offsetHeight; // Trigger reflow
        elements.quizCard.style.animation = 'slideUp 0.5s ease-out';
        
        renderQuestion();
    }
}

/**
 * Shows the final results screen
 */
function showResults() {
    showState('complete');
    
    const { score, questions } = quizState;
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    
    // Update score display
    elements.finalScore.textContent = `${score}/${total}`;
    
    // Set message based on performance
    let message = '';
    if (percentage === 100) {
        message = '🏆 Perfect! You nailed it!';
    } else if (percentage >= 80) {
        message = '🎉 Excellent work! Almost perfect!';
    } else if (percentage >= 60) {
        message = '👍 Good job! Keep practicing!';
    } else if (percentage >= 40) {
        message = '📚 Not bad! Review and try again!';
    } else {
        message = '💪 Keep studying! You got this!';
    }
    
    elements.scoreMessage.textContent = message;
}

// ============ Event Listeners ============

// Next button click
elements.nextBtn.addEventListener('click', nextQuestion);

// Retry button click (on error state)
elements.retryBtn.addEventListener('click', initQuiz);

// Restart button click (on complete state)
elements.restartBtn.addEventListener('click', showHome);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !elements.nextBtn.disabled) {
        nextQuestion();
    }
    
    // Number keys 1-4 to select options
    if (['1', '2', '3', '4'].includes(e.key) && !quizState.answered) {
        const index = parseInt(e.key) - 1;
        const options = elements.optionsContainer.querySelectorAll('.option-btn');
        if (options[index]) {
            options[index].click();
        }
    }
});

// ============ Initialize ============
document.addEventListener('DOMContentLoaded', showHome);

// ============ Home Buttons ============
document.querySelectorAll('.home-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showQuizScreen();
        initQuiz(); // depois filtramos por módulo
    });
});

const randomBtn = document.querySelector('.random-quiz');
if (randomBtn) {
    randomBtn.addEventListener('click', () => {
        showQuizScreen();
        initQuiz();
    });
}
if (backBtn) {
  backBtn.addEventListener('click', () => {
    resetQuizState(); // limpa perguntas, score, index
    showHome();       // volta pra tela inicial
  });
}



