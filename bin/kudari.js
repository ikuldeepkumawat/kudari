#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const { parseKudariLang } = require('../lib/parser');

// Colors for better output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function showBanner() {
  console.log(`${colors.cyan}
╦╔═╦ ╦╔╦╗╔═╗╦═╗╦╦  ╔═╗╔╗╔╔═╗
╠╩╗║ ║ ║║╠═╣╠╦╝║║  ╠═╣║║║║ ╦
╩ ╩╚═╝═╩╝╩ ╩╩╚═╩╩═╝╩ ╩╝╚╝╚═╝
${colors.reset}${colors.magenta}Hindi Programming Language${colors.reset}
`);
}

function showHelp() {
  showBanner();
  console.log(`
${colors.green}Usage:${colors.reset}
  kudari <file.kudari>     Run a KudariLang file
  kudari --help           Show this help
  kudari --version        Show version
  kudari --example        Create example files
  kudari --syntax         Show syntax guide

${colors.green}Examples:${colors.reset}
  kudari hello.kudari
  kudari examples/calculator.kudari
  
${colors.green}Environment Variables:${colors.reset}
  KUDARI_DEBUG=1          Show transpiled JavaScript
  `);
}

function showSyntax() {
  console.log(`
${colors.blue}📚 KudariLang Syntax Guide${colors.reset}

${colors.yellow}Variables:${colors.reset}
  ginti naam kar do "Kuldeep"     // let naam = "Kuldeep"
  ginti age kar do 25             // let age = 25

${colors.yellow}Output:${colors.reset}
  bolo "Hello World"              // console.log("Hello World")
  bolo naam                       // console.log(naam)

${colors.yellow}Math Operations:${colors.reset}
  add karo     (+)    // Addition
  kam karo     (-)    // Subtraction
  guna karo    (*)    // Multiplication
  bhag karo    (/)    // Division

${colors.yellow}Conditions:${colors.reset}
  agar age >= 18 to               // if (age >= 18) {
      bolo "Adult"
  warna agar age >= 13 to         // } else if (age >= 13) {
      bolo "Teen"
  warna                           // } else {
      bolo "Kid"                  // }

${colors.yellow}Loops:${colors.reset}
  jab tak i <= 10 to              // while (i <= 10) {
      bolo i
      ginti i kar do i add karo 1
      
${colors.yellow}Comparisons:${colors.reset}
  barabar hai    (==)
  nahi barabar   (!=)
  zyada hai      (>)
  kam hai        (<)
  zyada ya barabar (>=)
  kam ya barabar   (<=)
  `);
}

function createExampleFiles() {
  const examples = {
    'hello.kudari': `// Hello World in KudariLang
kudari shuru karo

ginti naam kar do "Duniya"
bolo "Namaste " add karo naam
bolo "KudariLang mein aapka swagat hai!"

kudari khatam karo`,

    'calculator.kudari': `// Simple Calculator
kudari shuru karo

ginti a kar do 10
ginti b kar do 5

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

    'loops.kudari': `// Loop Examples
kudari shuru karo

bolo "=== Counting 1 to 5 ==="
ginti i kar do 1
jab tak i <= 5 to
    bolo "Count: " add karo i
    ginti i kar do i add karo 1

bolo "=== Countdown from 3 ==="
ginti countdown kar do 3
jab tak countdown > 0 to
    bolo countdown
    ginti countdown kar do countdown kam karo 1

bolo "🚀 Blast off!"

kudari khatam karo`,

    'conditions.kudari': `// Conditional Examples
kudari shuru karo

ginti age kar do 25
ginti score kar do 85

bolo "Age Check:"
agar age >= 60 to
    bolo "👴 Senior Citizen"
warna agar age >= 18 to
    bolo "🧑 Adult"
warna
    bolo "🧒 Minor"

bolo "Grade Check:"
agar score >= 90 to
    bolo "Grade: A+"
warna agar score >= 80 to
    bolo "Grade: A"
warna agar score >= 70 to
    bolo "Grade: B"
warna
    bolo "Grade: C"

kudari khatam karo`
  };

  // Create examples directory
  if (!fs.existsSync('examples')) {
    fs.mkdirSync('examples');
  }

  // Write all example files
  Object.entries(examples).forEach(([filename, content]) => {
    fs.writeFileSync(path.join('examples', filename), content);
  });

  console.log(`${colors.green}✅ Example files created in ./examples/ directory:${colors.reset}`);
  Object.keys(examples).forEach(file => {
    console.log(`   📄 examples/${file}`);
  });
}

// === KudariLang marker validation ===
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

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help') {
  showHelp();
  process.exit(0);
}

if (args[0] === '--version') {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));
  showBanner();
  console.log(`Version: ${colors.green}${pkg.version}${colors.reset}`);
  process.exit(0);
}

if (args[0] === '--syntax') {
  showSyntax();
  process.exit(0);
}

if (args[0] === '--example') {
  createExampleFiles();
  process.exit(0);
}

const filePath = args[0];

if (!fs.existsSync(filePath)) {
  console.error(`${colors.red}❌ File not found: ${filePath}${colors.reset}`);
  console.log(`${colors.yellow}💡 Tip: Use 'kudari --example' to create sample files${colors.reset}`);
  process.exit(1);
}

if (!filePath.endsWith('.kudari')) {
  console.warn(`${colors.yellow}⚠️  Warning: File should have .kudari extension${colors.reset}`);
}

try {
  const code = fs.readFileSync(path.resolve(filePath), 'utf-8');

  // === Validate KudariLang markers ===
  validateKudariMarkers(code);

  if (process.env.KUDARI_DEBUG !== '1') {
    console.log(`${colors.blue}🚀 Running: ${path.basename(filePath)}${colors.reset}`);
    console.log('─'.repeat(40));
  }

  const jsCode = parseKudariLang(code);

  // Debug mode
  if (process.env.KUDARI_DEBUG === '1') {
    console.log(`${colors.yellow}[DEBUG] Input KudariLang:${colors.reset}`);
    console.log(code);
    console.log(`${colors.yellow}[DEBUG] Transpiled JavaScript:${colors.reset}`);
    console.log(jsCode);
    console.log(`${colors.yellow}[DEBUG] Output:${colors.reset}`);
    console.log('─'.repeat(40));
  }

  eval(jsCode);

  if (process.env.KUDARI_DEBUG !== '1') {
    console.log('─'.repeat(40));
    console.log(`${colors.green}✅ Program completed successfully${colors.reset}`);
  }

} catch (err) {
  console.log('─'.repeat(40));
  if (
    err.message &&
    err.message.includes('Missing required KudariLang marker')
  ) {
    console.error(`${colors.red}❌ KudariLang Error: ${err.message}${colors.reset}`);
  } else if (err.name === 'SyntaxError') {
    console.error(`${colors.red}❌ Syntax Error: ${err.message}${colors.reset}`);
  } else {
    console.error(`${colors.red}❌ Runtime Error: ${err.message}${colors.reset}`);
  }
  console.log(`${colors.yellow}💡 Use 'kudari --syntax' to see syntax guide${colors.reset}`);
  process.exit(1);
}