import React from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import { Button, Overlay } from "react-native-elements";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";

import API from "../../configs/API";
import { NetworkContext } from "../../../NetworkProvider";
import { COLORS } from "../../configs/theme";

class FilterModalUnplanned extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      userToken: [],
      dataDepartment: [],
      dataEquipment: [],
      connexion: null,
      departmentSecondName: null,
      showEquipment: false,
      equimpentName: "",
      activateDropShip: false,
      activateDropDepartement: false,
      activateDrop: false,
      shipId: null,
      departmentId: null,
      equipmentId: null,
      ship: false,
      department: true,
      equipment: true,
      compteDepartment: 0,
      compteEquipment: 0,
      compteShip: 0,
      nameDepartment: null,
      nameEquipment: null,
    };
  }

  async componentDidMount() {
    const { FilterReducer, AuthReducer } = this.props;
    const that = this;
    const connexion = this.context.connexion;
    const userEmail = AuthReducer.email;
    const userPassword = AuthReducer.password;

    this.setState({
      visible: FilterReducer.visibleUnplanned,
    });

    if (connexion) {
      axios
        .post(API.login, {
          email: userEmail,
          password: userPassword,
          type: "user",
        })
        .then(function (response) {
          that.setState(
            {
              userToken: response.data,
            },
            () => that.getToken()
          );
        })
        .catch(function (error) {});
    }
  }

  async getToken() {
    const that = this;
    const { userToken } = this.state;
    const action = { type: "SHIP_FILTER_ACTION", value: userToken.user.ships };
    that.props.dispatch(action);
    const actionToken = { type: "AUTH_ACTION_TOKEN", value: userToken };
    that.props.dispatch(actionToken);
    await this.getDepartment();
    await this.getEquipment();
  }
  //department for filter
  getDepartment = async () => {
    const { TaskReducer } = this.props;
    const that = this;
    console.log("equipment shipTask", TaskReducer.shipTask);
    const { userToken } = this.state;
    const token = userToken;
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
  };
  //equipment for filter
  getEquipment = async () => {
    const that = this;
    const { userToken } = this.state;
    const token = userToken;
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
  };

  async UNSAFE_componentWillMount() {
    if (this.props.FilterReducer.filterCompteShip > 1) {
      const actionND = { type: "DEPARTMENT_NAME_ACTION", value: null };
      this.props.dispatch(actionND);
      const actionE = { type: "EQUIPMENT_NAME_ACTION", value: null };
      this.props.dispatch(actionE);
    }

    if (this.props.FilterReducer.filterCompteDepartment > 1) {
      const actionE = { type: "EQUIPMENT_NAME_ACTION", value: null };
      this.props.dispatch(actionE);
    }
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
    const action = { type: "VISIBLE_UNPLANNED_ACTION", value: false };
    this.props.dispatch(action);
  };

  refreshMethod = () => {
    let nullValue = [];
    const action = { type: "FILTER_UNPLANNED_ACTION", value: nullValue };
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

    this.setState({
      visible: false,
    });
    const actionV = { type: "VISIBLE_UNPLANNED_ACTION", value: false };
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

  searchUnData = async () => {
    const { TaskReducer } = this.props;
    const that = this;
    console.log("equipment shipTask", TaskReducer.shipTask);
    const shipId = TaskReducer.shipTask;
    const departmentId = TaskReducer.departmentTask;
    const equipmentId = TaskReducer.equipmentTask;

    const offLineMode = TaskReducer.unplannedOffline;

    const filteredData = offLineMode.filter((item) => {
      // shipId filter && departmentId &&  equipmentId
      if (shipId && departmentId && equipmentId) {
        return (
          item.ship._id == shipId &&
          item.equipment.departmentId == departmentId &&
          item.equipment._id == equipmentId
        );
      }
      if (shipId && equipmentId) {
        return item.ship._id == shipId && item.equipment._id == equipmentId;
      }
      // shipId filter && departmentId
      if (shipId && departmentId) {
        return (
          item.ship._id == shipId && item.equipment.departmentId == departmentId
        );
      }
      // shipId filter
      if (shipId) {
        return item.ship._id == shipId;
      }
      // no filter
      return true;
    });

    const action = { type: "FILTER_UNPLANNED_ACTION", value: filteredData };
    that.props.dispatch(action);

    const actionRE = { type: "RESULT_ACTION", value: true };
    that.props.dispatch(actionRE);
    this.setState({
      visible: false,
    });
    const actionV = { type: "VISIBLE_UNPLANNED_ACTION", value: false };
    this.props.dispatch(actionV);
  };

  //dropdown
  selectData(item) {
    this.setState({
      equipmentId: item.value,
      activateDrop: true,
    });
    const action = { type: "EQUIPMENT_ACTION", value: item.value };
    this.props.dispatch(action);
    const actionN = { type: "EQUIPMENT_NAME_ACTION", value: item.label };
    this.props.dispatch(actionN);
    const actionBE = { type: "BADGE_EQUIPMENT_ACTION", value: true };
    this.props.dispatch(actionBE);
  }

  selectDataShip(item) {

    this.setState(
      {
        shipId: item.value,
        activateDropShip: true,
        departmentId: null,
        equipmentId: null,
        department: false,
        equipment: false,
      },
      () => this.onCloseShip()
    );

    const actionDE = { type: "DEPARTMENT_ACTION", value: null };
    this.props.dispatch(actionDE);
    const actionE = { type: "EQUIPMENT_ACTION", value: null };
    this.props.dispatch(actionE);

    const action = { type: "SHIP_ACTION", value: item.value };
    this.props.dispatch(action);
    const actionN = { type: "SHIP_NAME_ACTION", value: item.label };
    this.props.dispatch(actionN);

    const actionBS = { type: "BADGE_SHIP_ACTION", value: true };
    this.props.dispatch(actionBS);
  }
  selectDataDepartment(item) {
    this.setState(
      {
        departmentId: item.value,
        activateDropDepartement: true,
        equipmentId: null,
      },
      () => this.onCloseDepartment()
    );

    const actionE = { type: "EQUIPMENT_ACTION", value: null };
    this.props.dispatch(actionE);

    const action = { type: "DEPARTMENT_ACTION", value: item.value };
    this.props.dispatch(action);
    const actionN = { type: "DEPARTMENT_NAME_ACTION", value: item.label };
    this.props.dispatch(actionN);
    const actionBDE = { type: "BADGE_DEPARTMENT_ACTION", value: true };
    this.props.dispatch(actionBDE);
  }

  onOpenShip() {
    this.setState({
      activateDropShip: true,
      ship: false,
      department: true,
      equipment: true,
    });

    const actionDEN = { type: "DEPARTMENT_ACTIVE", value: true };
    this.props.dispatch(actionDEN);
    const actionE = { type: "EQUIPMENT_ACTIVE", value: true };
    this.props.dispatch(actionE);
  }
  onOpenDepartment() {
    this.setState({
      activateDropDepartement: true,
      ship: true,
      department: false,
      equipment: true,
    });
    const actionE = { type: "EQUIPMENT_ACTIVE", value: true };
    this.props.dispatch(actionE);
  }
  onOpen(item) {
    this.setState({
      activateDrop: true,
      ship: true,
      department: true,
      equipment: false,
    });
    const actionO = { type: "OVERLAY_ACTION", value: true };
    this.props.dispatch(actionO);
    const actionFIl = {
      type: "FILTEREQUIPMENTLENGTH_ACTION",
      value: item.length,
    };
    this.props.dispatch(actionFIl);
    const actionDEN = { type: "DEPARTMENT_ACTIVE", value: true };
    this.props.dispatch(actionDEN);
  }

  onCloseShip() {
    this.setState({
      activateDropShip: false,
      ship: false,
    });
    const actionN = { type: "DEPARTMENT_NAME_ACTION", value: null };
    this.props.dispatch(actionN);
    const action = { type: "EQUIPMENT_NAME_ACTION", value: null };
    this.props.dispatch(action);

    const actionBDE = { type: "BADGE_DEPARTMENT_ACTION", value: false };
    this.props.dispatch(actionBDE);
    const actionBE = { type: "BADGE_EQUIPMENT_ACTION", value: false };
    this.props.dispatch(actionBE);
  }
  onCloseDepartment() {
    this.setState({
      activateDropDepartement: false,
      ship: false,
      department: false,
      equipment: false,
    });
    const actionN = { type: "EQUIPMENT_NAME_ACTION", value: null };
    this.props.dispatch(actionN);
    const actionDEN = { type: "DEPARTMENT_ACTIVE", value: false };
    this.props.dispatch(actionDEN);
    const actionE = { type: "EQUIPMENT_ACTIVE", value: false };
    this.props.dispatch(actionE);
    const actionBE = { type: "BADGE_EQUIPMENT_ACTION", value: false };
    this.props.dispatch(actionBE);
  }
  onClose() {
    this.setState({
      activateDrop: false,
      ship: false,
      department: false,
      equipment: false,
    });
    const actionO = { type: "OVERLAY_ACTION", value: false };
    this.props.dispatch(actionO);
    const actionFIl = { type: "FILTEREQUIPMENTLENGTH_ACTION", value: 0 };
    this.props.dispatch(actionFIl);
    const actionDEN = { type: "DEPARTMENT_ACTIVE", value: false };
    this.props.dispatch(actionDEN);
    const actionE = { type: "EQUIPMENT_ACTIVE", value: false };
    this.props.dispatch(actionE);
  }

  render() {
    const { visible, ship, department, equipment } = this.state;

    const { TaskReducer, FilterReducer, intl } = this.props;

    const dataShips = FilterReducer.shipsFilter;
    const dataDepartment = FilterReducer.departmentFilter;
    const dataEquipment = FilterReducer.equipmentFilter;

    const shipsName = TaskReducer.shipName;
    const departementName = TaskReducer.departmentName;
    const equipmentName = TaskReducer.equipmentName;
    const overlayAnd = FilterReducer.overlayAnd;
    const filterEquipmentLength = FilterReducer.filterEquipmentLength;

    const shipTaskId = TaskReducer.shipTask;
    const departmentTaskId = TaskReducer.departmentTask;

    let removeDuplicate;
    removeDuplicate = dataEquipment.filter((item) => {
      if (shipTaskId && departmentTaskId) {
        return (
          item.ship._id == shipTaskId && item.department._id == departmentTaskId
        );
      }
      if (shipTaskId) {
        return item.ship._id == shipTaskId;
      }
    });
    const filter = removeDuplicate.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );

    return (
      <Overlay
        isVisible={visible}
        onBackdropPress={() => {
          this.hideModal();
        }}
        overlayStyle={{
          position: "absolute",
          top: Platform.OS !== "android" ? 90 : 55,
          right: 10,
        }}
      >
        <View
          style={{
            padding: 10,
            ...(Platform.OS !== "android" && {
              zIndex: 2000,
            }),
          }}
        >
          <View
            style={{
              marginBottom: 20,
              ...(Platform.OS !== "android" && {
                zIndex: 5000,
              }),
            }}
          >
            <Text style={styles.filterLabel}>
              {intl.formatMessage({
                id: "filter.ship",
                defaultMessage: "Ship",
              })}
            </Text>
            <DropDownPicker
              items={dataShips.map((item) => ({
                label: item.name,
                value: item._id,
              }))}
              placeholder={
                shipsName === null
                  ? intl.formatMessage({
                      id: "filter.shipPlaceholder",
                      defaultMessage: "Select ship name",
                    })
                  : shipsName
              }
              arrowColor={COLORS.customYellow}
              containerStyle={{ width: 220 }}
              open={true}
              onChangeItem={(item) => this.selectDataShip(item)}
              onOpen={() => this.onOpenShip()}
              onClose={() => this.onCloseShip()}
              dropDownMaxHeight={227}
              dropDownStyle={{
                backgroundColor: "#ffffff",
              }}
              disabled={ship}
            />
          </View>
          <View
            style={{
              marginBottom: 20,
              ...(Platform.OS !== "android" && {
                zIndex: 4500,
              }),
            }}
          >
            <Text style={styles.filterLabel}>
              {intl.formatMessage({
                id: "filter.department",
                defaultMessage: "Department",
              })}
            </Text>
            <DropDownPicker
              items={dataDepartment.map((item) => ({
                label: item.name,
                value: item._id,
              }))}
              placeholder={
                departementName === null
                  ? intl.formatMessage({
                      id: "filter.departmentPlaceholder",
                      defaultMessage: "Select department name",
                    })
                  : departementName
              }
              arrowColor={COLORS.customYellow}
              containerStyle={{ width: 220 }}
              defaultValue={this.state.departmentId}
              open={true}
              onChangeItem={(item) => this.selectDataDepartment(item)}
              onOpen={() => this.onOpenDepartment()}
              onClose={() => this.onCloseDepartment()}
              dropDownMaxHeight={227}
              dropDownStyle={{
                backgroundColor: "#ffffff",
              }}
              disabled={
                TaskReducer.departmentActive
                  ? department
                  : TaskReducer.departmentActive
              }
            />
          </View>
          {
            <View
              style={{
                marginBottom: 10,
                ...(Platform.OS !== "android" && {
                  zIndex: 4000,
                }),
              }}
            >
              <Text style={styles.filterLabel}>
                {intl.formatMessage({
                  id: "filter.equipment",
                  defaultMessage: "Equipment",
                })}
              </Text>

              <>
                <DropDownPicker
                  items={filter.map((item) => ({
                    label: item.name,
                    value: item._id,
                  }))}
                  placeholder={
                    equipmentName === null
                      ? intl.formatMessage({
                          id: "filter.equipmentPlaceholder",
                          defaultMessage: "Select equipment name",
                        })
                      : equipmentName
                  }
                  arrowColor={COLORS.customYellow}
                  containerStyle={{ width: 220 }}
                  open={true}
                  onChangeItem={(item) => this.selectData(item)}
                  onOpen={() => this.onOpen(filter)}
                  onClose={() => this.onClose()}
                  dropDownMaxHeight={227}
                  defaultValue={this.state.equipmentId}
                  dropDownStyle={{
                    backgroundColor: "#ffffff",
                  }}
                  disabled={
                    TaskReducer.equipmentActive
                      ? equipment
                      : TaskReducer.equipmentActive
                  }
                />
                {Platform.OS === "android" ? (
                  overlayAnd ? (
                    filterEquipmentLength <= 2 ? (
                      <View style={{ height: 80 }}></View>
                    ) : filterEquipmentLength <= 4 ? (
                      <View style={{ height: 140 }}></View>
                    ) : (
                      <View style={{ height: 240 }}></View>
                    )
                  ) : null
                ) : null}
              </>
            </View>
          }
        </View>
        <View style={styles.buttonsContainer}>
          <Button
            containerStyle={styles.buttonRefresh}
            buttonStyle={{ backgroundColor: COLORS.white }}
            title={intl.formatMessage({
              id: "filter.reset",
              defaultMessage: "Reset",
            })}
            titleStyle={{ color: COLORS.customYellow, fontSize: 15 }}
            onPress={() => this.refreshMethod()}
          />
          <Button
            containerStyle={styles.buttonSubmit}
            buttonStyle={{ backgroundColor: COLORS.primary }}
            titleStyle={{ fontSize: 15 }}
            title={intl.formatMessage({
              id: "filter.filter",
              defaultMessage: "Filter",
            })}
            onPress={() => this.searchUnData()}
          />
        </View>
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  filterLabel: {
    color: COLORS.primary,
    marginBottom: 5,
    marginTop: 5,
    fontSize: 15,
  },
  buttonsContainer: {
    zIndex: 100,
    padding: 10,
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonSubmit: {
    width: 90,
    color: COLORS.primary,
    backgroundColor: COLORS.primary,
    padding: 3,
    borderRadius: 5,
  },
  buttonRefresh: {
    width: 110,
    marginRight: 20,
    color: COLORS.primary,
    backgroundColor: COLORS.white,
    padding: 3,
    borderRadius: 5,
  },
});

const mapStateToProps = (state) => ({
  FilterReducer: state.FilterReducer,
  TaskReducer: state.TaskReducer,
  AuthReducer: state.AuthReducer,
});

export default injectIntl(connect(mapStateToProps)(FilterModalUnplanned));
