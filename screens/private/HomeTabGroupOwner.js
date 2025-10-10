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
import { HomeM1Group, HomeM1New } from '../../common/icons/homem1';
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
  AnalyticsLabel,
  AnsweredCallsNew,
  BreakStatusLabel,
  CallReportLabel,
  CallsSummLabel,
  ContactfilterObjHome,
  ContactsLabel,
  Groups,
  MissedCallsNew,
  TalkTimeLabel,
  TotalCallNew,
  defaultDate,
  filterObj,
  initCallResult,
  todayDate,
} from '../../common/Constants';
import { colors } from '../../themes/vars';
import {
  getWhatsAppTemplate,
  loadContactList,
  loadSavedContactList,
} from '../../common/redux/actions/contact';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import {
  loadCallGroupList,
  loadVoiceTemplateList,
} from '../../common/redux/actions/voiceTemplate';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeLoader } from '../../common/helpers/homeLoader';
import MyCardNew from '../../common/components/layoutnew';
import { Analytics, MissedHome } from '../../common/icons/missedhome';
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
import { filterMemberListForRole } from '../../common/helpers/utils';
import { HomeM7 } from '../../common/icons/homem7';

export const HomeTabGroupOwner = () => {
  const dispatch = useDispatch();
  const { user, dateFilterObj } = useSelector((state) => state?.global);
  const {
    ivrList,
    list,
    total: totalCall,
    HomeSummary,
    logStatus,
    memList,
  } = useSelector((state) => state?.callLog);
  const group = useSelector((state) => state?.voiceTemplate);
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
    homeSummary: true,
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
    homeSummary: true,
  });
  const [allRefresh, setAllRefresh] = useState(false);
  const [dateFilter, setDateFilter] = useState(false);
  const [summaryIndex, setSummaryIndex] = useState();
  const [summaryIndexData, setSummaryIndexData] = useState();
  const selectText = '-Select-';
  const memListData = [
    { member_name: selectText, member_id: 0 },
    ...filterMemberListForRole(user, memList),
  ];
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
      dispatch(loadHomePageSummary(user?.authcode)).then(() => {
        setSummaryIndexData(HomeSummary);
        setLoading((prev) => ({ ...prev, homeSummary: false }));
      });
      dispatch(loadCallLogList(user?.authcode, filtersLog, true)).then(() =>
        setLoading((prev) => ({ ...prev, list: false })),
      );
      dispatch(loadBlockList(user?.authcode, filtersBlock, true)).then(() =>
        setLoading((prev) => ({ ...prev, blockListTotal: false })),
      );
      dispatch(loadCallGroupList(user?.authcode, page)).then(() =>
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
        homeSummary: true,
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
      dispatch(loadHomePageSummary(user?.authcode)).then(() => {
        console.log(
          `HomeSummary?.member_analysis[0]?.productivity_time`,
          HomeSummary,
        );
        setSummaryIndex();
        setSummaryIndexData(HomeSummary);
        setAllRefresh(false);
      });
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
              title={CallReportLabel}
              icon={HomeM1Group}
              group={false}
              name={`Calls`}
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
              title={Groups}
              icon={HomeM7}
              name={`Groups`}
              type=""
              group={false}
              screen="AddGroup"
              from="answered"
              bgcolor={colors.lightBlueNew1}
              borderColor="#407BFF"
              data={[
                {
                  count: allDataLoaded ? group?.totalGroup || 0 : '--',
                },
              ]}
            />
          </FlexView>
          <FlexView gap={rw(2)} mt={rh(1)} style={{}} w={rw(95)}>
            <MyCardNew
              title={ContactsLabel}
              icon={HomeM4}
              group={false}
              name={`Contacts`}
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
              title={BreakStatusLabel}
              icon={Analytics}
              type=""
              group={false}
              // screen="CallLogTab"
              from="missed"
              bgcolor={`#ffffff`}
              borderColor="#000000"
              data={[
                {
                  count: allDataLoaded
                    ? HomeSummary?.total_break[0]?.short_break || 0
                    : '--',
                },
              ]}
            />
          </FlexView>
        </View>
        <View
          style={{
            flexDirection: `row`,
            justifyContent: `space-between`,
            paddingRight: rw(5),
            alignItems: `center`,
            paddingBottom: rh(1),
          }}
        >
          <Text
            style={[
              styles.reportsLabel,
              styles.reportsLabel1,
              { marginTop: rh(1.5) },
            ]}
          >
            {TalkTimeLabel}
          </Text>
          <Select
            style={styles.select}
            size="small"
            selectedIndex={summaryIndex}
            placeholder={`All`}
            value={
              HomeSummary?.member_analysis[summaryIndex - 1]?.member_name || ''
            }
            onSelect={(index) => {
              setSummaryIndex(index);
              setSummaryIndexData(HomeSummary?.member_analysis[index - 1]);
            }}
          >
            {HomeSummary?.member_analysis?.map((item) => {
              return (
                <SelectItem key={item?.member_id} title={item?.member_name} />
              );
            })}
          </Select>
        </View>
        <RowNew
          title={`Productivity time`}
          icon={AvgTalkTime}
          subHead={
            summaryIndexData?.productivity_time
              ? `${convertTimeString(summaryIndexData?.productivity_time)?.hours || 0} hrs ${convertTimeString(summaryIndexData?.productivity_time)?.minutes || 0} mins ${convertTimeString(summaryIndexData?.productivity_time)?.seconds || 0} sec`
              : `0`
          }
        />
        {summaryIndexData?.total_break && (
          <RowNew
            title={`Short Break`}
            icon={BreakTime}
            subHead={
              summaryIndexData?.total_break[0]?.short_break
                ? `${convertTimeString(summaryIndexData?.total_break[0]?.short_break)?.hours || 0} hrs ${convertTimeString(summaryIndexData?.total_break[0]?.short_break)?.minutes || 0} mins ${convertTimeString(summaryIndexData?.total_break[0]?.short_break)?.seconds || 0} sec`
                : `0`
            }
          />
        )}
        {summaryIndexData?.short_break && (
          <RowNew
            title={`Short Break`}
            icon={BreakTime}
            subHead={
              summaryIndexData?.short_break
                ? `${convertTimeString(summaryIndexData?.short_break)?.hours || 0} hrs ${convertTimeString(summaryIndexData?.short_break)?.minutes || 0} mins ${convertTimeString(summaryIndexData?.short_break)?.seconds || 0} sec`
                : `0`
            }
          />
        )}
        <RowNew
          title={`Talk Duration`}
          icon={TalkTime}
          subHead={
            summaryIndexData?.ttt ? summaryIndexData?.ttt?.toString() : `0`
          }
        />
        <RowNew
          title={`Average Talk Duration`}
          icon={AvgTalkTime}
          subHead={
            summaryIndexData?.att?.toString()
              ? summaryIndexData?.att?.toString()
              : `0`
          }
        />
        <RowNew
          title={`Queue Duration`}
          title1={`(Incoming)`}
          icon={WrapUpTime}
          subHead={
            summaryIndexData?.queue_duration?.toString()
              ? summaryIndexData?.queue_duration
              : `0`
          }
        />
        <RowNew
          title={`Unique Calls`}
          icon={IdealTime}
          subHead={
            summaryIndexData?.unique_calls?.toString()
              ? summaryIndexData?.unique_calls
              : `0`
          }
        />
      </ScrollView>
    </ImageBackground>
  ) : (
    <HomeLoader />
  );
};

const styles = StyleSheet.create({
  homeHead: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
    // paddingBottom: rh(2),
    // paddingHorizontal: 42,
    width: rw(100),
  },
  reportsLabel: {
    color: colors.lightBlack,
    fontSize: rf(2),
    fontWeight: 500,
    marginLeft: rw(5),
  },
  reportsLabel1: { marginBottom: rh(1) },
  select: { width: rw(40) },
});
