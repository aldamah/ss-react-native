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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import axios from "axios";
import { injectIntl } from "react-intl";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { DateTime } from "luxon";

import API from "../../configs/API";
import { COLORS } from "../../configs/theme";
import FilterModalMeter from "../FilterModal/FilterModalMeter";
import { NetworkContext } from "../../../NetworkProvider";
import ToastApp from "../ToastApp/ToastApp";
import { StyleTask } from "./StyleTask";

class TaskListeMeter extends React.Component {
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
    const textError = TaskReducer.textError;
    const typeError = TaskReducer.typeToastError;
    if (
      (toastDataSend ||
        toastDataSendUn ||
        toastDataSendMe ||
        offlineLanguageExist) &&
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

  //fliter meter task
  renderSearchMeterTask = ({ item, index }) =>
    item?.isDisabled ? null : (
      <TouchableOpacity
        underlayColor="rgba(73,182,77,1,0.9)"
        onPress={this.navigateTo(
          "TaskInformationMeter",
          item,
          this.props.taskName
        )}
        key={index}
      >
        <View
          style={
            this.props.taskName === "Planned"
              ? StyleTask.card
              : StyleTask.cardUM
          }
        >
          <View style={StyleTask.cardHeader}>
            <Text style={StyleTask.headerText}>{item.name}</Text>
            <View
              style={{
                justifyContent: "flex-end",
                marginBottom: 2,
              }}
            >
              <MaterialCommunityIcons
                name="pencil-circle"
                size={35}
                color={COLORS.customYellow}
              />
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
            <View>
              <View style={StyleTask.cardChildRowOne}>
                <Text style={StyleTask.childfirstColumn}>
                  {this.props.intl.formatMessage({
                    id: "tasklist.department",
                    defaultMessage: "Department",
                  })}{" "}
                  :{" "}
                </Text>
                <Text style={StyleTask.childSecondColumn}>
                  {item.department.name}
                </Text>
              </View>
              <View style={StyleTask.cardChildRowOne}>
                <Text style={StyleTask.childfirstColumn}>
                  {this.props.intl.formatMessage({
                    id: "tasklist.lastValue",
                    defaultMessage: "Last value",
                  })}{" "}
                  :{" "}
                </Text>
                <Text style={StyleTask.childSecondColumn}>
                  {item.hourMeter.lastValue}{" "}
                  {this.props.intl.formatMessage({
                    id: "tasklist.hoursOn",
                    defaultMessage: "Hours on",
                  })}{" "}
                  {this.props.intl.formatDate(
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
    const { taskName } = this.props;
    const { token } = this.state;

    axios
      .get(API.getMeterTask, {
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
        const actionMeter = {
          type: "METER_ACTION",
          value: response.data.results,
        };
        that.props.dispatch(actionMeter);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  disableToastMeter() {
    const actionToastMeter = { type: "TOAST_METER_ACTION", value: false };
    this.props.dispatch(actionToastMeter);
  }

  //pull refresh
  onRefresh = async () => {
    this.fetchDataOffLine();
  };

  clearResult() {
    const actionRES = { type: "RESULT_ACTION", value: false };
    this.props.dispatch(actionRES);
  }

  renderToastDataOffline = () => (
    <View>
      <View style={StyleTask.popupContent}>
        <FontAwesome
          name="smile-o"
          style={StyleTask.popupIconSad}
          color={COLORS.gray1}
        />
        <View style={StyleTask.errorMode}>
          <Text style={StyleTask.popupText}>
            {this.props.intl.formatMessage({
              id: "meters.toast.pleaseWaitOffline",
              defaultMessage: "Please wait, we send your data offline",
            })}
          </Text>
        </View>
      </View>
    </View>
  );
  
  renderToastFetch = () => (
    <View>
      <View style={StyleTask.popupContent}>
        <FontAwesome
          name="smile-o"
          style={StyleTask.popupIconSad}
          color={COLORS.gray1}
        />
        <View style={StyleTask.errorMode}>
          <Text style={StyleTask.popupText}>
            {this.props.intl.formatMessage({
              id: "meters.toast.pleaseWaitOnline",
              defaultMessage: "Please wait, we fetch your data now",
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  render() {
    const { taskName, TaskReducer, FilterReducer } = this.props;
    const { reload, data, textError, typeError } = this.state;
    const offLineMode = TaskReducer.meterOffline;

    const filter = TaskReducer.filterMeterTask;
    const filterRe = FilterReducer.activateResult;
    const connexion = this.context.connexion;
    //     const textError = TaskReducer.textError
    // const typeError = TaskReducer.typeToastError
    const { intl } = this.props;

    return (
      <>
        {FilterReducer.visibleMeter === true ? (
          <FilterModalMeter
            data={data}
            taskName={taskName}
            equipmentData={FilterReducer.equipmentFilter}
          />
        ) : null}
        {
          <SafeAreaView style={StyleTask.main}>
            <ToastApp text={textError} type={typeError} />
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
                  renderItem={this.renderSearchMeterTask}
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
                  renderItem={this.renderSearchMeterTask}
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
                renderItem={this.renderSearchMeterTask}
                keyExtractor={(item, index) => item._id}
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
export default injectIntl(connect(mapStateToProps)(TaskListeMeter));
