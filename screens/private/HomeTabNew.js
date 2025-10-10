/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HomeM1New } from '../../common/icons/homem1';
import { HomeM4 } from '../../common/icons/homem4';
import {
  loadBlockList,
  loadCallLogList,
  loadCallLogStatusSuccess,
  loadHomePageSummary,
  loadIVRList,
  loadMemberList,
} from '../../common/redux/actions/callLog';
import FlexView from '../../common/components/MyView';
import { rf, rh, rw } from '../../common/helpers/dimentions';
import {
  AnsweredCallsNew,
  CallsSummLabel,
  ContactfilterObjHome,
  ContactsLabel,
  MissedCallsNew,
  TalkTimeLabel,
  TotalCallNew,
  defaultDate,
  filterObj,
  initCallResult,
  todayDate,
  pageSize,
} from '../../common/Constants';
import { colors } from '../../themes/vars';
import {
  getWhatsAppTemplate,
  loadContactList,
  loadSavedContactList,
} from '../../common/redux/actions/contact';
import { IndexPath } from '@ui-kitten/components';
import {
  loadCallGroupList,
  loadVoiceTemplateList,
} from '../../common/redux/actions/voiceTemplate';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeLoader } from '../../common/helpers/homeLoader';
import MyCardNew from '../../common/components/layoutnew';
import { MissedHome } from '../../common/icons/missedhome';
import { AnsweredHome } from '../../common/icons/answeredhome';
import { IconCalenderHome } from '../../common/icons/iconcalenderhome';
import moment from 'moment';
import HomeFilter from './HomeFilter';
import RowNew from '../../common/components/row';
import { AvgTalkTime } from '../../common/icons/avgtaktime';
import { BreakTime } from '../../common/icons/breaktime';
import { TalkTime } from '../../common/icons/taktime';
import { WrapUpTime } from '../../common/icons/wrapuptime';
import { IdealTime } from '../../common/icons/idealtime';
import DateFilterButtons from './DateFiltersButton';
import { dateFilterObject } from '../../common/redux/actions/common';
import {
  EntryApi,
  EntryApiCall,
  GetProfileAndBalance,
} from '../../common/redux/actions/global';

