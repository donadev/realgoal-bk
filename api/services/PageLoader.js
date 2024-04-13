const puppeteer = require('puppeteer')
const os = require("os");

const obtainPage = async function(url, selectorToWaitFor) {
    const browser = await puppeteer.launch({headless: 'new', args: ["--proxy-server='direct://'", '--proxy-bypass-list=*']});
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36')
    let content = null

    try {
        page.goto(url).then(console.log).catch(console.error)
        await page.waitForSelector(selectorToWaitFor)
        content = await page.content();
        console.log("Content fetched for url", url, "response size", content.length)
    } catch (error) {
        console.error("Error", error)
    } finally {
        await browser.close();
    }
    return content
}

module.exports = { obtainPage };
