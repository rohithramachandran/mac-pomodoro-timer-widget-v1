# Pomodoro Timer Widget

A beautiful, minimalist floating macOS widget for Pomodoro productivity. This app stays on top of your windows, allowing you to track your focus sessions without losing screen real estate.

![Pomodoro Timer](https://github.com/user-attachments/assets/placeholder-image.png)

## Features

- **Floating Widget**: Always stays on top of other applications, even in full-screen mode.
- **Draggable & Resizable**: Move it anywhere on your screen and drag the edges to scale the UI perfectly using responsive design.
- **4 Customizable Slots**: Switch between four different timer presets (e.g., Work, Short Break, Long Break).
- **Edit Names & Times**: Click on the title to rename a slot, or click on the timer to change the duration.
- **Session Persistence**: Your presets, active slot, and remaining time are saved automatically and persist even after closing the app.
- **Audio Alerts**: Plays a distinct double-beep notification when a timer completes.
- **Minimalist Aesthetic**: Features a clean, transparent design inspired by modern macOS widgets.

## Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/)
- **Frontend**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS with responsive `vmin` units.

## Development

To run the application in development mode:

```bash
# Install dependencies
npm install

# Run in development
npm run dev
```

## Building the App

To package the application into a macOS `.dmg` file:

```bash
npm run build
```

The output will be located in the `dist/` directory.

## Installation

1. Download the latest `pomodoro-timer-x.x.x-arm64.dmg` from the releases or build it yourself.
2. Open the DMG and drag the **Pomodoro Timer** to your **Applications** folder.
3. Launch the app. (Note: Since this is self-signed, you may need to right-click and select "Open" for the first launch).

## License

MIT
