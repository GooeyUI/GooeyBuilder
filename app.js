// Shared state object
const state = {
    previewContent: null,
    previewWindow: null,
    previewTitleBar: null,
    selectedWidget: null,
    draggedWidget: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    resizingWidget: null,
    resizeStartWidth: 0,
    resizeStartHeight: 0,
    resizeStartX: 0,
    resizeStartY: 0,
    widgetCallbacks: {},
    currentEditingWidget: null
};

// Initialize CodeMirror editors
const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "text/x-csrc",
    lineNumbers: true,
    theme: "default",
    extraKeys: {
        "Ctrl-Space": "autocomplete"
    }
});

const callbackEditor = CodeMirror.fromTextArea(document.getElementById("callback-editor"), {
    mode: "text/x-csrc",
    lineNumbers: true,
    theme: "default",
    extraKeys: {
        "Ctrl-Space": "autocomplete"
    }
});

CodeMirror.registerHelper("hint", "c", (cm) => {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    const keywords = [
        "int", "float", "char", "if", "else", "while", "for", "return",
        "printf", "scanf", "#include", "#define", "struct", "typedef"
    ];
    const list = keywords.filter((word) => word.startsWith(token.string));
    return {
        list: list.length ? list : keywords,
        from: CodeMirror.Pos(cur.line, token.start),
        to: CodeMirror.Pos(cur.line, token.end)
    };
});

// Code editor drag functionality
const codeEditor = document.getElementById("code-editor");
const codeEditorHeader = codeEditor.querySelector(".code-editor-header");
let isDraggingEditor = false;
let editorDragOffsetX = 0;
let editorDragOffsetY = 0;

codeEditorHeader.addEventListener('mousedown', (e) => {
    if (e.target === codeEditorHeader.querySelector('div:last-child')) return;

    isDraggingEditor = true;
    editorDragOffsetX = e.clientX - codeEditor.getBoundingClientRect().left;
    editorDragOffsetY = e.clientY - codeEditor.getBoundingClientRect().top;
    document.addEventListener('mousemove', onEditorDragMove);
    document.addEventListener('mouseup', onEditorDragEnd);
});

function onEditorDragMove(e) {
    if (!isDraggingEditor) return;
    codeEditor.style.left = (e.clientX - editorDragOffsetX) + 'px';
    codeEditor.style.top = (e.clientY - editorDragOffsetY) + 'px';
}

function onEditorDragEnd() {
    isDraggingEditor = false;
    document.removeEventListener('mousemove', onEditorDragMove);
    document.removeEventListener('mouseup', onEditorDragEnd);
}

// Create preview window
state.previewWindow = document.createElement('div');
state.previewWindow.className = 'preview-window';
state.previewWindow.style.width = '800px';
state.previewWindow.style.height = '600px';

state.previewTitleBar = document.createElement('div');
state.previewTitleBar.className = 'preview-title-bar';
state.previewTitleBar.innerHTML = `
    <div class="preview-title-text">My Window</div>
    <div class="window-controls">
        <div class="window-control">—</div>
        <div class="window-control">□</div>
        <div class="window-control close">×</div>
    </div>
`;

state.previewContent = document.createElement('div');
state.previewContent.className = 'preview-content';
state.previewContent.id = 'preview-content';

state.previewWindow.appendChild(state.previewTitleBar);
state.previewWindow.appendChild(state.previewContent);
document.getElementById('designer-tab').appendChild(state.previewWindow);

// Preview window drag functionality
let isDraggingPreview = false;
let previewDragOffsetX = 0;
let previewDragOffsetY = 0;

state.previewTitleBar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('window-control')) return;

    isDraggingPreview = true;
    const rect = state.previewWindow.getBoundingClientRect();
    const workspaceRect = document.getElementById('workspace').getBoundingClientRect();
    previewDragOffsetX = e.clientX - rect.left + workspaceRect.left;
    previewDragOffsetY = e.clientY - rect.top + workspaceRect.top;
    document.addEventListener('mousemove', onPreviewDragMove);
    document.addEventListener('mouseup', onPreviewDragEnd);
});

