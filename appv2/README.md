# Zero Rush v2 — Game Design Document

> **Status**: Design Phase | **Version**: 2.0-draft | **Last Updated**: January 2026

## TL;DR

**Zero Rush** is a mathematical puzzle game where players arrange operation cards (+, -, ×, ÷) to find both the **lowest** (dusk) and **highest** (dawn) positive whole numbers achievable from a dealt hand.

**Key v2 Goals:**

- Production-ready PWA with offline support
- Daily puzzles (Wordle-style) at multiple difficulty levels
- A/B testing infrastructure for game balance decisions
- Multiplayer rooms for competitive play
- Rich analytics for understanding player behavior

> **Naming Note**: The game may be renamed to **"Dusk & Dawn"** in the future to move away from the zero-centric naming if zero-mode becomes optional. For now, keeping "Zero Rush" during testing phase.

---

## Table of Contents

1. [How the Game Works](#how-the-game-works)
2. [Difficulty Levels](#difficulty-levels)
3. [Puzzle Quality System](#puzzle-quality-system)
4. [Daily Puzzles](#daily-puzzles)
5. [Challenger Mode](#challenger-mode)
6. [Multiplayer Mode](#multiplayer-mode)
7. [Settings & Progression](#settings--progression)
8. [Technical Architecture](#technical-architecture)
9. [Data & Analytics](#data--analytics)
10. [Open Questions](#open-questions)
11. [Implementation Notes](#implementation-notes)

---

## How the Game Works

### The Basics

1. **Cards**: Each card has an operator (+, -, ×, ÷) and a number (e.g., `+3`, `÷4`, `-5`, `*7`)
2. **Hand**: Player receives 4-10 cards depending on difficulty
3. **Goal**: Find TWO target numbers:
   - **Dusk** 🔵: The LOWEST achievable positive whole number (including 0)
   - **Dawn** 🟢: The HIGHEST achievable positive whole number
4. **Win Condition**: Find BOTH targets to complete the round

### Evaluation Rules

- **Left-to-right evaluation** (no PEMDAS/operator precedence)
- **First card's operator is ignored** (just the number starts the calculation)
- **Only positive whole numbers count** (0 allowed, negatives and decimals don't count)

### Example

**Hand**: `+1, ÷9, -5, ÷2`

| Arrangement     | Calculation                   | Result         |
| --------------- | ----------------------------- | -------------- |
| `9, +1, ÷2, -5` | 9 → +1 = 10 → ÷2 = 5 → -5 = 0 | 🔵 **Dusk: 0** |
| `9, -5, ÷2, +1` | 9 → -5 = 4 → ÷2 = 2 → +1 = 3  | 🟢 **Dawn: 3** |

### Why Left-to-Right?

Traditional math uses PEMDAS (multiplication before addition, etc.), but OverZero evaluates strictly left-to-right. This:

- Makes mental math tractable without pen & paper
- Creates unique puzzle patterns different from standard math
- Keeps the game accessible while still challenging

---

## Difficulty Levels

| Level          | Cards | Zero Guarantee   | Notes                      |
| -------------- | ----- | ---------------- | -------------------------- |
| **Easy**       | 5     | ✅ Yes (default) | For newcomers, casual play |
| **Medium**     | 6-7   | ⚙️ Configurable  | Balanced challenge         |
| **Hard**       | 8     | ⚙️ Configurable  | For experienced players    |
| **Challenger** | 10    | ❌ No            | Must be unlocked; brutal   |

### Card Count Considerations

Permutation count grows factorially:

- 5 cards: 120 permutations
- 6 cards: 720 permutations
- 8 cards: 40,320 permutations
- 10 cards: 3,628,800 permutations

This affects both puzzle generation time and difficulty. Performance testing needed for 8+ cards.

---

## Puzzle Quality System

### Quality Indicators

A puzzle's quality is determined by two metrics:

1. **has_zero**: The lowest achievable value (dusk) is exactly 0
2. **is_good**: The highest value (dawn) has only 1 permutation that achieves it

### Visual Indicators

| Border    | Background | Meaning                           |
| --------- | ---------- | --------------------------------- |
| 🟢 Green  | 🟢 Green   | Perfect: `has_zero` AND `is_good` |
| 🟢 Green  | 🟣 Purple  | Has zero but multiple dawn paths  |
| 🟣 Purple | 🟢 Green   | Good puzzle but dusk isn't zero   |
| 🟡 Yellow | 🟣 Purple  | Playable but not ideal            |
| 🔴 Red    | 🔴 Red     | Invalid puzzle (skip)             |

### Why Quality Matters

- **has_zero**: Players can hunt for "zero patterns" (multiply/divide to zero)
- **is_good**: Finding dawn feels satisfying when there's one unique solution

These settings should be **configurable once in settings** and then hidden from the main UI to keep the experience simple.

---

## Daily Puzzles

### Structure

- **One puzzle per difficulty level** (Easy, Medium, Hard)
- Resets at **UTC midnight** (displayed as "GMT" for user-friendliness)
- Same puzzle for all players worldwide
- Pre-generated and curated from a puzzle pool

### Streak Tracking

- Track consecutive days completed
- Streaks are combined across all difficulties
- Lost streaks shown (motivational, not punishing)
- Every 10 streaks, players earn in-game currency 💎
- Players can spend 💎 to save streaks:
  - Only available if exactly 1 day was missed
  - Unlimited uses (costs 💎 each time)
  - **Transparency**: Display shows saves used: "🔥 127 day streak (2 saves)"
  - Pure streaks (0 saves) remain a flex for hardcore players

### Sharing Results

**Text format preferred** (like Wordle), with optional image export.

Example share text:

```
Zero Rush Daily #127 🌅

Easy: ✅ 2 attempts
Medium: ✅ 4 attempts
Hard: ✅ 7 attempts
```

The sharing format should be unique to Zero Rush — not just a Wordle clone.

---

## Challenger Mode

### Unlock Requirements

1. Complete **Timed Hard Mode** in under **5 minutes** (threshold TBD based on real data)
2. All completed games track `started_at` and `completed_at` for analytics

### Re-lock Setting

Optional setting to re-lock Challenger mode after a configurable time:

- Options: 1h, 1d, 3d, 1w, 2w, or custom
- Purpose: Forces players to "stay sharp" to access hardest content
- Disabled by default

### Challenger Differences

- 10 cards (3.6M permutations)
- **No zero guarantee** — dusk could be any positive integer
- No hints available
- Separate leaderboard/stats

---

## Multiplayer Mode

### Room-Based Play

Players create or join rooms with configurable settings:

| Setting     | Options                        |
| ----------- | ------------------------------ |
| Hand size   | 4-10 cards                     |
| Time limit  | 1-10 minutes                   |
| Zero mode   | Guaranteed / Open              |
| Visibility  | Private (invite link) / Public |
| Max players | 2-8                            |
| Max rounds  | 3,5,8, or 10 rounds            |

### Gameplay Flow

1. Host creates room with settings
2. Players join via link or public lobby
3. Same hand dealt to all players simultaneously
4. Timer starts — players think privately on their own screen
5. When timer ends (or all submit), answers are revealed simultaneously
6. Points awarded, next round begins

### Matchmaking Ideas

- **Quick match**: Random public room
- **Challenge friend**: Private invite link
- **Pop-up invites**: Online players get notified of open rooms

### Scoring System

**NOT speed-based** — everyone has the same time to think, then simultaneous reveal.

| Result                   | Points |
| ------------------------ | ------ |
| Found neither            | 0      |
| Found dusk OR dawn       | 1      |
| Found BOTH dusk AND dawn | 3      |

This rewards completeness over partial solutions. Finding both is 3x better than finding one.

---

## Settings & Progression

### User Settings (Configure Once)

| Setting            | Options               | Default                          |
| ------------------ | --------------------- | -------------------------------- |
| Zero guarantee     | On / Off              | On for Easy/Medium, Off for Hard |
| Sound effects      | On / Off              | On                               |
| Haptic feedback    | On / Off              | On                               |
| Theme              | Light / Dark / System | System                           |
| Re-lock Challenger | Never / Custom time   | Never                            |

### Player Profile Display

Show current settings clearly so players understand their configuration:

- Difficulty level preference
- Zero mode status
- Challenger unlock status
- Current streaks

### Progression Tracking

- Total games completed
- Win rate per difficulty
- Average solve time
- Best times
- Puzzles starred/favorited

---

## Technical Architecture

### Stack

- **Runtime/Package Manager**: Bun (`bun --bun`)
- **Frontend**: React (PWA)
- **Backend**: Convex (realtime database)
- **Auth**: Convex (OAuth or simple username)
- **Hosting**: Vercel and Convex
- **User Tracking**: PostHog

### PWA Requirements

- **Offline play**: Basic single-player mode without internet
- **Sync on reconnect**: Queue completed games, sync when online
- **Service worker**: Cache app shell and assets

### Data Flow

```
[Local State] ←→ [IndexedDB] ←→ [Sync Queue] ←→ [Convex Backend]
```

### Puzzle Generation

- **Daily puzzles**: Pre-generated, stored in database, fetched on load
- **Practice mode**: Generated client-side, tracked locally
- **Canonical signature**: For deduplication and sharing
- **Player submissions**: Players can submit puzzles for future daily puzzles. they will get cited for this. They can get 💎 if their submission is accepted. (not too sure about this one yet btw.)

---

## Data & Analytics

### Per-Game Tracking

Every completed game records:

```typescript
interface GameRecord {
  id: string;
  puzzle_signature: string; // Canonical form
  difficulty: "easy" | "medium" | "hard" | "challenger";
  mode: "daily" | "practice" | "multiplayer";

  started_at: timestamp;
  completed_at: timestamp;
  duration_ms: number;

  attempts: number;
  hints_used: number;
  dusk_found_at?: timestamp;
  dawn_found_at?: timestamp;

  settings: {
    zero_guarantee: boolean;
  };

  // For A/B testing
  experiment_group?: string;
  experiment_variant?: string;
}
```

### A/B Testing Infrastructure

Variables to test:

- `has_zero` on/off per difficulty level
- Card count per difficulty (4 vs 5 for Easy)
- Odd-numbers for difficulty progression (5-7-9-11 card?)
- Hint system variations
- UI layouts
- Onboarding flows

Metrics to measure:

- Time to solve (efficiency)
- Completion rate (accessibility)
- Retry rate (engagement)
- Drop-off point (where do people quit?)
- Return rate (retention)

### Puzzle Analytics

Track per-puzzle:

- Solve rate
- Average time
- Average attempts
- Star/favorite rate
- Share rate

This helps curate better daily puzzles.

---

## Open Questions

### Gameplay

1. **Card count for Easy**: 4 or 5 cards?

- needs A/B testing

2. **Hint penalties**: Should hints affect stats/streaks?

- No they should cost 💎

3. **Multiplayer rounds**: Best of 3? Best of 5? Continuous?

- Best of max round set in the room

### Design

1. **Onboarding**: Interactive tutorial or text explanation?

- Maybe both? with interactive coming first

2. **Share format**: How to make it unique vs Wordle clones?
3. **Monetization**: What premium features for "whales"? (skins, bragging rights, etc.)

- 10 gems can get you a skin for example.

4. **UI Theme Direction**: ✅ DECIDED

- **Dark mode primary** using **shadcn/ui with amber theme**
- Setup URL: `https://ui.shadcn.com/create?iconLibrary=hugeicons&base=base&style=nova&baseColor=gray&theme=amber&font=raleway&menuAccent=bold`
- Dusk 🔵: Sky-400 (`#38bdf8`) dark / Blue-700 (`#1d4ed8`) light
- Dawn 🟡: Amber-400 (`#fbbf24`) dark / Amber-600 (`#d97706`) light
- Both dark and light modes supported

---

## Resolved Questions

These were open questions that have been decided:

| Question             | Decision                                                                    |
| -------------------- | --------------------------------------------------------------------------- |
| Game name            | "Zero Rush" for now, may rename to "Dusk & Dawn" later                      |
| PWA sync scope       | Sync everything: games, settings, starred puzzles, challenger progress      |
| Daily puzzle offline | Does NOT work offline (framed as multiplayer mode)                          |
| User accounts        | OAuth via Convex                                                            |
| Multiplayer scoring  | 0 pts (neither), 1 pt (one), 3 pts (both) — not speed-based                 |
| Zero guarantee ramp  | On for Easy, On for Medium, Off for Hard, Off for Challenger (configurable) |

---

## Implementation Notes

> Internal notes for development team / AI agents

### Convex Integration

- Use Convex realtime database for multiplayer rooms
- Convex handles OAuth authentication
- Mutations for game state changes
- Queries for leaderboards and room listings
- Subscriptions for live room updates

### Daily Puzzles

- Pre-generated and curated (NOT seed-based for production)
- Stored in database, fetched on load
- **Requires online connection** — treated as multiplayer mode
- Offline users can replay past dailies or play random puzzles

### Canonical Puzzle Signature

Sort cards by operator, then number:

**Operator order**: `+` < `-` < `*` < `÷`

**Example**:

- Input: `÷4, *2, +3, -5`
- Canonical: `+3,-5,*2,÷4`

**Implementation notes**:

- Keep operator+number together as unit
- Sort numbers numerically (not lexicographically)
- No duplicate cards (cards drawn without replacement)

### Performance Concerns

- 10 cards = 3.6M permutations
- May need web worker for puzzle generation
- Consider caching/memoization for common patterns
- Profile `generateAnswers()` with 8+ cards

---

## Version History

| Version   | Date     | Changes                    |
| --------- | -------- | -------------------------- |
| 2.0-draft | Jan 2026 | Initial v2 design document |
| 1.0       | 2024     | Original MVP (app folder)  |
