const {Builder, By, until} = require('selenium-webdriver');
const assert = require('assert');
const test = require('selenium-webdriver/testing');
const path = require('path');

let
  driver,
  appRoot = path.resolve(__dirname);


test.describe('Litecart admin login, add new product and check it was created', function() {
  test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();
  });

  it('should login into adminpanel', function () {
    return driver.get('http://localhost/litecart/admin/')
      .then(_ => driver.findElement(By.name('username')).sendKeys('admin'))
      .then(_ => driver.findElement(By.name('password')).sendKeys('admin'))
      .then(_ => driver.findElement(By.name('login')).click());
  });
  
  it('should click "Add New Product" button', function () {
    return driver.findElement(By.linkText('Catalog')).click()
      .then(_ => driver.findElement(By.linkText('Add New Product')).click());
  });

  it('should fill in General tab', function () {
    return driver.findElement(By.css('[name="status"][value="1"]')).click()
      .then(_ => driver.findElement(By.name('name[en]')).sendKeys('Darth Vader duck'))
      .then(_ => driver.findElement(By.name('code')).sendKeys('DV007'))
      .then(_ => driver.findElement(By.css('[data-name="Rubber Ducks"]')).click())
      .then(_ => driver.findElement(By.css('[data-name="Subcategory"]')).click())
      .then(_ => driver.findElement(By.css('[name="product_groups[]"][value="1-1"]')).click())
      .then(_ => driver.findElement(By.name('quantity')).sendKeys('15'))
      .then(_ => driver.findElement(By.name('sold_out_status_id')).click())
      .then(_ => driver.findElement(By.css('[name="sold_out_status_id"] option[value="2"]')).click())
      .then(_ => driver.findElement(By.name('new_images[]')).sendKeys(appRoot + '\\files\\Darth-Vader-Rubber-Duck.jpg'))
      .then(_ => driver.findElement(By.name('date_valid_from')).sendKeys('15.01.2017'))
      .then(_ => driver.findElement(By.name('date_valid_to')).sendKeys('15.06.2017'))
  });

  it('should fill in Information tab', function () {
    return driver.findElement(By.linkText('Information')).click()
      .then(_ => driver.findElement(By.name('manufacturer_id')).click())
      .then(_ => driver.findElement(By.css('[name="manufacturer_id"] option[value="1"]')).click())
      .then(_ => driver.findElement(By.name('keywords')).sendKeys('Darth Vader duck'))
      .then(_ => driver.findElement(By.name('short_description[en]')).sendKeys('Duck Fadar Rubber Duck. Buy the feared ruler of the dark duck side. Wearing frightening helmet and lights up in the dark.'))
      .then(_ => driver.findElement(By.css('.trumbowyg-editor')).sendKeys('This Duck Fadar Rubber Duck is CE approved. All our rubber ducks are CE (Communauté Européenne) approved, according to EU legislation. This means that your rubber duck contains no harmful materials or toxic elements. Next to CE approval we have a very strict quality control to make sure your duck is manufactured in a safe environment by happy workers. This is not a teething toy for small children. Lights up in water!'))
      .then(_ => driver.findElement(By.name('head_title[en]')).sendKeys('Darth Vader'))
      .then(_ => driver.findElement(By.name('meta_description[en]')).sendKeys('Rubber Duck'))
  });

  it('should fill in Prices tab', function () {
    return driver.findElement(By.linkText('Prices')).click()
      .then(_ => driver.findElement(By.name('purchase_price')).clear())
      .then(_ => driver.findElement(By.name('purchase_price')).sendKeys('18'))
      .then(_ => driver.findElement(By.name('purchase_price_currency_code')).click())
      .then(_ => driver.findElement(By.css('[name="purchase_price_currency_code"] option[value="EUR"]')).click())
      .then(_ => driver.findElement(By.name('prices[USD]')).sendKeys('36'))
      .then(_ => driver.findElement(By.name('gross_prices[USD]')).sendKeys('5'))
  });

  it('should save new product', function () {
    return driver.findElement(By.name('save')).click()
  });

  it('should check new product has been added', function () {
    return driver.findElement(By.linkText('Darth Vader duck')).click()
      .then(_ => driver.findElement(By.css('h1')).getText())
      .then(text => assert(text === 'Edit Product: Darth Vader duck'))
  });

   test.after(() => driver.quit());
});
