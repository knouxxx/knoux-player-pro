# KNOUX Player X™ - Developer Guide

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Core Components](#core-components)
5. [Plugin Development](#plugin-development)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

KNOUX Player X™ is a modern, cinematic media player built with:

- **Frontend**: React 18 + TypeScript + Redux Toolkit
- **Backend**: Electron 28 + Node.js
- **UI Framework**: Framer Motion + Neon Glass Design
- **Media Engine**: FFmpeg + WebCodecs + Hardware Acceleration
- **Build Tools**: Webpack 5 + Electron Forge

## 🏗️ Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────┐
│                 Main Process (Electron)          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │   Window    │  │    IPC      │  │ Native  │ │
│  │  Manager    │  │   System    │  │ Bridges │ │
│  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────┐
│              Renderer Process (React)            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │     UI      │  │   State     │  │  Core   │ │
│  │ Components  │  │ Management  │  │ Engine  │ │
│  └─────────────┘  └─────────────┘  └─────────┘ │
└─────────────────────────────────────────────────┘
```

### Directory Structure
```
knoux-player-x/
├── desktop/                 # Electron main process
│   ├── main/               # Main process code
│   ├── preload/            # Preload scripts
│   └── renderer/           # Renderer entry point
├── src/                    # Source code
│   ├── core/               # Core media engine
│   ├── ui/                 # React components
│   ├── state/              # Redux state management
│   └── services/           # Business logic services
├── plugins/                # Plugin system
└── tests/                  # Test suites
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/knuux7-ctrl/KNOX-Player-X-.git
cd KNOX-Player-X-

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run make
```

### Development Commands
```bash
# Development
npm run dev              # Start dev server
npm run electron:dev     # Start Electron in dev mode

# Building
npm run build            # Build renderer
npm run package          # Package app
npm run make             # Create installers

# Testing
npm test                 # Run all tests
npm run test:unit        # Unit tests
npm run test:e2e         # E2E tests

# Code Quality
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript check
```

## 🎮 Core Components

### Media Engine
The heart of KNOUX Player X™. Supports multiple playback engines:

```typescript
import { MediaEngine, PlaybackEngine } from '../core/engine/MediaEngine';

const engine = new MediaEngine();

// Load media with auto-detection
await engine.load('video.mkv', {
  startTime: 0,
  volume: 0.8,
  playbackRate: 1.0
});

// Control playback
await engine.play();
engine.pause();
engine.seek(120); // 2 minutes

// Get statistics
const stats = engine.getStats();
console.log(`FPS: ${stats.fps}, Buffer: ${stats.bufferLevel}%`);
```

### Neon UI Components
Modern glass-morphism components:

```tsx
import { NeonButton, NeonPanel, NeonSlider } from '../ui/components/neon';

const PlayerControls = () => {
  return (
    <NeonPanel className="player-controls">
      <NeonButton
        variant="primary"
        onClick={() => /* play/pause */}
      >
        ▶
      </NeonButton>

      <NeonSlider
        min={0}
        max={100}
        value={volume}
        onChange={(value) => setVolume(value)}
      />
    </NeonPanel>
  );
};
```

### State Management
Redux Toolkit with TypeScript:

```typescript
// Slice example
const playbackSlice = createSlice({
  name: 'playback',
  initialState,
  reducers: {
    play: (state) => {
      state.status = PlayerStatus.PLAYING;
    },
    pause: (state) => {
      state.status = PlayerStatus.PAUSED;
    }
  }
});

// Selector example
export const selectIsPlaying = (state: RootState) =>
  state.playback.status === PlayerStatus.PLAYING;
```

## 🔌 Plugin Development

### Creating a Plugin
```typescript
// plugins/example-plugin/index.ts
import { KnouxPlugin, PluginManifest } from '../plugin-sdk';

const manifest: PluginManifest = {
  id: 'com.example.my-plugin',
  name: 'My Awesome Plugin',
  version: '1.0.0',
  author: 'Your Name',
  description: 'Adds awesome features',
  entry: './index.js',
  permissions: ['media', 'ui', 'settings']
};

class MyPlugin extends KnouxPlugin {
  async onLoad() {
    console.log('Plugin loaded!');

    // Register custom UI
    this.registerComponent('settings-panel', MySettingsPanel);

    // Hook into media events
    this.onMediaPlay(() => {
      console.log('Media started playing');
    });
  }

  async onUnload() {
    console.log('Plugin unloaded');
  }
}

export default MyPlugin;
```

### Plugin API
Available APIs for plugins:

| API | Description | Example |
|-----|-------------|---------|
| `media` | Control playback | `plugin.media.play()` |
| `ui` | UI manipulation | `plugin.ui.showToast()` |
| `storage` | Persistent storage | `plugin.storage.set()` |
| `settings` | Access settings | `plugin.settings.get()` |
| `network` | HTTP requests | `plugin.network.fetch()` |

## 🧪 Testing

### Unit Tests
```typescript
// tests/unit/MediaEngine.test.ts
describe('MediaEngine', () => {
  it('should load video file', async () => {
    const engine = new MediaEngine();
    await engine.load('test.mp4');
    // Assertions...
  });
});
```

### Integration Tests
```typescript
// tests/integration/player.test.ts
describe('Player Integration', () => {
  it('should play, pause, and seek', async () => {
    const player = new Player();
    await player.load('test.mp4');
    await player.play();
    await player.pause();
    player.seek(30);
    // Assertions...
  });
});
```

### E2E Tests
```typescript
// tests/e2e/basic.test.ts
describe('Application E2E', () => {
  it('should open and show main window', async () => {
    const app = await startApp();
    const window = await app.getWindow();

    expect(await window.getTitle()).toBe('KNOUX Player X™');
    expect(await window.isVisible()).toBe(true);
  });
});
```

## 🚢 Deployment

### Building Installers
```bash
# Windows (NSIS)
npm run make:windows

# macOS (DMG)
npm run make:mac

# Linux (AppImage)
npm run make:linux
```

### Release Process
1. Update version in `package.json`
2. Update changelog in `CHANGELOG.md`
3. Create release commit: `git commit -m "v1.0.0"`
4. Create tag: `git tag v1.0.0`
5. Push: `git push origin main --tags`
6. Build release assets
7. Create GitHub release

### Continuous Integration
GitHub Actions workflow included:
- **Test**: Runs on every push
- **Build**: Builds all platforms on tags
- **Release**: Creates GitHub release

## 🔧 Troubleshooting

### Common Issues

#### 1. FFmpeg not loading
```bash
# Check FFmpeg installation
npm list @ffmpeg/ffmpeg

# Clear npm cache
npm cache clean --force
```

#### 2. Native modules not compiling
```bash
# Rebuild native modules
npm rebuild

# Check Node.js version
node --version # Should be 18+
```

#### 3. TypeScript errors
```bash
# Check TypeScript
npm run type-check

# Update types
npm update @types/node @types/react
```

#### 4. Build failures
```bash
# Clean build
rm -rf node_modules dist out
npm install
npm run build
```

### Debugging

#### Renderer Process
```javascript
// Open DevTools in Electron
process.env.ELECTRON_DEBUG = true;
```

#### Main Process
```bash
# Run with debug flag
npm run dev -- --inspect=5858
```

### Performance Optimization
1. Enable hardware acceleration in settings
2. Use appropriate video codec (H.264 for compatibility)
3. Adjust buffer size based on network
4. Close unnecessary plugins

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/knuux7-ctrl/KNOX-Player-X-/issues)
- **Email**: info@knoux.tech
- **Documentation**: [docs.knoux.tech](https://docs.knoux.tech)

## 📄 License
Proprietary - © 2023 Sadek Elgazar (KNOUX)