function onPreviewDragMove(e) {
    if (!isDraggingPreview) return;

    const workspace = document.getElementById('workspace');
    const workspaceRect = workspace.getBoundingClientRect();

    let newX = e.clientX - previewDragOffsetX;
    let newY = e.clientY - previewDragOffsetY;

    newX = Math.max(0, Math.min(newX, workspaceRect.width - state.previewWindow.offsetWidth));
    newY = Math.max(0, Math.min(newY, workspaceRect.height - state.previewWindow.offsetHeight));

    state.previewWindow.style.left = newX + 'px';
    state.previewWindow.style.top = newY + 'px';
    state.previewWindow.style.right = 'auto';
    state.previewWindow.style.bottom = 'auto';
}

function onPreviewDragEnd() {
    isDraggingPreview = false;
    document.removeEventListener('mousemove', onPreviewDragMove);
    document.removeEventListener('mouseup', onPreviewDragEnd);
}

// Widget creation and management
document.querySelectorAll('.toolbox-item').forEach(item => {
    item.addEventListener('click', function () {
        createWidget(this.dataset.type, 10, 10);
    });
});

function createWidget(type, x, y, parent = null) {
    let newWidget = document.createElement('div');
    newWidget.className = 'widget';
    newWidget.dataset.type = type;
    newWidget.dataset.id = 'widget_' + Date.now();

    switch (type) {
        case 'Button':
            newWidget.className += ' widget-button';
            newWidget.textContent = 'Button';
            newWidget.style.width = '100px';
            newWidget.style.height = '30px';
            break;
        case 'Input':
            newWidget.className += ' widget-input';
            newWidget.textContent = '';
            newWidget.style.width = '150px';
            newWidget.style.height = '24px';
            break;
        case 'Slider':
            newWidget.className += ' widget-slider';
            newWidget.style.width = '150px';
            newWidget.style.height = '24px';
            break;
        case 'Checkbox':
            newWidget.className += ' widget-checkbox';
            newWidget.style.width = '16px';
            newWidget.style.height = '16px';
            newWidget.addEventListener('click', function (e) {
                e.stopPropagation();
                this.classList.toggle('checked');
            });
            break;
        case 'Label':
            newWidget.className += ' widget-label';
            newWidget.textContent = 'Label';
            newWidget.style.width = '100px';
            newWidget.style.height = '20px';
            break;
        case 'Canvas':
            newWidget.className += ' widget-canvas';
            newWidget.textContent = 'Canvas';
            newWidget.style.width = '200px';
            newWidget.style.height = '150px';
            break;
        case 'Image':
            newWidget.className += ' widget-image';
            newWidget.textContent = 'Image';
            newWidget.style.width = '150px';
            newWidget.style.height = '150px';
            break;
        case 'DropSurface':
            newWidget.className += ' widget-dropsurface';
            newWidget.textContent = 'Drop files here..';
            newWidget.style.width = '200px';
            newWidget.style.height = '150px';
            break;
        case 'VerticalLayout':
            newWidget.className += ' layout vertical';
            newWidget.style.width = '200px';
            newWidget.style.height = '200px';
            const placeholderV = document.createElement('div');
            placeholderV.className = 'layout-placeholder';
            placeholderV.textContent = 'Drop widgets here';
            newWidget.appendChild(placeholderV);
            break;
        case 'HorizontalLayout':
            newWidget.className += ' layout horizontal';
            newWidget.style.width = '300px';
            newWidget.style.height = '100px';
            const placeholderH = document.createElement('div');
            placeholderH.className = 'layout-placeholder';
            placeholderH.textContent = 'Drop widgets here';
            newWidget.appendChild(placeholderH);
            break;
    }

    newWidget.style.left = x + 'px';
    newWidget.style.top = y + 'px';

    if (parent) {
        parent.appendChild(newWidget);
        const placeholder = parent.querySelector('.layout-placeholder');
        if (placeholder) {
            parent.removeChild(placeholder);
        }
    } else {
        state.previewContent.appendChild(newWidget);
    }

    if (type === 'VerticalLayout' || type === 'HorizontalLayout') {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        newWidget.appendChild(resizeHandle);
        setupResizeHandle(resizeHandle, newWidget);
    }

    setupWidgetDrag(newWidget);
    setupWidgetSelection(newWidget);
    selectWidget(newWidget);

    state.widgetCallbacks[newWidget.dataset.id] = {
        callbackName: '',
        button: '',
        slider: '',
        checkbox: '',
        input: ''
    };

    updateWidgetList();

    return newWidget;
}

