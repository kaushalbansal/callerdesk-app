import React, { useState, useCallback, useRef } from 'react';
import {
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import { IndexPath } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { NoDataFound } from '../../../common/components/NoDataFound';
import { colors } from '../../../themes/vars';
import ContactListCard from './ContactListCard';
import {
  contactDetailsScreen,
  deleteContact,
  loadContactList,
} from '../../../common/redux/actions/contact';
import ContactFilter from './ContactFilter';
import {
  ContactfilterObjHome,
  CreateContactLabel,
  DeleteAlertContact,
  DeleteLabel,
  defaultDate,
  todayDate,
} from '../../../common/Constants';
import ContactHeader from './ContactHeader';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import ModalBottom from '../../../common/components/ModalBottom';
import CreateContact from './CreateContact';
import Editcontact from '../CallLog/EditContact';
import { IconPlusCircle } from '../../../common/icons/iconplusround';
import { SkeletonLoaderComponent } from '../../../common/helpers/skeletonLoader';
import PropTypes from 'prop-types';
import moment from 'moment';
import { dateFilterObject } from '../../../common/redux/actions/common';
import DateFilterButtons from '../DateFiltersButton';
import HomeFilter from '../HomeFilter';
import { loadCallLogStatusSuccess } from '../../../common/redux/actions/callLog';

const ContactList = ({ route }) => {
  // eslint-disable-next-line no-unused-vars
  const [quickSearch, setfQuickSearch] = useState('');
  const [filters, setFilters] = useState({
    ...ContactfilterObjHome,
    status: new IndexPath(0),
  });
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.global);
  const contact = useSelector((state) => state.contact);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [contactData, setContactData] = useState(``);
  const [deleteModal, setDeleteModal] = useState(false);
  const [contactDataDelete, setContactDataDelete] = useState(``);
  const [dateFilter, setDateFilter] = useState(false);
  const [dateReset, setDateReset] = useState(false);

  // Refs to prevent multiple calls
  const isLoadingMoreRef = useRef(false);
  const isFilterLoadingRef = useRef(false);
  const onEndReachedCalledDuringMomentum = useRef(true);

  // useEffect(() => {
  //   !contact?.list&&dispatch(loadContactList(user.authcode, filters, true));
  // }, []);

  const closeModalNew = () => {
    setDateFilter(false);
  };

  const onFilterChange = useCallback((newFilter) => {
    if (isFilterLoadingRef.current) return;
    
    console.log(`newFilter`, newFilter);
    const dateObjFrom = moment(newFilter?.from, 'YYYY-M-D');
    const dateObjTo = moment(newFilter?.to, 'YYYY-M-D');

    const fromSend = dateObjFrom.format('YYYY-MM-DD');
    const toSend = dateObjTo.format('YYYY-MM-DD');
    const filterSend = { 
      ...newFilter, 
      from: fromSend, 
      to: toSend,
      currentPage: 1 // Reset to first page on filter change
    };
    
    setDateReset(false);
    setFilters(filterSend);
    setIsFilterLoading(true);
    isFilterLoadingRef.current = true;
    
    dispatch(loadContactList(user?.authcode, filterSend, true))
      .finally(() => {
        setIsFilterLoading(false);
        isFilterLoadingRef.current = false;
      });
  }, [user?.authcode, dispatch]);

  const loadMore = useCallback(() => {
    if (isLoadingMoreRef.current || !contact?.list || contact?.list?.length >= contact?.total) {
      return;
    }

    const nextPage = filters.currentPage + 1;
    const tempDateFilterObj = {
      ...filters,
      currentPage: nextPage,
    };

    setIsLoadingMore(true);
    isLoadingMoreRef.current = true;
    
    
    
    console.log('Loading more - Page:', nextPage, 'Current total:', contact?.list?.length);
    
    dispatch(loadContactList(user?.authcode, tempDateFilterObj, false, true))
      .then(()=>{
        setFilters(prev=>({...prev, currentPage: nextPage}))
      })
      .finally(() => {
        setIsLoadingMore(false);
        isLoadingMoreRef.current = false;
      });

  }, [contact?.list, contact?.total, filters, user?.authcode, dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setDateReset(true);
    dispatch(loadCallLogStatusSuccess({ logStatus: `total` }));
    dispatch(
      dateFilterObject({ from: defaultDate, to: todayDate, type: `all` }),
    );
    
    const resetFilters = {
      ...ContactfilterObjHome,
      status: new IndexPath(0),
      currentPage: 1,
    };
    
    setFilters(resetFilters);
    dispatch(
      loadContactList(
        user?.authcode,
        resetFilters,
        true,
        false,
      ),
    ).finally(() => setRefreshing(false));
  }, [user?.authcode, dispatch]);

  const onDelete = useCallback((item, modalView) => {
    setDeleteModal(modalView);
    saveData(item);
  }, []);

  const handleNav = useCallback(item => {
  dispatch(contactDetailsScreen(item));
  navigation.navigate('ContactDetail');
}, [dispatch, navigation]);
  
  const saveData = (item) => {
    setContactDataDelete(item);
  };
  
  const card = useCallback(({ item, index }) => {
    return (
      <>
        <ContactListCard
          onSelect={onSelect}
          key={item.contact_id}
          data={item}
          onDelete={onDelete}
          navFunction={handleNav}
        />
      </>
    );
  }, [onSelect, onDelete, handleNav]);
  
  const onSelect = useCallback((item, modalView) => {
    setOpenEditModal(modalView);
    addData(item);
  }, []);
  
  const addData = (item) => {
    setContactData(item);
  };
  
  const renderSkeletonLoaders = () => {
    if ((refreshing || loading) && (!contact?.list || contact?.list?.length === 0)) {
      return Array.from({ length: 5 }).map((_, index) => (
        <SkeletonLoaderComponent key={index} />
      ));
    }
    return null;
  };
  
  const onFilterChangeHome = useCallback((newFilter) => {
    if (isFilterLoadingRef.current) return;
    
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
        contactFilter: filters,
      }),
    );
    
    !dateReset
      ? dispatch(
          dateFilterObject({
            from: fromSend,
            to: toSend,
            type: `custom`,
            contactFilter: filters,
          }),
        )
      : dispatch(
          dateFilterObject({ from: fromSend, to: toSend, type: `custom` }),
        );

    closeModalNew();
  }, [dispatch, filters, dateReset]);
  
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View
        style={{
          padding: rh(4),
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  };

  const handleEndReached = useCallback(() => {
    if (!isLoadingMore && contact?.list?.length < contact?.total) {
      loadMore();
    }
  }, [isLoadingMore, contact?.list?.length, contact?.total, loadMore]);

  return (
    <>
      <ContactHeader title="Contact List" meta={filters} hideUserIcon={true} />
      <View style={styles.container}>
        <ContactFilter onFilterChange={onFilterChange} reset={refreshing} />
        {/* {contact?.list?.length > 0 && !loading && (
          <MySearch
            placeholder="Search contacts"
            mb={8}
            onChange={(value) => setfQuickSearch(value)}
          />
        )} */}
        <HomeFilter
          onFilterChange={onFilterChangeHome}
          onClose={() => {
            closeModalNew();
          }}
          visible={dateFilter}
        />
        <View style={{ marginVertical: rh(1) }}>
          <DateFilterButtons
            setDateFilter={setDateFilter}
            logFilter={filters}
            fromContact={true}
            reset={dateReset}
          />
        </View>
        <View
          style={{
            marginLeft: rw(2),
            marginTop: rh(1),
            marginRight: rh(2),
            alignItems: 'flex-end',
          }}
        >
          <Text>
            Total Contacts:{' '}
            <Text style={{ color: colors.primary }}>
              {`${contact?.list?.length || 0}/${contact?.total || 0}`}
            </Text>
          </Text>
        </View>
        {contact?.list?.length >= 0 && (
          <FlatList
            contentContainerStyle={contact?.list.length!==0? {paddingBottom: rh(2.5)}:null}
            data={contact?.list}
            keyExtractor={(item, index) => `${item.contact_id}_${index}`}
            renderItem={card}
            ListEmptyComponent={
              contact?.list?.length === 0 &&
              !loading && 
              !isFilterLoading && (
                <View style={{ marginTop: rh(20), alignSelf: 'center' }}>
                  <NoDataFound msg={`no-contacts`} />
                </View>
              )
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
              />
            }
            onMomentumScrollBegin={() => { 
               onEndReachedCalledDuringMomentum.current = false; 
            }}
            onEndReachedThreshold={0.1}
            removeClippedSubviews
            windowSize={21}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            onEndReached={({ distanceFromEnd }) => {
              if (!onEndReachedCalledDuringMomentum.current) {
                   
                    handleEndReached()
                    onEndReachedCalledDuringMomentum.current = true;
                  }
               }}
            ListFooterComponent={renderFooter}
          />
        )}
        {!isLoadingMore && renderSkeletonLoaders()}
        <ModalBottom
          open={openCreateModal}
          title={CreateContactLabel}
          onClose={() => setOpenCreateModal(false)}
        >
          <CreateContact
            meta={{}}
            onClose={() => setOpenCreateModal(false)}
            loadData={() => {
              dispatch(loadContactList(user?.authcode, filters, true));
            }}
          />
        </ModalBottom>
        <ModalBottom
          height="26%"
          title={DeleteLabel}
          from="group"
          open={deleteModal}
          onClose={() => {
            setDeleteModal(false);
            setContactDataDelete(``);
          }}
        >
          <Text
            style={{
              color: colors.primary,
              textAlign: `center`,
              marginTop: rh(2),
            }}
          >
            {DeleteAlertContact}
          </Text>
          <View style={{ flexDirection: `row`, marginVertical: rh(2) }}>
            <TouchableOpacity
              style={styles.noButton}
              onPress={() => {
                setDeleteModal(false);
                setContactDataDelete(``);
              }}
            >
              <Text style={{ fontSize: rf(2), color: colors.primary }}>NO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.yesButton}
              onPress={() => {
                dispatch(
                  deleteContact(
                    user?.authcode,
                    contactDataDelete.contact_num,
                    filters,
                  ),
                );
                setDeleteModal(false);
              }}
            >
              <Text style={{ fontSize: rf(2), color: colors.white }}>YES</Text>
            </TouchableOpacity>
          </View>
        </ModalBottom>
        {openEditModal && (
          <Editcontact
            from={`list`}
            data={contactData}
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
            }}
          />
        )}
        <View style={styles.fab}>
          <TouchableOpacity onPress={() => setOpenCreateModal(true)}>
            <IconPlusCircle />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
export default ContactList;

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, flex: 1 },
  fab: {
    bottom: 0,
    elevation: 100,
    marginBottom: rh(1),
    marginRight: rw(5),
    position: 'absolute',
    right: rw(2),
  },
  noButton: {
    alignItems: `center`,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    paddingVertical: rh(0.7),
  },
  yesButton: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    marginLeft: rw(5),
    paddingVertical: rh(0.7),
  },
});
ContactList.propTypes = {
  route: PropTypes.object,
};
