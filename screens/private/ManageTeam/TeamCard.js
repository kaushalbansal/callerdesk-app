import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../../../themes/vars';
import { rh, rw, rf } from '../../../common/helpers/dimentions';
import { ClickText, DeletekText } from '../../../common/Constants';
import { getRandomColor } from '../../../common/helpers/utils';
// import Swipeout from 'react-native-swipeout';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { IconDelete1 } from '../../../common/icons/icondelete1';
import { EditIcon } from '../../../common/icons/editiconnew';
import { IconGroup } from '../../../common/icons/icongroup';
import { IconHistory } from '../../../common/icons/iconhistory';
import { useDispatch } from 'react-redux';

import { TextIcon } from '../../../common/icons/texticon';
import CustomSwitch from '../../../common/components/switch';
import { teamDetailsScreen } from '../../../common/redux/actions/contact';
import PropTypes from 'prop-types';

const TeamCard = ({ item, onSelect, deleteBtn, onStatusChange }) => {
  const nav = useNavigation();
  const bg = useMemo(() => getRandomColor(), []);
  const dispatch = useDispatch();
  const deleteNote = useCallback(() => {
    deleteBtn(item, true);
  }, []);
  const swipeBtns = [
    {
      component: (
        <View style={styles.swipeButton}>
          <IconDelete1 size={25} />
        </View>
      ),
      backgroundColor: 'white',
      underlayColor: 'transparent',
      onPress: deleteNote,
    },
  ];

   const renderSwipeRightAction=()=>{
      return(
        <TouchableOpacity onPress={deleteNote}>
            <View style={styles.swipeButton}>
            <IconDelete1 size={rf(2.8)} />
          </View>
        </TouchableOpacity>
      )
    }
  return (
    <Pressable
      onPress={() => {
        dispatch(teamDetailsScreen(item));
        nav.navigate(`TeamDetails`, item);
      }}
    >
      <View style={styles.container}>
        <View style={styles.card2}>
          <View style={styles.card3}>
            <View style={styles.card1}>
              <View style={styles.leftBox}>
                <View style={[styles.circle, { backgroundColor: bg }]}>
                  <Text style={{ color: colors.white, fontSize: rf(1.8) }}>
                    {item.member_name
                      ? item.member_name[0].toLocaleUpperCase()
                      : 'NA'}
                  </Text>
                </View>
                <View style={styles.nameBox}>
                  <View style={{ flexDirection: `row`, alignItems: `center` }}>
                    <Text style={{ fontSize: rf(1.8) }}>
                      {item.member_name || 'Unknown'}
                    </Text>
                    <TouchableOpacity
                      style={{ marginLeft: rw(2) }}
                      onPress={() => onSelect(item, true)}
                    >
                      <EditIcon color="#407BFF" size={10} />
                    </TouchableOpacity>
                  </View>
                  <Text appearance="hint" style={{ fontSize: rf(1.5) }}>
                    {item.member_num || 'Unknown'}
                  </Text>
                </View>
              </View>
              <View style={[styles.rightBox, styles.rightBox1]}>
                {item.id !== 2 && (
                  <View style={{}}>
                    <CustomSwitch
                      checked={item.status === '1'}
                      onChange={() => onStatusChange(item)}
                    />
                  </View>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: `row`,
                marginLeft: rw(19),
                marginBottom: rh(1),
              }}
            >
              {
                <Text style={styles.extn}>
                  Ext {item.agent_extn ? item.agent_extn : `0`}
                </Text>
              }
              {item.member_id && (
                <View
                  style={{
                    flexDirection: `row`,
                    justifyContent: `center`,
                    alignItems: `center`,
                    marginHorizontal: rw(5),
                  }}
                >
                  <IconGroup />
                  <Text style={{ marginLeft: rw(1) }}>{item.member_id}</Text>
                </View>
              )}
              {item.access && (
                <View
                  style={{
                    flexDirection: `row`,
                    justifyContent: `center`,
                    alignItems: `center`,
                    marginHorizontal: rw(0),
                  }}
                >
                  <IconHistory color="#55A06F" />
                  <Text style={{ marginLeft: rw(1) }}>{item.access}</Text>
                </View>
              )}
              {item.type && (
                <View
                  style={{
                    flexDirection: `row`,
                    justifyContent: `center`,
                    alignItems: `center`,
                    marginHorizontal: rw(5),
                  }}
                >
                  <Text style={styles.type}>
                    {/* {item.type} */}
                    {item.access === `1`
                      ? `Admin`
                      : item.access === `2`
                        ? `Regular`
                        : `Owner`}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.centeredView}></View>
          <Swipeable
            renderRightActions={renderSwipeRightAction}
            autoClose={true}
            backgroundColor="transparent"
            containerStyle={{ width: rw(95), alignSelf: `center` }}
          >
            <View style={styles.swipeView}>
              <TextIcon size={16}></TextIcon>
              <Text style={styles.swipeText}>
                {ClickText} {DeletekText}
              </Text>
            </View>
          </Swipeable>
        </View>
      </View>
    </Pressable>
  );
};
const cirleDim = 45;
const styles = StyleSheet.create({
  card1: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: rw(2),
  },
  card2: {
    alignSelf: `center`,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 2,
    width: rw(95),
  },
  card3: { alignItems: `center`, justifyContent: `center` },
  centeredView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginTop: rh(1),
  },
  circle: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: cirleDim,
    elevation: 5,
    height: cirleDim,
    justifyContent: 'center',
    marginTop: rh(1),
    width: cirleDim,
  },
  container: { marginVertical: rh(1), paddingTop: rh(0.5) },
  extn: {
    backgroundColor: colors.orangeNew,
    borderRadius: 3,
    color: colors.white,
    fontSize: rf(1.5),
    paddingHorizontal: rw(1),
    paddingVertical: rh(0.5),
  },
  leftBox: {
    flexDirection: 'row',
    height: rh(7),
    width: rw(45),
  },
  nameBox: {
    height: rh(7),
    justifyContent: 'center',
    paddingLeft: rw(3.2),
    width: rw(55),
  },
  rightBox: {
    alignItems: 'center',
    height: rh(5),
    justifyContent: 'flex-end',
    width: rw(45),
  },
  rightBox1: { flexDirection: 'row' },
  swipeButton: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderBottomEndRadius: 6,
    borderColor: `#C4C4C4`,
    borderTopRightRadius: 6,
    borderWidth: 1,
    height: rh(5.3),
    justifyContent: `center`,
    width: rw(12),
  },
  swipeText: { color: colors.swipe, fontSize: 11, paddingLeft: `2%` },
  swipeView: {
    alignItems: `center`,
    backgroundColor: colors.swipeBg,
    flexDirection: `row`,
    paddingHorizontal: 12,
    paddingVertical: `3%`,
    // borderBottomEndRadius: 10,
    // borderBottomLeftRadius: 10,
    width: '100%',
  },
  type: {
    backgroundColor: colors.yellowNew,
    borderRadius: 20,
    color: colors.white,
    fontSize: rf(1.5),
    paddingHorizontal: rw(2),
    paddingVertical: rh(0.5),
  },
});

export default TeamCard;
TeamCard.propTypes = {
  item: PropTypes.shape({
    status: PropTypes.string,
    type: PropTypes.string,
    contact_num: PropTypes.string,
    callresult: PropTypes.string,
    contact_status: PropTypes.string,
    file: PropTypes.string,
    member_name: PropTypes.string,
    contact_savedate: PropTypes.string,
    startdatetime: PropTypes.string,
    contact_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
    id: PropTypes.string,
    sid_id: PropTypes.string,
    access: PropTypes.string,
    agent_extn: PropTypes.string,
    member_id: PropTypes.string,
  }),
  bg: PropTypes.string,
  index: PropTypes.number,
  customerName: PropTypes.string,
  onSelect: PropTypes.func,
  deleteBtn: PropTypes.func,
  onStatusChange: PropTypes.func,
};
