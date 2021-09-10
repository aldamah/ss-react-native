import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  Image,
  TextInput,
  Platform,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import { FontAwesome } from "@expo/vector-icons";
import { connect } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-elements";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { injectIntl } from "react-intl";

import Images from "../../configs/Images";
import { StyleLogin } from "./StyleLogin";
import API from "../../configs/API";
import { COLORS } from "../../configs/theme";
import AppVersionDescription from "../../components/AppVersion/AppVersion";
import { NetworkContext } from "../../../NetworkProvider";
import ToastApp from "../../components/ToastApp/ToastApp";
import { IntlContext } from "../../../IntlProviderWrapper";
import { setUserLanguageCode } from "../../configs/lang/lang";

class LoginScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerShown: false,
  });

  static contextType = IntlContext;

  constructor(props) {
    super(props);
    this.state = {
      userEmail: "",
      userPassword: null,
      emailValidate: true,
      showValide: false,
      hidePassword: true,
      showImageInput: false,
      popMDPFail: false,
      isLoading: false,
      user: [],
      userInfo: [],
      userToken: [],
      connexion: null,
      isLogging: false,
      textError: null,
      typeError: null,
      screen: "Login",
      activateError: null,
    };
    this.connexionlistner;
  }

  switchLanguage = async (local) => {
    const { switchToFrench, switchToEnglish } = this.context;
    switch (local) {
      case "fr":
        await setUserLanguageCode("fr");
        switchToFrench();
        break;

      default:
        await setUserLanguageCode("en");
        switchToEnglish();
        break;
    }
  };

  validates(text, type) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (type == "email") {
      if (reg.test(text) === false) {
        this.setState({
          emailValidate: false,
          userEmail: text,
          showValide: true,
          textError: null,
        });
      } else {
        this.setState({
          emailValidate: true,
          userEmail: text,
          showValide: true,
          textError: null,
        });
      }
    }
  }

  //show password
  setPasswordVisibility = () => {
    this.setState({
      hidePassword: !this.state.hidePassword,
    });
  };

  // get user
  async getUser() {
    //stockage userInfo
    const that = this;
    const { navigation } = this.props;
    const { userToken } = this.state;

    try {
      const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: true };
      this.props.dispatch(actionAuth);

      const token = JSON.stringify(userToken);
      await SecureStore.setItemAsync("token", token);
      navigation.navigate("Dashboard");

      this.switchLanguage(userToken?.user?.lang);
      const action = { type: "AUTH_ACTION", value: true };
      this.props.dispatch(action);
    } catch (error) {
      console.warn("error  storage  1", error);
      that.setState(
        {
          popMDPFail: true,
        },
        console.log("Mauvais identifiant")
      );
    }
  }

  //disable connexion status
  disablePopupConnexion() {
    this.setState({
      connexion: "",
    });
  }

  // login
  async loginOnline(connexion) {
    let that = this;
    //get info user
    const { userEmail, userPassword } = that.state;
    const actionEmail = { type: "AUTH_ACTION_EMAIL", value: userEmail };
    this.props.dispatch(actionEmail);
    const actionPassword = {
      type: "AUTH_ACTION_PASSWORD",
      value: userPassword,
    };
    this.props.dispatch(actionPassword);
    axios
      .post(API.login, {
        email: userEmail,
        password: userPassword,
        type: "user",
      })
      .then(function (response) {
        const actionToken = { type: "AUTH_ACTION_TOKEN", value: response.data };
        that.props.dispatch(actionToken);
        that.setState(
          {
            userInfo: response.config,
            userToken: response.data,
            isLogging: true,
          },
          () => that.getUser()
        );
      })
      .catch(function (error) {
        that.handleToastError(connexion);
      });
  }

  handleToastError = (connexion) => {
    const that = this;
    if (connexion) {
      if (that.state.userEmail.length < 1) {
        that.setState({
          textError: that.props.intl.formatMessage({
            id: "login.form.fillAllfields",
            defaultMessage: "Please fill out all the fields",
          }),
          typeError: "Error",
        });
      } else {
        that.setState({
          textError: that.props.intl.formatMessage({
            id: "login.form.incorrectMailorPassword",
            defaultMessage: "Incorrect Mail or Password",
          }),
          typeError: "Error",
        });
      }
    } else {
      that.setState({
        textError: that.props.intl.formatMessage({
          id: "login.form.deviceOffline",
          defaultMessage:
            "Device currently offline, you can log in when the connection is restored",
        }),
        typeError: "Error",
      });
    }
  };

  closeMDPFailed() {
    this.setState({
      popMDPFail: false,
    });
  }

  _onOpenActionSheet = () => {
    const { intl } = this.props;
    const { switchToEnglish, switchToFrench } = this.context;
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = [
      intl.formatMessage({
        id: "lang.french",
        defaultMessage: "French",
      }),
      intl.formatMessage({
        id: "lang.english",
        defaultMessage: "English",
      }),
      "Cancel",
    ];
    const destructiveButtonIndex = -1;
    const cancelButtonIndex = 2;
    const that = this;
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      async (buttonIndex) => {
        // Do something here depending on the button index selected
        switch (buttonIndex) {
          case 0:
            switchToFrench();
            await setUserLanguageCode("fr");
            const actionFr = {
              type: "AUTH_ACTION_HASCHANGEDLANGUAGE",
              value: true,
            };
            that.props.dispatch(actionFr);
            break;
          case 1:
            switchToEnglish();
            await setUserLanguageCode("en");
            const actionEn = {
              type: "AUTH_ACTION_HASCHANGEDLANGUAGE",
              value: true,
            };
            that.props.dispatch(actionEn);
            break;
        }
      }
    );
  };

  render() {
    const { userEmail, userPassword, textError, typeError, screen } =
      this.state;

    const { intl } = this.props;
    return (
      <NetworkContext.Consumer>
        {({ connexion }) => (
          <SafeAreaView style={StyleLogin.container}>
            <ToastApp text={textError} type={typeError} screen={screen} />
            {Platform.OS == "ios" ? (
              <StatusBar backgroundColor="#ffffff" barStyle="light-content" />
            ) : (
              <StatusBar barStyle="light-content" backgroundColor="#19196F" />
            )}
            {connexion ? null : (
              <View style={StyleLogin.orangeError}>
                <Text style={StyleLogin.orangeErrorText}>
                  {intl.formatMessage({
                    id: "connexion.text",
                    defaultMessage:
                      "Device currently offline, any updates will be sent automatically when the connection is restored",
                  })}
                </Text>
              </View>
            )}

            <KeyboardAwareScrollView>
              <TouchableOpacity
                onPress={this._onOpenActionSheet}
                style={StyleLogin.iconWorldContainer}
              >
                <View style={StyleLogin.iconWorld}>
                  <MaterialIcon name={"language"} size={30} color="#ffffff" />
                </View>
              </TouchableOpacity>
              <View style={StyleLogin.imgContainer}>
                <Image source={Images.imgLogo} style={StyleLogin.imgContent} />
              </View>
              {/* {!popMDPFail ? ( */}
              <View style={StyleLogin.formContainer}>
                <View>
                  <View style={StyleLogin.inputView}>
                    <TextInput
                      style={StyleLogin.TextInput}
                      placeholder="Email"
                      placeholderTextColor="#003f5c"
                      onChangeText={(text) => this.validates(text, "email")}
                      value={userEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    <View style={StyleLogin.touchableImage}>
                      {this.state.showValide ? (
                        userEmail.length > 0 ? (
                          !this.state.emailValidate ? (
                            <FontAwesome name="ban" size={16} color="#F56C6C" />
                          ) : (
                            <FontAwesome
                              name="check"
                              size={16}
                              color="#67C23A"
                            />
                          )
                        ) : null
                      ) : null}
                    </View>
                  </View>

                  <View style={StyleLogin.inputView}>
                    <TextInput
                      onChangeText={(text) =>
                        this.setState({
                          userPassword: text,
                          showImageInput: true,
                          textError: null,
                        })
                      }
                      underlineColorAndroid="transparent"
                      secureTextEntry={this.state.hidePassword}
                      style={StyleLogin.TextInput}
                      value={userPassword}
                      placeholder={intl.formatMessage({
                        id: "login.password",
                        defaultMessage: "Password",
                      })}
                      placeholderTextColor="#003f5c"
                    />

                    <View style={StyleLogin.touchableImage}>
                      <TouchableOpacity onPress={this.setPasswordVisibility}>
                        {this.state.showImageInput ? (
                          <Icon
                            name={this.state.hidePassword ? "eye-slash" : "eye"}
                            size={20}
                          />
                        ) : null}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <Button
                  containerStyle={StyleLogin.loginBtn}
                  buttonStyle={{ backgroundColor: COLORS.customYellow }}
                  title={intl.formatMessage({
                    id: "login.login",
                    defaultMessage: "LOGIN",
                  })}
                  titleStyle={{
                    color: COLORS.white,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                  onPress={() => this.loginOnline(connexion)}
                />

                <View style={StyleLogin.bottom}>
                  <AppVersionDescription style={StyleLogin.versionTitle} />
                </View>
              </View>
            </KeyboardAwareScrollView>
          </SafeAreaView>
        )}
      </NetworkContext.Consumer>
    );
  }
}

const mapStateToProps = (state) => ({
  AuthReducer: state.AuthReducer,
  TaskReducer: state.TaskReducer,
});
export default connectActionSheet(
  injectIntl(connect(mapStateToProps)(LoginScreen))
);
