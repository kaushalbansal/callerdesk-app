import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, SafeAreaView, Dimensions, RefreshControl, Pressable } from 'react-native';
import { TotalCallIcon } from '../../../common/icons/totalcallicon';
import { AnsweredCallsIcon } from '../../../common/icons/answeredcallsicon';
import { IconMissed } from '../../../common/icons/iconmissedcall';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { colors } from '../../../themes/vars';
import CustomHeader from '../../../common/components/CustomHeader';
import SimCallLogCard from '../../../common/components/SimCallLogCard';
import { buildCustomRange, copyToClipboard, getLastNDaysRange, getTodayRange, getYesterdayRange, makePhoneCall, navigateToLink, normalizePhoneNumber, sendSms } from '../../../common/helpers/utils';
import { ChooseOption, ConfirmWA, FilterLabel, SendLabel, SendPreConfigure, SendWhatsappBiz, SendWhatsappBizTitle, SendWhatsappInstant, SendWhatsappLocation, SendWhatsappLocationTitle, SubmitText, } from '../../../common/Constants';
import MyText from '../../../common/components/MyText';
import ModalBottom from '../../../common/components/ModalBottom';
import { WABiz } from '../../../common/icons/wabiz';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSimCallLogCount, getSimCallLog, setSimCallLogFilters } from '../../../common/redux/actions/callLog';
import { SkeletonLoaderComponent } from '../../../common/helpers/skeletonLoader';
import { IconCalenderHome } from '../../../common/icons/iconcalenderhome';
import { IconClose } from '../../../common/icons/iconclose';
import { Button, Datepicker, Text as Text2 } from '@ui-kitten/components';
import { IconCalendar } from '../../../common/icons/iconcalendar';
import moment from 'moment';
import { NoDataFound } from '../../../common/components/NoDataFound';
import SimLogEditContact from './SimLogEditContact';
import PreviewPayment from '../CallLog/Preview/PreviewPayment';
import PreviewBusinessAddress from '../CallLog/Preview/PreviwBusinessAddress';
import ModalMid from '../../../common/components/ModalMid';
import TextInputWithIcon from '../../../common/components/textinputwithicon';
import { IconGoBack } from '../../../common/icons/goback';
import { Money } from '../../../common/icons/money';
import { IconLocation } from '../../../common/icons/wlocation';

const PAGE_SIZE = 10;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes (tuneable)
const SKELETON_COUNT = 6;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const _defaultModal = {
  paymentUpi: false,
  businessAddress: false,
  info: false,
  whatsappConfirm: false,
};

