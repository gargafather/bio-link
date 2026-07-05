export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname;

    // Never cloak the bio subdomain — serve it normally
    if (host === 'bio.thaiadvice.net') {
      return fetch(request);
    }

    // Only cloak the root entry point
    const path = url.pathname;
    if (path !== '/' && path !== '/index.html') {
      return fetch(request);
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

    if (isBot) {
      // Serve the compliant entertainment page
      const safeUrl = new URL('/page.html', request.url);
      const safeReq = new Request(safeUrl.toString(), request);
      return fetch(safeReq);
    }

    // Real user → send to funnel
    return Response.redirect('https://bio.thaiadvice.net/', 302);
  },
};
