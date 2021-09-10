import React from "react";
import { View } from "react-native";
import axios from "axios";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import MenuImage from "../../components/MenuImage/MenuImage";
import FilterMenu from "../../components/FilterMenu/FilterMenu";
import TaskListeUnplanned from "../../components/Task/TaskListeUnplanned";
import API from "../../configs/API";
import { NetworkContext } from "../../../NetworkProvider";

class UnplannedScreen extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = ({ navigation }) => ({
    title: (
      <FormattedMessage
        id="unplanned.navigation.list"
        defaultMessage="Unplanned"
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
      taskName: "Unplanned",
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

  //send when online mode
  async enlineMode() {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;

    axios
      .get(API.getUnplannedTask, {
        headers: {
          AUTHORIZATION: `Bearer ${token.accessToken}`,
        },
      })
      .then(function (response) {
        const action = { type: "RELOAD_ACTION", value: response.data.results };
        that.props.dispatch(action);
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

  render() {
    const { TaskReducer } = this.props;
    const { taskName } = this.state;
    const offLineMode = TaskReducer.unplannedOffline;
    return (
      <View style={{ flex: 1 }}>
        <TaskListeUnplanned
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
export default connect(mapStateToProps)(UnplannedScreen);
