
/*
 * Surya's AI Assistance
 * Professional Portfolio & GitHub Assistant
 *
 * Uses:
 * - knowledge.json
 * - Public GitHub repositories
 * - Public Hugging Face Spaces
 *
 * This version uses knowledge-based responses.
 * LLM integration will be added separately.
 */

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");

let suryaProfileData = null;
let profileLoadingPromise = null;

const FALLBACK_LINKS = {
  portfolio: "https://suryark88.github.io/",
  github: "https://github.com/suryark88",
  huggingface: "https://huggingface.co/suryakumar-ai",
  linkedin: "https://www.linkedin.com/in/suryanagarajan/"
};

// Display chat messages safely.
function addMessage(text, sender) {
  const message = document.createElement("div");

  message.className = `message ${sender}`;
  message.textContent = text;

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return message;
}

// Initialize the professional profile loader.
async function initializeProfileKnowledge() {
  if (!window.SuryaProfileLoader) {
    console.warn("Profile loader not available.");
    return null;
  }

  try {
    suryaProfileData =
      await window.SuryaProfileLoader.loadAllProfileData();

    console.log("Professional profile data loaded");

    return suryaProfileData;

  } catch (error) {
    console.warn("Profile initialization failed:", error);
    return null;
  }
}

// Load profile information only once per page visit.
function ensureProfileKnowledge() {
  if (!profileLoadingPromise) {
    profileLoadingPromise = initializeProfileKnowledge();
  }

  return profileLoadingPromise;
}

// Retrieve the approved knowledge base.
function getKnowledge() {
  return suryaProfileData?.knowledge || {};
}

// Retrieve profile links.
function getProfileLinks() {
  const profiles = getKnowledge().public_profiles || {};

  return {
    portfolio: profiles.portfolio?.url || FALLBACK_LINKS.portfolio,
    github: profiles.github?.url || FALLBACK_LINKS.github,
    huggingface:
      profiles.huggingface?.url || FALLBACK_LINKS.huggingface,
    linkedin: profiles.linkedin?.url || FALLBACK_LINKS.linkedin
  };
}

// Answer professional experience questions.
function getExperienceResponse() {
  const profile = getKnowledge().profile;

  if (!profile) {
    return (
      "Surya Ram Kumar is an Operations Manager with " +
      "13+ years of experience in SaaS Service Delivery, " +
      "IT Operations, Customer Success, and AI Integration."
    );
  }

  const specializations =
    profile.specializations?.join(", ") || "";

  return (
    `${profile.name || "Surya Ram Kumar"} is an ` +
    `${profile.current_role || "Operations Manager"} ` +
    `with ${profile.experience || "13+ years"} of experience.\n\n` +
    `His areas of expertise include:\n${specializations}\n\n` +
    "His professional focus includes service delivery, " +
    "operational efficiency, AI Integration, " +
    "intelligent automation, and improving IT operations."
  );
}

// Answer technical skills questions.
function getSkillsResponse() {
  const profile = getKnowledge().profile;

  const skills = profile?.technical_skills || [];

  if (!skills.length) {
    return (
      "Surya's expertise includes SaaS Service Delivery, " +
      "IT Operations, Generative AI, Agentic AI, " +
      "AI Integration, Power Automate, and MCP."
    );
  }

  return (
    "Surya's technical skills include:\n\n" +
    skills.map(skill => `• ${skill}`).join("\n")
  );
}

// Retrieve projects from knowledge.json.
function getProfessionalProjects() {
  const projects = getKnowledge().projects || [];

  if (!projects.length) {
    return (
      "Surya works on IT Operations, reporting automation, " +
      "AI Integration, and service delivery intelligence projects."
    );
  }

  return (
    "Here are Surya's professional projects:\n\n" +
    projects.map((project, index) => {
      return (
        `${index + 1}. ${project.name}\n` +
        `${project.summary || ""}\n` +
        `Status: ${project.status || "Not specified"}`
      );
    }).join("\n\n")
  );
}

// Display live GitHub repositories.
function getGitHubProjects() {
  const repositories = suryaProfileData?.github || [];

  if (!repositories.length) {
    return (
      "GitHub project information is currently unavailable.\n\n" +
      FALLBACK_LINKS.github
    );
  }

  return (
    "Here are Surya's public GitHub repositories:\n\n" +
    repositories.slice(0, 12).map((repo, index) => {
      return (
        `${index + 1}. ${repo.name}\n` +
        `${repo.description || "No description available."}\n` +
        `Language: ${repo.language || "Not specified"}\n` +
        `${repo.url}`
      );
    }).join("\n\n")
  );
}

