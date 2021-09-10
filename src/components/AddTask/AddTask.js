import React from "react";
import { Keyboard, Text, View, Platform, SafeAreaView } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Button, Card, Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { format } from "date-fns";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome } from "@expo/vector-icons";
import { injectIntl, FormattedMessage } from "react-intl";
import DropDownPicker from "react-native-dropdown-picker";
import { connect } from "react-redux";

import BackButton from "../BackButton/BackButton";
import { StyleAddTask } from "./StyleAddTask";
import API from "../../configs/API";
import { COLORS } from "../../configs/theme";
import db from "../../dbSQLite/SQLiteDb";
import AddOffline from "../../dbSQLite/AddOffline";
import AddNoDueDateOffline from "../../dbSQLite/AddNoDueDateOffline";
import { NetworkContext } from "../../../NetworkProvider";
import ToastApp from "../ToastApp/ToastApp";
import { getLanguageCode4 } from "../../configs/lang/lang";

class AddTask extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = ({ navigation }) => {
    return {
      title: (
        <FormattedMessage
          id="unplanned.navigation.add"
          defaultMessage="Add unplanned task"
        />
      ),
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
          backToUnplanned={() => {
            navigation.goBack();
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
      name: "",
      dueDate: new Date(),
      description: "",
      type: "unplanned-maintenance",
      equipmentId: "",
      eventDate: new Date(),
      ShowDateInputUp: false,
      ShowDateInputDown: false,
      showSelectDateUp: false,
      showSelectDateDown: false,
      data: [],
      equipmentFiltered: [],
      showEquipment: false,
      equimpentName: "",
      activateDropShip: false,
      activateDropDepartement: false,
      activateDrop: false,
      shipId: null,
      departmentId: null,
      ship: false,
      department: true,
      equipment: true,
      compteDepartment: 0,
      compteEquipment: 0,
      compteShip: 0,
      nameDepartment: null,
      nameEquipment: null,
      connexion: null,
      shipName: "",
      oneClick: false,
      departmentName: "",
      addDueDate: false,
    };
  }

  async componentDidMount() {
    const that = this;
    const { AuthReducer } = this.props;
    const connexion = this.context.connexion;
    const userEmail = AuthReducer.email;
    const userPassword = AuthReducer.password;
    if (connexion) {
      axios
        .post(API.login, {
          email: userEmail,
          password: userPassword,
          type: "user",
        })
        .then(function (response) {
          that.setState(
            {
              userToken: response.data,
            },
            () => that.getToken()
          );
        })
        .catch(function (error) {});
    }
  }

  async getToken() {
    const that = this;
    const { userToken } = this.state;
    const action = { type: "SHIP_FILTER_ACTION", value: userToken.user.ships };
    that.props.dispatch(action);
    const actionToken = { type: "AUTH_ACTION_TOKEN", value: userToken };
    that.props.dispatch(actionToken);
    await this.getDepartment();
    await this.getEquipment();
  }

  getEquipment = async () => {
    const that = this;
    const { userToken } = this.state;
    const token = userToken;
    axios({
      method: "GET",
      url: API.listEquipment,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        const action = {
          type: "EQUIPMENT_FILTER_ACTION",
          value: response.data.results,
        };
        that.props.dispatch(action);
      })
      .catch(function (error) {
        console.warn(error);
      });
  };

  getDepartment = async () => {
    const that = this;
    const { userToken } = this.state;
    const token = userToken;
    axios({
      method: "GET",
      url: API.listDepartment,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        const action = {
          type: "DEPARTMENT_FILTER_ACTION",
          value: response.data.results,
        };
        that.props.dispatch(action);
      })
      .catch(function (error) {
        console.warn(error);
      });
  };

  onDatePickerUp = () => {
    this.setState({
      showSelectDateUp: true,
    });
  };

  onDatePickerDown = () => {
    this.setState({
      showSelectDateDown: true,
    });
  };

  handleToastOnline() {
    const errorMessage = this.props.intl.formatMessage({
      id: "unplanned.toast.errorSendingOnline",
      defaultMessage: "An error has occurred when sending your content",
    });
    const errorType = "Error";

    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: errorMessage };
    this.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: errorType };
    this.props.dispatch(actionErrorType);
  }

  handleToastOffline() {
    const errorMessage = this.props.intl.formatMessage({
      id: "unplanned.toast.errorSendingOffline",
      defaultMessage: "An error has occurred when sending offline content",
    });
    const errorType = "Error";

    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: errorMessage };
    this.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: errorType };
    this.props.dispatch(actionErrorType);
  }

  navigateTo = (screen, item, taskName) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen, { item: item, taskName: taskName });
  };

  async addTask(name, dueDate, description, eventDate, equipmentId) {
    const that = this;
    this.setState({
      oneClick: true,
    });
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const { navigation, TaskReducer } = this.props;
    const data = {
      name: name,
      dueDate: format(dueDate, "yyyy-MM-dd"),
      description: description,
      eventDate: format(eventDate, "yyyy-MM-dd"),
      type: "unplanned-maintenance",
      equipmentId: equipmentId,
    };
    axios({
      method: "POST",
      url: API.patchTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        const that = this;
        console.log("the answer", response.data);
        const item = response.data;
        navigation.navigate("TaskInformationUnplanned", {
          item: item,
          taskName: TaskReducer.taskName,
        });
      })
      .catch(function (error) {
        that.handleToastOnline();
      });

    const action = { type: "GOBACK_UNPLANNED_ACTION", value: true };
    that.props.dispatch(action);
  }

  //no due date
  async addTaskNoDueDate(name, description, eventDate, equipmentId) {
    const that = this;
    this.setState({
      oneClick: true,
    });
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const { navigation, TaskReducer } = this.props;
    const data = {
      name: name,
      description: description,
      eventDate: format(eventDate, "yyyy-MM-dd"),
      type: "unplanned-maintenance",
      equipmentId: equipmentId,
    };
    axios({
      method: "POST",
      url: API.patchTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        const that = this;
        console.log("the answer", response.data);
        const item = response.data;
        navigation.navigate("TaskInformationUnplanned", {
          item: item,
          taskName: TaskReducer.taskName,
        });
      })
      .catch(function (error) {
        that.handleToastOnline();
      });

    const action = { type: "GOBACK_UNPLANNED_ACTION", value: true };
    that.props.dispatch(action);
  }

  //addoffline mode
  async addTaskOffline(
    name,
    dueDate,
    description,
    eventDate,
    equipmentId,
    shipName,
    equimpentName
  ) {
    const that = this;
    this.setState({
      oneClick: true,
    });

    const { navigation, TaskReducer } = this.props;
    const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: false };
    this.props.dispatch(actionAuth);
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS AddOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,dueDate DATE,description TEXT,eventDate DATE,equipmentId TEXT);"
      );
    });
    const offLineMode = TaskReducer.unplannedOffline;
    offLineMode.push({
      name: name,
      dueDate: format(dueDate, "yyyy-MM-dd"),
      description: description,
      eventDate: format(eventDate, "yyyy-MM-dd"),
      createdAt: format(new Date(), "yyyy-MM-dd"),
      ship: { name: shipName },
      equipment: { name: equimpentName },
    });

    const actionUnplanned = { type: "UNPLANNED_ACTION", value: offLineMode };
    this.props.dispatch(actionUnplanned);
    const actionToastUnplanned = {
      type: "TOAST_UNPLANNED_ACTION",
      value: true,
    };
    this.props.dispatch(actionToastUnplanned);

    AddOffline.create({
      name: name,
      dueDate: format(dueDate, "yyyy-MM-dd"),
      description: description,
      eventDate: format(eventDate, "yyyy-MM-dd"),
      equipmentId: equipmentId,
    })
      .then((id) => {
        navigation.navigate("Refresh");
      })
      .catch((err) => {
        that.handleToastOffline();
      });
  }
  //no due date
  async addTaskNoDueDateOffline(
    name,
    description,
    eventDate,
    equipmentId,
    shipName,
    departmentName,
    equimpentName
  ) {
    const that = this;
    this.setState({
      oneClick: true,
    });

    const { navigation, TaskReducer } = this.props;
    const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: false };
    this.props.dispatch(actionAuth);
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS AddNoDueDateOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,description TEXT,eventDate DATE,equipmentId TEXT);"
      );
    });
    const offLineMode = TaskReducer.unplannedOffline;
    offLineMode.push({
      name: name,
      description: description,
      eventDate: format(eventDate, "yyyy-MM-dd"),
      createdAt: format(new Date(), "yyyy-MM-dd"),
      ship: { name: shipName },
      equipment: { name: equimpentName },
    });

    const actionUnplanned = { type: "UNPLANNED_ACTION", value: offLineMode };
    this.props.dispatch(actionUnplanned);
    const actionToastUnplanned = {
      type: "TOAST_UNPLANNED_ACTION",
      value: true,
    };
    this.props.dispatch(actionToastUnplanned);

    AddNoDueDateOffline.create({
      name: name,
      description: description,
      eventDate: format(eventDate, "yyyy-MM-dd"),
      equipmentId: equipmentId,
    })
      .then((id) => {
        navigation.navigate("Refresh");
      })
      .catch((err) => {
        that.handleToastOffline();
      });
  }

  handleName = (text) => {
    this.setState({ name: text });
  };

  handleComment = (text) => {
    this.setState({ description: text });
  };

  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        this.setState({
          equipmentId: item._id,
          showEquipment: true,
          equimpentName: item.name,
        })
      }
      style={StyleAddTask.equipmentContent}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  searchFilterFunction = (text) => {
    const data = this.state.data;
    const newData = data.filter((item) => {
      const itemData = `${item.name.toLowerCase()}`;
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({ equipmentFiltered: newData });
  };

  selectData(item) {
    this.setState({
      equipmentId: item.value,
      activateDrop: true,
      equimpentName: item.label,
    });
  }

  selectDataShip(item) {
    this.setState(
      {
        shipId: item.value,
        activateDropShip: true,
        departmentId: null,
        equipmentId: null,
        department: false,
        equipment: false,
        shipName: item.label,
      },
      () => this.onCloseShip()
    );
  }

  selectDataDepartment(item) {
    this.setState(
      {
        departmentId: item.value,
        activateDropDepartement: true,
        equipmentId: null,
        departmentName: item.label,
      },
      () => this.onCloseDepartment()
    );
  }

  onOpenShip() {
    this.setState({
      activateDropShip: true,
      ship: false,
      department: true,
      equipment: true,
    });
  }

  onOpenDepartment() {
    this.setState({
      activateDropDepartement: true,
      ship: true,
      department: false,
      equipment: true,
    });
  }

  onOpen() {
    this.setState({
      activateDrop: true,
      ship: true,
      department: true,
      equipment: false,
    });
  }

  onCloseShip() {
    this.setState({
      activateDropShip: false,
      ship: false,
      department: false,
      equipment: false,
    });
  }

  onCloseDepartment() {
    this.setState({
      activateDropDepartement: false,
      ship: false,
      department: false,
      equipment: false,
    });
  }
  
  onClose() {
    this.setState({
      activateDrop: false,
      ship: false,
      department: false,
      equipment: false,
    });
  }

  renderToastError = () => (
    <View>
      <View style={StyleAddTask.popupContent}>
        <View style={StyleAddTask.errorMode}>
          <Text style={StyleAddTask.popupText}>
            {this.props.intl.formatMessage({
              id: "unplanned.toast.errorProcessRequest",
              defaultMessage:
                "An error has occured while processing your request.",
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  handleToast() {
    this.toast.show(this.renderToastError());
  }

  keyExtractor = (item, index) => index.toString();

  render() {
    const {
      dueDate,
      showSelectDateUp,
      showSelectDateDown,
      eventDate,
      name,
      description,
      equipmentId,
      activateDropShip,
      activateDropDepartement,
      activateDrop,
      shipId,
      departmentId,
      ship,
      department,
      equipment,
      shipName,
      departmentName,
      equimpentName,
      oneClick,
      addDueDate,
    } = this.state;

    const { FilterReducer, TaskReducer, intl } = this.props;
    const dataShips = FilterReducer.shipsFilter;
    const dataDepartment = FilterReducer.departmentFilter;
    const dataEquipment = FilterReducer.equipmentFilter;
    const connexion = this.context.connexion;
    const textError = TaskReducer.textError;
    const typeError = TaskReducer.typeToastError;
    let removeDuplicate;
    removeDuplicate = dataEquipment.filter((item) => {
      if (shipId && departmentId) {
        return item.ship._id == shipId && item.department._id == departmentId;
      }
      if (shipId) {
        return item.ship._id == shipId;
      }
    });
    const filter = removeDuplicate.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );

    return (
      <SafeAreaView style={StyleAddTask.container}>
        <ToastApp text={textError} type={typeError} />
        {connexion ? null : (
          <View style={StyleAddTask.orangeError}>
            <Text style={StyleAddTask.orangeErrorText}>
              {intl.formatMessage({
                id: "connexion.text",
                defaultMessage:
                  "Device currently offline, any updates will be sent automatically when the connection is restored",
              })}
            </Text>
          </View>
        )}
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <Card containerStyle={{ borderRadius: 5 }}>
            <View style={StyleAddTask.mainContent}>
              <View style={StyleAddTask.fieldContainer}>
                <Text>
                  <Text style={StyleAddTask.blueText}>
                    {intl.formatMessage({
                      id: "unplanned.add.title",
                      defaultMessage: "Title of the unplanned maintenance?",
                    })}
                  </Text>
                  <Text style={StyleAddTask.required}> *</Text>
                </Text>
                <Input
                  placeholder={intl.formatMessage({
                    id: "unplanned.add.titlePlaceholder",
                    defaultMessage: "Title of task",
                  })}
                  inputContainerStyle={{
                    borderColor: COLORS.lightGray3,
                    borderWidth: 1,
                    borderRadius: 5,
                    paddingLeft: 5,
                    paddingRight: 5,
                    marginTop: 10,
                  }}
                  inputStyle={{ fontSize: 15 }}
                  containerStyle={{ paddingHorizontal: 0 }}
                  renderErrorMessage={false}
                  onChangeText={this.handleName}
                />
                {name.length < 1 ? (
                  <Text style={{ color: "red" }}>
                    {intl.formatMessage({
                      id: "unplanned.form.errorTitle",
                      defaultMessage:
                        "Please put a title for your unplanned maintenance.",
                    })}
                  </Text>
                ) : null}
              </View>
              <View
                style={
                  Platform.OS !== "android"
                    ? activateDropShip
                      ? StyleAddTask.fieldContainerRowShip
                      : StyleAddTask.fieldContainer
                    : StyleAddTask.fieldContainer
                }
              >
                <Text style={{ marginBottom: 10 }}>
                  <Text style={StyleAddTask.blueText}>
                    {intl.formatMessage({
                      id: "unplanned.add.chooseShip",
                      defaultMessage: "Choose Ship",
                    })}
                  </Text>
                  <Text style={StyleAddTask.required}> *</Text>
                </Text>
                <View
                  style={{
                    ...(Platform.OS !== "android" && {
                      zIndex: 5000,
                    }),
                  }}
                >
                  <DropDownPicker
                    items={dataShips.map((item) => ({
                      label: item.name,
                      value: item._id,
                    }))}
                    placeholder={intl.formatMessage({
                      id: "unplanned.add.selectShip",
                      defaultMessage: "Select ship name",
                    })}
                    arrowColor={COLORS.customYellow}
                    containerStyle={{ width: 220 }}
                    zIndex={5000}
                    dropDownDirection="down"
                    open={true}
                    onChangeItem={(item) => this.selectDataShip(item)}
                    onOpen={() => this.onOpenShip()}
                    onClose={() => this.onCloseShip()}
                    dropDownMaxHeight={227}
                    dropDownStyle={{
                      backgroundColor: "#ffffff",
                    }}
                    disabled={ship}
                  />
                </View>
              </View>
              <View
                style={
                  Platform.OS !== "android"
                    ? activateDropDepartement
                      ? dataDepartment.length <= 4
                        ? StyleAddTask.fieldContainerRowDepartment
                        : StyleAddTask.fieldContainerRow
                      : StyleAddTask.fieldContainer
                    : StyleAddTask.fieldContainer
                }
              >
                <Text style={{ marginBottom: 10 }}>
                  <Text style={StyleAddTask.blueText}>
                    {intl.formatMessage({
                      id: "unplanned.add.chooseDepartment",
                      defaultMessage: "Choose Department",
                    })}
                  </Text>
                  <Text style={StyleAddTask.required}> *</Text>
                </Text>
                <View
                  style={{
                    ...(Platform.OS !== "android" && {
                      zIndex: 5000,
                    }),
                  }}
                >
                  <DropDownPicker
                    items={dataDepartment.map((item) => ({
                      label: item.name,
                      value: item._id,
                    }))}
                    placeholder={intl.formatMessage({
                      id: "unplanned.add.selectDepartment",
                      defaultMessage: "Select department name",
                    })}
                    arrowColor={COLORS.customYellow}
                    containerStyle={{ width: 220 }}
                    defaultValue={this.state.departmentId}
                    open={true}
                    onChangeItem={(item) => this.selectDataDepartment(item)}
                    onOpen={() => this.onOpenDepartment()}
                    onClose={() => this.onCloseDepartment()}
                    dropDownMaxHeight={227}
                    dropDownStyle={{
                      backgroundColor: "#ffffff",
                    }}
                    disabled={department}
                    zIndex={50000}
                  />
                </View>
              </View>
              {
                // filter.length < 1 ? null:
                <View
                  style={
                    Platform.OS !== "android"
                      ? activateDrop
                        ? StyleAddTask.fieldContainerRow
                        : StyleAddTask.fieldContainer
                      : StyleAddTask.fieldContainer
                  }
                >
                  <Text style={{ marginBottom: 10 }}>
                    <Text style={StyleAddTask.blueText}>
                      {intl.formatMessage({
                        id: "unplanned.add.chooseEquipment",
                        defaultMessage: "Choose Equipment",
                      })}
                    </Text>
                    <Text style={StyleAddTask.required}> *</Text>
                  </Text>
                  <View
                    style={{
                      ...(Platform.OS !== "android" && {
                        zIndex: 5000,
                      }),
                    }}
                  >
                    <DropDownPicker
                      items={filter.map((item) => ({
                        label: item.name,
                        value: item._id,
                      }))}
                      placeholder={intl.formatMessage({
                        id: "unplanned.add.selectEquipment",
                        defaultMessage: "Select equipment name",
                      })}
                      arrowColor={COLORS.customYellow}
                      containerStyle={{ width: 220 }}
                      open={true}
                      onChangeItem={(item) => this.selectData(item)}
                      onOpen={() => this.onOpen()}
                      onClose={() => this.onClose()}
                      dropDownMaxHeight={227}
                      defaultValue={this.state.equipmentId}
                      dropDownStyle={{
                        backgroundColor: "#ffffff",
                      }}
                      disabled={equipment}
                    />
                  </View>
                </View>
              }
              <View style={StyleAddTask.fieldContainer}>
                <Text style={{ marginBottom: 10 }}>
                  <Text style={StyleAddTask.blueText}>
                    {intl.formatMessage({
                      id: "unplanned.add.date",
                      defaultMessage: "Date when event occurs",
                    })}
                  </Text>
                  <Text style={StyleAddTask.required}> *</Text>
                </Text>
                <View style={StyleAddTask.datePickerContainer}>
                  <FontAwesome
                    name="calendar"
                    color={COLORS.customYellow}
                    size={20}
                    style={{ marginRight: 10 }}
                  />
                  {Platform.OS == "ios" ? (
                    <DateTimePicker
                      locale={getLanguageCode4()}
                      style={StyleAddTask.datePickerContent}
                      value={eventDate}
                      mode="date"
                      display="default"
                      testID="datePicker"
                      is24Hour={true}
                      maximumDate={new Date()}
                      onChange={(event, value) => {
                        this.setState({
                          eventDate: value,
                          showSelectDateUp: false,
                        });
                      }}
                    />
                  ) : (
                    <View>
                      {showSelectDateUp ? (
                        <DateTimePicker
                          locale={getLanguageCode4()}
                          value={eventDate}
                          mode="date"
                          testID="datePicker"
                          display="default"
                          is24Hour={true}
                          maximumDate={new Date()}
                          onChange={(event, value) => {
                            this.setState({
                              eventDate: value ? value : eventDate,
                              showSelectDateUp: false,
                              ShowDateInputUp: true,
                            });
                          }}
                        />
                      ) : null}
                      <View style={StyleAddTask.inline}>
                        <Text style={{ marginRight: 10 }}>
                          {format(eventDate, "dd/MM/yyyy")}
                        </Text>
                        <Button
                          title={intl.formatMessage({
                            id: "date.change",
                            defaultMessage: "Change",
                          })}
                          onPress={() => this.onDatePickerUp()}
                          containerStyle={StyleAddTask.buttonSubmt}
                          buttonStyle={{ backgroundColor: COLORS.primary }}
                          titleStyle={{ fontSize: 15 }}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
              <View style={StyleAddTask.fieldContainer}>
                <Text style={{ marginBottom: 10 }}>
                  <Text style={StyleAddTask.blueText}>
                    {intl.formatMessage({
                      id: "unplanned.add.dateDeadline",
                      defaultMessage: "Do you have a deadline to fix it ?",
                    })}
                  </Text>
                </Text>
                <View style={StyleAddTask.datePickerContainer}>
                  <FontAwesome
                    name="calendar"
                    color={COLORS.customYellow}
                    size={20}
                    style={{ marginRight: 10 }}
                  />
                  {Platform.OS == "ios" ? (
                    <DateTimePicker
                      locale={getLanguageCode4()}
                      style={StyleAddTask.datePickerContent}
                      value={dueDate}
                      mode="date"
                      display="default"
                      testID="datePicker"
                      is24Hour={true}
                      minimumDate={new Date()}
                      onChange={(event, value) => {
                        this.setState({
                          dueDate: value,
                          showSelectDateUp: false,
                          addDueDate: true,
                        });
                      }}
                    />
                  ) : (
                    <View>
                      {showSelectDateDown ? (
                        <DateTimePicker
                          locale={getLanguageCode4()}
                          value={dueDate}
                          mode="date"
                          display="default"
                          testID="datePicker"
                          is24Hour={true}
                          minimumDate={new Date()}
                          onChange={(event, value) => {
                            this.setState({
                              dueDate: value ? value : dueDate,
                              showSelectDateDown: false,
                              ShowDateInputDown: true,
                              addDueDate: true,
                            });
                          }}
                        />
                      ) : null}
                      <View style={StyleAddTask.inline}>
                        <Text style={{ marginRight: 10 }}>
                          {format(dueDate, "dd/MM/yyyy")}
                        </Text>
                        <Button
                          title={intl.formatMessage({
                            id: "date.change",
                            defaultMessage: "Change",
                          })}
                          onPress={() => this.onDatePickerDown()}
                          containerStyle={StyleAddTask.buttonSubmt}
                          buttonStyle={{ backgroundColor: COLORS.primary }}
                          titleStyle={{ fontSize: 15 }}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>

              <View style={StyleAddTask.fieldContainer}>
                <Text>
                  <Text style={StyleAddTask.blueText}>
                    {intl.formatMessage({
                      id: "unplanned.add.whatHappened",
                      defaultMessage: "Describe here what happened",
                    })}
                  </Text>
                  <Text style={StyleAddTask.required}> *</Text>
                </Text>
                <TextInput
                  style={StyleAddTask.textArea}
                  multiline={true}
                  numberOfLines={4}
                  placeholder={intl.formatMessage({
                    id: "unplanned.add.whatHappenedPlaceholder",
                    defaultMessage: "Ex: Oil leak on the circuit...",
                  })}
                  placeholderTextColor={COLORS.darkgray}
                  onChangeText={this.handleComment}
                  onSubmitEditing={Keyboard.dismiss}
                />
                {description.length < 1 ? (
                  <Text style={{ color: "red" }}>
                    {intl.formatMessage({
                      id: "unplanned.form.errorDescription",
                      defaultMessage:
                        "Please give us a description of what happened.",
                    })}
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={StyleAddTask.buttonsContainer}>
              {connexion ? (
                !oneClick ? (
                  addDueDate ? (
                    <Button
                      containerStyle={StyleAddTask.buttonSubmit}
                      buttonStyle={{
                        backgroundColor: COLORS.primary,
                        height: 40,
                      }}
                      titleStyle={{ fontSize: 15 }}
                      disabled={
                        name.length < 1 || description.length < 1 ? true : false
                      }
                      title={intl.formatMessage({
                        id: "unplanned.add.save",
                        defaultMessage: "Save unplanned maintenance",
                      })}
                      onPressIn={() =>
                        this.addTask(
                          name,
                          dueDate,
                          description,
                          eventDate,
                          equipmentId
                        )
                      }
                    />
                  ) : (
                    <Button
                      containerStyle={StyleAddTask.buttonSubmit}
                      buttonStyle={{
                        backgroundColor: COLORS.primary,
                        height: 40,
                      }}
                      titleStyle={{ fontSize: 15 }}
                      disabled={
                        name.length < 1 || description.length < 1 ? true : false
                      }
                      title={intl.formatMessage({
                        id: "unplanned.add.save",
                        defaultMessage: "Save unplanned maintenance",
                      })}
                      onPressIn={() =>
                        this.addTaskNoDueDate(
                          name,
                          description,
                          eventDate,
                          equipmentId
                        )
                      }
                    />
                  )
                ) : (
                  <Button
                    containerStyle={StyleAddTask.buttonSubmit}
                    buttonStyle={{
                      backgroundColor: COLORS.primary,
                      height: 40,
                    }}
                    titleStyle={{ fontSize: 15 }}
                    disabled={
                      name.length < 1 || description.length < 1 ? true : false
                    }
                    title={intl.formatMessage({
                      id: "unplanned.add.save",
                      defaultMessage: "Save unplanned maintenance",
                    })}
                    // onPressIn={() => this.addTask(name, dueDate, description, eventDate, equipmentId)}
                  />
                )
              ) : !oneClick ? (
                addDueDate ? (
                  <Button
                    containerStyle={StyleAddTask.buttonSubmit}
                    buttonStyle={{
                      backgroundColor: COLORS.primary,
                      height: 40,
                    }}
                    titleStyle={{ fontSize: 15 }}
                    disabled={
                      name.length < 1 || description.length < 1 ? true : false
                    }
                    title={intl.formatMessage({
                      id: "unplanned.add.saveOffline",
                      defaultMessage: "Save offline unplanned maintenance",
                    })}
                    onPressIn={() =>
                      this.addTaskOffline(
                        name,
                        dueDate,
                        description,
                        eventDate,
                        equipmentId,
                        shipName,
                        departmentName,
                        equimpentName
                      )
                    }
                  />
                ) : (
                  <Button
                    containerStyle={StyleAddTask.buttonSubmit}
                    buttonStyle={{
                      backgroundColor: COLORS.primary,
                      height: 40,
                    }}
                    titleStyle={{ fontSize: 15 }}
                    disabled={
                      name.length < 1 || description.length < 1 ? true : false
                    }
                    title={intl.formatMessage({
                      id: "unplanned.add.saveOffline",
                      defaultMessage: "Save offline unplanned maintenance",
                    })}
                    onPressIn={() =>
                      this.addTaskNoDueDateOffline(
                        name,
                        description,
                        eventDate,
                        equipmentId,
                        shipName,
                        departmentName,
                        equimpentName
                      )
                    }
                  />
                )
              ) : (
                <Button
                  containerStyle={StyleAddTask.buttonSubmit}
                  buttonStyle={{ backgroundColor: COLORS.primary, height: 40 }}
                  titleStyle={{ fontSize: 15 }}
                  disabled={
                    name.length < 1 || description.length < 1 ? true : false
                  }
                  title={intl.formatMessage({
                    id: "unplanned.add.saveOffline",
                    defaultMessage: "Save offline unplanned maintenance",
                  })}
                  // onPressIn={() => this.addTaskOffline(name, dueDate, description, eventDate, equipmentId, shipName, departmentName, equimpentName)}
                />
              )}
            </View>
          </Card>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  FilterReducer: state.FilterReducer,
  TaskReducer: state.TaskReducer,
  AuthReducer: state.AuthReducer,
});

export default injectIntl(connect(mapStateToProps)(AddTask));
