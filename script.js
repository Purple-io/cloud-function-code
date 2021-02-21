/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const puppeteer = require('puppeteer');

scrapeFunc = (async (tweetUrl) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
  
    await page.goto(tweetUrl, { waitUntil: 'networkidle2' });
  
    const results = await page.$$eval('article div[lang]', (tweets) => tweets.map((tweet) => tweet.textContent));
    const result = results[0]
    console.log(result);
    browser.close();
    return result;
  });

exports.runScrape = (async (req, res) => {
  let tweetUrl = req.body.tweetUrl;
  let result = await scrapeFunc(tweetUrl);
  if (result === undefined || result === null) {
      res.status(400).send({"result": ""});
      return;
  }
  res.status(200).send({"result": result});
});
