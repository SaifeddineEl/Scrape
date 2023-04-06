import { gotScraping } from 'got-scraping';
import cheerio from 'cheerio';

const BASE_URL = 'https://www.producthunt.com';

const productLinks = [];

for (const product of $('a[href*="posts"]')) {
    const relative = $(product).attr('href');
    const url = new URL(relative, BASE_URL);
    productLinks.push(url);
}

console.log(`Collected ${productLinks.length} product URLs`);

const results = [];

const errors = [];

for (const url of productLinks) {
    try {
        console.log(`Scraping ${url}`);
        const productResponse = await gotScraping(url);
        const $$ = cheerio.load(productResponse.body);

        const title = $$('a').text().trim();
        const price = $$('a + div').text().trim();
        const description = $$('div[class*="styles_title__jWi91"]').text().trim();

        results.push({
            title,
            description,
            price,
        });
    } catch (error) {
        console.error(`Failed on ${url}: ${error.message}`);
        errors.push({
            url,
            err: error.message,
        });
    }
}

console.log(`${results.length} results:`);
console.log(results);