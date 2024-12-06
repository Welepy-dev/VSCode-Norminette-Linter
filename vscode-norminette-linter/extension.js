const vscode = require('vscode');

function activate(context) {
    // Create a decoration type for inline messages
    const inlineDecorationType = vscode.window.createTextEditorDecorationType({
        after: {
            margin: '0 0 0 1em',
            color: 'yellow',
            fontStyle: 'italic'
        }
    });

    // Function to update decorations dynamically
    function updateDecorations(editor) {
        if (!editor) return;

        const document = editor.document;
        const decorations = [];

        for (let line = 0; line < document.lineCount; line++) {
            const lineText = document.lineAt(line).text;
            const charCount = lineText.length;

            // Create a range for the decoration (end of the line)
            const range = new vscode.Range(new vscode.Position(line, charCount), new vscode.Position(line, charCount));
            decorations.push({
                range,
                renderOptions: {
                    after: {
                        contentText: ` (chars: ${charCount})`
                    }
                }
            });
        }

        editor.setDecorations(inlineDecorationType, decorations);
    }

    // Event listener for text document changes
    const onDidChangeTextDocument = vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document === event.document) {
            updateDecorations(editor);
        }
    });

    // Event listener for active editor changes
    const onDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            updateDecorations(editor);
        }
    });

    // Command for interactivity
    // const disposableCommand = vscode.commands.registerCommand('extension.showInfo', () => {
    //     vscode.window.showInformationMessage('You pressed the inline message!');
    // });

    // Hover interactivity using a command
    const onDidMouseEvent = vscode.window.onDidChangeTextEditorSelection(event => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const selection = event.selections[0];
        const lineText = document.lineAt(selection.active.line).text;
        const charCount = lineText.length;

        // Check if the cursor is at the end of the line (near the decoration)
        if (selection.active.character >= charCount) {
            vscode.commands.executeCommand('extension.showInfo');
        }
    });

    // Initialize decorations for the current editor
    if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor);
    }

    // Add disposables to the context
    context.subscriptions.push(
        inlineDecorationType,
        onDidChangeTextDocument,
        onDidChangeActiveTextEditor,
        // disposableCommand,
        onDidMouseEvent
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
