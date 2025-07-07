import state from './state.js';

export function updatePropertiesPanel() {
  if (!state.selectedWidget) return;

  const rect = state.selectedWidget.getBoundingClientRect();
  const previewRect = state.previewContent.getBoundingClientRect();

  document.getElementById("prop-type").value = state.selectedWidget.dataset.type;
  document.getElementById("prop-x").value = parseInt(state.selectedWidget.style.left) || 0;
  document.getElementById("prop-y").value = parseInt(state.selectedWidget.style.top) || 0;
  document.getElementById("prop-width").value = parseInt(state.selectedWidget.style.width) || rect.width;
  document.getElementById("prop-height").value = parseInt(state.selectedWidget.style.height) || rect.height;

  if (
    state.selectedWidget.dataset.type !== "Slider" &&
    state.selectedWidget.dataset.type !== "Image" &&
    state.selectedWidget.dataset.type !== "DropSurface"
  ) {
    document.getElementById("prop-text").value = state.selectedWidget.textContent || "";
    document.getElementById("prop-text").disabled = false;
  } else {
    document.getElementById("prop-text").disabled = true;
  }

  const widgetId = state.selectedWidget.dataset.id;
  if (state.widgetCallbacks[widgetId]) {
    document.getElementById("prop-callback").value = state.widgetCallbacks[widgetId].callbackName || "";
  }

  if (state.selectedWidget.dataset.type === "Slider") {
    document.getElementById("slider-min-value").value = state.selectedWidget.dataset.minValue || 0;
    document.getElementById("slider-max-value").value = state.selectedWidget.dataset.maxValue || 100;
    document.getElementById("slider-show-hints").value = state.selectedWidget.dataset.showHints || "false";
  }

  if (state.selectedWidget.dataset.type === "Image") {
    document.getElementById("image-relative-path").value = state.selectedWidget.dataset.relativePath || "./assets/example.png";
  }

  if (state.selectedWidget.dataset.type === "DropSurface") {
    document.getElementById("dropsurface-message").value = state.selectedWidget.dataset.dropsurfaceMessage || "Drop files here..";
  }

  if (state.selectedWidget.dataset.type === "Dropdown") {
    let optionsList = state.selectedWidget.dataset.dropdownOptions
      ? state.selectedWidget.dataset.dropdownOptions.split(",")
      : [];
    let dropdownOptionsUL = document.getElementById("dropdown-options");

    dropdownOptionsUL.innerHTML = "";
    optionsList.forEach((item, indx) => {
      dropdownOptionsUL.innerHTML += generateListItemForDropdownOptions(indx, item);
    });
  }

  if (state.selectedWidget.dataset.type === "List") {
    let optionsList = state.selectedWidget.dataset.listOptions
      ? JSON.parse(state.selectedWidget.dataset.listOptions)
      : [];
    let listOptionsUL = document.getElementById("list-options");

    listOptionsUL.innerHTML = "";
    optionsList.forEach((item, indx) => {
      listOptionsUL.innerHTML += generateListItemForListOptions(indx, item);
    });
  }
}

export function applyWidgetProperties() {
  if (!state.selectedWidget) return;

  state.selectedWidget.style.left = document.getElementById("prop-x").value + "px";
  state.selectedWidget.style.top = document.getElementById("prop-y").value + "px";
  state.selectedWidget.style.width = document.getElementById("prop-width").value + "px";
  state.selectedWidget.style.height = document.getElementById("prop-height").value + "px";

  if (
    state.selectedWidget.dataset.type !== "Slider" &&
    state.selectedWidget.dataset.type !== "Image" &&
    state.selectedWidget.dataset.type !== "DropSurface"
  ) {
    state.selectedWidget.textContent = document.getElementById("prop-text").value;
  }

  const widgetId = state.selectedWidget.dataset.id;
  if (state.widgetCallbacks[widgetId]) {
    state.widgetCallbacks[widgetId].callbackName = document.getElementById("prop-callback").value;
  }

  if (state.selectedWidget.dataset.type === "Slider") {
    state.selectedWidget.dataset.minValue = document.getElementById("slider-min-value").value;
    state.selectedWidget.dataset.maxValue = document.getElementById("slider-max-value").value;
    state.selectedWidget.dataset.showHints = document.getElementById("slider-show-hints").value;
  }

  if (state.selectedWidget.dataset.type === "Image") {
    state.selectedWidget.dataset.relativePath = document.getElementById("image-relative-path").value;
    state.selectedWidget.textContent = state.selectedWidget.dataset.relativePath.split("/").pop();
  }

  if (state.selectedWidget.dataset.type === "DropSurface") {
    state.selectedWidget.dataset.dropsurfaceMessage = document.getElementById("dropsurface-message").value;
    state.selectedWidget.textContent = state.selectedWidget.dataset.dropsurfaceMessage;
  }

  document.getElementById("status-text").textContent = "Properties updated";
  setTimeout(() => {
    document.getElementById("status-text").textContent = "Ready";
  }, 2000);

  updateWidgetList();
}

