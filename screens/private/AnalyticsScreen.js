/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
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
import CustomHeader from '../../common/components/CustomHeader';

export const AnalyticsScreen = () => {
  const dispatch = useDispatch();
  const { user, dateFilterObj } = useSelector((state) => state?.global);
  const { ivrList, list, HomeSummary, logStatus, memList } = useSelector(
    (state) => state?.callLog,
  );
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

  const allDataLoaded = Object.values(loading).every((status) => !status);
  useEffect(() => {
    setSummaryIndexData(HomeSummary);
  }, []);
  const onRefresh = async () => {
    setAllRefresh(true);
    dispatch(loadHomePageSummary(user?.authcode)).then(() => {
      setSummaryIndex();
      setSummaryIndexData(HomeSummary);
      setAllRefresh(false);
    });
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
  return (
    <ImageBackground
      source={require('../../assets/userstatus1.png')}
      style={{ backgroundColor: `white`, height: rh(138), width: rw(100) }}
      resizeMode="contain"
    >
      <ScrollView
        style={{}}
        refreshControl={
          <RefreshControl refreshing={allRefresh} onRefresh={onRefresh} />
        }
      >
        <CustomHeader title="Analytics" />
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
              (HomeSummary?.member_analysis &&
                HomeSummary?.member_analysis[summaryIndex - 1]?.member_name) ||
              ''
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
  );
};

const styles = StyleSheet.create({
  reportsLabel: {
    color: colors.lightBlack,
    fontSize: rf(2),
    fontWeight: 500,
    marginLeft: rw(5),
  },
  reportsLabel1: { marginBottom: rh(1) },
  select: { width: rw(40) },
});
