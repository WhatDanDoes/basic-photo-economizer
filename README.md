basic-photo-economizer
======================

React-Native app for cropping, compressing, and sending photos to a remote server. 

My RN workspace setup is documented [here](https://libertyseeds.ca/2019/06/18/Basic-Android-React-Native-environment-setup-in-Ubuntu-18-04/). I initially set up this project to use `mocha`, but switched to `jest` when it was well underway. The transition was easy.

## Setup

## Testing

```
npm run detox
```

To run a single test, use the `-f` flag and specify the file:

```
RN_SRC_EXT=e2e.js detox test -c android.emu.debug -f e2e/lib/api.spec.js
```

### Notes on Mocks

Having swapped over from Mocha to Jest, I immediately discovered API testing is a completely different beast. I needed to change a few things to get mocks working with Detox. This process hasn't yet been fully documented, so these notes will enable me to document the process from the beginning when I launch my next project.

Wherever there's a build configured or a server running, this variable is set on the commandline: `RN_SRC_EXT=e2e.js`

`rn-cli.config.js` is also key to getting mocks working. C.f., `android.emu.debug` config in `package.json`:

```
RN_SRC_EXT=e2e.js react-native start --config rn-cli.config.js
```

