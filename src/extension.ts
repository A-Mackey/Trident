import * as vscode from "vscode";

type FilePin = {
  fileName: string;
  filePath: string;
};

const pinnedFiles: FilePin[] = [];

export function activate(context: vscode.ExtensionContext) {
  // Provider
  const pinnedFilesProvider = vscode.window.createQuickPick();
  pinnedFilesProvider.placeholder = "Select a file to open";

  // When the user selects a file, open it
  pinnedFilesProvider.onDidChangeSelection((selection) => {
    const selectedFile = selection[0];
    if (selectedFile) {
      vscode.workspace
        .openTextDocument(selectedFile.description as string)
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
  const pinPage = vscode.commands.registerCommand("trident.pinPage", () => {
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
  const unpinPage = vscode.commands.registerCommand("trident.unpinPage", () => {
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
  const showPinnedPages = vscode.commands.registerCommand(
    "trident.showPinnedPages",
    () => {
      vscode.window.showInformationMessage(
        "Pinned Pages: " + pinnedFiles.map((file) => file.fileName).join(", ")
      );
    }
  );

  // Command to show the list of pinned pages as a quick pick
  const pinnedFilesProviderCommand = vscode.commands.registerCommand(
    "trident.pinnedPagesProvider",
    () => {
      pinnedFilesProvider.show();
    }
  );

  context.subscriptions.push(pinPage);
  context.subscriptions.push(unpinPage);
  // context.subscriptions.push(showPinnedPages);
  context.subscriptions.push(pinnedFilesProviderCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
