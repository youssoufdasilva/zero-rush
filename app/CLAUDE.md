# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zero Rush (package name: `over-zero`) is a React-based mathematical puzzle game where players arrange arithmetic operation cards (+, -, ×, ÷) to find the lowest ("sunset") and highest ("sunrise") positive whole numbers achievable from a given hand.

## Commands

### Development (Local)
```bash
cd app
npm install
npm start          # Runs on http://localhost:3000
npm test           # Interactive watch mode
npm test -- --testPathPattern="Game" --watch=false  # Run specific test file
npm run build      # Production build
```

### Docker
```bash
make build         # Build Docker image
make start         # Start container (port 43002)
make logs          # View container logs
make stop          # Stop container
make down          # Remove container
```

## Architecture

### State Management
- **App.js**: Central state manager using React hooks (useState, useEffect, useCallback)
- Game state flows: welcome screen → puzzle confirmation → active game
- Maintains search history (max 4 puzzles) for back navigation

### Component Structure
```
src/
├── App.js                    # Main state manager, puzzle generation orchestrator
├── Components/
│   ├── WelcomeScreen.js      # Home/intro with puzzle search
│   ├── ConfirmPuzzle.js      # Puzzle preview with quality indicators
│   ├── TopBar.js             # Game header with goals/hints
│   ├── HowTo.js              # Rules documentation
│   └── Game/
│       ├── Game.js           # Main gameplay (card selection, attempts, scoring)
│       └── GameHelpers.js    # Core puzzle/solution algorithms
```

### Game Logic (GameHelpers.js)
- `generatePuzzle()`: Creates random hand of 4-6 cards with format `[operator][number]`
- `generateAnswers()`: Finds all valid solutions via permutation enumeration
- `solvePuzzle()`: Evaluates expressions left-to-right (first card's operator ignored)
- Quality metric: `is_good` when permutations/unique-answers ratio ≤ 5

### Styling
- Tailwind CSS 2 via CDN (loaded in public/index.html)
- Component-specific CSS where needed
