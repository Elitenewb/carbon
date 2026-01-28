# Carbon Cycle Explorer

An interactive educational web app that teaches grade 5 students about the carbon cycle through a story-driven journey and hands-on sandbox mode.

## Features

### Story Mode
Follow "Carby" the carbon atom through 6 interactive chapters:

1. **The Atmosphere** - Learn about CO₂ in the air
2. **Plants and Photosynthesis** - See how plants absorb carbon
3. **Animals and Food** - Understand the food chain transfers carbon
4. **Back to the Ground** - Watch decomposition return carbon to nature
5. **Deep Underground** - Discover how fossil fuels form over millions of years
6. **Energy and Power** - Compare different energy sources and their carbon impact

Each chapter includes:
- Simple, ESL-friendly explanations
- Interactive activities (click, drag, sliders)
- Key facts that reinforce learning

### Sandbox Mode
After completing the story, unlock a free-play sandbox where students can:
- Drag and drop elements (trees, factories, cars, solar panels, etc.)
- Watch real-time CO₂ levels change based on their choices
- Experiment with balancing carbon emissions and absorption
- See visual feedback as atmosphere quality changes

## Getting Started

### Local Development

1. Clone or download this repository
2. Open `index.html` in a web browser (Chrome recommended)
3. No build step or server required!

### GitHub Pages Deployment

1. Create a new GitHub repository
2. Push all files to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Carbon Cycle Explorer"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/carbon-cycle-explorer.git
   git push -u origin main
   ```
3. Go to repository **Settings** → **Pages**
4. Under "Source", select **main** branch and **/ (root)** folder
5. Click **Save**
6. Your site will be live at: `https://YOUR-USERNAME.github.io/carbon-cycle-explorer/`

## Project Structure

```
carbon-cycle/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── main.js         # App initialization and navigation
│   ├── story.js        # Story mode chapters and interactions
│   ├── sandbox.js      # Sandbox mode logic
│   ├── particles.js    # Canvas particle effects
│   └── audio.js        # Sound effects (Web Audio API)
└── README.md           # This file
```

## Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks or build tools required
- **LocalStorage** - Progress is saved automatically
- **Web Audio API** - Simple synthesized sound effects
- **Canvas** - Particle effects for carbon visualization
- **Responsive Design** - Optimized for desktop/laptop screens

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Educational Standards

This app supports learning about:
- The carbon cycle and its components
- Photosynthesis and respiration
- Decomposition and fossil fuel formation
- Renewable vs. non-renewable energy sources
- Human impact on atmospheric CO₂

## Customization

### Adding New Elements to Sandbox

Edit `js/sandbox.js` and add to the `sandboxElements` object:

```javascript
const sandboxElements = {
    // existing elements...
    newElement: { emoji: '🆕', name: 'New Element', zone: 'ground', carbonEffect: 1 }
};
```

### Modifying Chapter Content

Edit `js/story.js` and update the `chapters` array with new content or interactions.

## Credits

Created as an educational tool for grade 5 science curriculum.

## License

Free to use for educational purposes.
