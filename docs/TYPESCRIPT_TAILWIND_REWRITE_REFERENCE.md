# TypeScript + Tailwind Clean Rewrite Reference

## Task: Rewrite Existing Code into Clean TypeScript + Tailwind CSS

You are refactoring existing frontend code that currently contains a mixture of:

- TypeScript
- JavaScript
- CSS
- JSX/TSX
- Existing stylesheets
- Possibly inline styles

Your job is **NOT to perform a line-by-line conversion**.

Your job is to first understand what the current code does, how the UI looks, how the component behaves, and how responsiveness/interactions work. Then **rewrite the implementation cleanly from scratch** using modern TypeScript and standard Tailwind CSS utilities.

---

## Main Goal

Convert the existing code into:

- TypeScript / TSX
- Tailwind CSS
- Simple components
- Readable code
- Reusable code where useful
- Minimal unnecessary abstraction
- Standard Tailwind utility classes
- No unnecessary CSS files
- No JavaScript files where TypeScript can be used

The finished code should look like code that was originally designed for TypeScript + Tailwind — **not code that was automatically converted from CSS**.

---

## 1. First Understand the Existing Code

Before modifying anything, inspect the complete existing implementation.

Understand:

- What the component/page does
- Layout structure
- Visual hierarchy
- Responsive behavior
- Spacing
- Typography
- Colors
- Borders
- Shadows
- Hover states
- Active states
- Animations
- User interactions
- State management
- Existing reusable components
- Images/assets
- Mobile/tablet/desktop layouts

Do not immediately start converting CSS classes.

The existing implementation is the **reference for behavior and appearance**, not the architecture that must be preserved.

---

## 2. Rewrite Instead of Translating

Do NOT translate CSS line by line.

Bad approach:

```css
.card {
  margin: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
}
```

Do NOT produce unnecessarily literal or arbitrary Tailwind such as:

```tsx
<div className="m-[8px] p-[16px] flex items-center">
```

Instead use normal Tailwind utilities:

```tsx
<div className="m-2 p-4 flex items-center">
```

Always prefer standard Tailwind classes.

---

## 3. Avoid Arbitrary Tailwind Values

Avoid classes like:

```text
w-[347px]
h-[53px]
mt-[13px]
px-[17px]
text-[15px]
rounded-[7px]
gap-[11px]
top-[23px]
left-[14px]
```

Prefer Tailwind's normal design system:

```text
w-full
h-12
mt-3
px-4
text-sm
rounded-lg
gap-3
top-6
left-4
```

Use Tailwind's standard spacing, typography, sizing, border-radius, and layout utilities whenever reasonably possible.

### Arbitrary values should be extremely rare.

Only use an arbitrary value when:

1. The design genuinely requires an exact value.
2. Tailwind has no reasonable equivalent.
3. Changing the value would visibly break the design.

Do not use arbitrary values simply because the old CSS contained exact pixel values.

---

## 4. Do Not Copy CSS into TSX

Never convert CSS into large inline style objects.

Do NOT do this:

```tsx
<div
  style={{
    marginTop: "16px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
  }}
>
```

Also do not create huge JavaScript objects containing CSS.

Prefer:

```tsx
<div className="mt-4 rounded-lg bg-white p-5">
```

Tailwind utility classes should handle the styling.

---

## 5. Remove Legacy CSS When Possible

If styling can cleanly be represented with Tailwind, remove the corresponding old CSS.

Avoid keeping CSS files such as:

```text
component.css
styles.css
page.css
custom.css
```

unless there is a legitimate reason.

CSS may remain only for cases such as:

- Complex keyframe animations
- Third-party library overrides
- Browser-specific behavior
- Styles that genuinely cannot be represented cleanly with Tailwind

Do not keep legacy CSS simply because it already exists.

---

## 6. Use TypeScript Properly

Convert JavaScript components to TypeScript.

Use:

```text
.ts
.tsx
```

instead of:

```text
.js
.jsx
```

Add proper types for:

- Component props
- State
- Function arguments
- Function return values when useful
- API data
- Events
- Refs
- Reusable models

