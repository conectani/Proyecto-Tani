const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Agregar soporte para reproducir videos locales .mp4 en la aplicación
config.resolver.assetExts.push('mp4');

module.exports = config;
