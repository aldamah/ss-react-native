import React from "react";
import { View, TouchableOpacity, SafeAreaView } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as SecureStore from "expo-secure-store";
import { injectIntl } from "react-intl";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import axios from "axios";

import API from "../../configs/API";
import MenuButton from "../../components/MenuButton/MenuButton";
import AppVersionDescription from "../../components/AppVersion/AppVersion";
import { IntlContext } from "../../../IntlProviderWrapper";
import styles from "./styles";
import { getLanguageCode, setUserLanguageCode } from "../../configs/lang/lang";
import ChangeLanguageOffline from "../../dbSQLite/ChangeLanguageOffline";
import { NetworkContext } from "../../../NetworkProvider";

class DrawerContainer extends React.Component {
  static contextType = NetworkContext;
  async logOut(switchToFrench, switchToEnglish) {
    let nullValue = [];
    const { navigation, dispatch } = this.props;
    const actionEmail = { type: "AUTH_ACTION_EMAIL", value: "" };
    dispatch(actionEmail);
    const actionPassword = { type: "AUTH_ACTION_PASSWORD", value: "" };
    dispatch(actionPassword);
    const action = { type: "AUTH_ACTION", value: false };
    dispatch(action);

    const actionPlanned = { type: "PLANNED_ACTION", value: nullValue };
    this.props.dispatch(actionPlanned);
    const actionUnplanned = { type: "UNPLANNED_ACTION", value: nullValue };
    this.props.dispatch(actionUnplanned);
    const actionMeter = { type: "METER_ACTION", value: nullValue };
    this.props.dispatch(actionMeter);

    const actionEn = { type: "AUTH_ACTION_HASCHANGEDLANGUAGE", value: false };
    this.props.dispatch(actionEn);

    SecureStore.deleteItemAsync("token");
    await setUserLanguageCode(null);
    const local = await getLanguageCode();
    await this.switchLanguage(switchToFrench, switchToEnglish, local);
    navigation.closeDrawer();
    navigation.navigate("Login");
  }

  switchLanguage = async (switchToFrench, switchToEnglish, local) => {
    switch (local) {
      case "fr":
        switchToFrench();
        break;

      default:
        switchToEnglish();
        break;
    }
  };

  cleanFilter() {
    let nullValue = [];
    const action = { type: "FILTER_ACTION", value: nullValue };
    this.props.dispatch(action);

    const actionV = { type: "VISIBLE_ACTION", value: false };
    this.props.dispatch(actionV);
    const actionVD = { type: "VISIBLE_UNPLANNED_ACTION", value: false };
    this.props.dispatch(actionVD);
    const actionVM = { type: "VISIBLE_METER_ACTION", value: false };
    this.props.dispatch(actionVM);

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

    const actionS = { type: "SHIP_NAME_ACTION", value: null };
    this.props.dispatch(actionS);
    const actionE = { type: "EQUIPMENT_NAME_ACTION", value: null };
    this.props.dispatch(actionE);
    const actionD = { type: "DEPARTMENT_NAME_ACTION", value: null };
    this.props.dispatch(actionD);

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
  }

  dashboardNameAction() {
    const actionName = { type: "TASKNAME_ACTION", value: "Dashboard" };
    this.props.dispatch(actionName);
  }

  plannedNameAction() {
    const actionName = { type: "TASKNAME_ACTION", value: "Planned" };
    this.props.dispatch(actionName);
  }

  unplannedNameAction() {
    const actionName = { type: "TASKNAME_ACTION", value: "Unplanned" };
    this.props.dispatch(actionName);
  }

  meterNameAction() {
    const actionName = { type: "TASKNAME_ACTION", value: "Meters" };
    this.props.dispatch(actionName);
  }

