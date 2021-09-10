const VISIBLE_ACTION = "VISIBLE_ACTION";
// Use AsyncStorage pour stocker les données true, false
const initialState = {
  visible: false,
  visibleUnplanned: false,
  visibleMeter: false,
  activateResult: false,
  shipsFilter: [],
  departmentFilter: [],
  equipmentFilter: [],
  goBackToUnplanned: false,
  overlayAnd: false,
  filterEquipmentLength: 0,
  filterCompteDepartment: null,
  filterCompteShip: null,
  taskInformation: "TaskInformation",
  badgeShip: false,
  badgeDepartment: false,
  badgeEquipment: false,
};
const FilterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "VISIBLE_ACTION":
      return {
        ...state,
        visible: action.value,
      };
    case "VISIBLE_UNPLANNED_ACTION":
      return {
        ...state,
        visibleUnplanned: action.value,
      };
    case "VISIBLE_METER_ACTION":
      return {
        ...state,
        visibleMeter: action.value,
      };
    case "RESULT_ACTION":
      return {
        ...state,
        activateResult: action.value,
      };

    case "SHIP_FILTER_ACTION":
      return {
        ...state,
        shipsFilter: action.value,
      };
    case "DEPARTMENT_FILTER_ACTION":
      return {
        ...state,
        departmentFilter: action.value,
      };
    case "EQUIPMENT_FILTER_ACTION":
      return {
        ...state,
        equipmentFilter: action.value,
      };
    case "GOBACK_UNPLANNED_ACTION":
      return {
        ...state,
        goBackToUnplanned: action.value,
      };
    case "OVERLAY_ACTION":
      return {
        ...state,
        overlayAnd: action.value,
      };
    case "FILTEREQUIPMENTLENGTH_ACTION":
      return {
        ...state,
        filterEquipmentLength: action.value,
      };
    case "FILTERDEPARTMENT_COMPTE_ACTION":
      return {
        ...state,
        filterCompteDepartment: action.value,
      };
    case "FILTERSHIP_COMPTE_ACTION":
      return {
        ...state,
        filterCompteShip: action.value,
      };
    case "TASKINFORMATION_ACTION":
      return {
        ...state,
        taskInformation: action.value,
      };

    //badge Filter
    case "BADGE_SHIP_ACTION":
      return {
        ...state,
        badgeShip: action.value,
      };
    case "BADGE_DEPARTMENT_ACTION":
      return {
        ...state,
        badgeDepartment: action.value,
      };
    case "BADGE_EQUIPMENT_ACTION":
      return {
        ...state,
        badgeEquipment: action.value,
      };

    default:
      return state;
  }
};

export default FilterReducer;
