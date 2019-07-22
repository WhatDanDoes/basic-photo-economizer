describe('camera', () => {

  // 2019-6-25 https://labs.chiedo.com/post/async-mocha-tests/
  var mochaAsync = (fn) => {
    return done => {
      fn.call().then(done, err => {
        done(err);
      });
    };
  };

 beforeAll(mochaAsync(async () => {
    await device.reloadReactNative();
    // Login
    await element(by.id('email-input')).typeText('someguy@example.com');
    await element(by.id('password-input')).typeText('secret');
    await element(by.id('login-button')).tap();
  }));

  describe('take-picture-button', () => {
 
    beforeEach(mochaAsync(async () => {
      await device.launchApp({ newInstance: true });
    }));

    it('has a camera on the screen', mochaAsync(async () => {
      await expect(element(by.id('camera'))).toBeVisible();
    }));
  
    it('has a take-picture-button button on screen', async () => {
      await expect(element(by.id('take-picture-button'))).toBeVisible();
    });
  
    it('does not have a back-button on the screen', async () => {
      await expect(element(by.id('back-button'))).toBeNotVisible();
    });
  });


  describe('take-picture-button', () => {
    beforeEach(mochaAsync(async () => {
      await device.launchApp({ newInstance: true });
    }));

    /**
     * 2019-7-22 I have zero confidence this is actually testing the modal
     * The `waitFor` doesn't really seem to wait for anything
     */
    it('displays sending-message-modal', mochaAsync(async () => {
      await expect(element(by.id('sending-overlay'))).toBeNotVisible();
      await element(by.id('take-picture-button')).tap();
      await waitFor(element(by.id('sending-overlay'))).toBeVisible();
    }));


    it('displays the image captured and hides the camera', mochaAsync(async () => {
      await expect(element(by.id('camera'))).toBeVisible();
      await element(by.id('take-picture-button')).tap();
      await expect(element(by.id('camera'))).toBeNotVisible();
      await expect(element(by.id('image-preview'))).toBeVisible();
    }));

    it('shows the back-button and hides the take-picture-button', mochaAsync(async () => {
      await expect(element(by.id('back-button'))).toBeNotVisible();
      await element(by.id('take-picture-button')).tap();
      await expect(element(by.id('back-button'))).toBeVisible();
      await expect(element(by.id('take-picture-button'))).toBeNotVisible();
    }));

    it('shows the send-button', mochaAsync(async () => {
      await expect(element(by.id('send-button'))).toBeNotVisible();
      await element(by.id('take-picture-button')).tap();
      await waitFor(element(by.id('send-button'))).toBeVisible();
      // A constant reminder that I don't fully know what I'm doing
//      await expect(element(by.id('send-button'))).toBeVisible();
    }));

    describe('back-button', () => {
      beforeEach(mochaAsync(async () => {
        await device.launchApp({ newInstance: true });

        await element(by.id('take-picture-button')).tap()
        await waitFor(element(by.id('back-button'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('image-preview'))).toBeVisible();
      }));

      it('shows the take-picture-button and hides the back-button', mochaAsync(async () => {
        await expect(element(by.id('take-picture-button'))).toBeNotVisible();
        await element(by.id('back-button')).tap();
        await waitFor(element(by.id('back-button'))).toBeNotVisible();
        await expect(element(by.id('take-picture-button'))).toBeVisible();
      }));

      it('shows the camera and hides the image-preview', mochaAsync(async () => {
        await expect(element(by.id('image-preview'))).toBeVisible();
        await expect(element(by.id('camera'))).toBeNotVisible();
        await element(by.id('back-button')).tap();
        await waitFor(element(by.id('image-preview'))).toBeNotVisible();
        await expect(element(by.id('camera'))).toBeVisible();
      }));

      it('hides the send-button', mochaAsync(async () => {
        await expect(element(by.id('send-button'))).toBeVisible();
        await element(by.id('back-button')).tap();
        await expect(element(by.id('send-button'))).toBeNotVisible();
      }));
    });
  });
});
