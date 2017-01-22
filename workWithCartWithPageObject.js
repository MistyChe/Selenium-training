const { driver, mainPage } = require('./ApplicationPages');

const test = require('selenium-webdriver/testing');

test.describe('Litecart open main page', function() {
  it('should go to main page', function () {
    return mainPage.open();
  });

  it('should add the first product into cart', mainPage.addProductIntoCart);

  it('should add the second product into cart', mainPage.addProductIntoCart);

  it('should add the third product into cart', mainPage.addProductIntoCart);

  it('should go to cart page', mainPage.goToUserChart);

  it('should delete first (or more) product from the cart', mainPage.removeProductFromCart);

  it('should delete second (or nothing) product from the cart', mainPage.removeProductFromCart);

  it('should delete third (or nothing) product from the cart', mainPage.removeProductFromCart);

  test.after(() => driver.quit());
});
