const puppeteer = require('puppeteer')

const obtainPage = async function(url, selectorToWaitFor) {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
    const page = await browser.newPage()
    let content = null
    try {
        page.goto(url, { waitUntil: 'domcontentloaded' })
        await page.waitForSelector(selectorToWaitFor)
        content = await page.content();
        console.log("Content fetched for url", url)
    } catch (error) {
        console.error("Error", error)
    } finally {
        await browser.close();
    }
    return content
}

module.exports = { obtainPage };
