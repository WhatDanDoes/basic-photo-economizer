/**
 * 2019-6-26
 * https://github.com/wix/Detox/issues/1365
 * It seems this file is key to getting mocks to swap in

 */

const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts
module.exports = { resolver: { sourceExts: process.env.RN_SRC_EXT ? process.env.RN_SRC_EXT.split(',').concat(defaultSourceExts) : defaultSourceExts } };

