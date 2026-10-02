const { withAndroidManifest } = require('@expo/config-plugins');

const withLockScreen = (config) => {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];
    const mainActivity = mainApplication.activity.find(
      (activity) => activity.$['android:name'] === '.MainActivity'
    );

    if (mainActivity) {
      // Allow Kairon to wake up the screen and show over the lock screen
      mainActivity.$['android:showWhenLocked'] = 'true';
      mainActivity.$['android:turnScreenOn'] = 'true';
    }

    return config;
  });
};

module.exports = withLockScreen;
