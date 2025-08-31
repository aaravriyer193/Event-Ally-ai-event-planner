# Contributing to Event Ally

Thank you for your interest in contributing to Event Ally! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/event-ally.git
   cd event-ally
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code formatting (ESLint configuration)
- Use meaningful variable and function names
- Add comments for complex logic

### Component Guidelines
- Keep components focused and single-purpose
- Use proper TypeScript interfaces for props
- Follow the established design system
- Ensure responsive design for all screen sizes

### File Organization
- Place reusable components in `src/components/`
- Keep page components in `src/pages/`
- Use context providers for shared state in `src/contexts/`
- Maintain the existing folder structure

## 🎨 Design System

### Colors
- Background: `bg-gray-900`
- Cards: `bg-gray-800/50` with `backdrop-blur-sm`
- Primary accent: Orange-500 to Yellow-500 gradient
- Text: White primary, Gray-400 secondary
- Borders: Gray-700

### Components
- Use the existing `Button` component for consistency
- Follow the established spacing system (multiples of 4)
- Maintain the glass morphism aesthetic
- Include hover states and transitions

## 📝 Commit Guidelines

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests

Example:
```
feat: add vendor filtering by location
fix: resolve mobile navigation issue
docs: update installation instructions
```

## 🧪 Testing

- Test your changes on different screen sizes
- Verify that all existing functionality still works
- Check that the design remains consistent
- Test user flows end-to-end

## 📋 Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub with:
   - Clear title and description
   - Screenshots for UI changes
   - List of changes made
   - Any breaking changes noted

## 🐛 Bug Reports

When reporting bugs, please include:
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and device information
- Screenshots if applicable

## 💡 Feature Requests

For new features:
- Describe the problem you're trying to solve
- Explain your proposed solution
- Consider how it fits with the existing design
- Provide mockups or examples if helpful

## 📞 Questions?

Feel free to open an issue for any questions about contributing or the codebase.

Thank you for helping make Event Ally better! 🎉