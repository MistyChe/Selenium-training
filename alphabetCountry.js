const {Builder, By, until} = require('selenium-webdriver');
const assert = require('assert');
const test = require('selenium-webdriver/testing');

let
  previousCountry,
  countriesAmount,
  countriesItems,
  notNullZoneItems = [],
  previousZone,
  zonesAmount,
  zonesItems;

let driver;


test.describe('Litecart admin login and check countries order in the Countries list', function() {
  test.before(function *() {
    driver = yield new Builder().forBrowser('chrome').build();
  });

  it('should login into adminpanel', function () {
    return driver.get('http://localhost/litecart/admin/')
      .then(_ => driver.findElement(By.name('username')).sendKeys('admin'))
      .then(_ => driver.findElement(By.name('password')).sendKeys('admin'))
      .then(_ => driver.findElement(By.name('login')).click());
  });

  it('should go to Countries page', function () {
    return driver.get('http://localhost/litecart/admin/?app=countries&doc=countries')
  });

  it('should check alphabetical order for all countries', function () {
    return driver.findElements(By.css('table .row'))
      .then(countries => {
        countriesAmount = countries.length;
        countriesItems = countries;
        console.log('All countries:', countriesAmount, '\n');

        countryComparer(0);
      });
  });
});

function countryComparer (countryIndex) {
  test.describe ('Compare order of two instances', function () {
    it ('should compare two countries names according to the alphabet', function () {
      return countriesItems[countryIndex]
        .findElement(By.css('a:not([title="Edit"])'))
        .getText()
        .then(countryName => {
          if (previousCountry) {
            let isCountryWrongOrder = previousCountry < countryName;

            assert(isCountryWrongOrder, countryName + ' should be after ' +  previousCountry);
          }

          previousCountry = countryName;
        })
        .catch(error => {
          driver.quit();

          return error;
        })
        .then(error => {
          if (error) throw error;
        });
    });

    it ('should check if country has not null number of zones', function () {
      return countriesItems[countryIndex]
        .findElement(By.css('td:nth-child(6)'))
        .getText()
        .then(zoneNumber => {
          if (zoneNumber > 0) {
            notNullZoneItems.push(countryIndex);
          }

          countryIndex++;

          if (countryIndex < countriesAmount) {
            countryComparer(countryIndex);
          } else {
            zoneClicker(0);
          }
        })
    });
  });
}

function zoneClicker (zoneIndex) {
  test.describe ('Check country with not null number of zones', function () {
    it ('should open needed country', function () {
      let neededCountryLinkIndex = notNullZoneItems[zoneIndex];

      return driver.findElements(By.css('table .row a:not([title="Edit"])'))
        .then(countryLinks => countryLinks[neededCountryLinkIndex].click())
        .then(() => driver.findElements(By.css('#table-zones tr:not(.header):not(:last-child) td:nth-child(3)')))
        .then(zones => {
            zonesAmount = zones.length;
            zonesItems = zones;
        })
        .then(() => {
          zoneIndex++;
          zoneChecker (zoneIndex, 0);
        });
    })
  });
}

function zoneChecker (zoneIndex, zoneNameIndex) {
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
            zoneChecker (zoneIndex, zoneNameIndex);
          } else if (zoneIndex < notNullZoneItems.length) {
            previousZone = null;

            driver.navigate().back()
              .then(() => zoneClicker (zoneIndex));
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
