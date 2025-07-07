const state = {
    editor: null,
    callbackEditor:null,
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
    currentEditingWidget: null,
    isDropdownInit: false,
    isListInit: false,
    selectedPlatform: null,
    projectSettings: {
        platform: null,
        language: 'c', // default to C
        frameworkVersion: '1.0.1'
    }
};

export default state;