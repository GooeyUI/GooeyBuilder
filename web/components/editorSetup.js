export function setupEditors() {
  const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "text/x-csrc",
    theme: "default",
    innerHeight: "100%",
    outerHeight: "100%",

    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    extraKeys: {
      "Ctrl-Space": "autocomplete",
    },
  });

  const callbackEditor = CodeMirror.fromTextArea(
    document.getElementById("callback-editor"),
    {
      mode: "text/x-csrc",
      theme: "default",
      innerHeight: "100%",
      outerHeight: "100%",

      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      extraKeys: {
        "Ctrl-Space": "autocomplete",
      },
    }
  );
  const uiXmlEditor = CodeMirror.fromTextArea(
    document.getElementById("ui-xml-editor"),
    {
      mode: "text/x-csrc",
      theme: "default",
      innerHeight: "100%",
      outerHeight: "100%",
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      extraKeys: {
        "Ctrl-Space": "autocomplete",
      },
    }
  );


  CodeMirror.registerHelper("hint", "c", (cm) => {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    const keywords = [
      "int",
      "float",
      "char",
      "if",
      "else",
      "while",
      "for",
      "return",
      "printf",
      "scanf",
      "#include",
      "#define",
      "struct",
      "typedef",
    ];
    const list = keywords.filter((word) => word.startsWith(token.string));
    return {
      list: list.length ? list : keywords,
      from: CodeMirror.Pos(cur.line, token.start),
      to: CodeMirror.Pos(cur.line, token.end),
    };
  });

  return { editor, callbackEditor, uiXmlEditor };
}