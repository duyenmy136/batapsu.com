const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 1440, height: 1080 });

    // Screenshot Homepage Categories
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // Scroll a bit down to capture categories
    await page.evaluate(() => {
        window.scrollBy(0, 800);
    });

    // Wait for animation
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: '/Users/joinytran/.gemini/antigravity/brain/e6f6fdaa-d062-4a54-9763-05638b8b9fdb/homepage_categories.png' });
    console.log('Captured homepage categories');

    // Screenshot Blog Post
    await page.goto('http://localhost:3000/blog/business-analyst-la-gi', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: '/Users/joinytran/.gemini/antigravity/brain/e6f6fdaa-d062-4a54-9763-05638b8b9fdb/blog_post_hero.png' });
    console.log('Captured blog post hero');

    await browser.close();
})();
