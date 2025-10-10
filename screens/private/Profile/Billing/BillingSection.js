/* eslint-disable react-native/no-raw-text */
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import useSelector from 'redux';
import { colors } from '../../../../themes/vars';
import { IconApp } from '../../../../common/icons/callicon';
import { IconWallet } from '../../../../common/icons/iconwallet';
import MyLink from '../../../../common/components/MyLink';
import { IconDownload } from '../../../../common/icons/download';
import { rw, rh } from '../../../../common/helpers/dimentions';
import { MyView, FlexView } from '../../../../common/components/MyView';
import { MyText } from '../../../../common/components/MyText';
import {
  formatDateToText,
  navigateToLink,
} from '../../../../common/helpers/utils';
import {
  BillCycle,
  CallCredit,
  ChangePlan,
  CurrentPlan,
  MinLabel,
  NewLabel,
  PastInvoices,
  PlanExpiry,
} from '../../../../common/Constants';
import PropTypes from 'prop-types';

const BillingSection = () => {
  const { profile } = useSelector((state) => state.global);
  const HalfCircleTop = () => {
    return (
      <View style={styles.halfCircle}>
        <View style={styles.line}></View>
      </View>
    );
  };

  const HalfCircleBottom = () => {
    return (
      <View style={styles.halfCircle1}>
        <View style={styles.line1}></View>
      </View>
    );
  };
  const LeftCircle = ({ top = 8 }) => {
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: rh(1.8),
          height: rh(1.8),
          borderRadius: rh(1.8),
          borderWidth: 1.5,
          borderColor: colors.primary,
          backgroundColor: colors.white,
          position: 'absolute',
          right: rw(-2.1),
          top,
        }}
      >
        <View style={styles.line1}></View>
      </View>
    );
  };
  LeftCircle.propTypes = {
    top: PropTypes.number,
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <MyView>
          <MyView bordered radious={8} radiousBL={0} radiousBR={0}>
            <FlexView type="left" radious={8}>
              <MyView w={'70%'} p={rw(3)}>
                {/* <MyText bold responsiveSize={2} >Caller Desk </MyText> */}
                <MyText bold responsiveSize={2}>
                  {CallCredit}
                </MyText>
              </MyView>
              <MyView w={'30%'} diraction={'column'} p={rw(2)}>
                <FlexView type="center">
                  <IconApp size={rw(6)} />
                </FlexView>
                <FlexView mt={rh(1)} type="center">
                  <IconWallet />
                </FlexView>
              </MyView>
            </FlexView>
          </MyView>
          <MyView bg={colors.primary} p={rw(3)} radiousBL={8} radiousBR={8}>
            <FlexView bg={colors.primary} type="lr">
              <MyView>
                <MyText type="heading" color={colors.white}>
                  Available Minutes
                </MyText>
              </MyView>
              <MyView>
                <MyText type="heading" bold color={colors.white}>
                  {profile?.login_account?.avail_call_coins}
                  <MyText type="heading" color={colors.white}>
                    {' '}
                    {MinLabel}
                  </MyText>
                </MyText>
              </MyView>
            </FlexView>
          </MyView>
        </MyView>
        <FlexView type="lr" pr={rw(1)} pl={rw(1)} mt={rh(0.6)} mb={rh(0.6)}>
          <MyText>{CurrentPlan}</MyText>
          <MyLink linkText={ChangePlan} />
        </FlexView>
        <MyView
          bordered
          radious={8}
          borderW={1.5}
          borderColor={colors.primary}
          mb={rh(1)}
        >
          <FlexView radious={8} type="lr" p={0}>
            <MyView w={'70%'} p={rw(3)} style={styles.myViewStyle}>
              <FlexView type="left">
                <MyText responsiveSize={2.3} style={styles.myTextStyle}>
                  {profile.current_plan?.plan_type}
                </MyText>
                <MyView
                  radious={3}
                  ml={rw(1)}
                  pl={rw(1)}
                  pr={rw(1)}
                  bg={colors.success}
                >
                  <MyText color={colors.white}>{NewLabel}</MyText>
                </MyView>
              </FlexView>
              <MyView minH={rh(4)}>
                <MyText responsiveSize={2.3} style={styles.myTextStyle}>
                  {BillCycle}: {profile.current_plan?.plan_validity}
                </MyText>
              </MyView>
              <MyText responsiveSize={1.4} color={colors.primary} bold>
                {PlanExpiry}:{' '}
                {formatDateToText(profile.login_account?.expired_on)}
              </MyText>
            </MyView>
            <FlexView
              w={'30%'}
              h={'100%'}
              type="center"
              radiousBR={8}
              radiousTR={8}
            >
              <HalfCircleTop />
              <HalfCircleBottom />
              <MyText responsiveSize={2.5} style={{ marginTop: rh(1) }}>
                ₹
              </MyText>
              <MyText responsiveSize={3.5} bold>
                {profile.current_plan?.plan_amount}
              </MyText>
              <LeftCircle top={7} />
              <LeftCircle top={30} />
              <LeftCircle top={52} />
              <LeftCircle top={74} />
            </FlexView>
          </FlexView>
        </MyView>
        <FlexView type="lr" pr={rw(1)} pl={rw(1)} mb={rh(1)}>
          <MyText>{PastInvoices}</MyText>
        </FlexView>
        {profile.past_invoices &&
          profile.past_invoices.map((x) => {
            return (
              <FlexView
                key={x.order_id}
                mb={rh(1)}
                borderW={1.5}
                borderColor={colors.lightGrey}
                radious={8}
              >
                <MyView w={'70%'} p={rw(3)}>
                  <MyText>{x.plan_display_name}</MyText>
                  <MyText hint>
                    Plan activation date:{' '}
                    {formatDateToText(x.plan_activation_date)}
                  </MyText>
                </MyView>
                <FlexView type="right" w={'30%'} pr={rw(3)}>
                  <TouchableOpacity
                    style={{ marginRight: rw(2) }}
                    onPress={() => {
                      navigateToLink(x.invoice_url);
                    }}
                  >
                    <IconDownload />
                  </TouchableOpacity>
                </FlexView>
              </FlexView>
            );
          })}
      </View>
    </ScrollView>
  );
};

export default BillingSection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    paddingHorizontal: rw(3.5),
    paddingTop: 16,
  },
  halfCircle: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: rh(2.5),
    borderWidth: 1.5,
    height: rh(2.5),
    left: rw(-3),
    position: 'absolute',
    top: rw(-3),
    width: rh(2.5),
  },
  halfCircle1: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: rh(2.5),
    borderWidth: 1.5,
    bottom: rw(-3),
    height: rh(2.5),
    left: rw(-3),
    position: 'absolute',
    width: rh(2.5),
  },
  line: {
    backgroundColor: colors.white,
    height: rw(3),
    marginLeft: -2,
    marginTop: rw(-0.8),
    width: rh(2.6),
  },
  line1: {
    backgroundColor: colors.white,
    height: rw(3),
    marginLeft: -2,
    marginTop: rw(2.4),
    width: rh(2.6),
  },
  myTextStyle: { textTransform: 'capitalize' },
  myViewStyle: {
    borderColor: colors.primary,
    borderRightWidth: 2,
    borderStyle: 'dashed',
    height: '100%',
  },
});
