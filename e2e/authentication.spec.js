describe('authentication', () => {

  describe('landing page', () => {

    beforeEach(async () => {
      await device.reloadReactNative();
    });

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

    beforeEach(async () => {
      await device.reloadReactNative();
    });

    it('opens the app by clicking a link when it\'s not running', async () => {
      await device.launchApp({ url: URL, newInstance: true });
      await expect(element(by.id('camera'))).toBeVisible();
    });

    it('displays authentication-overlay', async () => {
      await expect(element(by.id('authentication-overlay'))).toBeNotVisible();
      await device.launchApp({ url: URL, newInstance: true });
      // Don't think this is doing anything
      await waitFor(element(by.id('authentication-overlay'))).toBeVisible();
      //expect(element(by.id('authentication-overlay'))).toBeVisible();
    });

    describe('success', () => {

      beforeEach(async () => {
        await device.launchApp({ url: URL, newInstance: true });
      });

      it('does not display the login-message', async () => {
        await expect(element(by.id('login-message'))).toBeNotVisible();
      });

      it('displays a welcome flash message', async () => {
        await waitFor(element(by.id('flash-message'))).toBeVisible()
        await expect(element(by.text('Posting to https://example.com'))).toBeVisible();
      });

      it('displays the camera and take-picture button', async () => {
        await waitFor(element(by.id('camera'))).toBeVisible();
        await expect(element(by.id('camera'))).toBeVisible();
        await expect(element(by.id('take-picture-button'))).toBeVisible();
      });

      it('has a logout-button on the screen', async () => {
        await expect(element(by.id('logout-button'))).toBeVisible();
      });

      it('has a web-link on the screen', async () => {
        await expect(element(by.id('web-link-button'))).toBeVisible();
      });


      describe('logout-button', () => {
        it('shows the login-through-web-app message and displays a farewell message', async () => {
          await expect(element(by.id('logout-button'))).toBeVisible();
          await element(by.id('logout-button')).tap();
          await expect(element(by.id('login-message'))).toBeVisible();
          await expect(element(by.text('Cheerio!'))).toBeVisible();
        });
      });
    });

    describe('failure', () => {
      beforeEach(async () => {
        await device.launchApp({ url: 'bpe://bpe', newInstance: true });
      });

      it('displays the login-message', async () => {
        await expect(element(by.id('login-message'))).toBeVisible();
        await expect(element(by.text('Authenticate through a dependent web application'))).toBeVisible();
      });

      it('does not display the camera or take-picture-button', async () => {
        await expect(element(by.id('camera'))).toBeNotVisible(); await expect(element(by.id('take-picture-button'))).toBeNotVisible();
      });

      it('displays an error message', async () => {
        await waitFor(element(by.id('flash-message'))).toBeVisible()
        await expect(element(by.text('Authentication failed. Login through the web app'))).toBeVisible();
      });

      it('does not have a logout-button on the screen', async () => {
        await expect(element(by.id('logout-button'))).toBeNotVisible();
      });
    });
  });
});


