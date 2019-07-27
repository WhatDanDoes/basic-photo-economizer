describe('authentication', () => {

  // 2019-6-25 https://labs.chiedo.com/post/async-mocha-tests/
  var mochaAsync = (fn) => {
    return done => {
      fn.call().then(done, err => {
        done(err);
      });
    };
  };

  describe('landing page', () => {
    beforeAll(mochaAsync(async () => {
      await device.reloadReactNative();
    }));

    it('has a login-through-web-app message', async () => {
      await expect(element(by.id('login-message'))).toBeVisible();
      await expect(element(by.text('Authenticate through a dependent web application'))).toBeVisible();
    });
  
    it('does not have a logout-button on the screen', async () => {
      await expect(element(by.id('logout-button'))).toBeNotVisible();
    });
  });


  describe('web app login', () => {
    // NOTE the wonky escaped & in the query string
    const URL = `bpe://bpe?token=somejwtstring\\&domain=${encodeURIComponent('https://example.com')}`;

    beforeEach(mochaAsync(async () => {
      await device.reloadReactNative();
    }));

    it('opens the app by clicking a link when it\'s not running', mochaAsync(async () => {
      await device.launchApp({ url: URL, newInstance: true });
      await expect(element(by.id('camera'))).toBeVisible();
    }));
 
    it('displays authentication-overlay', mochaAsync(async () => {
      await expect(element(by.id('authentication-overlay'))).toBeNotVisible();
      await device.launchApp({ url: URL, newInstance: true });
      // Don't think this is doing anything
      await waitFor(element(by.id('authentication-overlay'))).toBeVisible();
      //expect(element(by.id('authentication-overlay'))).toBeVisible();
    }));

    describe('success', () => {
      beforeEach(mochaAsync(async () => {
        await device.launchApp({ url: URL, newInstance: true });
      }));

      it('does not display the login-message', mochaAsync(async () => {
        await expect(element(by.id('login-message'))).toBeNotVisible();
      }));

      it('displays a welcome flash message', mochaAsync(async () => {
        await waitFor(element(by.id('flash-message'))).toBeVisible()
        await expect(element(by.text('Posting to https://example.com'))).toBeVisible();
      }));

      it('displays the camera and take-picture button', mochaAsync(async () => {
        await waitFor(element(by.id('camera'))).toBeVisible();
        await expect(element(by.id('camera'))).toBeVisible();
        await expect(element(by.id('take-picture-button'))).toBeVisible();
      }));

      it('has a logout-button on the screen', mochaAsync(async () => {
        await expect(element(by.id('logout-button'))).toBeVisible();
      }));

      it('has a web-link on the screen', mochaAsync(async () => {
        await expect(element(by.id('web-link-button'))).toBeVisible();
      }));


      describe('logout-button', () => {
        it('shows the login-through-web-app message and displays a farewell message', mochaAsync(async () => {
          await expect(element(by.id('logout-button'))).toBeVisible();
          await element(by.id('logout-button')).tap();
          await expect(element(by.id('login-message'))).toBeVisible();
          await expect(element(by.text('Cheerio!'))).toBeVisible();
        }));
      });
    });

    describe('failure', () => {
      beforeEach(mochaAsync(async () => {
        await device.launchApp({ url: 'bpe://bpe', newInstance: true });
      }));

      it('displays the login-message', mochaAsync(async () => {
        await expect(element(by.id('login-message'))).toBeVisible();
        await expect(element(by.text('Authenticate through a dependent web application'))).toBeVisible();
      }));

      it('does not display the camera or take-picture-button', mochaAsync(async () => {
        await expect(element(by.id('camera'))).toBeNotVisible(); await expect(element(by.id('take-picture-button'))).toBeNotVisible();
      }));

      it('displays an error message', mochaAsync(async () => {
        await waitFor(element(by.id('flash-message'))).toBeVisible()
        await expect(element(by.text('Authentication failed. Login through the web app'))).toBeVisible();
      }));

      it('does not have a logout-button on the screen', async () => {
        await expect(element(by.id('logout-button'))).toBeNotVisible();
      });
    });
  });

//  /**
//   * Ensure the app is still logged in on app wake-up.
//   * If not, display the login screen.
//   * Very touchy... tests are order dependent
//   */
//
////  describe('token status check', () => {
////    beforeAll(mochaAsync(async () => {
////      await device.reloadReactNative();
////
////      await waitFor(element(by.id('login-form'))).toBeVisible();
////      await waitFor(element(by.id('email-input'))).toBeVisible();
////      await element(by.id('email-input')).typeText('someguy@example.com');
////      await element(by.id('password-input')).typeText('secret');
////      await element(by.id('login-button')).tap();
////      await waitFor(element(by.id('camera'))).toBeVisible();
////    }));
////
////    beforeEach(mochaAsync(async () => {
////      await device.sendToHome();
////      await device.launchApp({newInstance: false});
////    }));
////
////    it('shows the camera when token is successfully refreshed', mochaAsync(async () => {
////      await expect(element(by.id('camera'))).toBeVisible();
////      await expect(element(by.id('take-picture-button'))).toBeVisible();
////    }));
////  
////    it('shows the login screen when token is not successfully refreshed', mochaAsync(async () => {
////      await expect(element(by.id('login-form'))).toBeVisible();
////    }));
////
////    it('shows the login screen when token refresh throws an error', mochaAsync(async () => {
////      await expect(element(by.id('login-form'))).toBeVisible();
////    }));
////  });
});


