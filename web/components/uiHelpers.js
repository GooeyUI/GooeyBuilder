import state from './state.js';
import nativeBridge from './nativeBridge.js';

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
  const modal = document.getElementById('platform-selection-modal');
  modal.classList.add('active');

  const platformCards = document.querySelectorAll('.platform-card');
  platformCards.forEach(card => {
    card.addEventListener('click', function () {
      platformCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      state.selectedPlatform = this.dataset.platform;
      state.projectSettings.platform = this.dataset.platform;
      document.getElementById('confirm-platform-selection').disabled = false;
    });
  });

  document.getElementById('cancel-platform-selection').addEventListener('click', function () {
    modal.classList.remove('active');
    state.selectedPlatform = null;
  });

  document.getElementById('confirm-platform-selection').addEventListener('click', function () {
    modal.classList.remove('active');
    createNewProject();
  });
}

function createNewProject() {
  console.log(`Creating new ${state.projectSettings.language} project for ${state.projectSettings.platform} platform`);
  updateUIForPlatform();
  showEditor();
}

function updateUIForPlatform() {
  const platformIndicator = document.getElementById('platform-indicator');
  platformIndicator.style.display = "block";
  platformIndicator.textContent = `${state.projectSettings.platform.toUpperCase()} | ${state.projectSettings.language.toUpperCase()}`;
}