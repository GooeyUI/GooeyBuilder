import state from "./state.js";
import nativeBridge from "./nativeBridge.js";

export function showEditor(language) {
  if (language) {
    showPlatformSelection(language);
  } else {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("editor-screen").style.display = "block";
  }
}

export function showStartScreen() {
  document.getElementById("platform-indicator").style.display = "none";
  document.getElementById("editor-screen").style.display = "none";
  document.getElementById("start-screen").style.display = "flex";
}

export async function openDocs() {
  await nativeBridge.docsCommand();
}

export function showPlatformSelection(language) {
  state.projectSettings.language = language;
  const modal = document.getElementById("platform-selection-modal");
  modal.classList.add("active");

  const platformCards = document.querySelectorAll(".platform-card");
  platformCards.forEach((card) => {
    card.addEventListener("click", function () {
      platformCards.forEach((c) => c.classList.remove("selected"));
      this.classList.add("selected");
      state.selectedPlatform = this.dataset.platform;
      state.projectSettings.platform = this.dataset.platform;
      document.getElementById("confirm-platform-selection").disabled = false;
    });
  });

  document
    .getElementById("cancel-platform-selection")
    .addEventListener("click", function () {
      modal.classList.remove("active");
      state.selectedPlatform = null;
    });

  document
    .getElementById("confirm-platform-selection")
    .addEventListener("click", function () {
      modal.classList.remove("active");
      createNewProject();
    });
}

function createNewProject() {
  console.log(state);
  console.log(
    `Creating new ${state.projectSettings.language} project for ${state.projectSettings.platform} platform`,
  );
  updateUIForPlatform();
  showEditor();
}

function updateUIForPlatform() {
  const platformIndicator = document.getElementById("platform-indicator");
  platformIndicator.style.display = "block";
  platformIndicator.textContent = `${state.projectSettings.platform} | ${state.projectSettings.language}`;
}

// Initialize modal section toggles
document.querySelectorAll(".section-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const sectionId = toggle.getAttribute("data-section");
    const content = document.getElementById(`${sectionId}-settings`);
    const isCollapsed = content.classList.contains("collapsed");
    content.classList.toggle("collapsed", !isCollapsed);
    toggle.classList.toggle("collapsed", !isCollapsed);
    
  });
});

// Handle backend toggle switches - Modified to show "coming soon"
document
  .querySelectorAll('.backend-toggle input[type="checkbox"]')
  .forEach((toggle) => {
    toggle.addEventListener("change", (e) => {
      alert("Backend configuration is coming soon!");
      e.target.checked = false; // Uncheck the box
    });
  });

// Handle configuration buttons - Modified to show "coming soon"
document.querySelectorAll(".backend-config-btn").forEach((button) => {
  button.addEventListener("click", () => {
    alert("Backend configuration is coming soon!");
  });
});

// Initialize platform selection
document.querySelectorAll(".platform-card").forEach((card) => {
  card.addEventListener("click", () => {
    document
      .querySelectorAll(".platform-card")
      .forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
  });
});