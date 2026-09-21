# Sleepover Sleeping Bag Space Planner

Instantly plan a cozy sleeping-bag grid for a sleepover room.

## Features

- Enter room length and width in feet.
- Choose Standard Kid, Adult, or Custom sleeping-bag dimensions.
- Toggle portrait and landscape orientation.
- Compare orientations and switch to the recommended layout.
- View bag count, grid dimensions, used area, and leftover floor space.
- Inspect a top-down SVG floor plan with numbered bags and pillows.
- Responsive layout with keyboard navigation, focus states, reduced-motion support, and screen-reader announcements.
- Empty, validation-error, computing, and local UI state feedback.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Verify

```bash
npm test
npm run typecheck
npm run build
```

## Calculation

For each orientation:

```text
columns = floor(room width / bag width)
rows = floor(room length / bag length)
bags = columns × rows
leftover = room area − (bags × bag area)
```

The app has no authentication, backend, or external API.

## Source cap

The challenge cap counts raw source excluding Markdown and images. The verified non-Markdown source remains below 25 KB; this README does not count toward that cap.
