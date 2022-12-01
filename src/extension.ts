// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let disposable: vscode.Disposable;
let hoverProvider: vscode.Disposable;
let diagnosticCollection: vscode.DiagnosticCollection;
let defineProvider: vscode.Disposable;

// The command has been defined in the package.json file
// Now provide the implementation of the command with registerCommand
// The commandId parameter must match the command field in package.json
disposable = vscode.commands.registerCommand('makemessages', () => {
    vscode.window.showInformationMessage('Django makemessages!');
});

hoverProvider = vscode.languages.registerHoverProvider('django.po', {
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        let word = document.getText(document.getWordRangeAtPosition(position))
        if (String(word).toLowerCase() == 'fuzzy') {
            return {
                contents: [
                    "Fuzzy translations are not used by default. \n",
                    "Please delete the fuzzy flag to use this translation.",
                ]
            };
        }
    }
});

diagnosticCollection = vscode.languages.createDiagnosticCollection('django.po');

defineProvider = vscode.languages.registerDefinitionProvider('django.po', {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {

        const lineText = document.lineAt(position).text; // #: foo/bar.py:123 foo/bar.py:199
        if (!lineText.startsWith('#:')) {
            return;
        }
        const fileArray = lineText.replace('#: ', '').split(' ');
        //  fileArray
        // ['#:', 'foo/bar.py:123', 'foo/bar.py:199']
        // 
        for (const file of fileArray) {
            //  file
            // 'foo/bar.py:123'
            //                  
            const fileIndexStart = lineText.indexOf(file);
            const fileIndexEnd = fileIndexStart + file.length;
            if (position.character >= fileIndexStart && position.character <= fileIndexEnd) {
                let [filePath, lineString] = file.split(':');
                let lineNumber = Number(lineString);
                if (isNaN(lineNumber)) {
                    lineNumber = 0;
                }
                return vscode.workspace.findFiles(filePath).then(value => {
                    if (!value) {
                        return;
                    }
                    let targetUri :vscode.Position
                    targetUri = new vscode.Position(lineNumber+1, 0);
                    let locations: vscode.Location[] = new Array();
                    value.forEach(uri => {
                        locations.push(new vscode.Location(uri, targetUri));
                    });
                    return locations;
                });

            }
        }

        return new vscode.Location(document.uri, new vscode.Position(0, 0));

    }

});



export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(disposable); // register command
    context.subscriptions.push(hoverProvider); // register hover provider
    context.subscriptions.push(defineProvider); // register definition provider

}

// This method is called when your extension is deactivated
export function deactivate() { }
