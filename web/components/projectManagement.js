import state from './state.js';
import { updateWidgetList } from './propertiesPanel.js';
import { showEditor } from './uiHelpers.js';
import { createWidget } from './widgetManagement.js';
export function saveProjectToXML() {
  const xmlDoc = document.implementation.createDocument(null, "project");
  const root = xmlDoc.documentElement;

  const windowElement = xmlDoc.createElement("window");
  windowElement.setAttribute("title", state.previewTitleBar.querySelector(".preview-title-text").textContent);
  windowElement.setAttribute("width", state.previewWindow.style.width);
  windowElement.setAttribute("height", state.previewWindow.style.height);
  windowElement.setAttribute("x", state.previewWindow.style.left || "0");
  windowElement.setAttribute("y", state.previewWindow.style.top || "0");
  root.appendChild(windowElement);

  const widgetsElement = xmlDoc.createElement("widgets");
  root.appendChild(widgetsElement);

  function saveWidget(widget, parentElement) {
    const widgetElement = xmlDoc.createElement("widget");
    widgetElement.setAttribute("type", widget.dataset.type);
    widgetElement.setAttribute("id", widget.dataset.id);
    widgetElement.setAttribute("x", widget.style.left || "0");
    widgetElement.setAttribute("y", widget.style.top || "0");
    widgetElement.setAttribute("width", widget.style.width);
    widgetElement.setAttribute("height", widget.style.height);

    if (widget.dataset.type === "Slider") {
      widgetElement.setAttribute("minValue", widget.dataset.minValue || "0");
      widgetElement.setAttribute("maxValue", widget.dataset.maxValue || "100");
      widgetElement.setAttribute("showHints", widget.dataset.showHints || "false");
    } else if (widget.dataset.type === "Image") {
      widgetElement.setAttribute("relativePath", widget.dataset.relativePath || "./assets/example.png");
    } else if (widget.dataset.type === "DropSurface") {
      widgetElement.setAttribute("dropsurfaceMessage", widget.dataset.dropsurfaceMessage || "Drop files here..");
    } else if (widget.dataset.type === "Dropdown") {
      widgetElement.setAttribute("dropdownOptions", widget.dataset.dropdownOptions || "");
    } else if (widget.dataset.type === "List") {
      widgetElement.setAttribute("listOptions", widget.dataset.listOptions || "");
    }

    if (widget.dataset.type !== "Slider" && widget.dataset.type !== "Image" && widget.dataset.type !== "DropSurface") {
      widgetElement.setAttribute("text", widget.textContent || "");
    }

    if (state.widgetCallbacks[widget.dataset.id]) {
      const callbackElement = xmlDoc.createElement("callback");
      callbackElement.setAttribute("name", state.widgetCallbacks[widget.dataset.id].callbackName || "");

      for (const type in state.widgetCallbacks[widget.dataset.id]) {
        if (type.endsWith("_code")) {
          const codeElement = xmlDoc.createElement(type);
          codeElement.textContent = state.widgetCallbacks[widget.dataset.id][type];
          callbackElement.appendChild(codeElement);
        }
      }

      widgetElement.appendChild(callbackElement);
    }

    parentElement.appendChild(widgetElement);

    if (widget.dataset.type === "VerticalLayout" || widget.dataset.type === "HorizontalLayout") {
      const childrenElement = xmlDoc.createElement("children");
      widgetElement.appendChild(childrenElement);

      Array.from(widget.children).forEach((child) => {
        if (child.classList.contains("widget") && !child.classList.contains("resize-handle")) {
          saveWidget(child, childrenElement);
        }
      });
    }
  }

  state.previewContent.querySelectorAll(".widget").forEach((widget) => {
    if (!widget.parentElement.classList.contains("layout")) {
      saveWidget(widget, widgetsElement);
    }
  });

  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(xmlDoc);

  const blob = new Blob([xmlString], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "project.xml";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  document.getElementById("status-text").textContent = "Project saved to XML";
  setTimeout(() => {
    document.getElementById("status-text").textContent = "Ready";
  }, 2000);
}

export function loadProjectFromXML() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".xml";

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(event.target.result, "application/xml");

        // Clear existing widgets
        state.previewContent.innerHTML = "";
        state.widgetCallbacks = {};

        // Load window settings
        const windowElement = xmlDoc.querySelector("window");
        if (windowElement) {
          state.previewTitleBar.querySelector(".preview-title-text").textContent = windowElement.getAttribute("title") || "My Window";
          state.previewWindow.style.width = windowElement.getAttribute("width") || "800px";
          state.previewWindow.style.height = windowElement.getAttribute("height") || "600px";
          state.previewWindow.style.left = windowElement.getAttribute("x") || "0px";
          state.previewWindow.style.top = windowElement.getAttribute("y") || "0px";

          document.getElementById("win-title").value = windowElement.getAttribute("title") || "My Window";
          document.getElementById("win-width").value = parseInt(windowElement.getAttribute("width") || "800");
          document.getElementById("win-height").value = parseInt(windowElement.getAttribute("height") || "600");
        }

        // Load widgets
        const widgetsElement = xmlDoc.querySelector("widgets");
        if (widgetsElement) {
          function loadWidget(widgetElement, parent = null) {
            const type = widgetElement.getAttribute("type");
            const x = parseInt(widgetElement.getAttribute("x") || "0");
            const y = parseInt(widgetElement.getAttribute("y") || "0");
            const width = widgetElement.getAttribute("width") || "100px";
            const height = widgetElement.getAttribute("height") || "30px";

            const widget = createWidget(type, x, y, parent);

            widget.style.width = width;
            widget.style.height = height;

            if (type === "Slider") {
              widget.dataset.minValue = widgetElement.getAttribute("minValue") || "0";
              widget.dataset.maxValue = widgetElement.getAttribute("maxValue") || "100";
              widget.dataset.showHints = widgetElement.getAttribute("showHints") || "false";
            } else if (type === "Image") {
              widget.dataset.relativePath = widgetElement.getAttribute("relativePath") || "./assets/example.png";
            } else if (type === "DropSurface") {
              widget.dataset.dropsurfaceMessage = widgetElement.getAttribute("dropsurfaceMessage") || "Drop files here..";
            } else if (type === "Dropdown") {
              widget.dataset.dropdownOptions = widgetElement.getAttribute("dropdownOptions") || "";
            } else if (type === "List") {
              widget.dataset.listOptions = widgetElement.getAttribute("listOptions") || "[]";
            }

            if (type !== "Slider" && type !== "Image" && type !== "DropSurface") {
              widget.textContent = widgetElement.getAttribute("text") || "";
            }

            const callbackElement = widgetElement.querySelector("callback");
            if (callbackElement) {
              const callbackName = callbackElement.getAttribute("name") || "";
              state.widgetCallbacks[widget.dataset.id].callbackName = callbackName;

              for (const codeElement of callbackElement.children) {
                const type = codeElement.tagName;
                state.widgetCallbacks[widget.dataset.id][type] = codeElement.textContent;
              }
            }

            if (type === "VerticalLayout" || type === "HorizontalLayout") {
              const childrenElement = widgetElement.querySelector("children");
              if (childrenElement) {
                childrenElement.querySelectorAll("widget").forEach((childElement) => {
                  loadWidget(childElement, widget);
                });
              }
            }

            return widget;
          }

          widgetsElement.querySelectorAll("widget").forEach((widgetElement) => {
            loadWidget(widgetElement);
          });
        }

        updateWidgetList();
        document.getElementById("status-text").textContent = "Project loaded from XML";
        showEditor();

        setTimeout(() => {
          document.getElementById("status-text").textContent = "Ready";
        }, 2000);
      } catch (error) {
        console.error("Error loading XML:", error);
        document.getElementById("status-text").textContent = "Error loading project";
        setTimeout(() => {
          document.getElementById("status-text").textContent = "Ready";
        }, 2000);
      }
    };
    reader.readAsText(file);
  };

  input.click();
}