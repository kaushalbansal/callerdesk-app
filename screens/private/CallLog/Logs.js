/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-raw-text */
import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CallLogCard from './CallLogCard';
import { colors } from '../../../themes/vars';
import {
  clearRoutingList,
  loadCallLogList,
  loadCallLogStatusSuccess,
  loadRoutingList,
} from '../../../common/redux/actions/callLog';
import CallLogFilter from './CallLogFilter';
import {
  ChooseOption,
  ConfirmWA,
  SendLabel,
  SendPreConfigure,
  SendWhatsapp,
  SendWhatsappBiz,
  SendWhatsappBizTitle,
  SendWhatsappInstant,
  SendWhatsappLocation,
  SendWhatsappLocationTitle,
  defaultDate,
  filterObj,
  initCallResult,
  initStatus,
  todayDate,
} from '../../../common/Constants';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import CustomHeader from '../../../common/components/CustomHeader';
import { TotalCallIcon } from '../../../common/icons/totalcallicon';
import { AnsweredCallsIcon } from '../../../common/icons/answeredcallsicon';
import { IconMissed } from '../../../common/icons/iconmissedcall';
import { IconVoice } from '../../../common/icons/iconvoice';
import { NoDataFound } from '../../../common/components/NoDataFound';
import Editcontactlog from './EditContactLog';
import { SkeletonLoaderComponent } from '../../../common/helpers/skeletonLoader';
import PropTypes from 'prop-types';
import { dateFilterObject } from '../../../common/redux/actions/common';
import moment from 'moment';
import DateFilterButtons from '../DateFiltersButton';
import HomeFilter from '../HomeFilter';
import PreviewPayment from './Preview/PreviewPayment';
import PreviewBusinessAddress from './Preview/PreviwBusinessAddress';
import Editcontact from './EditContact';
import CallDownload from './CallDownload';
import ModalBottom from '../../../common/components/ModalBottom';
import ModalMid from '../../../common/components/ModalMid';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
import {
  copyToClipboard,
  navigateToLink,
  sendSms,
} from '../../../common/helpers/utils';
import MyText from '../../../common/components/MyText';
import { Money } from '../../../common/icons/money';
import { IconGoBack } from '../../../common/icons/goback';
import { IconLocation } from '../../../common/icons/wlocation';
import CreateContact from '../ContactList/CreateContact';
import { WABiz } from '../../../common/icons/wabiz';
import { handleOpenKeypadDialer } from '../../../common/helpers/dialerHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoAppRoutingModal from '../../../common/helpers/NoAppRoutingModal';
import NoPermissionModal from '../../../common/helpers/NoPermissionModal';
import { useNavigation } from '@react-navigation/native';
import BlockUser from './BlockUser';
import CallStatusFilterButton from '../CallStatusFilterButton';

