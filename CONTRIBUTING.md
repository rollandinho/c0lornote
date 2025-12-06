# Contributing to c0lornote

Thank you for your interest in contributing to c0lornote! This is a social hub made by the people, for the people, and we welcome contributions from everyone.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node.js version)

### Suggesting Features

We love new ideas! To suggest a feature:
- Create an issue with the "feature request" label
- Describe the feature and its benefits
- Explain use cases
- Include mockups or examples if possible

### Pull Requests

1. **Fork the repository**
   ```bash
   git fork https://github.com/rollandinho/c0lornote.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Comment complex logic
   - Update documentation as needed

4. **Test your changes**
   - Ensure the backend builds: `npm start`
   - Ensure the frontend builds: `cd client && npm run build`
   - Test functionality manually
   - Run the API tests: `node test-api.js` (with server running)

5. **Commit your changes**
   ```bash
   git commit -m "Add feature: your feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes

## 📋 Code Style Guidelines

### JavaScript/React
- Use ES6+ features
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Backend
- Follow REST API conventions
- Validate all inputs
- Handle errors appropriately
- Use async/await for asynchronous code
- Secure endpoints that require authentication

### CSS
- Use semantic class names
- Keep styles organized
- Use CSS variables for colors when possible
- Ensure responsive design

## 🧪 Testing

- Test all new features thoroughly
- Test edge cases
- Ensure backward compatibility
- Test on multiple browsers (for frontend changes)

## 📝 Documentation

- Update README.md if adding new features
- Update API documentation for new endpoints
- Add code comments for complex logic
- Update setup instructions if needed

## 💡 Development Tips

- Start MongoDB before running the backend
- Use `npm run dev` for development with auto-reload
- Check browser console for frontend errors
- Check server logs for backend errors
- Use meaningful commit messages

## 🌟 Recognition

All contributors will be recognized in our README and release notes.

## ❓ Questions?

Feel free to create an issue with the "question" label if you need help or clarification.

Thank you for making c0lornote better! 🎨
