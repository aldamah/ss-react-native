import React from "react";
import { View } from "react-native";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import axios from "axios";

import MenuImage from "../../components/MenuImage/MenuImage";
import FilterMenu from "../../components/FilterMenu/FilterMenu";
import TaskListeMeter from "../../components/Task/TaskListeMeter";
import API from "../../configs/API";
import { NetworkContext } from "../../../NetworkProvider";

class MetersScreen extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = ({ navigation }) => ({
    title: (
      <FormattedMessage
        id="meters.navigation.list"
        defaultMessage="Complete task"
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
      taskName: "Meter",
      token: [],
      connexion: null,
    };
  }

  async componentDidMount() {
    const connexion = this.context.connexion;
    if (connexion) {
      this.enlineMode();
    }
  }

  async enlineMode() {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;

    axios
      .get(API.getMeterTask, {
        headers: {
          AUTHORIZATION: `Bearer ${token.accessToken}`,
        },
      })
      .then(function (response) {
        const action = { type: "RELOAD_ACTION", value: response.data.results };
        that.props.dispatch(action);
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

  render() {
    const { TaskReducer } = this.props;
    const { taskName } = this.state;
    const offLineMode = TaskReducer.meterOffline;
    return (
      <View style={{ flex: 1 }}>
        <TaskListeMeter
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
export default connect(mapStateToProps)(MetersScreen);
