import React from "react";
import { Keyboard, Text, View, Platform, SafeAreaView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Card, Input } from "react-native-elements";
import axios from "axios";
import { format } from "date-fns";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome } from "@expo/vector-icons";
import { connect } from "react-redux";
import { injectIntl, FormattedMessage } from "react-intl";

import BackButton from "../BackButton/BackButton";
import { StyleEditTask } from "./StyleEditTask";
import API from "../../configs/API";
import { COLORS } from "../../configs/theme";
import db from "../../dbSQLite/SQLiteDb";
import EditOffline from "../../dbSQLite/EditOffline";
import EditNoDueDateOffline from "../../dbSQLite/EditNoDueDateOffline";
import { NetworkContext } from "../../../NetworkProvider";
import ToastApp from "../ToastApp/ToastApp";
import { getLanguageCode4 } from "../../configs/lang/lang";

class EditTask extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = ({ navigation }) => {
    return {
      title: (
        <FormattedMessage
          id="unplanned.navigation.edit"
          defaultMessage="Complete task"
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
      eventDate: new Date(),
      ShowDateInputUp: false,
      ShowDateInputDown: false,
      showSelectDateUp: false,
      showSelectDateDown: false,
      connexion: null,
      compteDate: 0,
      addDueDate: false,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const item = navigation.getParam("item");

    this.setState({
      name: item.name,
    });

    if (this.state.compteDate < 1) {
      if (item.dueDate) {
        this.setState({
          dueDate: new Date(item.dueDate),
          eventDate: new Date(item.eventDate),
          description: item.description,
          addDueDate: true,
        });
      } else {
        this.setState({
          dueDate: new Date(),
          eventDate: new Date(item.eventDate),
          description: item.description,
          addDueDate: false,
        });
      }
    }
  }

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

  //show date picker
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

  async editTask(idTask, name, dueDate, description, eventDate) {
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const that = this;
    const { navigation } = this.props;
    const data = {
      name: name,
      dueDate: format(dueDate, "yyyy-MM-dd"),
      description: description,
      eventDate: format(eventDate, "yyyy-MM-dd"),
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
        console.log("the answer", response);
        const actionName = { type: "TASKNAME_ACTION", value: "Unplanned" };
        that.props.dispatch(actionName);
        navigation.navigate("Refresh");
      })
      .catch(function (error) {
        that.handleToastOnline();
      });
  }
  //no due date
  async editTaskNoDueDate(idTask, name, description, eventDate) {
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const that = this;
    const { navigation } = this.props;
    const data = {
      name: name,
      description: description,
      eventDate: format(eventDate, "yyyy-MM-dd"),
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
        console.log("the answer", response);
        const actionName = { type: "TASKNAME_ACTION", value: "Unplanned" };
        that.props.dispatch(actionName);
        navigation.navigate("Refresh");
      })
      .catch(function (error) {
        that.handleToastOnline();
      });
  }
  //edit offline
  async editTaskOffline(idTask, name, dueDate, description, eventDate) {
    const { navigation, TaskReducer } = this.props;
    const that = this;
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS EditOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,name TEXT,dueDate DATE,description TEXT,eventDate DATE);"
      );
    });

    const offLineMode = TaskReducer.unplannedOffline;
    const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: false };
    this.props.dispatch(actionAuth);

    const editedData = offLineMode.map((item) => {
      if (item._id === idTask) {
        item.name = name;
        item.dueDate = format(dueDate, "yyyy-MM-dd");
        item.description = description;
        item.eventDate = format(eventDate, "yyyy-MM-dd");
        return item;
      } else {
        return item;
      }
    });

    const actionUnplanned = { type: "UNPLANNED_ACTION", value: editedData };
    this.props.dispatch(actionUnplanned);
    const actionToastUnplanned = {
      type: "TOAST_UNPLANNED_ACTION",
      value: true,
    };
    this.props.dispatch(actionToastUnplanned);

    console.log("editedData", editedData);

    EditOffline.create({
      idTask: idTask,
      name: name,
      dueDate: format(dueDate, "yyyy-MM-dd"),
      description: description,
      eventDate: format(eventDate, "yyyy-MM-dd"),
    })
      .then((id) => {
        // alert('Edit unplanned Task with id: '+ id)
        const actionName = { type: "TASKNAME_ACTION", value: "Unplanned" };
        that.props.dispatch(actionName);
        navigation.navigate("Refresh");
      })
      .catch((err) => {
        that.handleToastOffline();
      });
  }

  //no due date
  async editTaskNoDueDateOffline(idTask, name, description, eventDate) {
    const { navigation, TaskReducer } = this.props;
    const that = this;
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS EditNoDueDateOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,name TEXT,description TEXT,eventDate DATE);"
      );
    });

    const offLineMode = TaskReducer.unplannedOffline;

    const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: false };
    this.props.dispatch(actionAuth);

    const editedData = offLineMode.map((item) => {
      if (item._id === idTask) {
        item.name = name;
        item.description = description;
        item.eventDate = format(eventDate, "yyyy-MM-dd");
        return item;
      } else {
        return item;
      }
    });

    const actionUnplanned = { type: "UNPLANNED_ACTION", value: editedData };
    this.props.dispatch(actionUnplanned);
    const actionToastUnplanned = {
      type: "TOAST_UNPLANNED_ACTION",
      value: true,
    };
    this.props.dispatch(actionToastUnplanned);

    console.log("editedData", editedData);

    EditNoDueDateOffline.create({
      idTask: idTask,
      name: name,
      description: description,
      eventDate: format(eventDate, "yyyy-MM-dd"),
    })
      .then((id) => {
        // alert('Edit unplanned Task with id: '+ id)
        const actionName = { type: "TASKNAME_ACTION", value: "Unplanned" };
        that.props.dispatch(actionName);
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

  renderToastError = () => (
    <View>
      <View style={StyleEditTask.popupContent}>
        <View style={StyleEditTask.errorMode}>
          <Text style={StyleEditTask.popupText}>
            {this.props.intl.formatMessage({
              id: "unplanned.toast.errorProcessRequest",
              defaultMessage:
                "An error has occured while processing your request.",
            })}{" "}
          </Text>
        </View>
      </View>
    </View>
  );

  render() {
    const {
      dueDate,
      showSelectDateUp,
      showSelectDateDown,
      eventDate,
      name,
      description,
      addDueDate,
    } = this.state;
    const { navigation, TaskReducer, intl } = this.props;
    const item = navigation.getParam("item");
    const connexion = this.context.connexion;
    const textError = TaskReducer.textError;
    const typeError = TaskReducer.typeToastError;

    return (
      <SafeAreaView style={StyleEditTask.container}>
        <ToastApp text={textError} type={typeError} />
        {connexion ? null : (
          <View style={StyleEditTask.orangeError}>
            <Text style={StyleEditTask.orangeErrorText}>
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
            <View style={StyleEditTask.mainContent}>
              <View style={StyleEditTask.fieldContainer}>
                <Text>
                  <Text style={StyleEditTask.blueText}>
                    {intl.formatMessage({
                      id: "unplanned.edit.title",
                      defaultMessage: "Title of the unplanned maintenance?",
                    })}
                  </Text>
                  <Text style={StyleEditTask.required}> *</Text>
                </Text>
                {/* <TextInput
                                    placeholder={name}
                                    style={StyleEditTask.titleInputContent}
                                    onChangeText={this.handleName}
                                    value={name}
                                /> */}
                <Input
                  placeholder={name}
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
                  value={name}
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
              <View style={StyleEditTask.fieldContainer}>
                <Text style={{ marginBottom: 10 }}>
                  <Text style={StyleEditTask.blueText}>
                    {intl.formatMessage({
                      id: "unplanned.edit.date",
                      defaultMessage: "Date when event occurs",
                    })}
                  </Text>
                  <Text style={StyleEditTask.required}> *</Text>
                </Text>
                <View style={StyleEditTask.datePickerContainer}>
                  <FontAwesome
                    name="calendar"
                    color={COLORS.customYellow}
                    size={20}
                    style={{ marginRight: 10 }}
                  />
                  {Platform.OS == "ios" ? (
                    <DateTimePicker
                      locale={getLanguageCode4()}
                      style={StyleEditTask.datePickerContentUp}
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
                          is24Hour={true}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          display="default"
                          testID="dateTimePicker"
                          maximumDate={new Date()}
                          onChange={(event, value) => {
                            this.setState({
                              eventDate: value ? value : eventDate,
                              showSelectDateUp: false,
                              ShowDateInputUp: true,
                              compteDate: 1,
                            });
                          }}
                        />
                      ) : null}
                      <View style={StyleEditTask.inline}>
                        <Text style={{ marginRight: 10 }}>
                          {format(eventDate, "dd/MM/yyyy")}
                        </Text>
                        <Button
                          title={intl.formatMessage({
                            id: "date.change",
                            defaultMessage: "Change",
                          })}
                          onPress={() => this.onDatePickerUp()}
                          containerStyle={StyleEditTask.buttonSubmt}
                          buttonStyle={{ backgroundColor: COLORS.primary }}
                          titleStyle={{ fontSize: 15 }}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
              <View style={StyleEditTask.fieldContainer}>
                <Text style={{ marginBottom: 10 }}>
                  <Text style={StyleEditTask.blueText}>
                    {intl.formatMessage({
                      id: "unplanned.edit.dateDeadline",
                      defaultMessage: "Do you have a deadline to fix it ?",
                    })}
                  </Text>
                </Text>
                <View style={StyleEditTask.datePickerContainer}>
                  <FontAwesome
                    name="calendar"
                    color={COLORS.customYellow}
                    size={20}
                    style={{ marginRight: 10 }}
                  />
                  {Platform.OS == "ios" ? (
                    <View>
                      <View style={StyleEditTask.inline}>
                        <DateTimePicker
                          locale={getLanguageCode4()}
                          value={dueDate}
                          style={StyleEditTask.datePickerContent}
                          mode="date"
                          is24Hour={true}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          display="default"
                          testID="dateTimePicker"
                          minimumDate={new Date()}
                          onChange={(event, value) => {
                            this.setState({
                              dueDate: value ? value : dueDate,
                              showSelectDateDown: false,
                              ShowDateInputDown: true,
                              compteDate: 1,
                              addDueDate: true,
                            });
                          }}
                        />
                        {addDueDate ? null : (
                          <View style={StyleEditTask.selectDate}>
                            <Text style={StyleEditTask.textSelectDate}>
                              Select a date
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ) : (
                    <View>
                      {showSelectDateDown ? (
                        <DateTimePicker
                          locale={getLanguageCode4()}
                          value={dueDate}
                          mode="date"
                          is24Hour={true}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          display="default"
                          testID="dateTimePicker"
                          minimumDate={new Date()}
                          onChange={(event, value) => {
                            this.setState({
                              dueDate: value ? value : dueDate,
                              showSelectDateDown: false,
                              ShowDateInputDown: true,
                              compteDate: 1,
                              addDueDate: true,
                            });
                          }}
                        />
                      ) : null}
                      <View style={StyleEditTask.inline}>
                        <Text style={{ marginRight: 10 }}>
                          {addDueDate
                            ? format(dueDate, "dd/MM/yyyy")
                            : "Select a date"}
                        </Text>
                        <Button
                          title={intl.formatMessage({
                            id: "date.change",
                            defaultMessage: "Change",
                          })}
                          onPress={() => this.onDatePickerDown()}
                          containerStyle={StyleEditTask.buttonSubmt}
                          buttonStyle={{ backgroundColor: COLORS.primary }}
                          titleStyle={{ fontSize: 15 }}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>

              <View style={StyleEditTask.fieldContainer}>
                <Text>
                  <Text style={StyleEditTask.blueText}>
                    {intl.formatMessage({
                      id: "unplanned.edit.whatHappened",
                      defaultMessage: "Describe here what happened",
                    })}
                  </Text>
                  <Text style={StyleEditTask.required}> *</Text>
                </Text>
                <TextInput
                  style={StyleEditTask.textArea}
                  multiline={true}
                  // numberOfLines={4}
                  placeholder={intl.formatMessage({
                    id: "unplanned.edit.whatHappenedPlaceholder",
                    defaultMessage: "Ex: Oil leak on the circuit...",
                  })}
                  placeholderTextColor={COLORS.darkgray}
                  onChangeText={this.handleComment}
                  value={description}
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
            <View style={StyleEditTask.buttonsContainer}>
              {connexion ? (
                addDueDate ? (
                  <Button
                    containerStyle={StyleEditTask.buttonSubmit}
                    buttonStyle={{
                      backgroundColor: COLORS.primary,
                      height: 40,
                    }}
                    titleStyle={{ fontSize: 15 }}
                    disabled={
                      name.length < 1 || description.length < 1 ? true : false
                    }
                    title={intl.formatMessage({
                      id: "unplanned.edit.save",
                      defaultMessage: "Save unplanned maintenance",
                    })}
                    onPress={() =>
                      this.editTask(
                        item._id,
                        name,
                        dueDate,
                        description,
                        eventDate
                      )
                    }
                  />
                ) : (
                  <Button
                    containerStyle={StyleEditTask.buttonSubmit}
                    buttonStyle={{
                      backgroundColor: COLORS.primary,
                      height: 40,
                    }}
                    titleStyle={{ fontSize: 15 }}
                    disabled={
                      name.length < 1 || description.length < 1 ? true : false
                    }
                    title={intl.formatMessage({
                      id: "unplanned.edit.save",
                      defaultMessage: "Save unplanned maintenance",
                    })}
                    onPress={() =>
                      this.editTaskNoDueDate(
                        item._id,
                        name,
                        description,
                        eventDate
                      )
                    }
                  />
                )
              ) : addDueDate ? (
                <Button
                  containerStyle={StyleEditTask.buttonSubmit}
                  buttonStyle={{ backgroundColor: COLORS.primary, height: 40 }}
                  titleStyle={{ fontSize: 15 }}
                  disabled={
                    name.length < 1 || description.length < 1 ? true : false
                  }
                  title={intl.formatMessage({
                    id: "unplanned.edit.saveOffline",
                    defaultMessage: "Save offline unplanned maintenance",
                  })}
                  onPress={() =>
                    this.editTaskOffline(
                      item._id,
                      name,
                      dueDate,
                      description,
                      eventDate
                    )
                  }
                />
              ) : (
                <Button
                  containerStyle={StyleEditTask.buttonSubmit}
                  buttonStyle={{ backgroundColor: COLORS.primary, height: 40 }}
                  titleStyle={{ fontSize: 15 }}
                  disabled={
                    name.length < 1 || description.length < 1 ? true : false
                  }
                  title={intl.formatMessage({
                    id: "unplanned.edit.saveOffline",
                    defaultMessage: "Save offline unplanned maintenance",
                  })}
                  onPress={() =>
                    this.editTaskNoDueDateOffline(
                      item._id,
                      name,
                      description,
                      eventDate
                    )
                  }
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

export default injectIntl(connect(mapStateToProps)(EditTask));
