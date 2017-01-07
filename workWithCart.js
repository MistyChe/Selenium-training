const {Builder, By} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');

let driver;

let getRandomNumber = function (arrLength) {
  return Math.floor(Math.random() * arrLength);
};

test.describe('Litecart open main page', function() {

  test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();
  });

  it('should go to main page', function () {
    return driver.get('http://localhost/litecart/');
  });

  let addProductIntoCart = function () {
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
  };

  it('should add the first product into cart', addProductIntoCart);

  it('should add the second product into cart', addProductIntoCart);

  it('should add the third product into cart', addProductIntoCart);

  it('should go to cart page', function() {
    return driver.findElement(By.linkText('Checkout »')).click();
  });

  let removeProductFromCart = function () {
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
  };

  it('should delete first (or more) product from the cart', removeProductFromCart);

  it('should delete second (or nothing) product from the cart', removeProductFromCart);

  it('should delete third (or nothing) product from the cart', removeProductFromCart);

  test.after(() => driver.quit());
});
