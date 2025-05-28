import React, { useState, useEffect } from 'react';
import {
  FaCheck,
  FaTimes,
  FaLightbulb,
  FaArrowRight,
  FaArrowLeft,
  FaExchangeAlt,
  FaCode,
  FaFlag,
  FaPlayCircle,
  FaRegFileCode,
} from 'react-icons/fa';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { sql } from '@codemirror/lang-sql';
import { python } from '@codemirror/lang-python';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { toast } from 'react-toastify';

export default function TaskContent({
  task,
  onSubmit,
  loading,
  result,
  onNextTask,
  onPrevTask,
  currentTaskIndex,
  totalTasks,
  testType,
}) {
  const [code, setCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [editorLanguage, setEditorLanguage] = useState(null);
  const [isCodeModified, setIsCodeModified] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasWrongAttempt, setHasWrongAttempt] = useState(false);
  const [activeSolutionIndex, setActiveSolutionIndex] = useState(0);
  const [availableSolutions, setAvailableSolutions] = useState([]);

  const isLastTask = currentTaskIndex === totalTasks - 1;

  useEffect(() => {
    if (!task) return;

    let solutions = [];

    if (
      task.solutions &&
      Array.isArray(task.solutions) &&
      task.solutions.length > 0
    ) {
      solutions = task.solutions;
      console.log('Found solutions in task.solutions:', task.solutions.length);
    } else if (
      result &&
      result.is_correct &&
      result.solutions &&
      Array.isArray(result.solutions)
    ) {
      solutions = result.solutions;
      console.log(
        'Found solutions in result.solutions:',
        result.solutions.length
      );
    } else if (task.solution) {
      console.log('Using single task.solution');
      solutions = [task.solution];
    } else if (result && result.is_correct && result.solution) {
      console.log('Using single result.solution');
      solutions = [result.solution];
    }

    console.log('Found solutions:', {
      count: solutions.length,
      hasSolutions: solutions.length > 0,
      firstSolution:
        solutions.length > 0
          ? {
              hasCode: !!solutions[0].code,
              hasSolutionCode: !!solutions[0].solution_code,
            }
          : null,
    });

    setAvailableSolutions(solutions);
  }, [task, result]);

  const normalizeNewlines = (inputCode) => {
    if (!inputCode) return '';

    return inputCode
      .replace(/\\n/g, '\n')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');
  };

  useEffect(() => {
    if (task?.initial_code) {
      const normalizedCode = normalizeNewlines(task.initial_code);
      setCode(normalizedCode);
      setIsCodeModified(false);
      setActiveSolutionIndex(0);

      setLanguageFromTestType(testType);

      setShowSolution(false);
      setHasSubmitted(false);
      setHasWrongAttempt(false);
    }
  }, [task, testType]);

  useEffect(() => {
    if (result && !result.is_correct) {
      setHasWrongAttempt(true);
    }
  }, [result]);

  const setLanguageFromTestType = (type) => {
    if (!type) {
      autoDetectLanguage(task?.initial_code);
      return;
    }

    const testTypeLower = type.toLowerCase();

    if (testTypeLower.includes('html')) {
      setEditorLanguage(() => html());
    } else if (testTypeLower.includes('css')) {
      setEditorLanguage(() => css());
    } else if (
      testTypeLower.includes('javascript') ||
      testTypeLower.includes('js') ||
      testTypeLower.includes('react')
    ) {
      setEditorLanguage(() => javascript());
    } else if (testTypeLower.includes('sql')) {
      setEditorLanguage(() => sql());
    } else if (
      testTypeLower.includes('python') ||
      testTypeLower.includes('django')
    ) {
      setEditorLanguage(() => python());
    } else {
      autoDetectLanguage(task?.initial_code);
    }
  };

  const autoDetectLanguage = (codeToDetect) => {
    if (!codeToDetect) {
      setEditorLanguage(() => javascript());
      return;
    }

    if (
      codeToDetect.includes('<!DOCTYPE html>') ||
      codeToDetect.includes('<html')
    ) {
      setEditorLanguage(() => html());
    } else if (
      codeToDetect.includes('{') &&
      codeToDetect.includes(':') &&
      !codeToDetect.includes('function') &&
      !codeToDetect.includes('def ')
    ) {
      setEditorLanguage(() => css());
    } else if (
      codeToDetect.includes('def ') ||
      codeToDetected.includes('import ') ||
      (codeToDetect.includes('class ') && codeToDetect.includes(':'))
    ) {
      setEditorLanguage(() => python());
    } else if (
      codeToDetect.toUpperCase().includes('SELECT ') ||
      codeToDetect.toUpperCase().includes('CREATE TABLE')
    ) {
      setEditorLanguage(() => sql());
    } else {
      setEditorLanguage(() => javascript());
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);

    if (value !== normalizeNewlines(task?.initial_code)) {
      setIsCodeModified(true);
    } else {
      setIsCodeModified(false);
    }
  };

  const handleSubmit = () => {
    if (onSubmit && code) {
      if (!isCodeModified) {
        toast.warning(
          'Ви не змінили початковий код. Будь ласка, вирішіть завдання.'
        );
        return;
      }

      setHasSubmitted(true);

      onSubmit(normalizeNewlines(code));
    }
  };

  const toggleSolution = () => {
    if (!showSolution && availableSolutions.length > 0) {
      const primaryIndex = availableSolutions.findIndex(
        (s) => s.is_primary === true
      );
      if (primaryIndex >= 0) {
        setActiveSolutionIndex(primaryIndex);
      } else {
        setActiveSolutionIndex(0);
      }
    }

    setShowSolution(!showSolution);
  };

  const cycleToNextSolution = () => {
    if (availableSolutions.length <= 1) {
      console.log('Cannot cycle: no multiple solutions');
      return;
    }

    const nextIndex = (activeSolutionIndex + 1) % availableSolutions.length;
    console.log(`Cycling solution: ${activeSolutionIndex} → ${nextIndex}`);
    setActiveSolutionIndex(nextIndex);
  };

  // Функція для визначення стилів кнопки залежно від результату
  const getButtonStyles = () => {
    if (loading) {
      return 'px-8 py-3 rounded-lg bg-amber-600 text-white font-bold text-lg flex items-center  opacity-70 cursor-not-allowed';
    }

    if (result && hasSubmitted) {
      if (result.is_correct) {
        return 'px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-lg flex items-center ';
      } else {
        return 'px-8 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-lg flex items-center ';
      }
    }

    return 'px-8 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg flex items-center ';
  };

  // Функція для визначення тексту кнопки залежно від результату
  const getButtonContent = () => {
    if (loading) {
      return (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
          Перевірка...
        </>
      );
    }

    if (result && hasSubmitted) {
      if (result.is_correct) {
        return (
          <>
            <FaCheck className="mr-2" />
            Правильно!
          </>
        );
      } else {
        return (
          <>
            <FaTimes className="mr-2" />
            Спробувати знову
          </>
        );
      }
    }

    return (
      <>
        <FaPlayCircle className="mr-2" />
        Перевірити рішення
      </>
    );
  };

  if (!task) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-50 rounded-lg ">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
          <p className="text-gray-600">Завантаження завдання...</p>
        </div>
      </div>
    );
  }

  let currentSolution = null;
  let solutionCode = '';
  let solutionHint = '';

  if (availableSolutions.length > 0) {
    if (showSolution) {
      currentSolution = availableSolutions[activeSolutionIndex];
    } else {
      const primaryIndex = availableSolutions.findIndex(
        (s) => s.is_primary === true
      );
      currentSolution =
        primaryIndex >= 0
          ? availableSolutions[primaryIndex]
          : availableSolutions[0];
    }

    if (currentSolution) {
      solutionCode = '';
      if (typeof currentSolution === 'object') {
        if (currentSolution.code && typeof currentSolution.code === 'string') {
          solutionCode = currentSolution.code;
        } else if (
          currentSolution.solution_code &&
          typeof currentSolution.solution_code === 'string'
        ) {
          solutionCode = currentSolution.solution_code;
        }
      }
      solutionHint = currentSolution.hint || '';

      console.log('Using solution:', {
        hasCode: !!currentSolution.code,
        hasSolutionCode: !!currentSolution.solution_code,
        codeLength: solutionCode.length,
        hintLength: solutionHint.length,
      });
    }
  } else if (result && result.solution) {
    solutionCode = result.solution.solution_code || result.solution.code || '';
    solutionHint = result.solution.hint || '';
  }

  const formattedInitialCode = normalizeNewlines(task.initial_code);
  const formattedSolution = normalizeNewlines(solutionCode);

  const isPrimarySolution =
    currentSolution && currentSolution.is_primary === true;

  const showSolutionEnabled = hasSubmitted || result !== null;

  const hasMutlipleSolutions = availableSolutions.length > 1;
  const solutionsCount = availableSolutions.length;

  const shouldShowHintButton =
    hasWrongAttempt || (result && !result.is_correct);

  return (
    <div className="bg-white rounded-lg p-8 mb-12">
      <div className="bg-gray-100 rounded-lg p-4 mb-6 flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="text-gray-800 flex items-center text-xl font-bold">
          <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center mr-3">
            <FaCode size={18} />
          </div>
          <div>
            Завдання{' '}
            <span className="text-amber-600">{currentTaskIndex + 1}</span>
            <span className="mx-2">з</span>
            {totalTasks}
          </div>
          {result && (
            <div
              className={`ml-4 flex items-center ${
                result.is_correct ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {result.is_correct ? (
                <FaCheck className="mr-1" size={20} />
              ) : (
                <FaTimes className="mr-1" size={20} />
              )}
              <span>{result.is_correct ? 'Правильно!' : 'Неправильно!'}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onPrevTask}
            disabled={currentTaskIndex === 0}
            className={`px-3 py-2 rounded-md text-white  flex items-center  ${
              currentTaskIndex === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            <FaArrowLeft className="mr-2" size={12} /> Попереднє
          </button>

          <button
            onClick={onNextTask}
            className="px-3 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white  flex items-center  "
          >
            {isLastTask ? (
              <>
                <span>Завершити</span>
                <FaFlag className="ml-2" size={12} />
              </>
            ) : (
              <>
                <span>Наступне</span>
                <FaArrowRight className="ml-2" size={12} />
              </>
            )}
          </button>

          <button
            onClick={toggleSolution}
            disabled={!showSolutionEnabled || !solutionCode}
            className={`px-3 py-2 rounded-md text-white   ${
              !showSolutionEnabled || !solutionCode
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {showSolution ? 'Сховати рішення' : 'Показати рішення'}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
            <FaRegFileCode className="text-amber-600 mr-3" size={24} />
            {task.title}
          </h2>
          <p className="text-gray-700 mb-6 ">{task.description}</p>

          {shouldShowHintButton && (result?.hint || solutionHint) && (
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center text-amber-600 hover:text-amber-700  "
              >
                <FaLightbulb className="mr-2" />{' '}
                {showHint ? 'Сховати підказку' : 'Показати підказку'}
              </button>

              {showHint && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 text-amber-800">
                  <p className="font-semibold mb-1">Підказка:</p>
                  <p>{result?.hint || solutionHint}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <FaCode className="text-amber-600 mr-2" size={24} />
              <span className="text-lg font-bold text-gray-800">
                {showSolution ? 'Правильне рішення' : 'Початковий код'}
              </span>

              {showSolution && hasMutlipleSolutions && (
                <button
                  onClick={cycleToNextSolution}
                  className="ml-4 flex items-center text-amber-600 hover:text-amber-700 "
                >
                  <FaExchangeAlt className="mr-2" size={14} />
                  {solutionsCount > 2 && (
                    <span className="mr-1">{`${
                      activeSolutionIndex + 1
                    }/${solutionsCount}`}</span>
                  )}
                  {isPrimarySolution ? 'Інші рішення' : 'Основне рішення'}
                </button>
              )}
            </div>
          </div>

          <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
            {showSolution && !solutionCode ? (
              <div className="p-6 text-center text-amber-600 bg-amber-50">
                Рішення недоступне для цього завдання
              </div>
            ) : (
              <CodeMirror
                value={showSolution ? formattedSolution : formattedInitialCode}
                height="auto"
                theme={vscodeDark}
                extensions={editorLanguage ? [editorLanguage] : []}
                editable={false}
                readOnly={true}
                className="text-base"
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: false,
                  highlightSpecialChars: true,
                  foldGutter: true,
                  dropCursor: false,
                  allowMultipleSelections: false,
                  indentOnInput: false,
                  syntaxHighlighting: true,
                  bracketMatching: true,
                  highlightActiveLine: false,
                  highlightSelectionMatches: false,
                }}
              />
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label
              htmlFor="code-editor"
              className="text-lg font-bold text-gray-800 flex items-center"
            >
              <FaCode className="text-green-500 mr-2" size={24} />
              Ваш код
            </label>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <CodeMirror
              value={code}
              height="auto"
              theme={vscodeDark}
              extensions={editorLanguage ? [editorLanguage] : []}
              onChange={handleCodeChange}
              className="text-base"
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightSpecialChars: true,
                history: true,
                foldGutter: true,
                drawSelection: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                syntaxHighlighting: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                rectangularSelection: true,
                crosshairCursor: true,
                highlightActiveLine: true,
                highlightSelectionMatches: true,
                closeBracketsKeymap: true,
                searchKeymap: true,
                foldKeymap: true,
                completionKeymap: true,
                lintKeymap: true,
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={getButtonStyles()}
        >
          {getButtonContent()}
        </button>
      </div>
    </div>
  );
}
