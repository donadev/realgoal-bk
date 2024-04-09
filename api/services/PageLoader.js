const puppeteer = require('puppeteer')

const obtainPage = async function(url) {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
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
