// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://zkite.dev',
	integrations: [
		starlight({
			title: 'ZKite',
			description: 'Build fast, native Android applications in pure Python with instant hot reload.',
			logo: {
				src: './src/assets/zkite-logo.png',
			},
			favicon: '/zkite-logo.png',
			customCss: ['./src/styles/custom.css'],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/abhinav/zkite' },
			],
			head: [
				{
					tag: 'script',
					attrs: {
						src: 'https://analytics.leftnote.com/js/pa-8LfbKhURkHSl2ChFJg0my.js',
						async: true,
					},
				},
				{
					tag: 'script',
					content: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`,
				},
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'What ZKite Does', slug: 'getting-started/overview' },
						{ label: 'Supported Environments', slug: 'getting-started/supported-environments' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Connect an Android Device', slug: 'getting-started/connect-device' },
						{ label: 'Create Your First Project', slug: 'getting-started/first-project' },
						{ label: 'Development Cycle & Hot Reload', slug: 'getting-started/development-cycle' },
					],
				},
				{
					label: 'Core Concepts',
					items: [
						{ label: 'Declarative UI & Widget Tree', slug: 'core-concepts/widget-tree' },
						{ label: 'State & Events (Store)', slug: 'core-concepts/state-and-events' },
						{ label: 'Layout & Styling', slug: 'core-concepts/layout-and-styling' },
						{ label: 'Lifecycle & Application Data', slug: 'core-concepts/lifecycle-and-data' },
					],
				},
				{
					label: 'Widgets Reference',
					items: [
						{ label: 'Catalog Overview', slug: 'widgets' },
						{
							label: 'Layout & Composition',
							items: [
								{ label: 'Column', slug: 'widgets/column' },
								{ label: 'Row', slug: 'widgets/row' },
								{ label: 'Grid', slug: 'widgets/grid' },
								{ label: 'Stack', slug: 'widgets/stack' },
								{ label: 'ScrollView', slug: 'widgets/scrollview' },
							],
						},
						{
							label: 'Display Widgets',
							items: [
								{ label: 'Text', slug: 'widgets/text' },
								{ label: 'Image', slug: 'widgets/image' },
								{ label: 'Icon', slug: 'widgets/icon' },
							],
						},
						{
							label: 'Interactive Controls',
							items: [
								{ label: 'Button', slug: 'widgets/button' },
								{ label: 'TextField', slug: 'widgets/textfield' },
								{ label: 'Switch', slug: 'widgets/switch' },
								{ label: 'Checkbox', slug: 'widgets/checkbox' },
								{ label: 'Radio', slug: 'widgets/radio' },
								{ label: 'Slider', slug: 'widgets/slider' },
								{ label: 'Select', slug: 'widgets/select' },
							],
						},
						{
							label: 'Performance & Recyclers',
							items: [
								{ label: 'List (Virtual List)', slug: 'widgets/list' },
							],
						},
						{
							label: 'System & Navigation',
							items: [
								{ label: 'SystemBars', slug: 'widgets/system-bars' },
								{ label: 'Nav (Navigation Stack)', slug: 'widgets/nav' },
								{ label: 'Overlay (Modals & Sheets)', slug: 'widgets/overlay' },
							],
						},
					],
				},
				{
					label: 'Advanced Features',
					items: [
						{ label: 'Motion & Animation', slug: 'features/animation' },
						{ label: 'Dependencies & Networking', slug: 'features/dependencies-networking' },
					],
				},
				{
					label: 'Build & Distribution',
					items: [
						{ label: 'Configuration (pyproject.toml)', slug: 'build/configuration' },
						{ label: 'CLI Command Reference', slug: 'build/commands' },
						{ label: 'Build, Sign, and Distribute', slug: 'build/distribute' },
					],
				},
				{
					label: 'Guides & Support',
					items: [
						{ label: 'Windows Setup Guide', slug: 'guides/windows' },
						{ label: 'Troubleshooting & Diagnostics', slug: 'guides/troubleshooting' },
						{ label: 'Performance & Accessibility', slug: 'guides/performance-accessibility' },
						{ label: 'Learning Exercises', slug: 'guides/exercises' },
						{ label: 'Frequently Asked Questions', slug: 'guides/faq' },
						{ label: 'Glossary', slug: 'guides/glossary' },
					],
				},
			],
		}),
	],
});
