---
title: Performance & Accessibility
description: Best practices for mobile frame rates, memory optimization, image handling, and Android accessibility.
---

Delivering a great mobile experience requires attention to device performance and accessibility standards.

## Performance Optimization

### 1. View Calculation Efficiency
* Keep your widget construction functions lightweight. Do not compute expensive statistical aggregations or parse large JSON payloads inside your UI tree builders.
* Cache pre-computed results in your `Store` and update them on worker threads.

### 2. Choose the Right List Container
* **Small collections (< 30 items)**: Use [`Column`](/widgets/column/) inside a [`ScrollView`](/widgets/scrollview/).
* **Large or dynamic datasets (> 30 items)**: Always use the virtualized [`List`](/widgets/list/) widget to recycle view allocations and keep memory consumption constant.

### 3. Image Sizing & Memory
* Mobile devices have strict per-process RAM limits. Avoid bundling high-resolution 4000x3000 photos for an avatar that renders at 96x96 pixels.
* Downscale image assets to their display resolution before placing them in the project.

---

## Accessibility Best Practices

### 1. Touch Target Sizes
* Ensure interactive elements have comfortable touch targets (minimum 48x48 dp) so users can tap them easily without precision strain.

### 2. Meaningful Color Contrast
* Test foreground text contrast against your background colors.
* Never communicate state exclusively through color (e.g. green/red indicators). Always combine colors with descriptive icons or text labels.

### 3. Screen Reader Labels (TalkBack)
* Supply meaningful `alt` descriptions on all [`Image`](/widgets/image/) widgets that convey content.
* When creating icon-only buttons, pair the icon with descriptive accessibility text or labels.
