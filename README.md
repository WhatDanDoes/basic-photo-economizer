basic-photo-economizer
======================

React-Native app for resizing and sending photos to a remote server. 

My RN workspace setup is documented [here](https://libertyseeds.ca/2019/06/18/Basic-Android-React-Native-environment-setup-in-Ubuntu-18-04/). I initially set up this project to use `mocha`, but switched to `jest` when it was well underway. The transition was easy.

_2020-9-21_ The emulator kept freezing my Ubuntu 18.04 installation. I discovered that this was due to a dependence on proprietary drivers. In addition to the steps taken at the site listed above, I also executed:

```
sudo ubuntu-drivers autoinstall
```

## Setup

Details can be found at the link above, but there are a lot of pieces that need to be in place before you can test or build.

```
npm install
```

This is usually running in the background:

```
adb start-server
```

Build the project:

```
detox build -c android.emu.debug
```

Start the emulator:

```
~/Android/Sdk/emulator/emulator -avd Nexus_5_API_28
```

Start the React Native server for e2e testing:

```
npm start
```

Or, start for development testings:

```
cd project-dir/
react-native run-android
react-native start
```

View logs:

```
react-native log-android
```

## Testing

```
npm run detox
```

To run a single test, use the `-f` flag and specify the file:

```
RN_SRC_EXT=e2e.js npx detox test -c android.emu.debug -f e2e/lib/api.spec.js
```

### Notes on Mocks

Having swapped over from Mocha to Jest, I immediately discovered API testing is a completely different beast. I needed to change a few things to get mocks working with Detox. This process hasn't yet been fully documented, so these notes will enable me to document the process from the beginning when I launch my next project.

Wherever there's a build configured or a server running, this variable is set on the commandline: `RN_SRC_EXT=e2e.js`

`rn-cli.config.js` is also key to getting mocks working. C.f., `android.emu.debug` config in `package.json`:

```
RN_SRC_EXT=e2e.js react-native start --config rn-cli.config.js
```

This command is wrapped up in the `npm start` script in `package.json`.

### Live Logging

To see debug output:

```
react-native log-android
```

To see emulator output:

```
adb logcat
```

## Keystore

More notes from when I tried to do the release build and load onto my phone. Kept generating unsigned packages. Signing process discovered from here:

- https://stackoverflow.com/questions/48017376/keystore-not-found-for-signing-config-release-react-native?rq=1
- https://facebook.github.io/react-native/docs/signed-apk-android.html
- https://github.com/facebook/react-native/issues/8980#issuecomment-376395718
- https://github.com/facebook/react-native/issues/8980#issuecomment-276490204

```
cd android/app/
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Provide passwords as described in config below...

Changed `buildType` in `android/app/build.gradle`:

```
    signingConfigs {
      release {
        storeFile file("my-release-key.keystore")
        storePassword "beefalo"
        keyAlias "my-key-alias"
        keyPassword "beefalo"
      }
    }
    buildTypes {
        release {
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            // 2019-2-28 https://github.com/facebook/react-native/issues/8980#issuecomment-276490204
            signingConfig signingConfigs.release
        }
    }
```

## Emulator Build

Build with `DOMAIN` for testing from the emulator

```
detox build -c android.emu.debug
```

## Install to Device

Plug in an find your device:

```
adb devices
```

Build and install

```
detox build -c android.emu.release
adb -s 0ba1f22a02e3828e install android/app/build/outputs/apk/release/app-release.apk
```


