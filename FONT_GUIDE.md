# Clash Grotesk Font Implementation Guide

This guide explains how to use the Clash Grotesk font system implemented in your React Native app.

## 🎨 Font System Overview

The app now uses [Clash Grotesk](https://www.fontshare.com/fonts/clash-grotesk) from Fontshare as the primary typeface, with 6 different weights and innovative font presets for different UI elements.

## 📁 File Structure

```
config/
  fonts.config.ts          # Font loading configuration
components/
  DesignSystem.tsx          # Updated with Clash Grotesk typography
  FontShowcase.tsx          # Demo component showing all font styles
assets/
  fonts/                    # Place Clash Grotesk .otf files here
    README.md              # Download instructions
```

## 🔤 Available Font Weights

- **Light** (`ClashGrotesk-Light`) - Subtle text and captions
- **Regular** (`ClashGrotesk-Regular`) - Body text and general content
- **Medium** (`ClashGrotesk-Medium`) - Labels and secondary headings
- **Semibold** (`ClashGrotesk-Semibold`) - Titles and important text
- **Bold** (`ClashGrotesk-Bold`) - Headlines and emphasis
- **Extrabold** (`ClashGrotesk-Extrabold`) - Display text and large headings

## 🎯 Font Presets

### Display Styles (Large, impactful text)

```typescript
FontPresets.displayLarge; // 96px, Extrabold - Hero sections
FontPresets.displayMedium; // 60px, Bold - Large headings
FontPresets.displaySmall; // 36px, Semibold - Section headers
```

### Headline Styles (Section headers)

```typescript
FontPresets.headlineLarge; // 30px, Bold - Main headings
FontPresets.headlineMedium; // 24px, Semibold - Subheadings
FontPresets.headlineSmall; // 20px, Medium - Small headings
```

### Title Styles (Card titles, buttons)

```typescript
FontPresets.titleLarge; // 18px, Semibold - Card titles
FontPresets.titleMedium; // 16px, Medium - Button text
FontPresets.titleSmall; // 14px, Medium - Small titles
```

### Body Styles (Main content)

```typescript
FontPresets.bodyLarge; // 16px, Regular - Main content
FontPresets.bodyMedium; // 14px, Regular - Secondary content
FontPresets.bodySmall; // 12px, Regular - Fine print
```

### Label Styles (Form labels, captions)

```typescript
FontPresets.labelLarge; // 14px, Medium - Form labels
FontPresets.labelMedium; // 12px, Medium - Small labels
FontPresets.labelSmall; // 12px, Regular - Captions
```

## 💻 Usage Examples

### Basic Text Components

```typescript
import { FontPresets } from '@/components/DesignSystem';

// Display text
<Text style={FontPresets.displayLarge}>Welcome</Text>

// Headlines
<Text style={FontPresets.headlineLarge}>Section Title</Text>

// Body text
<Text style={FontPresets.bodyLarge}>
  This is the main content text.
</Text>

// Labels
<Text style={FontPresets.labelMedium}>Form Label</Text>
```

### Card Component Example

```typescript
const Card = ({ title, content, timestamp }) => (
  <View style={styles.card}>
    <Text style={FontPresets.titleLarge}>{title}</Text>
    <Text style={FontPresets.bodyMedium}>{content}</Text>
    <Text style={FontPresets.labelSmall}>{timestamp}</Text>
  </View>
);
```

### Button Component Example

```typescript
const Button = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={FontPresets.titleMedium}>{title}</Text>
  </TouchableOpacity>
);
```

## 🚀 Setup Instructions

### 1. Download Font Files

1. Visit [Fontshare - Clash Grotesk](https://www.fontshare.com/fonts/clash-grotesk)
2. Download all 6 font weights (.otf files)
3. Place them in `assets/fonts/` directory with exact names:
   - `ClashGrotesk-Light.otf`
   - `ClashGrotesk-Regular.otf`
   - `ClashGrotesk-Medium.otf`
   - `ClashGrotesk-Semibold.otf`
   - `ClashGrotesk-Bold.otf`
   - `ClashGrotesk-Extrabold.otf`

### 2. Font Loading

The fonts are automatically loaded in `app/_layout.tsx` using the `loadClashGroteskFonts()` function from `config/fonts.config.ts`.

### 3. Using in Components

Import the font presets and apply them to your Text components:

```typescript
import { FontPresets } from "@/components/DesignSystem";

// Use any of the presets
<Text style={FontPresets.headlineLarge}>Your Text</Text>;
```

## 🎨 Design Principles

### Typography Hierarchy

1. **Display** - For hero sections and large impact text
2. **Headline** - For section titles and important headings
3. **Title** - For card titles, buttons, and navigation
4. **Body** - For main content and readable text
5. **Label** - For form labels, captions, and metadata

### Color Integration

All font presets are designed to work with the purple color scheme:

- **Primary text**: White (`#ffffff`) for dark backgrounds
- **Secondary text**: Light purple (`#e0aaff`)
- **Disabled text**: Mid purple (`#5a189a`)

### Responsive Design

The font system includes:

- **Letter spacing** for better readability
- **Line heights** optimized for each font size
- **Fallback fonts** if Clash Grotesk fails to load

## 🔧 Customization

### Creating Custom Font Styles

```typescript
const customStyle = {
  ...FontPresets.bodyLarge,
  color: Colors.accent,
  textAlign: "center",
  letterSpacing: 2,
};
```

### Combining with Other Styles

```typescript
<Text
  style={[FontPresets.headlineLarge, { textAlign: "center", marginBottom: 20 }]}
>
  Centered Heading
</Text>
```

## 📱 Best Practices

1. **Use appropriate presets** for each UI element
2. **Maintain hierarchy** - don't mix display styles with body text
3. **Test readability** - ensure sufficient contrast with backgrounds
4. **Keep consistency** - use the same preset for similar elements
5. **Consider accessibility** - ensure text is readable at all sizes

## 🎯 Implementation Checklist

- [ ] Download all 6 Clash Grotesk font files
- [ ] Place fonts in `assets/fonts/` directory
- [ ] Test font loading in app
- [ ] Update existing components to use FontPresets
- [ ] Test on different screen sizes
- [ ] Verify accessibility and readability

## 🚨 Troubleshooting

### Fonts Not Loading

- Check that font files are in the correct directory
- Verify file names match exactly
- Check console for loading errors

### Fallback Fonts

If Clash Grotesk fails to load, the system will automatically fall back to system fonts.

### Performance

Font loading is handled asynchronously to prevent blocking the app startup.
