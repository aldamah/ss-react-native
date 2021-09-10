import React from "react";
import { Keyboard, Text, View, Platform, SafeAreaView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Button, Card } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import { injectIntl, FormattedMessage } from "react-intl";
import axios from "axios";
import { connect } from "react-redux";
import { format } from "date-fns";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import BackButton from "../BackButton/BackButton";
import { StyleResolveTask } from "./StyleResolveTask";
import API from "../../configs/API";
import db from "../../dbSQLite/SQLiteDb";
import ResolveOffline from "../../dbSQLite/ResolveOffline";
import { COLORS, SIZES } from "../../configs/theme";
import { NetworkContext } from "../../../NetworkProvider";
import ToastApp from "../ToastApp/ToastApp";
import { getLanguageCode4 } from "../../configs/lang/lang";

class ResolveTask extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = ({ navigation }) => {
    return {
      title: (
        <FormattedMessage
          id="unplanned.navigation.resolve"
          defaultMessage="Resolve an unplanned task"
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
      date: new Date(),
      showSelectDate: false,
      workDetails: "",
      ShowDateInput: false,
      status: "closed",
      connexion: null,
      textError: null,
      typeError: null,
    };

    this.connexionlistner;
  }

  //show date picker
  onDatePicker = () => {
    this.setState({
      showSelectDate: true,
    });
  };

