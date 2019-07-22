describe('authentication', () => {

  // 2019-6-25 https://labs.chiedo.com/post/async-mocha-tests/
  var mochaAsync = (fn) => {
    return done => {
      fn.call().then(done, err => {
        done(err);
      });
    };
  };

  describe('login form', () => {
    beforeAll(mochaAsync(async () => {
      await device.reloadReactNative();
    }));

    it('has a login form on the screen', mochaAsync(async () => {
      await expect(element(by.id('login-form'))).toBeVisible();
      await expect(element(by.id('email-input'))).toBeVisible();
      await expect(element(by.id('password-input'))).toBeVisible();
      await expect(element(by.id('login-button'))).toBeVisible();
    }));
  
    it('does not have a logout-button on the screen', async () => {
      await expect(element(by.id('logout-button'))).toBeNotVisible();
    });
  });


  describe('login-button', () => {
    beforeEach(mochaAsync(async () => {
      await device.reloadReactNative();
    }));

//    it('displays authentication-overlay', mochaAsync(async () => {
//      await expect(element(by.id('authentication-overlay'))).toBeNotVisible();
//      await element(by.id('email-input')).typeText('someguy@example.com');
//      await element(by.id('password-input')).typeText('secret');
//      element(by.id('login-button')).tap();
//      expect(element(by.id('authentication-overlay'))).toBeVisible();
//      //await waitFor(element(by.id('authentication-overlay'))).toBeVisible();
//    }));

    describe('success', () => {
      beforeEach(mochaAsync(async () => {
        await device.launchApp({ delete: true });
        await element(by.id('email-input')).typeText('someguy@example.com');
        await element(by.id('password-input')).typeText('secret');
      }));

      it('does not display the login-form', mochaAsync(async () => {
        await element(by.id('login-button')).tap();
        await expect(element(by.id('login-form'))).toBeNotVisible();
      }));

      it('displays a welcome flash message', mochaAsync(async () => {
        await element(by.id('login-button')).tap();
        await waitFor(element(by.id('flash-message'))).toBeVisible()
        await expect(element(by.text('Hello, someguy@example.com!'))).toBeVisible();
      }));

      it('displays the camera and take-picture button', mochaAsync(async () => {
        await element(by.id('login-button')).tap();
        await waitFor(element(by.id('camera'))).toBeVisible();
        await expect(element(by.id('camera'))).toBeVisible();
        await expect(element(by.id('take-picture-button'))).toBeVisible();
      }));

      it('has a logout-button on the screen', mochaAsync(async () => {
        await element(by.id('login-button')).tap();
        await expect(element(by.id('logout-button'))).toBeVisible();
      }));

      describe('logout-button', () => {
        it('shows the login screen and displays a farewell message', mochaAsync(async () => {
          await element(by.id('login-button')).tap();
          await expect(element(by.id('logout-button'))).toBeVisible();
          await element(by.id('logout-button')).tap();
          await expect(element(by.id('login-form'))).toBeVisible();
          await expect(element(by.text('Cheerio!'))).toBeVisible();
        }));
      });
    });

    describe('failure', () => {
      beforeEach(mochaAsync(async () => {
        await device.launchApp({ delete: true });
        await element(by.id('email-input')).typeText('someguy@example.com');
        await element(by.id('password-input')).typeText('wrong');
      }));

      it('displays the login-form', mochaAsync(async () => {
        await element(by.id('login-button')).tap();
        await expect(element(by.id('login-form'))).toBeVisible();
      }));

      it('does not display the camera or take-picture-button', mochaAsync(async () => {
        await element(by.id('login-button')).tap();
        await expect(element(by.id('camera'))).toBeNotVisible(); await expect(element(by.id('take-picture-button'))).toBeNotVisible();
      }));

      it('displays an error message', mochaAsync(async () => {
        await element(by.id('login-button')).tap();
        await waitFor(element(by.id('flash-message'))).toBeVisible()
        await expect(element(by.text('Invalid email or password'))).toBeVisible();
      }));

      it('does not have a logout-button on the screen', async () => {
        await element(by.id('login-button')).tap();
        await expect(element(by.id('logout-button'))).toBeNotVisible();
      });
    });
  });

  /**
   * Ensure the app is still logged in on app wake-up.
   * If not, display the login screen.
   * Very touchy... tests are order dependent
   */

//  describe('token status check', () => {
//    beforeAll(mochaAsync(async () => {
//      await device.reloadReactNative();
//
//      await waitFor(element(by.id('login-form'))).toBeVisible();
//      await waitFor(element(by.id('email-input'))).toBeVisible();
//      await element(by.id('email-input')).typeText('someguy@example.com');
//      await element(by.id('password-input')).typeText('secret');
//      await element(by.id('login-button')).tap();
//      await waitFor(element(by.id('camera'))).toBeVisible();
//    }));
//
//    beforeEach(mochaAsync(async () => {
//      await device.sendToHome();
//      await device.launchApp({newInstance: false});
//    }));
//
//    it('shows the camera when token is successfully refreshed', mochaAsync(async () => {
//      await expect(element(by.id('camera'))).toBeVisible();
//      await expect(element(by.id('take-picture-button'))).toBeVisible();
//    }));
//  
//    it('shows the login screen when token is not successfully refreshed', mochaAsync(async () => {
//      await expect(element(by.id('login-form'))).toBeVisible();
//    }));
//
//    it('shows the login screen when token refresh throws an error', mochaAsync(async () => {
//      await expect(element(by.id('login-form'))).toBeVisible();
//    }));
//  });
});


