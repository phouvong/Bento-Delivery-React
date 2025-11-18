# Enhanced Slider Arrows

This utility provides enhanced hover effects for all sliders in the project.

## Features

- **Hidden by Default**: Arrows are hidden (opacity: 0) and only appear when hovering over the slider
- **Interactive Movement**: Arrows continuously slide left/right when visible, pausing on direct hover
- **Color Changes**: Background changes to primary color and icon color changes to white on hover
- **Smooth Transitions**: All effects use smooth 0.3s transitions
- **Scale Effect**: Arrows scale to 1.05x when hovered

## Usage

### 1. Import the utility
```javascript
import { createEnhancedArrows } from "../../common/EnhancedSliderArrows";
```

### 2. Add hover state to your component
```javascript
const [isSliderHovered, setIsSliderHovered] = useState(false);
```

### 3. Update your slider settings
```javascript
const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  ...createEnhancedArrows(isSliderHovered, { 
    displayNoneOnMobile: true,
    variant: "white" // or "primary"
  }),
  // ... other settings
};
```

### 4. Add hover handlers to your slider container
```javascript
<SliderContainer
  onMouseEnter={() => setIsSliderHovered(true)}
  onMouseLeave={() => setIsSliderHovered(false)}
>
  <Slider {...sliderSettings}>
    {/* your slides */}
  </Slider>
</SliderContainer>
```

## Options

The `createEnhancedArrows` function accepts these options:

- `variant`: "white" | "primary" - Arrow style variant
- `displayNoneOnMobile`: boolean - Hide arrows on mobile devices
- `width`: string - Custom arrow width (default: "38px")
- `height`: string - Custom arrow height (default: "38px")
- `left`: string - Custom left position for prev arrow
- `noboxshadow`: boolean - Remove box shadow
- `noBackground`: boolean - Remove background gradient

## Examples

### Basic Usage (White arrows)
```javascript
...createEnhancedArrows(isSliderHovered, { 
  displayNoneOnMobile: true,
  variant: "white"
})
```

### Primary Style (for food/best-reviewed sections)
```javascript
...createEnhancedArrows(isSliderHovered, { 
  displayNoneOnMobile: true,
  variant: "primary",
  noBackground: true
})
```

### Custom Size
```javascript
...createEnhancedArrows(isSliderHovered, { 
  displayNoneOnMobile: true,
  variant: "white",
  width: "26px",
  height: "28px"
})
```

## Components Updated

The following components have been updated with enhanced arrows:

- ✅ `src/components/home/featured-categories/index.js`
- ✅ `src/components/home/visit-again/index.js`
- ✅ `src/components/home/best-reviewed-items/index.js`
- ✅ `src/components/home/recommended-store/index.js`
- ✅ `src/components/home/top-offers-nearme/index.js`
- ✅ `src/components/home/special-food-offers/index.js`

## Animation Details

- **Slide Animation**: Uses CSS keyframes for continuous left/right movement
- **Hover Pause**: Animation stops when hovering directly over arrows
- **Smooth Transitions**: 0.3s ease transitions for all state changes
- **Scale Effect**: 1.05x scale on hover for better interactivity