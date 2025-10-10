/* eslint-disable react-native/no-raw-text */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@ui-kitten/components';
import { useNavigation, CommonActions } from '@react-navigation/native';

import { colors } from '../../../../themes/vars';
import { rw, rh, rf } from '../../../../common/helpers/dimentions';
import { MyView, FlexView } from '../../../../common/components/MyView';
import { MyText } from '../../../../common/components/MyText';
import { PaymentSuccessBanner } from '../../../../common/icons/paymentsuccessbanner';
import MyLink from '../../../../common/components/MyLink';
import {
  AccountLabel,
  BackHomeLabel,
  CallerLabel,
  CongratulationsLabel,
  DeskLabel,
  OfLabel,
  PaymentRecievedLabel,
  StartCallLabel,
  TowardsLabel,
} from '../../../../common/Constants';
import PropTypes from 'prop-types';

const PaymentSuccess = ({ route }) => {
  const { data: plan } = route.params;
  const nav = useNavigation();
  const goToHome = () => {
    nav.dispatch(
      CommonActions.reset({
        index: 0,
        routeNames: ['Home'],
        routes: [{ name: 'Home' }],
      }),
    );
  };

  return (
    <View style={styles.container}>
      <PaymentSuccessBanner w={rw(75)} h={rw(75)} />
      <MyText bold responsiveSize={3.0} color={colors.primary}>
        {CongratulationsLabel}!
      </MyText>
      <MyText align="center">{PaymentRecievedLabel}</MyText>
      <MyText>
        {OfLabel}
        <MyText color={colors.primary} bold responsiveSize={2.4}>
          {' '}
          ₹{plan.plan_amount}{' '}
        </MyText>
        {TowardsLabel}
        <MyText color={colors.primary} responsiveSize={2.4}>
          {' '}
          {CallerLabel}
        </MyText>
        <MyText responsiveSize={2.4}>{DeskLabel} </MyText>
        {AccountLabel}
      </MyText>
      <FlexView w={'80%'} mt={rh(3)} mb={rh(3)}>
        <MyLink fs={rf(2)} onPress={goToHome} bold linkText={BackHomeLabel} />
      </FlexView>
      <MyView w={'80%'}>
        <Button onPress={goToHome}>{StartCallLabel}</Button>
      </MyView>
    </View>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: rw(3.5),
  },
});
PaymentSuccess.propTypes = {
  route: PropTypes.object,
  top: PropTypes.number,
};
