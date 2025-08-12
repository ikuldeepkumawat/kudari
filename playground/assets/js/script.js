// Example programs
const examples = {
    hello: `// Hello World Example
kudari shuru karo

bolo "Namaste Duniya!"
bolo "KudariLang mein aapka swagat hai!"

kudari khatam karo`,

    calculator: `// Calculator Example
kudari shuru karo

ginti a kar do 15
ginti b kar do 10

bolo "=== Calculator ==="
bolo "a = " add karo a
bolo "b = " add karo b

ginti sum kar do a add karo b
ginti diff kar do a kam karo b
ginti product kar do a guna karo b
ginti quotient kar do a bhag karo b

bolo "Addition: " add karo sum
bolo "Subtraction: " add karo diff
bolo "Multiplication: " add karo product
bolo "Division: " add karo quotient

kudari khatam karo`,

    conditions: `// Conditions Example
kudari shuru karo

ginti marks kar do 85

agar marks zyada ya barabar 90 to
  bolo "Excellent! A+ grade"
warna agar marks zyada ya barabar 75 to
  bolo "Good! A grade" 
warna agar marks zyada ya barabar 60 to
  bolo "Average! B grade"
warna
  bolo "Need improvement!"

kudari khatam karo`,

    loop: `// Loop Example
kudari shuru karo

ginti counter kar do 1

jab tak counter <= 5 to
  bolo "Count: " + counter
  ginti counter kar do counter add karo 1

bolo "Loop finished!"

kudari khatam karo`,

    variables: `// Variables Example
kudari shuru karo

ginti age kar do 25
ginti naam kar do "Rahul"
ginti salary kar do 50000

bolo "Name: " + naam
bolo "Age: " + age
bolo "Salary: " + salary

ginti bonus kar do salary guna karo 0.1
bolo "Bonus: " + bonus

kudari khatam karo`
};

// Load example function
function loadExample(exampleName) {
    if (examples[exampleName]) {
        document.getElementById('code').value = examples[exampleName];
        updateHighlighting();
    }
}

