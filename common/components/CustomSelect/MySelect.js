import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { OverflowMenu, MenuItem } from '@ui-kitten/components';

import { IconArrowDown } from '../../icons/iconarrowdown';
import { colors } from '../../../themes/vars';
import { MyText } from '../MyText';
import { styles } from '../../../themes/styles';
import PropTypes from 'prop-types';

const MySelect = ({
  error = false,
  w = 150,
  h = 16,
  plain = false,
  noBg = false,
  onChange = () => {},
  items = [
    { id: '1', label: 'test' },
    { id: '2', label: 'test2' },
  ],
  val = { index: 0, data: {} },
}) => {
  const [visible, setVisible] = useState(false);
  const [value, setSelectedValue] = useState({ index: 0, data: {} });

  useEffect(() => {
    setSelectedValue(val);
  }, [val.index]);

  const onItemSelect = (i) => {
    setSelectedValue({ index: i, data: items[i.row] });
    setVisible(false);
    onChange({ index: i, data: items[i.row] });
  };

  const renderToggleButton = () => (
    <TouchableOpacity
      style={styles.toogleButton}
      onPress={() => setVisible(true)}
    >
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: w,
          borderWidth: error ? 1 : plain ? 0 : 1,
          borderColor: error
            ? colors.primary
            : visible
              ? colors.primary
              : colors.inputBorder,
          borderRadius: 3,
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: noBg ? undefined : colors.inputBg,
          justifyContent: 'center',
        }}
      >
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flexDirection: 'row',
            height: h,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <MyText style={styles.dataStyle}>
            {value.data.label || '-select-'}
          </MyText>
          <IconArrowDown size={10} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <OverflowMenu
        anchor={renderToggleButton}
        visible={visible}
        selectedIndex={0}
        placement="bottom start"
        style={{ width: w }}
        onSelect={onItemSelect}
        onBackdropPress={() => setVisible(false)}
      >
        {items.map((item, i) => {
          return (
            <MenuItem
              style={{
                backgroundColor:
                  // eslint-disable-next-line eqeqeq
                  i == value.index?.row ? colors.lightGrey : colors.white,
              }}
              key={item.id || i}
              title={item.label}
            />
          );
        })}
      </OverflowMenu>
    </>
  );
};

export default MySelect;

MySelect.propTypes = {
  error: PropTypes.bool,
  w: PropTypes.number,
  h: PropTypes.number,
  plain: PropTypes.bool,
  noBg: PropTypes.bool,
  onChange: PropTypes.func,
  items: PropTypes.array,
  val: PropTypes.object,
};
