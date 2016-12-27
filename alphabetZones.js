const {Builder, By, until} = require('selenium-webdriver');
const assert = require('assert');
const test = require('selenium-webdriver/testing');

let
  countriesAmount,
  previousZone,
  zonesAmount,
  zonesItems;

let driver;


test.describe('Litecart admin login and check countries zones order in the Zones list', function() {
  test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();
  });

  it('should login into adminpanel', function () {
    return driver.get('http://localhost/litecart/admin/')
      .then(_ => driver.findElement(By.name('username')).sendKeys('admin'))
      .then(_ => driver.findElement(By.name('password')).sendKeys('admin'))
      .then(_ => driver.findElement(By.name('login')).click());
  });

  it('should go to Geo zones page', function () {
    return driver.get('http://localhost/litecart/admin/?app=geo_zones&doc=geo_zones')
  });


  it('should check alphabetical order for all countries', function () {
    return driver.findElements(By.css('form[name="geo_zones_form"] .row'))
      .then(countries => {
        countriesAmount = countries.length;
        console.log('All countries:', countriesAmount, '\n');

        zoneClicker(0);
      });
  });
});

function zoneClicker (countryIndex) {
  test.describe ('Check country with not null number of zones', function () {
    it ('should open needed country', function () {
      return driver.findElements(By.css('form[name="geo_zones_form"] .row a:not([title="Edit"])'))
        .then(countryLinks => countryLinks[countryIndex].click())
        .then(() => driver.findElements(By.css('form[name="form_geo_zone"] select[name*="zone_code"] option[selected="selected"]')))
        .then(zones => {
            zonesAmount = zones.length;
            zonesItems = zones;
        })
        .then(() => {
          countryIndex++;
          zoneChecker (countryIndex, 0);
        });
    })
  });
}

function zoneChecker (countryIndex, zoneNameIndex) {
  test.describe ('Compare order of two instances', function () {
    it ('should compare two zone names according to the alphabet', function () {
      return zonesItems[zoneNameIndex]
        .getText()
        .then(zoneName => {
          if (previousZone) {
            let isZoneNameWrongOrder = previousZone < zoneName;

            assert(isZoneNameWrongOrder, zoneName + ' should be after ' + previousZone);
          }

          previousZone = zoneName;
        })
        .then(() => {
          zoneNameIndex++;

          if (zoneNameIndex < zonesAmount) {
            zoneChecker (countryIndex, zoneNameIndex);
          } else if (countryIndex < countriesAmount) {
            previousZone = null;

            driver.navigate().back()
              .then(() => zoneClicker (countryIndex));
          } else {
            driver.quit();
          }
        })
        .catch(error => {
          driver.quit();

          return error;
        })
        .then(error => {
          if (error) throw error;
        });
    });
  });
}