function setupResizeHandle(handle, widget) {
    handle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        state.resizingWidget = widget;
        state.resizeStartWidth = widget.offsetWidth;
        state.resizeStartHeight = widget.offsetHeight;
        state.resizeStartX = e.clientX;
        state.resizeStartY = e.clientY;

        document.addEventListener('mousemove', onResizeMove);
        document.addEventListener('mouseup', onResizeEnd);
    });
}

function onResizeMove(e) {
    if (!state.resizingWidget) return;

    const width = state.resizeStartWidth + (e.clientX - state.resizeStartX);
    const height = state.resizeStartHeight + (e.clientY - state.resizeStartY);

    state.resizingWidget.style.width = Math.max(50, width) + 'px';
    state.resizingWidget.style.height = Math.max(50, height) + 'px';

    updatePropertiesPanel();
}

function onResizeEnd() {
    state.resizingWidget = null;
    document.removeEventListener('mousemove', onResizeMove);
    document.removeEventListener('mouseup', onResizeEnd);
}

function setupWidgetDrag(element) {
    element.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        if (e.target.classList.contains('resize-handle')) return;

        e.stopPropagation();

        state.draggedWidget = element;
        const rect = element.getBoundingClientRect();
        state.dragOffsetX = e.clientX - rect.left;
        state.dragOffsetY = e.clientY - rect.top;

        selectWidget(element);

        if (element.parentElement.classList.contains('layout')) {
            element.style.position = 'absolute';
            element.style.left = rect.left - state.previewContent.getBoundingClientRect().left + 'px';
            element.style.top = rect.top - state.previewContent.getBoundingClientRect().top + 'px';
            state.previewContent.appendChild(element);
        }

        document.addEventListener('mousemove', onWidgetDragMove);
        document.addEventListener('mouseup', onWidgetDragEnd);
    });
}

function onWidgetDragMove(e) {
    if (!state.draggedWidget) return;

    e.preventDefault();

    const previewRect = state.previewContent.getBoundingClientRect();

    let newX = e.clientX - state.dragOffsetX - previewRect.left;
    let newY = e.clientY - state.dragOffsetY - previewRect.top;

    newX = Math.max(0, Math.min(newX, previewRect.width - state.draggedWidget.offsetWidth));
    newY = Math.max(0, Math.min(newY, previewRect.height - state.draggedWidget.offsetHeight));

    state.draggedWidget.style.left = newX + 'px';
    state.draggedWidget.style.top = newY + 'px';

    const layouts = state.previewContent.querySelectorAll('.layout');
    let hoveredLayout = null;

    layouts.forEach(layout => {
        layout.classList.remove('drop-hover');
        const rect = layout.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
            hoveredLayout = layout;
            layout.classList.add('drop-hover');
        }
    });

    updatePropertiesPanel();
}

function onWidgetDragEnd(e) {
    if (!state.draggedWidget) return;

    document.removeEventListener('mousemove', onWidgetDragMove);
    document.removeEventListener('mouseup', onWidgetDragEnd);

    const layouts = state.previewContent.querySelectorAll('.layout');
    let droppedInLayout = null;

    layouts.forEach(layout => {
        layout.classList.remove('drop-hover');
        const rect = layout.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
            droppedInLayout = layout;
        }
    });

    if (droppedInLayout) {
        state.draggedWidget.style.position = '';
        state.draggedWidget.style.left = '';
        state.draggedWidget.style.top = '';
        droppedInLayout.appendChild(state.draggedWidget);

        const placeholder = droppedInLayout.querySelector('.layout-placeholder');
        if (placeholder) {
            droppedInLayout.removeChild(placeholder);
        }
    }

    state.draggedWidget = null;
}

function setupWidgetSelection(element) {
    element.addEventListener('click', function (e) {
        if (e.target.classList.contains('resize-handle')) return;
        e.stopPropagation();
        selectWidget(element);
    });
}

