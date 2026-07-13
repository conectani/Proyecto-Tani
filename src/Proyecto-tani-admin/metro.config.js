const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Agregar soporte para reproducir videos locales .mp4 en la aplicación
config.resolver.assetExts.push('mp4');

// Resolver import.meta en Zustand v5 para Web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && (moduleName === 'zustand' || moduleName.startsWith('zustand/'))) {
    return {
      filePath: require.resolve(moduleName),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