// View source function
function viewSource() {
    window.open('https://github.com/ikuldeepkumawat/kudari', '_blank');
}
// KudariLang parser function
function parseKudariLang(code) {
    const declaredVars = new Set();

    // Remove comments
    code = code.replace(/\/\/.*$/gm, '');

    // First pass: Handle arithmetic operations in expressions but NOT in variable declarations
    const lines = code.split('\n');
    const processedLines = lines.map(line => {
        if (line.includes('ginti ') && line.includes(' kar do ')) {
            return line;
        }

        return line
            .replace(/add karo/g, ' + ')
            .replace(/kam karo/g, ' - ')
            .replace(/guna karo/g, ' * ')
            .replace(/bhag karo/g, ' / ')
            .replace(/mod karo/g, ' % ');
    });

    code = processedLines.join('\n');

    // Variable declarations
    code = code.replace(/ginti (\w+) kar do (.+)/g, (match, varName, value) => {
        const processedValue = value
            .replace(/add karo/g, ' + ')
            .replace(/kam karo/g, ' - ')
            .replace(/guna karo/g, ' * ')
            .replace(/bhag karo/g, ' / ')
            .replace(/mod karo/g, ' % ');

        if (!declaredVars.has(varName)) {
            declaredVars.add(varName);
            return `let ${varName.trim()} = ${processedValue.trim()};`;
        } else {
            return `${varName.trim()} = ${processedValue.trim()};`;
        }
    });

    // Protect string literals
    const stringLiterals = [];
    code = code.replace(/"([^"]*)"/g, (match, content) => {
        const placeholder = `__STR_${stringLiterals.length}__`;
        stringLiterals.push(`"${content}"`);
        return placeholder;
    });

    // Core language constructs
    code = code
        .replace(/kudari shuru karo/g, '// === Program Start ===')
        .replace(/kudari khatam karo/g, '// === Program End ===')
        .replace(/bolo\s+"([^"]+)"\s*\+\s*(.+?)(?=\n|$)/g, 'console.log("$1" + ($2))')
        .replace(/bolo\s+(.+?)\s*\+\s*"([^"]+)"(?=\n|$)/g, 'console.log(($1) + "$2")')
        .replace(/bolo\s+"([^"]+)"(?=\n|$)/g, 'console.log("$1")')
        .replace(/bolo\s+([^";\n]+?)(?=\n|$)/g, 'console.log($1)')
        .replace(/agar (.+?) to/g, 'if ($1) {')
        .replace(/warna agar (.+?) to/g, '} else if ($1) {')
        .replace(/warna/g, '} else {')
        .replace(/jab tak (.+?) to/g, 'while ($1) {')
        .replace(/barabar hai/g, '==')
        .replace(/nahi barabar/g, '!=')
        .replace(/zyada hai/g, '>')
        .replace(/kam hai/g, '<')
        .replace(/zyada ya barabar/g, '>=')
        .replace(/kam ya barabar/g, '<=')
        .replace(/aur/g, '&&')
        .replace(/ya/g, '||')
        .replace(/nahi/g, '!');

    // Restore strings
    stringLiterals.forEach((str, i) => {
        code = code.replace(`__STR_${i}__`, str);
    });

    // Auto-close remaining blocks
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    const missingBraces = openBraces - closeBraces;

    if (missingBraces > 0) {
        code += '\n' + '}'.repeat(missingBraces);
    }

    return code;
}

// Enhanced KudariLang syntax highlighter
function highlightKudariSyntax(code) {
    return code
        // Comments first
        // .replace(/(\/\/.*$)/gm, '<span class="kudari-comment">$1</span>')

        // String literals
        .replace(/"([^"]*)"/g, '<span class="kudari-string">"$1"</span>')

        // Program markers
        .replace(/\b(kudari shuru karo|kudari khatam karo)\b/g, '<span class="kudari-marker">$1</span>')

        // Variable keywords
        .replace(/\b(ginti|kar do)\b/g, '<span class="kudari-keyword">$1</span>')

        // Control flow keywords
        .replace(/\b(bolo|agar|warna agar|warna|jab tak|to)\b/g, '<span class="kudari-control">$1</span>')

        // Arithmetic operators
        .replace(/\b(add karo|kam karo|guna karo|bhag karo|mod karo)\b/g, '<span class="kudari-operator">$1</span>')

        // Comparison operators
        .replace(/\b(barabar hai|nahi barabar|zyada hai|kam hai|zyada ya barabar|kam ya barabar)\b/g, '<span class="kudari-comparison">$1</span>')

        // Logical operators
        .replace(/\b(aur|ya|nahi)\b/g, '<span class="kudari-logical">$1</span>')

        // Numbers
        .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="kudari-number">$1</span>')

        // Variable names
        .replace(/\bginti\s+(\w+)\s+kar do/g, 'ginti <span class="kudari-variable">$1</span> kar do');
}

// Update syntax highlighting
function updateHighlighting() {
    const code = document.getElementById('code').value;
    const highlightedCode = document.getElementById('highlighted-code');

    highlightedCode.innerHTML = highlightKudariSyntax(code);
}

// Sync scroll between textarea and highlighted div
function syncScroll() {
    const code = document.getElementById('code');
    const highlightedCode = document.getElementById('highlighted-code');

    highlightedCode.scrollTop = code.scrollTop;
    highlightedCode.scrollLeft = code.scrollLeft;
}

// KudariLang marker validation function
function validateKudariMarkers(code) {
    const hasStart = code.includes('kudari shuru karo');
    const hasEnd = code.includes('kudari khatam karo');
    if (!hasStart || !hasEnd) {
        let missing = [];
        if (!hasStart) missing.push('"kudari shuru karo"');
        if (!hasEnd) missing.push('"kudari khatam karo"');
        throw new Error(
            `Missing required KudariLang marker(s): ${missing.join(' and ')}.\n` +
            `Please ensure your code starts with "kudari shuru karo" and ends with "kudari khatam karo".`
        );
    }
}

function runKudari() {
    const code = document.getElementById("code").value;
    const outputEl = document.getElementById("output");

    // Show loading animation
    outputEl.innerHTML = '<span class="output-info">🚀 Executing KudariLang code...</span>';

    setTimeout(() => {
        try {
            // Validate KudariLang markers before transpiling
            validateKudariMarkers(code);

            const jsCode = parseKudariLang(code);

            const originalConsoleLog = console.log;
            let consoleOutput = '';
            console.log = (...args) => {
                consoleOutput += args.join(' ') + '\n';
            };

            eval(jsCode);
            console.log = originalConsoleLog;

            if (consoleOutput.trim()) {
                outputEl.innerHTML = `<span class="output-success">✨ Program executed successfully!</span>\n\n${consoleOutput}`;
            } else {
                outputEl.innerHTML = '<span class="output-success">✨ Program executed successfully!</span>\n<span class="output-info">No output produced.</span>';
            }
        } catch (err) {
            outputEl.innerHTML = `<span class="output-error">❌ Runtime Error:</span>\n${err.message}`;
        }
    }, 300);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const codeTextarea = document.getElementById('code');

    // Initial highlighting
    updateHighlighting();

    // Update highlighting on input
    codeTextarea.addEventListener('input', updateHighlighting);

    // Sync scroll
    codeTextarea.addEventListener('scroll', syncScroll);

    // Handle tab key for better indentation
    codeTextarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;

            e.target.value = e.target.value.substring(0, start) +
                '    ' + e.target.value.substring(end);

            e.target.selectionStart = e.target.selectionEnd = start + 4;
            updateHighlighting();
        }
    });

    // Handle text selection properly
    codeTextarea.addEventListener('mousedown', (e) => {
        codeTextarea.style.color = 'rgba(232, 232, 243, 0.01)';
    });

    codeTextarea.addEventListener('mouseup', (e) => {
        setTimeout(() => {
            codeTextarea.style.color = 'transparent';
        }, 10);
    });

    codeTextarea.addEventListener('selectstart', (e) => {
        codeTextarea.style.color = 'rgba(232, 232, 243, 0.3)';
    });

    codeTextarea.addEventListener('blur', (e) => {
        codeTextarea.style.color = 'transparent';
    });

    // Allow Ctrl+Enter to run code
    codeTextarea.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runKudari();
        }
    });
});