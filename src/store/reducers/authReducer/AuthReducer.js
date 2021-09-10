const AUTH_ACTION = "AUTH_ACTION";
// Use AsyncStorage pour stocker les données true, false
const initialState = {
  isLoggedIn: false,
  email: "email",
  password: "password",
  token: [],
  hasChangedLanguage: false,
  offlineLanguageExist: false,
  passedInAuth: false,
};
const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case "AUTH_ACTION":
      return {
        ...state,
        isLoggedIn: action.value,
      };
    case "AUTH_ACTION_EMAIL":
      return {
        ...state,
        email: action.value,
      };
    case "AUTH_ACTION_PASSWORD":
      return {
        ...state,
        password: action.value,
      };

    case "AUTH_ACTION_PASSWORD":
      return {
        ...state,
        password: action.value,
      };

    case "AUTH_ACTION_TOKEN":
      return {
        ...state,
        token: action.value,
      };

    case "AUTH_ACTION_HASCHANGEDLANGUAGE":
      return {
        ...state,
        hasChangedLanguage: action.value,
      };

    case "OFFLINE_LANGUAGE_EXIST_ACTION":
      return {
        ...state,
        offlineLanguageExist: action.value,
      };

    case "AUTH_ACTION_PASSEDINAUTH":
      return {
        ...state,
        passedInAuth: action.value,
      };

    default:
      return state;
  }
};

export default AuthReducer;
