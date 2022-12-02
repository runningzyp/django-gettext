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
        let word = document.getText(document.getWordRangeAtPosition(position));
        if (String(word).toLowerCase() === 'fuzzy') {
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
        let firstMatchMSGID: string;
        for (let i = 0; i < 100; i++) {
            var varText = document.lineAt(position.line + i).text;
            if (varText.toLowerCase().startsWith('msgid')) {
                firstMatchMSGID = varText.replaceAll('msgid', '').replaceAll('"', "").replaceAll("'", "").trim();
                break;
            }
        }
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
                return vscode.workspace.findFiles(filePath).then(async value => {
                    if (!value) {
                        return;
                    }
                    let locations: vscode.Location[] = new Array();
                    
                    for (let i = 0; i < value.length; i++) {
                        let targetUri: vscode.Position;
                        let document = await vscode.workspace.openTextDocument(value[i]);
                        if (lineNumber) {
                            const lineText = document.lineAt(lineNumber - 1).text;
                            targetUri = new vscode.Position(lineNumber - 1, lineText.indexOf(firstMatchMSGID) === -1 ? 0 : lineText.indexOf(firstMatchMSGID));
                            locations.push(new vscode.Location(value[i], targetUri));
                        } else {
                            for (let j = 0; i < document.lineCount; j++) {
                                const lineText = document.lineAt(j).text;
                                if (lineText.indexOf(firstMatchMSGID) !== -1) {
                                    targetUri = new vscode.Position(j, lineText.indexOf(firstMatchMSGID));
                                    locations.push(new vscode.Location(value[i], targetUri));
                                    break;
                                }
                            }
                        }
                    }

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
