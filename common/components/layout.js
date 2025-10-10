import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import CustomIcon from './CustomIcon';
import { FlexView, MyView } from '../components/MyView';
import { MyText } from '../components/MyText';
import { colors } from '../../themes/vars';
import { rh, rw } from '../helpers/dimentions';
import PropTypes from 'prop-types';

const getBorderColor = (title) => {
  switch (title) {
    case 'Call Report':
      return colors.lightGreyNew;
    case 'Analytics':
      return colors.purple;
    case 'Contacts':
      return colors.lightBlueLess;
    case 'Block User':
      return colors.redColorLess;
    case 'Add Teams':
      return colors.lightGreen;
    case 'Add Groups':
      return colors.lightBlueNew;
    case 'Call Journey':
      return colors.lightOrangeLess;
    case 'Whatsapp Templates':
      return colors.lightGreenLess;
    default:
      return colors.white;
  }
};
const MyCard = ({
  title,
  icon,
  screen,
  data = [],
  type = '',
  from = '',
  bgcolor = `white`,
  disabled = false,
  bgcolorDisabled = bgcolor,
  disabledBorderColor = getBorderColor(title),
}) => {
  const navigation = useNavigation();

  const borderColor = getBorderColor(title);
  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        style={styles.faq}
        onPress={() => {
          navigation.navigate(screen, { type, from });
        }}
      >
        <FlexView
          borderW={2}
          diraction="column"
          w={rw(41)}
          card
          radious={rh(1)}
          bg={disabled ? bgcolorDisabled : bgcolor}
          borderColor={disabled ? disabledBorderColor : borderColor}
          style={{ height: rh(12.5), marginHorizontal: rw(5) }}
        >
          <MyView pt={8} pb={8}>
            <CustomIcon svgData={icon} />
          </MyView>
          <MyView w={'90%'}>
            <MyText
              color={disabled ? `grey` : `black`}
              style={{ fontWeight: `600` }}
              responsiveSize={1.7}
              align="center"
              type="help"
            >
              {title}
            </MyText>
          </MyView>
          <FlexView mt={rh(1)} bg="transparent" mb={rh(1)} gap={rw(2)}>
            {data.map((item, i) => {
              return (
                <View key={i} style={[styles.counts, styles.counts1]}>
                  <View>{item.icon}</View>
                  <View>
                    <Text style={{ color: disabled ? `grey` : `black` }}>
                      {!disabled ? item.count : `--`}
                    </Text>
                  </View>
                </View>
              );
            })}
          </FlexView>
        </FlexView>
      </TouchableOpacity>
    </>
  );
};

export default MyCard;

const styles = StyleSheet.create({
  counts: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  counts1: { gap: 4 },
  faq: { borderRadius: 8, width: rw(42) },
});
MyCard.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.node,
  screen: PropTypes.string,
  data: PropTypes.array,
  type: PropTypes.string,
  from: PropTypes.string,
  bgcolor: PropTypes.string,
  bgcolorDisabled: PropTypes.string,
  disabledBorderColor: PropTypes.string,
  disabled: PropTypes.bool,
  nextSlide: PropTypes.func,
};
