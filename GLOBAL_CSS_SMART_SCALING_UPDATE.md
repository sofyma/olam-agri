# Global CSS - Smart Scaling System Update

## Overview
The `static/styles/global.css` file has been updated with the new smart scaling system that provides dual threshold protection.

## Changes Applied

### 1. **Updated CSS Variables**
```css
:root {
  --scale-factor: 1; /* Default for large screens */
  --min-size-rem: 1.125; /* 18px / 16px = 1.125rem for font-size protection */
  --min-size-rem-width: 9.375; /* 150px / 16px = 9.375rem for width/height protection */
}
```

### 2. **Updated Global Button Styles**
**Before:**
```css
.btn {
  block-size: calc(3.5rem * var(--scale-factor));
  font-size: calc(1.6rem * var(--scale-factor));
  inline-size: calc(10rem * var(--scale-factor));
}
```

**After:**
```css
.btn {
  /* Height: 3.5rem = 56px, scaled to 42px on 1440px - above 18px threshold, keep scaling */
  block-size: calc(3.5rem * var(--scale-factor));
  /* Font-size: 1.6rem = 25.6px, scaled to 19.2px on 1440px - above 18px threshold, keep scaling */
  font-size: calc(1.6rem * var(--scale-factor));
  /* Width: 10rem = 160px, scaled to 120px on 1440px - below 150px threshold, remove scaling */
  inline-size: 10rem;
}
```

### 3. **Added Smart Scaling Utility Classes**

#### Font-size Utilities:
```css
.smart-text-xs { font-size: 0.75rem; } /* Below 18px - no scaling */
.smart-text-sm { font-size: 0.875rem; } /* Below 18px - no scaling */
.smart-text-base { font-size: 1rem; } /* Below 18px - no scaling */
.smart-text-lg { font-size: 1.125rem; } /* At 18px - minimal scaling */
.smart-text-xl { font-size: calc(1.25rem * var(--scale-factor)); } /* Above 18px - keep scaling */
.smart-text-2xl { font-size: calc(1.5rem * var(--scale-factor)); } /* Above 18px - keep scaling */
.smart-text-3xl { font-size: calc(1.875rem * var(--scale-factor)); } /* Above 18px - keep scaling */
.smart-text-4xl { font-size: calc(2.25rem * var(--scale-factor)); } /* Above 18px - keep scaling */
.smart-text-5xl { font-size: calc(3rem * var(--scale-factor)); } /* Above 18px - keep scaling */
.smart-text-6xl { font-size: calc(3.75rem * var(--scale-factor)); } /* Above 18px - keep scaling */
```

#### Width/Height Utilities:
```css
.smart-w-sm { width: 8rem; } /* Below 150px - no scaling */
.smart-w-md { width: 10rem; } /* Below 150px - no scaling */
.smart-w-lg { width: calc(20rem * var(--scale-factor)); } /* Above 150px - keep scaling */
.smart-w-xl { width: calc(25rem * var(--scale-factor)); } /* Above 150px - keep scaling */

.smart-h-sm { height: 3rem; } /* Below 150px - no scaling */
.smart-h-md { height: 4rem; } /* Below 150px - no scaling */
.smart-h-lg { height: calc(20rem * var(--scale-factor)); } /* Above 150px - keep scaling */
.smart-h-xl { height: calc(25rem * var(--scale-factor)); } /* Above 150px - keep scaling */
```

### 4. **Added Comprehensive Documentation**
Added detailed comments explaining:
- The dual threshold system (18px for font-size, 150px for width/height)
- When scaling is removed vs. kept
- Usage examples
- How the migration script works

## Benefits

1. **Consistent Button Sizing**: Global buttons now use smart scaling
2. **Utility Classes**: Ready-to-use classes for common sizing needs
3. **Documentation**: Clear guidance for developers
4. **Future-Proof**: Easy to extend with additional utility classes

## Usage Examples

### Using Utility Classes:
```html
<!-- Small text that won't scale -->
<p class="smart-text-sm">Small text</p>

<!-- Large text that will scale -->
<h1 class="smart-text-4xl">Large heading</h1>

<!-- Small button that won't scale -->
<button class="smart-w-md smart-h-sm">Small button</button>

<!-- Large container that will scale -->
<div class="smart-w-xl smart-h-lg">Large container</div>
```

### Manual Implementation:
```css
/* Small element - no scaling */
.small-element {
  font-size: 1rem; /* Below 18px threshold */
  width: 10rem; /* Below 150px threshold */
}

/* Large element - keep scaling */
.large-element {
  font-size: calc(2rem * var(--scale-factor)); /* Above 18px threshold */
  width: calc(25rem * var(--scale-factor)); /* Above 150px threshold */
}
```

The global CSS now fully supports the smart scaling system! 🎉 