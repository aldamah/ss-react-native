import React from "react";
import {
  Text,
  View
} from "react-native";
import { injectIntl, FormattedMessage } from "react-intl";
import { DateTime } from "luxon";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Button, Card } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { Camera } from "expo-camera";

import BackButton from "../BackButton/BackButton";
import { StyleTaskInformation } from "./StyleTaskInformation";
import { StyleRePlanned } from "./StyleRePlanned";
import { StyleReUnplanned } from "./StyleReUnplanned";
import API from "../../configs/API";
import db from "../../dbSQLite/SQLiteDb";
import DisableOffline from "../../dbSQLite/DisableOffline";
import { NetworkContext } from "../../../NetworkProvider";
import ToastApp from "../ToastApp/ToastApp";
import { PickerModal } from "../PickerModal/PickerModal";
import UploadAttachment from "../FileImport/UploadAttachment";

class TaskInformationUnplanned extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = ({ navigation }) => {
    return {
      title: (
        <FormattedMessage
          id="unplanned.navigation.detail"
          defaultMessage="View Unplanned event"
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
      isMandatory: false,
      label: "Subtask",
      value: false,
      subtasksData: [],
    };
  }

  keyExtractor = (item, index) => index.toString();

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

  //disable task
  async disableTask(idTask) {
    const { navigation } = this.props;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const that = this;
    const data = {
      isDisabled: true,
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
        navigation.navigate("Refresh");
      })
      .catch(function (error) {
        that.handleToastOnline();
      });
  }

  //disable offline
  async disableTaskOffline(idTask) {
    const that = this;
    const { navigation, TaskReducer } = this.props;
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS DisableOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT);"
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

    DisableOffline.create({
      idTask: idTask,
    })
      .then((id) => {
        const actionName = { type: "TASKNAME_ACTION", value: "Unplanned" };
        that.props.dispatch(actionName);
        navigation.navigate("Refresh");
      })
      .catch((err) => {
        that.handleToastOffline();
      });
  }


  render() {
    const { navigation, TaskReducer, intl } = this.props;
    const connexion = this.context.connexion;
    const textError = TaskReducer.textError;
    const typeError = TaskReducer.typeToastError;
    const item = navigation.getParam("item");

    // handle toast type success
    const update = typeError !== "Error";
    return (
      <SafeAreaView style={StyleRePlanned.container}>
        <ToastApp text={textError} type={typeError} update={update} />
        {connexion ? null : (
          <View style={StyleReUnplanned.orangeError}>
            <Text style={StyleReUnplanned.orangeErrorText}>
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
          <View style={ StyleRePlanned.headerContainer}>
            <Text style={StyleRePlanned.heading}>
              {intl.formatMessage({
                id: "unplanned.title",
                defaultMessage: "Unplanned Event",
              })}
            </Text>
          </View>
          <Card containerStyle={{ borderRadius: 5 }}>
            {
              <View style={StyleReUnplanned.fieldContainer}>
                <Text style={StyleReUnplanned.blueText}>
                  {intl.formatMessage({
                    id: "unplanned.description",
                    defaultMessage: "Description of what happens",
                  })}
                </Text>
                <Text style={StyleReUnplanned.greyText}>
                  {item.description}
                </Text>
              </View>
            }

            {
              <View style={StyleReUnplanned.fieldContainer}>
                <Text style={StyleReUnplanned.blueText}>
                  {intl.formatMessage({
                    id: "unplanned.comments",
                    defaultMessage: "Comment",
                  })}
                </Text>
                <View style={StyleReUnplanned.borderContainer}>
                  <View style={StyleReUnplanned.bottomBorder}>
                    <Text style={StyleReUnplanned.blueTextBold}>
                      Guireg CAPITAINE
                    </Text>
                  </View>

                  {
                    <Text style={StyleReUnplanned.greyTextCom}>
                      {intl.formatMessage({
                        id: "unplanned.noComment",
                        defaultMessage:
                          "No comment have been posted to this maintenance. Add your own comment",
                      })}
                    </Text>
                  }
                </View>
              </View>
            }
             <UploadAttachment item={item}/>
            {/* information task */}
          </Card>
          {
            <Card containerStyle={{ borderRadius: 5 }}>
              <View style={StyleRePlanned.fieldContainer}>
                <Text style={StyleRePlanned.blueText}>
                  {intl.formatMessage({
                    id: "unplanned.information",
                    defaultMessage: "Maintenance information",
                  })}
                </Text>
                {
                  <View>
                    <View>
                      <View style={StyleReUnplanned.borderContainerCenter}>
                        <Text style={StyleReUnplanned.blueTextBoldCenter}>
                          {item.name}
                        </Text>
                        <View style={StyleReUnplanned.redBorder}>
                          <Text style={StyleReUnplanned.redText}>
                            {intl.formatMessage({
                              id: "unplanned.taskNotResolved",
                              defaultMessage: "This task is not resolved",
                            })}
                          </Text>
                        </View>
                      </View>

                      <Text style={StyleReUnplanned.smallGreyText}>
                        {intl.formatMessage({
                          id: "unplanned.eventOccuredOn",
                          defaultMessage: "This event occured on",
                        })}{" "}
                        {intl.formatDate(DateTime.fromISO(item.eventDate), {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </Text>
                      <Text style={StyleReUnplanned.smallGreyText}>
                        {intl.formatMessage({
                          id: "unplanned.createdOn",
                          defaultMessage: "Created on",
                        })}{" "}
                        {intl.formatDate(DateTime.fromISO(item.createdAt), {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}{" "}
                      </Text>
                    </View>
                    {/* button action */}

                    <View style={StyleReUnplanned.fourButtonsContainer}>
                      {
                        <View style={StyleReUnplanned.row1}>
                          {
                            <>
                              <Button
                                onPress={this.navigateTo("ResolveTask", item)}
                                icon={
                                  <FontAwesome
                                    name="check"
                                    size={16}
                                    color="#67C23A"
                                    style={{ marginRight: 5 }}
                                  />
                                }
                                disabled={item?._id ? false : true}
                                title={intl.formatMessage({
                                  id: "unplanned.closeOrResolveButton",
                                  defaultMessage: "Close/Resolve Task",
                                })}
                                titleStyle={{
                                  fontSize: 15,
                                  color: "#67C23A",
                                  textAlign: "left",
                                }}
                                buttonStyle={StyleTaskInformation.buttonClose}
                              />
                              <Button
                                onPress={this.navigateTo("EditTask", item)}
                                icon={
                                  <FontAwesome
                                    name="pencil"
                                    size={16}
                                    color="#409EFF"
                                    style={{ marginRight: 5 }}
                                  />
                                }
                                disabled={item?._id ? false : true}
                                title={intl.formatMessage({
                                  id: "unplanned.editButton",
                                  defaultMessage: "Edit Task",
                                })}
                                titleStyle={{
                                  fontSize: 15,
                                  color: "#409EFF",
                                  textAlign: "left",
                                }}
                                buttonStyle={StyleTaskInformation.buttonEdit}
                              />
                              {connexion ? (
                                <Button
                                  onPress={() => this.disableTask(item._id)}
                                  icon={
                                    <FontAwesome
                                      name="ban"
                                      size={16}
                                      color="#F56C6C"
                                      style={{ marginRight: 5 }}
                                    />
                                  }
                                  disabled={item?._id ? false : true}
                                  title={intl.formatMessage({
                                    id: "unplanned.disableButton",
                                    defaultMessage: "Disable Maintenance",
                                  })}
                                  titleStyle={{
                                    fontSize: 15,
                                    color: "#F56C6C",
                                    textAlign: "left",
                                  }}
                                  buttonStyle={
                                    StyleTaskInformation.buttonDisable
                                  }
                                />
                              ) : (
                                <Button
                                  onPress={() =>
                                    this.disableTaskOffline(item._id)
                                  }
                                  icon={
                                    <FontAwesome
                                      name="ban"
                                      size={16}
                                      color="#F56C6C"
                                      style={{ marginRight: 5 }}
                                    />
                                  }
                                  disabled={item?._id ? false : true}
                                  title={intl.formatMessage({
                                    id: "unplanned.disableOfflineButton",
                                    defaultMessage:
                                      "Disable offline Maintenance",
                                  })}
                                  titleStyle={{
                                    fontSize: 15,
                                    color: "#F56C6C",
                                    textAlign: "left",
                                  }}
                                  buttonStyle={
                                    StyleTaskInformation.buttonDisable
                                  }
                                />
                              )}
                            </>
                          }
                        </View>
                      }
                    </View>
                  </View>
                }
              </View>
              <View style={StyleRePlanned.fieldContainer}>
                <Text style={StyleRePlanned.blueText}>
                  {intl.formatMessage({
                    id: "unplanned.equipmentInfo",
                    defaultMessage: "Equipment information",
                  })}
                </Text>
                <View style={StyleRePlanned.borderContainer}>
                  <Text style={StyleRePlanned.blueTextBold}>
                    {item.equipment.name} :{" "}
                    <Text style={StyleRePlanned.greyText}>
                      {item.ship.name}
                    </Text>
                  </Text>
                </View>
              </View>
            </Card>
          }
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

export default connectActionSheet(
  injectIntl(connect(mapStateToProps)(TaskInformationUnplanned))
);
