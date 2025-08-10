import state from './state.js';
import { updatePropertiesPanel, selectWidget } from './propertiesPanel.js';
import { setupEditorDrag, setupWidgetDrag } from './dragHandlers.js';
import { updateWidgetList } from './propertiesPanel.js';
import { generateProjectXML } from './projectManagement.js';

export function createWidget(type, x, y, parent = null) {
  let newWidget = document.createElement("div");
  newWidget.className = "widget";
  newWidget.dataset.type = type;
  newWidget.dataset.id = "widget_" + Date.now();

  switch (type) {
    case "RadioButtonGroup":
      newWidget.className += " widget-radiobuttongrp";
      newWidget.textContent = "RadioButton";
      break;
    case "Menu":
      newWidget.className += " widget-menu";
      newWidget.textContent = "Menu";
      break;
    case "Button":
      newWidget.className += " widget-button";
      newWidget.textContent = "Button";
      newWidget.style.width = "100px";
      newWidget.style.height = "30px";
      break;
    case "Input":
      newWidget.className += " widget-input";
      newWidget.textContent = "";
      newWidget.style.width = "150px";
      newWidget.style.height = "24px";
      break;
    case "Slider":
      newWidget.className += " widget-slider";
      newWidget.style.width = "150px";
      newWidget.style.height = "24px";
      break;
    case "Checkbox":
      newWidget.className += " widget-checkbox";
      newWidget.style.width = "16px";
      newWidget.style.height = "16px";
      newWidget.addEventListener("click", function (e) {
        e.stopPropagation();
        this.classList.toggle("checked");
      });
      break;
    case "Label":
      newWidget.className += " widget-label";
      newWidget.textContent = "Label";
      newWidget.style.width = "100px";
      newWidget.style.height = "20px";
      break;
    case "Canvas":
      newWidget.className += " widget-canvas";
      newWidget.textContent = "Canvas";
      newWidget.style.width = "200px";
      newWidget.style.height = "150px";
      break;
    case "Image":
      newWidget.className += " widget-image";
      newWidget.textContent = "Image";
      newWidget.style.width = "150px";
      newWidget.style.height = "150px";
      break;
    case "DropSurface":
      newWidget.className += " widget-dropsurface";
      newWidget.textContent = "Drop files here..";
      newWidget.style.width = "200px";
      newWidget.style.height = "150px";
      break;
    case "Dropdown":
      newWidget.className += " widget-dropdown";
      newWidget.style.width = "100px";
      newWidget.style.height = "30px";
      newWidget.textContent = "Dropdown";
      break;
    case "List":
      newWidget.className += " widget-list";
      newWidget.style.display = "flex";
      newWidget.style.alignItems = "center";
      newWidget.style.justifyContent = "center";
      newWidget.style.width = "200px";
      newWidget.style.height = "200px";
      newWidget.textContent = "List";
      break;
    case "Progressbar":
      newWidget.className += " widget-progressbar";
      newWidget.style.width = "150px";
      newWidget.style.height = "10px";
      newWidget.innerHTML = '<div class="progress-fill" style="width: 50%;"></div>';
      break;
    case "Meter":
      newWidget.className += " widget-meter";
      newWidget.style.width = "100px";
      newWidget.style.height = "100px";
      newWidget.textContent = "Meter";
      break;
    case "GSwitch":
      newWidget.className += " widget-gswitch";
      newWidget.style.width = "40px";
      newWidget.style.height = "20px";
      newWidget.innerHTML = '<div class="switch-toggle"></div>';
      newWidget.addEventListener("click", function (e) {
        e.stopPropagation();
        this.classList.toggle("checked");
      });
      break;
    case "Tabs":
      newWidget.className += " widget-tabs";
      newWidget.style.width = "200px";
      newWidget.style.height = "150px";
      newWidget.innerHTML = `
        <div class="tab-header">
          <div class="tab-item active">Tab 1</div>
          <div class="tab-item">Tab 2</div>
        </div>
        <div class="tab-content">Tab 1 Content</div>
      `;
      break;
    case "VerticalLayout":
      newWidget.className += " layout vertical";
      newWidget.style.width = "200px";
      newWidget.style.height = "200px";
      newWidget.style.display = "flex";
      newWidget.style.flexDirection = "column";
      newWidget.style.alignItems = "stretch";
      const placeholderV = document.createElement("div");
      placeholderV.className = "layout-placeholder";
      placeholderV.textContent = "Drop widgets here";
      newWidget.appendChild(placeholderV);
    break;
    case "HorizontalLayout":
      newWidget.className += " layout horizontal";
      newWidget.style.width = "300px";
      newWidget.style.height = "100px";
      newWidget.style.display = "flex";
      newWidget.style.flexDirection = "row";
      newWidget.style.alignItems = "stretch";
      const placeholderH = document.createElement("div");
      placeholderH.className = "layout-placeholder";
      placeholderH.textContent = "Drop widgets here";
      newWidget.appendChild(placeholderH);
    break;
    case "Container":
      newWidget.className += " layout container";
      newWidget.style.width = "200px";
      newWidget.style.height = "200px";
      newWidget.style.position = "relative"; // Important for child positioning
      const placeholderC = document.createElement("div");
      placeholderC.className = "layout-placeholder";
      placeholderC.textContent = "Drop widgets here";
      newWidget.appendChild(placeholderC);
    break;
    case "Overlay":
      newWidget.className += " widget-overlay";
      newWidget.textContent = "Overlay";
      newWidget.style.width = "200px";
      newWidget.style.height = "150px";
      break;
    case "Plot":
      newWidget.className += " widget-plot";
      newWidget.textContent = "Plot";
      newWidget.style.width = "200px";
      newWidget.style.height = "150px";
      break;
  }

  newWidget.style.left = x + "px";
  newWidget.style.top = y + "px";

  if (parent) {
    parent.appendChild(newWidget);
    const placeholder = parent.querySelector(".layout-placeholder");
    if (placeholder) {
      parent.removeChild(placeholder);
    }
  } else {
    state.previewContent.appendChild(newWidget);
  }

  if (type === "VerticalLayout" || type === "HorizontalLayout" || type === "Container") {
    const resizeHandle = document.createElement("div");
    resizeHandle.className = "resize-handle";
    newWidget.appendChild(resizeHandle);
    setupResizeHandle(resizeHandle, newWidget);
  }

  if (type === "List" && !state.isListInit) {
    const listOptionAddButton = document.getElementById("list-option-add-button");
    listOptionAddButton.addEventListener("click", function listListener(e) {
      if (e) {
        const listItemName = document.getElementById("list-option-input").value;
        const listItemDesc = document.getElementById("list-option-input-desc").value;

        let list = state.selectedWidget.dataset.listOptions
          ? JSON.parse(state.selectedWidget.dataset.listOptions)
          : [];

        const newItem = {
          name: listItemName.trim(),
          description: listItemDesc.trim(),
        };

        list.push(newItem);

        state.selectedWidget.dataset.listOptions = JSON.stringify(list);

        if (newItem.name) {
          document.getElementById("list-options").innerHTML +=
            generateListItemForListOptions(list.length - 1, newItem);
        }

        document.getElementById("list-option-input").value = "";
        document.getElementById("list-option-input-desc").value = "";
      }
    });

    state.isListInit = true;
  }

  if (type === "Dropdown" && !state.isDropdownInit) {
    const dropdownOptionAddButton = document.getElementById("dropdown-option-add-button");
    dropdownOptionAddButton.addEventListener("click", function dropdownListener(e) {
      if (e) {
        const optionInput = document.getElementById("dropdown-option-input");
        const newItem = optionInput.value;

        let list = state.selectedWidget.dataset.dropdownOptions
          ? state.selectedWidget.dataset.dropdownOptions.split(",")
          : [];
        list.push(newItem.trim());

        state.selectedWidget.dataset.dropdownOptions = list.join(",");

        if (newItem) {
          document.getElementById("dropdown-options").innerHTML +=
            generateListItemForDropdownOptions(list.length - 1, newItem);
        }

        optionInput.value = "";
      }
    });

    state.isDropdownInit = true;
  }

  setupWidgetDrag(newWidget);
  setupWidgetSelection(newWidget);
  selectWidget(newWidget);

  state.widgetCallbacks[newWidget.dataset.id] = {
    callbackName: "",
    button: "",
    slider: "",
    checkbox: "",
    input: "",
    dropdown: "",
    dropsurface: "",
    list: "",
    progressbar: "",
    meter: "",
    gswitch: "",
    tabs: "",
    container: "",
    overlay: "",
    plot: "",
  };

  updateWidgetList();
  state.projectXml = generateProjectXML();
  const unformattedXMLCode = state.projectXml;
  try {
    const formattedXMLCode = prettier.format(unformattedXMLCode, { parser: 'babel', plugins: prettierPlugins });
    state.uiXmlEditor.setValue(formattedXMLCode);
  } catch (e) {
    console.error("Prettier formatting failed:", e);
  }
  return newWidget;
}

