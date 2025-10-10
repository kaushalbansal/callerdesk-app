import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native';
import { colors } from '../../../themes/vars';
import CallHistoryCard from './CallHistoryCard';
import { NoDataFound } from '../../../common/components/NoDataFound';
import CustomHeader from '../../../common/components/CustomHeader';
import { loadCallHistory } from '../../../common/redux/actions/contact';
import PropTypes from 'prop-types';

const CallHistory = ({ route }) => {
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.global);
  const contact = useSelector((state) => state.contactHistory);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(loadCallHistory(user?.authcode, route.params.caller));
  }, [dispatch, user?.authcode, route.params.caller]);
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(loadCallHistory(user?.authcode, route.params.caller)).then(() => {
      setRefreshing(false);
    });
  };
  const card = useCallback(({ item }) => <CallHistoryCard data={item} />, []);
  return (
    <>
      <CustomHeader title="Call History"></CustomHeader>
      <View style={styles.container}>
        {!loading && (
          <FlatList
            data={contact?.list}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={card}
            // initialScrollIndex={0}
            // estimatedFirstItemOffset={8}
            // estimatedItemSize={46}
            onEndReachedThreshold={50}
            removeClippedSubviews
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            ListEmptyComponent={() =>
              contact.list?.length === 0 && !loading && <NoDataFound />
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
              />
            }
            // onEndReached={loadMoreCallLog}
            // onBlankArea={(a) => setBlankarea(a.blankArea)}
          />
        )}
      </View>
    </>
  );
};

export default CallHistory;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    // paddingHorizontal: 32
  },
});
CallHistory.propTypes = {
  route: PropTypes.object,
};
