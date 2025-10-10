import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../../../themes/vars';
import CallRoutingCard from './CallRoutingCard';
import MySearch from '../../../common/components/inputs';
import {
  clearRoutingList,
  loadRoutingList,
} from '../../../common/redux/actions/callLog';
import { NoDataFound } from '../../../common/components/NoDataFound';
import { rw, rh } from '../../../common/helpers/dimentions';
import { SearchTextMembers } from '../../../common/Constants';
import CustomHeader from '../../../common/components/CustomHeader';
import { SkeletonLoaderComponent } from '../../../common/helpers/skeletonLoader';
import PropTypes from 'prop-types';

const CallRouting = ({ route }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.global);
  const { routingList } = useSelector((state) => state.callLog);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(loadRoutingList(user?.authcode, route.params.sid_id));
      setLoading(false);
    };

    fetchData();

    return () => {
      dispatch(clearRoutingList());
    };
  }, [dispatch, route.params.sid_id, user?.authcode]);

  const debouncedSearch = useMemo(() => {
    const handler = setTimeout(() => setSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const renderListData = useMemo(() => {
    return routingList.filter((x) => x.member_num.includes(search));
  }, [routingList, search]);
  const renderSkeletonLoaders = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <SkeletonLoaderComponent key={index} />
      ));
    }
    return null;
  };
  return (
    <>
      <CustomHeader title="Call Routing" />
      <View style={styles.container}>
        <MySearch
          placeholder={SearchTextMembers}
          onChange={(val) => debouncedSearch(val)}
        />
        {renderSkeletonLoaders()}
        {renderListData.length === 0 ? (
          <NoDataFound />
        ) : (
          renderListData.map((item, i) => (
            <CallRoutingCard key={i} data={item} type={route.params.type} />
          ))
        )}
      </View>
    </>
  );
};

CallRouting.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      sid_id: PropTypes.string,
      type: PropTypes.string,
    }),
  }),
};

export default CallRouting;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: rw(3.5),
    paddingTop: rh(1),
  },
});
