const skillsDatabase = [];

const extractSkills = (text) => {
  const lowerText = text.toLowerCase();

  const foundSkills = skillsDatabase.filter((skill) =>
    lowerText.includes(skill)
  );

  return [...new Set(foundSkills)];
};

const extractEmail = (text) => {
  const emailRegex = /\S+@\S+\.\S+/g;

  const emails = text.match(emailRegex);

  return emails ? emails[0] : "Not Found";
};

const extractPhone = (text) => {
  const phoneRegex = /(\+91)?\s?[6-9]\d{9}/g;

  const phones = text.match(phoneRegex);

  return phones ? phones[0] : "Not Found";
};

const extractLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const links = text.match(urlRegex);

  return links || [];
};

const analyzeResume = (text) => {
  return {
    email: extractEmail(text),
    phone: extractPhone(text),
    skills: extractSkills(text),
    links: extractLinks(text),
  };
};

export { analyzeResume };