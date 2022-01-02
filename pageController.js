const pageScraper = require('./readLinksScrapper');
async function scrapeAll(browserInstance){
    let browser;
	//Extract links
    try{
        browser = await browserInstance;
        await pageScraper.scraper(browser);
    }catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }finally {
		await browser.close();
	}
}
module.exports = (browserInstance) => scrapeAll(browserInstance)