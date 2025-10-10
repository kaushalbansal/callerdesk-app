/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { colors } from '../../themes/vars';
import { PastInvoices, PastInvoicesArr } from '../../common/Constants';
import { rf, rh, rw } from '../../common/helpers/dimentions';
import { IconArrowRight } from '../../common/icons/iconarrowright';
import PropTypes from 'prop-types';
import { IconDownload } from '../../common/icons/download';

const PlanAndInvoice = () => {
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
  const renderItem = ({ item }) => (
    <View
      style={{
        width: rw(100),
        height: rh(15),
        alignSelf: `center`,
        marginTop: rh(-2),
      }}
    >
      <ImageBackground
        source={require(`../../common/icons/iconpastinvoices.png`)}
        style={{
          width: rw(100),
          height: rh(15),
          alignSelf: `center`,
          justifyContent: `center`,
          alignItems: `center`,
          paddingBottom: rh(2),
        }}
        resizeMode="stretch"
      >
        <View style={{ flexDirection: `row`, width: rw(90) }}>
          <View style={styles.planView}>
            <Text style={styles.planText}>{item?.planName}</Text>
            <Text style={styles.billCycle}>{item?.billCycle}</Text>
          </View>
          {item?.paid ? (
            <View style={styles.paid}>
              <IconDownload color="#000000" />
            </View>
          ) : (
            <View style={{ flex: 0.15 }}>
              <View style={{ width: 18 }}></View>
            </View>
          )}
          <View
            style={{
              flex: item?.paid ? 0.35 : 0.35,
              alignItems: `flex-end`,
              justifyContent: `center`,
              paddingRight: rw(2),
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: item?.paid ? colors.paid : colors.primary,
                borderRadius: 5,
                width: rw(15),
                height: rh(3),
                alignItems: `center`,
                justifyContent: `center`,
              }}
            >
              <Text style={styles.paidText}>
                {item?.paid ? `Paid`.toUpperCase() : `Pay Now`.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
      <Text
        style={[
          styles.currentPlanText,
          { marginLeft: rw(5), marginVertical: rh(2) },
        ]}
      >
        {PastInvoices}
      </Text>
      <FlatList
        data={PastInvoicesArr}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.container}
      />
    </ScrollView>
  );
};

export default PlanAndInvoice;

const styles = StyleSheet.create({
  arrowStyle: {
    alignItems: 'flex-end',
    paddingRight: rw(1.4),
    width: '15%',
  },
  billCycle: {
    color: colors.secondaryNew,
    fontSize: 10,
    fontWeight: `500`,
  },
  container: { backgroundColor: colors.white, width: rw(100) },
  currentPlanText: {
    color: colors.callGroupIcon,
    fontSize: 10,
    fontWeight: `600`,
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: rh(1.5),
  },
  flexRow1: { alignItems: `center`, flexDirection: `row`, width: '85%' },
  paid: {
    alignItems: `flex-end`,
    flex: 0.15,
    justifyContent: `center`,
  },
  paidText: { color: colors.white, fontSize: 10 },
  planText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: `400`,
    width: rw(50),
  },
  planView: { flex: 0.5, paddingHorizontal: rw(5) },
});
