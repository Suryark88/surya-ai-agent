
/*
 * Surya's AI Assistance
 * Professional Portfolio & GitHub AI Assistant
 *
 * Hosted LLM: Groq GPT-OSS 20B
 * Backend: Cloudflare Workers
 * Frontend: GitHub Pages
 *
 * Markdown: Marked + DOMPurify
 *
 * Knowledge retrieval is handled by the
 * Cloudflare Worker.
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

  email: "suryark@live.com",

  phone: "+91 9538266771",

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

function scrollToBottom() {
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function addMessage(text, sender) {
  const message = document.createElement("div");

  message.className = `message ${sender}`;

  // User messages and initial loading text
  // are always inserted as plain text.
  message.textContent = text;

  chatMessages.appendChild(message);

  scrollToBottom();

  return message;
}

// ==========================================
// SAFE MARKDOWN RENDERING
// ==========================================

function renderAIMessage(element, text) {
  if (
    typeof window.marked === "undefined" ||
    typeof window.DOMPurify === "undefined"
  ) {
    console.warn(
      "Markdown libraries unavailable. " +
      "Displaying plain text."
    );

    element.textContent = text;
    return;
  }

  try {
    const html = window.marked.parse(text, {
      gfm: true,
      breaks: true
    });

    const sanitized = window.DOMPurify.sanitize(
      html,
      {
        USE_PROFILES: {
          html: true
        }
      }
    );

    element.innerHTML = sanitized;

    // Open external links safely.
    element.querySelectorAll("a").forEach(link => {
      const href = link.getAttribute("href") || "";

      if (
        !href.startsWith("https://") &&
        !href.startsWith("http://") &&
        !href.startsWith("mailto:")
      ) {
        link.removeAttribute("href");
        return;
      }

      link.setAttribute("target", "_blank");
      link.setAttribute(
        "rel",
        "noopener noreferrer"
      );
    });

  } catch (error) {
    console.error(
      "Markdown rendering failed:",
      error
    );

    element.textContent = text;
  }

  scrollToBottom();
}

// ==========================================
// OPTIONAL PROFILE INITIALIZATION
// ==========================================

let suryaProfileData = null;

async function initializeProfileKnowledge() {
  if (!window.SuryaProfileLoader) {
    console.info(
      "Profile loader unavailable. " +
      "Cloudflare handles knowledge retrieval."
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
// HOSTED GROQ LLM API
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

    // Groq or Cloudflare rate limit.
    if (response.status === 429) {
      return (
        "Surya's AI Assistance has reached " +
        "its temporary usage limit.\n\n" +
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
// CONTACT INFORMATION
// ==========================================

function getContactInformation() {
  return (
    "**Contact Surya Ram Kumar**\n\n" +
    `- **Email:** [${AI_CONFIG.email}](mailto:${AI_CONFIG.email})\n` +
    `- **Phone:** ${AI_CONFIG.phone}\n` +
    `- **LinkedIn:** ${AI_CONFIG.linkedinUrl}\n` +
    `- **Portfolio:** ${AI_CONFIG.portfolioUrl}\n` +
    `- **GitHub:** ${AI_CONFIG.githubUrl}\n` +
    `- **Hugging Face:** ${AI_CONFIG.huggingFaceUrl}`
  );
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
    text.includes("hire") ||
    text.includes("recruiter")
  ) {
    return (
      "You can contact Surya directly " +
      "for professional opportunities " +
      "or additional information.\n\n" +
      getContactInformation()
    );
  }

  if (
    text.includes("github") ||
    text.includes("repository")
  ) {
    return (
      "You can explore Surya's public " +
      "GitHub repositories here:\n\n" +
      AI_CONFIG.githubUrl +
      "\n\n" +
      getContactInformation()
    );
  }

  if (
    text.includes("hugging face") ||
    text.includes("huggingface")
  ) {
    return (
      "You can explore Surya's Hugging Face " +
      "AI projects here:\n\n" +
      AI_CONFIG.huggingFaceUrl +
      "\n\n" +
      getContactInformation()
    );
  }

  return (
    "I'm temporarily unable to generate " +
    "an AI-powered response to that question.\n\n" +
    "For additional information about Surya's " +
    "professional background, technical expertise, " +
    "or availability, please contact him directly.\n\n" +
    getContactInformation()
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
      console.warn(
        "AI request timed out."
      );
    } else {
      console.error(
        "AI request failed:",
        error
      );
    }

    return getFallbackResponse(question);
  }
}

// ==========================================
// CHAT SUBMISSION
// ==========================================

if (
  chatForm &&
  userInput &&
  chatMessages &&
  sendButton
) {

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

        // Render AI-generated Markdown safely.
        renderAIMessage(
          loadingMessage,
          answer
        );

      } catch (error) {
        console.error(
          "Unexpected chat error:",
          error
        );

        renderAIMessage(
          loadingMessage,
          getFallbackResponse(question)
        );

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
