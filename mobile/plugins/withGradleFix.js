/**
 * Expo Config Plugin — Gradle 8.13 Compatibility Fix
 * Replaces deprecated String[].execute() calls with providers.exec{} API
 * Required for Expo SDK 53 + React Native 0.76.x + EAS Build (Gradle 8.13)
 */
const { withAppBuildGradle } = require('@expo/config-plugins');

function fixExecuteCalls(gradle) {
  // Fix entryFile
  gradle = gradle.split(
    `["node", "-e", "require('expo/scripts/resolveAppEntry')", projectRoot, "android", "absolute"].execute(null, rootDir).text.trim()`
  ).join(
    `providers.exec { workingDir(rootDir); commandLine("node", "-e", "require('expo/scripts/resolveAppEntry')", projectRoot, "android", "absolute") }.standardOutput.asText.get().trim()`
  );

  // Fix reactNativeDir / hermesCommand (same string, appears twice)
  gradle = gradle.split(
    `["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim()`
  ).join(
    `providers.exec { workingDir(rootDir); commandLine("node", "--print", "require.resolve('react-native/package.json')") }.standardOutput.asText.get().trim()`
  );

  // Fix codegenDir
  gradle = gradle.split(
    `["node", "--print", "require.resolve('@react-native/codegen/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()`
  ).join(
    `providers.exec { workingDir(rootDir); commandLine("node", "--print", "require.resolve('@react-native/codegen/package.json', { paths: [require.resolve('react-native/package.json')] })") }.standardOutput.asText.get().trim()`
  );

  // Fix cliFile
  gradle = gradle.split(
    `["node", "--print", "require.resolve('@expo/cli', { paths: [require.resolve('expo/package.json')] })"].execute(null, rootDir).text.trim()`
  ).join(
    `providers.exec { workingDir(rootDir); commandLine("node", "--print", "require.resolve('@expo/cli', { paths: [require.resolve('expo/package.json')] })") }.standardOutput.asText.get().trim()`
  );

  return gradle;
}

const withGradleFix = (config) => {
  return withAppBuildGradle(config, (config) => {
    const before = (config.modResults.contents.match(/\.execute\(/g) || []).length;
    config.modResults.contents = fixExecuteCalls(config.modResults.contents);
    const after = (config.modResults.contents.match(/\.execute\(/g) || []).length;
    console.log(`[withGradleFix] Fixed ${before - after} .execute() calls → providers.exec{}`);
    return config;
  });
};

module.exports = withGradleFix;
