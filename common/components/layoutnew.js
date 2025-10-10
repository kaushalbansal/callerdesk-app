/* eslint-disable react-native/no-raw-text */
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';
import CustomIcon from './CustomIcon';
import { FlexView, MyView } from '../components/MyView';
import { MyText } from '../components/MyText';
import { colors } from '../../themes/vars';
import { rf, rh, rw } from '../helpers/dimentions';
import PropTypes from 'prop-types';
import { Circle } from '../icons/circle';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

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
const MyCardNew = ({
  title,
  icon,
  screen,
  data = [],
  type = '',
  name = '',
  from = '',
  bgcolor = `white`,
  group = true,
  disabled = false,
  analytics = true,
  bgcolorDisabled = bgcolor,
  disabledBorderColor = getBorderColor(title),
  borderColor = `white`,
  image = <></>,
}) => {
  const navigation = useNavigation();

  return (
    <>
      {analytics ? (
        <TouchableOpacity
          disabled={group}
          style={styles.faq}
          onPress={() => {
            screen && navigation.navigate(screen, { type, from });
          }}
        >
          <View style={styles.faq}>
            <FlexView
              borderW={1}
              diraction="column"
              w={rw(45)}
              card
              radious={rh(1)}
              bg={disabled ? bgcolorDisabled : bgcolor}
              borderColor={borderColor}
              style={{ height: rh(10), marginHorizontal: rw(5) }}
            >
              <View
                style={{
                  position: `absolute`,
                  width: rw(38),
                  alignItems: `flex-end`,
                  paddingTop: rh(1.7),
                }}
              >
                {analytics ? (
                  <CustomIcon svgData={icon} />
                ) : (
                  <LottieView
                    source={require('../../screens/private/assets/analytics.json')}
                    autoPlay
                    loop
                    resizeMode="contain"
                    style={{ width: rw(15), height: rh(15) }}
                  />
                )}
              </View>
              <MyView
                w={'90%'}
                style={{ flexDirection: `row`, alignItems: `center` }}
              >
                <Circle color="#08B632" />
                <MyText
                  color={disabled ? `grey` : `#605E5E`}
                  style={{ fontWeight: `600` }}
                  responsiveSize={2}
                  align="center"
                  type="help"
                >
                  {title}
                </MyText>
              </MyView>
              <MyView
                w={'83%'}
                style={{
                  marginTop: rh(1),
                  flexDirection: `row`,
                  alignItems: `baseline`,
                }}
              >
                {data.map((item, i) => {
                  return (
                    <View key={i}>
                      <View style={{ justifyContent: `flex-end` }}>
                        <Text style={{ fontWeight: `600`, fontSize: rf(3) }}>
                          {item.count}{' '}
                        </Text>
                      </View>
                    </View>
                  );
                })}
                {group ? (
                  <MyText
                    color={disabled ? `grey` : `#605E5E`}
                    style={{ fontWeight: `600` }}
                    responsiveSize={1.6}
                    align="center"
                    type="help"
                  >
                    {title === `Contacts` ? `Contacts` : `Calls`}
                  </MyText>
                ) : (
                  <MyText
                    color={disabled ? `grey` : `#605E5E`}
                    style={{ fontWeight: `600` }}
                    responsiveSize={1.6}
                    align="center"
                    type="help"
                  >
                    {name}
                  </MyText>
                )}
              </MyView>
              {/* <FlexView mt={rh(1)} bg="transparent" mb={rh(1)} gap={rw(2)}>
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
          </FlexView> */}
            </FlexView>
          </View>
        </TouchableOpacity>
      ) : (
        image
      )}
    </>
  );
};

export default MyCardNew;

const styles = StyleSheet.create({
  faq: { borderRadius: 8, width: rw(45) },
});
MyCardNew.propTypes = {
  title: PropTypes.string,
  borderColor: PropTypes.string,
  icon: PropTypes.node,
  screen: PropTypes.string,
  data: PropTypes.array,
  type: PropTypes.string,
  name: PropTypes.string,
  from: PropTypes.string,
  bgcolor: PropTypes.string,
  bgcolorDisabled: PropTypes.string,
  disabledBorderColor: PropTypes.string,
  disabled: PropTypes.bool,
  analytics: PropTypes.bool,
  group: PropTypes.bool,
  image: PropTypes.node,
  nextSlide: PropTypes.func,
};
