/* eslint-disable react-native/no-raw-text */
import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { colors } from '../../../themes/vars';
import { getRandomColor } from '../../../common/helpers/utils';
import MyText from '../../../common/components/MyText';
import FlexView, { MyView } from '../../../common/components/MyView';
import { rf, rh, rw } from '../../../common/helpers/dimentions';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { teamMemberDataScreen } from '../../../common/redux/actions/contact';

const PhonContactCardTeam = ({ item, selected = [], onSelect, modalOpen }) => {
  const bg = useMemo(() => getRandomColor(), []);
  const dispatch = useDispatch();
  return (
    <>
      {Object.keys(item).includes('char') ? (
        <MyView pl={rw(3)}>
          <MyText type="title" bold>
            {item.char}
          </MyText>
        </MyView>
      ) : (
        <FlexView
          type="lr"
          minH={rh(6)}
          style={{ width: rw(82), alignSelf: `center` }}
        >
          <TouchableOpacity
            style={{ width: rw(82) }}
            onPress={() => {
              dispatch(
                teamMemberDataScreen({
                  member_name: item.name,
                  member_num: item.phoneNumbers[0].number,
                }),
              );
              onSelect({
                member_name: item.name,
                member_num: item.phoneNumbers[0].number,
              });
              modalOpen(true);
            }}
          >
            <MyView flexGrow={1} style={styles.myView}>
              <MyView bg={bg} mr={5} style={styles.circle}>
                <MyText
                  color={colors.white}
                  bold
                >{`${item.firstName ? item.firstName[0].toUpperCase() : ''}${item.lastName ? item.lastName[0].toUpperCase() : ''}`}</MyText>
              </MyView>
            </MyView>
            <View
              style={{
                position: `absolute`,
                marginLeft: rw(12),
                marginTop: rh(1),
              }}
            >
              <Text style={{ fontSize: rf(2), fontWeight: `700` }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: rf(1.2) }}>
                {item.phoneNumbers[0].number}
              </Text>
            </View>
          </TouchableOpacity>
        </FlexView>
      )}
    </>
  );
};

export default PhonContactCardTeam;

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    borderRadius: 36,
    elevation: 5,
    height: 36,
    justifyContent: 'center',
    shadowColor: colors.grey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    width: 36,
  },
  myView: { alignItems: 'center', flexDirection: 'row' },
});
PhonContactCardTeam.propTypes = {
  item: PropTypes.shape({
    status: PropTypes.string,
    char: PropTypes.string,
    phoneNumbers: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    name: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
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
  selected: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  modalOpen: PropTypes.func,
  onSelect: PropTypes.func,
};
