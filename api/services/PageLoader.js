const puppeteer = require('puppeteer')
const os = require("os");

const obtainPage = async function(url, selectorToWaitFor) {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', "--proxy-server='direct://'", '--proxy-bypass-list=*']});
    const page = await browser.newPage()
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
