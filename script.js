
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");

const githubUsername = "suryark88";

function addMessage(text, sender) {
  const message = document.createElement("div");

  message.className = `message ${sender}`;
  message.textContent = text;

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return message;
}

async function getGitHubProjects() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`
    );

    if (!response.ok) {
      throw new Error("GitHub API unavailable");
    }

    const repositories = await response.json();

    const projects = repositories
      .filter(repo => !repo.fork && !repo.archived)
      .filter(repo => repo.name !== githubUsername)
      .slice(0, 8);

    if (projects.length === 0) {
      return "No public original repositories found yet.";
    }

    return (
      "Here are some of Surya's public GitHub projects:\n\n" +
      projects.map(repo =>
        `${repo.name}\n${repo.description || "No description available."}\n${repo.html_url}`
      ).join("\n\n")
    );

  } catch (error) {
    return (
      "I couldn't retrieve GitHub projects right now. " +
      "You can explore them at https://github.com/suryark88"
    );
  }
}

async function getResponse(question) {
  const text = question.toLowerCase();

  if (
    text.includes("github") ||
    text.includes("repository") ||
    text.includes("repositories") ||
    text.includes("code")
  ) {
    return await getGitHubProjects();
  }

  if (
    text.includes("project") ||
    text.includes("automation")
  ) {
    return (
      "Surya has worked on several IT automation and AI projects:\n\n" +
      "1. Archware Post-Patch Reporting Automation\n" +
      "2. Centralized NOC Post-Patch Reporting Automation\n" +
      "3. SDM Intelligence Agent\n" +
      "4. Weekly Patch Compliance Reporting\n" +
      "5. VSA 10 Multi-Account Patch Analytics\n\n" +
      "Explore his GitHub: https://github.com/suryark88"
    );
  }

  if (
    text.includes("experience") ||
    text.includes("about surya") ||
    text.includes("who is surya")
  ) {
    return (
      "Surya Ram Kumar is an Operations Manager with " +
      "13+ years of experience across SaaS Service Delivery, " +
      "IT Operations, ITSM, and Customer Success.\n\n" +
      "His work focuses on operational efficiency, " +
      "service management, and intelligent automation."
    );
  }

  if (
    text.includes("skill") ||
    text.includes("technology") ||
    text.includes("expertise")
  ) {
    return (
      "Surya's technical expertise includes:\n\n" +
      "AI: Generative AI, Agentic AI, MCP\n" +
      "Automation: Power Automate, Office Scripts\n" +
      "Data: Snowflake, Power BI, Excel\n" +
      "IT Operations: SaaS, ITSM, RMM, BCDR\n" +
      "Cloud: Microsoft Azure"
    );
  }

  if (
    text.includes("portfolio") ||
    text.includes("website")
  ) {
    return (
      "You can explore Surya's professional portfolio here:\n" +
      "https://suryark88.github.io/"
    );
  }

  if (
    text.includes("contact") ||
    text.includes("linkedin") ||
    text.includes("hire")
  ) {
    return (
      "You can connect with Surya through his portfolio:\n" +
      "https://suryark88.github.io/\n\n" +
      "GitHub: https://github.com/suryark88"
    );
  }

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
  ) {
    return (
      "Hello! I'm Surya's AI Assistance.\n\n" +
      "You can ask me about his professional experience, " +
      "technical skills, automation projects, " +
      "or GitHub repositories."
    );
  }

  return (
    "I can help you learn about Surya's experience, " +
    "skills, AI automation projects, and GitHub work.\n\n" +
    "Try asking:\n" +
    "- Tell me about Surya's experience\n" +
    "- What are his technical skills?\n" +
    "- What projects has he worked on?\n" +
    "- Show his GitHub repositories"
  );
}

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
    loadingMessage.textContent =
      "Sorry, something went wrong. Please try again.";
  } finally {
    userInput.disabled = false;
    sendButton.disabled = false;
    userInput.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
