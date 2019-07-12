describe('send', () => {

  // 2019-6-25 https://labs.chiedo.com/post/async-mocha-tests/
  var mochaAsync = (fn) => {
    return done => {
      fn.call().then(done, err => {
        done(err);
      });
    };
  };

  /**
   * This is super experimental. I need to provide pre-cooked responses, so I
   * enclosed hypotheticals in the mock (i.e., `../lib/Api.e2e.js`). 
   * The tests that follow are order-dependent and probably brittle.
   * What better way is there than this?
   */
  describe('send-button', () => {
    beforeAll(mochaAsync(async () => {
      await device.reloadReactNative();

      // Login
      await element(by.id('email-input')).typeText('someguy@example.com');
      await element(by.id('password-input')).typeText('secret');
      await element(by.id('login-button')).tap();
    }));

    describe('successful send', () => {
      beforeEach(mochaAsync(async () => {
        await element(by.id('take-picture-button')).tap();
        await waitFor(element(by.id('send-button'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('image-preview'))).toBeVisible()
      }));

      it('displays sending-message-modal', mochaAsync(async () => {
        await expect(element(by.id('sending-message-overlay'))).toBeNotVisible();
        await element(by.id('send-button')).tap();
        await waitFor(element(by.id('sending-message-overlay'))).toBeVisible();
      }));

      it('sends a POST to the designated API endpoint and returns to camera screen', mochaAsync(async () => {
        await expect(element(by.id('image-preview'))).toBeVisible();
        await expect(element(by.id('camera'))).toBeNotVisible();
        await element(by.id('send-button')).tap();
        await expect(element(by.id('image-preview'))).toBeNotVisible();
        await expect(element(by.id('camera'))).toBeVisible();
      }));

      it('shows a flash message on successful image submission', mochaAsync(async () => {
        await waitFor(element(by.text('Image sent'))).toBeNotVisible();
        await element(by.id('send-button')).tap()
        await waitFor(element(by.id('flash-message'))).toBeVisible()
        await expect(element(by.text('Image sent'))).toBeVisible();
      }));
    });


    describe('unsuccessful send', () => {
      beforeEach(mochaAsync(async () => {
        await element(by.id('take-picture-button')).tap();
        await waitFor(element(by.id('send-button'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('image-preview'))).toBeVisible()
      }));


      it('shows a flash message on failed image submission', mochaAsync(async () => {
        await waitFor(element(by.text('Image could not be sent'))).toBeNotVisible();
        await element(by.id('send-button')).tap()
        await waitFor(element(by.id('flash-message'))).toBeVisible()
        await expect(element(by.text('Image could not be sent'))).toBeVisible();
      }));

      it('shows a flash message on exception thrown during image submission', mochaAsync(async () => {
        await waitFor(element(by.text('Image could not be sent'))).toBeNotVisible();
        await element(by.id('send-button')).tap()
        await waitFor(element(by.id('flash-message'))).toBeVisible()
        await expect(element(by.text('OH NO! AN ERROR!'))).toBeVisible();
      }));
    });
  });
});
