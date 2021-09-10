const RELOAD_ACTION = "RELOAD_ACTION";
// Use AsyncStorage pour stocker les données true, false
const initialState = {
  dataTask: [],
  departmentList: [],
  equipmentList: [],
  taskName: "Planned",

  filterTask: [],
  filterUnplanedTask: [],
  filterMeterTask: [],

  shipTask: null,
  departmentTask: null,
  equipmentTask: null,

  shipName: null,
  departmentName: null,
  departmentReName: null,
  equipmentName: null,
  equipmentReName: null,

  shipActive: false,
  departmentActive: true,
  equipmentActive: true,

  equipmentId: null,
  commentAdd: "",

  plannedOffline: [],
  unplannedOffline: [],
  unplannedOnline: [],
  meterOffline: [],
  dataHistorique: [],
  dataHistoriqueMeters: [],
  connexionStatus: null,

  activateToastUnplanned: false,
  activateToastPlanned: false,
  activateToastMeter: false,

  dataReload: 0,

  textError: null,
  typeToastError: null,
  activeToastError: null,

  offlineAttachmentExist:false,

  toDay: new Date(),
};
const TaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RELOAD_ACTION":
      return {
        ...state,
        dataTask: action.value,
      };

    //ship reducer
    case "SHIP_ACTION":
      return {
        ...state,
        shipTask: action.value,
      };
    case "SHIP_NAME_ACTION":
      return {
        ...state,
        shipName: action.value,
      };
    case "SHIP_ACTIVE":
      return {
        ...state,
        shipActive: action.value,
      };

    //department reducer
    case "DEPARTMENT_ACTION":
      return {
        ...state,
        departmentTask: action.value,
      };
    case "DEPARTMENT_NAME_ACTION":
      return {
        ...state,
        departmentName: action.value,
      };
    case "DEPARTMENT_RE_NAME_ACTION":
      return {
        ...state,
        departmentReName: action.value,
      };
    case "DEPARTMENT_ACTIVE":
      return {
        ...state,
        departmentActive: action.value,
      };
    case "DEPARTMENT_LIST":
      return {
        ...state,
        departmentList: action.value,
      };

    //equipment reducer
    case "EQUIPMENT_ACTION":
      return {
        ...state,
        equipmentTask: action.value,
      };
    case "EQUIPMENT_NAME_ACTION":
      return {
        ...state,
        equipmentName: action.value,
      };
    case "EQUIPMENT_RE_NAME_ACTION":
      return {
        ...state,
        equipmentReName: action.value,
      };
    case "EQUIPMENT_ACTIVE":
      return {
        ...state,
        equipmentActive: action.value,
      };
    case "EQUIPMENT_LIST":
      return {
        ...state,
        equipmentList: action.value,
      };
    case "EQUIPMENT_ID":
      return {
        ...state,
        equipmentID: action.value,
      };

    case "FILTER_ACTION":
      return {
        ...state,
        filterTask: action.value,
      };
    case "FILTER_UNPLANNED_ACTION":
      return {
        ...state,
        filterUnplanedTask: action.value,
      };

    case "FILTER_METER_ACTION":
      return {
        ...state,
        filterMeterTask: action.value,
      };

    case "TASKNAME_ACTION":
      return {
        ...state,
        taskName: action.value,
      };
    case "COMMENT_ACTION":
      return {
        ...state,
        commentAdd: action.value,
      };

    //offLine mode
    case "PLANNED_ACTION":
      return {
        ...state,
        plannedOffline: action.value,
      };
    case "UNPLANNED_ACTION":
      return {
        ...state,
        unplannedOffline: action.value,
      };

    case "UNPLANNED_ONLINE_ACTION":
      return {
        ...state,
        unplannedOnline: action.value,
      };
    case "METER_ACTION":
      return {
        ...state,
        meterOffline: action.value,
      };
    case "HISTORIQUE_ACTION":
      return {
        ...state,
        dataHistorique: action.value,
      };
    case "HISTORIQUE_METERS_ACTION":
      return {
        ...state,
        dataHistoriqueMeters: action.value,
      };

    //new Date
    case "DATE_ACTION":
      return {
        ...state,
        toDay: action.value,
      };

    case "DATARELOAD_ACTION":
      return {
        ...state,
        dataReload: action.value,
      };

    case "CONNEXION_STATUS_ACTION":
      return {
        ...state,
        connexionStatus: action.value,
      };

    //toast after reconnexion
    case "TOAST_PLANNED_ACTION":
      return {
        ...state,
        activateToastPlanned: action.value,
      };
    case "TOAST_UNPLANNED_ACTION":
      return {
        ...state,
        activateToastUnplanned: action.value,
      };
    case "TOAST_METER_ACTION":
      return {
        ...state,
        activateToastMeter: action.value,
      };
    //toast error text
    case "TOAST_TEXT_ACTION":
      return {
        ...state,
        textError: action.value,
      };

    case "TOAST_TYPE_ACTION":
      return {
        ...state,
        typeToastError: action.value,
      };

    case "TOAST_ACTIVE_ACTION":
      return {
        ...state,
        activeToastError: action.value,
      };
    case "OFFLINE_ATTACHMENT_EXIST_ACTION":
      return {
        ...state,
        offlineAttachmentExist: action.value,
      };

    default:
      return state;
  }
};

export default TaskReducer;
