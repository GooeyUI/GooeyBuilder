import state from './state.js';
import { updatePropertiesPanel, selectWidget } from './propertiesPanel.js';
import { setupEditorDrag, setupWidgetDrag } from './dragHandlers.js';
import { updateWidgetList } from './propertiesPanel.js';
export function createWidget(type, x, y, parent = null) {
  let newWidget = document.createElement("div");
  newWidget.className = "widget";
  newWidget.dataset.type = type;
  newWidget.dataset.id = "widget_" + Date.now();

  switch (type) {
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
    case "VerticalLayout":
      newWidget.className += " layout vertical";
      newWidget.style.width = "200px";
      newWidget.style.height = "200px";
      const placeholderV = document.createElement("div");
      placeholderV.className = "layout-placeholder";
      placeholderV.textContent = "Drop widgets here";
      newWidget.appendChild(placeholderV);
      break;
    case "HorizontalLayout":
      newWidget.className += " layout horizontal";
      newWidget.style.width = "300px";
      newWidget.style.height = "100px";
      const placeholderH = document.createElement("div");
      placeholderH.className = "layout-placeholder";
      placeholderH.textContent = "Drop widgets here";
      newWidget.appendChild(placeholderH);
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

  if (type === "VerticalLayout" || type === "HorizontalLayout") {
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
  };

  updateWidgetList();

  return newWidget;
}

function generateListItemForListOptions(id, item) {
  return `<li style="width: 90%; display: flex; flex-direction:row; gap:10px; align-items: center; margin-bottom: 10px;" id="list-option-${id}">
    <div style="display: flex; flex-direction: column;">
      <span style="font-weight: bold;">${item.name}</span>
      <span style="font-size: 0.8em; color: #666;">${item.description}</span>
    </div>
    <button style="margin-left: auto;" class="button" onclick="deleteListOption(${id})">delete</button>
  </li>`;
}

function generateListItemForDropdownOptions(id, item) {
  return `<li style="width: 90%; display: flex; flex-direction:row; gap:10px; align-items: center; margin-bottom: 10px;" id="dropdown-option-${id}">
    <span style="margin-right: auto;">${item}</span>
    <button style="margin-left: auto;" class="button" onclick="deleteDropdownOption(${id})">delete</button>
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