---
layout: page
title: Language Support
description: "Osmynt supports syntax highlighting for 200+ programming languages with preserved formatting and encoding."
---

# Language Support

Osmynt provides comprehensive language support with syntax highlighting for 200+ programming languages, preserved formatting, and cross-platform compatibility.

## Supported Languages

### Popular Programming Languages

- **JavaScript/TypeScript** - Full ES6+ support with JSX/TSX
- **Python** - All versions including 3.x with type hints
- **Java** - Java 8+ with modern features
- **C/C++** - C99, C++11, C++14, C++17, C++20
- **C#** - .NET Framework and .NET Core
- **Go** - Go 1.x with modules support
- **Rust** - Modern Rust with async/await
- **PHP** - PHP 7+ with modern syntax
- **Ruby** - Ruby 2.x and 3.x
- **Swift** - iOS and macOS development
- **Kotlin** - Android and JVM development
- **Scala** - Functional programming on JVM

### Web Technologies

- **HTML** - HTML5 with semantic elements
- **CSS** - CSS3 with modern features
- **SCSS/Sass** - CSS preprocessing
- **Less** - CSS preprocessing
- **Stylus** - CSS preprocessing
- **Vue.js** - Single File Components
- **React** - JSX and modern React
- **Angular** - TypeScript and templates
- **Svelte** - Component-based framework

### Data Formats

- **JSON** - Structured data format
- **YAML** - Configuration and data serialization
- **XML** - Markup language
- **TOML** - Configuration format
- **INI** - Configuration format
- **CSV** - Comma-separated values
- **Markdown** - Documentation format

### Database Languages

- **SQL** - Standard SQL queries
- **PL/SQL** - Oracle database programming
- **T-SQL** - Microsoft SQL Server
- **MySQL** - MySQL-specific SQL
- **PostgreSQL** - PostgreSQL-specific SQL
- **NoSQL** - MongoDB, CouchDB queries

### Configuration Languages

- **Docker** - Dockerfile syntax
- **Kubernetes** - YAML manifests
- **Terraform** - Infrastructure as Code
- **Ansible** - Automation playbooks
- **Git** - Git configuration and hooks
- **Bash/Shell** - Shell scripting
- **PowerShell** - Windows automation

## Syntax Highlighting Features

### Preserved Formatting

- **Indentation** - Maintains original indentation (spaces/tabs)
- **Line breaks** - Preserves line breaks and empty lines
- **Encoding** - Supports UTF-8, ASCII, and other encodings
- **Line endings** - Handles Windows (CRLF) and Unix (LF) line endings

### Advanced Highlighting

- **Semantic highlighting** - Context-aware syntax highlighting
- **Error highlighting** - Syntax error detection and highlighting
- **Bracket matching** - Matching brackets, braces, and parentheses
- **Comment folding** - Collapsible comment blocks
- **String interpolation** - Template literal highlighting

### Language-Specific Features

#### JavaScript/TypeScript

- **ES6+ features** - Arrow functions, destructuring, modules
- **JSX/TSX** - React component syntax
- **Type annotations** - TypeScript type definitions
- **Async/await** - Asynchronous programming patterns
- **Decorators** - Class and method decorators

#### Python

- **Type hints** - Python 3.5+ type annotations
- **F-strings** - Formatted string literals
- **Async/await** - Asynchronous programming
- **Dataclasses** - Python 3.7+ dataclass syntax
- **Walrus operator** - Python 3.8+ assignment expressions

#### C/C++

- **Modern C++** - C++11, C++14, C++17, C++20 features
- **Templates** - Generic programming
- **RAII** - Resource management patterns
- **Smart pointers** - Modern memory management
- **Concepts** - C++20 concepts

## Cross-Platform Support

### Operating Systems

- **Windows** - Windows 10/11 with WSL support
- **macOS** - macOS 10.15+ (Intel and Apple Silicon)
- **Linux** - Ubuntu, Debian, RHEL, CentOS, and others

### Development Environments

- **VS Code** - Primary development environment
- **VS Code Insiders** - Latest features and updates
- **VSCodium** - Open-source VS Code alternative
- **Theia** - Cloud-based development environment

### File Types

- **Source files** - .js, .ts, .py, .java, .cpp, .cs, .go, .rs, .php, .rb
- **Configuration files** - .json, .yaml, .toml, .ini, .conf
- **Documentation** - .md, .rst, .txt, .adoc
- **Build files** - Dockerfile, Makefile, CMakeLists.txt
- **Data files** - .csv, .xml, .sql, .graphql

## Language Detection

### Automatic Detection

Osmynt automatically detects the language based on:

- **File extension** - Primary detection method
- **File content** - Shebang lines and language signatures
- **VS Code language mode** - Current editor language
- **Project configuration** - .gitattributes and language settings

### Manual Override

You can manually specify the language:

1. **Select your code** in the editor
2. **Right-click** and choose "Share Selected Code"
3. **In the sharing dialog**, select the correct language
4. **Share** with the specified language

## Performance Optimization

### Large Files

- **Chunking** - Large files are automatically chunked
- **Streaming** - Real-time streaming for large code blocks
- **Compression** - Automatic compression for network efficiency
- **Caching** - Local caching for frequently accessed code

### Network Optimization

- **Delta updates** - Only changed portions are transmitted
- **Compression** - Gzip compression for network efficiency
- **Batching** - Multiple operations are batched together
- **Connection pooling** - Efficient connection management

## Troubleshooting Language Support

### Common Issues

#### Incorrect Syntax Highlighting

**Problem**: Code doesn't highlight correctly
**Solution**:
1. Check file extension matches the language
2. Verify VS Code language mode is correct
3. Manually specify language when sharing

#### Encoding Issues

**Problem**: Special characters don't display correctly
**Solution**:
1. Ensure file is saved with UTF-8 encoding
2. Check VS Code encoding settings
3. Verify language supports the character set

#### Performance Issues

**Problem**: Slow highlighting for large files
**Solution**:
1. Break large files into smaller chunks
2. Use appropriate language settings
3. Check VS Code performance settings

### Language-Specific Issues

#### JavaScript/TypeScript

- **JSX not highlighting** - Ensure file has .jsx or .tsx extension
- **Type annotations not working** - Check TypeScript version
- **ES6+ features not recognized** - Update VS Code JavaScript settings

#### Python

- **Indentation errors** - Check tab vs space consistency
- **Type hints not working** - Ensure Python 3.5+ syntax
- **F-strings not highlighting** - Update to Python 3.6+ syntax

#### C/C++

- **Modern C++ not working** - Check C++ standard setting
- **Templates not highlighting** - Verify C++ extension is installed
- **Headers not found** - Check include path settings

## Best Practices

### Code Sharing

- **Use appropriate file extensions** - Helps with automatic detection
- **Include language context** - Mention the language in your share title
- **Share complete functions** - Avoid cutting off in the middle of syntax
- **Use consistent formatting** - Follow language-specific style guides

### Language Selection

- **Choose the right language** - Manual selection when automatic detection fails
- **Consider the audience** - Team members familiar with the language
- **Include context** - Explain language-specific features being used
- **Document language requirements** - Mention version requirements

## Next Steps

Now that you understand language support:

1. **[Learn about code sharing](features/code-sharing)** - Share code with proper syntax highlighting
2. **[Set up team collaboration](features/team-management)** - Work with teams using different languages
3. **[Configure your environment](reference/configuration)** - Customize language settings
4. **[Apply code changes](features/diff-application)** - Use diff application with any language
