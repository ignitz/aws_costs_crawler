require("dotenv").config();
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    //   await page.goto("http://console.aws.amazon.com/");
    //   await page.click("#iam_user_radio_button");
    //   await page.type("#resolving_input", "datasprintsdev");
    //   await page.click("#next_button");
    //   https://038715283734.signin.aws.amazon.com/console
    await page.goto("https://datasprintsdev.signin.aws.amazon.com/console");
    await page.type("#username", process.env.AWS_USER);
    await page.type("#password", process.env.AWS_PASSWORD);
    await page.click("#signin_button");
    await page.waitForNavigation();

    //   await page.click("#nav-usernameMenu");

    //   await page.waitForSelector("#aws-billing-console");

    //   await page.click("#aws-billing-console");
    //   await page.waitForNavigation();

    //   await page.click(
    //     "#billing-console-root > div > div > div.navigation--waI62.span2--3ul0Q > div > div.visibleLg--1cvP9 > div > ul > li:nth-child(13) > a"
    //   );

    //   await page.waitForSelector(
    //     "#billing-console-root > div > div > div.content--2j5zk.span10--28Agl > div > div > div > div > div > div:nth-child(3) > div > p > span"
    //   );

    //   //   await page.click(
    //   //     "#billing-console-root > div > div > div.navigation--waI62.span2--3ul0Q > div > div.visibleLg--1cvP9 > div > ul > li:nth-child(13) > a"
    //   //   );

    //   const span_credits = await page.$(
    //     "#billing-console-root > div > div > div.content--2j5zk.span10--28Agl > div > div > div > div > div > div:nth-child(3) > div > p > span"
    //   );
    //   const obj_span = await span_credits.getProperty("innerText");
    //   const credits = await obj_span.jsonValue();
    //   console.log(credits);

    //   Now go to Cost Explorer
    console.log("Go to Cost Reports page");
    await page.goto("https://console.aws.amazon.com/cost-reports/home");

    //   Clica no cantinho do coletix account
    console.log("Try to click in coletix info page");
    selector =
      "#c > div.ng-scope > div > div.app-min-width.ng-scope > home > page > div > ng-transclude > div > div > div.grid1 > div > insight-list > card > div > div.card-body > div > div:nth-child(2) > div.insight.ng-scope > a";
    await page.waitForSelector(selector);
    await page.click(selector);

    await page.waitFor(4000);

    selector =
      "body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltiptext > div";

    if ((await page.$(selector)) !== null) {
      console.log("Tutorial modal found, let's destroy it");
      selector =
        "body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-skipbutton";
      await page.waitForSelector(selector);
      await page.click(selector);

      await page.waitFor(1500);
    }

    console.log("Remove coletix tag in filter account");
    //   retira o filtro da conta do coletix
    selector =
      "#filtering > div > filter-panel > dim-list > div > div:nth-child(1) > dim-detail:nth-child(2) > div > div > div > dim > div > detail-default > div > div:nth-child(2) > div > div > chip > div > div.icon-remove-container.cursor.ng-scope";
    await page.waitForSelector(selector);
    await page.click(selector);

    await page.waitFor(4000);

    console.log("Group by Linked Account");
    // Clica em Linked Account
    selector =
      "#c > div.ng-scope > div > div.app-min-width.ng-scope > report > page > div > ng-transclude > div.forecast-container.ui-card.ng-scope > div > div > div.span9 > group-by > div > div.group-by-options-container > div.resizable > div:nth-child(3) > div";
    await page.waitForSelector(selector);
    await page.click(selector);

    await page.waitFor(4000);

    //   Pega dos dados queriados que queremos
    console.log("Geting the cost data in table");
    selector =
      "#report-table > costs-table > div.cost-table-view > div > div.table-body > div.right-container.scroll-x.scroll-y > table > tbody > tr.number.ng-scope.table-row--odd > td:nth-child(40)";
    await page.waitForSelector(selector);
    let datasprints_cost = await page.$(selector);
    datasprints_cost = await datasprints_cost.getProperty("innerText");
    datasprints_cost = await datasprints_cost.jsonValue();
    console.log(datasprints_cost);

    selector =
      "#report-table > costs-table > div.cost-table-view > div > div.table-body > div.right-container.scroll-x.scroll-y > table > tbody > tr:nth-child(3) > td:nth-child(40)";
    await page.waitForSelector(selector);
    let coletix_cost = await page.$(selector);
    coletix_cost = await coletix_cost.getProperty("innerText");
    coletix_cost = await coletix_cost.jsonValue();
    console.log(coletix_cost);

    await browser.close();

    // const response = {
    //   credits: { datasprints: datasprints_credits, coletix: coletix_credits },
    //   cost: {
    //     datasprints: datasprints_cost,
    //     coletix: coletix_cost
    //   }
    // };
    const response = {
      cost: {
        datasprints: datasprints_cost,
        coletix: coletix_cost
      }
    };

    console.log(response);

    return response;
  } catch (error) {
    console.error(error);
    await browser.close();
  }
})();
