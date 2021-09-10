import React from "react";
import { FlatList, Text, View, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/AntDesign";
import { Button, Card, Input } from "react-native-elements";
import axios from "axios";
import { format } from "date-fns";
import { DateTime } from "luxon";
import { SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { injectIntl, FormattedMessage } from "react-intl";
import BackButton from "../BackButton/BackButton";

import { StyleTaskInformation } from "./StyleTaskInformation";
import { Ionicons } from "@expo/vector-icons";
import { StyleRePlanned } from "./StyleRePlanned";
import { StyleReMeter } from "./StyleReMeter";
import API from "../../configs/API";
import db from "../../dbSQLite/SQLiteDb";
import MeterOffline from "../../dbSQLite/MeterOffline";
import { COLORS } from "../../configs/theme";
import { NetworkContext } from "../../../NetworkProvider";
import constants from "../../configs/constants";
import ToastApp from "../ToastApp/ToastApp";
import { getLanguageCode4 } from "../../configs/lang/lang";

class TaskInformationMeter extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = ({ navigation }) => {
    return {
      title: (
        <FormattedMessage
          id="meters.navigation.detail"
          defaultMessage="Update running meter value"
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
      textError: null,
      typeError: null,
    };
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
          const action = {
            type: "HISTORIQUE_METERS_ACTION",
            value: response.data.results,
          };
          that.props.dispatch(action);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  //Permission Pick  attachement
  async componentDidMount() {
    const that = this;
    const { navigation } = this.props;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const item = navigation.getParam("item");
    const actionName = { type: "TASKNAME_ACTION", value: "Meters" };
    this.props.dispatch(actionName);

    this.setState({
      date: new Date(),
    });

    const connexion = this.context.connexion;
    if (connexion) {
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
  renderItemResults = ({ item }) =>
    this.props.TaskReducer.taskName !== "Meters" ? (
      <View style={StyleRePlanned.listRow} key={item._id}>
        <View style={StyleRePlanned.listRow1}>
          <View style={StyleRePlanned.circle}></View>
          <FlatList
            vertical
            pagingEnabled
            alwaysBounceVertical={false}
            key={this.keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={item.history}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />
        </View>

        <View style={StyleRePlanned.listRow2}>
          <View style={StyleRePlanned.yellowLine}></View>
          <View>
            {
              // no Comment
              item?.remark ? (
                <Text style={StyleRePlanned.greyTextComment}>
                  {item.remark}
                </Text>
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
    ) : (
      <View key={item._id}>
        <View style={StyleReMeter.listRow}>
          <View style={StyleReMeter.listRow1}>
            <View style={StyleReMeter.circle}></View>
            <View>
              <Text style={StyleReMeter.blueTextSmall}>
                {item.createdBy.firstName} {item.createdBy.lastName}
              </Text>
            </View>
          </View>
          <View style={StyleReMeter.listRow2}>
            <View style={StyleReMeter.yellowLine}></View>
            <View>
              <Text style={StyleReMeter.lightGreyText}>
                {item.value}{" "}
                {this.props.intl.formatMessage({
                  id: "meters.hours",
                  defaultMessage: "hours",
                })}{" "}
                ( + {item.increment}{" "}
                {this.props.intl.formatMessage({
                  id: "meters.hours",
                  defaultMessage: "hours",
                })}
                )
              </Text>
              <Text style={StyleReMeter.lightGreyText}>
                {this.props.intl.formatDate(DateTime.fromISO(item.date), {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </Text>
            </View>
            <View>
              <Ionicons
                name="person-circle"
                type="ionicon"
                color={COLORS.customYellow}
                size={40}
              />
            </View>
          </View>
        </View>
      </View>
    );

  renderItem = ({ item }) =>
    item?.what?.isStarted === true ? (
      <View key={item._id}>
        {item?.who?.firstName ? (
          <Text style={StyleRePlanned.blueTextSmall}>
            {item.who.firstName} {item.who.lastName}{" "}
          </Text>
        ) : null}
      </View>
    ) : null;
  renderMetersItem = ({ item }) => (
    <View style={StyleTaskInformation.historique} key={item._id}>
      <View style={StyleTaskInformation.historiqueTitleContainer}>
        <View style={StyleTaskInformation.circleHistorique}></View>
      </View>
      <Text style={StyleTaskInformation.downTitle}></Text>
      <View style={StyleTaskInformation.infoHistorique}>
        <View>
          <Text style={StyleTaskInformation.historiqueNoComment}>
            {item.what.resolutionHourMeterValue}
          </Text>
        </View>

        <Text style={StyleTaskInformation.downTaskSecText}>
          {item.what.updatedAt}
        </Text>
      </View>
    </View>
  );

  // navigation to update task
  navigateTo = (screen, item) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen, { item: item });
    const that = this;
  };

  handleHourMeter = (text) => {
    this.setState({ hourMeter: text });
  };
  //toast error
  handleToastOnline() {
    const errorMessage = this.props.intl.formatMessage({
      id: "meters.toast.errorSendingOnline",
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
      id: "meters.toast.errorSendingOffline",
      defaultMessage: "An error has occurred when sending offline content",
    });
    const errorType = "Error";

    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: errorMessage };
    this.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: errorType };
    this.props.dispatch(actionErrorType);
  }

  //update Meter task
  async updateMeter(idTask, date, value) {
    const { navigation } = this.props;
    const valueInt = parseInt(value, 10);
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const that = this;
    const data = {
      equipmentId: idTask,
      date: format(date, "yyyy-MM-dd"),
      value: valueInt,
    };
    
    axios({
      method: "POST",
      url: API.updateMeter,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        navigation.navigate("Refresh");
        const actionName = { type: "TASKNAME_ACTION", value: "Meters" };
        that.props.dispatch(actionName);
      })
      .catch(function (error) {
        that.handleToastOnline();
      });
  }

  //update Meters value offline mode
  async updateMeterOffline(idTask, date, value) {
    const { navigation } = this.props;
    const that = this;
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS MeterOffline (id INTEGER PRIMARY KEY AUTOINCREMENT,idTask TEXT,date DATE,value INT);"
      );
    });
    const { TaskReducer } = this.props;

    const offLineMode = TaskReducer.meterOffline;
    const actionAuth = { type: "AUTH_ACTION_PASSEDINAUTH", value: false };
    this.props.dispatch(actionAuth);

    const editedData = offLineMode.map((item) => {
      if (item._id === idTask) {
        item.hourMeter.lastReadingAt = format(date, "yyyy-MM-dd");
        item.hourMeter.lastValue = value;
        return item;
      } else {
        return item;
      }
    });

    const actionMeter = { type: "METER_ACTION", value: editedData };
    this.props.dispatch(actionMeter);
    const actionToastMeter = { type: "TOAST_METER_ACTION", value: true };
    this.props.dispatch(actionToastMeter);

    const actionName = { type: "TASKNAME_ACTION", value: "Meters" };
    this.props.dispatch(actionName);
    MeterOffline.create({
      idTask: idTask,
      date: format(date, "yyyy-MM-dd"),
      value: value,
    })
      .then((id) => {
        navigation.navigate("Refresh");
      })
      .catch((err) => {
        that.handleToastOffline();
      });
  }

  render() {
    const { navigation, TaskReducer, intl } = this.props;

    const { date, showSelectDate, hourMeter } = this.state;
    const dataHistoriqueMeters = TaskReducer.dataHistoriqueMeters;
    const connexion = this.context.connexion;
    const item = navigation.getParam("item");
    const textError = TaskReducer.textError;
    const typeError = TaskReducer.typeToastError;

    return (
      <View style={connexion ? StyleReMeter.container : StyleReMeter.containerOffline  }>
        <ToastApp text={textError} type={typeError} />

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
                ? StyleReMeter.headerContainer
                : StyleReMeter.headerContainerNO
            }
          >
            <Text style={StyleReMeter.heading}>
              {intl.formatMessage({
                id: "meters.title",
                defaultMessage: "Update running meter value",
              })}
            </Text>
          </View>
          <Card containerStyle={{ borderRadius: 5 }}>
            <View style={StyleReMeter.mainContent}>
              <View View style={StyleReMeter.fieldContainer}>
                <Text style={StyleReMeter.blueText}>
                  {intl.formatMessage({
                    id: "meters.dateRead",
                    defaultMessage:
                      "Date when you read your running meter value",
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
                      locale={getLanguageCode4()}
                      style={StyleTaskInformation.datePickerContent}
                      value={date}
                      mode="date"
                      display="default"
                      is24Hour={true}
                      locale={getLanguageCode4()}
                      maximumDate={new Date()}
                      minimumDate={new Date(item.hourMeter.lastReadingAt)}
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
                          locale={getLanguageCode4()}
                          value={date}
                          mode="date"
                          is24Hour={true}
                          display="default"
                          testID="datePicker"
                          maximumDate={new Date()}
                          minimumDate={new Date(item.hourMeter.lastReadingAt)}
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
            </View>

            <View style={StyleReMeter.fieldContainer}>
              <Text>
                <Text style={StyleReMeter.blueText}>
                  {intl.formatMessage({
                    id: "meters.value",
                    defaultMessage: "Running meter value",
                  })}
                </Text>
                <Text style={StyleReMeter.required}> *</Text>
              </Text>
              <View style={StyleReMeter.flextCenter}>
                <Input
                  placeholder={item.hourMeter.lastValue.toString()}
                  inputContainerStyle={{
                    borderColor: COLORS.lightGray3,
                    borderWidth: 1,
                    borderRadius: 5,
                    paddingLeft: 5,
                    paddingRight: 5,
                    marginTop: 10,
                  }}
                  inputStyle={{ fontSize: 15 }}
                  containerStyle={{ paddingHorizontal: 0, width: "80%" }}
                  renderErrorMessage={false}
                  onChangeText={this.handleHourMeter}
                  keyboardType="numeric"
                />
                <Text style={{ marginTop: 10 }}>
                  {intl.formatMessage({
                    id: "meters.hours",
                    defaultMessage: "Hours",
                  })}
                </Text>
              </View>
              {hourMeter < parseInt(item.hourMeter.lastValue.toString(), 10) ? (
                <Text style={{ color: "red" }}>
                  {intl.formatMessage(
                    {
                      id: "meters.valueInstruction",
                    },
                    {
                      hourMeter: item.hourMeter.lastValue.toString(),
                    }
                  )}
                </Text>
              ) : null}
            </View>
            <View style={StyleReMeter.fieldContainerCenter}>
              {connexion ? (
                <Button
                  containerStyle={StyleReMeter.saveButton}
                  buttonStyle={{ backgroundColor: COLORS.primary }}
                  title={intl.formatMessage(
                    {
                      id: "meters.updateButton",
                    },
                    {
                      equipmentName: item.name,
                    }
                  )}
                  titleStyle={{
                    color: COLORS.white,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                  onPress={() => this.updateMeter(item._id, date, hourMeter)}
                />
              ) : (
                <Button
                  containerStyle={StyleReMeter.saveButton}
                  buttonStyle={{ backgroundColor: COLORS.primary }}
                  title={intl.formatMessage(
                    {
                      id: "meters.updateOfflineButton",
                    },
                    {
                      equipmentName: item.name,
                    }
                  )}
                  titleStyle={{
                    color: COLORS.white,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                  onPress={() =>
                    this.updateMeterOffline(item._id, date, hourMeter)
                  }
                />
              )}
            </View>
          </Card>
          {/* meter Information */}
          <Card containerStyle={{ borderRadius: 5 }}>
            <View style={StyleReMeter.fieldContainer}>
              <View>
                <Text style={StyleReMeter.blueText}>
                  {intl.formatMessage({
                    id: "meters.lastReadingSaved",
                    defaultMessage: "Last reading saved",
                  })}
                </Text>
                <View>
                  <View style={StyleReMeter.borderCenterContainer}>
                    <Text style={StyleReMeter.blueTextBoldBig}>
                      {intl.formatMessage(
                        {
                          id: "meters.lastReadingSaved",
                        },
                        {
                          lastReadingSaved: item.hourMeter.lastValue,
                        }
                      )}
                    </Text>
                    <Text style={StyleReMeter.greyTextCenter}>
                      {intl.formatMessage({
                        id: "meters.on",
                        defaultMessage: "on",
                      })}{" "}
                      {intl.formatDate(
                        DateTime.fromISO(item.hourMeter.lastReadingAt),
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={StyleReMeter.fieldContainer}>
                <Text style={StyleReMeter.blueText}>
                  {intl.formatMessage({
                    id: "meters.equipmentInfo",
                    defaultMessage: "Equipment Information",
                  })}
                </Text>

                <View style={StyleReMeter.borderContainer}>
                  <Text style={StyleReMeter.blueTextBold}>{item.name} : </Text>
                  <Text style={StyleReMeter.greyText}>{item.ship.name} </Text>
                  <Text style={StyleReMeter.greyText}>
                    {item.serialNumber}{" "}
                  </Text>
                  <Text style={StyleReMeter.greyText}>
                    {item.manufacturer.name} - {item.manufacturer.reference}
                  </Text>
                </View>
              </View>
              <View style={StyleReMeter.fieldContainer}>
                <Text style={StyleReMeter.blueText}>
                  {intl.formatMessage({
                    id: "meters.lastReadingSaved",
                    defaultMessage: "Last reading saved",
                  })}
                </Text>
                {dataHistoriqueMeters.length > 0 ? (
                  <View style={StyleReMeter.borderContainer}>
                    <FlatList
                      vertical
                      pagingEnabled
                      alwaysBounceVertical={false}
                      key={this.keyExtractor}
                      // horizontal
                      showsHorizontalScrollIndicator={false}
                      data={dataHistoriqueMeters}
                      renderItem={this.renderItemResults}
                      keyExtractor={(item, index) => item._id}
                    />
                  </View>
                ) : (
                  <Text style={StyleRePlanned.smallGreyNoText}>
                    {intl.formatMessage({
                      id: "meters.noMaintenanceHistory",
                      defaultMessage: "There is no maintenance history.",
                    })}
                  </Text>
                )}
              </View>
            </View>
          </Card>
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

export default injectIntl(connect(mapStateToProps)(TaskInformationMeter));
