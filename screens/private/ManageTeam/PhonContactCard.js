/* eslint-disable react-native/no-raw-text */
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { CheckBox } from '@ui-kitten/components';
import { colors } from '../../../themes/vars';
import { getRandomColor } from '../../../common/helpers/utils';
import MyText from '../../../common/components/MyText';
import FlexView, { MyView } from '../../../common/components/MyView';
import PropTypes from 'prop-types';
import { rh, rw } from '../../../common/helpers/dimentions';

const PhonContactCard = ({ item, selected = [], onSelect }) => {
  const bg = useMemo(() => getRandomColor(), []);

  const onChange = (val, item) => onSelect({ ...item, bg });

  const isChecked = () => selected.filter((x) => x.id === item.id).length > 0;

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
          style={{ width: rw(93), alignSelf: `center` }}
        >
          <MyView flexGrow={1} style={styles.myVie}>
            <MyView bg={bg} mr={5} style={styles.circle}>
              <MyText
                color={colors.white}
                bold
              >{`${item.firstName ? item.firstName[0].toUpperCase() : ''}${item.lastName ? item.lastName[0].toUpperCase() : ''}`}</MyText>
            </MyView>
            <MyText>{item.name}</MyText>
          </MyView>
          <MyView w={rw(8)}>
            <CheckBox
              checked={isChecked()}
              onChange={(_val) => {
                onChange(_val, item);
              }}
            />
          </MyView>
        </FlexView>
      )}
    </>
  );
};

export default PhonContactCard;

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    borderRadius: 36,
    elevation: 5,
    height: 36,
    justifyContent: 'center',
    // Drop shadow for iOS
    shadowColor: colors.grey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    width: 36,
  },
  myVie: { alignItems: 'center', flexDirection: 'row' },
});
PhonContactCard.propTypes = {
  item: PropTypes.shape({
    status: PropTypes.string,
    char: PropTypes.string,
    phoneNumbers: PropTypes.string,
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
  modalOpen: PropTypes.bool,
  onSelect: PropTypes.func,
};
