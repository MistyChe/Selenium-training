const {Builder, By, until} = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');

let
  menuLength,
  subMenuLength;

let driver;


test.describe('Litecart admin login', function() {
   test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();
  });

  it('should login into adminpanel', function () {
    return driver.get('http://localhost/litecart/admin/')
      .then(_ => driver.findElement(By.name('username')).sendKeys('admin'))
      .then(_ => driver.findElement(By.name('password')).sendKeys('admin'))
      .then(_ => driver.findElement(By.name('login')).click());
  });

  it('should count all menu items', function () {
    return driver.findElements(By.css('#box-apps-menu > li'))
      .then(menu => {
        menuLength = menu.length;
        console.log('All items', menuLength, '\n');

        menuItemClicker(0);
      });
  });
});

function menuItemClicker(menuItemIndex) {
  test.describe('Click menu item', function() {

    it('should click on menu item #' + menuItemIndex, function() {
      let mainText;

      return driver.findElements(By.css('#box-apps-menu > li > a'))
        .then(elements => elements[menuItemIndex])
        .then(menuItem => menuItem.click())
        .then(() => driver.findElement(By.css('h1')).getText())
        .then(h1 => mainText = h1)
        .then(() => driver.findElements(By.css('#box-apps-menu > li.selected li')))
        .then(subMenuItems => {
          subMenuLength  = subMenuItems.length;

          console.log(menuItemIndex + '.', mainText + '\n');

          if (subMenuLength) {
            subMenuItemClicker(menuItemIndex, 0);
          } else if (menuItemIndex + 1 < menuLength) {
            menuItemClicker(menuItemIndex + 1);
          } else {
            driver.quit();
          }
        });
    });

  });
}

function subMenuItemClicker(menuItemIndex, subMenuItemIndex) {
  test.describe('Click subMenu item', function() {

    it('should click on sub menu item #' + menuItemIndex + '.' + subMenuItemIndex, function() {

      return driver.findElements(By.css('li.selected > .docs a'))
        .then(elements => elements[subMenuItemIndex])
        .then(subMenuItem => subMenuItem.click())
        .then(() => driver.findElement(By.css('h1')).getText())
        .then(h1 => console.log('\t' + menuItemIndex + '.' + subMenuItemIndex + '.', h1 + '\n'))
        .then(() => {
          if (subMenuItemIndex + 1 < subMenuLength) {
            subMenuItemClicker(menuItemIndex, subMenuItemIndex + 1);
          } else if (menuItemIndex + 1 < menuLength) {
            menuItemClicker(menuItemIndex + 1);
          } else {
            driver.quit();
          }
        });
      
    });

  });
}

