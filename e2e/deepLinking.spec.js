
describe('deep linking', () => {
  // 2019-6-25 https://labs.chiedo.com/post/async-mocha-tests/
  const mochaAsync = (fn) => {
    return done => {
      fn.call().then(done, err => {
        done(err);
      });
    };
  };
  

  describe('uri without token', () => {
    it('opens the app to the login screen by clicking a link', mochaAsync(async () => {
      await device.launchApp();
      await expect(element(by.id('login-message'))).toBeVisible();
    }));
  });

  describe('uri with token', () => {
    const URL = `bpe://bpe?token=somejwtstring\\&domain=${encodeURIComponent('https://example.com')}`;
    
    it('opens the app by clicking a link when it\'s not running', mochaAsync(async () => {
      await device.launchApp({ url: URL, newInstance: true });
      await expect(element(by.id('camera'))).toBeVisible();
    }));
  
    it('opens the app by clicking a link when it\'s in the background', mochaAsync(async () => {
      await device.launchApp({ url: URL, newInstance: true });
      await device.sendToHome();
      await device.launchApp({ newInstance: false });
      await expect(element(by.id('camera'))).toBeVisible();
    }));
  
    it('opens an app URL when in the foreground (is this possible?)', mochaAsync(async () => {
      await device.launchApp({ url: URL,  newInstance: true });
      await device.openURL({url: URL, sourceApp: 'com.apple.mobilesafari'});
      await device.openURL({url: URL, sourceApp: 'com.apple.mobilesafari'});
      await expect(element(by.id('camera'))).toBeVisible();
    }));
    
  });
});