function selectWidget(widget) {
    if (state.selectedWidget) {
        state.selectedWidget.classList.remove('selected');
    }

    state.selectedWidget = widget;
    widget.classList.add('selected');

    document.getElementById('widget-properties').style.display = 'block';
    document.getElementById('slider-properties').style.display = 'none';
    document.getElementById('image-properties').style.display = 'none';
    document.getElementById('dropsurface-properties').style.display = 'none';

    if (widget.dataset.type === 'Slider') {
        document.getElementById('slider-properties').style.display = 'block';
    } else if (widget.dataset.type === 'Image') {
        document.getElementById('image-properties').style.display = 'block';
    } else if (widget.dataset.type === 'DropSurface') {
        document.getElementById('dropsurface-properties').style.display = 'block';
    }

    updatePropertiesPanel();

    document.getElementById('status-text').textContent = `Selected: ${widget.dataset.type}`;
}

// Properties panel functions
function updatePropertiesPanel() {
    if (!state.selectedWidget) return;

    const rect = state.selectedWidget.getBoundingClientRect();
    const previewRect = state.previewContent.getBoundingClientRect();

    document.getElementById('prop-type').value = state.selectedWidget.dataset.type;
    document.getElementById('prop-x').value = parseInt(state.selectedWidget.style.left) || 0;
    document.getElementById('prop-y').value = parseInt(state.selectedWidget.style.top) || 0;
    document.getElementById('prop-width').value = parseInt(state.selectedWidget.style.width) || rect.width;
    document.getElementById('prop-height').value = parseInt(state.selectedWidget.style.height) || rect.height;

    if (state.selectedWidget.dataset.type !== 'Slider' && state.selectedWidget.dataset.type !== 'Image' && state.selectedWidget.dataset.type !== 'DropSurface') {
        document.getElementById('prop-text').value = state.selectedWidget.textContent || '';
        document.getElementById('prop-text').disabled = false;
    } else {
        document.getElementById('prop-text').disabled = true;
    }

    const widgetId = state.selectedWidget.dataset.id;
    if (state.widgetCallbacks[widgetId]) {
        document.getElementById('prop-callback').value = state.widgetCallbacks[widgetId].callbackName || '';
    }

    if (state.selectedWidget.dataset.type === 'Slider') {
        document.getElementById('slider-min-value').value = state.selectedWidget.dataset.minValue || 0;
        document.getElementById('slider-max-value').value = state.selectedWidget.dataset.maxValue || 100;
        document.getElementById('slider-show-hints').value = state.selectedWidget.dataset.showHints || 'false';
    }

    if (state.selectedWidget.dataset.type === 'Image') {
        document.getElementById('image-relative-path').value = state.selectedWidget.dataset.relativePath || './assets/example.png';
    }

    if (state.selectedWidget.dataset.type === 'DropSurface') {
        document.getElementById('dropsurface-message').value = state.selectedWidget.dataset.dropsurfaceMessage || 'Drop files here..';
    }
}

function applyWidgetProperties() {
    if (!state.selectedWidget) return;

    state.selectedWidget.style.left = document.getElementById('prop-x').value + 'px';
    state.selectedWidget.style.top = document.getElementById('prop-y').value + 'px';
    state.selectedWidget.style.width = document.getElementById('prop-width').value + 'px';
    state.selectedWidget.style.height = document.getElementById('prop-height').value + 'px';

    if (state.selectedWidget.dataset.type !== 'Slider' && state.selectedWidget.dataset.type !== 'Image' && state.selectedWidget.dataset.type !== 'DropSurface') {
        state.selectedWidget.textContent = document.getElementById('prop-text').value;
    }

    const widgetId = state.selectedWidget.dataset.id;
    if (state.widgetCallbacks[widgetId]) {
        state.widgetCallbacks[widgetId].callbackName = document.getElementById('prop-callback').value;
    }

    if (state.selectedWidget.dataset.type === 'Slider') {
        state.selectedWidget.dataset.minValue = document.getElementById('slider-min-value').value;
        state.selectedWidget.dataset.maxValue = document.getElementById('slider-max-value').value;
        state.selectedWidget.dataset.showHints = document.getElementById('slider-show-hints').value;
    }

    if (state.selectedWidget.dataset.type === 'Image') {
        state.selectedWidget.dataset.relativePath = document.getElementById('image-relative-path').value;
        state.selectedWidget.textContent = state.selectedWidget.dataset.relativePath.split('/').pop();
    }

    if (state.selectedWidget.dataset.type === 'DropSurface') {
        state.selectedWidget.dataset.dropsurfaceMessage = document.getElementById('dropsurface-message').value;
        state.selectedWidget.textContent = state.selectedWidget.dataset.dropsurfaceMessage;
    }

    document.getElementById('status-text').textContent = 'Properties updated';
    setTimeout(() => {
        document.getElementById('status-text').textContent = 'Ready';
    }, 2000);

    updateWidgetList();
}