  handleToastOnline() {
    const errorMessage = "An error has occurred when sending your content";
    const errorType = "Error";

    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: errorMessage };
    this.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: errorType };
    this.props.dispatch(actionErrorType);
  }

  handleToastOffline() {
    const errorMessage = "An error has occurred when sending offline content";
    const errorType = "Error";

    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: errorMessage };
    this.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: errorType };
    this.props.dispatch(actionErrorType);
  }

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
        const actionName = { type: "TASKNAME_ACTION", value: "Unplanned" };
        that.props.dispatch(actionName);
      })
      .catch(function (error) {
        that.handleToastOnline();
      });
  }

  async resolveTask(idTask, actualResolutionDate, workDetails) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const { navigation } = this.props;
    const data = {
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      workDetails: workDetails,
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

  //offLine mode

  async resolveTaskOffline(idTask, actualResolutionDate, workDetails) {
    const { TaskReducer } = this.props;
    const that = this;

    const { navigation } = this.props;
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS ResolveOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,actualResolutionDate DATE,workDetails TEXT);"
      );
    });

    const offLineMode = TaskReducer.unplannedOffline;
    const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: false };
    this.props.dispatch(actionAuth);

    const updatedData = offLineMode.filter((item) => {
      return item._id !== idTask;
    });

    const actionUnplanned = { type: "UNPLANNED_ACTION", value: updatedData };
    this.props.dispatch(actionUnplanned);
    const actionToastUnplanned = {
      type: "TOAST_UNPLANNED_ACTION",
      value: true,
    };
    this.props.dispatch(actionToastUnplanned);

    ResolveOffline.create({
      idTask: idTask,
      actualResolutionDate: format(actualResolutionDate, "yyyy-MM-dd"),
      workDetails: workDetails,
    })
      .then((id) => {
        const actionName = { type: "TASKNAME_ACTION", value: "Unplanned" };
        that.props.dispatch(actionName);
        // alert('Task resolve with id: ' + id)
        navigation.navigate("Refresh");
      })
      .catch((err) => {
        that.handleToastOffline();
      });
  }

  handleComment = (text) => {
    this.setState({ workDetails: text });
  };

  renderToastError = () => (
    <View>
      <View style={StyleResolveTask.popupContent}>
        <View style={StyleResolveTask.errorMode}>
          <Text style={StyleResolveTask.popupText}>
            {this.props.intl.formatMessage({
              id: "unplanned.toast.errorProcessRequest",
              defaultMessage:
                " An error has occured while processing your request.",
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  handleToast() {
    this.toast.show(this.renderToastError());
  }

  render() {
    const { navigation, TaskReducer, intl } = this.props;
    const item = navigation.getParam("item");
    const { date, showSelectDate, workDetails } = this.state;

    const connexion = this.context.connexion;
    const textError = TaskReducer.textError;
    const typeError = TaskReducer.typeToastError;

    return (
      <SafeAreaView style={StyleResolveTask.container}>
        <ToastApp text={textError} type={typeError} />
        {connexion ? null : (
          <View style={StyleResolveTask.orangeError}>
            <Text style={StyleResolveTask.orangeErrorText}>
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
            <View style={StyleResolveTask.mainContent}>
              <View style={StyleResolveTask.fieldContainer}>
                <Text style={StyleResolveTask.blueText}>
                  {intl.formatMessage({
                    id: "unplanned.closeOrResolve.dateSolve",
                    defaultMessage: "When did you solve it ?",
                  })}
                </Text>
                {Platform.OS == "ios" ? (
                  <View style={StyleResolveTask.datePickerContainer}>
                    <FontAwesome
                      name="calendar"
                      color={COLORS.customYellow}
                      size={20}
                      style={{ marginRight: 10 }}
                    />
                    <DateTimePicker
                      locale={getLanguageCode4()}
                      style={StyleResolveTask.datePickerContent}
                      value={date}
                      mode="date"
                      display="default"
                      testID="datePicker"
                      is24Hour={true}
                      maximumDate={new Date()}
                      onChange={(event, value) => {
                        this.setState({
                          date: value,
                          showSelectDate: false,
                        });
                      }}
                    />
                  </View>
                ) : (
                  <View style={StyleResolveTask.datePickerContainer}>
                    <FontAwesome
                      name="calendar"
                      color={COLORS.customYellow}
                      size={20}
                      style={{ marginRight: 10 }}
                    />

                    {showSelectDate ? (
                      <DateTimePicker
                        locale={getLanguageCode4()}
                        value={date}
                        mode="date"
                        testID="datePicker"
                        display="calendar"
                        is24Hour={true}
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

                    <View style={StyleResolveTask.inline}>
                      <Text style={{ marginRight: 10 }}>
                        {format(date, "dd/MM/yyyy")}
                      </Text>
                      <Button
                        title={intl.formatMessage({
                          id: "date.change",
                          defaultMessage: "Change",
                        })}
                        onPress={() => this.onDatePicker()}
                        containerStyle={StyleResolveTask.buttonSubmit}
                        buttonStyle={{ backgroundColor: COLORS.primary }}
                        titleStyle={{ fontSize: 15 }}
                      />
                    </View>
                  </View>
                )}
              </View>

              <View style={StyleResolveTask.fieldContainer}>
                <Text style={{ marginBottom: 10 }}>
                  <Text style={StyleResolveTask.blueText}>
                    {intl.formatMessage({
                      id: "unplanned.closeOrResolve.commentSolve",
                      defaultMessage: "What did you do to solve the issue?",
                    })}
                  </Text>
                  <Text style={StyleResolveTask.required}> *</Text>
                </Text>
                <TextInput
                  style={StyleResolveTask.textArea}
                  multiline={true}
                  placeholder={""}
                  placeholderTextColor={COLORS.darkgray}
                  onChangeText={this.handleComment}
                  onSubmitEditing={Keyboard.dismiss}
                />
                {workDetails.length < 1 ? (
                  <Text style={{ color: "red" }}>
                    {intl.formatMessage({
                    id: "unplanned.closeOrResolve.putDescription",
                    defaultMessage: "Please put a description of the solution.",
                  })}
                    
                  </Text>
                ) : null}
                <Text style={StyleResolveTask.smallGreyText}>
                  {intl.formatMessage({
                    id: "unplanned.closeOrResolve.commentSolvePlaceholder",
                    defaultMessage:
                      "Any comment / advice for the next person who will face the problem?",
                  })}
                </Text>
              </View>
            </View>
            <View style={StyleResolveTask.buttonsContainer}>
              <Button
                containerStyle={StyleResolveTask.buttonRefresh}
                buttonStyle={{
                  backgroundColor: COLORS.customYellow,
                  height: 40,
                }}
                title={intl.formatMessage({
                  id: "unplanned.closeOrResolve.cancel",
                  defaultMessage: "Cancel",
                })}
                titleStyle={{ color: COLORS.white, fontSize: 15 }}
                onPress={() => navigation.goBack()}
              />
              {connexion ? (
                <Button
                  containerStyle={StyleResolveTask.buttonSubmitOnLine}
                  buttonStyle={{ backgroundColor: COLORS.primary, height: 40 }}
                  titleStyle={{ fontSize: 15 }}
                  title={intl.formatMessage({
                    id: "unplanned.closeOrResolve.closeOrResolve",
                    defaultMessage: "Close/Resolve",
                  })}
                  disabled={workDetails.length < 1 ? true : false}
                  onPress={() => {
                    this.resolveTask(item._id, date, workDetails);
                  }}
                />
              ) : (
                <Button
                  containerStyle={StyleResolveTask.buttonSubmit}
                  buttonStyle={{ backgroundColor: COLORS.primary }}
                  titleStyle={{
                    ...Platform.select({
                      ios: { fontSize: 15, width: SIZES.width / 2 - 62 },
                      android: { fontSize: 15 },
                    }),
                  }}
                  disabled={workDetails.length < 1 ? true : false}
                  title={intl.formatMessage({
                    id: "unplanned.closeOrResolve.closeOrResolveOffline",
                    defaultMessage: "Close/Resolve Offline",
                  })}
                  onPress={() => {
                    this.resolveTaskOffline(item._id, date, workDetails);
                  }}
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

export default injectIntl(connect(mapStateToProps)(ResolveTask));
