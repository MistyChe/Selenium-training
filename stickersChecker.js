const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');

let
  productItemsAmount;

let driver;


test.describe('Litecart stickers finder', function() {
   test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();
  });

  it('should go to main page', function () {
    return driver.get('http://localhost/litecart/');
  });

  it('should count all menu items', function () {
    return driver.findElements(By.css('.product'))
      .then(productItems => {
        productItemsAmount = productItems.length;
        console.log('All products:', productItemsAmount, '\n');

        stickerCheck(0);
      });
  });
});

function stickerCheck(stickerIndex) {
  test.describe('Check product sticker', function() {

    it('should check product sticker item #' + (stickerIndex + 1), function() {
      return driver.findElements(By.css('.product'))
        .then(elements => elements[stickerIndex])
        .then(productItem => productItem.findElement(By.css('.sticker')))
        .then(() => {
          stickerIndex++;

          if (stickerIndex < productItemsAmount) {
            stickerCheck(stickerIndex);
          } else {
            driver.quit();
          }
        });
    });

  });
}