function generateListItemForListOptions(id, item) {
  return `<li class="option-item" id="list-option-${id}">
    <div class="option-content">
      <span class="option-name">${item.name}</span>
      <span class="option-desc">${item.description}</span>
    </div>
    <button class="button" onclick="deleteListOption(${id})">delete</button>
  </li>`;
}

function generateListItemForDropdownOptions(id, item) {
  return `<li class="option-item" id="dropdown-option-${id}">
    <span class="option-name">${item}</span>
    <button class="button" onclick="deleteDropdownOption(${id})">delete</button>
  </li>`;
}

export function deleteListOption(id) {
  let list = state.selectedWidget.dataset.listOptions
    ? JSON.parse(state.selectedWidget.dataset.listOptions)
    : [];

  const index = list.findIndex((item, idx) => idx.toString() === id.toString());

  if (index !== -1) {
    list.splice(index, 1);
    state.selectedWidget.dataset.listOptions = JSON.stringify(list);

    let listOptionsUL = document.getElementById("list-options");
    listOptionsUL.innerHTML = "";
    list.forEach((item, idx) => {
      listOptionsUL.innerHTML += generateListItemForListOptions(idx, item);
    });
  }
}

export function deleteDropdownOption(id) {
  let list = state.selectedWidget.dataset.dropdownOptions
    ? state.selectedWidget.dataset.dropdownOptions.split(",")
    : [];

  const index = list.findIndex((item, idx) => idx.toString() === id.toString());

  if (index !== -1) {
    list.splice(index, 1);
    state.selectedWidget.dataset.dropdownOptions = list.join(",");

    let dropdownOptionsUL = document.getElementById("dropdown-options");
    dropdownOptionsUL.innerHTML = "";
    list.forEach((item, idx) => {
      dropdownOptionsUL.innerHTML += generateListItemForDropdownOptions(idx, item);
    });
  }
}

