const {Builder, By, until} = require('selenium-webdriver');
const assert = require('assert');
const test = require('selenium-webdriver/testing');

let driver;

test.describe('Litecart open main poge', function() {
  test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();
  });

  it('should go to main page', function () {
    return driver.get('http://localhost/litecart/');
  });

  it('should create new account', function () {
    return driver.findElement(By.linkText('New customers click here')).click()
      .then(_ => driver.findElement(By.name('firstname')).sendKeys('Iryna'))
      .then(_ => driver.findElement(By.name('lastname')).sendKeys('Havrylova'))
      .then(_ => driver.findElement(By.name('address1')).sendKeys('maidan Nezalezhnosti, 1'))
      .then(_ => driver.findElement(By.name('postcode')).sendKeys('98612'))
      .then(_ => driver.findElement(By.name('city')).sendKeys('Kharkiv'))
      .then(_ => driver.findElement(By.css('.select2')).click())
      .then(_ => driver.wait(until.elementLocated(By.css('.select2-search__field'), 3000)))
      .then(_ => driver.findElement(By.css('.select2-search__field')).sendKeys('Wallis and'))
      .then(_ => driver.findElement(By.css('.select2-results li:first-child')).click())
      .then(_ => driver.findElement(By.name('email')).sendKeys('gavrilovairka@gmail.com'))
      .then(_ => driver.findElement(By.name('phone')).sendKeys('+681111111111'))
      .then(_ => driver.findElement(By.name('password')).sendKeys('password123'))
      .then(_ => driver.findElement(By.name('confirmed_password')).sendKeys('password123'))
      .then(_ => driver.findElement(By.name('create_account')).click());

  });

  it('should log out from created account', function () {
    return driver.findElement(By.linkText('Logout')).click();
  });

  it('should log in into new user account', function () {
    return driver.findElement(By.name('email')).sendKeys('gavrilovairka@gmail.com')
      .then (_ => driver.findElement(By.name('password')).sendKeys('password123'))
      .then(_ => driver.findElement(By.name('login')).click());
  });

  it('should log out from created account', function () {
    return driver.findElement(By.linkText('Logout')).click()
  });

  test.after(() => driver.quit());
});
