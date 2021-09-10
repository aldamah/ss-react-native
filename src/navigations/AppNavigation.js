import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";

import LoginScreen from "../screens/Login/LoginScreen";
import DrawerContainer from "../screens/DrawerContainer/DrawerContainer";
import PlannedScreen from "../screens/Planned";
import UnplannedScreen from "../screens/Unplanned/UnplannedScreem";
import MetersScreen from "../screens/Meters/MetersSreem";
import TaskInformation from "../components/TaskInformation/TaskInformation";
import ResolveTask from "../components/ResolveTask/ResolveTask";
import EditTask from "../components/EditTask/EditTask";
import AddTask from "../components/AddTask/AddTask";
import AuthLoadingScreen from "../screens/AuthLoadingScreen/AuthLoadingScreen";
import RefreshAuto from "../screens/RefreshAuto/RefreshAuto";
import TaskInformationUnplanned from "../components/TaskInformation/TaskInformationUnplanned";
import TaskInformationMeter from "../components/TaskInformation/TaskInformationMeter";
import DashboardScreen from '../screens/Dashboard';


const DashboardStack = createStackNavigator({
  Dashboard: DashboardScreen,
});

const AppStack = createStackNavigator({
  Planned: PlannedScreen,
  TaskInformation: TaskInformation,
});

const AppStackUN = createStackNavigator({
  Unplanned: UnplannedScreen,
  TaskInformationUnplanned: TaskInformationUnplanned,
  ResolveTask: ResolveTask,
  EditTask: EditTask,
  AddTask: AddTask,
});

const AppStackME = createStackNavigator({
  Meters: MetersScreen,
  TaskInformationMeter: TaskInformationMeter,
});

const RefreshAutoStack = createStackNavigator({
  RefreshAuto: RefreshAuto
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
});

const MainNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    AppUN: AppStackUN,
    AppME: AppStackME,
    Auth: AuthStack,
    Refresh: RefreshAutoStack,
    Dashboard:DashboardStack
  },
  {
    initialRouteName: "AuthLoading",
  }
);

const DrawerStack = createDrawerNavigator(
  {
    Main: MainNavigator,
  },
  {
    drawerPosition: "left",
    initialRouteName: "Main",
    drawerWidth: 250,
    contentComponent: DrawerContainer,
  }
);

export default AppContainer = createAppContainer(DrawerStack);

// console.disableYellowBox = true;
