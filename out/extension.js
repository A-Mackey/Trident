"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const pinnedFiles = [];
function activate(context) {
    // Provider
    const pinnedFilesProvider = vscode.window.createQuickPick();
    pinnedFilesProvider.placeholder = "Select a file to open";
    // When the user selects a file, open it
    pinnedFilesProvider.onDidChangeSelection((selection) => {
        const selectedFile = selection[0];
        if (selectedFile) {
            vscode.workspace
                .openTextDocument(selectedFile.description)
                .then((doc) => {
                vscode.window.showTextDocument(doc);
            })
                .then(() => {
                pinnedFilesProvider.hide();
            })
                .then(() => {
                updatePinnedPagesProvider();
            });
        }
    });
    // Update the list of pinned files
    const updatePinnedPagesProvider = () => {
        pinnedFilesProvider.items = pinnedFiles.map((file) => ({
            label: file.fileName,
            description: file.filePath,
        }));
    };
    // Command to pin the current page
    const pinPage = vscode.commands.registerCommand("common-files.pinPage", () => {
        const filePath = vscode.window.activeTextEditor?.document.fileName;
        const fileName = filePath?.split("\\").pop();
        if (filePath && fileName) {
            if (pinnedFiles.find((file) => file.fileName === fileName)) {
                return;
            }
            pinnedFiles.push({ fileName, filePath });
            vscode.window.showInformationMessage(`Pinned ${fileName}!`);
        }
        updatePinnedPagesProvider();
    });
    // Command to unpin the current page
    const unpinPage = vscode.commands.registerCommand("common-files.unpinPage", () => {
        const filePath = vscode.window.activeTextEditor?.document.fileName;
        const fileName = filePath?.split("\\").pop();
        if (filePath && fileName) {
            const index = pinnedFiles.findIndex((file) => file.fileName === fileName);
            if (index > -1) {
                pinnedFiles.splice(index, 1);
                vscode.window.showInformationMessage(`Unpinned ${fileName}!`);
            }
        }
        updatePinnedPagesProvider();
    });
    // Command to show the list of pinned pages as an alert (testing)
    const showPinnedPages = vscode.commands.registerCommand("common-files.showPinnedPages", () => {
        vscode.window.showInformationMessage("Pinned Pages: " + pinnedFiles.map((file) => file.fileName).join(", "));
    });
    // Command to show the list of pinned pages as a quick pick
    const pinnedFilesProviderCommand = vscode.commands.registerCommand("common-files.pinnedPagesProvider", () => {
        pinnedFilesProvider.show();
    });
    context.subscriptions.push(pinPage);
    context.subscriptions.push(unpinPage);
    // context.subscriptions.push(showPinnedPages);
    context.subscriptions.push(pinnedFilesProviderCommand);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map