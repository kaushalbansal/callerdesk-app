
import React, {  useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl
} from 'react-native';
import CustomHeader from '../../../common/components/CustomHeader';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { Circle } from '../../../common/icons/circle';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../../themes/vars';
import { CallsLabel, TrafficBreakdownLabel, UserTrafficExpectedKeys, UserTrafficLabel } from '../../../common/Constants';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalyticsData } from '../../../common/redux/actions/analyticsActions';
import { SafeAreaView } from 'react-native-safe-area-context';


const CallAnalytics = () => {
  const {user_traffic}=useSelector((state)=>state.analytics)
     const {user}=useSelector((state)=>state?.global)
     const dispatch=useDispatch()
    const [refreshing, setRefreshing] = useState(false);

       const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
          await dispatch(getAnalyticsData(user.authcode));
        } finally {
          setRefreshing(false);
        }
      }, [dispatch]);

  const normalized = useMemo(() => {
    const map = UserTrafficExpectedKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    user_traffic.forEach(item => {
      const total = Number(item.total) || 0;
      map[item.callresult] = total;
    });
    return map;
  }, [user_traffic]);

  // Build card data
  const cardData = useMemo(
    () => UserTrafficExpectedKeys.map((key, idx) => ({
      key: `${idx}_${key}`,
      title: key,
      data: normalized[key].toString(),
      icon: <Circle color={colors.primary} size={rw(1.3)} />,
    })),
    [normalized]
  );

  // Chart: non-zero first, then zeros
  const chartData = useMemo(() => {
    const entries = UserTrafficExpectedKeys.map(key => ({
      label: key,
      value: normalized[key]
    }));
    const nonZero = entries.filter(e => e.value > 0);
    const zeroItems = entries.filter(e => e.value === 0);
    return [...nonZero, ...zeroItems];
  }, [normalized]);

  // Y-axis labels
  const { maxY, yAxisLabels, step } = useMemo(() => {
    const max = Math.max(5, ...chartData.map(pt => pt.value));
    const stepSize = Math.ceil(max / 4);
    return {
      maxY: stepSize * 4,
      step: stepSize,
      yAxisLabels: [0,1,2,3,4].map(n => (stepSize * n).toString()),
    };
  }, [chartData]);

  const CallCard = ({ item, index }) => (
    <View style={[styles.card, index % 2 === 1 && styles.cardOffset]}>
      <View style={styles.cardContent}>
        {item.icon}
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      <View style={[styles.cardContent, styles.cardFooter]}>
        <Text style={styles.cardValue}>{item.data}</Text>
        <Text style={styles.cardUnit}>{CallsLabel}</Text>
      </View>
    </View>
  );
  CallCard.propTypes = { item: PropTypes.object, index: PropTypes.number };

  const ListHeader = () => (
    <>
     
      <BarChart
        style={styles.chart}
        data={chartData}
        width={rw(90)}
        height={rh(30)}
        noOfSections={4}
        yAxisLabelTexts={yAxisLabels}
        xAxisLabelTextStyle={styles.xAxis}
        yAxisTextStyle={styles.yAxis}
        maxValue={maxY}
        stepValue={step}
        frontColor={colors.primary}
        isAnimated
        roundedTop
        spacing={rw(10)}
        initialSpacing={rw(2)}
        barWidth={rw(7)}
        yAxisColor="#EEE"
        xAxisColor="#EEE"
       
      />
      <Text style={styles.summaryTitle}>{TrafficBreakdownLabel}</Text>
    </>
  );

  return (
    <View style={styles.container}>
       <CustomHeader title={UserTrafficLabel} />
      <FlatList
        data={cardData}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
        renderItem={CallCard}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      />
    </View>
  );
};

export default CallAnalytics;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  listContent: { paddingBottom: rh(3) },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: rw(2) },
  chart: { marginVertical: rh(2), alignSelf: 'center' },
  xAxis: { fontSize: rf(1), color: '#888' , },
  yAxis: { fontSize: rf(1.5), color: '#AAA',  },
  summaryTitle: { fontSize: rf(2.2), fontWeight: '800', marginLeft: rw(5), marginVertical: rh(1) },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGraph,
    borderRadius: 8,
    width: rw(45),
    marginVertical: rh(1),
    padding: rw(2)
  },
  cardOffset: { marginLeft: rw(4) },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { marginLeft: rw(1), fontSize: rf(1.8), color: '#7A7A7A' },
  cardFooter: {  marginTop: rh(1) },
  cardValue: { fontSize: rf(2.8), fontWeight: '800' },
  cardUnit: { fontSize: rf(1.8), fontWeight: '600', color: '#7A7A7A', marginLeft: rw(1) },
});
