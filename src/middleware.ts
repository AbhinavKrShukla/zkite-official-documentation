import { defineMiddleware } from 'astro:middleware';
import fs from 'node:fs';
import path from 'node:path';

export const onRequest = defineMiddleware((context, next) => {
	const { pathname } = context.url;

	// Serve sitemaps in dev mode or alias /sitemap.xml
	if (pathname === '/sitemap.xml') {
		return context.redirect('/sitemap-index.xml', 302);
	}
	if (pathname === '/sitemap-index.xml' || pathname === '/sitemap-0.xml') {
		const filePath = path.resolve('dist', pathname.slice(1));
		if (fs.existsSync(filePath)) {
			return new Response(fs.readFileSync(filePath, 'utf-8'), {
				status: 200,
				headers: {
					'Content-Type': 'application/xml; charset=utf-8',
				},
			});
		}
	}

	// Catch any /v1-2-1/... or /v1-2/... URLs and route them to current (latest) docs
	if (pathname === '/v1-2-1' || pathname === '/v1-2-1/' || pathname === '/v1-2' || pathname === '/v1-2/') {
		return context.redirect('/getting-started/overview/', 302);
	}
	if (pathname.startsWith('/v1-2-1/')) {
		const target = pathname.replace(/^\/v1-2-1/, '') || '/';
		return context.redirect(target, 302);
	}
	if (pathname.startsWith('/v1-2/')) {
		const target = pathname.replace(/^\/v1-2/, '') || '/';
		return context.redirect(target, 302);
	}

	// Legacy or shorthand version archive redirects
	if (pathname === '/v1-2-0/overview' || pathname === '/v1-2-0/overview/' || pathname === '/v1-2-0' || pathname === '/v1-2-0/') {
		return context.redirect('/v1-2-0/getting-started/overview/', 302);
	}
	if (pathname === '/v1-1-2/overview' || pathname === '/v1-1-2/overview/' || pathname === '/v1-1-2' || pathname === '/v1-1-2/') {
		return context.redirect('/v1-1-2/getting-started/overview/', 302);
	}
	if (pathname === '/v1-1-1/overview' || pathname === '/v1-1-1/overview/' || pathname === '/v1-1-1' || pathname === '/v1-1-1/') {
		return context.redirect('/v1-1-1/getting-started/overview/', 302);
	}
	if (pathname === '/v1-1-0/overview' || pathname === '/v1-1-0/overview/' || pathname === '/v1-1-0' || pathname === '/v1-1-0/') {
		return context.redirect('/v1-1-0/getting-started/overview/', 302);
	}
	if (
		pathname === '/v1-0' ||
		pathname === '/v1-0/' ||
		pathname === '/v1-0/overview' ||
		pathname === '/v1-0/overview/' ||
		pathname === '/v1-0-0' ||
		pathname === '/v1-0-0/' ||
		pathname === '/v1-0-0/overview' ||
		pathname === '/v1-0-0/overview/'
	) {
		return context.redirect('/v1-0-0/getting-started/overview/', 302);
	}

	return next();
});
