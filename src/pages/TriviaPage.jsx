import { useEffect, useState } from "react";
import {
  answerTriviaQuestion,
  getTriviaQuestion,
} from "../services/triviaService";
import { useAuth } from "../context/AuthContext";

const TRIVIA_CACHE_KEY = "currentTrivia";

function safeParseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function TriviaPage() {
  const cachedTrivia = safeParseJson(
    sessionStorage.getItem(TRIVIA_CACHE_KEY),
    null
  );

  const [triviaData, setTriviaData] = useState(cachedTrivia);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(!cachedTrivia);
  const [answering, setAnswering] = useState(false);
  const [error, setError] = useState("");

  const { refreshUser } = useAuth();

  async function loadTrivia({ showLoading = true } = {}) {
  if (showLoading) {
    setLoading(true);
  }

  setError("");
  setResult(null);
  setSelectedOptionId(null);

  try {
    const data = await getTriviaQuestion();

    if (!data?.question || !Array.isArray(data?.options)) {
      sessionStorage.removeItem(TRIVIA_CACHE_KEY);
      setTriviaData(null);
      setError("No hay preguntas disponibles para responder.");
      return;
    }

    setTriviaData(data);
    sessionStorage.setItem(TRIVIA_CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error cargando trivia:", error);

    sessionStorage.removeItem(TRIVIA_CACHE_KEY);
    setTriviaData(null);
    setError(error.message || "No hay preguntas disponibles para responder.");
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  if (!cachedTrivia?.question || !Array.isArray(cachedTrivia?.options)) {
    sessionStorage.removeItem(TRIVIA_CACHE_KEY);
    loadTrivia();
    return;
  }

  loadTrivia({ showLoading: false });
}, []);

  async function handleSubmitAnswer() {
    if (!triviaData || selectedOptionId === null || result) return;

    setAnswering(true);

    try {
      const response = await answerTriviaQuestion(
        triviaData.question.id,
        selectedOptionId
      );

      setResult(response);
      sessionStorage.removeItem(TRIVIA_CACHE_KEY);

      await refreshUser();
    } catch (error) {
      console.error("Error respondiendo trivia:", error);
      setError(error.message || "No se pudo responder la trivia.");
    } finally {
      setAnswering(false);
    }
  }

  if (loading) {
    return (
      <section className="trivia-page">
        <p>Cargando trivia...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="trivia-page">
        <section className="empty-state">
          <h3>Ocurrió un error</h3>
          <p>{error}</p>
          <button
            className="primary-button"
            type="button"
            onClick={() => loadTrivia()}
          >
            Reintentar
          </button>
        </section>
      </section>
    );
  }

  if (!triviaData) return null;

  return (
    <section className="trivia-page">
      <header className="page-header">
        <div>
          <h2>Trivias</h2>
          <p>Respondé preguntas y ganá puntos para comprar sobres.</p>
        </div>

        <div className="album-progress">
          <strong>
            {triviaData.lives.current}/{triviaData.lives.max}
          </strong>
          <span>vidas</span>
        </div>
      </header>

      <article className="trivia-card">
        <div className="trivia-card__meta">
          <span>{triviaData.question.category}</span>
          <strong>{triviaData.question.points} pts</strong>
        </div>

        <h3>{triviaData.question.question}</h3>

        <div className="trivia-options">
          {triviaData.options.map((option) => (
            <button
              type="button"
              key={option.id}
              className={
                selectedOptionId === option.id
                  ? "trivia-option trivia-option--selected"
                  : "trivia-option"
              }
              onClick={() => setSelectedOptionId(option.id)}
              disabled={Boolean(result)}
            >
              {option.text}
            </button>
          ))}
        </div>

        {result && (
          <div
            className={
              result.isCorrect
                ? "trivia-result trivia-result--correct"
                : "trivia-result trivia-result--wrong"
            }
          >
            {result.isCorrect
              ? `¡Correcto! Ganaste ${result.pointsEarned} puntos.`
              : `Incorrecto. La respuesta correcta era: ${result.correctOption.text}.`}
          </div>
        )}

        <div className="trivia-actions">
          {!result ? (
            <button
              className="primary-button"
              type="button"
              onClick={handleSubmitAnswer}
              disabled={selectedOptionId === null || answering}
            >
              {answering ? "Respondiendo..." : "Responder"}
            </button>
          ) : (
            <button
              className="primary-button"
              type="button"
              onClick={() => loadTrivia()}
            >
              Siguiente trivia
            </button>
          )}
        </div>
      </article>
    </section>
  );
}