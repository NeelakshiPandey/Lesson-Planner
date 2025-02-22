# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# 📌 AI-Powered Lesson Planner

🚀 **An AI-powered web app that helps educators generate structured lesson plans using the Google Gemini API.**  
✅ Features a **dummy login system**, **AI-generated lesson plans**, **PDF export**, **dark mode**, and **local storage support**.

---

## **📌 Features**
- 🏫 **Dummy Login Page** – Use **demouser/demopass** to log in.
- 📝 **Lesson Plan Form** – Structured input fields for lesson creation.
- 🤖 **AI-Powered Lesson Generation** – Uses **Google Gemini API** for structured lesson content.
- 🖊️ **Editable Lesson Content** – Users can manually modify AI-generated text.
- 📄 **Download as PDF** – Saves the plan in **pre-defined structured format**.
- 🌙 **Dark Mode Toggle** – Switch between light and dark themes.
- 💾 **Local Storage Support** – Saves lesson plans even after a page refresh.

---

## **📌 Tech Stack**
| Technology  | Purpose |
|------------|---------|
| **React.js (Vite + TypeScript)** | Frontend framework |
| **ShadCN UI + TailwindCSS** | UI components and styling |
| **Google Gemini API** | AI-powered content generation |
| **react-router-dom** | Client-side routing |
| **jsPDF & jspdf-autotable** | PDF export |
| **react-to-print** | Alternative PDF generation |

---

## **📌 Installation & Setup**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/yourusername/lesson-planner.git
cd lesson-planner
