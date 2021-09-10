import React from "react";
import { ActivityIndicator, View, RefreshControl } from "react-native";
import { FormattedMessage, injectIntl } from "react-intl";
import axios from "axios";
import { connect } from "react-redux";

import MenuImage from "../../components/MenuImage/MenuImage";
import { NetworkContext } from "../../../NetworkProvider";
import { Text } from "react-native";
import { StyleDashboard } from "./StyleDashboard";
import DashboardStats from "../../components/Dashboard/DashboardStats";
import API from "../../configs/API";
import DashboardToDo from "../../components/Dashboard/DashboardToDo";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import DashboardPieChart from "../../components/Dashboard/DashboardPieChart";

class DashboardScreen extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = ({ navigation }) => ({
    title: (
      <FormattedMessage
        id="dashboard.navigation.list"
        defaultMessage="Dashboard"
      />
    ),
    headerTitleAlign: "center",
    headerLeft: () => (
      <MenuImage
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    ),
    headerStyle: {
      backgroundColor: "#001846",
    },
    headerTintColor: "#fff",
  });

  constructor(props) {
    super(props);
    this.state = {
      reloading: false,
      firstName: "",
      stats: [],
      todoTasks: [],
      chart: {
        late: 0,
        almostLate: 0,
        onTime: 0,
      },
    };
    this.onRefresh = this.onRefresh.bind(this);
  }

  async componentDidMount() {
    const { AuthReducer } = this.props;
    const { firstName } = AuthReducer.token.user;
    this.setState({ firstName });
    await this.getDashboardData();
  }

  async getDashboardData() {
    const { AuthReducer } = this.props;
    await Promise.all([
      this.getStats(AuthReducer.token),
      this.getToDoTasks(AuthReducer.token),
    ]);
  }

  async getStats(token) {
    const that = this;
    axios({
      method: "GET",
      url: API.getStats,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        const formatedStats = that.formatStatsData(response?.data);
        that.setState({ stats: formatedStats, chart: response?.data?.tasks });
      })
      .catch(function (error) {
        console.warn(error);
      });
  }

  async getToDoTasks(token) {
    const that = this;
    axios({
      method: "GET",
      url: API.getToDoTasks,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.setState({ todoTasks: response.data.results });
      })
      .catch(function (error) {
        console.warn(error);
      });
  }

  formatStatsData(results) {
    const formatedData = [
      {
        _id: "1",
        value: results.tasks.late,
        label: this.props.intl.formatMessage({
          id: "dashboard.maintenanceLate",
        }),
        screen: "Planned",
      },
      {
        _id: "2",
        value: results.openUnplannedTasksCount,
        label: this.props.intl.formatMessage({
          id: "dashboard.openUnplannedTasksCount",
        }),
        screen: "Unplanned",
      },
      {
        _id: "3",
        value: results.sevenDaysLateRunningMetersCount,
        label: this.props.intl.formatMessage({
          id: "dashboard.sevenDaysLateRunningMetersCount",
        }),
        screen: "Meters",
      },
    ];

    return formatedData;
  }
  async onRefresh() {
    this.setState({ reloading: true });
    await this.getDashboardData();
    this.setState({ reloading: false });
  }

  render() {
    const { firstName, stats, todoTasks, chart, reloading } = this.state;
    const { intl } = this.props;
    const { connexion } = this.context;

    return connexion ? (
      stats.length < 1 ? (
        <View style={StyleDashboard.notConnected}>
          <View style={{ alignSelf: "center", textAlign: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      ) : (
        <ScrollView
          style={StyleDashboard.container}
          refreshControl={
            <RefreshControl refreshing={reloading} onRefresh={this.onRefresh} />
          }
        >
          <View style={StyleDashboard.headerContainer}>
            <Text style={StyleDashboard.heading}>
              {intl.formatMessage(
                {
                  id: "dashboard.hello",
                },
                {
                  firstName: firstName,
                }
              )}
            </Text>
          </View>
          <DashboardPieChart data={chart} />
          <DashboardStats data={stats} navigation={this.props.navigation} />
          <View style={StyleDashboard.headerContainer}>
            <Text style={StyleDashboard.heading}>
              {intl.formatMessage({
                id: "dashboard.toBeDone",
              })}
            </Text>
          </View>
          <DashboardToDo data={todoTasks} navigation={this.props.navigation} />
          <TouchableOpacity
            style={StyleDashboard.ViewMoreContainer}
            onPress={() => this.props.navigation.navigate("Planned")}
          >
            <Text style={StyleDashboard.viewMore}>
              {this.props.intl.formatMessage({
                id: "dashboard.viewMore",
                defaultMessage: "View more...",
              })}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )
    ) : (
      <View style={StyleDashboard.notConnected}>
        <Text
          style={{ alignSelf: "center", textAlign: "center", fontSize: 20 }}
        >
          {this.props.intl.formatMessage({
            id: "dashboard.notAvailable",
            defaultMessage: "The dashboard is not available in offline mode",
          })}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  TaskReducer: state.TaskReducer,
  FilterReducer: state.FilterReducer,
  AuthReducer: state.AuthReducer,
});
export default injectIntl(connect(mapStateToProps)(DashboardScreen));
