import React from "react";
import axios from "axios";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StyleAuth } from "./StyleAuth";
import { IntlContext } from "../../../IntlProviderWrapper";
import { setUserLanguageCode, getLanguageCode } from "../../configs/lang/lang";
import API from "../../configs/API";

class AuthLoadingScreen extends React.Component {
  static contextType = IntlContext;

  static navigationOptions = ({ navigation }) => ({
    headerShown: false,
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this._navigationAsync();
  }

  _navigationAsync = async () => {
    const { AuthReducer } = this.props;
   

    const isLoggedIn = AuthReducer.isLoggedIn;
    // Handle the case where user is already logged in
    if (isLoggedIn) {
      const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: true };
      this.props.dispatch(actionAuth);
      const lang = await this.getUserLang();
      if(lang) {
        await this.switchLanguage(lang);
      } else {
        const locale = await AsyncStorage.getItem("user_language");
        if (locale) {
          await this.switchLanguage(locale);
        }
      }
    
      
    } else {
      const local = getLanguageCode();
      await this.switchLanguage(local);
    }

    this.props.navigation.navigate(isLoggedIn ? "Dashboard" : "Auth");
    let nullValue = [];
    const action = { type: "FILTER_ACTION", value: nullValue };
    this.props.dispatch(action);
    const actionfU = { type: "FILTER_UNPLANNED_ACTION", value: nullValue };
    this.props.dispatch(actionfU);
    const actionFM = { type: "FILTER_METER_ACTION", value: nullValue };
    this.props.dispatch(actionFM);

    const actionShip = { type: "SHIP_ACTION", value: null };
    this.props.dispatch(actionShip);
    const actionDepartment = { type: "DEPARTMENT_ACTION", value: null };
    this.props.dispatch(actionDepartment);
    const actionEquipment = { type: "EQUIPMENT_ACTION", value: null };
    this.props.dispatch(actionEquipment);

    const activeDepartment = { type: "DEPARTMENT_ACTIVE", value: true };
    this.props.dispatch(activeDepartment);
    const activeEquipment = { type: "EQUIPMENT_ACTIVE", value: true };
    this.props.dispatch(activeEquipment);
    const actionShp = { type: "SHIP_ACTIVE", value: false };
    this.props.dispatch(actionShp);

    const actionName = { type: "TASKNAME_ACTION", value: "Planned" };
    this.props.dispatch(actionName);

    const actionS = { type: "SHIP_NAME_ACTION", value: null };
    this.props.dispatch(actionS);
    const actionE = { type: "EQUIPMENT_NAME_ACTION", value: null };
    this.props.dispatch(actionE);
    const actionD = { type: "DEPARTMENT_NAME_ACTION", value: null };
    this.props.dispatch(actionD);

    const actionV = { type: "VISIBLE_ACTION", value: false };
    this.props.dispatch(actionV);
    const actionVD = { type: "VISIBLE_UNPLANNED_ACTION", value: false };
    this.props.dispatch(actionVD);
    const actionVM = { type: "VISIBLE_METER_ACTION", value: false };
    this.props.dispatch(actionVM);

    const actionRES = { type: "RESULT_ACTION", value: false };
    this.props.dispatch(actionRES);
    const actionBack = { type: "GOBACK_UNPLANNED_ACTION", value: false };
    this.props.dispatch(actionBack);

    const actionCompteDe = {
      type: "FILTERDEPARTMENT_COMPTE_ACTION",
      value: null,
    };
    this.props.dispatch(actionCompteDe);
    const actionCompteSh = { type: "FILTERSHIP_COMPTE_ACTION", value: null };
    this.props.dispatch(actionCompteSh);

    const actionO = { type: "OVERLAY_ACTION", value: false };
    this.props.dispatch(actionO);
    const actionFIl = { type: "FILTEREQUIPMENTLENGTH_ACTION", value: 0 };
    this.props.dispatch(actionFIl);

    const actionBS = { type: "BADGE_SHIP_ACTION", value: false };
    this.props.dispatch(actionBS);
    const actionBDE = { type: "BADGE_DEPARTMENT_ACTION", value: false };
    this.props.dispatch(actionBDE);
    const actionBE = { type: "BADGE_EQUIPMENT_ACTION", value: false };
    this.props.dispatch(actionBE);

    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: null };
    this.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: null };
    this.props.dispatch(actionErrorType);
  };

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

  async getUserLang() {
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;

    return await axios
      .get(API.getUserLang, {
        headers: {
          AUTHORIZATION: `Bearer ${token.accessToken}`,
        },
      })
      .then(function (response) {
        return response.data.lang
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <SafeAreaView style={StyleAuth.isLoggedIn}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  AuthReducer: state.AuthReducer,
  TaskReducer: state.TaskReducer,
  FilterReducer: state.FilterReducer,
});
export default connect(mapStateToProps)(AuthLoadingScreen);
