import React from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";
import { Platform } from "react-native";
import * as Sentry from "sentry-expo";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import "intl";
import "intl/locale-data/jsonp/en";
import "intl/locale-data/jsonp/fr";

import AppContainer from "./src/navigations/AppNavigation";
import Store from "./src/store/configureStore";
import { NetworkProvider } from "./NetworkProvider";
import { IntlProviderWrapper } from "./IntlProviderWrapper";

Sentry.init({
  dsn: "https://e010a1f5df3d47c1b1772b569ee87ea2@o813826.ingest.sentry.io/5806233",
  enableInExpoDevelopment: false,
  debug: __DEV__, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});

let persistor = persistStore(Store);

export default function App() {
  if (Platform.OS === "android") {
    // See https://github.com/expo/expo/issues/6536 for this issue.
    if (Intl.__disableRegExpRestore === "function") {
      Intl.__disableRegExpRestore();
    }
  }

  return (
    <Provider store={Store}>
      <PersistGate persistor={persistor}>
        <ActionSheetProvider>
          <NetworkProvider>
            <IntlProviderWrapper>
              <AppContainer />
            </IntlProviderWrapper>
          </NetworkProvider>
        </ActionSheetProvider>
      </PersistGate>
    </Provider>
  );
}
