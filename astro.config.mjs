// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightVersions from 'starlight-versions';

const allSlugs = [
	'getting-started/overview',
	'getting-started/supported-environments',
	'getting-started/installation',
	'getting-started/migration-1-1',
	'getting-started/connect-device',
	'getting-started/first-project',
	'getting-started/development-cycle',
	'core-concepts/widget-tree',
	'core-concepts/state-and-events',
	'core-concepts/layout-and-styling',
	'core-concepts/lifecycle-and-data',
	'widgets',
	'widgets/column',
	'widgets/row',
	'widgets/grid',
	'widgets/stack',
	'widgets/scrollview',
	'widgets/tabs',
	'widgets/text',
	'widgets/image',
	'widgets/icon',
	'widgets/button',
	'widgets/textfield',
	'widgets/switch',
	'widgets/checkbox',
	'widgets/radio',
	'widgets/slider',
	'widgets/select',
	'widgets/list',
	'widgets/system-bars',
	'widgets/nav',
	'widgets/overlay',
	'device-services/overview',
	'device-services/async-handlers',
	'device-services/files-upload',
	'device-services/camera-microphone',
	'device-services/playback-speech-haptics',
	'device-services/sensors',
	'device-services/system-integrations',
	'device-services/device-lab',
	'features/animation',
	'features/dependencies-networking',
	'build/configuration',
	'build/commands',
	'build/distribute',
	'guides/windows',
	'guides/troubleshooting',
	'guides/performance-accessibility',
	'guides/exercises',
	'guides/faq',
	'guides/glossary',
	'guides/references',
];

/** @type {Record<string, string>} */
const v120Redirects = {};
for (const slug of allSlugs) {
	v120Redirects[`/v1-2-0/${slug}`] = `/${slug}/`;
	v120Redirects[`/v1-2/${slug}`] = `/${slug}/`;
}

// https://astro.build/config
export default defineConfig({
	site: 'https://zkite.cloud',
	redirects: {
		'/sitemap.xml': '/sitemap-index.xml',
		'/v1-2-0': '/getting-started/overview/',
		'/v1-2-0/overview': '/getting-started/overview/',
		'/v1-2': '/getting-started/overview/',
		'/v1-2/overview': '/getting-started/overview/',
		'/v1-1-2': '/v1-1-2/getting-started/overview/',
		'/v1-1-2/overview': '/v1-1-2/getting-started/overview/',
		'/v1-1-1': '/v1-1-1/getting-started/overview/',
		'/v1-1-1/overview': '/v1-1-1/getting-started/overview/',
		'/v1-1-0': '/v1-1-0/getting-started/overview/',
		'/v1-1-0/overview': '/v1-1-0/getting-started/overview/',
		'/v1-0': '/v1-0-0/getting-started/overview/',
		'/v1-0/overview': '/v1-0-0/getting-started/overview/',
		'/v1-0-0': '/v1-0-0/getting-started/overview/',
		'/v1-0-0/overview': '/v1-0-0/getting-started/overview/',
		...v120Redirects,
	},
	integrations: [
		starlight({
			plugins: [
				starlightVersions({
					current: {
						label: 'v1.2.0 (latest)',
					},
					versions: [
						{
							slug: 'v1-1-2',
							label: 'v1.1.2',
						},
						{
							slug: 'v1-1-1',
							label: 'v1.1.1',
						},
						{
							slug: 'v1-1-0',
							label: 'v1.1.0',
						},
						{
							slug: 'v1-0-0',
							label: 'v1.0.0',
						},
					],
				}),
			],
			title: 'ZKite',
			description: 'Build fast, native Android applications in pure Python with instant hot reload.',
			logo: {
				src: './src/assets/zkite-logo.png',
			},
			favicon: '/zkite-logo.png',
			customCss: ['./src/styles/custom.css'],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/AbhinavKrShukla/zkite' },
			],
			head: [
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: 'https://zkite.cloud/og-image.png',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image',
						content: 'https://zkite.cloud/og-image.png',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:width',
						content: '1200',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:height',
						content: '630',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image:alt',
						content: 'ZKite — Build Native Android Apps in Pure Python with Instant Hot Reload',
					},
				},
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
						{ label: "What's New in 1.2.0 & Migration", slug: 'getting-started/migration-1-1' },
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
								{ label: 'Tabs (Swipeable Tabs)', slug: 'widgets/tabs' },
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
					label: 'Device Integration',
					items: [
						{ label: 'Overview & Permissions', slug: 'device-services/overview' },
						{ label: 'Async Handlers & Errors', slug: 'device-services/async-handlers' },
						{ label: 'Files, Storage & Uploads', slug: 'device-services/files-upload' },
						{ label: 'Camera & Microphone', slug: 'device-services/camera-microphone' },
						{ label: 'Audio Playback, Speech & Haptics', slug: 'device-services/playback-speech-haptics' },
						{ label: 'Motion & Environmental Sensors', slug: 'device-services/sensors' },
						{ label: 'System Integrations & Security', slug: 'device-services/system-integrations' },
						{ label: 'Device Lab Testing', slug: 'device-services/device-lab' },
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
						{ label: 'Configuration Reference (app.json & TOML)', slug: 'build/configuration' },
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
						{ label: 'Official Platform References', slug: 'guides/references' },
					],
				},
			],
		}),
	],
});
