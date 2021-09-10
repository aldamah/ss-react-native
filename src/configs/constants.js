import Constants from "expo-constants";
import { Platform } from "react-native";

/// `true` to force a release environment
/// DO NOT COMMIT THE UPDATED VALUE
const forceReleaseEnvironment = false;

/// List of constants
const constants = {
  /// This will return `true` if the app was launched from `expo`
  get isExpo() {
    return Constants.appOwnership === "expo";
  },
  /// This will return `true` if the app was launched from anywhere but the "expo" app.
  get isStoreApp() {
    return !this.isExpo || forceReleaseEnvironment;
  },
  /// This will return `true` if the app was launched from `expo` AND `dev` channel
  get isDevApp() {
    const devChannel = Constants.manifest.releaseChannel === "dev";
    return this.isExpo && devChannel;
  },
  /// `true` if the app was installed on Android devices and from the play store
  get isAndroidPlayStore() {
    return Platform.OS === "android" && !this.isExpo;
  },
  /// `true` if the app was installed on iOS devices from the App Store
  get isAppleApp() {
    return Platform.OS === "ios" && !this.isExpo;
  },
  /// API url
  get apiUrl() {
    if (this.isStoreApp) {
      /// If it's not from expo, we default to the production url.
      return `https://api.smartsailors.net`;
    }
    // Staging environement
    return `https://api-staging.smartsailors.net`;
  },
  isDebugEnvironment: forceReleaseEnvironment ? false : __DEV__,

  // This app version
  get appVersion() {
    return Constants.manifest.version;
  },

  // This app build number
  get appBuildNumber() {
    const iosBuild = Constants.manifest.ios.buildNumber;
    const androidBuild = Constants.manifest.android.versionCode;
    return Platform.OS === "ios" ? iosBuild : String(androidBuild);
  },

  // This app name
  get appName() {
    return Constants.manifest.name;
  },
};

export default constants;