export function setupResizeHandle(handle, widget) {
  handle.addEventListener("mousedown", function (e) {
    e.stopPropagation();
    state.resizingWidget = widget;
    state.resizeStartWidth = widget.offsetWidth;
    state.resizeStartHeight = widget.offsetHeight;
    state.resizeStartX = e.clientX;
    state.resizeStartY = e.clientY;

    document.addEventListener("mousemove", onResizeMove);
    document.addEventListener("mouseup", onResizeEnd);
  });
}

function onResizeMove(e) {
  if (!state.resizingWidget) return;

  const width = state.resizeStartWidth + (e.clientX - state.resizeStartX);
  const height = state.resizeStartHeight + (e.clientY - state.resizeStartY);

  state.resizingWidget.style.width = Math.max(50, width) + "px";
  state.resizingWidget.style.height = Math.max(50, height) + "px";

  updatePropertiesPanel();
}

function onResizeEnd() {
  state.resizingWidget = null;
  document.removeEventListener("mousemove", onResizeMove);
  document.removeEventListener("mouseup", onResizeEnd);
}

export function setupWidgetSelection(element) {
  element.addEventListener("click", function (e) {
    if (e.target.classList.contains("resize-handle")) return;
    e.stopPropagation();
    selectWidget(element);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme based on system preference or default to dark
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = prefersDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', initialTheme);
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.querySelector('.material-icons').textContent = initialTheme === 'dark' ? 'light_mode' : 'dark_mode';
  }

  // Theme toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      themeToggle.querySelector('.material-icons').textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
    });
  } else {
    console.warn('Theme toggle button not found');
  }

  // Platform selection modal
  const platformModal = document.getElementById('platform-selection-modal');
  const showPlatformSelection = () => {
    if (platformModal) {
      platformModal.classList.add('active');
    }
  };
  window.showPlatformSelection = showPlatformSelection; // Expose for HTML onclick
  const cancelButton = document.getElementById('cancel-platform-selection');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      if (platformModal) {
        platformModal.classList.remove('active');
      }
    });
  }

  // Advanced settings panel
  const settingsToggle = document.getElementById('advanced-settings-toggle');
  const settingsToggleEditor = document.getElementById('advanced-settings-toggle-editor');
  const settingsPanel = document.getElementById('advanced-settings-panel');
  const closeSettingsButton = document.getElementById('close-settings-button');
  if (settingsToggle && settingsPanel) {
    settingsToggle.addEventListener('click', () => {
      settingsPanel.classList.add('visible');
    });
  }
  if (settingsToggleEditor && settingsPanel) {
    settingsToggleEditor.addEventListener('click', () => {
      settingsPanel.classList.add('visible');
    });
  }
  if (closeSettingsButton && settingsPanel) {
    closeSettingsButton.addEventListener('click', () => {
      settingsPanel.classList.remove('visible');
    });
  }

  // Mock function for documentation link
  window.openDocs = () => {
    window.open('https://gooeyui.github.io/GooeyGUI/quickstart.html', '_blank');
  };

  // Initialize preview content
  state.previewContent = document.getElementById('preview-content');
});