import React from "react";
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import * as Progress from "react-native-progress";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import axios from "axios";
import { DateTime } from "luxon";
import { injectIntl } from "react-intl";

import { StyleTask } from "./StyleTask";
import API from "../../configs/API";
import FilterModal from "../FilterModal/FilterModal";
import { COLORS } from "../../configs/theme";
import ToastApp from "../ToastApp/ToastApp";
import { NetworkContext } from "../../../NetworkProvider";

class TaskList extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      orderBy: [
        {
          key: 1,
          name: "Ships",
          active: false,
        },
        {
          key: 2,
          name: "Departement",
          active: false,
        },
        {
          key: 3,
          name: "Equipment",
          active: false,
        },
      ],
      taskContent: [],
      taskFiltered: [],
      user: [],
      token: [],
      data: null,
      test: [],
      valueByToken: [],
      connexion: null,
      reload: false,
      dataReload: [],
      status: "",
      task: [],
      page: 0,
      pageData: [],
      data: [],
      compte: 0,
      fechtOffline: false,
      disableToast: false,
      textError: null,
      typeError: null,
      activateError: null,
      updateScreen: false,
    };

    this.connexionlistner;
  }

  async getDepartment(token) {
    const that = this;
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
  }
  //equipment for filter
  async getEquipment(token) {
    const that = this;
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
  }

  async componentDidMount() {
    const connexion = this.context.connexion;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const that = this;

    const action = { type: "SHIP_FILTER_ACTION", value: token.user.ships };
    that.props.dispatch(action);
    if (connexion) {
      //await this.getPlanned(token)
      await this.getDepartment(token);
      await this.getEquipment(token);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const connexion = this.context?.connexion;
    const { TaskReducer, navigation, AuthReducer } = this.props;
    const toastDataSend = TaskReducer.activateToastPlanned;
    const toastDataSendUn = TaskReducer.activateToastUnplanned;
    const toastDataSendMe = TaskReducer.activateToastMeter;
    const offlineLanguageExist = AuthReducer.offlineLanguageExist;
    const offlineAttachmentExist = TaskReducer.offlineAttachmentExist;
    const textError = TaskReducer.textError;
    const typeError = TaskReducer.typeToastError;
    if (
      (toastDataSend ||
        toastDataSendUn ||
        toastDataSendMe ||
        offlineLanguageExist ||
        offlineAttachmentExist) &&
      connexion
    ) {
      navigation.navigate("Refresh");
    }

    if (textError) {
      this.setState(
        {
          textError: textError,
          typeError: typeError,
        },
        () => this.disableToastError()
      );
    }
  }

  async UNSAFE_componentWillMount() {
    const connexion = this.context.connexion;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    if (connexion) {
      this.getDepartment(token);
      this.getEquipment(token);
    }
  }

  disableToastError() {
    const that = this;
    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: null };
    that.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: null };
    that.props.dispatch(actionErrorType);
  }

  navigateTo = (screen, item, taskName) => () => {
    const { navigation } = this.props;
    const that = this;
    if (item.edited) {
      const errorMessage = this.props.intl.formatMessage({
        id: "planned.toast.pendingChange",
        defaultMessage:
          "This task has pending changes that will be transferred when the internet is restored",
      });
      const errorType = "Warning";

      const actionErrorText = {
        type: "TOAST_TEXT_ACTION",
        value: errorMessage,
      };
      that.props.dispatch(actionErrorText);

      const actionErrorType = { type: "TOAST_TYPE_ACTION", value: errorType };
      that.props.dispatch(actionErrorType);

      this.setState({
        updateScreen: true,
      });
    } else {
      navigation.navigate(screen, { item: item, taskName: taskName });
      this.setState({
        reload: false,
      });
      const that = this;
      const action = { type: "GOBACK_UNPLANNED_ACTION", value: false };
      that.props.dispatch(action);
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderTask = ({ item, index }) =>
    item?.isDisabled ? null : (
      <TouchableOpacity
        underlayColor="rgba(73,182,77,1,0.9)"
        onPress={this.navigateTo("TaskInformation", item, this.props.taskName)}
        key={index}
      >
        <View style={StyleTask.card}>
          <View style={StyleTask.cardHeader}>
            <Text style={StyleTask.headerText}>{item.name}</Text>
            <View
              style={{
                justifyContent: "flex-end",
                marginBottom: 2,
              }}
            >
              {item?.edited ? (
                <View style={StyleTask.waitCardUM}>
                  <MaterialIcons
                    name="hourglass-top"
                    size={20}
                    color={COLORS.lightGray}
                  />
                </View>
              ) : (
                <MaterialCommunityIcons
                  name="pencil-circle"
                  size={35}
                  color={COLORS.customYellow}
                />
              )}
            </View>
          </View>
          <View>
            <View style={StyleTask.cardChildRowOne}>
              <Text style={StyleTask.childfirstColumn}>
                {this.props.intl.formatMessage({
                  id: "tasklist.ship",
                  defaultMessage: "Ship",
                })}{" "}
                :{" "}
              </Text>
              <Text style={StyleTask.childSecondColumn}>{item.ship.name}</Text>
            </View>

            {
              <>
                <View style={StyleTask.cardChildRowOne}>
                  <Text style={StyleTask.childfirstColumn}>
                    {this.props.intl.formatMessage({
                      id: "tasklist.equipment",
                      defaultMessage: "Equipment",
                    })}{" "}
                    :{" "}
                  </Text>
                  <Text style={StyleTask.childSecondColumn}>
                    {item.equipment.name}
                  </Text>
                </View>
                {item?.edited ? null : (
                  <View style={StyleTask.cardChildRowOne}>
                    <Text style={StyleTask.childfirstColumn}>
                      {this.props.intl.formatMessage({
                        id: "tasklist.deadline",
                        defaultMessage: "Deadline",
                      })}{" "}
                      :{" "}
                    </Text>
                    {item?.equipment?.hourMeter?.lastValue &&
                    item?.previousTask?.resolutionHourMeterValue ? (
                      <Text style={StyleTask.childSecondColumn}>
                        {item.equipment.hourMeter.lastValue -
                          item.previousTask.resolutionHourMeterValue}
                        /{item.plannedMaintenance.hourMeterBasedRecurrence}{" "}
                        (est.{" "}
                        {this.props.intl.formatDate(
                          DateTime.fromISO(item.dueDate),
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                        )
                      </Text>
                    ) : item?.equipment?.hourMeter?.lastValue ? (
                      <Text style={StyleTask.childSecondColumn}>
                        {item.equipment.hourMeter.lastValue}/
                        {item.plannedMaintenance.hourMeterBasedRecurrence}(est.{" "}
                        {this.props.intl.formatDate(
                          DateTime.fromISO(item.dueDate),
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                        )
                      </Text>
                    ) : (
                      <Text style={StyleTask.childSecondColumn}>
                        {item.plannedMaintenance.hourMeterBasedRecurrence}
                        {this.props.intl.formatDate(
                          DateTime.fromISO(item.dueDate),
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </Text>
                    )}
                  </View>
                )}
              </>
            }
            {item?.edited ? null : item.progression / 100 < 0.9 ? (
              <View style={StyleTask.cardChildRowOne}>
                <Text style={StyleTask.childfirstColumn}>
                  {this.props.intl.formatMessage({
                    id: "tasklist.progression",
                    defaultMessage: "Progression",
                  })}{" "}
                  :{" "}
                </Text>
                <Text style={StyleTask.progressionStyle}>
                  <Progress.Bar
                    progress={item.progression / 100}
                    width={200}
                    color={"#67C23A"}
                    height={12}
                    borderWidth={0}
                    unfilledColor={"#f4f4f4"}
                  />
                </Text>
              </View>
            ) : item.progression / 100 >= 0.9 && item.progression / 100 < 1 ? (
              <View style={StyleTask.cardChildRowOne}>
                <Text style={StyleTask.childfirstColumn}>
                  {this.props.intl.formatMessage({
                    id: "tasklist.progression",
                    defaultMessage: "Progression",
                  })}{" "}
                  :{" "}
                </Text>
                <Text style={StyleTask.progressionStyle}>
                  <Progress.Bar
                    progress={item.progression / 100}
                    width={200}
                    color={"#E6A33B"}
                    height={12}
                    borderWidth={0}
                    unfilledColor={"#f4f4f4"}
                  />
                </Text>
              </View>
            ) : (
              <View style={StyleTask.cardChildRowOne}>
                <Text style={StyleTask.childfirstColumn}>
                  {this.props.intl.formatMessage({
                    id: "tasklist.progression",
                    defaultMessage: "Progression",
                  })}{" "}
                  :{" "}
                </Text>
                <Text style={StyleTask.progressionStyle}>
                  <Progress.Bar
                    progress={item.progression / 100}
                    width={200}
                    color={"#F46C6B"}
                    height={12}
                    borderWidth={0}
                    unfilledColor={"#f4f4f4"}
                  />
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );

  activeOrderBy = () => {
    this.setState({
      active: !this.state.active,
    });
  };

  needTask = (task) => {
    this.setState({
      taskContent: task,
    });
  };

  disableReload = () => {
    this.setState({
      reload: false,
    });
  };

  getNextPlanned = async (token, nextToken) => {
    return await axios.get(`${API.getPlannedTask}&next=${nextToken}`, {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    });
  };

  refreshMethod = () => {
    let nullValue = [];
    const action = { type: "FILTER_ACTION", value: nullValue };
    this.props.dispatch(action);

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

    const actionS = { type: "SHIP_NAME_ACTION", value: null };
    this.props.dispatch(actionS);
    const actionE = { type: "EQUIPMENT_NAME_ACTION", value: null };
    this.props.dispatch(actionE);
    const actionD = { type: "DEPARTMENT_NAME_ACTION", value: null };
    this.props.dispatch(actionD);

    const actionV = { type: "VISIBLE_ACTION", value: false };
    this.props.dispatch(actionV);
    const actionRES = { type: "RESULT_ACTION", value: false };
    this.props.dispatch(actionRES);

    const actionCompteDe = { type: "FILTERDEPARTMENT_COMPTE_ACTION", value: 0 };
    this.props.dispatch(actionCompteDe);
    const actionCompte = { type: "FILTEREQUIPMENT_COMPTE_ACTION", value: 0 };
    this.props.dispatch(actionCompte);
    const actionCompteSh = { type: "FILTERSHIP_COMPTE_ACTION", value: 0 };
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
  };

  dataRefresh = async () => {
    const that = this;
    that.setState({
      reload: true,
    });
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;

    const response = await axios.get(API.getPlannedTask, {
      headers: {
        AUTHORIZATION: `Bearer ${token.accessToken}`,
      },
    });
    let data = [];
    data.push(response.data.results);
    let hasNext = response.data.hasNext;
    let next = response.data.next;
    while (hasNext) {
      try {
        const res = await that.getNextPlanned(token.accessToken, next);
        data.push(res.data.results);
        hasNext = res.data.hasNext;
        next = res.data.next;
      } catch (error) {
        hasNext = false;
        console.log(error);
      }
    }
    const actionPlanned = { type: "PLANNED_ACTION", value: data.flat() };
    that.props.dispatch(actionPlanned);
    that.refreshMethod();
    that.setState({
      reload: false,
    });
  };

  //pull refresh
  onRefresh = async () => {
    this.dataRefresh();
  };

  clearResult() {
    const actionRES = { type: "RESULT_ACTION", value: false };
    this.props.dispatch(actionRES);
  }

  render() {
    const { taskName, TaskReducer, FilterReducer } = this.props;
    const { reload, data, updateScreen, typeError, textError } = this.state;
    const offLineMode = TaskReducer.plannedOffline;

    const filter = TaskReducer.filterTask;
    const filterRe = FilterReducer.activateResult;
    const connexion = this.context.connexion;
    const { intl } = this.props;
    // handle toast type success
    const update = updateScreen || typeError !== "Error";

    return (
      <>
        {FilterReducer.visible === true ? (
          <FilterModal
            data={data}
            taskName={taskName}
            equipmentData={FilterReducer.equipmentFilter}
          />
        ) : null}
        {
          <SafeAreaView style={StyleTask.main}>
            <ToastApp text={textError} type={typeError} update={update} />
            {Platform.OS == "ios" ? (
              <StatusBar backgroundColor="#ffffff" barStyle="light-content" />
            ) : (
              <StatusBar barStyle="light-content" backgroundColor="#19196F" />
            )}
            {connexion ? null : (
              <View style={StyleTask.orangeError}>
                <Text style={StyleTask.orangeErrorText}>
                  {intl.formatMessage({
                    id: "connexion.text",
                    defaultMessage:
                      "Device currently offline, any updates will be sent automatically when the connection is restored",
                  })}
                </Text>
              </View>
            )}
            {filter.length < 1 ? (
              filter < 1 && filterRe === true ? (
                <View style={StyleTask.cardNoRes}>
                  <Text style={StyleTask.headerTextNoRes}>
                    {intl.formatMessage({
                      id: "tasklist.noresult",
                      defaultMessage: "No results",
                    })}
                  </Text>
                </View>
              ) : reload ? (
                <FlatList
                  vertical
                  showsVerticalScrollIndicator={true}
                  bounce={false}
                  alwaysBounceHorizontal={false}
                  alwaysBounceVertical={false}
                  data={offLineMode}
                  key={this.keyExtractor}
                  renderItem={this.renderTask}
                  onEndReachedThreshold={0.5}
                  keyExtractor={(item, index) => item?._id}
                  refreshControl={
                    <RefreshControl
                      refreshing={reload}
                      onRefresh={this.onRefresh}
                    />
                  }
                />
              ) : (
                <FlatList
                  vertical
                  showsVerticalScrollIndicator={true}
                  bounce={false}
                  alwaysBounceHorizontal={false}
                  alwaysBounceVertical={false}
                  data={offLineMode}
                  key={this.keyExtractor}
                  renderItem={this.renderTask}
                  onEndReachedThreshold={0.5}
                  keyExtractor={(item, index) => item?._id}
                  refreshControl={
                    <RefreshControl
                      refreshing={reload}
                      onRefresh={this.onRefresh}
                    />
                  }
                />
              )
            ) : (
              <FlatList
                vertical
                showsVerticalScrollIndicator={true}
                bounce={false}
                renderItem={this.renderTask}
                key={this.keyExtractor}
                onEndReachedThreshold={0.5}
                data={filter}
                keyExtractor={(item, index) => item?._id}
                refreshControl={
                  <RefreshControl
                    refreshing={reload}
                    onRefresh={this.onRefresh}
                  />
                }
              />
            )}
          </SafeAreaView>
        }
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  TaskReducer: state.TaskReducer,
  FilterReducer: state.FilterReducer,
  AuthReducer: state.AuthReducer,
});
export default injectIntl(connect(mapStateToProps)(TaskList));
