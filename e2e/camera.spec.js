describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('has a camera on the screen', async () => {
    await expect(element(by.id('camera'))).toBeVisible();
  });

  it('has a take-picture-button button on screen', async () => {
    await expect(element(by.id('take-picture-button'))).toBeVisible();
  });

  it('does not have a back-button on the screen', async () => {
    await expect(element(by.id('back-button'))).toBeNotVisible();
  });


  describe('take-picture-button', () => {
    it('displays the image captured and hides the camera', async () => {
      await expect(element(by.id('camera'))).toBeVisible();
      await element(by.id('take-picture-button')).tap();
      await expect(element(by.id('camera'))).toBeNotVisible();
      await expect(element(by.id('image-preview'))).toBeVisible();
    });

    it('shows the back-button and hides the take-picture-button', async () => {
      await expect(element(by.id('back-button'))).toBeNotVisible();
      await element(by.id('take-picture-button')).tap();
      await expect(element(by.id('back-button'))).toBeVisible();
      await expect(element(by.id('take-picture-button'))).toBeNotVisible();
    });

    it('shows the send-button', async () => {
      await expect(element(by.id('send-button'))).toBeNotVisible();
      await element(by.id('take-picture-button')).tap();
      await expect(element(by.id('send-button'))).toBeVisible();
    });

    describe('back-button', () => {
      beforeEach(async () => {
        await element(by.id('take-picture-button')).tap();
      });

      it('shows the take-picture-button and hides the back-button', async () => {
        await expect(element(by.id('take-picture-button'))).toBeNotVisible();
        await element(by.id('back-button')).tap();
        await expect(element(by.id('back-button'))).toBeNotVisible();
        await expect(element(by.id('take-picture-button'))).toBeVisible();
      });

      it('shows the camera and hides the image-preview', async () => {
        await expect(element(by.id('image-preview'))).toBeVisible();
        await expect(element(by.id('camera'))).toBeNotVisible();
        await element(by.id('back-button')).tap();
        await expect(element(by.id('image-preview'))).toBeNotVisible();
        await expect(element(by.id('camera'))).toBeVisible();
      });

      it('hides the send-button', async () => {
        await expect(element(by.id('send-button'))).toBeVisible();
        await element(by.id('back-button')).tap();
        await expect(element(by.id('send-button'))).toBeNotVisible();
      });


    });
  });
});
