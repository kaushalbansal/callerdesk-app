/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
/* eslint-disable react-native/split-platform-components */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable n/handle-callback-err */
import { Linking, Platform, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  Clipboard from '@react-native-clipboard/clipboard';
import { TextCopied } from '../Constants';
import { logout } from '../redux/actions/common';
import store from '../redux/store';
import { getCurrentScreen, reset } from './navigationservice';
import moment from 'moment';

export const getRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
  return `#${randomColor}`;
};
export const toastShow = (msg) => {
  ToastAndroid.show(msg, ToastAndroid.SHORT);
};

export function formatCallLogDate(inputDate, seperator = ' | ') {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const dateParts = inputDate.split(' ');
  const date = dateParts[0];
  const time = dateParts[1];
  const [year, month, day] = date.split('-');
  const [hour, minute, second] = time.split(':');
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedTime = `${(hour % 12)
    .toString()
    .padStart(2, '0')}:${minute} ${ampm}`;
  const formattedDate = `${months[parseInt(month, 10) - 1]} ${parseInt(
    day,
    10,
  )}`;
  return `${formattedTime}${seperator}${formattedDate}`;
}
export function calculateTimeDifference(dateString1, dateString2) {
  // Parse the date strings into Date objects
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  // Calculate the time difference in milliseconds
  const timeDifference = Math.abs(date1 - date2);

  // Convert milliseconds to minutes and seconds
  const minutes = Math.floor(timeDifference / 60000); // 1 minute = 60,000 milliseconds
  const seconds = Math.floor((timeDifference % 60000) / 1000); // 1 second = 1,000 milliseconds

  // Format the result as "m:ss"
  const formattedTimeDifference = `${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return formattedTimeDifference;
}

export function formatPlayerTime(milliseconds) {
  // Convert milliseconds to seconds
  const totalSeconds = Math.floor(milliseconds / 1000);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Format the result as "mm:ss"
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    seconds,
  ).padStart(2, '0')}`;

  return formattedTime;
}