Avoid:

```ts
any
```

unless there is a strong reason.

Prefer inferred types when TypeScript can understand them naturally.

Do not over-type simple code.

---

## 7. Keep Components Simple

Do not create unnecessary abstraction.

Avoid turning a simple page into dozens of components.

Create a component when:

- It is reused
- It represents a clear UI section
- It has its own logic
- Extracting it significantly improves readability

Do not extract every `<div>` into a component.

Prefer simple readable React code.

---

## 8. Simplify the Existing Logic

While rewriting, inspect the existing JavaScript/TypeScript logic.

Remove:

- Duplicate code
- Dead code
- Unused variables
- Unused imports
- Repeated conditions
- Old commented-out code
- Unnecessary state
- Unnecessary effects
- Overcomplicated handlers
- Redundant wrappers
- Duplicate styling logic

If the same behavior can be implemented more simply, use the simpler implementation.

However, **do not change actual product behavior unless necessary.**

---

## 9. Prefer Semantic HTML

Instead of excessive:

```tsx
<div>
  <div>
    <div>
```

use meaningful elements when appropriate:

```tsx
<header>
<nav>
<main>
<section>
<article>
<footer>
<button>
<form>
<label>
```

Keep accessibility in mind.

---

## 10. Responsive Design

Understand the existing responsive behavior before rewriting it.

Use Tailwind breakpoints naturally:

```text
sm:
md:
lg:
xl:
2xl:
```

