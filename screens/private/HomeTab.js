/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MyCard from '../../common/components/layout';
import { HomeM1, HomeM3 } from '../../common/icons/homem1';
import { HomeM4 } from '../../common/icons/homem4';
import { HomeM5 } from '../../common/icons/homem5';
import { HomeM6, HomeM6Disabled } from '../../common/icons/homem6';
import { HomeM7, HomeM7Disabled } from '../../common/icons/homem7';
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
  AccountSetupLabel,
  AccountSetupLabelSubhead,
  AnalyticsLabel,
  BlockUser,
  CallReportLabel,
  ContactfilterObjHome,
  ContactsLabel,
  Groups,
  ReportsLabel,
  ReportsLabelSubhead,
  Teams,
  VoiceTemLabel,
  WATempLabel,
  defaultDate,
  filterObj,
  initCallResult,
  todayDate,
  pageSize,
} from '../../common/Constants';
import { colors } from '../../themes/vars';
import { HomeM9, HomeM9Disabled } from '../../common/icons/homem9';
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
import {
  WATempIconDisabledSvg,
  WATempIconSvg,
} from '../../common/icons/waicontemp';
import { HomeLoader } from '../../common/helpers/homeLoader';
import moment from 'moment';
import HomeFilter from './HomeFilter';
import { dateFilterObject } from '../../common/redux/actions/common';
import DateFilterButtons from './DateFiltersButton';
import { GetProfileAndBalance } from '../../common/redux/actions/global';

