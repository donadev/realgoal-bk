const puppeteer = require('puppeteer-core')
const os = require("os");

const obtainPage = async function(url, selectorToWaitFor) {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox'], executablePath: `/opt/render/project/src/.cache/puppeteer/chrome-headless-shell/linux-123.0.6312.105/chrome-headless-shell-linux64/chrome-headless-shell`});
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
