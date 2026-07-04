const stopWords = [
  "and",
  "or",
  "the",
  "a",
  "an",
  "with",
  "in",
  "on",
  "for",
  "to",
  "of",
  "is",
  "are",
  "we",
  "you",
  "will",
  "be",
];

const extractKeywords = (text) => {
  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/);

  const filteredWords = words.filter(
    (word) =>
      word.length > 2 &&
      !stopWords.includes(word)
  );

  return [...new Set(filteredWords)];
};

const calculateATSScore = (resumeText, jdText) => {
  const resumeKeywords = extractKeywords(resumeText);

  const jdKeywords = extractKeywords(jdText);

  const matchedSkills = jdKeywords.filter((word) =>
    resumeKeywords.includes(word)
  );

  const missingSkills = jdKeywords.filter(
    (word) => !resumeKeywords.includes(word)
  );

  const score =
    jdKeywords.length > 0
      ? Math.round(
          (matchedSkills.length / jdKeywords.length) * 100
        )
      : 0;

  let message = "";

  if (score >= 80) {
    message = "Excellent Resume Match";
  } else if (score >= 60) {
    message = "Good Match, but can be improved";
  } else if (score >= 40) {
    message = "Average Match. Add more required skills";
  } else {
    message =
      "Low ATS Score. Resume does not match Job Description";
  }

  return {
    score,
    matchedSkills,
    missingSkills,
    message,
  };
};

export { calculateATSScore };