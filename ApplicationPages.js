const {Builder, By} = require('selenium-webdriver');

const getRandomNumber = (arrLength) => Math.floor(Math.random() * arrLength);

var Application = function () {
  const driver = new Builder().forBrowser('chrome').build();

  this.driver = driver;

  this.mainPage = {
    open: () => driver.get('http://localhost/litecart/'),

    addProductIntoCart: () => {
      let quantity;

      return driver.findElements(By.css('.product .link'))
        .then(products => products[getRandomNumber(products.length)].click())
        .then(_ => driver.findElements(By.name('options[Size]')))
        .then(selectSize => {
          if (selectSize.length) {
            return selectSize[0].findElement(By.css('[value="Medium"]')).click()
          }
        })
        .then(_ => driver.findElement(By.css('#cart .quantity')).getText())
        .then(quantityNumber => quantity = quantityNumber)
        .then(_ => driver.findElement(By.name('add_cart_product')).click())
        .then(_ => driver.wait(function() {
          return driver.findElement(By.css('#cart .quantity')).getText()
            .then(function(quantityNumber) {
              return quantityNumber !== quantity;
            });
        }, 5000))
        .then(_ => driver.findElement(By.css('#logotype-wrapper a')).click());
    },

    goToUserChart: () => driver.findElement(By.linkText('Checkout »')).click(),

    removeProductFromCart: () => {
      let orderListLength;

      return driver.findElements(By.css('#order_confirmation-wrapper tr'))
        .then(tableRows => orderListLength = tableRows.length)
        .then(_ => driver.findElements(By.name('remove_cart_item')))
        .then(removeCartItemButton => {
          if (removeCartItemButton.length) {
            removeCartItemButton[0].click();

            return true;
          } else {
            return false;
          }
        })
        .then(isButtonPresent => {
          if (isButtonPresent) {
            return driver.wait(function() {
              return driver.findElements(By.css('#order_confirmation-wrapper tr'))
                .then(function(tableRows) {
                  return orderListLength !== tableRows.length;
                });
            }, 5000);
          }
        });
    }
  }
};

module.exports = new Application();
