const puppeteer = require("puppeteer");

const obtainPage = async function(url) {
    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Additional arguments
      });
    const page = await browser.newPage()
    let content = null
    try {
        await page.goto(url)
        content = await page.content();
    } catch (error) {
        console.error("Error", error)
    } finally {
        await browser.close();
    }
    return content
}

module.exports = { obtainPage };