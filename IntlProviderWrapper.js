import React from "react";
import { IntlProvider } from "react-intl";
import en from "./src/configs/lang/en.json";
import fr from "./src/configs/lang/fr.json";
import { flattenMessages } from "./src/configs/lang/lang";

const Context = React.createContext();

class IntlProviderWrapper extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      locale: "en",
      messages: flattenMessages(en),
      switchToEnglish: this.switchToEnglish,
      switchToFrench: this.switchToFrench,
    };
  }
  switchToEnglish = () =>
    this.setState({ locale: "en", messages: flattenMessages(en) });

  switchToFrench = () =>
    this.setState({ locale: "fr", messages: flattenMessages(fr) });

  async componentDidMount() {
    this.setState({
      messages: flattenMessages(en),
      switchToEnglish: this.switchToEnglish,
      switchToFrench: this.switchToFrench,
    });
  }

  render() {
    const { children } = this.props;
    const { locale, messages } = this.state;
    return (
      <Context.Provider value={this.state}>
        <IntlProvider
          key={locale}
          locale={locale}
          messages={messages}
          defaultLocale="en"
        >
          {children}
        </IntlProvider>
      </Context.Provider>
    );
  }
}

export { IntlProviderWrapper, Context as IntlContext };
