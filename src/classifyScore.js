export function classifyScore(score) {
  if (score >= 90) {
    return "Excellent";
  } else if (score >= 80) {
    return "Good";
  } else {
    return "Needs Improvement";
  }
}