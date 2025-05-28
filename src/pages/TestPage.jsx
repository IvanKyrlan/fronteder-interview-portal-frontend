import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaChevronRight,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowLeft,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import useTimer from '../hooks/useTimer';
import testService from '../services/testService';
import userService from '../services/userService';

import LeftSidebar from '../components/test/LeftSidebar';
import InfoContent from '../components/test/InfoContent';
import TestContent from '../components/test/TestContent';
import TestResultContent from '../components/test/TestResultContent';
import Comments from '../components/common/Comments';

const saveTestState = (testId, questions, answers) => {
  const testState = {
    questions,
    answers,
    timestamp: Date.now(),
  };
  localStorage.setItem(`test_state_${testId}`, JSON.stringify(testState));
  console.log(`Saved test state for test ID ${testId}:`, testState);
};

const getTestState = (testId) => {
  const stateJson = localStorage.getItem(`test_state_${testId}`);
  if (!stateJson) return null;

  try {
    const state = JSON.parse(stateJson);
    if (Date.now() - state.timestamp > 7200000) {
      localStorage.removeItem(`test_state_${testId}`);
      return null;
    }
    return state;
  } catch (e) {
    console.error('Error parsing test state:', e);
    localStorage.removeItem(`test_state_${testId}`);
    return null;
  }
};

