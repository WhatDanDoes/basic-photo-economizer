describe('Example', () => {

  // 2019-6-25 https://labs.chiedo.com/post/async-mocha-tests/
  var mochaAsync = (fn) => {
    return done => {
      fn.call().then(done, err => {
        done(err);
      });
    };
  };

  beforeEach(mochaAsync(async () => {
    await device.reloadReactNative();
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


  describe('take-picture-button', () => {
    it('displays the image captured and hides the camera', mochaAsync(async () => {
      await expect(element(by.id('camera'))).toBeVisible();
      await element(by.id('take-picture-button')).tap();
      await expect(element(by.id('camera'))).toBeNotVisible();
      await expect(element(by.id('image-preview'))).toBeVisible();
    }));

    it('shows the back-button and hides the take-picture-button', done => {
      expect(element(by.id('back-button'))).toBeNotVisible().then(() => {
        element(by.id('take-picture-button')).tap().then(() => {
          expect(element(by.id('back-button'))).toBeVisible().then(() => {
            expect(element(by.id('take-picture-button'))).toBeNotVisible().then(done);
          });
        });
      });
    });

    it('shows the send-button', mochaAsync(async () => {
      await expect(element(by.id('send-button'))).toBeNotVisible();
      await element(by.id('take-picture-button')).tap();
      await expect(element(by.id('send-button'))).toBeVisible();
    }));

    describe('back-button', () => {
      beforeEach(mochaAsync(async () => {
        await element(by.id('take-picture-button')).tap()
      }));

      it('shows the take-picture-button and hides the back-button', mochaAsync(async () => {
        await expect(element(by.id('take-picture-button'))).toBeNotVisible()
        await element(by.id('back-button')).tap();
        await expect(element(by.id('back-button'))).toBeNotVisible();
        await expect(element(by.id('take-picture-button'))).toBeVisible();
      }));

      it('shows the camera and hides the image-preview', mochaAsync(async () => {
        await expect(element(by.id('image-preview'))).toBeVisible()
        await expect(element(by.id('camera'))).toBeNotVisible()
        await element(by.id('back-button')).tap()
        await expect(element(by.id('image-preview'))).toBeNotVisible()
        await expect(element(by.id('camera'))).toBeVisible()
      }));

      it('hides the send-button', async () => {
        try {  
          await expect(element(by.id('send-button'))).toBeVisible();
          await element(by.id('back-button')).tap();
          await expect(element(by.id('send-button'))).toBeNotVisible();
        }
        catch (err) {
          throw err;
        }
      });
    });

    describe('send-button', () => {
      beforeEach(mochaAsync(async () => {
        await element(by.id('take-picture-button')).tap();
      }));

      it('displays sending-message-modal', mochaAsync(async () => {
        await expect(element(by.id('sending-message-overlay'))).toBeNotVisible();
        await element(by.id('send-button')).tap();
        await expect(element(by.id('sending-message-overlay'))).toBeVisible();
      }));

//      it('sends a POST to the designated API endpoint', mochaAsync(async () => {
//
//      }));
    });
  });
});
