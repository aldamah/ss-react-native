import React from "react";
import {
  FlatList,
  Keyboard,
  ScrollView,
  Text,
  View,
  Platform,
  Switch,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/AntDesign";
import { Button, Card } from "react-native-elements";
import { injectIntl, FormattedMessage } from "react-intl";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { format } from "date-fns";
import { DateTime } from "luxon";
import { SafeAreaView } from "react-navigation";
import { connectActionSheet } from "@expo/react-native-action-sheet";

import BackButton from "../BackButton/BackButton";
import { StyleTaskInformation } from "./StyleTaskInformation";
import { StyleRePlanned } from "./StyleRePlanned";
import API from "../../configs/API";
import db from "../../dbSQLite/SQLiteDb";
import PlannedOffline from "../../dbSQLite/PlannedOffline";
import PlannedNoRemarkOffline from "../../dbSQLite/PlannedNoRemarkOffline";
import PlannedUpdateOffline from "../../dbSQLite/PlannedUpdateOffline";
import PlannedUpdateNoRemarkOffline from "../../dbSQLite/PlannedUpdateNoRemarkOffline";
import { COLORS } from "../../configs/theme";
import { NetworkContext } from "../../../NetworkProvider";
import constants from "../../configs/constants";
import ToastApp from "../ToastApp/ToastApp";
import { getLanguageCode4 } from "../../configs/lang/lang";
import UploadAttachment from "../FileImport/UploadAttachment";

class TaskInformation extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = ({ navigation }) => {
    return {
      title: (
        <FormattedMessage
          id="planned.navigation.detail"
          defaultMessage="Complete task"
        />
      ),

      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
          backToUnplanned={() => {
            navigation.navigate("Refresh");
          }}
        />
      ),
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "#001846",
      },
      headerTintColor: "#fff",
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      ShowDateInput: false,
      hourMeter: 0,
      showSelectDate: false,
      active: false,
      activeDropDown: false,
      activeMoteur: false,
      activeLastMaintenace: false,
      remark: "",
      dataHistory: [],
      dataMeterHistory: [],
      connexion: null,
      isEnabledUp: false,
      isEnabledDown: false,
      activeSwitch: null,
      valueSwitch: null,
      isMandatory: false,
      label: "Subtask",
      value: false,
      subtasksData: [],
      textError: null,
      typeError: null,
      isMandatory: false,
    };

    this.connexionlistner;
  }

  async onLineMode() {
    const that = this;
    const { navigation } = this.props;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const item = navigation.getParam("item");

    if (this.props.TaskReducer.taskName !== "Meters") {
      axios
        .get(API.getHisoriqueTask + item.plannedMaintenance._id, {
          headers: {
            AUTHORIZATION: `Bearer ${token.accessToken}`,
          },
        })
        .then(function (response) {
          that.setState({
            dataHistory: response.data.results,
          });
          const action = {
            type: "HISTORIQUE_ACTION",
            value: response.data.results,
          };
          that.props.dispatch(action);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  async onLineModeMeter() {
    const that = this;
    const { navigation } = this.props;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const item = navigation.getParam("item");

    if (this.props.TaskReducer.taskName === "Meters") {
      axios
        .get(`${constants.apiUrl}/readings?equipmentId=${item._id}&limit=3`, {
          headers: {
            AUTHORIZATION: `Bearer ${token.accessToken}`,
          },
        })
        .then(function (response) {
          that.setState({
            dataHistory: response.data.results,
          });
          const actions = {
            type: "HISTORIQUE_METERS_ACTION",
            value: response.data.results,
          };
          that.props.dispatch(actions);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  //Permission Pick  attachement
  async componentDidMount() {
    const { navigation } = this.props;
    const item = navigation.getParam("item");
    // get subtask
    this.setState({
      subtasksData: item.subtasks,
    });

    const connexion = this.context.connexion;
    if (connexion) {
      this.onLineMode();
      this.onLineModeMeter();
    }
  }

  //show date picker
  onDatePicker = () => {
    this.setState({
      showSelectDate: true,
    });
  };

  keyExtractor = (item, index) => index.toString();

  //historique Item
  renderItemResults = ({ item }) => (
    <View style={StyleRePlanned.listRow} key={item._id}>
      <View style={StyleRePlanned.listRow1}>
        <View style={StyleRePlanned.circle}></View>
        {item?.closedBy ? (
          <Text style={StyleRePlanned.blueTextSmall}>
            {item.closedBy.firstName} {item.closedBy.lastName}{" "}
          </Text>
        ) : null}
      </View>

      <View style={StyleRePlanned.listRow2}>
        <View style={StyleRePlanned.yellowLine}></View>
        <View>
          {
            // no Comment
            item?.remark ? (
              <Text style={StyleRePlanned.greyTextComment}>{item.remark}</Text>
            ) : (
              <Text style={StyleRePlanned.lightGreyText}>
                {this.props.intl.formatMessage({
                  id: "meters.noComment",
                  defaultMessage: "No comment was provided",
                })}
              </Text>
            )
          }
          <Text style={StyleRePlanned.lightGreyText}>
            {this.props.intl.formatDate(
              DateTime.fromISO(item.actualResolutionDate),
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }
            )}
          </Text>
        </View>
        <View>
          <Ionicons
            name="person-circle"
            color={COLORS.customYellow}
            size={40}
          />
        </View>
      </View>
    </View>
  );

  renderSubtask = ({ item, index }) => (
    <View style={StyleRePlanned.fieldContainer}>
      <Text style={StyleRePlanned.blueText}>
        {item.label}
        {item.isMandatory ? (
          <Text style={StyleRePlanned.required}> *</Text>
        ) : null}
      </Text>
      <View style={StyleTaskInformation.SwitchContent}>
        <Text
          style={
            item.value
              ? StyleTaskInformation.SwitchValueOff
              : StyleTaskInformation.SwitchValueOn
          }
        >
          {" "}
          {this.props.intl.formatMessage({
            id: "planned.notDone",
            defaultMessage: "Pas fait",
          })}
        </Text>
        <View>
          <Switch
            style={StyleTaskInformation.switch}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => this.toggleSwitch(item)}
            value={item.value}
          />
        </View>
        <Text
          style={
            !item.value
              ? StyleTaskInformation.SwitchValueOff
              : StyleTaskInformation.SwitchValueOn
          }
        >
          {" "}
          {this.props.intl.formatMessage({
            id: "planned.done",
            defaultMessage: "Fait",
          })}{" "}
        </Text>
      </View>
      {item.isMandatory ? (
        !item.value ? (
          <Text style={{ color: "red" }}>
            {this.props.intl.formatMessage({
              id: "planned.form.subtask.instruction",
              defaultMessage: "All mandatory task has to be completed",
            })}
          </Text>
        ) : null
      ) : null}
    </View>
  );

  // navigation to update task
  navigateTo = (screen, item) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen, { item: item });
    const that = this;
  };
  navigateToBack = (screen, item) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen, { item: item });
    const that = this;
    const action = { type: "GOBACK_UNPLANNED_ACTION", value: false };
    that.props.dispatch(action);
  };

  handleHourMeter = (text) => {
    this.setState({ hourMeter: text });
  };

  handleComment = (text) => {
    this.setState({ remark: text });
    const action = { type: "COMMENT_ACTION", value: text };
    this.props.dispatch(action);
  };

  //toast error
  handleToastOnline() {
    const errorMessage = this.props.intl.formatMessage({
      id: "planned.toast.errorSendingOnline",
      defaultMessage: "An error has occurred when sending your content",
    });
    const errorType = "Error";

    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: errorMessage };
    this.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: errorType };
    this.props.dispatch(actionErrorType);
  }

  handleToastOnlineClose() {
    const errorMessage = this.props.intl.formatMessage({
      id: "planned.toast.errorCloseContent",
      defaultMessage: "An error has occurred when we closed your content",
    });
    const errorType = "Error";

    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: errorMessage };
    this.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: errorType };
    this.props.dispatch(actionErrorType);
  }

  handleToastOffline() {
    const errorMessage = this.props.intl.formatMessage({
      id: "planned.toast.errorSendingOffline",
      defaultMessage: "An error has occurred when sending offline content",
    });
    const errorType = "Error";

    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: errorMessage };
    this.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: errorType };
    this.props.dispatch(actionErrorType);
  }

  //update task planned
  async resolutionPlannedTask(
    idTask,
    actualResolutionDate,
    resolutionHourMeterValue,
    remark
  ) {
    const action = { type: "COMMENT_ACTION", value: "" };
    const that = this;
    this.props.dispatch(action);
    const { connexion } = this.state;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;

    const { navigation } = this.props;
    const data = {
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      resolutionHourMeterValue: parseInt(resolutionHourMeterValue),
      remark: remark,
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closeTask(idTask);
      })
      .catch(function (error) {
        that.handleToastOnline();
      });
  }

  async resolutionPlannedTaskNoRemark(
    idTask,
    actualResolutionDate,
    resolutionHourMeterValue
  ) {
    const action = { type: "COMMENT_ACTION", value: "" };
    const that = this;
    this.props.dispatch(action);
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;

    const data = {
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      resolutionHourMeterValue: parseInt(resolutionHourMeterValue),
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closeTask(idTask);
      })
      .catch(function (error) {
        that.handleToastOnline();
      });
  }

  //data to offline mode
  async resolutionPlannedTaskOffLine(
    idTask,
    actualResolutionDate,
    resolutionHourMeterValue,
    remark
  ) {
    const { navigation } = this.props;
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS PlannedOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,actualResolutionDate DATE,resolutionHourMeterValue INT,remark TEXT,subtask TEXT);"
      );
    });

    const { TaskReducer } = this.props;
    const offLineMode = TaskReducer.plannedOffline;
    const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: false };
    this.props.dispatch(actionAuth);

    const updatedData = offLineMode.map((item) => {
      if (item._id === idTask) {
        item.edited = true;
        return item;
      } else {
        return item;
      }
    });

    const actionPlanned = { type: "PLANNED_ACTION", value: updatedData };
    this.props.dispatch(actionPlanned);
    const actionToastPlanned = { type: "TOAST_PLANNED_ACTION", value: true };
    this.props.dispatch(actionToastPlanned);

    PlannedOffline.create({
      idTask: idTask,
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      resolutionHourMeterValue: resolutionHourMeterValue,
      remark: remark,
      subtask: "false",
    })
      .then((id) => {
        // alert('planned updated with id: ' + id)
        navigation.navigate("Refresh");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async resolutionPlannedTaskNoRemarkOffLine(
    idTask,
    actualResolutionDate,
    resolutionHourMeterValue
  ) {
    const { navigation } = this.props;
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS PlannedNoRemarkOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,actualResolutionDate DATE,resolutionHourMeterValue INT,subtask TEXT);"
      );
    });

    const { TaskReducer } = this.props;
    const offLineMode = TaskReducer.plannedOffline;
    const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: false };
    this.props.dispatch(actionAuth);

    const updatedData = offLineMode.map((item) => {
      if (item._id === idTask) {
        item.edited = true;
        return item;
      } else {
        return item;
      }
    });

    const actionPlanned = { type: "PLANNED_ACTION", value: updatedData };
    this.props.dispatch(actionPlanned);
    const actionToastPlanned = { type: "TOAST_PLANNED_ACTION", value: true };
    this.props.dispatch(actionToastPlanned);

    PlannedNoRemarkOffline.create({
      idTask: idTask,
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      resolutionHourMeterValue: resolutionHourMeterValue,
      subtask: "false",
    })
      .then((id) => {
        // alert('planned updated with id: ' + id)
        navigation.navigate("Refresh");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async updatePlannedTask(idTask, actualResolutionDate, remark) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const data = {
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      remark: remark,
    };

    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closeTask(idTask);
      })
      .catch(function (error) {
        that.handleToastOnline();
      });
  }

  async updatePlannedTaskNoRemark(idTask, actualResolutionDate) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const data = {
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
    };

    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closeTask(idTask);
      })
      .catch(function (error) {
        that.handleToastOnline();

        console.log(error);
      });
  }

  async updateOfflinePlannedTask(idTask, actualResolutionDate, remark) {
    const { navigation } = this.props;
    const that = this;
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS PlannedUpdateOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,actualResolutionDate DATE,remark TEXT,subtask TEXT);"
      );
    });

    const { TaskReducer } = this.props;
    const offLineMode = TaskReducer.plannedOffline;

    const updatedData = offLineMode.map((item) => {
      if (item._id === idTask) {
        item.edited = true;
        return item;
      } else {
        return item;
      }
    });

    const actionPlanned = { type: "PLANNED_ACTION", value: updatedData };
    this.props.dispatch(actionPlanned);
    const actionToastPlanned = { type: "TOAST_PLANNED_ACTION", value: true };
    this.props.dispatch(actionToastPlanned);

    PlannedUpdateOffline.create({
      idTask: idTask,
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      remark: remark,
      subtask: "false",
    })
      .then((id) => {
        // alert('planned updated with id: ' + id)
        navigation.navigate("Refresh");
      })
      .catch((err) => {});
  }

  //no remark
  async updateOfflinePlannedTaskNoRemark(idTask, actualResolutionDate) {
    const { navigation } = this.props;
    const that = this;
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS PlannedUpdateNoRemarkOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,actualResolutionDate DATE,subtask TEXT);"
      );
    });

    const { TaskReducer } = this.props;
    const offLineMode = TaskReducer.plannedOffline;

    const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: false };
    this.props.dispatch(actionAuth);

    const updatedData = offLineMode.map((item) => {
      if (item._id === idTask) {
        item.edited = true;
        return item;
      } else {
        return item;
      }
    });

    const actionPlanned = { type: "PLANNED_ACTION", value: updatedData };
    this.props.dispatch(actionPlanned);
    const actionToastPlanned = { type: "TOAST_PLANNED_ACTION", value: true };
    this.props.dispatch(actionToastPlanned);

    PlannedUpdateNoRemarkOffline.create({
      idTask: idTask,
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      subtask: "false",
    })
      .then((id) => {
        // alert('planned updated with id: ' + id)
        navigation.navigate("Refresh");
      })
      .catch((error) => {});
  }

  //subtask 1
  async updatePlannedHourSubTask(
    idTask,
    actualResolutionDate,
    resolutionHourMeterValue,
    remark,
    subtasks
  ) {
    const { connexion } = this.state;
    const { AuthReducer } = this.props;
    const that = this;
    const token = AuthReducer.token;
    const { navigation } = this.props;
    const updatedData = subtasks.map((element, index) => {
      const data = {
        _id: element._id,
        value: element.value,
      };
      return data;
    });
    const data = {
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      resolutionHourMeterValue: parseInt(resolutionHourMeterValue),
      remark: remark,
      subtasks: updatedData,
    };

    console.log("subtask", updatedData);

    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closeTask(idTask);
      })
      .catch(function (error) {
        that.handleToastOnline();
        console.log(error);
      });
  }

  //subtask Offline
  async updatePlannedHourSubTaskOffline(
    idTask,
    actualResolutionDate,
    resolutionHourMeterValue,
    remark,
    subtasks
  ) {
    const { navigation } = this.props;
    const that = this;
    const { TaskReducer } = this.props;
    const offLineMode = TaskReducer.plannedOffline;
    const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: false };
    this.props.dispatch(actionAuth);
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS PlannedOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,actualResolutionDate DATE,resolutionHourMeterValue INT,remark TEXT,subtask TEXT);"
      );
    });

    const updatedSubtask = subtasks.map((element, index) => {
      const data = {
        _id: element._id,
        value: element.value,
      };
      return data;
    });

    const updatedData = offLineMode.map((item) => {
      if (item._id === idTask) {
        item.edited = true;
        item.subtasks = subtasks;
        return item;
      } else {
        return item;
      }
    });

    const actionPlanned = { type: "PLANNED_ACTION", value: updatedData };
    this.props.dispatch(actionPlanned);
    const actionToastPlanned = { type: "TOAST_PLANNED_ACTION", value: true };
    this.props.dispatch(actionToastPlanned);
    const all = [];
    all.push(
      PlannedOffline.create({
        idTask: idTask,
        actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
        resolutionHourMeterValue: resolutionHourMeterValue,
        remark: remark,
        subtask: "true",
      })
    );

    Promise.all(all)
      .then((array) => {
        navigation.navigate("Refresh");
      })
      .catch((err) => {});
  }

  //Subtask NO remark
  async updatePlannedSubTaskHourNoRemark(
    idTask,
    actualResolutionDate,
    resolutionHourMeterValue,
    subtasks
  ) {
    const { connexion } = this.state;
    const { AuthReducer } = this.props;
    const that = this;
    const token = AuthReducer.token;
    const { navigation } = this.props;

    const updatedData = subtasks.map((element, index) => {
      const data = {
        _id: element._id,
        value: element.value,
      };
      return data;
    });

    const data = {
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      resolutionHourMeterValue: parseInt(resolutionHourMeterValue),
      subtasks: updatedData,
    };
    console.log("subtask online", updatedData);

    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closeTask(idTask);
      })
      .catch(function (error) {
        that.handleToastOnline();
        console.log(error);
      });
  }

  //Subtask NO remark Offline
  async updatePlannedSubTaskHourNoRemarkOffline(
    idTask,
    actualResolutionDate,
    resolutionHourMeterValue,
    subtasks
  ) {
    const that = this;
    const { navigation } = this.props;
    const { TaskReducer } = this.props;
    const offLineMode = TaskReducer.plannedOffline;
    const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: false };
    this.props.dispatch(actionAuth);
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS PlannedNoRemarkOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,actualResolutionDate DATE,resolutionHourMeterValue INT,subtask TEXT);"
      );
    });

    const updatedSubtask = subtasks.map((element, index) => {
      const data = {
        _id: element._id,
        value: element.value,
      };
      return data;
    });

    const updatedData = offLineMode.map((item) => {
      if (item._id === idTask) {
        item.edited = true;
        item.subtasks = subtasks;
        return item;
      } else {
        return item;
      }
    });

    // console.log("updatedData",updatedData)

    const actionPlanned = { type: "PLANNED_ACTION", value: updatedData };
    this.props.dispatch(actionPlanned);
    const actionToastPlanned = { type: "TOAST_PLANNED_ACTION", value: true };
    this.props.dispatch(actionToastPlanned);
    const all = [];
    all.push(
      PlannedNoRemarkOffline.create({
        idTask: idTask,
        actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
        resolutionHourMeterValue: resolutionHourMeterValue,
        subtask: "true",
      })
    );

    Promise.all(all)
      .then((array) => {
        navigation.navigate("Refresh");
      })
      .catch((err) => {});
  }

  //subtask 1
  async updatePlannedSubTask(idTask, actualResolutionDate, remark, subtasks) {
    const { connexion } = this.state;
    const { AuthReducer } = this.props;
    const that = this;
    const token = AuthReducer.token;
    const { navigation } = this.props;
    const updatedData = subtasks.map((element, index) => {
      const data = {
        _id: element._id,
        value: element.value,
      };
      return data;
    });

    const data = {
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      remark: remark,
      subtasks: updatedData,
    };

    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closeTask(idTask);
      })
      .catch(function (error) {
        that.handleToastOnline();
      });
  }

  //subtask 1 Offline
  async updatePlannedSubTaskOffline(
    idTask,
    actualResolutionDate,
    remark,
    subtasks
  ) {
    const that = this;
    const { navigation } = this.props;
    const { TaskReducer } = this.props;
    const offLineMode = TaskReducer.plannedOffline;
    const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: false };
    this.props.dispatch(actionAuth);

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS PlannedUpdateOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,actualResolutionDate DATE,remark TEXT,subtask TEXT);"
      );
    });

    const updatedSubtask = subtasks.map((element, index) => {
      const data = {
        _id: element._id,
        value: element.value,
      };
      return data;
    });

    const updatedData = offLineMode.map((item) => {
      if (item._id === idTask) {
        item.edited = true;
        item.subtasks = subtasks;
        return item;
      } else {
        return item;
      }
    });

    const actionPlanned = { type: "PLANNED_ACTION", value: updatedData };
    this.props.dispatch(actionPlanned);
    const actionToastPlanned = { type: "TOAST_PLANNED_ACTION", value: true };
    this.props.dispatch(actionToastPlanned);
    // const all = [];

    // all.push(PlannedUpdateOffline.create({
    //   idTask: idTask,
    //   actualResolutionDate: format(actualResolutionDate, 'yyyy-MM-dd'),
    //   remark: remark,
    //   subtask:"true"
    // }))

    // Promise.all(all).then(array => {
    //   navigation.navigate('Refresh')
    // })
    //   .catch(err => {
    //   })

    PlannedUpdateOffline.create({
      idTask: idTask,
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      remark: remark,
      subtask: "true",
    })
      .then((id) => {
        navigation.navigate("Refresh");
      })
      .catch((err) => {});
  }

  //Subtask NO remark
  async updatePlannedSubTaskNoRemark(idTask, actualResolutionDate, subtasks) {
    const { AuthReducer } = this.props;
    const that = this;
    const token = AuthReducer.token;
    const updatedData = subtasks.map((element, index) => {
      const data = {
        _id: element._id,
        value: element.value,
      };
      return data;
    });
    const data = {
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      subtasks: updatedData,
    };

    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closeTask(idTask);
      })
      .catch(function (error) {
        that.handleToastOnline();
      });
  }

  //Subtask NO remark Offline
  async updatePlannedSubTaskNoRemarkOffline(
    idTask,
    actualResolutionDate,
    subtasks
  ) {
    const that = this;
    const { navigation } = this.props;
    const { TaskReducer } = this.props;
    const offLineMode = TaskReducer.plannedOffline;

    const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: false };
    this.props.dispatch(actionAuth);

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS PlannedUpdateNoRemarkOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,actualResolutionDate DATE,subtask TEXT);"
      );
    });

    const updatedSubtask = subtasks.map((element, index) => {
      const data = {
        _id: element._id,
        value: element.value,
      };
      return data;
    });

    const updatedData = offLineMode.map((item) => {
      if (item._id === idTask) {
        item.edited = true;
        item.subtasks = subtasks;
        return item;
      } else {
        return item;
      }
    });

    const actionPlanned = { type: "PLANNED_ACTION", value: updatedData };
    this.props.dispatch(actionPlanned);
    const actionToastPlanned = { type: "TOAST_PLANNED_ACTION", value: true };
    this.props.dispatch(actionToastPlanned);
    const all = [];

    all.push(
      PlannedUpdateNoRemarkOffline.create({
        idTask: idTask,
        actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
        subtask: "true",
      })
    );

    Promise.all(all)
      .then((array) => {
        navigation.navigate("Refresh");
      })
      .catch((err) => {});
  }

  //close task
  async closeTask(idTask) {
    const { navigation } = this.props;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const that = this;
    const datab = {
      status: "closed",
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: datab,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        navigation.navigate("Refresh");
      })
      .catch(function (error) {
        that.handleToastOnlineClose();
      });
  }

  //subtask content

  toggleSwitch = (item) => {
    const { subtasksData } = this.state;

    const updatedData = subtasksData.map((element, index) => {
      if (element._id === item._id) {
        element.value = !element.value;
        return element;
      }
      return element;
    });

    this.setState({
      subtasksData: updatedData,
    });
  };

  render() {
    const { navigation, TaskReducer } = this.props;
    const { intl } = this.props;
    const { date, showSelectDate, hourMeter, remark, subtasksData } =
      this.state;

    const dataHistory = TaskReducer.dataHistorique;
    const connexion = this.context.connexion;
    const textError = TaskReducer.textError;
    const typeError = TaskReducer.typeToastError;
    const item = navigation.getParam("item");
    const mandatorySubtask = subtasksData.filter((item) => item.isMandatory);
    let conditionSubtask = false;
    // handle toast type success
    const update = typeError !== "Error";

    if (mandatorySubtask.length > 1) {
      const conditionReducer = (accumulator, currentValue) =>
        accumulator.value && currentValue.value;
      conditionSubtask = mandatorySubtask.reduce(conditionReducer);
    } else {
      conditionSubtask = mandatorySubtask[0]?.value;
    }

    return (
      <View style={connexion ? StyleRePlanned.container : StyleRePlanned.containerOffline }>
        <ToastApp text={textError} type={typeError} update={update} />
        {connexion ? null : (
          <View style={StyleRePlanned.orangeError}>
            <Text style={StyleRePlanned.orangeErrorText}>
              {intl.formatMessage({
                id: "connexion.text",
                defaultMessage:
                  "Device currently offline, any updates will be sent automatically when the connection is restored",
              })}
            </Text>
          </View>
        )}

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentInset={{top:0, bottom:32}}
        >
          <View
            style={
              connexion
                ? StyleRePlanned.headerContainer
                : StyleRePlanned.headerContainerNO
            }
          >
            <Text style={StyleRePlanned.heading}>
              {intl.formatMessage({
                id: "planned.title",
                defaultMessage: "Planned Event",
              })}
            </Text>
          </View>
          <Card containerStyle={{ borderRadius: 5 }}>
            {
              <View style={StyleRePlanned.fieldContainer}>
                <Text style={StyleRePlanned.blueText}>
                  {intl.formatMessage({
                    id: "planned.date",
                    defaultMessage: "Date when you complete the task",
                  })}
                </Text>
                <View style={StyleTaskInformation.datePickerContainer}>
                  <Icon
                    name="calendar"
                    color={COLORS.customYellow}
                    size={20}
                    style={{ marginRight: 10 }}
                  />
                  {Platform.OS == "ios" ? (
                    <DateTimePicker
                      style={StyleTaskInformation.datePickerContent}
                      value={date}
                      testID="dateTimePicker"
                      mode="date"
                      is24Hour={true}
                      locale={getLanguageCode4()}
                      display="default"
                      minimumDate={
                        dataHistory.length < 1 ? null : new Date(item.createdAt)
                      }
                      maximumDate={new Date()}
                      onChange={(event, value) => {
                        this.setState({
                          date: value,
                          showSelectDate: false,
                        });
                      }}
                    />
                  ) : (
                    <View>
                      {showSelectDate ? (
                        <DateTimePicker
                          value={date}
                          mode="date"
                          is24Hour={true}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          display="default"
                          testID="dateTimePicker"
                          minimumDate={
                            dataHistory.length < 1
                              ? null
                              : new Date(item.createdAt)
                          }
                          maximumDate={new Date()}
                          onChange={(event, value) => {
                            this.setState({
                              date: value ? value : date,
                              showSelectDate: false,
                              ShowDateInput: true,
                            });
                          }}
                        />
                      ) : null}
                      <View style={StyleRePlanned.inline}>
                        <Text style={{ marginRight: 10 }}>
                          {format(date, "dd/MM/yyyy")}
                        </Text>
                        <Button
                          title={intl.formatMessage({
                            id: "date.change",
                            defaultMessage: "Change",
                          })}
                          onPress={() => this.onDatePicker()}
                          containerStyle={StyleRePlanned.buttonSubmit}
                          buttonStyle={{ backgroundColor: COLORS.primary }}
                          titleStyle={{ fontSize: 15 }}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            }
            {
              //if resolution meter isn't undifined
              item?.plannedMaintenance?.hourMeterBasedRecurrence ? (
                <View style={StyleRePlanned.fieldContainer}>
                  <Text style={StyleRePlanned.blueText}>
                    {intl.formatMessage({
                      id: "planned.runningMeter",
                      defaultMessage:
                        "Running meter value when you complete the maintenance",
                    })}
                    <Text style={StyleRePlanned.required}> *</Text>
                  </Text>
                  <View>
                    <TextInput
                      placeholder={`${
                        item?.resolutionHourMeterValue
                          ? item.resolutionHourMeterValue
                          : item.equipment.hourMeter.lastValue
                      } hours`}
                      keyboardType="numeric"
                      style={StyleRePlanned.textArea}
                      multiline={true}
                      onChangeText={this.handleHourMeter}
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </View>
                  {hourMeter.length < 1 || hourMeter === 0 ? (
                    <Text style={{ color: "red" }}>
                      {intl.formatMessage({
                        id: "planned.form.meter.instruction",
                        defaultMessage:
                          "Resolution meter is mandatory to be filled.",
                      })}
                    </Text>
                  ) : item?.resolutionHourMeterValue ? (
                    hourMeter <
                    parseInt(item.resolutionHourMeterValue.toString(), 10) ? (
                      <Text style={{ color: "red" }}>
                        {intl.formatMessage(
                          {
                            id: "planned.form.meter.errorUpdateLess",
                          },
                          {
                            value: item.resolutionHourMeterValue.toString(),
                          }
                        )}
                      </Text>
                    ) : null
                  ) : item?.previousTask?.resolutionHourMeterValue ? (
                    hourMeter <
                    parseInt(
                      item.previousTask.resolutionHourMeterValue.toString(),
                      10
                    ) ? (
                      <Text style={{ color: "red" }}>
                        {intl.formatMessage(
                          {
                            id: "planned.form.meter.errorLess",
                          },
                          {
                            value:
                              item.previousTask.resolutionHourMeterValue.toString(),
                          }
                        )}
                      </Text>
                    ) : hourMeter >
                      parseInt(
                        item.equipment.hourMeter.lastValue.toString(),
                        10
                      ) ? (
                      <Text style={{ color: "red" }}>
                        {intl.formatMessage(
                          {
                            id: "planned.form.meter.errorMore",
                          },
                          {
                            value:
                              item.equipment.hourMeter.lastValue.toString(),
                          }
                        )}{" "}
                      </Text>
                    ) : null
                  ) : hourMeter >
                    parseInt(
                      item.equipment.hourMeter.lastValue.toString(),
                      10
                    ) ? (
                    <Text style={{ color: "red" }}>
                      {intl.formatMessage(
                        {
                          id: "planned.form.meter.errorMore",
                        },
                        {
                          value: item.equipment.hourMeter.lastValue.toString(),
                        }
                      )}
                    </Text>
                  ) : null}
                </View>
              ) : null
            }

            {
              <>
                <View style={StyleRePlanned.fieldContainer}>
                  {item.subtasks.length < 1 ? null : (
                    <FlatList
                      vertical
                      pagingEnabled
                      alwaysBounceVertical={false}
                      key={this.keyExtractor}
                      // horizontal
                      showsHorizontalScrollIndicator={false}
                      data={subtasksData}
                      renderItem={this.renderSubtask}
                      keyExtractor={(item, index) => item._id}
                    />
                  )}

                  <Text style={StyleRePlanned.blueText}>
                    {intl.formatMessage({
                      id: "planned.remark",
                      defaultMessage: "Add a quick comment",
                    })}
                  </Text>

                  <TextInput
                    placeholder={intl.formatMessage({
                      id: "planned.remarkPlaceholder",
                      defaultMessage: "Ex: I changed this because...",
                    })}
                    style={StyleRePlanned.textArea}
                    multiline={true}
                    onChangeText={this.handleComment}
                    onSubmitEditing={Keyboard.dismiss}
                  />
                </View>
                <View style={StyleRePlanned.fieldContainer}>
                  {item?.plannedMaintenance?.hourMeterBasedRecurrence ? (
                    <>
                      {item.subtasks.length < 1 ? (
                        connexion ? (
                          remark.length < 1 ? (
                            <View style={StyleRePlanned.fieldContainerCenter}>
                              <Button
                                containerStyle={StyleRePlanned.saveButton}
                                buttonStyle={{
                                  backgroundColor: COLORS.primary,
                                }}
                                title={intl.formatMessage({
                                  id: "planned.saveButton",
                                  defaultMessage:
                                    "Save & Calculate next maintenance due date",
                                })}
                                disabled={
                                  hourMeter.length < 1 || hourMeter === 0
                                    ? true
                                    : false
                                }
                                titleStyle={{
                                  color: COLORS.white,
                                  fontSize: 15,
                                }}
                                onPress={() =>
                                  this.resolutionPlannedTaskNoRemark(
                                    item._id,
                                    date,
                                    hourMeter
                                  )
                                }
                              />
                            </View>
                          ) : (
                            <View style={StyleRePlanned.fieldContainerCenter}>
                              <Button
                                containerStyle={StyleRePlanned.saveButton}
                                buttonStyle={{
                                  backgroundColor: COLORS.primary,
                                }}
                                title={intl.formatMessage({
                                  id: "planned.saveButton",
                                  defaultMessage:
                                    "Save & Calculate next maintenance due date",
                                })}
                                disabled={
                                  hourMeter.length < 1 || hourMeter === 0
                                    ? true
                                    : false
                                }
                                titleStyle={{
                                  color: COLORS.white,
                                  fontSize: 15,
                                }}
                                onPress={() =>
                                  this.resolutionPlannedTask(
                                    item._id,
                                    date,
                                    hourMeter,
                                    remark
                                  )
                                }
                              />
                            </View>
                          )
                        ) : remark.length < 1 ? (
                          <View style={StyleRePlanned.fieldContainerCenter}>
                            <Button
                              containerStyle={StyleRePlanned.saveButton}
                              buttonStyle={{ backgroundColor: COLORS.primary }}
                              title={intl.formatMessage({
                                id: "planned.saveButtonOffline",
                                defaultMessage:
                                  "Save offline & Calculate next maintenance due date",
                              })}
                              disabled={
                                hourMeter.length < 1 || hourMeter === 0
                                  ? true
                                  : false
                              }
                              titleStyle={{ color: COLORS.white, fontSize: 15 }}
                              onPress={() =>
                                this.resolutionPlannedTaskNoRemarkOffLine(
                                  item._id,
                                  date,
                                  hourMeter
                                )
                              }
                            />
                          </View>
                        ) : (
                          <View style={StyleRePlanned.fieldContainerCenter}>
                            <Button
                              containerStyle={StyleRePlanned.saveButton}
                              buttonStyle={{ backgroundColor: COLORS.primary }}
                              title={intl.formatMessage({
                                id: "planned.saveButtonOffline",
                                defaultMessage:
                                  "Save offline & Calculate next maintenance due date",
                              })}
                              disabled={
                                hourMeter.length < 1 || hourMeter === 0
                                  ? true
                                  : false
                              }
                              titleStyle={{ color: COLORS.white, fontSize: 15 }}
                              onPress={() =>
                                this.resolutionPlannedTaskOffLine(
                                  item._id,
                                  date,
                                  hourMeter,
                                  remark
                                )
                              }
                            />
                          </View>
                        )
                      ) : //with subtask
                      connexion ? (
                        remark.length < 1 ? (
                          <View style={StyleRePlanned.fieldContainerCenter}>
                            <Button
                              containerStyle={StyleRePlanned.saveButton}
                              buttonStyle={{ backgroundColor: COLORS.primary }}
                              title={intl.formatMessage({
                                id: "planned.saveButton",
                                defaultMessage:
                                  "Save & Calculate next maintenance due date",
                              })}
                              disabled={
                                hourMeter.length < 1 ||
                                hourMeter === 0 ||
                                !conditionSubtask
                                  ? true
                                  : false
                              }
                              titleStyle={{ color: COLORS.white, fontSize: 15 }}
                              onPress={() =>
                                this.updatePlannedSubTaskHourNoRemark(
                                  item._id,
                                  date,
                                  hourMeter,
                                  subtasksData
                                )
                              }
                            />
                          </View>
                        ) : (
                          <View style={StyleRePlanned.fieldContainerCenter}>
                            <Button
                              containerStyle={StyleRePlanned.saveButton}
                              buttonStyle={{ backgroundColor: COLORS.primary }}
                              title={intl.formatMessage({
                                id: "planned.saveButton",
                                defaultMessage:
                                  "Save & Calculate next maintenance due date",
                              })}
                              disabled={
                                hourMeter.length < 1 ||
                                hourMeter === 0 ||
                                !conditionSubtask
                                  ? true
                                  : false
                              }
                              titleStyle={{ color: COLORS.white, fontSize: 15 }}
                              onPress={() =>
                                this.updatePlannedHourSubTask(
                                  item._id,
                                  date,
                                  hourMeter,
                                  remark,
                                  subtasksData
                                )
                              }
                            />
                          </View>
                        )
                      ) : remark.length < 1 ? (
                        <View style={StyleRePlanned.fieldContainerCenter}>
                          <Button
                            containerStyle={StyleRePlanned.saveButton}
                            buttonStyle={{ backgroundColor: COLORS.primary }}
                            title={intl.formatMessage({
                              id: "planned.saveButtonOffline",
                              defaultMessage:
                                "Save offline & Calculate next maintenance due date",
                            })}
                            disabled={
                              hourMeter.length < 1 ||
                              hourMeter === 0 ||
                              !conditionSubtask
                                ? true
                                : false
                            }
                            titleStyle={{ color: COLORS.white, fontSize: 15 }}
                            onPress={() =>
                              this.updatePlannedSubTaskHourNoRemarkOffline(
                                item._id,
                                date,
                                hourMeter,
                                subtasksData
                              )
                            }
                          />
                        </View>
                      ) : (
                        <View style={StyleRePlanned.fieldContainerCenter}>
                          <Button
                            containerStyle={StyleRePlanned.saveButton}
                            buttonStyle={{ backgroundColor: COLORS.primary }}
                            title={intl.formatMessage({
                              id: "planned.saveButtonOffline",
                              defaultMessage:
                                "Save offline & Calculate next maintenance due date",
                            })}
                            disabled={
                              hourMeter.length < 1 ||
                              hourMeter === 0 ||
                              !conditionSubtask
                                ? true
                                : false
                            }
                            titleStyle={{ color: COLORS.white, fontSize: 15 }}
                            onPress={() =>
                              this.updatePlannedHourSubTaskOffline(
                                item._id,
                                date,
                                hourMeter,
                                remark,
                                subtasksData
                              )
                            }
                          />
                        </View>
                      )}
                    </>
                  ) : item.subtasks.length < 1 ? (
                    connexion ? (
                      remark.length < 1 ? (
                        <View style={StyleRePlanned.fieldContainerCenter}>
                          <Button
                            containerStyle={StyleRePlanned.saveButton}
                            buttonStyle={{ backgroundColor: COLORS.primary }}
                            title={intl.formatMessage({
                              id: "planned.saveButton",
                              defaultMessage:
                                "Save & Calculate next maintenance due date",
                            })}
                            titleStyle={{ color: COLORS.white, fontSize: 15 }}
                            onPress={() =>
                              this.updatePlannedTaskNoRemark(item._id, date)
                            }
                          />
                        </View>
                      ) : (
                        <View style={StyleRePlanned.fieldContainerCenter}>
                          <Button
                            containerStyle={StyleRePlanned.saveButton}
                            buttonStyle={{ backgroundColor: COLORS.primary }}
                            title={intl.formatMessage({
                              id: "planned.saveButton",
                              defaultMessage:
                                "Save & Calculate next maintenance due date",
                            })}
                            titleStyle={{ color: COLORS.white, fontSize: 15 }}
                            onPress={() =>
                              this.updatePlannedTask(item._id, date, remark)
                            }
                          />
                        </View>
                      )
                    ) : remark.length < 1 ? (
                      <View style={StyleRePlanned.fieldContainerCenter}>
                        <Button
                          containerStyle={StyleRePlanned.saveButton}
                          buttonStyle={{ backgroundColor: COLORS.primary }}
                          title={intl.formatMessage({
                            id: "planned.saveButtonOffline",
                            defaultMessage:
                              "Save offline & Calculate next maintenance due date",
                          })}
                          titleStyle={{ color: COLORS.white, fontSize: 15 }}
                          onPress={() =>
                            this.updateOfflinePlannedTaskNoRemark(
                              item._id,
                              date
                            )
                          }
                        />
                      </View>
                    ) : (
                      <View style={StyleRePlanned.fieldContainerCenter}>
                        <Button
                          containerStyle={StyleRePlanned.saveButton}
                          buttonStyle={{ backgroundColor: COLORS.primary }}
                          title={intl.formatMessage({
                            id: "planned.saveButtonOffline",
                            defaultMessage:
                              "Save offline & Calculate next maintenance due date",
                          })}
                          titleStyle={{ color: COLORS.white, fontSize: 15 }}
                          onPress={() =>
                            this.updateOfflinePlannedTask(
                              item._id,
                              date,
                              remark
                            )
                          }
                        />
                      </View>
                    )
                  ) : //with subtask
                  connexion ? (
                    remark.length < 1 ? (
                      <View style={StyleRePlanned.fieldContainerCenter}>
                        <Button
                          containerStyle={StyleRePlanned.saveButton}
                          buttonStyle={{ backgroundColor: COLORS.primary }}
                          title={intl.formatMessage({
                            id: "planned.saveButton",
                            defaultMessage:
                              "Save & Calculate next maintenance due date",
                          })}
                          disabled={!conditionSubtask ? true : false}
                          titleStyle={{ color: COLORS.white, fontSize: 15 }}
                          onPress={() =>
                            this.updatePlannedSubTaskNoRemark(
                              item._id,
                              date,
                              subtasksData
                            )
                          }
                        />
                      </View>
                    ) : (
                      <View style={StyleRePlanned.fieldContainerCenter}>
                        <Button
                          containerStyle={StyleRePlanned.saveButton}
                          buttonStyle={{ backgroundColor: COLORS.primary }}
                          disabled={!conditionSubtask ? true : false}
                          title={intl.formatMessage({
                            id: "planned.saveButton",
                            defaultMessage:
                              "Save & Calculate next maintenance due date",
                          })}
                          titleStyle={{ color: COLORS.white, fontSize: 15 }}
                          onPress={() =>
                            this.updatePlannedSubTask(
                              item._id,
                              date,
                              remark,
                              subtasksData
                            )
                          }
                        />
                      </View>
                    )
                  ) : remark.length < 1 ? (
                    <View style={StyleRePlanned.fieldContainerCenter}>
                      <Button
                        containerStyle={StyleRePlanned.saveButton}
                        buttonStyle={{ backgroundColor: COLORS.primary }}
                        disabled={!conditionSubtask ? true : false}
                        title={intl.formatMessage({
                          id: "planned.saveButtonOffline",
                          defaultMessage:
                            "Save offline & Calculate next maintenance due date",
                        })}
                        titleStyle={{ color: COLORS.white, fontSize: 15 }}
                        onPress={() =>
                          this.updatePlannedSubTaskNoRemarkOffline(
                            item._id,
                            date,
                            subtasksData
                          )
                        }
                      />
                    </View>
                  ) : (
                    <View style={StyleRePlanned.fieldContainerCenter}>
                      <Button
                        containerStyle={StyleRePlanned.saveButton}
                        buttonStyle={{ backgroundColor: COLORS.primary }}
                        disabled={!conditionSubtask ? true : false}
                        title={intl.formatMessage({
                          id: "planned.saveButtonOffline",
                          defaultMessage:
                            "Save offline & Calculate next maintenance due date",
                        })}
                        titleStyle={{ color: COLORS.white, fontSize: 15 }}
                        onPress={() =>
                          this.updatePlannedSubTaskOffline(
                            item._id,
                            date,
                            remark,
                            subtasksData
                          )
                        }
                      />
                    </View>
                  )}
                </View>
              </>
            }
            <UploadAttachment item={item} />
          </Card>
          {
            // active information task
            <Card containerStyle={{ borderRadius: 5 }}>
              <View style={StyleRePlanned.fieldContainer}>
                <Text style={StyleRePlanned.blueText}>
                  {intl.formatMessage({
                    id: "planned.maintenanceInfo",
                    defaultMessage: "Maintenance information",
                  })}
                </Text>
                {
                  <View>
                    <View style={StyleRePlanned.borderContainer}>
                      <Text>
                        <Text style={StyleRePlanned.blueTextBold}>
                          {item.name}:{" "}
                        </Text>
                        <Text style={StyleRePlanned.greyText}>
                          {intl.formatMessage({
                            id: "planned.toDoEvery",
                            defaultMessage: "To do every",
                          })}{" "}
                          {item?.plannedMaintenance?.dateBasedRecurrence ? (
                            <Text style={StyleRePlanned.greyText}>
                              {
                                item.plannedMaintenance.dateBasedRecurrence
                                  .value
                              }{" "}
                              {item.plannedMaintenance.dateBasedRecurrence
                                .unit == "month" &&
                                intl.formatMessage({
                                  id: "planned.months",
                                  defaultMessage: "months",
                                })}
                              {item.plannedMaintenance.dateBasedRecurrence
                                .unit == "day" &&
                                intl.formatMessage({
                                  id: "planned.days",
                                  defaultMessage: "days",
                                })}
                              {item.plannedMaintenance.dateBasedRecurrence
                                .unit == "year" &&
                                intl.formatMessage({
                                  id: "planned.years",
                                  defaultMessage: "years",
                                })}
                            </Text>
                          ) : (
                            <Text style={StyleRePlanned.greyText}>
                              {item.plannedMaintenance
                                .hourMeterBasedRecurrence + " "}
                              {intl.formatMessage({
                                id: "planned.hours",
                                defaultMessage: "hours",
                              })}
                            </Text>
                          )}
                        </Text>
                      </Text>
                      {item?.hourMeterBased?.dueHourMeter ? (
                        <Text style={StyleRePlanned.greyText}>
                          {intl.formatMessage(
                            {
                              id: "planned.needToBeCompletedOn",
                            },
                            {
                              dueHourMeter: item.hourMeterBased.dueHourMeter,
                              estimatedDueDate: intl.formatDate(
                                DateTime.fromISO(
                                  item.hourMeterBased.estimatedDueDate
                                ),
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              ),
                              actualResolutionDate: item?.previousTask
                                ?.actualResolutionDate
                                ? intl.formatDate(
                                    DateTime.fromISO(
                                      item.previousTask.actualResolutionDate
                                    ),
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    }
                                  )
                                : intl.formatDate(
                                    DateTime.fromISO(item.updatedAt),
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    }
                                  ),
                            }
                          )}
                        </Text>
                      ) : null}
                    </View>
                    {item?.description ? (
                      <View style={StyleRePlanned.borderContainer}>
                        <Text style={StyleRePlanned.blueTextBold}>
                          {intl.formatMessage({
                            id: "planned.taskDescription",
                            defaultMessage: "Task description",
                          })}
                        </Text>
                        <ScrollView style={StyleTaskInformation.downSCroll}>
                          <Text style={StyleRePlanned.greyText}>
                            {item.description}
                          </Text>
                        </ScrollView>
                      </View>
                    ) : null}
                    <View style={StyleTaskInformation.downTaskNotice}>
                      <Icon
                        name="infocirlce"
                        style={StyleRePlanned.smallGreyText}
                      />
                      <Text style={StyleRePlanned.smallGreyText}>
                        {intl.formatMessage({
                          id: "planned.noSparePart",
                          defaultMessage:
                            "No spare part are linked to this maintenance",
                        })}
                      </Text>
                    </View>
                  </View>
                }
              </View>
              <View style={StyleRePlanned.fieldContainer}>
                <Text style={StyleRePlanned.blueText}>
                  {intl.formatMessage({
                    id: "planned.equipmentInfo",
                    defaultMessage: "Equiment information",
                  })}
                </Text>
                {
                  <View style={StyleRePlanned.borderContainer}>
                    <Text style={StyleRePlanned.blueTextBold}>
                      {item.equipment.name} :{" "}
                      <Text style={StyleRePlanned.greyText}>
                        {item.ship.name}
                      </Text>
                    </Text>

                    {item?.equipment?.hourMeter?.lastValue ? (
                      <Text style={StyleRePlanned.greyText}>
                        {intl.formatMessage(
                          {
                            id: "planned.currentMetersValue",
                          },
                          {
                            hourMeter: item.equipment.hourMeter.lastValue,
                          }
                        )}
                      </Text>
                    ) : null}
                  </View>
                }
              </View>
              {
                //historique for planned
                <View style={StyleRePlanned.fieldContainer}>
                  <Text style={StyleRePlanned.blueText}>
                    <Text style={StyleRePlanned.greyText}>
                      {intl.formatMessage({
                        id: "planned.lastMaintenanceDone",
                        defaultMessage: "Last maintenances done",
                      })}
                    </Text>
                  </Text>

                  {dataHistory.length > 0 ? (
                    <View style={StyleRePlanned.borderContainer}>
                      <FlatList
                        vertical
                        pagingEnabled
                        alwaysBounceVertical={false}
                        key={this.keyExtractor}
                        // horizontal
                        showsHorizontalScrollIndicator={false}
                        data={dataHistory}
                        renderItem={this.renderItemResults}
                        keyExtractor={(item, index) => item._id}
                      />
                    </View>
                  ) : (
                    <Text style={StyleRePlanned.smallGreyNoText}>
                      {intl.formatMessage({
                        id: "planned.noMaintenanceHistory",
                        defaultMessage:
                          "Il n'y a pas d'historique de maintenance",
                      })}
                    </Text>
                  )}
                </View>
              }
            </Card>
          }
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  FilterReducer: state.FilterReducer,
  TaskReducer: state.TaskReducer,
  AuthReducer: state.AuthReducer,
});
export default connectActionSheet(
  injectIntl(connect(mapStateToProps)(TaskInformation))
);
