# Contributing to TOON Exchange

Thank you for your interest in contributing to TOON Exchange! This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/toonexchange.git
   cd toonexchange
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Make your changes** and test them locally
6. **Commit your changes** with clear messages
7. **Push to your fork** and create a Pull Request

## 📝 Development Guidelines

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** rules (run `npm run lint`)
- Use **Prettier** for code formatting (if configured)
- Follow the existing code structure and patterns

### Component Structure

- Use functional components with hooks
- Keep components focused and reusable
- Use TypeScript interfaces for props
- Follow the shadcn/ui component patterns

### Styling

- Use **Tailwind CSS** utility classes
- Follow the monochrome-first design philosophy
- Use TOON brand colors strategically:
  - Beige: `#F5E6D3` (`bg-toon-beige`)
  - Navy: `#1B3A5C` (`bg-toon-navy`)
- Use semantic colors for feedback (green for success, red for errors)

### Git Commit Messages

Use clear, descriptive commit messages:

```
feat: Add expand button to JSON input
fix: Resolve dark mode text color issue
docs: Update README with new features
style: Format code with Prettier
refactor: Simplify token calculation logic
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description** of the bug
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Screenshots** (if applicable)
6. **Environment** (browser, OS, Node version)

## 💡 Suggesting Features

Feature suggestions are welcome! Please:

1. Check if the feature already exists or has been suggested
2. Open an issue with the `enhancement` label
3. Describe the feature and its use case
4. Explain why it would be valuable

## 🔧 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** if applicable (we're working on adding tests)
3. **Ensure linting passes**: `npm run lint`
4. **Test your changes** in both light and dark modes
5. **Update CHANGELOG.md** if applicable
6. **Create a PR** with a clear description

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Changes tested locally
- [ ] Dark mode tested
- [ ] Responsive design tested

## 📁 Project Structure

```
toonexchange/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── playground/        # Playground page
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── toon-calculator.tsx
│   └── format-playground.tsx
├── lib/                   # Utility functions
│   ├── llm-pricing.ts    # LLM pricing data
│   └── token-counter.ts  # Token counting logic
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🧪 Testing

Currently, we're working on adding comprehensive tests. For now:

- Test manually in the browser
- Test both light and dark modes
- Test on different screen sizes
- Test with various JSON inputs

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TOON Format Specification](https://github.com/toon-format/toon)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## ❓ Questions?

Feel free to:
- Open an issue for questions
- Contact the maintainer: [Mark Mate](https://linkedin.com/in/mark-mate)

## 🙏 Thank You!

Your contributions make TOON Exchange better for everyone. Thank you for taking the time to contribute!

