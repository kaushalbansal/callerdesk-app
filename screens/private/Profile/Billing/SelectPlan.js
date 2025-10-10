/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { colors } from '../../../../themes/vars';
import {
  ExistingLabel,
  SelectPlanBody,
  SelectPlanHead,
} from '../../../../common/Constants';
import CustomHeader from '../../../../common/components/CustomHeader';
import { rf, rh, rw } from '../../../../common/helpers/dimentions';
import { IconArrowRight } from '../../../../common/icons/iconarrowright';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { IconSelectPlan } from '../../../../common/icons/iconselectplan';
import { useSelector } from 'react-redux';
import { toastShow } from '../../../../common/helpers/utils';

const SelectPlanNew = () => {
  const nav = useNavigation();
  const { profile } = useSelector((state) => state?.global);
  const [selectedPlan, setSelectedPlan] = useState(0);
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

  // Render list item
  const renderItem = ({ item, index }) => (
    <View
      style={{
        width: rw(100),
        height: rh(15),
        alignSelf: `center`,
        marginTop: rh(-2),
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setSelectedPlan(index);
          if (profile?.current_plan?.plan_id === item?.plan_id) {
            nav.goBack();
            toastShow(`Please renew your existing plan`);
          } else {
            nav.navigate(`CheckoutScreen`, { item });
          }
        }}
      >
        <ImageBackground
          source={
            selectedPlan === index
              ? require(`../../../../common/icons/iconplanselected.png`)
              : require(`../../../../common/icons/iconplannotselect.png`)
          }
          style={{
            width: rw(90),
            height: rh(15),
            alignSelf: `center`,
            justifyContent: `center`,
          }}
          resizeMode="contain"
        >
          <View
            style={{
              flexDirection: `row`,
              justifyContent: `space-between`,
              width: rw(80),
              alignSelf: `center`,
            }}
          >
            <View
              style={{
                width: rw(55),
                marginLeft: rw(1),
              }}
            >
              <View
                style={{
                  flexDirection: `row`,
                  justifyContent: `space-between`,
                }}
              >
                <Text
                  style={[
                    styles.planText,
                    { color: selectedPlan === index ? `white` : `black` },
                  ]}
                >
                  {item?.plan_type
                    ?.toLowerCase()
                    .split(' ')
                    .map(function (word) {
                      return word.charAt(0).toUpperCase() + word.slice(1);
                    })
                    .join(' ')}
                </Text>
                <Text
                  style={[
                    styles.planText,
                    {
                      color: selectedPlan === index ? `white` : `black`,
                      fontSize: 10,
                      textAlignVertical: `center`,
                      backgroundColor:
                        selectedPlan === index ? colors.primary : `#F3F5F9`,
                    },
                  ]}
                >
                  {profile?.current_plan?.plan_id === item?.plan_id &&
                    ExistingLabel}
                </Text>
              </View>
              <Text
                style={[
                  styles.billCycleStyle,
                  {
                    color: selectedPlan === index ? `white` : `grey`,
                    marginVertical: rh(0.5),
                  },
                ]}
              >
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
            <View style={[styles.billLayout, { width: rw(20) }]}>
              <View style={styles.priceStyle}>
                <Text
                  style={[
                    styles.ruppeStyle,
                    { color: selectedPlan === index ? `white` : `black` },
                  ]}
                >
                  ₹
                </Text>
                <Text
                  style={[
                    styles.priceValueStyle,
                    { color: selectedPlan === index ? `white` : `black` },
                  ]}
                >
                  {item?.plan_amount}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ backgroundColor: colors.white, flex: 1 }}>
      <CustomHeader title="Select Plan" />
      <View style={{ alignItems: `center`, marginTop: rh(0) }}>
        <IconSelectPlan />
      </View>
      <Text style={[styles.currentPlanText, { marginBottom: rh(1) }]}>
        {SelectPlanHead}
      </Text>
      <Text style={[styles.currentHeadText, { marginBottom: rh(1) }]}>
        {SelectPlanBody}
      </Text>
      <FlatList
        data={profile?.plan_details}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

export default SelectPlanNew;

const styles = StyleSheet.create({
  arrowStyle: {
    alignItems: 'flex-end',
    paddingRight: rw(1.4),
    width: '15%',
  },
  billCycleStyle: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: `500`,
  },
  billLayout: { alignItems: `center`, justifyContent: `center` },
  container: { backgroundColor: colors.white, width: rw(100) },
  currentHeadText: {
    alignSelf: `center`,
    color: colors.label,
    fontSize: 14,
    fontWeight: `400`,
    textAlign: `center`,
    width: rw(80),
  },
  currentPlanText: {
    alignSelf: `center`,
    color: colors.blackLabel,
    fontSize: 19,
    fontWeight: `600`,
    textAlign: `center`,
    width: rw(80),
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: rh(1.5),
  },
  flexRow1: { alignItems: `center`, flexDirection: `row`, width: '85%' },
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
    fontSize: 20,
    fontWeight: `400`,
  },
  ruppeStyle: {
    color: colors.greyLight,
    fontSize: 10,
    fontWeight: `400`,
  },
});