export const HomeNew = () => {
  const dispatch = useDispatch();
  const { user, dateFilterObj } = useSelector((state) => state?.global);
  const {
    ivrList,
    list,
    total: totalCall,
    totalAnswer,
    totalMissed,
    HomeSummary,
    logStatus,
  } = useSelector((state) => state?.callLog);
  const contact = useSelector((state) => state?.contact);
  const { waTempList } = useSelector((state) => state?.whatsappTemplate);
  const [userRole, setUserRole] = useState();
  const [role, setRole] = useState();
  const [answered, setAnswered] = useState(0);
  const [missed, setMissed] = useState(0);
  const [filters, setFilters] = useState({
    ...ContactfilterObjHome,
    status: new IndexPath(0),
  });
  const total = `total`;
  const [filtersLog, setFiltersLog] = useState({
    ...filterObj,
    callstatus: '',
    callresult: initCallResult[logStatus],
  });
  const [filtersBlock] = useState({
    currentPage: 1,
  });

  const [loading, setLoading] = useState({
    ivrList: true,
    memList: true,
    list: true,
    blockListTotal: true,
    contact: true,
    callGroupList: true,
  });

  const page = 100;
  const nav = useNavigation();
  const [waTemplateCounts, setWaTemplateCounts] = useState({
    bank: 0,
    upi: 0,
    address: 0,
  });
  const [, setRefreshing] = useState({
    ivrList: true,
    memList: true,
    list: true,
    blockListTotal: true,
    contact: true,
    callGroupList: true,
  });
  const [allRefresh, setAllRefresh] = useState(false);
  const [dateFilter, setDateFilter] = useState(false);
  const fetchData = async () => {
    if (user?.authcode) {
      setLoading({
        ivrList: true,
        memList: true,
        list: true,
        blockListTotal: true,
        contact: true,
        callGroupList: true,
      });

      if (!ivrList?.length) {
        dispatch(loadIVRList(user?.authcode)).then(() =>
          setLoading((prev) => ({ ...prev, ivrList: false })),
        );
      } else {
        setLoading((prev) => ({ ...prev, ivrList: false }));
      }

      dispatch(loadMemberList(user?.authcode, nav)).then(() =>
        setLoading((prev) => ({ ...prev, memList: false })),
      );

      const obj = { wa_template_type: `` };
      dispatch(loadContactList(user?.authcode, filters, true)).then(() =>
        setLoading((prev) => ({ ...prev, contact: false })),
      );
      dispatch(getWhatsAppTemplate(user?.authcode, obj, true));
      dispatch(loadHomePageSummary(user?.authcode)).then(() => {});
      dispatch(loadCallLogList(user?.authcode, filtersLog, true)).then(() =>
        setLoading((prev) => ({ ...prev, list: false })),
      );
      dispatch(loadBlockList(user?.authcode, filtersBlock, true)).then(() =>
        setLoading((prev) => ({ ...prev, blockListTotal: false })),
      );
      dispatch(loadCallGroupList(user?.authcode, pageSize)).then(() =>
        setLoading((prev) => ({ ...prev, callGroupList: false })),
      );
      dispatch(loadSavedContactList());
      const ans = await AsyncStorage.getItem('user_role');
      const ansRole = await AsyncStorage.getItem('role');
      setUserRole(ans);
      setRole(ansRole);
      dispatch(loadVoiceTemplateList(user?.authcode));
      dispatch(GetProfileAndBalance(user?.authcode));
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  // useEffect(() => {

  // }, []);

  useEffect(() => {
    if (list.length > 0) {
      const noAnswerCalls = list.filter(
        (log) => log.callresult === 'No Answer',
      );
      const answerCalls = list.filter((log) => log.callresult === 'Answered');
      setAnswered(answerCalls.length);
      setMissed(noAnswerCalls.length);
    }
  }, [list, allRefresh, dateFilterObj]);
  useEffect(() => {
    dateFilterObj?.contactFilter
      ? dispatch(
          loadContactList(user?.authcode, dateFilterObj?.contactFilter, true),
        )
      : dispatch(loadContactList(user?.authcode, filters, true));
    if (dateFilterObj?.logStatus) {
      console.log(`log status???`);
    }
    dateFilterObj?.log
      ? dispatch(loadCallLogList(user?.authcode, dateFilterObj?.log, true))
      : dispatch(
          loadCallLogList(
            user?.authcode,
            {
              ...filtersLog,
              callresult: initCallResult[dateFilterObj?.log?.callresult],
              callstatus: initCallResult[dateFilterObj?.log?.callstatus],
            },
            true,
          ),
        );
  }, [dateFilterObj]);
  const dateFilterApiCall = ({ from, to }) => {
    const _filter = { ...filters };
    _filter.from = from;
    _filter.to = to;
    dispatch(loadContactList(user?.authcode, _filter, true)).then(() =>
      setLoading((prev) => ({ ...prev, contact: false })),
    );
  };
  const dateFilterApiCall1 = ({ from, to }) => {
    const _filterLog = { ...filtersLog };
    _filterLog.from = from;
    _filterLog.to = to;
    dispatch(loadCallLogList(user?.authcode, _filterLog, true)).then(() =>
      setLoading((prev) => ({ ...prev, list: false })),
    );
  };
  // useFocusEffect(() => {
  //   const onBackPress = () => {
  //     return true;
  //   };

  //   BackHandler.addEventListener('hardwareBackPress', onBackPress);
  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   };
  // });

  useFocusEffect(
  useCallback(() => {
    const onBackPress = () => {
      // returning true prevents going back
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    // cleanup: support both new and old RN APIs
    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove(); // modern RN
      } else if (typeof BackHandler.removeEventListener === 'function') {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress); // legacy RN
      }
    };
  }, [])
);


  const allDataLoaded = Object.values(loading).every((status) => !status);
  useEffect(() => {
    const counts = { bank: 0, upi: 0, address: 0 };
    for (let index = 0; index < waTempList?.length; index++) {
      const element = waTempList[index]?.wa_template_type;
      if (element === `upi`) {
        counts.upi = 1;
      } else if (element === `bank`) {
        counts.bank = 1;
      } else if (element === `address`) {
        counts.address = 1;
      }
    }
    setWaTemplateCounts(counts);
  }, [waTempList]);
  const onRefresh = async () => {
    setAllRefresh(true);
    dispatch(loadCallLogStatusSuccess({ logStatus: `total` }));
    dispatch(GetProfileAndBalance(user?.authcode));
    dispatch(
      dateFilterObject({ from: defaultDate, to: todayDate, type: `all` }),
    );
    setFilters({
      ...ContactfilterObjHome,
      status: new IndexPath(0),
    });
    setFiltersLog({
      ...filterObj,
      callstatus: '',
      callresult: initCallResult[total],
    });
    if (user?.authcode) {
      setRefreshing({
        ivrList: true,
        memList: true,
        list: true,
        blockListTotal: true,
        contact: true,
        callGroupList: true,
      });

      if (!ivrList?.length) {
        dispatch(loadIVRList(user?.authcode)).then(() =>
          setRefreshing((prev) => ({ ...prev, ivrList: false })),
        );
      } else {
        setRefreshing((prev) => ({ ...prev, ivrList: false }));
      }

      dispatch(loadMemberList(user?.authcode, nav)).then(() =>
        setRefreshing((prev) => ({ ...prev, memList: false })),
      );

      const obj = { wa_template_type: `` };
      dispatch(loadContactList(user?.authcode, filters, true)).then(() =>
        setRefreshing((prev) => ({ ...prev, contact: false })),
      );
      dispatch(getWhatsAppTemplate(user?.authcode, obj, true));
      dispatch(loadHomePageSummary(user?.authcode));
      dispatch(loadCallLogList(user?.authcode, filtersLog, true)).then(() =>
        setRefreshing((prev) => ({ ...prev, list: false })),
      );
      dispatch(loadBlockList(user?.authcode, filtersBlock, true)).then(() =>
        setRefreshing((prev) => ({ ...prev, blockListTotal: false })),
      );
      dispatch(loadCallGroupList(user?.authcode, page)).then(() =>
        setRefreshing((prev) => ({ ...prev, callGroupList: false })),
      );
      const ans = await AsyncStorage.getItem('user_role');
      const ansRole = await AsyncStorage.getItem('role');
      setUserRole(ans);
      setRole(ansRole);
      dispatch(loadVoiceTemplateList(user?.authcode));
    }
    setAllRefresh(false);
  };
  const onFilterChange = (newFilter) => {
    const dateObjFrom = moment(newFilter?.from, 'YYYY-M-D');
    const dateObjTo = moment(newFilter?.to, 'YYYY-M-D');

    const fromSend = dateObjFrom.format('YYYY-MM-DD');
    const toSend = dateObjTo.format('YYYY-MM-DD');
    dispatch(loadCallLogStatusSuccess({ logStatus: `total` }));
    dispatch(
      dateFilterObject({
        from: fromSend,
        to: toSend,
        type: `custom`,
      }),
    );

    closeModalNew();
  };
  const closeModalNew = () => {
    setDateFilter(false);
  };
  function convertTimeString(timeString) {
    const time = timeString?.toString();
    const parts = time.split(':').map(Number);
    const hours = parts[0];
    const minutes = parts[1];
    const seconds = parts[2];

    return {
      hours,
      minutes,
      seconds,
    };
  }
  return allDataLoaded ? (
    <ImageBackground
      source={require('../../assets/userstatus1.png')}
      style={{ backgroundColor: `white`, height: rh(138), width: rw(100) }}
      resizeMode="contain"
    >
      <HomeFilter
        onFilterChange={onFilterChange}
        onClose={() => {
          closeModalNew();
        }}
        visible={dateFilter}
        reset={allRefresh}
      />
      {/* <Text>{dateFilterObj.from}</Text>
      <Text>{dateFilterObj.to}</Text>
      <Text>{dateFilterObj.type}</Text> */}
      <View style={{ marginTop: rh(1.25) }}>
        <DateFilterButtons setDateFilter={setDateFilter} fromScreen={false} />
      </View>
      <ScrollView
        style={{}}
        refreshControl={
          <RefreshControl refreshing={allRefresh} onRefresh={onRefresh} />
        }
      >
        <Text style={[styles.reportsLabel, { marginVertical: rh(1.5) }]}>
          {CallsSummLabel}
        </Text>
        <View style={styles.homeHead}>
          <FlexView gap={rw(2)} mt={rh(0)} style={{}} w={rw(95)}>
            <MyCardNew
              title={TotalCallNew}
              icon={HomeM1New}
              type=""
              screen="CallLogTab"
              from="total"
              bgcolor={colors.lightGreyNewLessNew}
              data={[
                {
                  count: allDataLoaded ? totalCall || 0 : '--',
                },
              ]}
              disabled={false}
              borderColor="#08B632"
            />
            <MyCardNew
              title={AnsweredCallsNew}
              icon={AnsweredHome}
              type=""
              screen="CallLogTab"
              from="answered"
              bgcolor={colors.lightBlueNew1}
              borderColor="#407BFF"
              data={[
                {
                  count: allDataLoaded ? totalAnswer || 0 : '--',
                },
              ]}
            />
          </FlexView>
          <FlexView gap={rw(2)} mt={rh(2)} style={{}} w={rw(95)}>
            <MyCardNew
              title={ContactsLabel}
              icon={HomeM4}
              type=""
              screen="Contact"
              from="total"
              bgcolor={colors.lightBlue}
              borderColor="#00A2DD"
              data={[
                {
                  count: allDataLoaded ? contact?.total || 0 : '--',
                },
              ]}
            />
            <MyCardNew
              title={MissedCallsNew}
              icon={MissedHome}
              type=""
              screen="CallLogTab"
              from="missed"
              bgcolor={colors.redColorNew}
              borderColor="#F13260"
              data={[
                {
                  count: allDataLoaded ? totalMissed || 0 : '--',
                },
              ]}
            />
          </FlexView>
        </View>
        {/* <View style={{ width: rw(100), height: rh(45), alignItems: `center` }}>
          <Image
            source={require(`../../assets/comingsoonagent.png`)}
            resizeMode="contain"
            style={{ width: rw(93), height: rh(58) }}
          />
        </View> */}
        <Text
          style={[
            styles.reportsLabel,
            styles.reportsLabel1,
            { marginTop: rh(1.5) },
          ]}
        >
          {TalkTimeLabel}
        </Text>
        <RowNew
          title={`Productivity time`}
          icon={AvgTalkTime}
          subHead={
            HomeSummary?.member_analysis[0]?.productivity_time
              ? `${convertTimeString(HomeSummary?.member_analysis[0]?.productivity_time).hours} hrs ${convertTimeString(HomeSummary?.member_analysis[0]?.productivity_time).minutes} mins ${convertTimeString(HomeSummary?.member_analysis[0]?.productivity_time).seconds} sec`
              : `0`
          }
        />
        <RowNew
          title={`Short Break`}
          icon={BreakTime}
          subHead={
            HomeSummary?.member_analysis[0]?.short_break
              ? `${convertTimeString(HomeSummary?.member_analysis[0]?.short_break).hours} hrs ${convertTimeString(HomeSummary?.member_analysis[0]?.short_break).minutes} mins ${convertTimeString(HomeSummary?.member_analysis[0]?.short_break).seconds} sec`
              : `0`
          }
        />
        <RowNew
          title={`Talk Duration`}
          icon={TalkTime}
          subHead={
            HomeSummary?.member_analysis[0]?.ttt.toString()
              ? HomeSummary?.member_analysis[0]?.ttt.toString()
              : `0`
          }
        />
        <RowNew
          title={`Average Talk Duration`}
          icon={AvgTalkTime}
          subHead={
            HomeSummary?.member_analysis[0]?.att.toString()
              ? HomeSummary?.member_analysis[0]?.att.toString()
              : `0`
          }
        />
        <RowNew
          title={`Queue Duration`}
          title1={`(Incoming)`}
          icon={WrapUpTime}
          subHead={HomeSummary?.queue_duration}
        />
        <RowNew
          title={`Unique Calls`}
          icon={IdealTime}
          subHead={HomeSummary?.unique_calls}
        />
      </ScrollView>
    </ImageBackground>
  ) : (
    <HomeLoader />
  );
};

