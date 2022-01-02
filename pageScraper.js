const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const scraperObject = {
    url: 'https://www.flashscore.es/baloncesto/',
    async scraper(browser){
		let dataUrl = [];
		let newDataUrl = [];
		let data = [] //init array containing quote objects
        let page = await browser.newPage();	
        console.log(`Navigating to ${this.url}...`);
        // Navigate to the selected page
        await page.goto(this.url);        
        // Get the link to all the required books
        let links = await page.evaluate(() => {
			let Element = Array.from(document.body.querySelectorAll('a'), (el) => el.href);    
			return Array.from(new Set(Element));
		});
		for (let i = 0; i < links.length; i++) {
			const url_split = links[i].split("/");			
			if (typeof url_split[4] != "undefined"){
				if(links[i].includes("baloncesto")){
					const newUrl = "http:/"+url_split[1]+"/"+url_split[2]+"/"+url_split[3]+"/"+url_split[4];
					dataUrl.push(newUrl);
				}
			}
		}		
		for (let i = 0; i < dataUrl.length ; i++) {		
			
			const url = dataUrl[i];
			const url_split = url.split("/");
			console.log(i);
			const browser = await puppeteer.launch();
			const page = await browser.newPage();
			await page.goto(url);			
			let links2 = await page.evaluate(() => {
				let Element = Array.from(document.body.querySelectorAll('a'), (el) => el.href);    
				return Array.from(new Set(Element));
			});			
			console.log(url_split[4]);			
			for (let j = 0; j < links2.length; j++) {
				if(links2[j].includes(url_split[4])){
					const url_split2 = links2[j].split("/");
					if (typeof url_split2[6] != "undefined" ){
						console.log(links2[j]+"resultados");						
						data = {
						  url:links2[j]+"resultados"
						}						
						newDataUrl.push(data);
					}
				}
			}
			await browser.close();		
		  }		
		
		console.log(newDataUrl);
		
		fs.writeFile('baloncesto_links.json', JSON.stringify(newDataUrl), function(err){
		  if (err) throw err;
		  console.log('The "data to append" was appended to file!');
		});
		
	}
}

module.exports = scraperObject;