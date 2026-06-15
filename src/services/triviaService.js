import { apiRequest } from "./apiClient";

export function getTriviaQuestion() {
  return apiRequest("/trivia/question");
}

export function answerTriviaQuestion(questionId, selectedOptionId) {
  return apiRequest(`/trivia/question/${questionId}/answer`, {
    method: "POST",
    body: JSON.stringify({ selectedOptionId: Number(selectedOptionId) }),
  });
}

export function getMyTriviaHistory() {
  return apiRequest("/trivia/history/me");
}