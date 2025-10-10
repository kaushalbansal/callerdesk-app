import React, { useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Text } from '@ui-kitten/components';

import { getRandomColor } from '../../../common/helpers/utils';
import { colors } from '../../../themes/vars';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { EditIcon } from '../../../common/icons/editiconnew';
import { IconDelete } from '../../../common/icons/icondelete';
import { IconDelete1 } from '../../../common/icons/icondelete1';
import { IconEdit1 } from '../../../common/icons/iconedit1';
import { IconClose } from '../../../common/icons/iconclose';
import { useNavigation } from '@react-navigation/native';
import {
  ActionLabel,
  CancelLabel,
  ClickText,
  ConfirmLabel,
  DeleteCallGroup,
  DeleteLabel,
  DeletekText,
  OkLabel,
  ViewEditLabel,
} from '../../../common/Constants';
import { TextIcon } from '../../../common/icons/texticon';
import { IconGroup } from '../../../common/icons/icongroup';
import { IconHistory } from '../../../common/icons/iconhistory';
import { IconMark } from '../../../common/icons/iconmark';
// import Swipeout from 'react-native-swipeout';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { groupScreen } from '../../../common/redux/actions/contact';

const GroupCard = ({ data, onSelect, onDelete }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const bg = useMemo(() => getRandomColor(), []);
  const navigation = useNavigation();
  const [, setModal] = React.useState(false);
  const dispatch = useDispatch();
  const DeleteAlert = () =>
    Alert.alert(DeleteCallGroup, ConfirmLabel, [
      {
        text: CancelLabel,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: OkLabel, onPress: () => setModalVisible(!modalVisible) },
    ]);
  const deleteNote = useCallback(() => {
    // setOpenDeleteMember(true);
    onDelete(data, true);
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
    <>
      <Pressable
        onPress={() => {
          dispatch(groupScreen(data));
          navigation.navigate('CallGroupSetting');
        }}
      >
        <View style={[cardStyle.container, {}]}>
          {/* <TouchableWithoutFeedback onPress={()=>setModalVisible(!modalVisible)}> */}
          <View style={cardStyle.card2}>
            <View style={cardStyle.card3}>
              <View style={cardStyle.card1}>
                <View style={cardStyle.leftBox}>
                  <View style={[cardStyle.circle, { backgroundColor: bg }]}>
                    <Text style={{ color: colors.white, fontSize: rf(1.8) }}>
                      {data.group_name
                        ? data.group_name[0].toLocaleUpperCase()
                        : 'NA'}
                    </Text>
                  </View>
                  <View style={[cardStyle.nameBox, {}]}>
                    <View
                      style={{ flexDirection: `row`, alignItems: `center` }}
                    >
                      <Text style={{ fontSize: rf(1.8) }}>
                        {data.group_name || 'NA'}
                      </Text>
                      <TouchableOpacity
                        style={{ marginLeft: rw(2) }}
                        onPress={() => {
                          setModal(true);
                          onSelect(data, true);
                        }}
                      >
                        <EditIcon color="#407BFF" size={10} />
                      </TouchableOpacity>
                    </View>
                    <Text appearance="hint" style={{ fontSize: rf(1.5) }}>
                      {data.group_owner_name || 'Unknown'}
                    </Text>
                  </View>
                </View>
                <View style={[cardStyle.rightBox, cardStyle.rightBox1]}>
                  {data.is_sticky !== `0` && (
                    <View style={{}}>
                      <IconMark></IconMark>
                    </View>
                  )}
                </View>
              </View>
              <View
                style={{
                  flexDirection: `row`,
                  marginLeft: rw(18),
                  marginBottom: rh(1),
                }}
              >
                <View style={styles.extn}>
                  <Text style={styles.extnText}>
                    Ext {data.group_extn ? data.group_extn : `0`}
                  </Text>
                </View>
                <View style={styles.groupView}>
                  <IconGroup />
                  <Text style={{ marginLeft: rw(1) }}>
                    {data.groupmember_count}
                  </Text>
                </View>
                <View style={styles.timeSchedule}>
                  <IconHistory color="#55A06F" />
                  <Text style={{ marginLeft: rw(1) }}>
                    {data.time_schedule ? 'Yes' : 'No'}
                  </Text>
                </View>
                <View style={styles.statusView}>
                  <Text style={styles.statusText} numberOfLines={1}>
                    {data.call_strategy === `1`
                      ? `ROUND ROBIN`
                      : data.call_strategy === `2`
                        ? `SEQUENTIAL`
                        : data.call_strategy === `3`
                          ? `RANDOM`
                          : data.call_strategy === `4`
                            ? `Least Occupied`
                            : data.call_strategy === `5`
                              ? `Parallel`
                              : data.call_strategy === `6`
                                ? `Least Idle`
                                : `Not assigned`}
                  </Text>
                </View>
              </View>
            </View>
            <Swipeable
              renderRightActions={renderSwipeRightAction}
              autoClose={true}
              backgroundColor="transparent"
              containerStyle={{ width: rw(95), alignSelf: `center`, overflow: 'hidden' }}
            >
              <View style={styles.swipeView}>
                <TextIcon size={16}></TextIcon>
                <Text style={styles.swipeText}>
                  {ClickText} {DeletekText}
                </Text>
              </View>
            </Swipeable>
          </View>
          {/* </TouchableWithoutFeedback> */}
          <View style={cardStyle.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={cardStyle.centeredView}>
                <View style={cardStyle.modalView}>
                  <View style={cardStyle.modalSubView}>
                    <Text style={cardStyle.modalText}>{ActionLabel}</Text>
                    <Pressable onPress={() => setModalVisible(!modalVisible)}>
                      <IconClose></IconClose>
                    </Pressable>
                  </View>
                  <Pressable
                    style={cardStyle.callGroup}
                    onPress={() => navigation.navigate(`CallGroupSetting`)}
                  >
                    <IconEdit1 color={colors.black}></IconEdit1>
                    <Text style={cardStyle.modalText1}>{ViewEditLabel}</Text>
                  </Pressable>
                  <Pressable style={cardStyle.delete} onPress={DeleteAlert}>
                    <IconDelete></IconDelete>
                    <Text style={cardStyle.modalText1}>{DeleteLabel}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </Pressable>
    </>
  );
};

const cirleDim = 45;

const styles = StyleSheet.create({
  extn: { flex: 2, justifyContent: `center` },
  extnText: {
    backgroundColor: colors.orangeNew,
    borderRadius: 3,
    color: colors.white,
    fontSize: rf(1.5),
    paddingHorizontal: rw(1),
    paddingVertical: rh(0.5),
    textAlign: `center`,
  },
  groupView: {
    alignItems: `center`,
    flexDirection: `row`,
    flex: 1,
    justifyContent: `center`,
    marginLeft: rw(5),
  },
  statusText: {
    alignContent: `center`,
    backgroundColor: colors.yellowNew,
    borderRadius: 20,
    color: colors.white,
    fontSize: rf(1.5),
    // marginRight: rw(),
    paddingVertical: rh(0.5),
    textAlign: `center`,
    width: rw(27),
    // alignSelf:`center`,
    // justifyContent:'center',
  },
  statusView: {
    flexDirection: `row`,
    flex: 2.2,
    marginLeft: rw(5),
    marginRight: rw(10),
  },
  swipeButton: {
    alignItems: `center`,
    backgroundColor: colors.primary,
    borderBottomEndRadius: 6,
    borderColor: `#C4C4C4`,
    borderTopRightRadius: 6,
    borderWidth: 1,
    height: rh(4.5),
    justifyContent: `center`,
    width: rw(12),
  },
  swipeText: { color: colors.swipe, fontSize: 11, paddingLeft: `2%` },
  swipeView: {
    alignItems: `center`,
    backgroundColor: colors.swipeBg,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: `row`,
    paddingHorizontal: 12,
    paddingVertical: `3%`,
    width: '100%',
  },
  timeSchedule: {
    alignItems: `center`,
    flexDirection: `row`,
    flex: 1,
    justifyContent: `center`,
    marginLeft: rw(5),
  },
});

const cardStyle = StyleSheet.create({
  callGroup: {
    alignItems: `center`,
    borderBottomWidth: 1,
    borderColor: `#F5F3F3`,
    flexDirection: `row`,
    paddingVertical: rh(1),
    width: rw(72),
  },
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
  container: { paddingTop: rh(0.5) },
  delete: {
    alignItems: `center`,
    borderBottomWidth: 1,
    borderColor: `#F5F3F3`,
    flexDirection: `row`,
    paddingVertical: rh(1),
    width: rw(72),
  },
  leftBox: {
    flexDirection: 'row',
    height: rh(7),
    width: rw(45),
  },
  modalSubView: {
    backgroundColor: colors.primary,
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: `row`,
    justifyContent: `space-between`,
    paddingHorizontal: rw(2),
    paddingTop: rh(2),
    width: rw(80),
  },

  modalText: {
    color: colors.red,
    fontWeight: `800`,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText1: {
    color: colors.black,
    fontWeight: `800`,
    marginLeft: rw(2),
    textAlign: 'center',
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 10,
    margin: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: rw(80),
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
});

export default GroupCard;
GroupCard.propTypes = {
  data: PropTypes.shape({
    group_name: PropTypes.string,
    group_owner_name: PropTypes.string,
    is_sticky: PropTypes.string,
    group_extn: PropTypes.string,
    groupmember_count: PropTypes.number,
    call_strategy: PropTypes.string,
    time_schedule: PropTypes.number,
    startdatetime: PropTypes.string,
    contact_name: PropTypes.string,
    member_num: PropTypes.string,
    created_at: PropTypes.string,
    id: PropTypes.string,
    sid_id: PropTypes.string,
  }),
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
};
