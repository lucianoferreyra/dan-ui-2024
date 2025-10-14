# Dark Mode Styles Guide

## Overview
This project now features an elegant dark mode design with a consistent color palette and modern UI components.

## Color Palette

### Background Colors
- `--bg-primary: #0f0f0f` - Main background
- `--bg-secondary: #1a1a1a` - Secondary sections (navbar, sidebar, cards)
- `--bg-tertiary: #252525` - Tertiary elements
- `--bg-hover: #2a2a2a` - Hover states

### Text Colors
- `--text-primary: #e0e0e0` - Primary text
- `--text-secondary: #a0a0a0` - Secondary text
- `--text-muted: #707070` - Muted text

### Accent Colors
- `--accent-primary: #6366f1` - Primary accent (Indigo)
- `--accent-hover: #4f46e5` - Accent hover state
- `--accent-light: #818cf8` - Light accent

### Status Colors
- `--success: #10b981` - Success states
- `--warning: #f59e0b` - Warning states
- `--error: #ef4444` - Error states

### Border & Shadow
- `--border-color: #2a2a2a` - Default borders
- `--border-hover: #3a3a3a` - Hover state borders
- `--shadow-sm`, `--shadow-md`, `--shadow-lg` - Various shadow levels

## Components

### Buttons
All buttons have been styled with the accent color, smooth transitions, and hover effects.

```javascript
<button>Default Button</button>
<button className="btn-secondary">Secondary</button>
<button className="btn-outline">Outline</button>
<button className="btn-danger">Danger</button>
<button className="btn-small">Small</button>
<button className="btn-large">Large</button>
```

### Input Fields
Text inputs, selects, and textareas have dark backgrounds with focus states.

```javascript
<input type="text" placeholder="Enter text..." />
<textarea placeholder="Enter description..."></textarea>
<select>
  <option>Option 1</option>
</select>
```

### Tables
Tables feature alternating row hover effects and proper spacing.

```javascript
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

### Cards
Use the `.card` class for container elements.

```javascript
<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

### Badges
Visual indicators for status, categories, etc.

```javascript
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-error">Error</span>
<span className="badge badge-info">Info</span>
```

### Alerts
For displaying important messages.

```javascript
<div className="alert alert-success">
  Success message here
</div>
<div className="alert alert-warning">
  Warning message here
</div>
<div className="alert alert-error">
  Error message here
</div>
<div className="alert alert-info">
  Info message here
</div>
```

### Loading Spinner
For loading states.

```javascript
<div className="spinner"></div>
<div className="spinner spinner-small"></div>
```

## Utility Classes

### Spacing
```css
.mt-1, .mt-2, .mt-3, .mt-4 /* Margin top */
.mb-1, .mb-2, .mb-3, .mb-4 /* Margin bottom */
.p-1, .p-2, .p-3, .p-4 /* Padding */
```

### Flexbox
```css
.flex /* Display flex */
.flex-col /* Flex direction column */
.flex-row /* Flex direction row */
.items-center /* Align items center */
.justify-center /* Justify content center */
.justify-between /* Justify content space-between */
.gap-1, .gap-2, .gap-3 /* Gap between items */
```

### Text
```css
.text-center, .text-left, .text-right /* Text alignment */
.text-primary, .text-secondary, .text-muted /* Text colors */
.font-bold, .font-semibold, .font-medium /* Font weights */
```

### Grid
```css
.grid /* Display grid */
.grid-cols-2 /* 2 columns */
.grid-cols-3 /* 3 columns */
.grid-cols-4 /* 4 columns (responsive) */
```

## Layout Components

### Navbar
The navbar is sticky at the top with a brand logo and navigation links. Links have hover effects and animated underlines.

### Sidebar
The sidebar includes icons and smooth hover transitions. It's fixed on the left side with full height.

### Main Content
The main content area is responsive and properly spaced with the navbar and sidebar.

## Responsive Design
The design is mobile-friendly with breakpoints at:
- 768px (tablets)
- 1024px (small desktops)

## Form Groups
For better form layouts:

```javascript
<div className="form-group">
  <label>Field Label</label>
  <input type="text" placeholder="Enter value" />
</div>

<div className="form-group-inline">
  <label>Inline Label</label>
  <input type="text" />
</div>
```

## Custom Scrollbar
Custom scrollbar styling for better aesthetics in dark mode.

## Usage Examples

### Example: Productos Page
```javascript
<div className="container">
  <h1>Page Title</h1>
  
  <div className="flex gap-2 mb-3">
    <input type="text" placeholder="Search..." />
    <button>Search</button>
    <button className="btn-secondary">+ Create New</button>
  </div>
  
  <div className="card">
    <table>
      {/* Table content */}
    </table>
  </div>
</div>
```

## Tips
1. Use CSS variables for consistent theming
2. Leverage utility classes for quick styling
3. All interactive elements have hover states
4. Focus states are visible for accessibility
5. Shadows add depth to elevated elements
