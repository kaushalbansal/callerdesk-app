import React, { useState, useMemo,  useCallback } from 'react';
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
import {
  HourlyAndDailyWiseTraficTitle,
  CallsLabel,
  CallsSummLabel,
  CategoriesData,
  PeriodsData,
} from '../../../common/Constants';
import { colors } from '../../../themes/vars';
import { BarChart } from 'react-native-gifted-charts';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalyticsData } from '../../../common/redux/actions/analyticsActions';
import PeriodSwitch from '../../../common/components/PeriodSwitch';


const CallAnalytics1 = () => {

  const [period, setPeriod] = useState('daily');       // 'daily' | 'weekly'
  const [category, setCategory] = useState('answer');  // 'answer' | 'no_answer' | 'voice'
  const dispatch=useDispatch()
  const data=useSelector((state)=>state.analytics)
   const {user}=useSelector((state)=>state?.global)
  const [refreshing, setRefreshing] = useState(false);
 


   const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getAnalyticsData(user.authcode));
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);


    //  pick the right arrays from API
    const { labels, values } = useMemo(() => {
      if (period === 'daily') {
        // hourly view
        return {
          labels: data.time_hourly || [],
          values: data[`${category}_hourly`] || [],
        };
      } else {
        // weekly view (last 7 days)
        return {
          labels: (data.date_daily || []).map(d => {
            const dt = new Date(d);
            return `${dt.getMonth()+1}/${dt.getDate()}`;
          }),
          values: data[`${category}_daily`] || [],
        };
      }
    }, [data, period, category]);
  
    //  build chartData: Gifted wants [{ value, label }]
    const chartData = useMemo(() => {
      return labels.map((lbl, i) => ({
        value: Number(values[i] ?? 0),
        label: lbl.trim(), 
      }));
    }, [labels, values]);
  
    //  dynamic Y axis (min 5, split into 4 segments → 5 labels)
    const { maxY, yAxisLabels, step } = useMemo(() => {
      const maxVal = Math.max(5, ...chartData.map(pt => pt.value));
      const step   = Math.ceil(maxVal / 4);
      return {
        maxY: step * 4,
        yAxisLabels: [0, step, step*2, step*3, step*4].map(n => n.toString()),
        step: step
      };
    }, [chartData]);    


const dailyCardData = useMemo(() => {
  const ans   = data.answer_hourly.map(Number);
  const noans = data.noanswer_hourly.map(Number);

  // Turn a 0–24 integer into a “12 AM”/“3 PM” string
  const formatHour = h => {
    const hr = h % 24;
    const suffix = hr < 12 ? 'AM' : 'PM';
    const display = hr % 12 === 0 ? 12 : hr % 12;
    return `${display} ${suffix}`;
  };

  return Array.from({ length: 8 }).map((_, idx) => {
    const startIdx = idx * 3;
    const sum =
      ans.slice(startIdx, startIdx + 3).reduce((a, b) => a + b, 0) +
      noans.slice(startIdx, startIdx + 3).reduce((a, b) => a + b, 0);

    // label directly from the numeric boundaries
    const title = `${formatHour(startIdx)} to ${formatHour(startIdx + 3)}`;

    return {
      key: `d${startIdx}`,
      title,
      data: sum.toString(),
      icon: <Circle color={colors.primary} size={rw(1.3)} />,
    };
  });
}, [data]);


const weeklyCardData = useMemo(() => {
  return (data.date_daily || []).map((d, idx) => {
    const ans   = Number(data.answer_daily[idx]   || 0);
    const noans = Number(data.noanswer_daily[idx] || 0);
    const dt    = new Date(d);
    const label = `${dt.getMonth() + 1}/${dt.getDate()}`;
    return {
      key: `w${idx}`,
      title: label,
      data: (ans + noans).toString(),
      color: colors.primary,
      icon: <Circle color={colors.primary} size={rw(1.3)} />,
    };
  });
}, [data]);



const cardData = period === 'daily' ? dailyCardData : weeklyCardData;


    const CallCard = ({ item, index }) => (
    <View style={[styles.cardContainer, index % 2 === 1 && styles.cardContainerOffset]}
    >
      <View style={styles.cardContent}>
        {item.icon}
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      <View style={[styles.cardContent, styles.cardFooter]}>
        <Text style={styles.data}>{item.data}</Text>
        <Text style={styles.dataText}>{CallsLabel}</Text>
      </View>
    </View>
  );


  const renderListFooterComponent=()=>{
    return(
      <View style={styles.footerContainer}>

      <PeriodSwitch selected={category} onChange={setCategory} options={CategoriesData}/>

  {/* Bar chart */}
      
       <BarChart
         key={`${period}-${category}`}
        data={chartData}
        width={rw(80)}
        height={rh(25)}
        barWidth={rw(3)}
        spacing={rw(15)}
        noOfSections={4}
        yAxisTextStyle={styles.yAxisText}
        xAxisLabelTextStyle={styles.xAxisText}
        yAxisLabelTexts={yAxisLabels}
        yAxisColor="#EEE"
        xAxisColor="#EEE"
        frontColor={colors.primary}
        initialSpacing={rw(5)}
        isAnimated
        maxValue={maxY}
        stepValue={step}
        roundedTop
      />
      </View>
    )
  }
  
  return (
    <View style={styles.container}>
      <CustomHeader title={`${HourlyAndDailyWiseTraficTitle}`} />
     
      <PeriodSwitch selected={period} onChange={setPeriod} options={PeriodsData}/>

       <Text style={styles.callSummaryTitle}>{CallsSummLabel}</Text>

      
    <FlatList
        contentContainerStyle={styles.cardList}
        numColumns={2}
        keyExtractor={item => item.key}
        data={cardData}
        renderItem={CallCard}
        ListFooterComponent={renderListFooterComponent}
          refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
        
    </View>
  );
};

export default CallAnalytics1;

const styles = StyleSheet.create({
    container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  callSummaryTitle: {
    color: `black`,
    fontSize: rf(1.8),
    fontWeight: `800`,
    marginHorizontal: rw(5),
    marginTop: rh(1),
    marginBottom: rh(0.5)
  },
   cardList: {  paddingHorizontal: rw(2) ,  paddingBottom: rh(3) },
   footerContainer:{
    marginTop: rh(1),
   },
  cardContainer: {
       backgroundColor: colors.white,
    borderColor: colors.borderGraph,
    borderWidth: 1,
    borderRadius: 8,
    padding: rw(2),
    margin: rw(1),
    width: rw(45),
     paddingHorizontal: rw(2),
  },
   cardContainerOffset: {
    marginLeft: rw(4) 
  },
  cardContent: {
    alignItems: `center`,
    // alignSelf: `center`,
    flexDirection: `row`,
    // width: rw(40),
  },
  cardTitle: {
    color: `#7A7A7A`,
    fontFamily: `Inter`,
    fontSize: rf(1.65),
    // marginHorizontal: rw(2),
  },
  data: {
    color: `black`,
    // flex: 1,
    fontFamily: `Inter`,
    fontSize: rf(2.5),
    fontWeight: `800`,
  },
  dataText: {
    color: `#7A7A7A`,
    // flex: 1,
    marginLeft: rw(1),
    fontFamily: `Inter`,
    fontSize: rf(1.6),
    fontWeight: `600`,
  },
  xAxisText: {
    fontSize: rf(1.3),
    color: "#888",
    // originY: 10,
    // xOffset: -4,
  },
  yAxisText: {
    fontSize: rf(1.5),
    color: '#AAA',
  },
});