export default function SimCallLog({ navigation }) {

  const { simCallLogData, simCallLogMeta } = useSelector((state) => state.callLog)
  const filters = useSelector(s => s.callLog?.simCallLogFilters)
  const contact = useSelector((state) => state.contact);
  const dispatch = useDispatch()

  const [page, setPage] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modals, setModals] = useState(_defaultModal);
  const [choosePre, setChoosePre] = useState(false);


  const [selectedNumber, setSelectedNumber] = useState('')
  const [selectedLog, setSelectedLog] = useState(null)
  const [openCalendarModal, setOpenCalendarModal] = useState(false)
  const [openContactModal, setOpenContactModal] = useState(false)
  const [contactFilterArr, setContactFilterArr] = useState([])
  const [customDate, setCustomDate] = useState({ from: filters.from, to: filters.to })


  const inFlightRef = useRef(false);
  const momentumRef = useRef(false);


  // Utility to fetch a page (reads filters from argument)
  const fetchPageWithFilters = useCallback(async (pageNumber, filterObj, opts = {}) => {
    if (inFlightRef.current) return null;
    inFlightRef.current = true;
    // if (opts.reset) setPageLoading(true);
    try {
      const entries = await dispatch(getSimCallLog({
        pageNumber,
        status: filterObj.status,
        from: filterObj.from,
        to: filterObj.to,
        reset: opts.reset
      }));
      inFlightRef.current = false;
      return entries;
    } catch (e) {
      inFlightRef.current = false;
      console.error('fetchPageWithFilters error', e);
      return [];
    } finally {
      // if (opts.reset) setPageLoading(false);
    }
  }, [dispatch]);

  // When filters change in Redux, reload page 0 exactly once
  // useEffect(() => {
  //   let mounted = true;
  //   (async () => {
  //     setInitialLoading(true);
  //     setHasMore(true);
  //     setPage(0);

  //     // If filters.from/to are null, set defaults (30 days)
  //     const now = Date.now();
  //     const from = filters.from || (now - 30 * 24 * 3600 * 1000);
  //     const to = filters.to || now;
  //     const appliedFilters = { ...filters, from, to };

  //     // fetch page 0 and replace list (reset:true)
  //     const entries = await fetchPageWithFilters(0, appliedFilters, { reset: true });
  //     if (!mounted) return;
  //     setInitialLoading(false);
  //     setPage(entries.length === PAGE_SIZE ? 1 : 1);
  //     setHasMore(entries.length === PAGE_SIZE);
  //   })();
  //   return () => { mounted = false; };
  // }, [filters.status, filters.from, filters.to, filters.rangeKey]);

  const filtersEqual = (a, b) => {
    if (!a || !b) return false;
    return a.status === b.status && a.from === b.from && a.to === b.to && a.rangeKey === b.rangeKey;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      // meta from redux
      const meta = simCallLogMeta || {};
      const cachedFilters = meta.lastFilters || null;
      const now = Date.now();
      const isStale = (now - (meta.lastFetchedAt || 0)) > CACHE_TTL;

      // If we have cached data for exact filters and still fresh -> reuse it.
      if (
        Array.isArray(simCallLogData) &&
        simCallLogData.length > 0 &&
        cachedFilters &&
        filtersEqual(cachedFilters, filters) &&
        !isStale
      ) {
        // reuse cached data — no big loader
        setInitialLoading(false);
        setPage(meta.nextPage || Math.ceil(simCallLogData.length / PAGE_SIZE));
        setHasMore(!meta.isFullyLoaded);
        return;
      }

      // Otherwise do the full reset fetch
      setInitialLoading(true);
      setHasMore(true);
      setPage(0);


      const entries = await fetchPageWithFilters(0, filters, { reset: true });
      if (!mounted) return;
      setInitialLoading(false);
      setPage(Array.isArray(entries) && entries.length === PAGE_SIZE ? 1 : 1);
      setHasMore(Array.isArray(entries) && entries.length === PAGE_SIZE);

    })();

    return () => { mounted = false; };
  }, [filters.status, filters.from, filters.to, filters.rangeKey]);



  useEffect(() => {
    setCustomDate({ from: filters.from, to: filters.to })
  }, [filters.from, filters.to,]);


  useEffect(() => {
    let mounted = true;
    (async () => {
      // ensure filters.from/to have defaults
      const now = Date.now();
      const from = filters.from || (now - 30 * 24 * 3600 * 1000);
      const to = filters.to || now;

      const count = await dispatch(fetchSimCallLogCount({ status: filters.status, from, to }));
      if (!mounted) return;
      // no extra setState required; action stored it in simCallLogMeta
    })();

    return () => { mounted = false; };
  }, [filters.status, filters.from, filters.to, filters.rangeKey]);


  const renderedCount = useMemo(() => {
    return Array.isArray(simCallLogData) ? simCallLogData.length : 0;
  }, [simCallLogData?.length]);

  const totalCount = useMemo(() => {
    return (simCallLogMeta && typeof simCallLogMeta.totalCount === 'number')
      ? simCallLogMeta.totalCount
      : null;
  }, [simCallLogMeta?.totalCount]);


  const renderEmptpyFallBackUi = () => {
    return (
      <View style={{ marginTop: rh(12), alignSelf: 'center' }}>
        <NoDataFound msg={filters.status} />
      </View>
    )
  }

  // Refresh - reset filters to defaults in Redux (single dispatch) — this triggers effect above
  const onRefresh = async () => {
    setRefreshing(true);
    const now = Date.now();
    const fromDefault = now - 30 * 24 * 3600 * 1000;
    dispatch(setSimCallLogFilters({ status: 'total', from: fromDefault, to: now, rangeKey: '30' }));
    setRefreshing(false);
  };

  const isRangeActive = (key) => filters.rangeKey === key;

  const onSelectDateRange = (key) => {
    let { from, to } = (key === 'today') ? getTodayRange()
      : (key === 'yday') ? getYesterdayRange()
        : (key === '7') ? getLastNDaysRange(7)
          : getLastNDaysRange(30);

    dispatch(setSimCallLogFilters({ status: filters.status, from, to, rangeKey: key }));
  };

  const handleEndReached = async () => {
    console.log('calling on end==>')
    // don't run if initial loading or already loading/paging or no more
    if (initialLoading || pageLoading || !hasMore) return;
    // require momentum to avoid spurious triggers
    if (!momentumRef.current) return;
    // reset momentum guard
    momentumRef.current = false;

    setPageLoading(true);
    try {
      const entries = await fetchPageWithFilters(page, filters, { reset: false }); // page holds next page index
      if (Array.isArray(entries)) {
        // increment page only if fetch succeeded
        setPage(p => p + 1);
        setHasMore(entries.length === PAGE_SIZE);
      } else {
        // fallback: increment page
        setPage(p => p + 1);
      }
    } catch (err) {
      console.error('handleEndReached error', err);
    } finally {
      setPageLoading(false);
    }
  };




  const onLogStatusChange = (statusKey) => {
    // do not change date; only status
    dispatch(setSimCallLogFilters({ status: statusKey, from: filters.from, to: filters.to, rangeKey: filters.rangeKey }));

  }

  const onCustomDateSubmit = () => {
    // let fromTs=moment(customDate.from).startOf('day').valueOf()
    // let toTs=moment(customDate.to).endOf('day').valueOf()

    // const fromUtc = moment.utc('2025-08-10').startOf('day').valueOf(); // 2025-08-10T00:00:00Z in ms
    // const toUtc   = moment.utc('2025-08-10').endOf('day').valueOf();  


    const range = buildCustomRange(customDate.from, customDate.to)
    console.log(range.from, range.to);
    dispatch(setSimCallLogFilters({ ...filters, from: range.from, to: range.to, rangeKey: range.rangeKey }));
    setOpenCalendarModal(false)
  }

  const renderStatusRow = () => {
    return (
      <View style={styles.statusRow}>
        <TouchableOpacity
          style={[
            styles.statusStyle,
            filters.status === 'total' && styles.activeStatusStyle
          ]}
          onPress={() => onLogStatusChange(`total`)}
        >
          <TotalCallIcon size={rw(10)} color={colors.grey} />
          <Text style={styles.activeText}>Total Calls</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.statusStyle,
            filters.status === "answered" && styles.activeStatusStyle
          ]}
          onPress={() => onLogStatusChange('answered')}
        >
          <AnsweredCallsIcon size={rw(10)} color={colors.green} />
          <Text style={styles.activeText}>Answered</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.statusStyle,
            filters.status === "missed" && styles.activeStatusStyle
          ]}
          onPress={() => onLogStatusChange('missed')}
        >
          <IconMissed size={rw(10)} />
          <Text style={styles.activeText}>Missed</Text>
        </TouchableOpacity>
      </View>


    )
  }


  // Render functions (date buttons use rangeKey to mark active)
  const renderDateFilterRow = () => (
    <View style={styles.dateRow}>
      <TouchableOpacity style={[styles.dateBtn, isRangeActive('today') && styles.dateBtnActive]} onPress={() => onSelectDateRange('today')}>
        <Text style={[styles.dateBtnText, isRangeActive('today') && styles.activeDateBtnText]}>Today</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.dateBtn, isRangeActive('yday') && styles.dateBtnActive]} onPress={() => onSelectDateRange('yday')}>
        <Text style={[styles.dateBtnText, isRangeActive('yday') && styles.activeDateBtnText]}>Y'Day</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.dateBtn, isRangeActive('7') && styles.dateBtnActive]} onPress={() => onSelectDateRange('7')}>
        <Text style={[styles.dateBtnText, isRangeActive('7') && styles.activeDateBtnText]}>7 Days</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.dateBtn, isRangeActive('30') && styles.dateBtnActive]} onPress={() => onSelectDateRange('30')}>
        <Text style={[styles.dateBtnText, isRangeActive('30') && styles.activeDateBtnText]}>30 Days</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.calendarBtn} onPress={() => setOpenCalendarModal(true)}>
        <IconCalenderHome />
      </TouchableOpacity>
    </View>
  );

  const renderCountContainer = () => {
    return (
      <View style={styles.countContainer}>
        <Text>
          Total Logs: <Text style={{ color: colors.primary }}>{renderedCount}{totalCount != null ? '/' + totalCount : ''}</Text>
        </Text>
      </View>
    )
  }


  const handleOpenContactModal = (log) => {
    console.log(log, 'number')
    const normalNumber = normalizePhoneNumber(log.number)
    console.log(contact?.list, 'contact list')
    const filteredArray = contact?.list.filter(
      (contact) =>
        contact?.contact_num === normalNumber
    );

    setSelectedLog(log);
    setContactFilterArr(filteredArray);
    setOpenContactModal(true);
  };

  const handleCloseContactModal = () => {
    setOpenContactModal(false);
    setSelectedLog(null);
    setContactFilterArr([]);
  }


  // small memoized counts
  const answered = useMemo(() => simCallLogData.filter(l => l.type === 1).length, [simCallLogData]);
  const missed = useMemo(() => simCallLogData.filter(l => l.type === 3).length, [simCallLogData]);



  const copyFunc = (data) => {
    copyToClipboard(data)
  }

  const sendSmsCard = (number, message) => {
    sendSms(number, message)
  }

  const openCallDialer = (phoneNumber) => {
    makePhoneCall(phoneNumber)
  }

  const handleOpenWhtsappModal = async (modal, log) => {
    await setSelectedLog(log);
    setSelectedNumber(log.number)
    setModals(modal);
  };

  const handleSendWhtMes = () => {
    navigateToLink(
      `https://api.whatsapp.com/send?phone=${selectedNumber}&text=`,
    )
  }

  const handleCloseWhatsappModal = () => {
    setChoosePre(false);
    setSelectedNumber('');
    setModals({ ..._defaultModal });
  };

  

  const renderWhatsappPreviewPaymentModal = () => {
    return (
      <PreviewPayment
        from={'SimLog'}
        data={selectedLog}
        open={modals.paymentUpi}
        onClose={handleCloseWhatsappModal}
      />
    )
  }

  const renderPreviewBusinessModal = () => {
    return (
      <PreviewBusinessAddress
        from={`SimLog`}
        data={selectedLog}
        open={modals.businessAddress}
        onClose={handleCloseWhatsappModal}
      />
    )
  }

  const renderWhatsappConfirmModal=()=>{
    return (
       <ModalMid
              // height="24%"
              title={ConfirmWA}
              open={modals.whatsappConfirm}
              onClose={handleCloseWhatsappModal}
            >
              <View style={styles.textBox}>
                <TextInputWithIcon
                  defaultValue={selectedNumber}
                  inputMode={`number-pad`}
                  onChangeText={(text) => setSelectedNumber(text)}
                ></TextInputWithIcon>
                <Pressable
                  style={styles.btn}
                  onPress={handleSendWhtMes}
                >
                  <Text style={styles.btnText}>{SendLabel}</Text>
                </Pressable>
              </View>
            </ModalMid>
    )
  }

  const renderWhatsappModal=()=>{
    return(
      <ModalBottom
              height="40%"
              title={ChooseOption}
              open={modals.info}
              onClose={handleCloseWhatsappModal}
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
                    </View>
                  </TouchableOpacity>
                )}
                {!choosePre && (
                  <TouchableOpacity
                    style={styles.chooseStyle}
                    onPress={() => setChoosePre(!choosePre)}
                  >
                    <Money size={20}></Money>
                    <View style={styles.chooseTextStyle}>
                      <MyText bold responsiveSize={1.9}>
                        {SendPreConfigure}
                      </MyText>
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
                    onPress={() => setChoosePre(!choosePre)}
                  >
                    <IconGoBack size={20}></IconGoBack>
                    <View style={styles.chooseTextStyle}>
                      <MyText bold responsiveSize={1.9}>
                        Back
                      </MyText>
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
    )
  }


  const renderCalendarModal = () => {
    return (
      <ModalBottom animationType="slide" onClose={() => setOpenCalendarModal(false)} open={openCalendarModal}>
        <View style={styles.calendarModalContainer}>
          <View style={styles.title}>
            <Text2 category="h5">{FilterLabel}</Text2>
            <TouchableOpacity onPress={() => setOpenCalendarModal(false)}>
              <View style={styles.close}>
                <IconClose />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Text2 style={[styles.label, { marginTop: rh(2) }]}>
              SELECT DATE RANGE
            </Text2>
            <View style={styles.selectDate}>
              <Datepicker
                date={new Date(customDate.from)}
                style={styles.datePick}
                accessoryRight={<IconCalendar />}
                placement={'top start'}
                onSelect={(date) => {
                  if (customDate.to && date > customDate.to) {
                    setCustomDate({ from: date, to: date })
                  } else {
                    setCustomDate({ ...customDate, from: date })
                  }
                }}
                max={new Date()}
              />
              <Datepicker
                date={new Date(customDate.to)}
                style={styles.datePick}
                min={new Date(customDate.from)}
                accessoryRight={<IconCalendar />}
                onSelect={(date) => setCustomDate({ ...customDate, to: date })}
                placement={'top end'}
                max={new Date()}
              />
            </View>
            <Button
              onPress={onCustomDateSubmit}
              style={{ marginTop: rh(4), width: rw(85) }}
            >
              {SubmitText}
            </Button>
          </View>
        </View>
      </ModalBottom>
    )
  }

  const renderContactModal = () => {
    return (

      <SimLogEditContact
        contactFilterArr={contactFilterArr}
        data={selectedLog}
        open={openContactModal}
        onClose={handleCloseContactModal}
      />

    )

  }

  // Skeleton Component
  const SkeletonList = React.memo(() => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <SkeletonLoaderComponent key={`skeleton-${index}`} />
      ))}
    </View>
  ));

  const renderSimCallLogList = () => {
    return (
      <FlatList
        data={simCallLogData}
        keyExtractor={(_, i) => i.toString()}
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <SimCallLogCard entry={item}
          copyFunc={copyFunc}
          sendSmsCard={sendSmsCard}
          openDialer={openCallDialer}
          openWhatsapp={handleOpenWhtsappModal}
          openContact={handleOpenContactModal} />}
        onEndReached={handleEndReached}
        ListEmptyComponent={renderEmptpyFallBackUi}
        showsVerticalScrollIndicator
        onEndReachedThreshold={0.4}
        onMomentumScrollBegin={() => { momentumRef.current = true; }}
        ListFooterComponent={pageLoading ? <ActivityIndicator style={styles.footerLoader} color={colors.primary} /> : null}
        removeClippedSubviews={false}
        // initialNumToRender={10}
        // maxToRenderPerBatch={10}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      // windowSize={21}
      />
    )
  }

  return (

    <SafeAreaView style={styles.container}>
      <CustomHeader title='SIM Call Log' />
      {renderStatusRow()}
      {renderDateFilterRow()}
      {!initialLoading && renderCountContainer()}
      {initialLoading && <SkeletonList />}
      {!initialLoading && renderSimCallLogList()}
      {modals.info && renderWhatsappModal()}
      {renderCalendarModal()}
      {openContactModal && renderContactModal()}
      {modals.whatsappConfirm && renderWhatsappConfirmModal()}
      {modals.businessAddress && renderPreviewBusinessModal()}
      {modals.paymentUpi && renderWhatsappPreviewPaymentModal()}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white, paddingTop: 0 },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // padding:16, 
    // borderBottomWidth:1,
    //  borderColor:'#ddd' 
  },
  statusItem: { alignItems: 'center' },

  listContent: { paddingBottom: rh(4) },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, marginBottom: 12, backgroundColor: '#f9f9f9', borderRadius: 8 },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ddd', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  name: { fontSize: 16, fontWeight: 'bold' },
  details: { fontSize: 12, color: '#666', marginTop: 4, },
  duration: { fontSize: 14, color: '#333' },
  statusStyle: {
    alignContent: `center`,
    alignItems: `center`,
    justifyContent: `center`,
    paddingBottom: rh(1),
    width: rw(25),
  },
  activeStatusStyle: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(238, 9, 64, 1)'
  },
  activeText: {
    color: colors.black,
    fontSize: rf(1.2),
    fontWeight: `600`,
    paddingTop: rh(1),
    textAlign: `center`,
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowStyle: {
    gap: 10,
    marginVertical: rh(2),
  },
  chooseStyle: {
    alignItems: `center`,
    flexDirection: `row`,
    marginHorizontal: rw(5),
  },
  chooseTextStyle: {
    marginHorizontal: rw(2),
  },
  footerLoader: {
    marginVertical: rh(1.5)
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rw(4),
    marginVertical: rh(1.5),
  },
  countContainer: {
    alignSelf: 'flex-end',
    paddingRight: rw(4),
    marginTop: rh(0.5)
  },
  dateBtn: {
    borderWidth: 1,
    borderColor: colors.grey,
    paddingVertical: rh(0.6),
    paddingHorizontal: rw(4),
    borderRadius: 5,
    marginRight: rw(2),
    backgroundColor: colors.white
  },
  dateBtnActive: {
    backgroundColor: '#333333',
    borderColor: '#222',
  },
  dateBtnText: {
    fontSize: rf(1.5),
    color: colors.black
  },
  activeDateBtnText: {
    color: colors.white
  },
  calendarBtn: {
    width: rw(12),
    // height: rw(10),
    // paddingVertical: rh(0.8),
    marginLeft: rw(1.5),
    borderRadius: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
    // backgroundColor: '#ff2d6b' 
  },
  close: {
    alignItems: 'center',
    borderRadius: rw(6),
    height: rw(6),
    justifyContent: 'center',
    marginRight: -8,
    width: rw(8),
  },
  calendarModalContainer: {
    backgroundColor: colors.white,
    // padding: 20,
    width: rw(100),
  },
  content: {
    paddingVertical: rh(1),
  },
  datePick: { borderRadius: 8, width: rw(42) },
  label: {
    color: `#656565`,
    fontSize: rf(1.7),
    fontWeight: `700`,
    marginBottom: rh(0.7),
  },
  selectDate: {
    flexDirection: 'row',
    gap: 12,
    marginTop: rh(1),
  },
  title: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
textBox: { alignItems: 'center', justifyContent: 'center' },
 btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: rh(1),
    paddingVertical: rh(1),
    width: rw(85),
  },
   btnText: { color: colors.white, fontWeight: `700`, textAlign: `center` },
  textStyle: {
    fontSize: rf(1.5),
  },
});