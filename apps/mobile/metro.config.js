const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// CRITICAL: Explicitly set project root
config.projectRoot = projectRoot;

// Watch the monorepo
config.watchFolders = [workspaceRoot];

// Configure resolver
config.resolver = {
  ...config.resolver,
  // Tell Metro where to find node_modules
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ],
  // Disable going up the directory tree beyond projectRoot
  disableHierarchicalLookup: false,
  // Explicitly map packages
  extraNodeModules: {
    'expo-router': path.resolve(workspaceRoot, 'node_modules/expo-router'),
  },
  // Custom resolver to handle index.js correctly
  resolveRequest: (context, moduleName, platform) => {
    // Force index.js to resolve from projectRoot
    if (moduleName === './index.js' || moduleName === 'index.js') {
      const indexPath = path.resolve(projectRoot, 'index.js');
      console.log(`Resolving index.js to: ${indexPath}`);
      return {
        filePath: indexPath,
        type: 'sourceFile',
      };
    }

    // Use default resolver
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
