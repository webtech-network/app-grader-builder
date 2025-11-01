# Essay Template - "Available Soon" Tag

## Changes Made

### 1. Updated `src/cachedTemplates.js`

Added `availableSoon: true` flag and updated description:

```javascript
essay: {
  template_name: "Redações",
  template_description: "Um modelo para avaliar redações e trabalhos escritos. Em breve disponível.",
  tests: [],
  availableSoon: true  // ✅ New flag
}
```

### 2. Updated `src/components/landing/index.jsx`

Added visual "Em Breve" (Available Soon) tag in the template dropdown:

```jsx
const isAvailableSoon = template === 'essay';

// In the template display:
<div className="flex items-center gap-2">
  <span className="font-medium text-gray-100">{info.label}</span>
  {isAvailableSoon && (
    <span className="px-2 py-0.5 bg-yellow-500 text-gray-900 text-xs font-bold rounded">
      Em Breve
    </span>
  )}
</div>
```

## Visual Result

In the template dropdown, the essay template now shows:

```
📝 Redações [⚠️ Em Breve]
```

- **Template name:** "Redações"
- **Tag:** Yellow badge with "Em Breve" text
- **Styling:** `bg-yellow-500 text-gray-900` (yellow background, dark text)

## Benefits

1. ✅ Clear visual indicator that essay template is coming soon
2. ✅ Consistent styling with other "not available" indicators
3. ✅ Users can still select it (to see what's coming)
4. ✅ Professional appearance

## Testing

To see the changes:

```bash
cd app-grader-builder
npm start
```

Then:
1. Click on the "Modelo de Avaliação" dropdown
2. The "Redações" template will show a yellow "Em Breve" badge

## Future Updates

When the essay template is ready:
1. Remove `availableSoon: true` from `cachedTemplates.js`
2. Add actual test data
3. Update description to remove "Em breve disponível"
4. The tag will automatically disappear

## Styling Details

- **Badge color:** Yellow (`bg-yellow-500`)
- **Text color:** Dark gray (`text-gray-900`)
- **Font weight:** Bold
- **Size:** Extra small (`text-xs`)
- **Padding:** `px-2 py-0.5`
- **Border radius:** Rounded

This matches the styling used for the disabled download buttons.
