import { TRIVIA_DIFFICULTY_LABELS, TRIVIA_POINTS } from "../../config/trivia.config";

export function TriviaQuestionCard({
  trivia,
  selectedAnswer,
  result,
  onSelectAnswer,
  onSubmitAnswer,
  onNextTrivia,
}) {
  const points = TRIVIA_POINTS[trivia.difficulty];

  return (
    <article className="trivia-card">
      <div className="trivia-card__meta">
        <span>{trivia.category}</span>
        <span>{TRIVIA_DIFFICULTY_LABELS[trivia.difficulty]}</span>
        <strong>{points} pts</strong>
      </div>

      <h3>{trivia.question}</h3>

      <div className="trivia-options">
        {trivia.options.map((option) => (
          <button
            key={option}
            type="button"
            className={
              selectedAnswer === option
                ? "trivia-option trivia-option--selected"
                : "trivia-option"
            }
            disabled={Boolean(result)}
            onClick={() => onSelectAnswer(option)}
          >
            {option}
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
            ? `¡Correcto! Sumaste ${result.pointsEarned} puntos.`
            : "Respuesta incorrecta. No sumaste puntos."}
        </div>
      )}

      <div className="trivia-actions">
        {!result ? (
          <button
            className="primary-button"
            type="button"
            disabled={!selectedAnswer}
            onClick={onSubmitAnswer}
          >
            Responder
          </button>
        ) : (
          <button className="primary-button" type="button" onClick={onNextTrivia}>
            Siguiente trivia
          </button>
        )}
      </div>
    </article>
  );
}