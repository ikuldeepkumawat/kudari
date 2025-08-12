"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
function activate(context) {
    console.log('KudariLang extension is now active! 🚀');
    // Register the run command
    let runCommand = vscode.commands.registerCommand('kudarilang.runCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('कोई KudariLang फाइल open नहीं है!');
            return;
        }
        const document = editor.document;
        if (document.languageId !== 'kudarilang' && !document.fileName.endsWith('.kudari')) {
            vscode.window.showErrorMessage('यह KudariLang फाइल नहीं है!');
            return;
        }
        // Save the file first
        document.save().then(() => {
            const filePath = document.fileName;
            const terminal = vscode.window.createTerminal({
                name: 'KudariLang',
                iconPath: new vscode.ThemeIcon('play'),
            });
            terminal.show();
            terminal.sendText(`kudari "${filePath}"`);
            vscode.window.showInformationMessage(`🚀 Running: ${path.basename(filePath)}`);
        });
    });
    // Register language configuration
    vscode.languages.setLanguageConfiguration('kudarilang', {
        comments: {
            lineComment: '//'
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')']
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' }
        ]
    });
    // Add hover provider for KudariLang keywords
    let hoverProvider = vscode.languages.registerHoverProvider('kudarilang', {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);
            const keywordHints = {
                'kudari': '🏁 **Program Marker**\n\n`kudari shuru karo` - Program शुरू करता है\n`kudari khatam karo` - Program ख़त्म करता है',
                'shuru': '▶️ **Start**\n\nProgram की शुरुआत',
                'karo': '⚡ **Action**\n\nCommand को execute करता है',
                'khatam': '🏁 **End**\n\nProgram को समाप्त करता है',
                'ginti': '📊 **Variable**\n\n`ginti naam kar do "value"` - Variable declare करता है',
                'kar': '🔧 **Operator**\n\nAssignment के लिए use होता है',
                'do': '✅ **Complete**\n\nAction को complete करता है',
                'bolo': '📢 **Print**\n\n`bolo "Hello"` - Output print करता है',
                'add': '➕ **Addition**\n\n`add karo` - दो values को जोड़ता है',
                'kam': '➖ **Subtraction**\n\n`kam karo` - Values को घटाता है',
                'guna': '✖️ **Multiplication**\n\n`guna karo` - Values को multiply करता है',
                'bhag': '➗ **Division**\n\n`bhag karo` - Values को divide करता है',
                'agar': '🤔 **If Condition**\n\n`agar condition to` - Conditional statement',
                'warna': '🔄 **Else**\n\n`warna` - Else condition',
                'to': '➡️ **Then**\n\nCondition के बाद action specify करता है',
                'jab': '🔄 **While Loop**\n\n`jab tak condition to` - Loop बनाता है',
                'tak': '📏 **Until**\n\nLoop की condition specify करता है',
                'barabar': '⚖️ **Equal**\n\n`barabar hai` - Equality check (==)',
                'hai': '✔️ **Is**\n\nComparison में use होता है',
                'zyada': '⬆️ **Greater**\n\n`zyada hai` - Greater than (>)',
                'nahi': '❌ **Not**\n\n`nahi barabar` - Not equal (!=)'
            };
            if (keywordHints[word]) {
                return new vscode.Hover(keywordHints[word]);
            }
        }
    });
    // Add completion provider
    let completionProvider = vscode.languages.registerCompletionItemProvider('kudarilang', {
        provideCompletionItems(document, position, token, context) {
            const suggestions = [
                {
                    label: 'kudari shuru karo',
                    kind: vscode.CompletionItemKind.Keyword,
                    detail: 'Program start marker',
                    documentation: 'KudariLang program की शुरुआत करता है'
                },
                {
                    label: 'kudari khatam karo',
                    kind: vscode.CompletionItemKind.Keyword,
                    detail: 'Program end marker',
                    documentation: 'KudariLang program को समाप्त करता है'
                },
                {
                    label: 'ginti',
                    kind: vscode.CompletionItemKind.Keyword,
                    detail: 'Variable declaration',
                    documentation: 'Variable declare करने के लिए'
                },
                {
                    label: 'kar do',
                    kind: vscode.CompletionItemKind.Operator,
                    detail: 'Assignment operator',
                    documentation: 'Variable को value assign करता है'
                },
                {
                    label: 'bolo',
                    kind: vscode.CompletionItemKind.Function,
                    detail: 'Print function',
                    documentation: 'Output print करने के लिए'
                },
                {
                    label: 'add karo',
                    kind: vscode.CompletionItemKind.Operator,
                    detail: 'Addition operator',
                    documentation: 'दो values को जोड़ता है'
                },
                {
                    label: 'kam karo',
                    kind: vscode.CompletionItemKind.Operator,
                    detail: 'Subtraction operator',
                    documentation: 'Values को घटाता है'
                },
                {
                    label: 'guna karo',
                    kind: vscode.CompletionItemKind.Operator,
                    detail: 'Multiplication operator',
                    documentation: 'Values को multiply करता है'
                },
                {
                    label: 'bhag karo',
                    kind: vscode.CompletionItemKind.Operator,
                    detail: 'Division operator',
                    documentation: 'Values को divide करता है'
                },
                {
                    label: 'agar',
                    kind: vscode.CompletionItemKind.Keyword,
                    detail: 'If condition',
                    documentation: 'Conditional statement के लिए'
                },
                {
                    label: 'warna',
                    kind: vscode.CompletionItemKind.Keyword,
                    detail: 'Else condition',
                    documentation: 'Else condition के लिए'
                },
                {
                    label: 'jab tak',
                    kind: vscode.CompletionItemKind.Keyword,
                    detail: 'While loop',
                    documentation: 'Loop बनाने के लिए'
                },
                {
                    label: 'to',
                    kind: vscode.CompletionItemKind.Keyword,
                    detail: 'Then',
                    documentation: 'Condition के बाद action specify करता है'
                }
            ];
            return suggestions.map(s => {
                const item = new vscode.CompletionItem(s.label, s.kind);
                item.detail = s.detail;
                item.documentation = s.documentation;
                return item;
            });
        }
    });
    // Status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '🇮🇳 KudariLang';
    statusBarItem.tooltip = 'KudariLang Extension Active';
    statusBarItem.show();
    context.subscriptions.push(runCommand, hoverProvider, completionProvider, statusBarItem);
}
exports.activate = activate;
function deactivate() {
    console.log('KudariLang extension deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map