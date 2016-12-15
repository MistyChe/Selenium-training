const {Builder, By} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');

test.describe('Litecart admin login', function() {
  let driver;

  test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();
  });

  it('should login into adminpanel', function() {
    return driver.get('http://localhost/litecart/admin/')
        .then(_ => driver.findElement(By.name('username')).sendKeys('admin'))
        .then(_ => driver.findElement(By.name('password')).sendKeys('admin'))
        .then(_ => driver.findElement(By.name('login')).click());
    });

  test.after(() => driver.quit());
});
