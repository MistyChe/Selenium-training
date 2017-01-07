const {Builder, By} = require('selenium-webdriver');
const assert = require('assert');
const test = require('selenium-webdriver/testing');

let
  productTitle,
  productOldPriceAmount,
  productOldPriceColor,
  productOldTextDecoration,
  productActualPriceAmount,
  productActualPriceColor;

let driver;

test.describe('Litecart open main page', function() {
  test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();
  });

  it('should go to main page', function () {
    return driver.get('http://localhost/litecart/');
  });

  it('should get all Campaigns product parameters', function () {
    let product = driver.findElement(By.css('#box-campaigns li:first-child'));

    return product.findElement(By.css('.name')).getText()
      .then(text => productTitle = text)
      .then(() => product.findElement(By.css('.regular-price')).getText())
      .then(text => productOldPriceAmount = text)
      .then(() => product.findElement(By.css('.regular-price')).getCssValue("color"))
      .then(color => productOldPriceColor = color)
      .then(() => product.findElement(By.css('.regular-price')).getCssValue("font-size"))
      .then(fontSize => productOldFontSize = fontSize)
      .then(() => product.findElement(By.css('.regular-price')).getCssValue("text-decoration"))
      .then(textDecoration => productOldTextDecoration = textDecoration)
      .then(() => product.findElement(By.css('.campaign-price')).getText())
      .then(text => productActualPriceAmount = text)
      .then(() => product.findElement(By.css('.campaign-price')).getCssValue("color"))
      .then(color => productActualPriceColor = color)
      .then(() => product.findElement(By.css('.campaign-price')).getCssValue("font-size"))
      .then(fontSize => productActualFontSize = fontSize)
      .then(() => product.findElement(By.css('.campaign-price')).getCssValue("font-weight"))
      .then(fontWeight => productActualFontWeight = fontWeight);
  });

  it('should check product Old and Actual price styles on main page', function () {
    assert(productOldPriceColor === 'rgba(119, 119, 119, 1)', 'productActualPriceColor is not rgba(119, 119, 119, 1), but now ' + productOldPriceColor);
    assert(productActualPriceColor === 'rgba(204, 0, 0, 1)', 'productActualPriceColor is not rgba(204, 0, 0, 1), but now ' + productActualPriceColor);
    assert(parseFloat(productActualFontSize) > parseFloat(productOldFontSize), 'actual price font size is not bigger than old');
    assert(productOldTextDecoration === 'line-through', 'text-decoration of old price is not line-through, but now ' + productOldTextDecoration);
    assert(productActualFontWeight === 'bold', 'font weight of actual price is not bold, but now ' + productActualFontWeight);
  });

  it('should go to product page and check it title', function () {
    return driver.findElement(By.css('#box-campaigns li:first-child a')).click()
      .then(() => driver.findElement(By.css('h1')).getText())
      .then(title => assert(title === productTitle, 'should be equal to "Yellow duck"'));
  });

  it('should check product Actual and Old prices amount on main page and product page', function () {
    return driver.findElement(By.css('.regular-price')).getText()
      .then(text => assert(productOldPriceAmount === text, 'product OLd price amount on main page and on product page are not the same'))
      .then(() => driver.findElement(By.css('.campaign-price')).getText())
      .then(text => assert(productActualPriceAmount = text, 'product Actual price amount on main page and on product page are not the same'));
  });

  it('should get product Actual and Old prices styles on product page', function () {
    return driver.findElement(By.css('.regular-price')).getCssValue("color")
      .then(color => productOldPriceColor = color)
      .then(() => driver.findElement(By.css('.regular-price')).getCssValue("font-size"))
      .then(fontSize => productOldFontSize = fontSize)
      .then(() => driver.findElement(By.css('.regular-price')).getCssValue("text-decoration"))
      .then(textDecoration => productOldTextDecoration = textDecoration)
      .then(() => driver.findElement(By.css('.campaign-price')).getCssValue("color"))
      .then(color => productActualPriceColor = color)
      .then(() => driver.findElement(By.css('.campaign-price')).getCssValue("font-size"))
      .then(fontSize => productActualFontSize = fontSize)
      .then(() => driver.findElement(By.css('.campaign-price')).getCssValue("font-weight"))
      .then(fontWeight => productActualFontWeight = fontWeight);
  });

  it('should check product Actual and Old price styles on product page', function () {
    assert(productOldPriceColor === 'rgba(102, 102, 102, 1)', 'productActualPriceColor is not rgba(102, 102, 102, 1), but now ' + productOldPriceColor);
    assert(productActualPriceColor === 'rgba(204, 0, 0, 1)', 'productActualPriceColor is not rgba(204, 0, 0, 1), but now ' + productActualPriceColor);
    assert(parseFloat(productActualFontSize) > parseFloat(productOldFontSize), 'actual price font size is not bigger than old');
    assert(productOldTextDecoration === 'line-through', 'text-decoration of old price is not line-through, but now ' + productOldTextDecoration);
    assert(productActualFontWeight === 'bold', 'font weight of actual price is not bold, but now ' + productActualFontWeight);
  });

  test.after(() => driver.quit());
});

