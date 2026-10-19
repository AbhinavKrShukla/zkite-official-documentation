---
title: Widget Catalog & Overview
description: Complete reference catalog of native layout, display, interactive, and system widgets in ZKite.
---

ZKite provides an extensive collection of native Android widgets. All widgets follow the **class-string-first** convention and render directly through Android's native graphics engine.

## Layout & Composition

| Widget | Purpose | Key Properties |
| :--- | :--- | :--- |
| [`Column`](/widgets/column/) | Vertical linear container | Classes, children widgets |
| [`Row`](/widgets/row/) | Horizontal linear container | Classes, children widgets |
| [`Grid`](/widgets/grid/) | Two-dimensional matrix of items | Classes, children widgets |
| [`Stack`](/widgets/stack/) | Overlapping z-index layer stack | Classes, children widgets |
| [`ScrollView`](/widgets/scrollview/) | Scrollable viewport | Classes, children, `horizontal=True/False` |
| [`Tabs`](/widgets/tabs/) | Multi-page swipeable tab container | Classes, pages, `labels`, `index`, `on_change`, `key` |

## Display Widgets

| Widget | Purpose | Key Properties |
| :--- | :--- | :--- |
| [`Text`](/widgets/text/) | Typography, labels, and emoji | Classes, content string, `wrap`, `multiline`, `max_lines`, `overflow` |
| [`Image`](/widgets/image/) | Local assets, recursive assets folder, data URIs, and HTTPS URLs | Classes, `src`, `alt`, fit modes |
| [`Icon`](/widgets/icon/) | Bundled native vector icon symbols | Classes, `name` |

## Interactive Controls

| Widget | Purpose | Principal Callbacks |
| :--- | :--- | :--- |
| [`Button`](/widgets/button/) | Tap-triggered action button | `on_tap`, `disabled` |
| [`TextField`](/widgets/textfield/) | Single-line or password text input | `on_change`, `on_input`, `value` |
| [`Switch`](/widgets/switch/) | Binary on/off toggle switch | `on_change`, `checked` |
| [`Checkbox`](/widgets/checkbox/) | Multi-state or boolean checkbox | `on_change`, `checked` |
| [`Radio`](/widgets/radio/) | Single choice selection radio | `on_change`, `checked` |
| [`Slider`](/widgets/slider/) | Continuous or stepped range slider | `on_change`, `value`, `min`, `max`, `step` |
| [`Select`](/widgets/select/) | Dropdown selection picker | `on_change`, `options`, `value` |

## Performance & System Widgets

| Widget | Purpose | Key Features |
| :--- | :--- | :--- |
| [`List`](/widgets/list/) | Virtualized fixed-height recycler | `count`, `item_height`, `builder`, `overscan` |
| [`SystemBars`](/widgets/system-bars/) | Android status and navigation bar styling | `status_color`, `navigation_color`, `status_icons` |
| [`Nav`](/widgets/nav/) | Stack-based multi-screen navigation | `push`, `pop`, `replace`, `pop_to_root` |
| [`Overlay`](/widgets/overlay/) | Modals, bottom sheets, and dialogs | `placement`, `scrim`, `on_dismiss` |
