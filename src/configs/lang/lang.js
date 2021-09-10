import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isString from "lodash/isString";

/// Keep of list of supported languages and default to a locale if the device one isn't in the list.
export const supportedLanguages = ['fr', 'en', 'zh'];

/// Fallback locale if the device one is not supported.
export const fallbackLocale = 'en';
export const fallbackLocale3 = 'eng';
export const fallbackLocale4 = 'en-EN';

export var userLanguageCode = null;

/// Sets the user language code
export async function setUserLanguageCode(newCode) {
  if (Boolean(newCode) && supportedLanguages.includes(newCode)) {
    userLanguageCode = newCode;
    await AsyncStorage.setItem('user_language', userLanguageCode);
  } else {
    userLanguageCode = null;
    await AsyncStorage.removeItem('user_language');
  }
}

/// Fetches the device locale and returns a supported 2 letters format locale.
export function getLanguageCode() {
  if (Boolean(userLanguageCode) && supportedLanguages.includes(userLanguageCode)) {
    return userLanguageCode;
  }
  const systemLanguage = Localization.locale;
  const languageCode = systemLanguage.substring(0, 2);
  return supportedLanguages.includes(languageCode) ? languageCode : fallbackLocale;
}

export function getLanguageCode3() {
  const language_conversion = {
    en: 'eng',
    fr: 'fra',
    zh: 'zho'
  };
  const key = getLanguageCode();
  if (language_conversion[key]) {
    return language_conversion[key];
  }
  return fallbackLocale3;
}


export const flattenMessages = (nestedMessages, prefix = "") => {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    if (isString(value)) {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }
    return messages;
  }, {});
};

export const getLanguageCode4 = () => {
  const language_conversion = {
    en: 'en-EN',
    fr: 'fr-FR'
  };
  const key = getLanguageCode();
  if (language_conversion[key]) {
    return language_conversion[key];
  }
  return fallbackLocale4;
}
