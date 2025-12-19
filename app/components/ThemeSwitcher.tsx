'use client'

import { useState } from 'react'

const themes = [
  {
    name: 'German Autumn',
    description: 'Warm oranges and deep blues - current theme',
    primary: 'primary',
    secondary: 'secondary',
    gradient: 'gradient-hero',
    accent: 'gradient-accent',
    active: true
  },
  {
    name: 'Bavarian Forest',
    description: 'Deep greens and warm browns',
    primary: 'forest',
    secondary: 'secondary',
    gradient: 'gradient-forest',
    accent: 'gradient-forest-accent',
    active: false
  },
  {
    name: 'Rhine River',
    description: 'Cool blues and silvers',
    primary: 'rhine',
    secondary: 'secondary',
    gradient: 'gradient-rhine',
    accent: 'gradient-rhine-accent',
    active: false
  },
  {
    name: 'Black Forest',
    description: 'Rich purples and deep grays',
    primary: 'blackforest',
    secondary: 'secondary',
    gradient: 'gradient-blackforest',
    accent: 'gradient-blackforest-accent',
    active: false
  },
  {
    name: 'Alpine Snow',
    description: 'Clean whites and cool grays',
    primary: 'alpine',
    secondary: 'secondary',
    gradient: 'gradient-alpine',
    accent: 'gradient-alpine-accent',
    active: false
  },
  {
    name: 'German Flag',
    description: 'Black, red, and gold - patriotic',
    primary: 'flag',
    secondary: 'secondary',
    gradient: 'gradient-flag',
    accent: 'gradient-flag-accent',
    active: false
  }
]

export default function ThemeSwitcher() {
  const [selectedTheme, setSelectedTheme] = useState(0)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-secondary-800/90 backdrop-blur-sm border border-secondary-600 rounded-lg p-4 max-w-xs">
        <h3 className="text-sm font-semibold text-white mb-3">Color Themes</h3>
        <div className="space-y-2">
          {themes.map((theme, index) => (
            <button
              key={index}
              onClick={() => setSelectedTheme(index)}
              className={`w-full text-left p-2 rounded text-xs transition-colors ${
                selectedTheme === index
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-secondary-300 hover:bg-secondary-700/50'
              }`}
            >
              <div className="font-medium">{theme.name}</div>
              <div className="text-secondary-400">{theme.description}</div>
            </button>
          ))}
        </div>
        <div className="mt-3 text-xs text-secondary-500">
          Selected: {themes[selectedTheme].name}
        </div>
      </div>
    </div>
  )
}





