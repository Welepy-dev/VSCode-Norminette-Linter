const regex = require("./regex/struct.js");

const vscode = require("vscode");

function activate(context) {
  // Create a decoration type for inline messages
  const inlineDecorationType = vscode.window.createTextEditorDecorationType({
    after: {
      margin: "0 0 0 1em",
      color: "yellow",
      fontStyle: "italic",
    },
  });

  // Diagnostics collection for errors
  const diagnosticsCollection =
    vscode.languages.createDiagnosticCollection("customDiagnostics");

  // Function to update decorations and diagnostics dynamically
  function updateDecorations(editor) {
    if (!editor) return;

    const document = editor.document;
    const decorations = [];
    const diagnostics = [];

    // Regugrylar expressions
    
    
      
      /*                                        structs                                         */

      const structTabRegex = /\bstruct\b(?!\ )/gm;

      const structPrefixRegex = /\bstruct\b.(?!s_)/gm;
      
      const structNameTabRegex = /\bs_\w+\b[^\t\n]/gm;
		  
      //Name will be all lowercase
      /*                                        structs                                         */

      /*                                        typefef                                         */
      
      const typedefTabRegex = /\btypedef\b(?!\ )/gm;

      const typedefFollowingRegex = /\btypedef\b.(?!enum|struct|union|int|char|float|double|unsigned|long)/gm;
      
      /*                                        typefef                                         */

      /*                                    genralDataTypes                                     */

      const lowercaseVariablesRegex = /(struct|typedef|union|enum|int|char|float|double|unsigned|long)\s\b(?![a-z_]+\b)\w+\b/gm;

      /*                                    genralDataTypes                                     */

      /*                                          general                                        */

      const EOLRegex = /[ \t]+$/gm;

      /*                                          general                                        */
      


    // const structFollowingUpperCase = /\bs_(?=[A-Z]+)\b/gm; // Match "s_" followed by lowercase letters
    // const identifierRegex = /(int|char|struct|union|enum|static|bool|float|double|void)[\s]*\*[^a-z]+/gm;
    //(?<!\s)(int|char|struct|union|enum|static|bool|float|double|void)(?=\b)

    for (let line = 0; line < document.lineCount; line++) {
      const lineText = document.lineAt(line).text;
      /*                                        structs                                         */

      let structTabMatch = structTabRegex.test(lineText);
      let structPrefixMatch = structPrefixRegex.test(lineText);
      let structNameTabMatch = structNameTabRegex.test(lineText);

      /*                                        structs                                         */
      let typedefTabMatch = typedefTabRegex.test(lineText);
      let typedefFollowing = typedefFollowingRegex.test(lineText);
      let lowercaseVariablesMatch = lowercaseVariablesRegex.test(lineText);
      //     let identifierMatch = identifierRegex.test(lineText);

      /*                                        general                                         */
      
      let EOLMatch = EOLRegex.test(lineText);
      
      /*                                        general                                         */
      const charCount = lineText.length;
      const range = new vscode.Range(
        new vscode.Position(line, charCount),
        new vscode.Position(line, charCount)
      );

      // Errors to display
      const errors = [];
      /*                                        structs                                         */
      if (structTabMatch) errors.push('"struct" must be followed by a space.');
      if (structPrefixMatch) errors.push('"struct" name must start "s_".');
      if (structNameTabMatch) errors.push('"struct" name must be followed by a tab.');
      /*                                        structs                                         */
      
      /*                                        general                                         */
      
      if (EOLMatch) errors.push('Line should not end with a space or tab.');

      /*                                        general                                         */

      if (typedefTabMatch) errors.push('"typedef" must be followed by a space.');
      if (typedefFollowing)
        errors.push('"typedef" must be followed by a valid type.');
      if (lowercaseVariablesMatch)
        errors.push(
          "Variables and function names should be all lowercase letter."
        );
      //     if (identifierMatch) errors.push('Identifier should be all lowercase letter.');

      // Add diagnostics if there are errors
      if (errors.length > 0) {
        const diagnosticRange = new vscode.Range(
          new vscode.Position(line, 0),
          new vscode.Position(line, charCount)
        );
        const diagnosticMessage = errors.join("\n");
        diagnostics.push(
          new vscode.Diagnostic(
            diagnosticRange,
            diagnosticMessage,
            vscode.DiagnosticSeverity.Error
          )
        );
      }

      // Add decorations based on errors
      if (errors.length === 1) {
        decorations.push({
          range,
          renderOptions: {
            after: {
              contentText: ` ${errors[0]}`,
            },
          },
        });
      } else if (errors.length > 1) {
        decorations.push({
          range,
          renderOptions: {
            after: {
              contentText: ` Hover to see all errors`,
            },
          },
        });
      }
    }

    // Apply decorations
    editor.setDecorations(inlineDecorationType, decorations);

    // Apply diagnostics
    diagnosticsCollection.set(document.uri, diagnostics);
  }

  // Event listener for text document changes
  const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === event.document) {
        updateDecorations(editor);
      }
    }
  );

  // Event listener for active editor changes
  const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      if (editor) {
        updateDecorations(editor);
      }
    }
  );

  // Initialize decorations for the current editor
  if (vscode.window.activeTextEditor) {
    updateDecorations(vscode.window.activeTextEditor);
  }

  // Add disposables to the context
  context.subscriptions.push(
    inlineDecorationType,
    onDidChangeTextDocument,
    onDidChangeActiveTextEditor,
    diagnosticsCollection
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};


//notes
//linter should not in the same time its as its writing, maybe wait a little
