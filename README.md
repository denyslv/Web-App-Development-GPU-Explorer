# GPU Explorer

A modern web app for browsing, comparing, and managing GPU collections, built with **Node.js**, **Express**, and **Handlebars**.
[Web App Link](https://wad-ca1-dl.onrender.com/)

## Features
- **User Authentication**: Sign up, log in, and log out using cookie-based session handling.
- **Protected Routes**: Dashboard, category pages, compare page, and about page are accessible only to logged-in users.
- **Default Read-Only Dataset**: Ships with built-in GPU categories that all users can view but not edit.
- **User-Owned Data**: Each user can create and manage their own categories and GPUs independently.
- **GPU Comparison Page**: Compare any two accessible GPUs side by side in a structured table.
- **Visual Spec Charts**: Numeric GPU specs are displayed with compact bar charts for quick comparison.
- **Search and Sort**: Filter categories by name and sort by average compute performance.

## Technologies Used
- [Node.js](https://nodejs.org/) - JavaScript runtime for server-side development.
- [Express](https://expressjs.com/) - Fast web framework for routing and middleware.
- [Express Handlebars](https://www.npmjs.com/package/express-handlebars) - Templating engine for dynamic server-rendered views.
- [LowDB](https://github.com/typicode/lowdb) - Lightweight JSON-based database storage.
- [Chart.js](https://www.chartjs.org/) - Charting library for GPU spec visualizations.
- [Fomantic UI](https://fomantic-ui.com/) - UI framework for clean, responsive components.

## How to Run
1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the app with `npm start`.
4. Open `http://localhost:3000` in your browser.

## License
MIT License - feel free to use and modify!