function deleteSelectedWidget() {
    if (state.selectedWidget) {
        const widgetId = state.selectedWidget.dataset.id;

        if (state.widgetCallbacks[widgetId]) {
            delete state.widgetCallbacks[widgetId];
        }

        if (state.selectedWidget.classList.contains('layout')) {
            const children = Array.from(state.selectedWidget.children);
            children.forEach(child => {
                if (child.classList.contains('widget') && !child.classList.contains('resize-handle')) {
                    const rect = child.getBoundingClientRect();
                    const previewRect = state.previewContent.getBoundingClientRect();
                    child.style.left = (rect.left - previewRect.left) + 'px';
                    child.style.top = (rect.top - previewRect.top) + 'px';
                    state.previewContent.appendChild(child);
                }
            });
        }

        state.selectedWidget.remove();
        state.selectedWidget = null;
        document.getElementById('widget-properties').style.display = 'none';
        document.getElementById('status-text').textContent = 'Widget deleted';
        setTimeout(() => {
            document.getElementById('status-text').textContent = 'Ready';
        }, 2000);

        updateWidgetList();
    }
}

function applyWindowSettings() {
    const title = document.getElementById('win-title').value;
    const width = document.getElementById('win-width').value;
    const height = document.getElementById('win-height').value;

    state.previewTitleBar.querySelector('.preview-title-text').textContent = title;
    state.previewWindow.style.width = width + 'px';
    state.previewWindow.style.height = height + 'px';

    document.getElementById('status-text').textContent = 'Window settings updated';
    setTimeout(() => {
        document.getElementById('status-text').textContent = 'Ready';
    }, 2000);
}

// Callback editor functions
function updateWidgetList() {
    const widgetList = document.getElementById('widget-list');
    widgetList.innerHTML = '';

    state.previewContent.querySelectorAll('.widget').forEach(widget => {
        if (!widget.parentElement.classList.contains('layout')) {
            const widgetId = widget.dataset.id;
            const widgetType = widget.dataset.type;
            const widgetText = widget.textContent || widgetType;
            const callbackName = state.widgetCallbacks[widgetId]?.callbackName || '';

            const listItem = document.createElement('div');
            listItem.className = 'widget-list-item';
            listItem.dataset.widgetId = widgetId;
            listItem.innerHTML = `
                <div><strong>${widgetType}</strong></div>
                <div>${widgetText.substring(0, 20)}${widgetText.length > 20 ? '...' : ''}</div>
                ${callbackName ? `<div style="color: var(--vs-accent);">${callbackName}</div>` : ''}
            `;

            listItem.addEventListener('click', function () {
                document.querySelectorAll('.widget-list-item').forEach(item => {
                    item.classList.remove('selected');
                });
                this.classList.add('selected');
                state.currentEditingWidget = widgetId;
                updateCallbackSelector(widgetId);
            });

            widgetList.appendChild(listItem);
        }
    });
}