Example:

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
```

Do not reproduce every historical media-query breakpoint unless it is actually needed.

Simplify the responsive design while preserving the intended result.

---

## 11. Prefer Flexbox and Grid

Do not reproduce old positional CSS if modern layout tools can solve it.

Prefer:

```text
flex
grid
gap
items-center
justify-between
place-items-center
```

instead of excessive:

```text
absolute
relative
top-[...]
left-[...]
margin-left-[...]
```

Use absolute positioning only where the design genuinely requires it.

---

## 12. Tailwind Class Quality

Classes should remain understandable.

Good:

```tsx
<div className="flex items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm">
```

Bad:

```tsx
<div className="flex w-[97.3%] h-[63px] mt-[11px] ml-[7px] px-[13px] rounded-[9px] bg-[#FFFFFF]">
```

The goal is a clean Tailwind implementation, not a pixel-for-pixel dump of the old CSS.

---

## 13. Use Existing Project Design System

Before hardcoding styles, inspect the project for:

- Tailwind configuration
- Global theme
- CSS variables
- Existing colors
- Existing spacing conventions
- shadcn/ui components
- Existing reusable UI components
- Existing typography
- Existing buttons
- Existing cards
- Existing form controls

Reuse the project's design system whenever possible.

For example, prefer existing semantic classes or theme colors over introducing new random colors.

---

## 14. Reuse Existing Components

Before creating a new:

- Button
- Input
- Select
- Dialog
- Modal
- Card
- Dropdown
- Tooltip
- Tabs
- Form control

check whether the project already has one.

If the project uses shadcn/ui or another UI library, prefer those existing components where appropriate.

Do not duplicate UI primitives.

---

## 15. Preserve Functionality

The refactor must preserve existing functionality.

Make sure these still work where applicable:

- Buttons
- Links
- Forms
- Validation
- API calls
- Navigation
- Dropdowns
- Modals
- Animations
- State changes
- Loading states
- Error states
- Responsive behavior
- Images
- Videos
- User interactions

The goal is to simplify the implementation without breaking the feature.

---

## 16. Naming

Use clear names.

Prefer:

```ts
isMenuOpen
handleSubmit
selectedItem
userProfile
navigationItems
```

Avoid vague names:

```ts
data1
temp
val
x
abc
test
```

Component names should clearly describe their responsibility.

---

## 17. Avoid Overengineering

Do not introduce new:

- State management libraries
- UI libraries
- Utility libraries
- Architectural patterns
- Hooks
- Context providers
- Dependencies

unless the existing feature actually requires them.

Keep the solution as small and understandable as possible.

---

## 18. Do Not Change the Design Unnecessarily

The existing implementation is the visual reference.

You may improve implementation quality, spacing consistency, responsive structure, and obvious inconsistencies, but do not redesign the entire interface.

Maintain:

- Same purpose
- Same content
- Same general appearance
- Same interactions
- Same feature behavior

while making the underlying code substantially cleaner.

---

## 19. Code Quality Priority

When multiple implementations are possible, prioritize in this order:

1. Correct behavior
2. Simple code
3. Readability
4. Standard Tailwind utilities
5. Reusability
6. Maintainability
7. Visual similarity with the existing implementation
8. Exact pixel-level matching

Do not sacrifice clean architecture just to preserve an unnecessary 1–2px difference from legacy CSS.

---

## 20. Forbidden Patterns

Avoid these unless absolutely necessary:

```tsx
className="w-[347px]"
className="mt-[13px]"
className="text-[15px]"
className="bg-[#ffffff]"
```

Avoid:

```tsx
style={{ ... }}
```

for normal styling.

Avoid:

```ts
const styles = {
   ...
}
```

for CSS replacement.

Avoid copying hundreds of CSS declarations into Tailwind arbitrary values.

Avoid enormous components when obvious logical sections can be extracted.

Avoid unnecessary components for tiny pieces of markup.

Avoid changing working business logic without a reason.

Avoid `any`.

Avoid duplicate Tailwind classes and duplicate JSX.

---

# Working Process

Follow this process for every file/component.

### Step 1 — Inspect

Read the complete existing:

- Component
- Related CSS
- Child components
- Imported components
- Assets
- Logic

### Step 2 — Understand

Determine:

- What the feature does
- Which styles are actually important
- Which code is legacy
- Which code is duplicated
- Which behavior must be preserved

### Step 3 — Plan

Decide the simplest modern component structure.

Do not preserve poor legacy architecture just because it already exists.

### Step 4 — Rewrite

Rewrite using:

```text
TypeScript
React
TSX
Tailwind CSS
Existing project components
Existing design system
```

### Step 5 — Simplify

Remove unnecessary:

- CSS
- wrappers
- states
- effects
- variables
- helpers
- duplicated code

### Step 6 — Verify

Verify:

- UI still looks correct
- Responsive behavior works
- All interactions work
- TypeScript has no errors
- No broken imports
- No unused code
- No unnecessary CSS remains

---

# Final Requirement

The final implementation should feel like a developer looked at the old page, understood what it was trying to accomplish, and then rebuilt it cleanly using modern TypeScript and Tailwind.

It should **NOT feel like an automated CSS-to-Tailwind conversion.**

The preferred result should look like:

```tsx
<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    ...
  </div>
</section>
```

rather than:

```tsx
<section className="w-[1187px] mt-[31px] ml-[42px] px-[17px] py-[29px]">
  <div className="grid gap-[23px] md:grid-cols-[repeat(2,357px)]">
    ...
  </div>
</section>
```

---

# Definition of Done

The work is complete only when:

- [ ] JavaScript has been converted to TypeScript where appropriate.
- [ ] Components use `.tsx` where JSX is present.
- [ ] Legacy CSS has been removed where Tailwind replaces it.
- [ ] Standard Tailwind utilities are preferred.
- [ ] Arbitrary Tailwind values are rare and justified.
- [ ] Normal styling does not use inline `style={{}}`.
- [ ] Existing functionality still works.
- [ ] Responsive layouts still work.
- [ ] Code is simpler than the original.
- [ ] Duplicate/dead code has been removed.
- [ ] Existing reusable project components are reused.
- [ ] TypeScript passes without errors.
- [ ] There are no unused imports or variables.
- [ ] The final code is easy for another developer or coding agent to understand.

---

## Most Important Rule

> Do not convert the old code literally. Understand it first, then rebuild it in the simplest clean TypeScript + Tailwind form possible.

---

## Terminology Note

Use the term **Tailwind utility classes in `className`**, not “Tailwind inline CSS.”

Calling it “inline CSS” can lead an agent to produce `style={{ ... }}` objects, which should be avoided for normal styling.
