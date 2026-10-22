
/*
 * Surya's AI Assistance
 * Public professional profile loader
 */

const PROFILE_CONFIG = {
  github: "suryark88",
  huggingface: "suryakumar-ai"
};

async function fetchJSON(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

async function loadProfessionalKnowledge() {
  try {
    return await fetchJSON("./knowledge.json");
  } catch (error) {
    console.warn("Knowledge base unavailable:", error);
    return null;
  }
}

async function loadGitHubProjects() {
  try {
    const username = PROFILE_CONFIG.github;

    const url =
      `https://api.github.com/users/${username}/repos` +
      "?per_page=100&sort=updated";

    const repositories = await fetchJSON(url);

    return repositories
      .filter(repo => !repo.fork && !repo.archived)
      .map(repo => ({
        name: repo.name,
        description: repo.description || "",
        url: repo.html_url,
        language: repo.language || "Not specified",
        updated: repo.updated_at,
        source: "GitHub"
      }));

  } catch (error) {
    console.warn("GitHub retrieval failed:", error);
    return [];
  }
}

async function loadHuggingFaceSpaces() {
  try {
    const username = PROFILE_CONFIG.huggingface;

    const url =
      "https://huggingface.co/api/spaces?author=" +
      encodeURIComponent(username);

    const spaces = await fetchJSON(url);

    return spaces.map(space => ({
      name: space.id.split("/").pop(),
      description: space.cardData?.short_description || "",
      url: `https://huggingface.co/spaces/${space.id}`,
      source: "Hugging Face"
    }));

  } catch (error) {
    console.warn("Hugging Face retrieval failed:", error);
    return [];
  }
}

async function loadAllProfileData() {
  const [knowledge, github, huggingface] =
    await Promise.all([
      loadProfessionalKnowledge(),
      loadGitHubProjects(),
      loadHuggingFaceSpaces()
    ]);

  return {
    knowledge,
    github,
    huggingface,
    retrievedAt: new Date().toISOString()
  };
}

// Expose the loader to the chatbot.
window.SuryaProfileLoader = {
  loadAllProfileData
};