function updateCallbackSelector(widgetId) {
    const selector = document.getElementById('callback-selector');
    selector.innerHTML = '<option value="">Select a callback to edit</option>';

    if (!widgetId) return;

    const widget = document.querySelector(`.widget[data-id="${widgetId}"]`);
    if (!widget) return;

    const widgetType = widget.dataset.type;
    const callbacks = state.widgetCallbacks[widgetId] || {};

    switch (widgetType) {
        case 'Button':
            selector.innerHTML += `<option value="button" ${callbacks.button ? 'selected' : ''}>Button Click</option>`;
            break;
        case 'Slider':
            selector.innerHTML += `<option value="slider" ${callbacks.slider ? 'selected' : ''}>Slider Value Changed</option>`;
            break;
        case 'Checkbox':
            selector.innerHTML += `<option value="checkbox" ${callbacks.checkbox ? 'selected' : ''}>Checkbox Toggled</option>`;
            break;
        case 'Input':
            selector.innerHTML += `<option value="input" ${callbacks.input ? 'selected' : ''}>Input Changed</option>`;
            break;
        default:
            selector.innerHTML += '<option value="">No callbacks available for this widget type</option>';
    }

    selector.addEventListener('change', function () {
        const callbackType = this.value;
        if (!callbackType) {
            callbackEditor.setValue('');
            return;
        }

        const callbackName = state.widgetCallbacks[widgetId]?.callbackName || '';
        if (callbackName) {
            let callbackSignature = '';
            let callbackBody = '';

            if (state.widgetCallbacks[widgetId][`${callbackType}_code`]) {
                callbackBody = state.widgetCallbacks[widgetId][`${callbackType}_code`];
            } else {
                // Default callback implementation
                switch (callbackType) {
                    case 'button':
                        callbackSignature = `void ${callbackName}() {\n    // Your code here\n}`;
                        break;
                    case 'slider':
                        callbackSignature = `void ${callbackName}(int value) {\n    // Your code here\n    // value contains the current slider position\n}`;
                        break;
                    case 'checkbox':
                        callbackSignature = `void ${callbackName}(bool checked) {\n    // Your code here\n    // checked is true if checkbox is checked\n}`;
                        break;
                    case 'input':
                        callbackSignature = `void ${callbackName}(const char* text) {\n    // Your code here\n    // text contains the current input text\n}`;
                        break;
                }
                callbackBody = callbackSignature;
            }
            callbackEditor.setValue(callbackBody);

            if (!state.widgetCallbacks[widgetId]) {
                state.widgetCallbacks[widgetId] = {};
            }
            state.widgetCallbacks[widgetId][callbackType] = callbackName;
        } else {
            callbackEditor.setValue('');
        }
    });

    document.getElementById('save-callback').addEventListener('click', function () {
        if (!state.currentEditingWidget) return;

        const selector = document.getElementById('callback-selector');
        const callbackType = selector.value;
        if (!callbackType) return;

        const code = callbackEditor.getValue();
        if (!state.widgetCallbacks[state.currentEditingWidget]) {
            state.widgetCallbacks[state.currentEditingWidget] = {};
        }

        // Save the code for this specific callback type
        state.widgetCallbacks[state.currentEditingWidget][`${callbackType}_code`] = code;

        document.getElementById('status-text').textContent = 'Callback saved';
        setTimeout(() => {
            document.getElementById('status-text').textContent = 'Ready';
        }, 2000);
    });

    document.getElementById('cancel-callback').addEventListener('click', function () {
        selector.dispatchEvent(new Event('change'));
    });

    selector.dispatchEvent(new Event('change'));
}

