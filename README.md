# zipDemon - Visual Studio Code Extension

zipDemon is a Visual Studio Code extension that automatically generates documentation for supported programming languages. It leverages language language model to provide an AI-powered explanation of the code, along with a summary of classes, functions, and variables identified within the file. The generated documentation is saved as a Markdown file in a `docs` subdirectory within the same directory as the source code file.

## Features

- Automatically generates documentation for classes, functions, and variables.
- Uses language language model for code explanation.
- Saves the generated documentation as a Markdown file (`README.md`) in the `docs` subdirectory.
- Supports a few programming languages (specify which ones here, e.g., JavaScript, Python, etc.).

## Installation

To install the ZipDemon extension for Visual Studio Code:

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window.
3. Search for "zipDemon" and click on "Install."

Alternatively, you can install it from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/).

## Usage

1. Open the project directory that contains the code you want to document.
2. Right-click on the source code file in the Explorer view.
3. Select **Turn on zipDemon** from the context menu.
4. The extension will analyze your code, generate a Markdown documentation file (`README.md`), and save it in the `docs` subdirectory.
   
   - The generated documentation will include an AI-powered explanation of the code and a list of identified classes, functions, and variables.

## Supported Languages

- JavaScript
- Python
- Java
- c++
- Ruby
- Go

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---



