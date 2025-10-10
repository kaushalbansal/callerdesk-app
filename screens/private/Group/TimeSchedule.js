/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { Checkbox } from 'react-native-paper';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { colors } from '../../../themes/vars';
import {
  SearchPlaceholder,
  SelectDay,
  SubmitText,
  audioArr,
  nwbh,
  nwd,
  setBH,
  wholeDayString,
} from '../../../common/Constants';
import { IconHistory } from '../../../common/icons/iconhistory';
import moment from 'moment';
import {
  getCallGroupSchedule,
  getPromptList,
} from '../../../common/redux/actions/contact';
import PropTypes from 'prop-types';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const d = [];
d[0] = true;
d[1] = true;
d[2] = true;
d[3] = true;
d[4] = true;
d[5] = true;
d[6] = true;

const TimeSchedule = ({ group, authcode, handleUpdate }) => {
  // eslint-disable-next-line no-unused-vars
  const [showView, setShowView] = useState(false);
  const [nonWorkingHourPrompt, setNonWorkingHourPrompt] = useState([]);
  const [nonWorkingDayPrompt, setNonWorkingDayPrompt] = useState([]);

  const [business_hours, setWholeDay] = useState(true);
  const [day, setDay] = useState(d);
  const [holiday_prompt_file_name, setHolidayPromptFileName] = useState('');
  const [business_hours_prompt_file_name, setBusinessHoursPromptFileName] =
    useState('');
  const [holiday_prompt_type, setHolidayPromptType] = useState('');
  const [business_hours_prompt_type, setBusinessHoursPromptType] = useState('');

  const [wholeWeek, setWholeWeek] = useState(true);
  const [starttime, setStartTime] = useState(
    moment(new Date()).format('hh:mm A'),
  );
  const [endtime, setEndTime] = useState(moment(new Date()).format('hh:mm A'));

  useEffect(() => {
    getTimeSchedule();
    getPrompts();
  }, []);

  const getTimeSchedule = () => {
    getCallGroupSchedule(authcode, group.group_id)
      .then((res) => {
        console.log(res.data);
        if (res.status === 200 && res.data.type === 'error') {
          console.log(res.data.message, 'danger', 'bottom');
        } else {
          if (res.data?.day) {
            const dayArr = res.data.day.split(',');
            if (dayArr.length !== 7) {
              setWholeWeek(false);
            }
            d[0] = res.data.day.includes(1);
            d[1] = res.data.day.includes(2);
            d[2] = res.data.day.includes(3);
            d[3] = res.data.day.includes(4);
            d[4] = res.data.day.includes(5);
            d[5] = res.data.day.includes(6);
            d[6] = res.data.day.includes(7);
            setDay(d);
          } else {
            console.log(`business_hours`, business_hours);
            setDay([true, true, true, true, true, true, true]);
            console.log(`day`, day);
          }
          setHolidayPromptType(res.data.holiday_prompt_type);
          setHolidayPromptFileName(res.data.holiday_prompt_file_name);
          setBusinessHoursPromptType(res.data.business_hours_prompt_type);
          setBusinessHoursPromptFileName(
            res.data.business_hours_prompt_file_name,
          );
          res.data.starttime && setStartTime(res.data.starttime);
          res.data.endtime && setEndTime(res.data.endtime);
          res.data?.endtime == undefined
            ? setWholeDay(true)
            : setWholeDay(false);
          // setDay(res.data.day)

          //   setFullSchedule([
          //     ...res.data.working_hour,
          //     ...res.data.non_working_hour,
          //   ]);
        }
      })
      .catch((error) => {
        // setLoading(false);
        console.log(error);
      });
  };

  const getPrompts = () => {
    getPromptList(authcode)
      .then((res) => {
        if (res.status === 200 && res.data.type === 'error') {
          //   toastMessage(res.data.message, 'danger', 'bottom');
        } else {
          setNonWorkingHourPrompt(
            res.data.promptlist
              .filter(
                (item) => item.template_type_name === 'AFTER WORK HOURS PROMPT',
              )
              .map((item) => {
                return { label: item.template_name, value: item.template_url };
              }),
          );
          setNonWorkingDayPrompt(
            res.data.promptlist
              .filter((item) => item.template_type_name === 'VOICE MAIL')
              .map((item) => {
                return { label: item.template_name, value: item.template_url };
              }),
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCheckboxChangeAll = () => {
    if (business_hours) {
      console.log(`yoooooooo`);
      setWholeDay(false);
      setWholeWeek(false);
    } else {
      setDay([true, true, true, true, true, true, true]);
      setWholeDay(true);
      setWholeWeek(true);
    }
    // const updatedCheckboxes = checkboxes.map((checkbox) => ({
    //   ...checkbox,
    //   checked: !business_hours,
    // }));
    // setCheckboxes(updatedCheckboxes);
  };

  const [date, setDate] = useState(new Date());
  const [date1, setDate1] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setStartTime(moment(currentDate).format('hh:mm:ss'));
    setDate(currentDate);
  };
  const onChange1 = (event, selectedDate1) => {
    const currentDate1 = selectedDate1;
    setEndTime(moment(currentDate1).format('hh:mm:ss'));
    setDate1(currentDate1);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showTimepicker = () => {
    showMode('time');
  };
  const showMode1 = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date1,
      onChange: onChange1,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showTimepicker1 = () => {
    showMode1('time');
  };
  const [isFocus] = useState(false);
  const data1 = audioArr;
  const toggleWorkingDays = (index) => {
    day[index] = !day[index];
    const wholeWeek = day.find((item) => item === false);
    setDay([...day]);
    setWholeWeek(wholeWeek === undefined);
  };
  const submitTimeStrategy = () => {
    const workingDays = [];
    day.forEach((item, index) => {
      if (item) workingDays.push(index + 1);
    });

    handleUpdate({
      group_id: group.group_id,
      day: workingDays,
      holiday_prompt_type,
      holiday_prompt_file_name,
      business_hours,
      business_hours_prompt_type,
      business_hours_prompt_file_name,
      endtime: endtime || moment(date1).format('hh:mm:ss'),
      starttime: starttime || moment(date).format('hh:mm:ss'),
      timeSchedule: true,
      wholeWeek,
    });
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {!showView && (
          <View>
            <View
              style={[styles.showView2, { justifyContent: `space-between` }]}
            >
              <Text style={{ fontSize: rf(1.8), fontWeight: `400` }}>
                {setBH}
              </Text>
              <Text
                style={{ textAlign: `right`, width: rw(40), fontSize: rf(1.5) }}
              >
                {wholeDayString}
              </Text>
              <Checkbox
                value={business_hours ? 'checked' : 'unchecked'}
                status={business_hours ? 'checked' : 'unchecked'}
                onPress={() => handleCheckboxChangeAll()}
                color={colors.primary}
              />
            </View>

            {!business_hours && (
              <View style={styles.wholeDay}>
                <View style={styles.wholeDayView}>
                  <TouchableOpacity
                    style={styles.timePick}
                    onPress={showTimepicker}
                  >
                    <Text style={{ marginHorizontal: rw(1) }}>
                      <Text style={{ marginHorizontal: rw(1) }}>
                        {starttime}
                      </Text>
                    </Text>
                    <IconHistory color="grey" />
                  </TouchableOpacity>
                </View>
                <View style={styles.wholeDayView}>
                  <TouchableOpacity
                    style={styles.timePick1}
                    onPress={showTimepicker1}
                  >
                    <Text style={{ marginHorizontal: rw(1) }}>
                      <Text style={{ marginHorizontal: rw(1) }}>{endtime}</Text>
                    </Text>
                    <IconHistory color="grey" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {!business_hours && (
              <>
                <Text style={{ fontSize: rf(1.8), marginTop: rh(1) }}>
                  {nwbh}
                </Text>
                <View
                  style={{
                    flexDirection: `row`,
                    justifyContent: `space-between`,
                    marginTop: rh(1),
                  }}
                >
                  <Dropdown
                    style={[styles.dropdown, isFocus && styles.dropdown1]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data1}
                    // search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    // placeholder={!isFocus ? SelectAudioType : '...'}
                    placeholder={business_hours_prompt_type || '...'}
                    searchPlaceholder={SearchPlaceholder}
                    value={business_hours_prompt_type}
                    // onFocus={() => setIsFocus(true)}
                    // onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setBusinessHoursPromptType(item.value);
                      //   setIsFocus(false);
                    }}
                  />
                  <Dropdown
                    style={[styles.dropdown, isFocus && styles.dropdown1]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={nonWorkingHourPrompt}
                    // search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    // placeholder={!isFocus ? SelectSoundPrompt : '...'}
                    placeholder={
                      business_hours_prompt_file_name
                        ? business_hours_prompt_file_name.length > 15
                          ? `${business_hours_prompt_file_name.substring(0, 12)}...`
                          : ``
                        : '...'
                    }
                    searchPlaceholder={SearchPlaceholder}
                    value={business_hours_prompt_file_name}
                    // onFocus={() => setIsFocus(true)}
                    // onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setBusinessHoursPromptFileName(item.label);
                      //   setIsFocus(false);
                    }}
                  />
                </View>
              </>
            )}
            <Text
              style={{
                fontSize: rf(1.8),
                marginTop: rh(1),
                fontWeight: `400`,
                fontFamily: `Epilogue`,
              }}
            >
              {SelectDay}
            </Text>
            <View style={styles.days}>
              {day.map((item, index) => (
                <View key={index} style={styles.dayContainer}>
                  <Checkbox
                    value={item ? 'checked' : 'unchecked'}
                    status={item ? 'checked' : 'unchecked'}
                    onPress={() => toggleWorkingDays(index)}
                    color={colors.primary}
                  />
                  <Text style={styles.dayText}>{DAYS[index]}</Text>
                </View>
              ))}
            </View>

            {!day.every((day) => day === true) && (
              <>
                <Text style={{ fontSize: rf(1.8), marginTop: rh(1) }}>
                  {nwd}
                </Text>
                <View
                  style={{
                    flexDirection: `row`,
                    justifyContent: `space-between`,
                    marginTop: rh(1),
                  }}
                >
                  <Dropdown
                    style={[styles.dropdown, isFocus && styles.dropdown1]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={data1}
                    // search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={holiday_prompt_type || '...'}
                    searchPlaceholder={SearchPlaceholder}
                    value={holiday_prompt_type}
                    // onFocus={() => setIsFocus(true)}
                    // onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setHolidayPromptType(item.value);
                      //   setIsFocus(false);
                    }}
                  />
                  <Dropdown
                    style={[styles.dropdown, isFocus && styles.dropdown1]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={nonWorkingDayPrompt}
                    // search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={
                      holiday_prompt_file_name
                        ? holiday_prompt_file_name.length > 15
                          ? `${holiday_prompt_file_name.substring(0, 12)}...`
                          : ``
                        : '...'
                    }
                    searchPlaceholder={SearchPlaceholder}
                    value={holiday_prompt_file_name}
                    // onFocus={() => setIsFocus(true)}
                    // onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setHolidayPromptFileName(item.label);
                      //   setIsFocus(false);
                    }}
                  />
                </View>
              </>
            )}
          </View>
        )}
        <Pressable
          style={styles.btn}
          onPress={() => {
            submitTimeStrategy();
          }}
        >
          <Text style={styles.btnText}>{SubmitText.toUpperCase()}</Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

export default TimeSchedule;

const styles = StyleSheet.create({
  btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: rh(2),
    paddingVertical: rh(1),
    width: rw(85),
  },
  btnText: { color: colors.white, fontWeight: `700`, textAlign: `center` },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  dayContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: rw(-2),
    width: rw(31),
  },
  dayText: {
    color: colors.black,
    fontSize: rf(1.5),
    marginLeft: rw(1),
  },
  days: { flexDirection: `row`, flexWrap: `wrap`, marginVertical: rh(1) },
  dropdown: {
    alignSelf: `center`,
    borderColor: colors.grey,
    borderRadius: 5,
    borderWidth: 0.5,
    height: rh(4),
    marginTop: rh(1),
    paddingHorizontal: rw(5),
    width: rw(40),
  },
  dropdown1: { borderColor: colors.blue },
  iconStyle: {
    height: 20,
    width: 20,
  },
  inputSearchStyle: {
    fontSize: 16,
    height: 40,
  },
  placeholderStyle: {
    color: `grey`,
    fontSize: rf(1.5),
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  showView2: {
    alignItems: `center`,
    flexDirection: `row`,
    marginVertical: rh(1),
  },
  timePick: {
    alignItems: `center`,
    borderColor: `grey`,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: `row`,
    justifyContent: `space-between`,
    paddingHorizontal: rw(3),
    paddingVertical: rh(1),
    width: rw(40),
  },
  timePick1: {
    alignItems: `center`,
    borderColor: `grey`,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: `row`,
    justifyContent: `space-between`,
    paddingHorizontal: rw(3),
    paddingVertical: rh(1),
    width: rw(40),
  },
  wholeDay: {
    flexDirection: `row`,
    justifyContent: `space-between`,
    marginBottom: rh(1),
  },
  wholeDayView: {
    alignItems: `center`,
    justifyContent: `center`,
    width: rw(40),
  },
});
TimeSchedule.propTypes = {
  group: PropTypes.shape({
    group_id: PropTypes.string,
    contact_num: PropTypes.string,
    callresult: PropTypes.string,
    contact_status: PropTypes.string,
    file: PropTypes.string,
    member_name: PropTypes.string,
    contact_savedate: PropTypes.string,
    startdatetime: PropTypes.string,
    contact_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
    id: PropTypes.string,
    sid_id: PropTypes.string,
  }),
  authcode: PropTypes.string,
  handleUpdate: PropTypes.func,
};
