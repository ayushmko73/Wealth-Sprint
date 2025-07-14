const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .ts and .tsx files
config.resolver.sourceExts.push('ts', 'tsx');

module.exports = config;