// Display live Hugging Face Spaces.
function getHuggingFaceProjects() {
  const spaces = suryaProfileData?.huggingface || [];

  if (!spaces.length) {
    return (
      "No public Hugging Face Spaces were retrieved.\n\n" +
      "Visit: " + FALLBACK_LINKS.huggingface
    );
  }

  return (
    "Here are Surya's public Hugging Face AI projects:\n\n" +
    spaces.map((space, index) => {
      return (
        `${index + 1}. ${space.name}\n` +
        `${space.description || "No description available."}\n` +
        `${space.url}`
      );
    }).join("\n\n")
  );
}

// Display professional profile links.
function getContactResponse() {
  const links = getProfileLinks();

  return (
    "You can explore Surya's professional profiles:\n\n" +
    `Portfolio: ${links.portfolio}\n` +
    `LinkedIn: ${links.linkedin}\n` +
    `GitHub: ${links.github}\n` +
    `Hugging Face: ${links.huggingface}`
  );
}

// Respond to visitor questions.
async function getResponse(question) {
  await ensureProfileKnowledge();

  const text = question.toLowerCase().trim();

  // Hugging Face and AI Spaces
  if (
    text.includes("hugging face") ||
    text.includes("huggingface") ||
    text.includes("ai space") ||
    text.includes("spaces")
  ) {
    return getHuggingFaceProjects();
  }

  // GitHub repositories
  if (
    text.includes("github") ||
    text.includes("repository") ||
    text.includes("repositories") ||
    text.includes("source code")
  ) {
    return getGitHubProjects();
  }

  // Professional projects
  if (
    text.includes("project") ||
    text.includes("automation") ||
    text.includes("post-patch") ||
    text.includes("patch reporting") ||
    text.includes("sdm intelligence")
  ) {
    return getProfessionalProjects();
  }

  // Professional experience
  if (
    text.includes("experience") ||
    text.includes("about surya") ||
    text.includes("who is surya") ||
    text.includes("career") ||
    text.includes("operations manager") ||
    text.includes("background")
  ) {
    return getExperienceResponse();
  }

  // Skills and technologies
  if (
    text.includes("skill") ||
    text.includes("technology") ||
    text.includes("expertise") ||
    text.includes("ai integration") ||
    text.includes("agentic ai") ||
    text.includes("generative ai") ||
    text.includes("mcp")
  ) {
    return getSkillsResponse();
  }

  // Professional links
  if (
    text.includes("contact") ||
    text.includes("linkedin") ||
    text.includes("portfolio") ||
    text.includes("website") ||
    text.includes("hire") ||
    text.includes("connect")
  ) {
    return getContactResponse();
  }

  // Greetings
  if (/^(hi|hello|hey|good morning|good evening)[!.\s]*$/i.test(text)) {
    return (
      "Hello! I'm Surya's AI Assistance.\n\n" +
      "I can help you explore Surya's professional experience, " +
      "AI Integration skills, GitHub repositories, " +
      "Hugging Face projects, and automation work.\n\n" +
      "What would you like to know?"
    );
  }

  // Default response
  return (
    "I'm Surya's AI Assistance.\n\n" +
    "You can ask me about:\n\n" +
    "• Professional experience and Operations Management\n" +
    "• AI Integration and technical skills\n" +
    "• Automation projects\n" +
    "• GitHub repositories\n" +
    "• Hugging Face AI projects\n" +
    "• LinkedIn and portfolio information\n\n" +
    "Try asking: What has Surya built on Hugging Face?"
  );
}

// Handle chat submissions.
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = userInput.value.trim();

  if (!question) return;

  addMessage(question, "user");

  userInput.value = "";
  userInput.disabled = true;
  sendButton.disabled = true;

  const loadingMessage = addMessage("Thinking...", "bot");

  try {
    const answer = await getResponse(question);

    loadingMessage.textContent = answer;

  } catch (error) {
    console.error("Chat response error:", error);

    loadingMessage.textContent =
      "Sorry, I couldn't process that question. " +
      "Please try again.";

  } finally {
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});

// Load professional information when the page opens.
ensureProfileKnowledge();
