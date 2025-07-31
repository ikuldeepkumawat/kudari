function parseKudariLang(code) {
  const declaredVars = new Set();
  
  // Remove comments
  code = code.replace(/\/\/.*$/gm, '');
  
  // Replace arithmetic operations (order matters!)
  code = code
    .replace(/add karo/g, '+')
    .replace(/kam karo/g, '-')
    .replace(/guna karo/g, '*')
    .replace(/bhag karo/g, '/')
    .replace(/mod karo/g, '%');

  // Variable declarations
  code = code.replace(/ginti (\w+) kar do (.+)/g, (match, varName, value) => {
    if (!declaredVars.has(varName)) {
      declaredVars.add(varName);
      return `let ${varName.trim()} = ${value.trim()};`;
    } else {
      return `${varName.trim()} = ${value.trim()};`;
    }
  });

  // Core language constructs
  code = code
    .replace(/kudari shuru karo/g, '// === Program Start ===')
    .replace(/kudari khatam karo/g, '// === Program End ===')
    
    // Print statements
    .replace(/bolo\s+"(.*?)"/g, 'console.log("$1")')
    .replace(/bolo\s+([a-zA-Z_][a-zA-Z0-9_]*(?:\s*\+\s*[^;]*)?)/g, 'console.log($1)')
    
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