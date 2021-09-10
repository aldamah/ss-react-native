import React from "react";
import { Text, Platform } from "react-native";
import Constants from "expo-constants";

// A description of the app version and environment
class AppVersionDescription extends React.Component {
  render() {
    const appVersion = Constants.manifest.version;

    const iosBuild = Constants.manifest.ios.buildNumber;
    const androidBuild = Constants.manifest.android.versionCode;
    const appBuildNumber =
      Platform.OS === "ios" ? iosBuild : String(androidBuild);
    const appName = Constants.manifest.name;

    // Display the app name if it's a release
    const channel = __DEV__ ? "$dev" : appName;

    // Compute a string
    var fullAppVersion = `${channel} ${appVersion} (${appBuildNumber})`;
    return <Text {...this.props}>{fullAppVersion}</Text>;
  }
}

AppVersionDescription.propTypes = {
  ...Text.propTypes,
};

export default AppVersionDescription;
