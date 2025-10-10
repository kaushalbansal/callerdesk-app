import React from 'react';
import { TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { rh, rw } from '../helpers/dimentions';
import { colors } from '../../themes/vars';
import { IconGoBack } from '../../common/icons/goback';
import FlexView, { MyView } from './MyView';
import MyText from './MyText';
import PropTypes from 'prop-types';

const ios = Platform.OS === 'ios';

const CustomHeader = ({
  title = '',
  right = undefined,
  goback = '',
  from = ``,
  containerStyle={},
  titleTextStyle={},
  backIconColor=colors.secondary,
  headerBgColor=colors.white
}) => {
  const nav = useNavigation();

  const canGoBack = nav.canGoBack();

  return (
    <>
      <FlexView
        bg={headerBgColor}
        mt={ios ? rh(5) : 0}
        pt={rh(1)}
        pb={rh(1)}
        pl={rh(0.5)}
        pr={rh(0.5)}
        style={[{ alignItems: `center` }, containerStyle]}
      >
        <FlexView w="70%" pl={canGoBack ? rw(1) : rw(1.5)} type="left" bg={headerBgColor}>
          {canGoBack && (
            <MyView w={rw(8)} pt={rh(0.8)} pb={rh(0.8)}>
              <TouchableOpacity
                style={styles.backButtonStyle}
                onPress={() => (goback ? nav.navigate(goback) : nav.goBack())}
              >
                <IconGoBack color={backIconColor}/>
              </TouchableOpacity>
            </MyView>
          )}
          <MyText bold={from !== `signup`} responsiveSize={2} style={titleTextStyle}>
            {title}
          </MyText>
        </FlexView>

        <FlexView pr={rw(3)} w="30%" type="right" gap={rw(1)}>
          {right}
        </FlexView>
      </FlexView>
    </>
  );
};

export default CustomHeader;

CustomHeader.propTypes = {
  title: PropTypes.string,
  right: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  goback: PropTypes.func,
  from: PropTypes.string,
  containerStyle: PropTypes.object,
  titleTextStyle: PropTypes.object,
  backIconColor: PropTypes.string,
  headerBgColor: PropTypes.string,
};
const styles = StyleSheet.create({
  backButtonStyle: { alignItems: 'center', justifyContent: 'center' },
});