export function deleteSelectedWidget() {
  if (state.selectedWidget) {
    const widgetId = state.selectedWidget.dataset.id;

    if (state.widgetCallbacks[widgetId]) {
      delete state.widgetCallbacks[widgetId];
    }

    if (state.selectedWidget.classList.contains("layout")) {
      const children = Array.from(state.selectedWidget.children);
      children.forEach((child) => {
        if (
          child.classList.contains("widget") &&
          !child.classList.contains("resize-handle")
        ) {
          const rect = child.getBoundingClientRect();
          const previewRect = state.previewContent.getBoundingClientRect();
          child.style.left = rect.left - previewRect.left + "px";
          child.style.top = rect.top - previewRect.top + "px";
          state.previewContent.appendChild(child);
        }
      });
    }

    state.selectedWidget.remove();
    state.selectedWidget = null;
    document.getElementById("widget-properties").style.display = "none";
    document.getElementById("status-text").textContent = "Widget deleted";
    setTimeout(() => {
      document.getElementById("status-text").textContent = "Ready";
    }, 2000);

    updateWidgetList();
  }
}

export function applyWindowSettings() {
  const title = document.getElementById("win-title").value;
  const width = document.getElementById("win-width").value;
  const height = document.getElementById("win-height").value;

  state.previewTitleBar.querySelector(".preview-title-text").textContent = title;
  state.previewWindow.style.width = width + "px";
  state.previewWindow.style.height = height + "px";

  const window_hint_debug_overlay = document.getElementById("window-debug-enable-overlay").checked;
  const window_hint_cont_redraw = document.getElementById("window-debug-enable-cont-redraw").checked;
  const window_hint_is_visible = document.getElementById("window-debug-is-visible").checked;
  const window_hint_is_resizable = document.getElementById("window-debug-is-resizable").checked;

  state.previewWindow.dataset.debug_overlay = window_hint_debug_overlay.toString();
  state.previewWindow.dataset.cont_redraw = window_hint_cont_redraw.toString();
  state.previewWindow.dataset.is_visible = window_hint_is_visible.toString();
  state.previewWindow.dataset.is_resizable = window_hint_is_resizable.toString();
  
  document.getElementById("status-text").textContent = "Window settings updated";
  setTimeout(() => {
    document.getElementById("status-text").textContent = "Ready";
  }, 2000);
}

export function selectWidget(widget) {
  if (state.selectedWidget) {
    state.selectedWidget.classList.remove("selected");
  }

  state.selectedWidget = widget;
  widget.classList.add("selected");
  
  document.getElementById("window-properties").style.display = "none";
  document.getElementById("widget-properties").style.display = "block";
  document.getElementById("menu-properties").style.display = "none";
  document.getElementById("slider-properties").style.display = "none";
  document.getElementById("image-properties").style.display = "none";
  document.getElementById("dropdown-properties").style.display = "none";
  document.getElementById("list-properties").style.display = "none";
  document.getElementById("dropsurface-properties").style.display = "none";

  if (widget.dataset.type === "Slider") {
    document.getElementById("slider-properties").style.display = "block";
  } else if (widget.dataset.type === "Image") {
    document.getElementById("image-properties").style.display = "block";
  } else if (widget.dataset.type === "DropSurface") {
    document.getElementById("dropsurface-properties").style.display = "block";
  } else if (widget.dataset.type === "Dropdown") {
    document.getElementById("dropdown-properties").style.display = "block";
    document.getElementById("dropdown-option-input").value = "";
  } else if (widget.dataset.type === "List") {
    document.getElementById("list-properties").style.display = "block";
    document.getElementById("list-option-input").value = "";
    document.getElementById("list-option-input-desc").value = "";
  } else if (widget.dataset.type === "Menu") {
    document.getElementById("menu-properties").style.display = "block";
  }

  updatePropertiesPanel();

  document.getElementById("status-text").textContent = `Selected: ${widget.dataset.type}`;
}

export function updateWidgetList() {
  const widgetList = document.getElementById("widget-list");
  widgetList.innerHTML = "";

  state.previewContent.querySelectorAll(".widget").forEach((widget) => {
    if (!widget.parentElement.classList.contains("layout")) {
      const widgetId = widget.dataset.id;
      const widgetType = widget.dataset.type;
      const widgetText = widget.textContent || widgetType;
      const callbackName = state.widgetCallbacks[widgetId]?.callbackName || "";

      const listItem = document.createElement("div");
      listItem.className = "widget-list-item";
      listItem.dataset.widgetId = widgetId;
      listItem.innerHTML = `
        <div><strong>${widgetType}</strong></div>
        <div>${widgetText.substring(0, 20)}${widgetText.length > 20 ? "..." : ""}</div>
        ${callbackName ? `<div style="color: var(--vs-accent);">${callbackName}</div>` : ""}
      `;

      listItem.addEventListener("click", function () {
        document.querySelectorAll(".widget-list-item").forEach((item) => {
          item.classList.remove("selected");
        });
        this.classList.add("selected");
        state.currentEditingWidget = widgetId;
        updateCallbackSelector(widgetId);
      });

      widgetList.appendChild(listItem);
    }
  });
}