const CallLogList = ({ route }) => {
  const [playerId, setPlayerId] = useState(0);
  const { logStatus } = useSelector((state) => state.callLog);
  const [filters, setFilters] = useState({
    ...filterObj,
    callstatus: initStatus[logStatus],
    callresult: initStatus[logStatus],
  });
  // eslint-disable-next-line no-unused-vars
  const [quickSearch, setfQuickSearch] = useState('');
  const [blackArea, setBlankarea] = useState(0);
  const [tempCurrentPage, setTempCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [isLodaMore, setIsLoadMore] = useState(false);
  const [data, setData] = useState();
  const [dataCard, setDataCard] = useState();
  const [contactFilterArr, setContactFilterArr] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [showDiler, setShowDiler] = useState(false);
  const [showDilerAppRoute, setShowDilerAppRoute] = useState(false);

  const dispatch = useDispatch();
  const { user, loading, dateFilterObj, selectedDialerMode } = useSelector((state) => state.global);
  const callLogData = useSelector((state) => state.callLog);
  const { memList } = useSelector((state) => state.callLog);
  const contact = useSelector((state) => state.contact);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dateFilter, setDateFilter] = useState(false);
  const [dateReset, setDateReset] = useState(false);
  const _defaultModal = {
    whatsapp: false,
    blockUser: false,
    paymentUpi: false,
    businessAddress: false,
    editContact: false,
    fileDownload: false,
    info: false,
    whatsappConfirm: false,
  };
  const [modals, setModals] = useState(_defaultModal);
  const [choosePre, setChoosePre] = useState(false);
  const [userRole, setUserRole] = useState();
  const [role, setRole] = useState();
  const navigation = useNavigation();
  const [mobileNo, setMobileNo] = useState(
    dataCard?.type === `app`
      ? dataCard?.member_num === '0'
        ? dataCard?.caller_num.slice(-10)
        : dataCard?.member_num.slice(-10)
      : dataCard?.caller_num,
  );
  const wappUrl = `https://api.whatsapp.com/send?phone=+91${mobileNo}&text=`;
  const closeModalNew = () => {
    setDateFilter(false);
  };
  const getRole = async () => {
    const ans = await AsyncStorage.getItem('user_role');
    const ansRole = await AsyncStorage.getItem('role');
    setUserRole(ans);
    setRole(ansRole);
  };

  useEffect(() => {
    getRole();
  }, []);
  useEffect(() => {
    setBlankarea(1);
  }, []);
  const handleClickDialer = () => {
    if (
      user?.appcall_routing_did === null ||
      user?.appcall_routing_did === ''
    ) {
      setShowDilerAppRoute(true);
    }
  };

  const getCustomerName = useCallback(
    (number) => {
      const isContactDataIndex = contact?.list.findIndex((item) =>
        number.includes(item.contact_num_unmask),
      );
      if (isContactDataIndex > -1) {
        return contact.list[isContactDataIndex].contact_name;
      }
      return 'UNKNOWN';
    },
    [contact?.list],
  );

  const LoadList = () => {
    !callLogData.list &&
      dispatch(loadCallLogList(user?.authcode, filters, true));
  };
  const LoadListFilter = () => {
    dispatch(loadCallLogList(user?.authcode, filters, true));
  };

  const onFilterChange = (newFilter) => {
    const _temp = {
      ...newFilter,
      currentPage: 1,
      callresult: initCallResult[logStatus],
    };
    setBlankarea(1);
    setFilters(_temp);
    setDateReset(false);
  };

  const handleRefresh = () => {
    setBlankarea(1);
    setRefreshing(true);
    setIsLoadMore(false);
    setDateReset(true);
    dispatch(
      dateFilterObject({
        from: defaultDate,
        to: todayDate,
        type: `all`,
        logStatus: true,
        pageSize: filterObj.pageSize,
        currentPage: filterObj.currentPage,
      }),
    );
    dispatch(
      loadCallLogList(
        user?.authcode,
        {
          ...filterObj,
          callresult: initCallResult[logStatus],
        },
        true,
      ),
    ).then(() => {
      setRefreshing(false);
    });
  };
  const onSelect = (data, val) => {
    const filteredArray = contact?.list.filter(
      (contact) =>
        parseInt(contact?.contact_num, 10) ===
        parseInt(
          data.type === `app`
            ? data.member_num === '0'
              ? data.caller_num
              : data.member_num
            : data.caller_num,
          10,
        ),
    );

    setData(data);
    setContactFilterArr(filteredArray);
    setOpenCreateModal(val);
  };
  const copyFunc = (data) => {
    copyToClipboard(data);
  };
  const sendSmsCard = (data) => {
    sendSms(data);
  };
  const setDataCardFunc = async (getDataCard) => {
    await setDataCard(getDataCard);
  };
  const modalUpdate = async (data, getDataCard) => {
    await setDataCardFunc(getDataCard);
    setModals(data);
  };
  const callRouting = async (data) => {
    dispatch(clearRoutingList());
    dispatch(loadRoutingList(user?.authcode, data.sid_id));
    navigation.navigate('CallRouting', {
      sid_id: data.sid_id,
      type: data.type,
    });
  };
  const card = useCallback(
    ({ item, index }) => (
      <CallLogCard
        onSelect={onSelect}
        getCustomerName={getCustomerName}
        index={item.id}
        copyFunc={copyFunc}
        sendSmsCard={sendSmsCard}
        modalUpdate={modalUpdate}
        dialerOpen={dialerOpen}
        callRouting={callRouting}
        data={{ ...item, authcode: user?.authcode }}
      />
    ),
    [onSelect, getCustomerName, copyFunc, sendSmsCard, modalUpdate, dialerOpen, callRouting],
  );
  useEffect(() => {
    if (blackArea === 0) {
      console.log(`black`);
    } else {
      if (filters.currentPage === 1) {
        LoadListFilter();
      }
    }
  }, [filters]);
  useEffect(() => {
    setSelectedIndex(0);
  }, [dataCard]);
  const renderSkeletonLoaders = () => {
    if (refreshing || loading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <SkeletonLoaderComponent key={index} from="block" />
      ));
    }
    return null;
  };
  const onFilterChangeHome = (newFilter) => {
    const dateObjFrom = moment(newFilter?.from, 'YYYY-M-D');
    const dateObjTo = moment(newFilter?.to, 'YYYY-M-D');

    const fromSend = dateObjFrom.format('YYYY-MM-DD');
    const toSend = dateObjTo.format('YYYY-MM-DD');
    dispatch(
      dateFilterObject({
        from: fromSend,
        to: toSend,
        type: `custom`,
        log: filters,
      }),
    );
    !dateReset
      ? dispatch(
          dateFilterObject({
            from: fromSend,
            to: toSend,
            type: `custom`,
            log: filters,
          }),
        )
      : dispatch(
          dateFilterObject({ from: fromSend, to: toSend, type: `custom` }),
        );
    closeModalNew();
  };
  const closeModal = () => {
    setChoosePre(false);
    setMobileNo(dataCard?.caller_num);
    setModals({ ..._defaultModal });
  };
  const CreateEditContact = () => {
    return dataCard?.caller_num ? (
      <Editcontact
        from="list"
        data={dataCard}
        open={openCreateModal}
        onClose={() => {
          closeModalNew();
        }}
      />
    ) : (
      openCreateModal && (
        <CreateContact meta={{}} onClose={() => setOpenCreateModal(false)} />
      )
    );
  };
  const dialerOpen = async (data, role) => {
    if(selectedDialerMode===1){
    setShowDiler(true)
    }else if (
      user?.appcall_routing_did === null ||
      user?.appcall_routing_did === ''
    ) {
      setShowDilerAppRoute(true);
    } else {
      handleOpenKeypadDialer(
        dispatch,
        role,
        setShowDiler,
        user,
        data.type === `app`
          ? data.member_num === '0'
            ? data.caller_num.slice(-10)
            : data.member_num.slice(-10)
          : data.caller_num,
        'list',
      );
    }
  };

  const loadMore = () => {
    if (
      (logStatus === 'total' && callLogData.list.length < callLogData.total) ||
      (logStatus === 'answered' &&
        callLogData.list.length < callLogData.totalAnswer) ||
      (logStatus === 'missed' &&
        callLogData.list.length < callLogData.totalMissed) ||
      (logStatus === 'voice' &&
        callLogData.list.length < callLogData.totalVoicemail)
    ) {
      setIsLoadMore(true);
      const tempDateFilterObj = {
        ...filters,
        currentPage: filters.currentPage + 1,
      };
      setFilters(tempDateFilterObj);
      dispatch(loadCallLogList(user?.authcode, tempDateFilterObj, false, true));
    } else {
      setIsLoadMore(false);
    }
  };
  const renderFooter = () => {
    if (!isLodaMore) return null;
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          padding: rh(4),
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  const renderEmptpyFallBackUi=()=>{
    return(
      <View style={{ marginTop: rh(12), alignSelf: 'center' }}>
      <NoDataFound msg={logStatus} />
      </View>
    )
  }

  return (
    <>
      <CustomHeader title="Call Log"></CustomHeader>
      <View style={styles.container}>
        <CallLogFilter
          onFilterChange={onFilterChange}
          from={route.params.from}
          reset={refreshing}
        />
        <View style={{}}>
          <View style={{ marginVertical: rh(0.5) }}>
            <CallStatusFilterButton
              setDateFilter={setDateFilter}
              fromScreen={true}
              reset={dateReset}
              logFilter={filters}
            />
          </View>
          <View style={{ marginVertical: rh(1) }}>
            <DateFilterButtons
              setDateFilter={setDateFilter}
              fromScreen={true}
              reset={dateReset}
              logFilter={filters}
            />
          </View>
          <HomeFilter
            onFilterChange={onFilterChangeHome}
            onClose={() => {
              closeModalNew();
            }}
            reset={dateReset}
            visible={dateFilter}
          />
          {/* {callLogData.list.length > 0 && !loading && (
            <MySearch
              placeholder={SearchText}
              onChange={(data) => setfQuickSearch(data)}
            />
          )} */}
        </View>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            marginLeft: rw(2),
            marginTop: rh(1),
            marginRight: rh(2),
            alignItems: 'flex-end',
          }}
        >
          <Text>
            Total Logs:{' '}
            <Text style={{ color: colors.primary }}>
              {logStatus === 'total' &&
                `${callLogData.list.length}/${callLogData.total}`}
              {logStatus === 'answered' &&
                `${callLogData.list.length}/${callLogData.totalAnswer}`}
              {logStatus === 'missed' &&
                `${callLogData.list.length}/${callLogData.totalMissed}`}
              {logStatus === 'voice' &&
                `${callLogData.list.length}/${callLogData.totalVoicemail}`}
            </Text>
          </Text>
        </View>
        {!loading && (
          <>
            <FlatList
              data={callLogData.list}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              renderItem={card}
              ListEmptyComponent={renderEmptpyFallBackUi}
              contentContainerStyle={styles.containerFlash}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[colors.primary]}
                />
              }
              onEndReachedThreshold={0.1}
              removeClippedSubviews
              initialNumToRender={6}
              maxToRenderPerBatch={10}
              onEndReached={loadMore}
              ListFooterComponent={renderFooter}
            />
          </>
        )}
        {!isLodaMore && renderSkeletonLoaders()}
        {openCreateModal && (
          <Editcontactlog
            from="list"
            contactFilterArr={contactFilterArr}
            data={data}
            open={openCreateModal}
            onClose={() => {
              setOpenCreateModal(false);
            }}
          />
        )}
      </View>
      {
        <PreviewPayment
          from={`log`}
          data={dataCard}
          open={modals.paymentUpi}
          onClose={closeModal}
        />
      }

      {modals.businessAddress && (
        <PreviewBusinessAddress
          from={`log`}
          data={dataCard}
          open={modals.businessAddress}
          onClose={closeModal}
        />
      )}
      {modals.fileDownload && dataCard?.file && (
        <CallDownload
          data={dataCard}
          open={modals.fileDownload}
          onClose={closeModal}
        />
      )}
      <BlockUser data={dataCard} open={modals.blockUser} onClose={closeModal} />
      <ModalBottom
        height="24%"
        title={SendWhatsapp}
        open={modals.whatsapp}
        onClose={closeModal}
      >
        <View style={styles.sendLabelStyle}>
          <TouchableOpacity
            onPress={() =>
              setModals({ ..._defaultModal, whatsappConfirm: true })
            }
            style={styles.btn}
          >
            <Text style={styles.btnText}>{SendLabel}</Text>
          </TouchableOpacity>
        </View>
      </ModalBottom>
      <ModalMid
        // height="24%"
        title={ConfirmWA}
        open={modals.whatsappConfirm}
        onClose={closeModal}
      >
        <View style={styles.textBox}>
          <TextInputWithIcon
            defaultValue={
              dataCard?.type === `app`
                ? dataCard?.member_num === '0'
                  ? dataCard?.caller_num.slice(-10)
                  : dataCard?.member_num.slice(-10)
                : dataCard?.caller_num
            }
            inputMode={`number-pad`}
            onChangeText={(text) => setMobileNo(text)}
          ></TextInputWithIcon>
          <Pressable
            style={styles.btn}
            onPress={() =>
              navigateToLink(
                `https://api.whatsapp.com/send?phone=+91${
                  dataCard?.type === `app`
                    ? dataCard?.member_num === '0'
                      ? dataCard?.caller_num.slice(-10)
                      : dataCard?.member_num.slice(-10)
                    : dataCard?.caller_num
                }&text=`,
              )
            }
          >
            <Text style={styles.btnText}>{SendLabel}</Text>
          </Pressable>
        </View>
      </ModalMid>
      <ModalBottom
        height="40%"
        title={ChooseOption}
        open={modals.info}
        onClose={closeModal}
        hideTitle={choosePre}
      >
        <View style={styles.rowStyle}>
          {!choosePre && (
            <TouchableOpacity
              style={styles.chooseStyle}
              onPress={() =>
                setModals({ ..._defaultModal, whatsappConfirm: true })
              }
            >
              <WABiz size={20}></WABiz>
              <View style={styles.chooseTextStyle}>
                <MyText bold responsiveSize={1.9}>
                  {SendWhatsappInstant}
                </MyText>
                {/* <Text style={styles.textStyle}>{SendWhatsappTitle}</Text> */}
              </View>
            </TouchableOpacity>
          )}
          {!choosePre && (
            <TouchableOpacity
              style={styles.chooseStyle}
              // onPress={() => setModals({ ..._defaultModal, paymentUpi: true })}
              onPress={() => setChoosePre(!choosePre)}
            >
              <Money size={20}></Money>
              <View style={styles.chooseTextStyle}>
                <MyText bold responsiveSize={1.9}>
                  {SendPreConfigure}
                </MyText>
                {/* <Text style={styles.textStyle}>{SendWhatsappBizTitle}</Text> */}
              </View>
            </TouchableOpacity>
          )}
          {choosePre && (
            <TouchableOpacity
              style={[
                styles.chooseStyle,
                {
                  width: rw(95),
                  marginTop: rh(-2),
                  marginLeft: rw(1),
                  paddingVertical: rh(1),
                },
              ]}
              // onPress={() => setModals({ ..._defaultModal, paymentUpi: true })}
              onPress={() => setChoosePre(!choosePre)}
            >
              <IconGoBack size={20}></IconGoBack>
              <View style={styles.chooseTextStyle}>
                <MyText bold responsiveSize={1.9}>
                  Back
                </MyText>
                {/* <Text style={styles.textStyle}>{SendWhatsappBizTitle}</Text> */}
              </View>
            </TouchableOpacity>
          )}
          {choosePre && (
            <TouchableOpacity
              style={styles.chooseStyle}
              onPress={() => setModals({ ..._defaultModal, paymentUpi: true })}
            >
              <Money size={20}></Money>
              <View style={styles.chooseTextStyle}>
                <MyText bold responsiveSize={1.9}>
                  {SendWhatsappBiz}
                </MyText>
                <Text style={styles.textStyle}>{SendWhatsappBizTitle}</Text>
              </View>
            </TouchableOpacity>
          )}
          {choosePre && (
            <TouchableOpacity
              style={styles.chooseStyle}
              onPress={() =>
                setModals({ ..._defaultModal, businessAddress: true })
              }
              activeOpacity={0.6}
            >
              <IconLocation color={colors.warning} size={rw(6)} />
              <View style={styles.chooseTextStyle}>
                <MyText bold responsiveSize={1.9}>
                  {SendWhatsappLocation}
                </MyText>
                <Text style={styles.textStyle}>
                  {SendWhatsappLocationTitle}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ModalBottom>
      <NoPermissionModal showDiler={showDiler} setShowDiler={setShowDiler} dialerMode={selectedDialerMode}/>
      <NoAppRoutingModal
        showDiler={showDilerAppRoute}
        setShowDiler={setShowDilerAppRoute}
      />
    </>
  );
};

export default CallLogList;

const styles = StyleSheet.create({
  btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: rh(1),
    paddingVertical: rh(1),
    width: rw(85),
  },
  btnText: { color: colors.white, fontWeight: `700`, textAlign: `center` },
  chooseStyle: {
    alignItems: `center`,
    flexDirection: `row`,
    marginHorizontal: rw(5),
  },
  chooseTextStyle: {
    marginHorizontal: rw(2),
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    // paddingHorizontal: rw(2),
  },
  containerFlash: { paddingBottom: rh(1), paddingHorizontal: rw(2) },
  rowStyle: {
    gap: 10,
    marginVertical: rh(2),
  },
  sendLabelStyle: { alignItems: 'center', gap: 10, justifyContent: 'center' },
  textBox: { alignItems: 'center', justifyContent: 'center' },
  textStyle: {
    fontSize: rf(1.5),
  },
});

CallLogList.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      from: PropTypes.string,
    }),
  }),
};
