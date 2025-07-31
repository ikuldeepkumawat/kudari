# 🚀 KudariLang

**KudariLang** is a Hindi-inspired programming language that transpiles to JavaScript. Write code in Hindi and run it anywhere JavaScript runs!

## ✨ Features

- 🇮🇳 **Hindi Syntax**: Write code in Hindi language
- ⚡ **Fast**: Transpiles to efficient JavaScript
- 🛠️ **Easy Setup**: Simple CLI installation
- 📚 **Rich Examples**: Learn with practical examples
- 🎨 **Colorful Output**: Beautiful terminal interface

## 🚀 Quick Start

### Installation
```bash
npm i -g bhailang
```

### Usage

Create a new file (`test.bhai`)

Edit the file with a text editor. You can also try out your code on Bhai Lang PlayGround

```bhai
hi bhai
bol bhai "Hello bhai";
bye bhai
```

### Run
```bash
bhai test.bhai
```

## 📝 Syntax Examples

### Variables & Output
```kudari
ginti naam kar do "Kuldeep"
ginti age kar do 25
bolo "Namaste " add karo naam
```

### Conditions
```kudari
agar age >= 18 to
    bolo "Adult"
warna
    bolo "Minor"
```

### Loops
```kudari
ginti i kar do 1
jab tak i <= 5 to
    bolo i
    ginti i kar do i add karo 1
```

## 🎯 Language Reference

| KudariLang | JavaScript | Description |
|------------|------------|-------------|
| `ginti x kar do 10` | `let x = 10` | Variable declaration |
| `bolo "Hello"` | `console.log("Hello")` | Print statement |
| `add karo` | `+` | Addition |
| `kam karo` | `-` | Subtraction |
| `guna karo` | `*` | Multiplication |
| `bhag karo` | `/` | Division |
| `agar...to` | `if` | Conditional |
| `warna` | `else` | Else statement |
| `jab tak...to` | `while` | Loop |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request