function updateCallbackSelector(widgetId) {
  const selector = document.getElementById("callback-selector");
  selector.innerHTML = '<option value="">Select a callback to edit</option>';

  if (!widgetId) return;

  const widget = document.querySelector(`.widget[data-id="${widgetId}"]`);
  if (!widget) return;

  const widgetType = widget.dataset.type;
  const callbacks = state.widgetCallbacks[widgetId] || {};

  switch (widgetType) {
    case "Button":
      selector.innerHTML += `<option value="button" ${callbacks.button ? "selected" : ""}>Button Click</option>`;
      break;
    case "Slider":
      selector.innerHTML += `<option value="slider" ${callbacks.slider ? "selected" : ""}>Slider Value Changed</option>`;
      break;
    case "Checkbox":
      selector.innerHTML += `<option value="checkbox" ${callbacks.checkbox ? "selected" : ""}>Checkbox Toggled</option>`;
      break;
    case "Input":
      selector.innerHTML += `<option value="input" ${callbacks.input ? "selected" : ""}>Input Changed</option>`;
      break;
    case "Image":
      selector.innerHTML += `<option value="image" ${callbacks.image ? "selected" : ""}>Image Click</option>`;
      break;
    case "Dropdown":
      selector.innerHTML += `<option value="dropdown" ${callbacks.dropdown ? "selected" : ""}>Dropdown Selected index</option>`;
      break;
    case "DropSurface":
      selector.innerHTML += `<option value="dropsurface" ${callbacks.dropsurface ? "selected" : ""}>DropSurface on File drop</option>`;
      break;
    case "List":
      selector.innerHTML += `<option value="list" ${callbacks.list ? "selected" : ""}>List Item Selected</option>`;
      break;
    default:
      selector.innerHTML += '<option value="">No callbacks available for this widget type</option>';
  }

  selector.addEventListener("change", function () {
    const callbackType = this.value;
    if (!callbackType) {
      state.callbackEditor.setValue("");
      return;
    }

    const callbackName = state.widgetCallbacks[widgetId]?.callbackName || "";
    if (callbackName) {
      let callbackSignature = "";
      let callbackBody = "";

      if (state.widgetCallbacks[widgetId][`${callbackType}_code`]) {
        callbackBody = state.widgetCallbacks[widgetId][`${callbackType}_code`];
      } else {
        switch (callbackType) {
          case "button":
            callbackSignature = `void ${callbackName}() {\n    // Your code here\n}`;
            break;
          case "slider":
            callbackSignature = `void ${callbackName}(int value) {\n    // Your code here\n    // value contains the current slider position\n}`;
            break;
          case "checkbox":
            callbackSignature = `void ${callbackName}(bool checked) {\n    // Your code here\n    // checked is true if checkbox is checked\n}`;
            break;
          case "input":
            callbackSignature = `void ${callbackName}(const char* text) {\n    // Your code here\n    // text contains the current input text\n}`;
            break;
          case "image":
            callbackSignature = `void ${callbackName}() {\n    // Your code here\n}`;
            break;
          case "dropdown":
            callbackSignature = `void ${callbackName}(int selected_index) {\n    // Your code here\n    // selected_index contains the index of the currently selected option.\n}`;
            break;
          case "dropsurface":
            callbackSignature = `void ${callbackName}(char *mime, char *file_path){\n //Your code here \n}`;
            break;
          case "list":
            callbackSignature = `void ${callbackName}(int selected_index, const char* item_name, const char* item_description) {\n    // Your code here\n    // selected_index: Index of selected item\n    // item_name: Name of selected item\n    // item_description: Description of selected item\n}`;
            break;
        }
        callbackBody = callbackSignature;
      }
      state.callbackEditor.setValue(callbackBody);

      if (!state.widgetCallbacks[widgetId]) {
        state.widgetCallbacks[widgetId] = {};
      }
      state.widgetCallbacks[widgetId][callbackType] = callbackName;
    } else {
      state.callbackEditor.setValue("");
    }
  });

  document.getElementById("save-callback").addEventListener("click", function () {
    if (!state.currentEditingWidget) return;

    const selector = document.getElementById("callback-selector");
    const callbackType = selector.value;
    if (!callbackType) return;

    const code = state.callbackEditor.getValue();
    if (!state.widgetCallbacks[state.currentEditingWidget]) {
      state.widgetCallbacks[state.currentEditingWidget] = {};
    }

    state.widgetCallbacks[state.currentEditingWidget][`${callbackType}_code`] = code;

    document.getElementById("status-text").textContent = "Callback saved";
    setTimeout(() => {
      document.getElementById("status-text").textContent = "Ready";
    }, 2000);
  });

  document.getElementById("cancel-callback").addEventListener("click", function () {
    selector.dispatchEvent(new Event("change"));
  });

  selector.dispatchEvent(new Event("change"));
}