export default function TestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [test, setTest] = useState(null);
  const [allTests, setAllTests] = useState([]);

  const [view, setView] = useState('info');
  const [testScore, setTestScore] = useState(0);
  const [testTotal, setTestTotal] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  const [finalUserAnswers, setFinalUserAnswers] = useState([]);
  const [finalQuestions, setFinalQuestions] = useState([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const { timeLeft, formatTime, resetTimer } = useTimer(
    test?.duration * 60 || 480,
    () => {
      handleTestComplete();
    }
  );

  useEffect(() => {
    if (test) {
      if (view === 'info') {
        document.title = `${test.title} | Frontender - Тест`;
      } else if (view === 'test') {
        document.title = `Проходження тесту: ${test.title} | Frontender`;
      } else if (view === 'result') {
        document.title = `Результати тесту: ${test.title} | Frontender`;
      }
    } else {
      document.title = 'Тести | Frontender';
    }

    return () => {
      document.title = 'Frontender';
    };
  }, [test, view]);

  const saveProgress = async (correctAnswers, totalQuestions) => {
    if (!isAuthenticated) {
      console.log('User not authenticated - progress not saved');
      return;
    }

    try {
      const scorePercentage = Math.round(
        (correctAnswers / totalQuestions) * 100
      );

      await testService.saveTestResult(
        parseInt(testId),
        scorePercentage,
        correctAnswers,
        totalQuestions
      );
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const fetchQuestionsFromBackend = async (testId) => {
    try {
      if (view === 'info') {
        testService.clearCurrentTestCache();
      }

      console.log(`Fetching questions for test ID: ${testId}`);
      const testData = await testService.getTestWithQuestions(testId);
      console.log('Received test data:', testData);

      let questionsArray = [];
      if (testData.questions && Array.isArray(testData.questions)) {
        questionsArray = testData.questions;
      } else if (
        testData.test_questions &&
        Array.isArray(testData.test_questions)
      ) {
        questionsArray = testData.test_questions;
      }

      if (questionsArray.length === 0) {
        console.error('No questions found in the test data');
        setError('Не вдалося завантажити питання: питання відсутні');
        return;
      }

      console.log(`Found ${questionsArray.length} questions`);

      setQuestions(questionsArray);
      setUserAnswers(new Array(questionsArray.length).fill(null));

      if (view === 'test') {
        saveTestState(
          testId,
          questionsArray,
          new Array(questionsArray.length).fill(null)
        );
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(
        `Не вдалося завантажити питання: ${error.message || 'невідома помилка'}`
      );
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        console.log('Fetching all tests');
        const tests = await testService.getTests();
        console.log(`Retrieved ${tests.length} tests`);
        setAllTests(tests);

        const currentTest = tests.find((t) => t.id === parseInt(testId));
        if (currentTest) {
          console.log('Found current test:', currentTest);
          setTest(currentTest);
        } else {
          console.error(`Test with ID ${testId} not found`);
          setError('Тест не знайдено');
          navigate('/tests', { replace: true });
        }
      } catch (err) {
        console.error('Error fetching tests:', err);
        setError(
          `Не вдалося завантажити тести: ${err.message || 'невідома помилка'}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [testId, navigate]);

  useEffect(() => {
    if (test) {
      fetchQuestionsFromBackend(test.id);
    }
  }, [test]);

  useEffect(() => {
    if (location.pathname.includes('/start')) {
      setView('test');
      resetTimer();

      const savedState = getTestState(testId);
      if (savedState && savedState.questions?.length > 0) {
        console.log('Restoring test state from localStorage', savedState);
        setQuestions(savedState.questions);
        setUserAnswers(
          savedState.answers ||
            new Array(savedState.questions.length).fill(null)
        );
      }
    } else if (location.pathname.includes('/result')) {
      setView('result');

      if (state) {
        if (state.score !== undefined && state.total !== undefined) {
          setTestScore(state.score);
          setTestTotal(state.total);
        }

        if (state.userAnswers && Array.isArray(state.userAnswers)) {
          console.log(
            'Restoring user answers from navigation state:',
            state.userAnswers
          );
          setFinalUserAnswers(state.userAnswers);
        }

        if (state.questions && Array.isArray(state.questions)) {
          console.log(
            'Restoring questions from navigation state:',
            state.questions
          );
          setFinalQuestions(state.questions);
        }
      } else {
        const savedState = getTestState(testId);
        if (savedState) {
          console.log('Restoring test result from localStorage', savedState);
          setFinalQuestions(savedState.questions);
          setFinalUserAnswers(savedState.answers);
        }
      }
    } else {
      setView('info');
    }
  }, [location.pathname, state, resetTimer, testId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-amber-600 mb-4" />
          <p className="text-xl text-gray-500">Завантаження тесту...</p>
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Помилка</h2>
          <p className="text-red-500 mb-6">{error || 'Тест не знайдено'}</p>
          <Link
            to="/tests"
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 "
          >
            <FaArrowLeft className="mr-2" />
            Повернутися до списку тестів
          </Link>
        </div>
      </div>
    );
  }

  const otherTests = allTests.filter((t) => t.id !== parseInt(testId));

  const handleBack = () => {
    navigate('/tests');
  };

  const handleStartTest = () => {
    console.log('Starting test:', test.title);
    testService.clearCurrentTestCache();

    setView('test');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setUserAnswers([]);
    setFinalUserAnswers([]);
    setFinalQuestions([]);
    resetTimer();
    localStorage.removeItem(`test_state_${testId}`);
    fetchQuestionsFromBackend(test.id);
    navigate(`/tests/${test.id}/start`, { replace: true });
  };

  const handleSelectTest = (selectedTest) => {
    navigate(`/tests/${selectedTest.id}`);
  };

  const handleAnswerSelect = (answerId) => {
    console.log(`Selected answer: ${answerId}`);
    setSelectedAnswer(answerId);
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = answerId;
    setUserAnswers(updatedUserAnswers);
    console.log('Updated user answers:', updatedUserAnswers);
    saveTestState(testId, questions, updatedUserAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswerId;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        handleTestComplete();
      }
    }, 1000);
  };

  const handleTestComplete = () => {
    const answersToSave = [...userAnswers];
    const questionsToSave = [...questions];

    let correctAnswersCount = 0;

    for (let i = 0; i < answersToSave.length; i++) {
      const userAnswer = answersToSave[i];
      const correctAnswer = questions[i].correctAnswerId;
      const isAnswerCorrect = userAnswer === correctAnswer;

      if (isAnswerCorrect) {
        correctAnswersCount++;
      }

      console.log(
        `Q${
          i + 1
        }: User answered: ${userAnswer}, Correct answer: ${correctAnswer}, Result: ${
          isAnswerCorrect ? 'CORRECT' : 'WRONG'
        }`
      );
    }

    console.log('Test complete. Final score:', correctAnswersCount);
    console.log('Questions count:', questions.length);
    console.log('User answers to save:', answersToSave);
    console.log('Questions to save:', questionsToSave);

    setTestScore(correctAnswersCount);
    setTestTotal(questions.length);

    setFinalUserAnswers(answersToSave);
    setFinalQuestions(questionsToSave);

    saveTestState(testId, questionsToSave, answersToSave);

    saveProgress(correctAnswersCount, questions.length);

    setView('result');
    navigate(`/tests/${testId}/result`, {
      state: {
        score: correctAnswersCount,
        total: questions.length,
        userAnswers: answersToSave,
        questions: questionsToSave,
      },
      replace: true,
    });
  };

  const handleBackToTests = () => {
    navigate('/tests');
  };

  const questionsToUse =
    view === 'result'
      ? finalQuestions.length > 0
        ? finalQuestions
        : questions
      : questions;
  const answersToUse =
    view === 'result'
      ? finalUserAnswers.length > 0
        ? finalUserAnswers
        : userAnswers
      : userAnswers;

  return (
    <div className="bg-gray-50 min-h-screen">
      {view !== 'test' && (
        <section
          className={`py-20 ${
            view === 'result'
              ? 'bg-gradient-to-r from-amber-400 to-amber-700'
              : 'bg-gradient-to-b from-neutral-800 to-neutral-900'
          } text-white`}
        >
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              {view === 'result' ? 'Результати тесту' : test.title}
            </h1>
            {view === 'info' && (
              <p className="text-xl max-w-3xl mx-auto text-gray-300">
                Перевірте свої знання з {test.title} за допомогою нашого тесту
                заснованому на реальних питаннях з технічних співбесід. Тест
                містить{' '}
                <span className="font-bold text-gray-100">
                  {test.questions}
                </span>{' '}
                питань і розрахований на{' '}
                <span className="font-bold text-gray-100">{test.duration}</span>{' '}
                хвилин.
              </p>
            )}
            {view === 'result' && (
              <p className="text-xl max-w-4xl mx-auto text-white">
                Ви відповіли на <span className="font-bold">{testScore}</span> з{' '}
                <span className="font-bold">{testTotal}</span> питань.
                Дізнайтеся більше про свої результати нижче.
              </p>
            )}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="flex items-center py-4 mb-6 text-gray-500 ">
          <Link to="/" className="flex items-center hover:text-gray-800 ">
            <FaHome className="mr-1" />
            <span>Головна</span>
          </Link>
          <FaChevronRight className="mx-2" size={12} />
          <Link to="/tests" className="hover:text-gray-800 ">
            Тести та практика
          </Link>
          <FaChevronRight className="mx-2" size={12} />
          <span className="text-gray-800 font-semibold truncate max-w-md">
            {test.title}
          </span>
          {view !== 'info' && (
            <>
              <FaChevronRight className="mx-2" size={12} />
              <span className="text-amber-600 ">
                {view === 'test' ? 'Проходження тесту' : 'Результати'}
              </span>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {view !== 'test' && (
            <div className="md:col-span-1">
              <LeftSidebar
                test={test}
                otherTests={otherTests}
                onSelectTest={handleSelectTest}
              />
            </div>
          )}

          <div
            className={`${view !== 'test' ? 'md:col-span-2' : 'md:col-span-3'}`}
          >
            {view === 'info' && (
              <InfoContent test={test} onStartTest={handleStartTest} />
            )}

            {view === 'test' && questions.length > 0 && (
              <TestContent
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                selectedAnswer={selectedAnswer}
                showResult={showResult}
                isCorrect={isCorrect}
                timeLeft={timeLeft}
                formatTime={formatTime}
                onAnswerSelect={handleAnswerSelect}
                onNextQuestion={handleNextQuestion}
              />
            )}

            {view === 'test' && questions.length === 0 && (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                <p className="text-xl text-red-500 mb-6">
                  Не вдалося завантажити питання. Повернітся на сторінку тестів.
                </p>
                <button
                  onClick={handleBackToTests}
                  className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 "
                >
                  <FaArrowLeft className="mr-2" />
                  Повернутися до списку тестів
                </button>
              </div>
            )}

            {view === 'result' && (
              <div>
                <TestResultContent
                  testScore={testScore}
                  testTotal={testTotal}
                  onRetakeTest={handleStartTest}
                  onBackToTests={handleBackToTests}
                  questions={questionsToUse}
                  userAnswers={answersToUse}
                />
              </div>
            )}

            {view !== 'test' && (
              <div className="mt-10 bg-white rounded-lg p-6 shadow-md">
                <Comments contentType="tests.test" objectId={test.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
