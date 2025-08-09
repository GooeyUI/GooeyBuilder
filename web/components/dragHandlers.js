import state from "./state.js";
import { selectWidget, updatePropertiesPanel } from "./propertiesPanel.js";
export function setupEditorDrag(codeEditor) {
  let isDraggingEditor = false;
  let editorDragOffsetX = 0;
  let editorDragOffsetY = 0;


  function onEditorDragMove(e) {
    if (!isDraggingEditor) return;
    codeEditor.style.left = e.clientX - editorDragOffsetX + "px";
    codeEditor.style.top = e.clientY - editorDragOffsetY + "px";
  }

  function onEditorDragEnd() {
    isDraggingEditor = false;
    document.removeEventListener("mousemove", onEditorDragMove);
    document.removeEventListener("mouseup", onEditorDragEnd);
  }
}

export function setupPreviewWindowDrag(previewWindow, previewTitleBar) {
  let isDraggingPreview = false;
  let previewDragOffsetX = 0;
  let previewDragOffsetY = 0;

  previewTitleBar.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("window-control")) return;

    isDraggingPreview = true;
    const rect = previewWindow.getBoundingClientRect();
    const workspaceRect = document.getElementById("workspace").getBoundingClientRect();
    previewDragOffsetX = e.clientX - rect.left + workspaceRect.left;
    previewDragOffsetY = e.clientY - rect.top + workspaceRect.top;
    document.addEventListener("mousemove", onPreviewDragMove);
    document.addEventListener("mouseup", onPreviewDragEnd);
  });

  function onPreviewDragMove(e) {
    if (!isDraggingPreview) return;

    const workspace = document.getElementById("workspace");
    const workspaceRect = workspace.getBoundingClientRect();

    let newX = e.clientX - previewDragOffsetX;
    let newY = e.clientY - previewDragOffsetY;

    newX = Math.max(
      0,
      Math.min(newX, workspaceRect.width - previewWindow.offsetWidth)
    );
    newY = Math.max(
      0,
      Math.min(newY, workspaceRect.height - previewWindow.offsetHeight)
    );

    previewWindow.style.left = newX + "px";
    previewWindow.style.top = newY + "px";
    previewWindow.style.right = "auto";
    previewWindow.style.bottom = "auto";
  }

  function onPreviewDragEnd() {
    isDraggingPreview = false;
    document.removeEventListener("mousemove", onPreviewDragMove);
    document.removeEventListener("mouseup", onPreviewDragEnd);
  }
}

export function setupWidgetDrag(element) {
  element.addEventListener("mousedown", function (e) {
    if (e.button !== 0) return;
    if (e.target.classList.contains("resize-handle")) return;

    e.stopPropagation();

    state.draggedWidget = element;
    const rect = element.getBoundingClientRect();
    state.dragOffsetX = e.clientX - rect.left;
    state.dragOffsetY = e.clientY - rect.top;

    selectWidget(element);

    if (element.parentElement.classList.contains("layout")) {
      element.style.position = "absolute";
      element.style.left =
        rect.left - state.previewContent.getBoundingClientRect().left + "px";
      element.style.top =
        rect.top - state.previewContent.getBoundingClientRect().top + "px";
      state.previewContent.appendChild(element);
    }

    document.addEventListener("mousemove", onWidgetDragMove);
    document.addEventListener("mouseup", onWidgetDragEnd);
  });
}

function onWidgetDragMove(e) {
  if (
    !state.draggedWidget ||
    state.draggedWidget.classList.contains("widget-menu")
  )
    return;

  e.preventDefault();

  const previewRect = state.previewContent.getBoundingClientRect();

  let newX = e.clientX - state.dragOffsetX - previewRect.left;
  let newY = e.clientY - state.dragOffsetY - previewRect.top;

  newX = Math.max(
    0,
    Math.min(newX, previewRect.width - state.draggedWidget.offsetWidth)
  );
  newY = Math.max(
    0,
    Math.min(newY, previewRect.height - state.draggedWidget.offsetHeight)
  );

  state.draggedWidget.style.left = newX + "px";
  state.draggedWidget.style.top = newY + "px";

  const layouts = state.previewContent.querySelectorAll(".layout");
  let hoveredLayout = null;

  layouts.forEach((layout) => {
    layout.classList.remove("drop-hover");
    const rect = layout.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      hoveredLayout = layout;
      layout.classList.add("drop-hover");
    }
  });

  updatePropertiesPanel();
}

function onWidgetDragEnd(e) {
  if (!state.draggedWidget) return;

  document.removeEventListener("mousemove", onWidgetDragMove);
  document.removeEventListener("mouseup", onWidgetDragEnd);

  const layouts = state.previewContent.querySelectorAll(".layout");
  let droppedInLayout = null;

  layouts.forEach((layout) => {
    layout.classList.remove("drop-hover");
    const rect = layout.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      droppedInLayout = layout;
    }
  });

  if (droppedInLayout) {
    state.draggedWidget.style.position = "";
    state.draggedWidget.style.left = "";
    state.draggedWidget.style.top = "";
    droppedInLayout.appendChild(state.draggedWidget);

    const placeholder = droppedInLayout.querySelector(".layout-placeholder");
    if (placeholder) {
      droppedInLayout.removeChild(placeholder);
    }
  }

  state.draggedWidget = null;
}