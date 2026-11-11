# Pocket Expense Tracker

A small TypeScript, React, and Vite expense tracker built to practice unit and
component testing with Vitest and React Testing Library. Expenses are saved in
the browser's local storage.

## Run locally

```sh
npm install
npm run dev
```

## Tests and checks

```sh
npm test              # Vitest watch mode
npm run test:run      # Run the suite once
npm run test:ui       # Open the Vitest UI
npm run test:coverage # Run tests and print a coverage report
npm run build         # Type-check and create a production build
```

Test files live next to their feature code in `__tests__` folders. The suite
covers pure utility functions, component rendering and interaction, and custom
hooks. Tests use an in-memory DOM and do not make network requests.