export const Home = () => {
  const dispatch = useDispatch();
  const { user, dateFilterObj } = useSelector((state) => state?.global);
  const { ivrList, totalMember, blockList, logStatus, HomeSummary } =
    useSelector((state) => state?.callLog);
  const callLogData = useSelector((state) => state.callLog);
  const group = useSelector((state) => state?.voiceTemplate);
  const { data } = useSelector((state) => state.voiceTemplate);
  const contact = useSelector((state) => state?.contact);
  const { waTempList } = useSelector((state) => state?.whatsappTemplate);
  const [userRole, setUserRole] = useState();
  const [dateFilter, setDateFilter] = useState(false);

  const [role, setRole] = useState();
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

  //   const page = 100;
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
      dispatch(loadHomePageSummary(user?.authcode)).then(() => {
        // console.log(
        //   `HomeSummary?.member_analysis[0]?.productivity_time`,
        //   HomeSummary,
        // );
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
      dispatch(loadCallLogList(user?.authcode, filtersLog, true)).then(() =>
        setLoading((prev) => ({ ...prev, list: false })),
      );
      dispatch(loadBlockList(user?.authcode, filtersBlock, true)).then(() =>
        setLoading((prev) => ({ ...prev, blockListTotal: false })),
      );
      dispatch(loadCallGroupList(user?.authcode, pageSize, 1, false)).then(() =>
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
  // useFocusEffect(() => {
  //   const onBackPress = () => {
  //     return true;
  //   };

  //   BackHandler.addEventListener('hardwareBackPress', onBackPress);
  //   return () => {
  //     BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   };
  // });
  console.log("Inside the home tab code")

  useFocusEffect(
  useCallback(() => {
    // Alert.alert('insdie home')
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
      dispatch(loadCallLogList(user?.authcode, filtersLog, true)).then(() =>
        setRefreshing((prev) => ({ ...prev, list: false })),
      );
      dispatch(loadBlockList(user?.authcode, filtersBlock, true)).then(() =>
        setRefreshing((prev) => ({ ...prev, blockListTotal: false })),
      );
      dispatch(loadCallGroupList(user?.authcode, pageSize, 1, false)).then(() =>
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
  const closeModalNew = () => {
    setDateFilter(false);
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
  return allDataLoaded ? (
    <ScrollView
      style={{ backgroundColor: colors.white }}
      refreshControl={
        <RefreshControl refreshing={allRefresh} onRefresh={onRefresh} />
      }
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    >
      {/* <Text>{dateFilterObj.from}</Text>
      <Text>{dateFilterObj.to}</Text>
      <Text>{dateFilterObj.type}</Text> */}
      <View style={{ marginTop: rh(1.25) }}>
        <DateFilterButtons setDateFilter={setDateFilter} fromScreen={false} />
      </View>
      <View style={styles.homeHead}>
        <View style={{ width: rw(100), marginTop: rh(1.25) }}>
          <Text style={styles.reportsLabel}>{ReportsLabel}</Text>
          <Text style={styles.reportsSubHead}>{ReportsLabelSubhead}</Text>
        </View>
        <FlexView gap={rw(4)} mt={rh(1.5)} style={{}} w={rw(100)}>
          <MyCard
            title={CallReportLabel}
            icon={HomeM1}
            type=""
            screen="CallLogTab"
            from="total"
            bgcolor={colors.lightGreyNewLess}
            data={[
              {
                count: allDataLoaded ? callLogData?.total || 0 : '--',
              },
            ]}
            disabled={false}
            bgcolorDisabled="#fafafa"
            disabledBorderColor="#fafafa"
          />
          <MyCard
            bgcolorDisabled="#fcfaff"
            disabledBorderColor="#fcfaff"
            title={AnalyticsLabel}
            icon={HomeM3}
            type=""
            screen="Analytics"
            bgcolor={'#CA82FD33'}
            data={[
              {
                count: allDataLoaded
                  ? HomeSummary?.member_analysis.length
                  : HomeSummary?.member_analysis.length,
              },
            ]}
          />
          {/* <View style={{ width: rw(43), height: rh(13), marginLeft: rw(-2) }}>
            <Image
              source={require(`../../assets/comingsoon.png`)}
              style={{ width: rw(43), height: rh(12.5) }}
              resizeMode="cover"
            />
          </View> */}
        </FlexView>
        <FlexView gap={rw(4)} mt={rh(2)} style={{}} w={rw(100)}>
          <MyCard
            title={ContactsLabel}
            icon={HomeM4}
            type=""
            screen="Contact"
            from="total"
            bgcolor={colors.lightBlue}
            data={[
              {
                count: allDataLoaded ? contact?.total || 0 : '--',
              },
            ]}
          />
          <MyCard
            title={BlockUser}
            icon={HomeM5}
            type=""
            screen="BlockList"
            bgcolor={colors.redColor}
            data={[
              {
                count: allDataLoaded ? blockList?.length || 0 : '--',
              },
            ]}
          />
        </FlexView>
        <View style={{ width: rw(100), marginTop: rh(1.25) }}>
          <Text style={styles.reportsLabel}>{AccountSetupLabel}</Text>
          <Text style={styles.reportsSubHead}>{AccountSetupLabelSubhead}</Text>
        </View>
        <FlexView gap={rw(4)} mt={rh(1.5)} style={{}} w={rw(100)}>
          <MyCard
            title={Teams}
            icon={
              role === `3`
                ? userRole === `3` || userRole === `2`
                  ? HomeM6Disabled
                  : HomeM6
                : HomeM6
            }
            type=""
            screen="AddTeam"
            from="total"
            bgcolor={colors.lightGreenLess}
            data={[
              {
                count: allDataLoaded ? totalMember || 0 : '--',
              },
            ]}
            disabled={
              role === `3` ? userRole === `3` || userRole === `2` : false
            }
            bgcolorDisabled="#f3f8f4"
          />
          <MyCard
            title={Groups}
            icon={
              role === `3`
                ? userRole === `2`
                  ? HomeM7Disabled
                  : HomeM7
                : HomeM7
            }
            type=""
            screen="AddGroup"
            bgcolor={colors.lightBlueNew}
            data={[
              {
                count: allDataLoaded ? group?.totalGroup || 0 : '--',
              },
            ]}
            disabled={role === `3` ? userRole === `2` : false}
            bgcolorDisabled="#f9faff"
          />
        </FlexView>
        <FlexView gap={rw(4)} mt={rh(2)} style={{}} w={rw(100)}>
          <MyCard
            title={VoiceTemLabel}
            icon={role === `3` ? WATempIconDisabledSvg : WATempIconSvg}
            type=""
            screen="VoiceTemplate"
            from="total"
            bgcolor={colors.lightOrange}
            bgcolorDisabled="#fffaf6"
            disabledBorderColor="#fffaf6"
            data={[
              {
                count: allDataLoaded
                  ? data?.filter((item) => typeof item !== 'string').length > 0
                    ? data?.filter((item) => typeof item !== 'string').length -
                      1
                    : 0
                  : '--',
              },
            ]}
            disabled={role === `3`}
          />
          <MyCard
            title={WATempLabel}
            icon={role === `3` ? HomeM9Disabled : HomeM9}
            type=""
            screen="Chat"
            bgcolor={colors.lightGreen}
            disabled={role === `3`}
            bgcolorDisabled="#f5faf6"
            disabledBorderColor="#f5faf6"
            data={[
              {
                count: allDataLoaded
                  ? waTemplateCounts?.upi +
                    waTemplateCounts?.address +
                    waTemplateCounts?.bank
                  : '--',
              },
            ]}
          />
        </FlexView>
      </View>
      <HomeFilter
        onFilterChange={onFilterChange}
        onClose={() => {
          closeModalNew();
        }}
        visible={dateFilter}
        reset={allRefresh}
      />
    </ScrollView>
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
    marginHorizontal: rh(0.75),
    width: rw(19),
  },
  calenderStyle: {
    alignItems: `flex-start`,
    borderColor: colors.grey,
    borderRadius: 5,
    marginHorizontal: rh(1),
    width: rw(30),
    // backgroundColor:`red`
  },
  homeHead: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
    paddingBottom: rh(2),
    width: rw(100),
  },
  lastsday: {
    alignItems: `center`,
    backgroundColor: `#333333`,
    borderRadius: 5,
    justifyContent: `center`,
    marginHorizontal: rh(0.75),
    width: rw(15),
  },
  reportsLabel: {
    color: colors.lightBlack,
    fontSize: rf(2),
    fontWeight: 500,
    marginLeft: rw(5),
  },
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
    marginLeft: rh(1),
    marginRight: rh(1),
    width: rw(16),
  },
  yDay: {
    alignItems: `center`,
    backgroundColor: `white`,
    borderColor: colors.grey,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: `center`,
    marginHorizontal: rh(0.75),
    width: rw(15),
  },
});
