import state from './state.js';
import nativeBridge from './nativeBridge.js';

export async function generateC() {
  let cCode;
  if (state.projectSettings.platform == "embedded") {
    cCode = `#include <gooey.h>\n`;
    cCode += `#include <Arduino.h>\n\n`;
  } else {
    cCode = `#include <Gooey/gooey.h>\n`;
  }

  Object.entries(state.widgetCallbacks).forEach(([widgetId, callbacks]) => {
    if (callbacks.button && callbacks.button_code) {
      cCode += `${callbacks.button_code}\n\n`;
    }
    if (callbacks.slider && callbacks.slider_code) {
      cCode += `${callbacks.slider_code}\n\n`;
    }
    if (callbacks.checkbox && callbacks.checkbox_code) {
      cCode += `${callbacks.checkbox_code}\n\n`;
    }
    if (callbacks.input && callbacks.input_code) {
      cCode += `${callbacks.input_code}\n\n`;
    }
    if (callbacks.image && callbacks.image_code) {
      cCode += `${callbacks.image_code}\n\n`;
    }
    if (callbacks.dropdown && callbacks.dropdown_code) {
      cCode += `${callbacks.dropdown_code}\n\n`;
    }
    if (callbacks.dropsurface && callbacks.dropsurface_code) {
      cCode += `${callbacks.dropsurface_code}\n\n`;
    }
    if (callbacks.list && callbacks.list_code) {
      cCode += `${callbacks.list_code}\n\n`;
    }
  });

  switch (state.projectSettings.platform) {
    case "embedded":
      cCode += `void setup()\n{\n`;
      break;
    case "desktop":
      cCode += `int main()\n{\n`;
      break;
    case "web":
      break;
    default:
      break;
  }

  cCode += `    Gooey_Init();\n`;
  cCode += `    GooeyWindow *win = GooeyWindow_Create("${document.getElementById("win-title").value}", ${document.getElementById("win-width").value}, ${document.getElementById("win-height").value}, true);\n\n`;

  if (state.previewWindow.dataset.debug_overlay === "true")
    cCode += `    GooeyWindow_EnableDebugOverlay(win, true);\n`;

  if (state.previewWindow.dataset.cont_redraw === "true")
    cCode += `    GooeyWindow_SetContinuousRedraw(win);\n`;

  if (state.previewWindow.dataset.is_visible === "true")
    cCode += `    GooeyWindow_MakeVisible(win, true);\n`;
  else cCode += `    GooeyWindow_MakeVisible(win, false);\n`;

  if (state.previewWindow.dataset.is_resizable === "true")
    cCode += `    GooeyWindow_MakeResizable(win, true);\n`;
  else cCode += `    GooeyWindow_MakeResizable(win, false);\n`;

  let widgetCount = 0;
  let widgetVars = [];
  let widgetRegistrations = [];

  function processWidgetC(widget, indent) {
    let type = widget.dataset.type;
    let x = parseInt(widget.style.left) || 0;
    let y = parseInt(widget.style.top) || 0;
    let width = parseInt(widget.style.width) || 100;
    let height = parseInt(widget.style.height) || 30;

    let text = widget.textContent || "";
    text = text.replace(/"/g, '\\"');

    const widgetId = widget.dataset.id;
    let callbackName = state.widgetCallbacks[widgetId]?.callbackName || "";

    let widgetVar = `${type.toLowerCase()}_${widgetCount++}`;
    widgetVars.push(widgetVar);

    let widgetCode = "";

    switch (type) {
      case "Button":
        widgetCode = `${indent}GooeyButton *${widgetVar} = GooeyButton_Create("${text}", ${x}, ${y}, ${width}, ${height}, ${callbackName || "NULL"});\n`;
        if (callbackName) {
          state.widgetCallbacks[widgetId].button = callbackName;
        }
        break;
      case "Input":
        widgetCode = `${indent}GooeyTextbox *${widgetVar} = GooeyTextBox_Create(${x}, ${y}, ${width}, ${height}, "${text}", false, ${callbackName || "NULL"});\n`;
        if (callbackName) {
          state.widgetCallbacks[widgetId].input = callbackName;
        }
        break;
      case "Slider":
        let minValue = widget.dataset.minValue || 0;
        let maxValue = widget.dataset.maxValue || 100;
        let showHints = widget.dataset.showHints || "false";
        widgetCode = `${indent}GooeySlider *${widgetVar} = GooeySlider_Create(${x}, ${y}, ${width}, ${minValue}, ${maxValue}, ${showHints}, ${callbackName || "NULL"});\n`;
        if (callbackName) {
          state.widgetCallbacks[widgetId].slider = callbackName;
        }
        break;
      case "Checkbox":
        widgetCode = `${indent}GooeyCheckbox *${widgetVar} = GooeyCheckbox_Create(${x}, ${y}, "${text}", ${callbackName || "NULL"});\n`;
        if (callbackName) {
          state.widgetCallbacks[widgetId].checkbox = callbackName;
        }
        break;
      case "Label":
        widgetCode = `${indent}GooeyLabel *${widgetVar} = GooeyLabel_Create("${text}", 0.26f, ${x}, ${y});\n`;
        break;
      case "Canvas":
        widgetCode = `${indent}GooeyCanvas *${widgetVar} = GooeyCanvas_Create(${x}, ${y}, ${width}, ${height});\n`;
        break;
      case "Image":
        let imagePath = widget.dataset.relativePath || "./assets/example.png";
        widgetCode = `${indent}GooeyImage *${widgetVar} = GooeyImage_Create("${imagePath}", ${x}, ${y}, ${width}, ${height}, ${callbackName || "NULL"});\n`;
        if (callbackName) {
          state.widgetCallbacks[widgetId].image = callbackName;
        }
        break;
      case "DropSurface":
        let message = widget.dataset.dropsurfaceMessage || "Drop files here..";
        widgetCode = `${indent}GooeyDropSurface *${widgetVar} = GooeyDropSurface_Create(${x}, ${y}, ${width}, ${height}, "${message}", ${callbackName || "NULL"});\n`;
        if (callbackName) {
          state.widgetCallbacks[widgetId].dropsurface = callbackName;
        }
        break;
      case "Dropdown":
        let dropdownOptionsList = widget.dataset.dropdownOptions.split(",") || [];
        let dropdownOptionsListLength = dropdownOptionsList.length;
        dropdownOptionsList = dropdownOptionsList.map(option => `"${option}"`);

        widgetCode = `${indent}const char* options_${widgetVar}[${dropdownOptionsListLength}] = {${dropdownOptionsList}};\n`;
        widgetCode += `${indent}GooeyDropdown *${widgetVar} = GooeyDropdown_Create(${x}, ${y}, ${width}, ${height}, options_${widgetVar}, ${dropdownOptionsListLength}, ${callbackName || "NULL"});\n`;
        if (callbackName) {
          state.widgetCallbacks[widgetId].dropdown = callbackName;
        }
        break;
      case "List":
        let listOptionsList = widget.dataset.listOptions ? JSON.parse(widget.dataset.listOptions) : [];

        widgetCode = `${indent}GooeyList *${widgetVar} = GooeyList_Create(${x}, ${y}, ${width}, ${height}, ${callbackName || "NULL"});\n`;

        listOptionsList.forEach((item) => {
          widgetCode += `${indent}GooeyList_AddItem(${widgetVar}, "${item.name}", "${item.description}");\n`;
        });

        if (callbackName) {
          state.widgetCallbacks[widgetId].list = callbackName;
        }
        break;

      case "Menu":
        widgetCode = `${indent}GooeyMenu *${widgetVar} = GooeyMenu_Set(win);\n`;
        break;
      case "VerticalLayout":
      case "HorizontalLayout":
        let layoutType = type === "VerticalLayout" ? "LAYOUT_VERTICAL" : "LAYOUT_HORIZONTAL";
        widgetCode = `${indent}GooeyLayout *${widgetVar} = GooeyLayout_Create(${layoutType}, ${x}, ${y}, ${width}, ${height});\n`;

        Array.from(widget.children).forEach((child) => {
          if (child.classList.contains("widget") && !child.classList.contains("resize-handle")) {
            widgetCode += processWidgetC(child, indent + "    ");
            widgetCode += `${indent}GooeyLayout_AddChild(${widgetVar}, ${widgetVars[widgetVars.length - 1]});\n`;
          }
        });

        widgetCode += `${indent}GooeyLayout_Build(${widgetVar});\n`;
        break;
    }
    if (type !== "Menu")
      widgetRegistrations.push(`${indent}GooeyWindow_RegisterWidget(win, ${widgetVar});\n`);
    return widgetCode;
  }

  state.previewContent.querySelectorAll(".widget").forEach((widget) => {
    if (!widget.parentElement.classList.contains("layout")) {
      cCode += processWidgetC(widget, "    ");
    }
  });

  cCode += `\n`;
  widgetRegistrations.forEach((reg) => {
    cCode += reg;
  });

  cCode += `\n    GooeyWindow_Run(1, win);\n`;

  if (state.projectSettings.platform == "embedded") {
    cCode += `}\nvoid loop(){}`;
  } else {
    cCode += `    GooeyWindow_Cleanup(1, win);\n\n`;
    cCode += `    return 0;\n}\n`;
  }

  state.editor.setValue(cCode);

  try {
    await nativeBridge.runCommand(cCode);
  } catch (e) {
    // error
  }

  const blob = new Blob([cCode], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gui_builder.c";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  document.getElementById("status-text").textContent = "C code exported and downloaded";
  setTimeout(() => {
    document.getElementById("status-text").textContent = "Ready";
  }, 2000);
}