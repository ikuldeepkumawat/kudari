function parseKudariLang(code) {
  const declaredVars = new Set();
  
  // Remove comments
  code = code.replace(/\/\/.*$/gm, '');
  
  // First pass: Handle arithmetic operations in expressions but NOT in variable declarations
  // Split by lines to process each line individually
  const lines = code.split('\n');
  const processedLines = lines.map(line => {
    // Skip variable declaration lines for now
    if (line.includes('ginti ') && line.includes(' kar do ')) {
      return line;
    }
    
    // Process arithmetic operations in other lines
    return line
      .replace(/add karo/g, ' + ')
      .replace(/kam karo/g, ' - ')
      .replace(/guna karo/g, ' * ')
      .replace(/bhag karo/g, ' / ')
      .replace(/mod karo/g, ' % ');
  });
  
  code = processedLines.join('\n');

  // Variable declarations - handle after arithmetic operations in expressions
  code = code.replace(/ginti (\w+) kar do (.+)/g, (match, varName, value) => {
    // Process arithmetic in the value part
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

  // === Protect string literals ===
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
    
    // Enhanced print statements - handle all combinations properly
    .replace(/bolo\s+"([^"]+)"\s*\+\s*(.+?)(?=\n|$)/g, 'console.log("$1" + ($2))')         // string + var
    .replace(/bolo\s+(.+?)\s*\+\s*"([^"]+)"(?=\n|$)/g, 'console.log(($1) + "$2")')         // var + string
    .replace(/bolo\s+"([^"]+)"(?=\n|$)/g, 'console.log("$1")')                             // string only
    .replace(/bolo\s+([^";\n]+?)(?=\n|$)/g, 'console.log($1)')                             // variable/expression only
    
    // Conditional statements
    .replace(/agar (.+?) to/g, 'if ($1) {')
    .replace(/warna agar (.+?) to/g, '} else if ($1) {')
    .replace(/warna/g, '} else {')
    
    // Loops
    .replace(/jab tak (.+?) to/g, 'while ($1) {')
    
    // Comparison operators
    .replace(/barabar hai/g, '==')
    .replace(/nahi barabar/g, '!=')
    .replace(/zyada hai/g, '>')
    .replace(/kam hai/g, '<')
    .replace(/zyada ya barabar/g, '>=')
    .replace(/kam ya barabar/g, '<=')
    
    // Logical operators
    .replace(/aur/g, '&&')
    .replace(/ya/g, '||')
    .replace(/nahi/g, '!');

  // === Restore strings ===
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

module.exports = { parseKudariLang };