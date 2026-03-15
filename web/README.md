# Stratobater - User Guide

Stratobater is a guitar fretboard and music theory learning app. This guide documents all keyboard shortcuts, mouse interactions, and accessibility features.

## Table of Contents

- [Getting Started](#getting-started)
- [Fretboard Visualizer](#fretboard-visualizer)
- [DualModeSelector Modals](#dualmodeselector-modals)
- [Ear Trainer](#ear-trainer)
- [Navigation](#navigation)
- [Accessibility Features](#accessibility-features)

---

## Getting Started

Open the app in your browser. You'll see a navigation menu with two options:
- **Fretboard Visualizer** - Interactive fretboard for music theory visualization
- **Ear Trainer** - Interval training with audio playback

The app uses a dark theme optimized for practice sessions.

---

## Fretboard Visualizer

The fretboard visualizer displays scale notes across all strings, with various customization options.

### Display Elements

- **String Labels** (left side): Shows the open note for each string (lowercase 'e' for high E string)
- **Fret Numbers** (bottom): Displays fret numbers on specific frets (1, 3, 5, 7, 9, 12, 15, 17, 19, 21)
- **Dot Markers** on the fretboard:
  - **Red circles**: Root notes of the scale
  - **Blue triangles**: Triad notes (3rd and 5th scale degrees)
  - **Gray circles**: Other scale notes

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `K` | Open/close Key selection modal |
| `S` | Open/close Scale selection modal |
| `←` / `→` | Cycle through keys (right = next, left = previous) |
| `[` / `]` | Cycle through scales (right = next, left = previous) |
| `R` | Toggle root note highlighting on/off |
| `T` | Toggle triad note highlighting on/off |
| `L` | Cycle through label modes (Note names → Scale degrees → Hidden) |

---

## DualModeSelector Modals

The Key and Scale modals provide two modes: **Selection Mode** and **Edit Mode**.

### Selection Mode

Used for quickly selecting the current key or scale.

#### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate through visible items |
| `Space` | Toggle to Edit Mode |
| `Enter` | Select current item and close modal |
| `R` | Reset to defaults |
| `Esc` | Close modal |

#### Mouse Interactions

- **Click item**: Select and close modal
- **Click backdrop**: Close modal
- **Click edit icon**: Switch to Edit Mode

### Edit Mode

Used to customize which keys/scales are shown and their order.

#### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate through all items |
| `Enter` | Toggle visibility of current item |
| `Space` | Toggle to Selection Mode |
| `Cmd`/`Ctrl` + `↑` | Move item up in list |
| `Cmd`/`Ctrl` + `↓` | Move item down in list |
| `Cmd`/`Ctrl` + `←` | Move item left (same as up) |
| `Cmd`/`Ctrl` + `→` | Move item right (same as down) |
| `R` | Reset to defaults |
| `Esc` | Close modal |

#### Mouse Interactions

- **Click item**: Focus on item
- **Click eye icon**: Toggle item visibility
- **Drag handle**: Reorder items by dragging
- **Click backdrop**: Close modal
- **Click close button (X)**: Close modal
- **Click reset button**: Restore defaults

### Edit Mode Features

- **Visibility Toggle**: Show or hide specific keys/scales from the selection list
- **Reordering**: Drag items or use keyboard shortcuts to change their order (affects cycling behavior)
- **Reset Button**: Return to the default key/scale list and ordering

---

## Ear Trainer

The Ear Trainer module teaches interval recognition through audio playback.

### Getting Started

1. Click the **"Start Audio Engine"** button to initialize audio
2. Toggle **"Drive Mode"** for hands-free continuous practice

### Mouse Interactions

| Control | Action |
|---------|--------|
| **Start Audio Engine** button | Initialize the audio engine (required before playback) |
| **Drive Mode** checkbox | Toggle continuous interval loop |
| **Visibility toggle in modals** | Show/hide intervals from the selection list |

### Drive Mode Behavior

When enabled (checked):
1. **Wakes your screen** (prevents sleep during practice)
2. **Plays interval questions**: Root note → interval note
3. **Waits 4 seconds** for you to identify the interval
4. **Plays the answer**: Both notes together plus voice announcement
5. **Waits 2 seconds** then repeats with a new interval

### Display Information

While Drive Mode is active:
- **Interval shorthand**: Shows the interval being played (e.g., "3M")
- **Full name**: Shows the interval name (e.g., "Major Third")
- **Note progression**: Shows root → target note (e.g., "C → E")

---

## Navigation

The app header provides navigation between the two main features.

### Mouse Interactions

- **Menu Button** (top-right): Opens/closes the navigation menu
- **Menu Items**: Click to switch between Fretboard Visualizer and Ear Trainer
- **Click Outside Menu**: Closes the navigation menu

### Currently Selected App

The current app is highlighted with reduced opacity and cannot be clicked.

---

## Accessibility Features

Stratobater includes several accessibility features to support keyboard users and screen readers:

### Keyboard Navigation

- **Full keyboard support**: All interactions can be performed without a mouse
- **Focus management**: Automatic focus handling when modals open
- **Auto-scroll**: When navigating long lists with arrow keys, the list scrolls to keep the focused item visible

### ARIA Support

- **Modal dialogs**: Proper `role="dialog"` and `aria-modal="true"` attributes
- **Button labels**: All buttons have `aria-label` attributes for screen readers
- **Hidden labels**: When note labels are hidden, note names are available via aria-label/title attributes

### Visual Aids

- **Focus indicators**: Clear outline (ring) on focused items
- **Mode indicators**: Visual distinction between Selection Mode and Edit Mode
- **Footer hints**: Keyboard shortcuts displayed at the bottom of modals
- **Status indicators**: Visual feedback for active states (e.g., Drive Mode "Active" pulse)

### Auto-Scroll Details

The DualModeSelector includes smart auto-scrolling:
- Only scrolls when the focused item (including its focus outline) is not fully visible
- Uses different scroll positions depending on navigation direction
- Smooth scrolling with `behavior: "smooth"` for better UX

---

## Tips for Effective Practice

1. **Fretboard Visualization**:
   - Use `R` and `T` to show roots and triads, revealing chord shapes
   - Use `L` to switch between note names and scale degrees
   - Cycle through keys with `←/→` to see how shapes shift across the fretboard

2. **Key/Scale Management**:
   - Hide keys/scales you don't practice using Edit Mode
   - Reorder items to put frequently used ones front for faster cycling

3. **Ear Training**:
   - Use Drive Mode for hands-free practice while holding your instrument
   - The audio plays intervals melodically (root then note) then harmonically (together)
   - Voice announcements help reinforce interval names through multiple senses

4. **Navigation**:
   - `K` and `S` are the fastest ways to change key/scale
   - Use keyboard shortcuts exclusively for a mouse-free practice experience

---

## Technical Details

- Built with React 19, TypeScript, and Tailwind CSS v4
- Uses Tonal.js for music theory calculations
- Uses Tone.js for audio playback
- Uses Web Speech API for voice announcements in Ear Trainer
- Uses Wake Lock API to prevent screen sleep during Drive Mode

For developers, see the parent `CLAUDE.md` file for architecture and development documentation.
