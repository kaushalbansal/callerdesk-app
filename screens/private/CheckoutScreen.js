/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Pressable,
} from 'react-native';
import { colors } from '../../themes/vars';
import {
  AddBusinnessDetailLabel,
  AvailableMinsLabel,
  BillCycle,
  CallCredit,
  InvoiceGenerationLabel,
  NewLabel,
  NextBill,
  PayNowLabel,
  PaymentBreakDownLabel,
  SelectedPlan,
} from '../../common/Constants';
import CustomHeader from '../../common/components/CustomHeader';
import { rf, rh, rw } from '../../common/helpers/dimentions';
import { IconArrowRight } from '../../common/icons/iconarrowright';
import PropTypes from 'prop-types';
import { IconApp } from '../../common/icons/callicon';
import { IconPlan } from '../../common/icons/planicon';
import AddBusinessDetails from '../private/Profile/Billing/AddBusinessDetails';
import { useSelector } from 'react-redux';
import CustomSwitch from '../../common/components/switch';
import ConfettiAnimation from '../slides/ConfettieAnimation';
import ModalBottom from '../../common/components/ModalBottom';

const CheckoutScreen = ({ route }) => {
  const [open, setOpen] = useState(false);
  const [useCredits, setUseCredit] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [payNow, setPayNow] = useState(false);
  const [paid, setPaid] = useState(false);
  const { profile } = useSelector((state) => state?.global);
  const { item } = route.params;
  useEffect(() => {
    if (useCredits) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
    }
  }, [useCredits]);

  const ListCard = ({ title = '', mt = 0, onPress = () => {}, icon }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{ width: rw(95), alignSelf: `center` }}
      >
        <View style={[styles.flexRow, { marginTop: mt }]}>
          <View style={styles.flexRow1}>
            {icon}
            <Text
              style={{
                fontSize: rf(2),
                fontWeight: `400`,
                color: colors.black,
                marginLeft: rw(2),
              }}
            >
              {title}
            </Text>
          </View>
          <View style={styles.arrowStyle}>
            <IconArrowRight />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  ListCard.propTypes = {
    title: PropTypes.string,
    mt: PropTypes.number,
    onPress: PropTypes.func,
    icon: PropTypes.object,
  };
  const payNowFunc = () => {
    setPaid(true);
  };
  return (
    <View style={{ backgroundColor: colors.white, flex: 1 }}>
      <ConfettiAnimation showConfetti={showConfetti} />
      <ModalBottom
        open={paid}
        close={false}
        onClose={() => setPaid(false)}
        style={{ backgroundColor: colors.primary }}
      >
        <Text
          style={{
            color: colors.white,
            fontSize: 17,
            fontWeight: `400`,
            fontFamily: `Epilogue`,
            textAlign: `center`,
            marginBottom: rh(2),
          }}
        >
          Please contact your account admin...
        </Text>
      </ModalBottom>
      <CustomHeader title="Checkout" />
      <AddBusinessDetails
        addWATemplate={`Add`}
        open={open}
        onClose={() => setOpen(false)}
      />
      <View style={styles.head}>
        <View style={styles.subHead}>
          <View style={{ justifyContent: `center` }}>
            <Text style={styles.callCredit}>{CallCredit}</Text>
            <Text
              style={{
                color: colors.success,
                marginTop: rh(1),
                textAlign: `center`,
                fontSize: 20,
                fontWeight: `600`,
              }}
            >
              ₹0
            </Text>
          </View>
          <View style={{ alignItems: `center` }}>
            <IconApp size={35} />
            <View style={{ marginTop: rh(1) }}>
              <IconPlan size={40} />
            </View>
          </View>
        </View>
        <View style={styles.available}>
          <View>
            <Text style={styles.availableText}>{AvailableMinsLabel}</Text>
          </View>
          <View style={styles.mins}>
            <Text style={styles.minsText}>{item?.call_coins}</Text>
            <Text style={{ color: colors.white }}> min</Text>
          </View>
        </View>
      </View>
      <View style={styles.planRow}>
        <Text style={styles.currentPlanText}>{SelectedPlan}</Text>
      </View>
      <ImageBackground
        source={require(`../../common/icons/iconticket.png`)}
        style={{
          width: rw(90),
          height: rh(15),
          alignSelf: `center`,
        }}
        resizeMode="contain"
      >
        <View
          style={{
            flexDirection: `row`,
            justifyContent: `space-between`,
            marginTop: rh(3),
            width: rw(80),
            alignSelf: `center`,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: `row`,
                width: rw(40),
                justifyContent: `space-between`,
              }}
            >
              <Text style={styles.planText}>
                {item?.plan_type
                  ?.toLowerCase()
                  .split(' ')
                  .map(function (word) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                  })
                  .join(' ')}
              </Text>
              <TouchableOpacity style={styles.newButton}>
                <Text style={styles.newButtonText}>
                  {NewLabel.toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.billCycleStyle}>
              {BillCycle} - {item?.plan_validity?.toUpperCase()}
            </Text>
            <Text style={styles.suspendedStyle}>
              Validity -{' '}
              {item?.plan_validity
                ?.toLowerCase()
                .split(' ')
                .map(function (word) {
                  return word.charAt(0).toUpperCase() + word.slice(1);
                })
                .join(' ')}{' '}
              /{' '}
              {item?.team_invite === 0
                ? `0 members`
                : `1 - ${item?.team_invite} members`}
            </Text>
          </View>
          <View style={styles.billLayout}>
            <Text style={styles.nextBillStyle}>{NextBill}</Text>
            <View style={styles.priceStyle}>
              <Text style={styles.ruppeStyle}>₹</Text>
              <Text style={styles.priceValueStyle}>{item?.plan_amount}</Text>
            </View>
            <TouchableOpacity
              style={styles.payNowButton}
              onPress={() => setPayNow(!payNow)}
            >
              <Text style={styles.payNowLabel}>{PayNowLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      {!payNow && (
        <View>
          <Text
            style={[
              styles.currentPlanText,
              { marginLeft: rw(5), marginVertical: rh(0.5) },
            ]}
          >
            {AddBusinnessDetailLabel}
          </Text>
          <Text
            style={[
              styles.currentPlanText,
              {
                marginLeft: rw(5),
                marginBottom: rh(2),
                fontSize: 11,
                color: colors.greyColorNew,
              },
            ]}
          >
            {InvoiceGenerationLabel}
          </Text>
          <View
            style={{
              marginBottom: rh(1),
              paddingLeft: rw(4),
              borderWidth: 1,
              height: rh(10),
              alignItems: `center`,
              borderRadius: 10,
              borderColor: colors.callLogDetailsCard,
              flexDirection: `row`,
              width: rw(90),
              alignSelf: `center`,
              justifyContent: `space-between`,
            }}
          >
            <View>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 17,
                  fontWeight: `500`,
                  width: rw(70),
                }}
                numberOfLines={1}
              >
                {profile?.login_account?.company_name
                  ? profile?.login_account?.company_name
                  : `Please update`}
              </Text>
              <Text
                style={{
                  color: colors.callGroupIcon,
                  fontSize: 11,
                  fontWeight: `500`,
                  width: rw(60),
                }}
              >
                Company deatils and gst number for invoice purpose
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setOpen(true)}
              style={{
                backgroundColor: colors.primary,
                height: rh(10),
                width: rw(10),
                alignItems: `center`,
                justifyContent: `center`,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              }}
            >
              <IconArrowRight color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {payNow && (
        <View>
          <Text
            style={[
              styles.currentPlanText,
              { marginLeft: rw(5), marginBottom: rh(1), marginTop: rh(0) },
            ]}
          >
            {PaymentBreakDownLabel.toUpperCase()}
          </Text>
          <View>
            <View
              style={{
                flexDirection: `row`,
                width: rw(90),
                alignSelf: `center`,
                justifyContent: `space-between`,
                paddingHorizontal: rw(5),
                paddingTop: rh(2),
                paddingBottom: rh(1),
                borderWidth: 1,
                borderColor: colors.callLogDetailsCard,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black,
                    fontWeight: `600`,
                  }}
                >
                  Subtotal
                </Text>
                <View style={{ flexDirection: `row` }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.black,
                      marginTop: rh(1),
                    }}
                  >
                    Offer
                  </Text>
                  <View style={{ justifyContent: `flex-end` }}>
                    <Text
                      style={{
                        marginLeft: rw(1),
                        paddingHorizontal: rw(2),
                        paddingVertical: rh(0.1),
                        fontSize: 14,
                        color: colors.white,
                        backgroundColor: colors.blueLight,
                        borderRadius: 5,
                      }}
                    >
                      10%
                    </Text>
                  </View>
                </View>
                {useCredits && (
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.black,
                      marginTop: rh(1),
                    }}
                  >
                    Available Call Credit
                  </Text>
                )}
                <View style={{ flexDirection: `row`, marginTop: rh(1) }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.black,
                    }}
                  >
                    GST
                  </Text>
                  <View style={{ justifyContent: `flex-end` }}>
                    <Text
                      style={{
                        marginLeft: rw(1),
                        paddingHorizontal: rw(2),
                        paddingVertical: rh(0.1),
                        fontSize: 14,
                        color: colors.white,
                        backgroundColor: colors.blueLight,
                        borderRadius: 5,
                      }}
                    >
                      18%
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: `row`, marginTop: rh(3) }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.black,
                    }}
                  >
                    Use Available Credits
                  </Text>
                </View>
              </View>
              <View>
                <Text>₹{parseInt(item?.plan_amount, 10)}</Text>
                <Text style={{ color: colors.error, marginTop: rh(1) }}>
                  -₹{(parseInt(item?.plan_amount, 10) * 10) / 100}
                </Text>
                {useCredits && (
                  <Text style={{ color: colors.success, marginTop: rh(1) }}>
                    -₹0
                  </Text>
                )}
                <Text style={{ marginTop: rh(1) }}>
                  ₹{(parseInt(item?.plan_amount, 10) * 18) / 100}
                </Text>
                <View style={{ marginTop: rh(3) }}>
                  <CustomSwitch
                    checked={useCredits}
                    size="small"
                    onChange={() => {
                      setUseCredit((prev) => !prev);
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                width: rw(90),
                alignSelf: `center`,
                height: rh(5),
                alignItems: `center`,
                alignContent: `center`,
              }}
            >
              <ImageBackground
                resizeMode="cover"
                source={require(`../../common/icons/payablebackground.png`)}
                style={{
                  flexDirection: `row`,
                  width: rw(100),
                  paddingHorizontal: rw(5),
                  height: rh(4),
                  alignSelf: `center`,
                  justifyContent: `space-between`,
                }}
              >
                <Text
                  style={{
                    paddingTop: rh(0.5),
                    paddingHorizontal: rw(5),
                    fontSize: 12,
                    color: colors.primary,
                    fontWeight: `600`,
                  }}
                >
                  Total Payable
                </Text>
                <Text
                  style={{
                    paddingTop: rh(0.5),
                    paddingHorizontal: rw(5),
                    fontSize: 12,
                  }}
                >
                  ₹
                  {parseInt(item?.plan_amount, 10) -
                    (parseInt(item?.plan_amount, 10) * 10) / 100 -
                    (useCredits ? 0 : 0) +
                    (parseInt(item?.plan_amount, 10) * 18) / 100}
                </Text>
              </ImageBackground>
            </View>
          </View>
          <Pressable
            style={styles.btn}
            onPress={() => {
              payNowFunc();
            }}
          >
            <Text style={styles.btnText}>{PayNowLabel}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  arrowStyle: {
    alignItems: 'flex-end',
    paddingRight: rw(1.4),
    width: '15%',
  },
  available: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: `row`,
    height: rh(4),
    justifyContent: `space-between`,
    paddingHorizontal: 20,
  },
  availableText: { color: colors.white, fontSize: 12, fontWeight: `500` },
  billCycleStyle: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: `500`,
  },
  billLayout: {
    alignItems: `center`,
    alignSelf: `center`,
    height: rh(9.5),
    justifyContent: `space-between`,
  },
  btn: {
    alignItems: `center`,
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    flexDirection: `row`,
    height: rh(4.5),
    justifyContent: `center`,
    marginBottom: rh(3),
    marginVertical: rh(2),
    width: rw(90),
  },
  btnText: { color: colors.white, marginLeft: rw(2), textAlign: `center` },
  callCredit: { color: colors.black, fontSize: 25, fontWeight: `800` },
  currentPlanText: {
    color: colors.callGroupIcon,
    fontSize: 13,
    fontWeight: `600`,
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: rh(1.5),
  },
  flexRow1: { alignItems: `center`, flexDirection: `row`, width: '85%' },
  head: {
    alignSelf: `center`,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: colors.greyColor,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1,
    elevation: 2,
    height: rh(18),
    justifyContent: `space-between`,
    marginTop: rh(2),
    width: rw(90),
  },
  mins: { alignItems: `baseline`, flexDirection: `row` },
  minsText: { color: colors.white, fontSize: 20, fontWeight: `600` },
  newButton: {
    alignItems: `center`,
    backgroundColor: colors.greenLabel,
    borderRadius: 5,
    justifyContent: `center`,
    width: rw(10),
  },
  newButtonText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: `400`,
  },
  nextBillStyle: {
    color: colors.greyLight,
    fontSize: 8,
    fontWeight: `400`,
  },
  payNowButton: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderRadius: 3,
    height: rh(2),
    justifyContent: `center`,
    width: rw(15),
  },
  payNowLabel: {
    color: colors.white,
    fontSize: 10,
    fontWeight: `400`,
  },
  planRow: {
    alignSelf: `center`,
    flexDirection: `row`,
    justifyContent: `space-between`,
    marginTop: rh(1),
    width: rw(90),
  },
  planText: {
    color: colors.secondary,
    fontSize: 17,
    fontWeight: `400`,
  },
  priceStyle: {
    alignItems: `baseline`,
    flexDirection: `row`,
    justifyContent: `flex-end`,
  },
  priceValueStyle: {
    color: colors.greyLight,
    fontSize: 30,
    fontWeight: `400`,
  },
  ruppeStyle: {
    color: colors.greyLight,
    fontSize: 25,
    fontWeight: `400`,
  },
  subHead: {
    alignSelf: `center`,
    flexDirection: `row`,
    justifyContent: `space-between`,
    marginTop: rh(2),
    width: rw(80),
  },
  suspendedStyle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: `600`,
    marginTop: rh(7.5),
    position: `absolute`,
    width: rw(50),
  },
});

CheckoutScreen.propTypes = {
  route: PropTypes.object,
};
