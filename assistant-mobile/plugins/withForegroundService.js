const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withForegroundService(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const app = androidManifest.manifest.application[0];
    
    if (!app.service) {
      app.service = [];
    }
    
    app.service.push({
      $: {
        'android:name': 'com.supersami.foregroundservice.ForegroundService',
        'android:exported': 'false',
        'android:foregroundServiceType': 'microphone'
      }
    });

    app.service.push({
      $: {
        'android:name': 'com.supersami.foregroundservice.ForegroundServiceTask',
        'android:exported': 'false',
        'android:foregroundServiceType': 'microphone'
      }
    });

    return config;
  });
};
