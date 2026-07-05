import path from "path";
import { fileURLToPath } from "url";

// AI Service
import { analyzeResumeWithAI } from "../services/ai/geminiService.js";

// Utils
import { extractResumeText } from "../utils/resumeParser.js";
import { analyzeResume } from "../utils/atsAnalyzer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadResume = async (req, res) => {
  try {
    /*
    ------------------------------------
    STEP 0 : Validate Input
    ------------------------------------
    */

    const resumeFile =
  req.files?.resume?.[0];

const jdFile =
  req.files?.jobDescriptionFile?.[0];

const pastedJD =
  req.body.jobDescription;

if (
  !resumeFile ||
  (!pastedJD && !jdFile)
) {
  return res.status(400).json({
    success: false,
    message:
      "Resume and Job Description required",
  });
}

    /*
    ------------------------------------
    STEP 1 : Get Resume File + JD
    ------------------------------------
    */

    let jobDescription = "";

    /*
    ------------------------------------
    STEP 2 : Resume Path
    ------------------------------------
    */

    const resumePath = path.join(
      __dirname,
      "..",
      resumeFile.path
    );

    /*
    ------------------------------------
    STEP 3 : Extract Resume Text
    ------------------------------------
    */

    const extractedText =
      await extractResumeText(
        resumePath,
        resumeFile.mimetype
      );
    /*
------------------------------------
EXTRACT JOB DESCRIPTION
------------------------------------
*/

if (pastedJD) {
  jobDescription = pastedJD;
} 
else if (jdFile) {
  const jdPath = path.join(
    __dirname,
    "..",
    jdFile.path
  );

  jobDescription =
    await extractResumeText(
      jdPath,
      jdFile.mimetype
    );
}

    /*
    ------------------------------------
    STEP 4 : Basic Metadata Only
    ------------------------------------
    */

    const metadata =
      analyzeResume(extractedText);

    /*
    ------------------------------------
    STEP 5 : SINGLE AI CALL
    ------------------------------------
    */

    let aiData = {};

    try {
     
      const prompt = `
You are an Advanced ATS Resume Analyzer and Technical Recruiter.

Your job is to STRICTLY compare the candidate resume against the provided job description.

IMPORTANT RULES:

- Return ONLY valid JSON
- No markdown
- No explanations
- No extra text before JSON
- No extra text after JSON

VERY IMPORTANT ANALYSIS LOGIC:

Step 1:
Read JOB DESCRIPTION carefully.

Extract ALL required:

- Technical Skills
- Frameworks
- Libraries
- Tools
- Programming Languages
- Soft Skills if explicitly mentioned

Step 2:
Read RESUME carefully.

Extract all candidate skills from:

- Skills section
- Projects
- Experience
- Education
- Certifications

Step 3:
Compare JOB DESCRIPTION skills against RESUME skills.

If skill exists in resume → matchedSkills

If skill missing from resume → missingSkills

Examples:

If JD says:

React.js
Node.js
MongoDB
Express.js
Git
TypeScript

And Resume has:

React
MongoDB
Git

Return:

matchedSkills:
["React.js","MongoDB","Git"]

missingSkills:
["Node.js","Express.js","TypeScript"]

IMPORTANT MATCHING RULES:

Treat similar technologies as SAME.

Examples:

React = React.js
Node = Node.js
Express = Express.js
ECMAScript = JavaScript
JS = JavaScript
Mongo = MongoDB
Tailwind = Tailwind CSS

ATS SCORE RULES

Return TWO different values.

1. score
- Integer from 0 to 100 only.
- NEVER return text.
- Examples:
18
45
76
93

2. scoreLabel
Return ONE of these values:

Excellent Match
Strong Match
Moderate Match
Weak Match
Poor Match

matchPercentage formula:

(number of matched skills ÷ total required JD skills) × 100

Return EXACTLY this JSON structure:

{
  "atsAnalysis": {
    "score": 0,
    "scoreLabel": "",
    "matchPercentage": 0,
    "matchedSkills": [],
    "missingSkills": [],
    "sections": {
      "skills": true,
      "experience": true,
      "projects": true,
      "education": true
    }
  },

  "aiSuggestions": {
    "strengths": [],
    "weaknesses": [],
    "suggestions": [],
    "recruiterFeedback": ""
  },

  "resumeRewrite": {
    "summary": "",
    "projects": [],
    "experience": [],
    "skills": [],
    "improvements": []
  },

  "interviewQuestions": {
    "technical": [],
    "projects": [],
    "hr": [],
    "coding": []
  },

  "careerSuggestions": {
    "roles": [],
    "skillsToLearn": [],
    "roadmap": [],
    "salaryEstimate": ""
  }
}

RESUME:
${extractedText}

JOB DESCRIPTION:
${jobDescription}
`;

      const aiResponse =
        await analyzeResumeWithAI(
          prompt
        );

      const cleaned =
        aiResponse
          .replace(
            /```json/g,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim();

      aiData =
        JSON.parse(
          cleaned
        );

    } catch (error) {
      console.log(
        "AI Error:"
      );
      console.log(error);

      aiData = {
        atsAnalysis: {
          score: 0,
          matchPercentage: 0,
          matchedSkills: [],
          missingSkills: [],
          sections: {
            skills: false,
            experience: false,
            projects: false,
            education: false,
          },
        },

        aiSuggestions: {
          strengths: [],
          weaknesses: [],
          suggestions: [
            "AI unavailable",
          ],
          recruiterFeedback:
            "AI unavailable",
        },

        resumeRewrite: {
          summary: "",
          projects: [],
          experience: [],
          skills: [],
          improvements: [],
        },

        interviewQuestions: {
          technical: [],
          projects: [],
          hr: [],
          coding: [],
        },

        careerSuggestions: {
          roles: [],
          skillsToLearn: [],
          roadmap: [],
          salaryEstimate: "",
        },
      };
    }

    /*
    ------------------------------------
    FINAL RESPONSE
    ------------------------------------
    */

    res.status(200).json({
      success: true,

      message:
        "ATS Analysis Completed Successfully",

      atsAnalysis:
        aiData.atsAnalysis,

      metadata: {
        email:
          metadata.email,

        phone:
          metadata.phone,

        links:
          metadata.links,
      },

      aiSuggestions:
        aiData.aiSuggestions,

      resumeRewrite:
        aiData.resumeRewrite,

      interviewQuestions:
        aiData.interviewQuestions,

      careerSuggestions:
        aiData.careerSuggestions,

      extractedText,
      jobDescription,
    });

  } catch (error) {
    console.log(
      "Upload Controller Error:"
    );

    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Server Error",
      error:
        error.message,
    });
  }
};

export { uploadResume };