// Code generation
function generateC() {
    let cCode = `#include <Gooey/gooey.h>\n\n`;

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
    });

    cCode += `int main()\n{\n`;
    cCode += `    Gooey_Init();\n`;
    cCode += `    GooeyWindow *win = GooeyWindow_Create("${document.getElementById("win-title").value}", ${document.getElementById("win-width").value}, ${document.getElementById("win-height").value}, true);\n\n`;

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
        let callbackName = state.widgetCallbacks[widgetId]?.callbackName || '';

        let widgetVar = `${type.toLowerCase()}_${widgetCount++}`;
        widgetVars.push(widgetVar);

        let widgetCode = "";

        switch (type) {
            case "Button":
                widgetCode = `${indent}GooeyButton *${widgetVar} = GooeyButton_Create("${text}", ${x}, ${y}, ${width}, ${height}, ${callbackName || 'NULL'});\n`;
                if (callbackName) {
                    state.widgetCallbacks[widgetId].button = callbackName;
                }
                break;
            case "Input":
                widgetCode = `${indent}GooeyTextbox *${widgetVar} = GooeyTextBox_Create(${x}, ${y}, ${width}, ${height}, "${text}", ${callbackName || 'NULL'});\n`;
                if (callbackName) {
                    state.widgetCallbacks[widgetId].input = callbackName;
                }
                break;
            case "Slider":
                let minValue = widget.dataset.minValue || 0;
                let maxValue = widget.dataset.maxValue || 100;
                let showHints = widget.dataset.showHints || "false";
                widgetCode = `${indent}GooeySlider *${widgetVar} = GooeySlider_Create(${x}, ${y}, ${width}, ${minValue}, ${maxValue}, ${showHints}, ${callbackName || 'NULL'});\n`;
                if (callbackName) {
                    state.widgetCallbacks[widgetId].slider = callbackName;
                }
                break;
            case "Checkbox":
                widgetCode = `${indent}GooeyCheckbox *${widgetVar} = GooeyCheckbox_Create(${x}, ${y}, "${text}", ${callbackName || 'NULL'});\n`;
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
                widgetCode = `${indent}GooeyImage *${widgetVar} = GooeyImage_Create("${imagePath}", ${x}, ${y}, ${width}, ${height}, NULL);\n`;
                break;
            case "DropSurface":
                let message = widget.dataset.dropsurfaceMessage || "Drop files here..";
                widgetCode = `${indent}GooeyDropSurface *${widgetVar} = GooeyDropSurface_Create(${x}, ${y}, ${width}, ${height}, "${message}", NULL);\n`;
                break;
            case "VerticalLayout":
            case "HorizontalLayout":
                let layoutType = type === "VerticalLayout" ? "LAYOUT_VERTICAL" : "LAYOUT_HORIZONTAL";
                widgetCode = `${indent}GooeyLayout *${widgetVar} = GooeyLayout_Create(${layoutType}, ${x}, ${y}, ${width}, ${height});\n`;

                Array.from(widget.children).forEach(child => {
                    if (child.classList.contains('widget') && !child.classList.contains('resize-handle')) {
                        widgetCode += processWidgetC(child, indent + "    ");
                        widgetCode += `${indent}GooeyLayout_AddChild(${widgetVar}, ${widgetVars[widgetVars.length - 1]});\n`;
                    }
                });

                widgetCode += `${indent}GooeyLayout_Build(${widgetVar});\n`;
                break;
        }

        widgetRegistrations.push(`${indent}GooeyWindow_RegisterWidget(win, ${widgetVar});\n`);
        return widgetCode;
    }

    state.previewContent.querySelectorAll('.widget').forEach(widget => {
        if (!widget.parentElement.classList.contains('layout')) {
            cCode += processWidgetC(widget, "    ");
        }
    });

    cCode += `\n`;
    widgetRegistrations.forEach(reg => {
        cCode += reg;
    });

    cCode += `\n    GooeyWindow_Run(1, win);\n`;
    cCode += `    GooeyWindow_Cleanup(1, win);\n\n`;
    cCode += `    return 0;\n}\n`;

    editor.setValue(cCode);

    const blob = new Blob([cCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gui_builder.c';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    document.getElementById('status-text').textContent = 'C code exported and downloaded';
    setTimeout(() => {
        document.getElementById('status-text').textContent = 'Ready';
    }, 2000);
}

// Event listeners
document.getElementById('export-button').addEventListener('click', generateC);
document.getElementById('run-button').addEventListener('click', function () {
    document.getElementById('code-editor').style.display = 'flex';
});
document.getElementById('close-code-editor').addEventListener('click', function() {
    document.getElementById('code-editor').style.display = 'none';
});
document.getElementById('apply-window-settings').addEventListener('click', applyWindowSettings);
document.getElementById('apply-widget-properties').addEventListener('click', applyWidgetProperties);
document.getElementById('delete-widget').addEventListener('click', deleteSelectedWidget);

// Tab switching
document.querySelectorAll('.document-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        const tabName = this.dataset.tab;

        document.querySelectorAll('.document-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        document.getElementById(`${tabName}-tab`).classList.add('active');

        if (tabName === 'code') {
            updateWidgetList();
        }
    });
});

// Handle delete key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Delete') {
        deleteSelectedWidget();
    }
});

// Click on empty space to deselect
state.previewContent.addEventListener('click', function (e) {
    if (e.target === this) {
        if (state.selectedWidget) {
            state.selectedWidget.classList.remove('selected');
            state.selectedWidget = null;
        }
        document.getElementById('widget-properties').style.display = 'none';
    }
});

// Initialize status bar
document.getElementById('status-text').textContent = 'Ready';