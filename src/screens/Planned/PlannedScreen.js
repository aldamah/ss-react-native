import React from "react";
import { View } from "react-native";
import { FormattedMessage, injectIntl } from "react-intl";
import axios from "axios";
import { connect } from "react-redux";

import MenuImage from "../../components/MenuImage/MenuImage";
import FilterMenu from "../../components/FilterMenu/FilterMenu";
import TaskList from "../../components/Task/TaskList";
import API from "../../configs/API";
import { NetworkContext } from "../../../NetworkProvider";

class PlannedScreen extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = ({ navigation }) => ({
    title: (
      <FormattedMessage id="planned.navigation.list" defaultMessage="Planned" />
    ),
    headerTitleAlign: "center",
    headerLeft: () => (
      <MenuImage
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    ),
    headerRight: () => <FilterMenu />,
    headerStyle: {
      backgroundColor: "#001846",
    },
    headerTintColor: "#fff",
  });

  constructor(props) {
    super(props);
    this.state = {
      task: [],
      taskName: "Planned",
      token: [],
      connexion: null,
      visible: false,
    };
  }

  async componentDidMount() {
    const connexion = this.context.connexion;
    if (connexion) {
      this.enlineMode();
    }
  }

  async getNextPlanned(token, nextToken) {
    return await axios.get(`${API.getPlannedTask}&next=${nextToken}`, {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    });
  }

  async getPlanned(token) {
    const that = this;
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
  }

  async getUnplanned(token) {
    const that = this;
    axios
      .get(API.getUnplannedTask, {
        headers: {
          AUTHORIZATION: `Bearer ${token.accessToken}`,
        },
      })
      .then(function (response) {
        const actionUnplanned = {
          type: "UNPLANNED_ACTION",
          value: response.data.results,
        };
        that.props.dispatch(actionUnplanned);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async getMeters(token) {
    const that = this;

    axios
      .get(API.getMeterTask, {
        headers: {
          AUTHORIZATION: `Bearer ${token.accessToken}`,
        },
      })
      .then(function (response) {
        const actionMeter = {
          type: "METER_ACTION",
          value: response.data.results,
        };
        that.props.dispatch(actionMeter);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //send when online mode
  async enlineMode() {
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    await this.getUnplanned(token), await this.getMeters(token);
  }

  async UNSAFE_componentWillMount() {
    const connexion = this.context.connexion;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    if (connexion) {
      this.getPlanned(token);
    }
  }

  render() {
    const { TaskReducer } = this.props;
    const { taskName } = this.state;
    const offLineMode = TaskReducer.plannedOffline;
    return (
      <View style={{ flex: 1 }}>
        <TaskList
          task={offLineMode}
          taskName={taskName}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  TaskReducer: state.TaskReducer,
  FilterReducer: state.FilterReducer,
  AuthReducer: state.AuthReducer,
});
export default injectIntl(connect(mapStateToProps)(PlannedScreen));
