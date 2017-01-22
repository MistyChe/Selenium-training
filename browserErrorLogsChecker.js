const {Builder, By} = require('selenium-webdriver');
const assert = require('assert');
const test = require('selenium-webdriver/testing');

let productLinkId = 0;

let driver;


test.describe('Browser errors log checker', function() {
   test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();
   });

  it('should login into Admin panel', function() {
    return driver.get('http://localhost/litecart/admin/')
      .then(_ => driver.findElement(By.name('username')).sendKeys('admin'))
      .then(_ => driver.findElement(By.name('password')).sendKeys('admin'))
      .then(_ => driver.findElement(By.name('login')).click());
  });

  it('should go to Catalog -> First category page', function() {
    return driver.get('http://localhost/litecart/admin/?app=catalog&doc=catalog&category_id=1');
  });

  it('should go to All product pages and check for console errors', function() {
    return openProductPage();
  });
});

function openProductPage() {
  test.describe ('Open product page', function () {
    it ('should go to product page, check error logs and return to Category page', function () {
      return driver.findElements(By.css('[href*="category_id=1&product_id="][title="Edit"]'))
        .then(productLinks => {
          if (productLinkId < productLinks.length) {
            return productLinks[productLinkId++].click()
              .then(checkBrowserLogs)
              .then(_ => driver.navigate().back())
              .then(openProductPage);
          } else {
            return driver.quit();
          }
        })
        .catch(error => {
          driver.quit();

          return error;
        })
        .then(error => {
          if (error) throw error;
        });
    });
  });
}

function checkBrowserLogs() {
  return driver.manage().logs().get('browser').then(function(errorLogsEntries) {
    assert(errorLogsEntries.length === 0, 'WARNING! ' + errorLogsEntries.length + ' ERRORS FOUND!');
  });
}