const styles = StyleSheet.create({
  all: {
    alignItems: `center`,
    backgroundColor: `#333333`,
    borderRadius: 5,
    justifyContent: `center`,
    marginHorizontal: rh(1),
    width: rw(16),
  },
  calenderStyle: {
    alignItems: `center`,
    borderColor: colors.grey,
    borderRadius: 5,
    marginHorizontal: rh(1),
    width: rw(10),
  },
  homeHead: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
    // paddingBottom: rh(2),
    paddingHorizontal: 42,
    width: rw(100),
  },
  lastsday: {
    alignItems: `center`,
    backgroundColor: `#333333`,
    borderRadius: 5,
    justifyContent: `center`,
    marginHorizontal: rh(1),
    width: rw(17),
  },
  reportsLabel: {
    color: colors.lightBlack,
    fontSize: rf(2),
    fontWeight: 500,
    marginLeft: rw(5),
  },
  reportsLabel1: { marginBottom: rh(1) },
  reportsSubHead: {
    color: colors.lightGrey,
    fontSize: rf(1.5),
    fontWeight: 500,
    marginLeft: rw(5),
  },
  today: {
    alignItems: `center`,
    backgroundColor: `white`,
    borderColor: colors.grey,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: `center`,
    marginHorizontal: rh(1),
    width: rw(15),
  },
  yDay: {
    alignItems: `center`,
    backgroundColor: `white`,
    borderColor: colors.grey,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: `center`,
    marginHorizontal: rh(1),
    width: rw(17),
  },
});
