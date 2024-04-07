const puppeteer = require("puppeteer");

const obtainPage = async function(url) {
    let browser
    if (process.env.NODE_ENV !== 'development') {
        const chromium = require('@sparticuz/chromium')
        // Optional: If you'd like to disable webgl, true is the default.
        chromium.setGraphicsMode = false
        const puppeteer = require('puppeteer-core')
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        })
    } else {
        const puppeteer = require('puppeteer')
        browser = await puppeteer.launch({headless: 'new'})
    }
    const page = await browser.newPage()
    let content = null
    try {
        await page.goto(url)
        content = await page.content();
        console.log(content)
    } catch (error) {
        console.error("Error", error)
    } finally {
        await browser.close();
    }
    return content
}

module.exports = { obtainPage };