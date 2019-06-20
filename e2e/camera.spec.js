describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('has a camera on the screen', async () => {
    await expect(element(by.id('camera'))).toBeVisible();
  });

  it('has a shutter button on screen', async () => {
    await expect(element(by.id('take-picture-button'))).toBeVisible();
  });

  it('displays the image captured', async () => {
    await expect(element(by.id('camera'))).toBeVisible();
    await element(by.id('take-picture-button')).tap();
    await expect(element(by.id('camera'))).toBeNotVisible();
    await expect(element(by.id('image-preview'))).toBeVisible();
  });

//  it('should show world screen after tap', async () => {
//    await element(by.id('world_button')).tap();
//    await expect(element(by.text('World!!!'))).toBeVisible();
//  });
});