  _onOpenActionSheet = (switchToEnglish, switchToFrench) => {
    const { intl } = this.props;
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
            await setUserLanguageCode("fr");
            await this.sendChosenLanguage("fr");
            switchToFrench();
            const actionFr = {
              type: "AUTH_ACTION_HASCHANGEDLANGUAGE",
              value: true,
            };
            that.props.dispatch(actionFr);
            break;
          case 1:
            await setUserLanguageCode("en");
            await this.sendChosenLanguage("en");
            switchToEnglish();
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

  sendChosenLanguage = async (lang) => {
    const data = { lang: lang };
    const { AuthReducer } = this.props;
    const connexion = this.context.connexion;

    const token = AuthReducer.token;
    if (connexion) {
      axios({
        method: "PATCH",
        url: API.patchUserLang + token.user._id,
        data: data,
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          console.log("Language changed to", lang);
        })
        .catch(function (error) {
          console.log("Error when trying to change language:", error);
        });
    } else {
      this.saveLanguageOffline(lang);
    }
  };

  saveLanguageOffline = async (lang) => {
    const languageOffline = {
      type: "OFFLINE_LANGUAGE_EXIST_ACTION",
      value: true,
    };
    this.props.dispatch(languageOffline);

    ChangeLanguageOffline.removeAll();
    ChangeLanguageOffline.createTable();
    ChangeLanguageOffline.create(lang)
      .then((id) => {
        console.log("language sqlite:", id);
      })
      .catch((err) => {
        console.log("Errora", err);
      });
  };

  render() {
    const { navigation, intl } = this.props;
    return (
      <IntlContext.Consumer>
        {({ switchToEnglish, switchToFrench }) => (
          <SafeAreaView style={styles.content}>
            <TouchableOpacity
              onPress={() =>
                this._onOpenActionSheet(switchToEnglish, switchToFrench)
              }
              style={styles.iconWorldContainer}
            >
              <View style={styles.iconWorld}>
                <MaterialIcon name={"language"} size={30} color="#ffffff" />
              </View>
            </TouchableOpacity>
            <View style={styles.contentMenu}>
              <View style={styles.container}>
              <MenuButton
                  title={intl.formatMessage({
                    id: "menu.dashboard",
                    defaultMessage: "DASHBOARD",
                  })}
                  icon="barschart"
                  onPress={() => {
                    navigation.navigate("Dashboard");
                    navigation.closeDrawer();
                    this.cleanFilter();
                    this.plannedNameAction();
                  }}
                />
                <MenuButton
                  title={intl.formatMessage({
                    id: "menu.planned",
                    defaultMessage: "PLANNED",
                  })}
                  icon="calendar"
                  onPress={() => {
                    navigation.navigate("Planned");
                    navigation.closeDrawer();
                    this.cleanFilter();
                    this.plannedNameAction();
                  }}
                />
                <MenuButton
                  title={intl.formatMessage({
                    id: "menu.unplanned",
                    defaultMessage: "UNPLANNED",
                  })}
                  icon="exclamationcircleo"
                  onPress={() => {
                    navigation.navigate("Unplanned");
                    navigation.closeDrawer();
                    this.cleanFilter();
                    this.unplannedNameAction();
                  }}
                />
                <MenuButton
                  title={intl.formatMessage({
                    id: "menu.meters",
                    defaultMessage: "METERS",
                  })}
                  icon="dashboard"
                  onPress={() => {
                    navigation.navigate("Meters");
                    navigation.closeDrawer();
                    this.cleanFilter();
                    this.meterNameAction();
                  }}
                />
                <MenuButton
                  title={intl.formatMessage({
                    id: "menu.logout",
                    defaultMessage: "METERS",
                  })}
                  icon="logout"
                  onPress={() => {
                    this.logOut(switchToFrench, switchToEnglish);
                    this.cleanFilter();
                  }}
                />
                <View style={styles.bottom}>
                  <AppVersionDescription style={styles.versionTitle} />
                </View>
              </View>
            </View>
          </SafeAreaView>
        )}
      </IntlContext.Consumer>
    );
  }
}

const mapStateToProps = (state) => ({
  AuthReducer: state.AuthReducer,
  TaskReducer: state.TaskReducer,
});

export default connectActionSheet(
  injectIntl(connect(mapStateToProps)(DrawerContainer))
);

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};
