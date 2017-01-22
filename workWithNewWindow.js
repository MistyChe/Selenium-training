const {Builder, By, until} = require('selenium-webdriver');
const assert = require('assert');
const test = require('selenium-webdriver/testing');

let mainWindow;

let driver;

test.describe('Litecart admin login', function() {
   test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();

     return driver.getWindowHandle()
       .then(windowId => (mainWindow = windowId));
  });

  it('should login into adminpanel', function() {
    return driver.get('http://localhost/litecart/admin/')
      .then(_ => driver.findElement(By.name('username')).sendKeys('admin'))
      .then(_ => driver.findElement(By.name('password')).sendKeys('admin'))
      .then(_ => driver.findElement(By.name('login')).click());
  });

  it('should go to Countries page', function() {
    return driver.get('http://localhost/litecart/admin/?app=countries&doc=countries')
  });

  it('should click on "Add new country" button and open new county page', function() {
    return driver.findElement(By.linkText('Add New Country')).click()
      .then(_ => driver.findElement(By.css('h1')).getText())
      .then(text => assert(text === 'Add New Country', 'New country page is not opened'));
  });

  it('should click on "Code (ISO 3166-1 alpha-2)" external link', function() {
    return driver.findElement(By.css('[href$="ISO_3166-1_alpha-2"]')).click()
      .then(moveToAnotherWindow)
      .then(moveToMainWindow);
  });

  it('should click on "Code (ISO 3166-1 alpha-3)" external link', function() {
    return driver.findElement(By.css('[href$="ISO_3166-1_alpha-3"]')).click()
      .then(moveToAnotherWindow)
      .then(moveToMainWindow);
  });

  it('should click on "Tax ID Format" external link', function() {
    return driver.findElements(By.css('[href$="Regular_expression"]'))
      .then(links => links[0].click())
      .then(moveToAnotherWindow)
      .then(moveToMainWindow);
  });

  it('should click on "Address Format (?)" external link', function() {
    return driver.findElement(By.css('[href$="address-formats.html"]')).click()
      .then(moveToAnotherWindow)
      .then(moveToMainWindow);
  });

  it('should click on "Postcode Format" external link', function() {
    return driver.findElements(By.css('[href$="Regular_expression"]'))
      .then(links => links[1].click())
      .then(moveToAnotherWindow)
      .then(moveToMainWindow);
  });

  it('should click on "Currency Code" external link', function() {
    return driver.findElement(By.css('[href$="List_of_countries_and_capitals_with_currency_and_language"]')).click()
      .then(moveToAnotherWindow)
      .then(moveToMainWindow);
  });

  it('should click on "Phone Country Code" external link', function() {
    return driver.findElement(By.css('[href$="List_of_country_calling_codes"]')).click()
      .then(moveToAnotherWindow)
      .then(moveToMainWindow);
  });

  test.after(() => driver.quit());
});

function moveToAnotherWindow() {
  return driver.wait(function() {
    return driver.getAllWindowHandles()
      .then(function(windowIds) {
        return windowIds.length > 1;
      });
  }, 5000)
    .then(_ => driver.getAllWindowHandles())
    .then(windowIds => windowIds.filter(windowId => windowId !== mainWindow)[0])
    .then(anotherWindowId => driver.switchTo().window(anotherWindowId));
}

function moveToMainWindow() {
  return driver.close()
    .then(_ => driver.switchTo().window(mainWindow))
    .then(_ => driver.findElement(By.css('h1')).getText())
    .then(text => assert(text === 'Add New Country', 'Return to New country page is not performed'));
}