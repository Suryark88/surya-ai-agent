
/*
 * Surya's AI Assistance
 * Professional Portfolio & GitHub AI Assistant
 *
 * Hosted LLM: Groq GPT-OSS 20B
 * Backend: Cloudflare Workers
 * Frontend: GitHub Pages
 *
 * Knowledge sources:
 * - Professional knowledge.json
 * - Public GitHub repositories
 * - Public Hugging Face Spaces
 * - Approved LinkedIn professional information
 *
 * The Cloudflare Worker handles LLM inference
 * and professional knowledge retrieval.
 */

// ==========================================
// CONFIGURATION
// ==========================================

const AI_CONFIG = {
  name: "Surya's AI Assistance",

  apiUrl:
    "https://surya-ai-assistance-api.suryark.workers.dev/chat",

  portfolioUrl:
    "https://suryark88.github.io/",

  githubUrl:
    "https://github.com/suryark88",

  huggingFaceUrl:
    "https://huggingface.co/suryakumar-ai",

  linkedinUrl:
    "https://www.linkedin.com/in/suryanagarajan/",

  requestTimeout: 45000,

  maxMessageLength: 1000
};

// ==========================================
// CHAT ELEMENTS
// ==========================================

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");

// ==========================================
// CHAT MESSAGE DISPLAY
// ==========================================

function addMessage(text, sender) {
  const message = document.createElement("div");

  message.className = `message ${sender}`;

  // textContent prevents HTML injection.
  message.textContent = text;

  chatMessages.appendChild(message);

  scrollToBottom();

  return message;
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ==========================================
// OPTIONAL PROFILE DATA INITIALIZATION
// ==========================================

let suryaProfileData = null;

async function initializeProfileKnowledge() {
  if (!window.SuryaProfileLoader) {
    console.info(
      "Profile loader unavailable. " +
      "Hosted AI backend will handle knowledge retrieval."
    );

    return;
  }

  try {
    suryaProfileData =
      await window.SuryaProfileLoader.loadAllProfileData();

    console.log(
      "Professional profile data loaded successfully."
    );

  } catch (error) {
    console.warn(
      "Optional profile loading failed:",
      error
    );
  }
}

// ==========================================
// HOSTED LLM API
// ==========================================

async function getAIResponse(question) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, AI_CONFIG.requestTimeout);

  try {
    const response = await fetch(
      AI_CONFIG.apiUrl,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: question
        }),

        signal: controller.signal
      }
    );

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        "The AI service returned an invalid response."
      );
    }

    // Groq free-tier rate limit.
    if (response.status === 429) {
      return (
        "Surya's AI Assistance has reached its " +
        "temporary usage limit.\n\n" +
        "Please try again later."
      );
    }

    // Other API errors.
    if (!response.ok) {
      console.error(
        "AI backend error:",
        response.status,
        data.error
      );

      throw new Error(
        data.error || "AI service unavailable."
      );
    }

    if (
      typeof data.answer !== "string" ||
      !data.answer.trim()
    ) {
      throw new Error(
        "The AI service returned an empty answer."
      );
    }

    return data.answer.trim();

  } finally {
    clearTimeout(timeout);
  }
}

// ==========================================
// FALLBACK RESPONSES
// ==========================================

function getFallbackResponse(question) {
  const text = question.toLowerCase();

  if (
    text.includes("contact") ||
    text.includes("connect") ||
    text.includes("linkedin") ||
    text.includes("hire")
  ) {
    return (
      "You can connect with Surya through:\n\n" +
      `Portfolio: ${AI_CONFIG.portfolioUrl}\n` +
      `LinkedIn: ${AI_CONFIG.linkedinUrl}\n` +
      `GitHub: ${AI_CONFIG.githubUrl}\n` +
      `Hugging Face: ${AI_CONFIG.huggingFaceUrl}`
    );
  }

  if (
    text.includes("github") ||
    text.includes("repository")
  ) {
    return (
      "You can explore Surya's public GitHub " +
      "repositories here:\n\n" +
      AI_CONFIG.githubUrl
    );
  }

  if (
    text.includes("hugging face") ||
    text.includes("huggingface")
  ) {
    return (
      "You can explore Surya's Hugging Face " +
      "AI projects here:\n\n" +
      AI_CONFIG.huggingFaceUrl
    );
  }

  return (
    "I'm temporarily unable to generate an " +
    "AI-powered response.\n\n" +
    "You can explore Surya's professional " +
    "experience and projects through:\n\n" +
    `Portfolio: ${AI_CONFIG.portfolioUrl}\n` +
    `GitHub: ${AI_CONFIG.githubUrl}\n` +
    `Hugging Face: ${AI_CONFIG.huggingFaceUrl}\n\n` +
    "Please try your question again later."
  );
}

// ==========================================
// MAIN RESPONSE HANDLER
// ==========================================

async function getResponse(question) {
  try {
    return await getAIResponse(question);

  } catch (error) {
    if (error.name === "AbortError") {
      console.warn("AI request timed out.");
    } else {
      console.error("AI request failed:", error);
    }

    return getFallbackResponse(question);
  }
}

// ==========================================
// CHAT SUBMISSION
// ==========================================

if (chatForm && userInput && chatMessages && sendButton) {

  chatForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const question = userInput.value.trim();

      if (!question) {
        return;
      }

      if (
        question.length > AI_CONFIG.maxMessageLength
      ) {
        addMessage(
          "Please keep your question under " +
          AI_CONFIG.maxMessageLength +
          " characters.",
          "bot"
        );

        return;
      }

      // Display visitor message.
      addMessage(question, "user");

      // Clear and disable input.
      userInput.value = "";
      userInput.disabled = true;
      sendButton.disabled = true;

      // Display loading message.
      const loadingMessage = addMessage(
        "Surya's AI Assistance is thinking...",
        "bot"
      );

      try {
        const answer = await getResponse(question);

        loadingMessage.textContent = answer;

      } catch (error) {
        console.error(
          "Unexpected chat error:",
          error
        );

        loadingMessage.textContent =
          getFallbackResponse(question);

      } finally {
        userInput.disabled = false;
        sendButton.disabled = false;

        userInput.focus();

        scrollToBottom();
      }
    }
  );

} else {
  console.error(
    "Chat interface elements were not found."
  );
}

// ==========================================
// INITIALIZATION
// ==========================================

initializeProfileKnowledge();

console.log(
  AI_CONFIG.name + " initialized."
);
