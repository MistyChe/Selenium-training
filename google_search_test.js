

const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');

test.describe('Google Search', function() {
  let driver;

  test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();
  });

  // You can write tests either using traditional promises.
  it('works with promises', function() {
    return driver.get('http://www.google.com')
        .then(_ => driver.findElement(By.name('q')).sendKeys('webdriver'))
        .then(_ => driver.findElement(By.name('btnG')).click())
        .then(_ => driver.wait(until.titleIs('webdriver - Поиск в Google'), 1000));
  });

  // Or you can define the test as a generator function. The test will wait for
  // any yielded promises to resolve before invoking the next step in the
  // generator.
  test.it('works with generators', function*() {
    yield driver.get('http://www.google.com/ncr');
    yield driver.findElement(By.name('q')).sendKeys('webdriver');
    yield driver.findElement(By.name('btnG')).click();
    yield driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  });

  test.after(() => driver.quit());
});
