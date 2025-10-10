import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import CustomHeader from '../../../common/components/CustomHeader';
import { CallAnalyticsBanner } from '../../../common/icons/callanalytics';
import { CRAIcon } from '../../../common/icons/cra';
import { HDWTIcon } from '../../../common/icons/hdwt';
import { RWTIcon } from '../../../common/icons/rwt';
import { colors } from '../../../themes/vars';
import CustomIcon from '../../../common/components/CustomIcon';
import { MyView, FlexView } from '../../../common/components/MyView';
import { rw, rh } from '../../../common/helpers/dimentions';
import MyText from '../../../common/components/MyText';
import { useNavigation } from '@react-navigation/native';
import {
  CallAnalyticsLabel,
  CallAnalyticsSubLabel,
  CallAnalyticsTitle,
  HourDayTraffic,
  HourDayTrafficHead,
  RegionMapDataSubTitle,
  RegionMapDataTitle,
  RegionsTrafficHead,
  UserTrafficLabel,
} from '../../../common/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalyticsData } from '../../../common/redux/actions/analyticsActions';
import { LocalLoader } from '../../../common/components/GlobalLoader';

const Graph = () => {
  const navigation = useNavigation();
  const dispatch=useDispatch()
  const {user}=useSelector((state)=>state?.global)
  const {isLoading}=useSelector((state)=>state.analytics)

useEffect(() => {
    if (user?.authcode) {
      dispatch(getAnalyticsData(user.authcode));
    }
  }, []);
  return (
    <View style={styles.container}>
      <CustomHeader title={CallAnalyticsTitle} />
      {isLoading ? <LocalLoader loading={isLoading}/>:
      
      <View style={styles.content}>
        <MyView mb={rw(6)} mt={rw(4)}>
          <CallAnalyticsBanner/>
        </MyView>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate(`AnalyticsScreen`)}
        >
          <FlexView
            style={styles.flex}
            bg={colors.primary}
            card
            radious={8}
            // minH={rh(9)}
          >
            <MyView w={'80%'} p={rw(2.5)} pl={rw(4)}>
              <MyText color={colors.white} type="heading">
                {CallAnalyticsLabel}
              </MyText>
              <MyText color={colors.white} responsiveSize={1.5}>
                {CallAnalyticsSubLabel}
              </MyText>
            </MyView>
            <FlexView w={'20%'} bg="transparent" type="right" pr={rw(3)}>
              <CustomIcon svgData={CRAIcon} />
            </FlexView>
          </FlexView>
        </TouchableOpacity>
        <MyView mt={rh(2)}></MyView>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate(`CallAnalytics1`)}
        >
          <FlexView card radious={8} minH={rh(9)} style={styles.flex}>
            <MyView w={'80%'} p={rw(2.5)} pl={rw(4)}>
              <MyText type="heading">{HourDayTraffic}</MyText>
              <MyText responsiveSize={1.5}>{HourDayTrafficHead}</MyText>
            </MyView>
            <FlexView w={'20%'} bg="transparent" type="right" pr={rw(3)}>
              <CustomIcon svgData={HDWTIcon} />
            </FlexView>
          </FlexView>
        </TouchableOpacity>
        <MyView mt={rh(2)}></MyView>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("CallAnalytics")}
        >
          <FlexView card radious={8} minH={rh(9)} style={styles.flex}>
            <MyView w={'80%'} p={rw(2.5)} pl={rw(4)}>
              <MyText type="heading">{UserTrafficLabel}</MyText>
              <MyText responsiveSize={1.5}>{RegionsTrafficHead}</MyText>
            </MyView>
            <FlexView w={'20%'} bg="transparent" type="right" pr={rw(3)}>
              <CustomIcon svgData={HDWTIcon} />
            </FlexView>
          </FlexView>
        </TouchableOpacity>
        <MyView mt={rh(2)}></MyView>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate("MapRegion")}
        >
          <FlexView card radious={8} minH={rh(9)} style={styles.flex}>
            <MyView w={'80%'} p={rw(2.5)} pl={rw(4)}>
              <MyText type="heading">{RegionMapDataTitle}</MyText>
              <MyText responsiveSize={1.5}>{RegionMapDataSubTitle}</MyText>
            </MyView>
            <FlexView w={'20%'} bg="transparent" type="right" pr={rw(3)}>
              <CustomIcon svgData={RWTIcon} />
            </FlexView>
          </FlexView>
        </TouchableOpacity>
      </View>
}
    </View>
  );
};

export default Graph;

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, flex: 1 },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rw(3.5),
    width: '100%',
  },
  flex: { borderColor: `#EDDDDD`, borderWidth: 1, width: rw(90), paddingTop: rh(1), paddingBottom: rh(1) },
});