export function formatTotalTime(seconds) {
  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;

  // Format the result as "mm:ss"
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
    sec,
  ).padStart(2, '0')}`;

  return formattedTime;
}

export const navigateToLink = async (appUrl) => {
  try {
    await Linking.openURL(appUrl);
  } catch (error) {
    console.error('An error occurred: ', error);
  }
};

export const filterMemberListForRole = (user, memList) => {
  return memList;
};

export const DatePart = (_date = new Date()) => {
  const dd = _date.getDate();
  const mm = _date.getMonth() + 1;
  const yyyy = _date.getFullYear();
  const hh = _date.getHours();
  const min = _date.getMinutes();
  const ss = _date.getSeconds();
  return { dd, mm, yyyy, hh, min, ss };
};

export const groupContacts = (contacts = []) => {
  contacts.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }

    if (a.name > b.name) {
      return 1;
    }

    return 0;
  });

  const alphabets = [
    '#',
    ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
  ];
  let result = [];

  for (let i = 0; i < alphabets.length; i++) {
    const currchar = alphabets[i];
    const filtered = contacts.filter(
      (x) => x.name != undefined && x.name.startsWith(currchar),
    );
    if (filtered.length > 0) {
      result.push({ char: currchar, id: currchar });
      result.push(...filtered);
    }
  }

  result = result.map((x) => {
    x.checked = false;
    return x;
  });
  return result;
};

export const validateEmail = (email) => {
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return mailformat.test(email);
};

export const convertToIst = (input) => {
  const utcDate = input;
  const istFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const istDate = istFormatter.format(utcDate);
  const arr = istDate.split('/');
  return new Date(`${arr[2]}-${arr[0]}-${arr[1]}`);
};

export const formatApiFilterDate = (from, to) => {
  const lastYear = new Date(new Date().setFullYear(new Date().getFullYear()));
  const day = lastYear.getDate();
  const month = lastYear.getMonth() + 1;
  const year = lastYear.getFullYear();
  let _from = `${year}-${month}-${day}`;
  let _to = `${year}-${month}-${day}`;
  if (from) {
    const { dd, mm, yyyy } = DatePart(from);
    _from = `${yyyy}-${mm}-${dd}`;
  }

  if (to) {
    const { dd, mm, yyyy } = DatePart(to);
    _to = `${yyyy}-${mm}-${dd}`;
  }
  return { _from, _to };
};
export const onLogout = (from) => {
  AsyncStorage.removeItem('user_data', (err, result) => {
    store.dispatch(logout());
    const screenName = getCurrentScreen();
    if (from === `logout screen`) {
      console.log(from);
    } else {
      // toastShow(`You logged in from another device.`);
      screenName === `LoginWithEmail`
        ? null
        : toastShow(`You logged in from another device.`);
    }
    screenName === `LoginWithEmail`
      ? null
      : reset([{ name: 'LoginWithEmail' }], 0);
  });
};
export const checkAuth = (msg) => {
  if (msg === `Account is Inactive please contact administrator!`) {
    onLogout();
  } else {
    return true;
  }
};
export const formatDateToText = (input = '') => {
  const inputDate = new Date(input);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = inputDate.toLocaleDateString('en-GB', options);
  return formattedDate;
};

export const validateGSTFormat = (input = '') => {
  if (!input) return false;
  regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return regex.test(input);
};

export const calcPercentage = (amt = 0, percentage) => {
  const val = (amt * percentage) / 100;
  return val.toFixed(2);
};
export const makePhoneCall = (phoneNum) => {
  if (Platform.OS === 'android') {
    Linking.openURL(`tel:${phoneNum}`);
  } else {
    Linking.openURL(`telprompt:${phoneNum}`);
  }
};
export const sendSms = async (phoneNum = ``, message = ``) => {
  const separator = Platform.OS === 'ios' ? '&' : '?';
  const url = `sms:${phoneNum}${separator}body=${message}`;
  await Linking.openURL(url);
};
export const copyToClipboard = async (text) => {
  await Clipboard.setString(text);
  ToastAndroid.show(TextCopied, ToastAndroid.SHORT);
};

export const saveUser = async (data) => {
  await AsyncStorage.removeItem('user_data');
  await AsyncStorage.setItem('user_data', data);
};

export const getUserData = async () => {
  return await AsyncStorage.getItem('user_data');
};

export function singleToDoubleMarkers(text) {
  return text
    // *bold* → **bold**
    .replace(/\*(.*?)\*/g, '**$1**')
    // ~strike~ → ~~strike~~
    .replace(/~(.*?)~/g, '~~$1~~');
}

export function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['KB', 'MB', 'GB', 'TB', 'PB'];
  // figure out which unit to use (e.g. KB → exponent=1)
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length
  );
  // divide once by the full power of 1024
  const size = bytes / Math.pow(1024, exponent);

  return `${size.toFixed(2)} ${units[exponent - 1]}`;
}


export function mapDisplayToBackend(displayText) {
  // 1) Find every {{…}} occurrence, in order:
  //    rawMatches is an array of match‐objects; each m[1] is the inner label.
  const rawMatches = Array.from(
    displayText.matchAll(/\{\{([^}]+)\}\}/g)
  );
  // rawMatches might look like:
  //   [ ["{{First Name}}","First Name"], ["{{First Name}}","First Name"], … ]

  // 2) Pull out the labels in order—including duplicates.
  const labelsInOrder = rawMatches.map((m) => m[1]);
  // e.g. ["First Name","First Name", …]

  // 3) Build the backend text by replacing each occurrence sequentially:
  //    For the i-th match, we replace the first remaining "{{Label}}" with "{{i+1}}".
  let backendText = displayText;
  const exampleRow = []; // will collect labels in the same sequence

  labelsInOrder.forEach((lbl, idx) => {
    const slotNumber = idx + 1; // 1-based
    exampleRow.push(lbl);

    // Escape any regex-special chars in lbl
    const escapedLabel = lbl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    // Match exactly the first occurrence of {{Label}} in the current backendText
    const singleRe = new RegExp(`\\{\\{${escapedLabel}\\}\\}`);

    // Replace only once—so if the same {{Label}} appears later, it gets a new slot
    backendText = backendText.replace(singleRe, `{{${slotNumber}}}`);
  });

  return { backendText, exampleRow };
}


export function allPlaceholdersAreValid(text, allowedLabels) {
  // Step A: find every complete "{{…}}"
  const raw = Array.from(text.matchAll(/\{\{([^}]+)\}\}/g)) // e.g. [ ["{{First Name}}","First Name"], ... ]
    .map(m => m[1]); // e.g. ["First Name", "Price", ...]
  // Step B: check that each inner label is exactly in allowedLabels
  for (const label of raw) {
    if (!allowedLabels.includes(label)) {
      return false;
    }
  }
  // Step C: also catch any unmatched braces, e.g. a stray "{{" or "}}"
  // We ensure that after removing all valid "{{Label}}", there is no leftover "{{" or "}}".
  const stripped = text.replace(/\{\{[^}]+\}\}/g, ''); 
  if (stripped.includes('{{') || stripped.includes('}}')) {
    return false;
  }
  return true;
}

export const saveWhatsappUser=async (user)=>{
  await AsyncStorage.setItem('whatsappUser', JSON.stringify(user));
}

export const removeWhatsappUser=async ()=>{
  console.log('removing, from async============>')
  await AsyncStorage.removeItem('whatsappUser');
}

export const updateWhatsappUser = async (updates) => {
  try {

    const existingJson = await AsyncStorage.getItem('whatsappUser');
    const existing = existingJson ? JSON.parse(existingJson) : {};

    console.log(existing, 'existing')

    const merged = {
      whatsappAccessToken: '',
      whatsappRefreshToken: '',
      whatsappIntegration: '',
      ...existing,
      ...updates,
    };

    console.log(merged, 'merged')

    await AsyncStorage.setItem('whatsappUser', JSON.stringify(merged));
  } catch (err) {
    console.error('Failed to update whatsappUser', err);
  }
};


// helpers in the same file or imported
export const now = () => Date.now();

// date-range helpers (returns { from, to })
export const getTodayRange = () => {
  const end = Date.now();
  const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
  return { from: startOfDay.getTime(), to: end };
};

export const getYesterdayRange = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(0,0,0,0);
  const start = d.getTime();
  const endD = new Date();
  endD.setDate(endD.getDate() - 1);
  endD.setHours(23,59,59,999);
  return { from: start, to: endD.getTime() };
};

export const getLastNDaysRange = (n) => {
  const to = Date.now();
  const from = to - n * 24 * 60 * 60 * 1000;
  return { from, to };
};


export function buildCustomRange(fromVal, toVal, opts = {}) {
  const { normalize = true } = opts;

  const parse = (v) => {
    if (v == null) return null;
    if (moment.isMoment(v)) return v.clone();
    if (typeof v === 'number') return moment(v);
    if (typeof v === 'string') return moment(v); // parses ISO
    if (v instanceof Date) return moment(v);
    return null;
  };

  let mFrom = parse(fromVal);
  let mTo = parse(toVal);

  const now = moment();
  if (!mFrom || !mFrom.isValid()) mFrom = now.clone();
  if (!mTo   || !mTo.isValid())   mTo   = now.clone();

  if (normalize) {
    mFrom = mFrom.startOf('day');
    mTo   = mTo.endOf('day');
  }

  // ensure from <= to
  if (mFrom.isAfter(mTo)) {
    const tmp = mFrom;
    mFrom = mTo;
    mTo = tmp;
  }

  return { from: mFrom.valueOf(), to: mTo.valueOf(), rangeKey: 'custom' };
}


export const normalizePhoneNumber = (phone) => {
  let num = phone.trim();

  if (num.startsWith("+91")) {
    num = num.substring(3); // remove +91
  } else if (num.startsWith("91") && num.length > 10) {
    num = num.substring(2); // remove leading 91 (without +)
  }

  // remove any leading 0 after stripping country code
  if (num.startsWith("0")) {
    num = num.substring(1);
  }

  return num;

};