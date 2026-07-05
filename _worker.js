const CLOAKER_ENABLED = false;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname;

    // Never cloak the bio subdomain — serve it normally
    if (host === 'bio.thaiadvice.net') {
      return env.ASSETS.fetch(request);
    }

    const path = url.pathname;

    // Debug log endpoint
    if (path === '/debug-log') {
      const body = await request.text().catch(() => '');
      console.log('[DEBUG]', body);
      return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // Only cloak the root entry point
    if (path !== '/' && path !== '/index.html') {
      return env.ASSETS.fetch(request);
    }

    const ua = (request.headers.get('User-Agent') || '').toLowerCase();

    const botSignals = [
      'bot', 'crawl', 'spider', 'slurp',
      'bytespider', 'tiktok',
      'facebookexternalhit', 'facebookbot',
      'pinterestbot', 'twitterbot', 'linkedinbot',
      'applebot', 'baiduspider', 'yandexbot',
      'semrushbot', 'ahrefsbot', 'mj12bot',
      'headlesschrome', 'phantomjs', 'prerender',
      'wget', 'curl', 'python-requests', 'go-http-client',
      'java/', 'libwww', 'scrapy', 'googlebot', 'adsbot-google',
    ];

    const isBot = botSignals.some(s => ua.includes(s));

    if (CLOAKER_ENABLED) {
      if (isBot) {
        return env.ASSETS.fetch(new Request(new URL('/page.html', request.url), request));
      }
      return Response.redirect('https://bio.thaiadvice.net/', 302);
    }

    return env.ASSETS.fetch(request);
  },
};
