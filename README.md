# MoneyTrack 💰

A modern web application for tracking your expenses, built with Vue 3 Composition API, TypeScript, and Feature-Sliced Design architecture.

Live site: https://moneypath-flow.netlify.app

## Features

- ➕ Add expenses with amount, category, description, and date
- 📊 View all expenses in a clean, organized list
- 💵 Track total spending
- 🏷️ Categorize expenses (Food, Transport, Shopping, Bills, etc.)
- 💾 Automatic local storage persistence
- 📱 Responsive design for mobile and desktop

## Tech Stack

- **Vue 3** - Composition API
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **FSD (Feature-Sliced Design)** - Architecture methodology

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── app/              # Application initialization
├── pages/            # Full pages
├── widgets/          # Complex UI blocks
├── features/         # User interactions
│   ├── add-expense/  # Add expense feature
│   └── expense-list/ # Expense list feature
├── entities/         # Business entities
│   └── expense/      # Expense entity
└── shared/           # Reusable components
    └── ui/           # UI components (Button, Input, Card)
```

## License

MIT
