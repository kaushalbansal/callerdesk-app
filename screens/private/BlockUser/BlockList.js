import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { colors } from '../../../themes/vars';
import BlockListCard from './BlockListCard';
import { loadBlockList } from '../../../common/redux/actions/callLog';
import { NoDataFound } from '../../../common/components/NoDataFound';
import { rh, rw } from '../../../common/helpers/dimentions';
import CustomHeader from '../../../common/components/CustomHeader';
import BlockUserList from '../CallLog/BlockUserList';
import PropTypes from 'prop-types';
import { SkeletonLoaderComponent } from '../../../common/helpers/skeletonLoader';

const BlockList = ({ route }) => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    currentPage: 1,
    block: 'NO',
  });
  const { user, loading } = useSelector((state) => state.global);
  const { blockList, blockListTotal } = useSelector((state) => state.callLog);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState();
  const [modalView, setModalView] = useState(false);

  const loadList = () => {
    dispatch(loadBlockList(user?.authcode, filters, true));
  };

  // eslint-disable-next-line no-unused-vars
  const loadMore = () => {
    if (blockList.length < blockListTotal) {
      const _temp = { ...filters, currentPage: filters.currentPage + 1 };
      dispatch(loadBlockList(user?.authcode, _temp));
      setFilters(_temp);
    }
  };
  const onSelect = (data) => {
    setData(data);
    setModalView(true);
  };
  const card = useCallback(
    ({ item, index }) => (
      <BlockListCard onSelect={onSelect} reload={loadList} data={item} />
    ),
    [],
  );
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(loadBlockList(user?.authcode, filters, true)).then(() => {
      setRefreshing(false);
    });
  };
  const renderSkeletonLoaders = () => {
    if (refreshing || loading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <SkeletonLoaderComponent key={index} from="block" />
      ));
    }
    return null;
  };
  const renderEmptpyFallBackUi=()=>{
    return(
      <NoDataFound msg={`blocked-user`} style={{alignSelf: "center", marginTop: rh(15)}} />
    )
  }
  return (
    <>
      <CustomHeader title="Blocked users"></CustomHeader>
      <BlockUserList
        data={data}
        open={modalView}
        onClose={() => {
          setModalView(false);
        }}
      />
      <View style={styles.containerHead}>
        <View style={styles.container}>
          {!loading && (
            <FlatList
              data={blockList}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              renderItem={card}
              onEndReachedThreshold={50}
              removeClippedSubviews
              initialNumToRender={blockList.length}
              maxToRenderPerBatch={blockList.length}
              // onEndReached={loadMore}
              ListEmptyComponent={renderEmptpyFallBackUi}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[colors.primary]}
                />
              }
            />
          )}
          {renderSkeletonLoaders()}
        </View>
      </View>
    </>
  );
};

export default BlockList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    marginLeft: rw(1),
    marginVertical: rh(1),
  },
  containerHead: { backgroundColor: colors.white, flex: 1 },
});
BlockList.propTypes = {
  route: PropTypes.object,
};
