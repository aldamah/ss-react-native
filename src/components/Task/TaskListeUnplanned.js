import React from "react";
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/AntDesign";
import { DateTime } from "luxon";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import axios from "axios";
import { injectIntl } from "react-intl";

import API from "../../configs/API";
import { COLORS } from "../../configs/theme";
import FilterModalUnplanned from "../FilterModal/FilterModalUnplanned";
import { NetworkContext } from "../../../NetworkProvider";
import ToastApp from "../ToastApp/ToastApp";
import { StyleTask } from "./StyleTask";

class TaskListeUnplanned extends React.Component {
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
    };

    this.connexionlistner;
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

  disableToastError() {
    const that = this;
    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: null };
    that.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: null };
    that.props.dispatch(actionErrorType);
  }

  navigateTo = (screen, item, taskName) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen, { item: item, taskName: taskName });
    this.setState({
      reload: false,
    });
    const that = this;
    const action = { type: "GOBACK_UNPLANNED_ACTION", value: false };
    that.props.dispatch(action);
  };

  keyExtractor = (item, index) => index.toString();

  renderTask = ({ item, index }) =>
    item?.isDisabled ? null : (
      <TouchableOpacity
        underlayColor="rgba(73,182,77,1,0.9)"
        onPress={this.navigateTo(
          "TaskInformationUnplanned",
          item,
          this.props.taskName
        )}
        key={index}
      >
        <View style={StyleTask.cardUM}>
          <View style={StyleTask.cardHeader}>
            <Text style={StyleTask.headerText}>{item.name}</Text>
            <View
              style={{
                justifyContent: "flex-end",
                marginBottom: 2,
              }}
            >
              {item?._id ? (
                <MaterialCommunityIcons
                  name="pencil-circle"
                  size={35}
                  color={COLORS.customYellow}
                />
              ) : (
                <View style={StyleTask.waitCardUM}>
                  <MaterialIcons
                    name="hourglass-top"
                    size={20}
                    color={COLORS.lightGray}
                  />
                </View>
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

                {item?.dueDate ? (
                  <View style={StyleTask.cardChildRowOne}>
                    <Text style={StyleTask.childfirstColumn}>
                      {this.props.intl.formatMessage({
                        id: "tasklist.deadline",
                        defaultMessage: "Deadline",
                      })}{" "}
                      :{" "}
                    </Text>
                    {
                      <Text style={StyleTask.childSecondColumn}>
                        {this.props.intl.formatDate(
                          DateTime.fromISO(item.dueDate),
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </Text>
                    }
                  </View>
                ) : null}
              </>
            }
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

  dataRefresh = async () => {
    const that = this;
    try {
      const { AuthReducer } = this.props;
      const token = AuthReducer.token;
      that.setState({
        token,
      });
    } catch (error) {
      console.warn("error storage 2", error);
    }
    const { token } = this.state;

    axios
      .get(API.getUnplannedTask, {
        headers: {
          AUTHORIZATION: `Bearer ${token.accessToken}`,
        },
      })
      .then(function (response) {
        that.setState(
          {
            dataReload: response.data.results,
            reload: true,
            page: 1,
            pageData: response.data.results,
          },
          () => that.disableReload()
        );
        const actionUnplanned = {
          type: "UNPLANNED_ACTION",
          value: response.data.results,
        };
        that.props.dispatch(actionUnplanned);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  disableToastUNPlanned() {
    const actionToastUNPlanned = {
      type: "TOAST_UNPLANNED_ACTION",
      value: false,
    };
    this.props.dispatch(actionToastUNPlanned);
  }

  //pull refresh
  onRefresh = async () => {
    this.dataRefresh();
  };

  clearResult() {
    const actionRES = { type: "RESULT_ACTION", value: false };
    this.props.dispatch(actionRES);
  }

  render() {
    const { taskName, navigation, TaskReducer, FilterReducer } = this.props;
    const { reload, data, textError, typeError } = this.state;
    const offLineMode = TaskReducer.unplannedOffline;

    const filter = TaskReducer.filterUnplanedTask;
    const filterRe = FilterReducer.activateResult;
    const connexion = this.context.connexion;
    const { intl } = this.props;

     // handle toast type success
     const update = typeError !== "Error";

    return (
      <>
        {FilterReducer.visibleUnplanned === true ? (
          <FilterModalUnplanned
            data={data}
            taskName={taskName}
            equipmentData={FilterReducer.equipmentFilter}
          />
        ) : null}
        {
          <SafeAreaView style={StyleTask.main}>
            <ToastApp text={textError} type={typeError} update={update}/>
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
                  keyExtractor={(item, index) => item._id}
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
                  keyExtractor={(item, index) => item._id}
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
                key={this.keyExtractor}
                onEndReachedThreshold={0.5}
                data={filter}
                renderItem={this.renderTask}
                keyExtractor={(item, index) => item._id}
                refreshControl={
                  <RefreshControl
                    refreshing={reload}
                    onRefresh={this.onRefresh}
                  />
                }
              />
            )}

            <View style={StyleTask.addNewTask}>
              <TouchableOpacity onPress={() => navigation.navigate("AddTask")}>
                <Icon name="pluscircle" size={70} color={"#001846"} />
              </TouchableOpacity>
            </View>
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
export default injectIntl(connect(mapStateToProps)(TaskListeUnplanned));
