import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../themes/vars';
import { rw } from '../helpers/dimentions';
import PropTypes from 'prop-types';
import { styles } from '../../themes/styles';

export const Circle = ({ children, size, bg = colors.white }) => {
  const styles = StyleSheet.create({
    circle: {
      alignItems: 'center',
      backgroundColor: bg,
      borderRadius: size / 2,
      height: size,
      justifyContent: 'center',
      width: size,
    },
  });
  return <View style={styles.circle}>{children}</View>;
};

Circle.propTypes = {
  children: PropTypes.node,
  size: PropTypes.number,
  bg: PropTypes.string,
};
export const FlexView = ({
  children,
  diraction = undefined,
  type = 'center',
  gap = 0,
  w = rw(100),
  bg = colors.white,
  p = 0,
  pl = 0,
  pr = 0,
  pt = 0,
  pb = 0,
  m = 0,
  ml = 0,
  mr = 0,
  mt = 0,
  mb = 0,
  h = undefined,
  minH = undefined,
  wrap = false,
  style = {},
  card = false,
  borderW = 0,
  borderColor = `white`,
  radious = 0,
  elevation = 0,
  shadowColor,
  radiousTL = undefined,
  radiousTR = undefined,
  radiousBL = undefined,
  radiousBR = undefined,
}) => {
  const cardStyle = card
    ? {
        borderWidth: borderW || 2,
        borderColor: borderColor || colors.lightGrey,
        elevation,
        shadowColor: shadowColor || colors.grey,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 5,
      }
    : {};

  const commonStyle = {
    width: w,
    padding: p,
    paddingLeft: pl,
    paddingRight: pr,
    paddingBottom: pb,
    paddingTop: pt,
    margin: m,
    marginLeft: ml,
    marginRight: mr,
    marginBottom: mb,
    marginTop: mt,
    height: h,
    minHeight: minH,
    borderRadius: radious,
    backgroundColor: bg,
    flexDirection: diraction || 'row',
    flexWrap: wrap ? 'wrap' : undefined,
    gap,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: borderW,
    borderTopLeftRadius: radiousTL,
    borderTopRightRadius: radiousTR,
    borderBottomLeftRadius: radiousBL,
    borderBottomRightRadius: radiousBR,
    borderColor: borderColor || colors.lightGrey,
    ...cardStyle,
    ...style,
  };

  if (type === 'lr')
    return (
      <View style={[{ ...commonStyle }, styles.children1]}>{children}</View>
    );
  if (type === 'center')
    return <View style={{ ...commonStyle }}>{children}</View>;
  if (type === 'left')
    return (
      <View style={[{ ...commonStyle }, styles.children2]}>{children}</View>
    );
  if (type === 'right')
    return (
      <View style={[{ ...commonStyle }, styles.children3]}>{children}</View>
    );
  return null;
};
FlexView.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.object,
  ]),
  size: PropTypes.number,
  bg: PropTypes.string,
  diraction: PropTypes.string,
  type: PropTypes.string,
  gap: PropTypes.number,
  w: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  p: PropTypes.number,
  pl: PropTypes.number,
  pr: PropTypes.number,
  pt: PropTypes.number,
  pb: PropTypes.number,
  m: PropTypes.number,
  ml: PropTypes.number,
  mr: PropTypes.number,
  mt: PropTypes.number,
  mb: PropTypes.number,
  h: PropTypes.number,
  minH: PropTypes.number,
  wrap: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  card: PropTypes.bool,
  borderW: PropTypes.number,
  borderColor: PropTypes.string,
  radious: PropTypes.number,
  elevation: PropTypes.number,
  shadowColor: PropTypes.string,
  radiousTL: PropTypes.number,
  radiousTR: PropTypes.number,
  radiousBL: PropTypes.number,
  radiousBR: PropTypes.number,
};
export const MyView = ({
  children,
  w = undefined,
  minW = undefined,
  flexGrow = 0,
  bg = 'transparent',
  p = 0,
  pl = undefined,
  pr = undefined,
  pt = undefined,
  pb = undefined,
  m = 0,
  ml = undefined,
  mr = undefined,
  mt = undefined,
  mb = undefined,
  h = undefined,
  minH = undefined,
  borderW = 1,
  bordered = false,
  borderColor = undefined,
  radious = 0,
  radiousTL = undefined,
  radiousTR = undefined,
  radiousBL = undefined,
  radiousBR = undefined,
  style = {},
}) => {
  const commonStyle = {
    width: w,
    minWidth: minW,
    backgroundColor: bg,
    height: h,
    minHeight: minH,
    flexGrow,
  };

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        ...commonStyle,
        borderWidth: bordered ? borderW || 1 : 0,
        borderRadius: radious,
        borderTopLeftRadius: radiousTL,
        borderTopRightRadius: radiousTR,
        borderBottomLeftRadius: radiousBL,
        borderBottomRightRadius: radiousBR,
        borderColor: borderColor || colors.lightGrey,
        padding: p,
        paddingLeft: pl,
        paddingRight: pr,
        paddingBottom: pb,
        paddingTop: pt,
        margin: m,
        marginLeft: ml,
        marginRight: mr,
        marginBottom: mb,
        marginTop: mt,
        ...style,
      }}
    >
      {children}
    </View>
  );
};
MyView.propTypes = {
  children: PropTypes.node,
  size: PropTypes.number,
  bg: PropTypes.string,
  diraction: PropTypes.string,
  type: PropTypes.string,
  gap: PropTypes.number,
  w: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minW: PropTypes.number,
  p: PropTypes.number,
  flexGrow: PropTypes.number,
  pl: PropTypes.number,
  pr: PropTypes.number,
  pt: PropTypes.number,
  pb: PropTypes.number,
  m: PropTypes.number,
  ml: PropTypes.number,
  mr: PropTypes.number,
  mt: PropTypes.number,
  mb: PropTypes.number,
  h: PropTypes.number,
  minH: PropTypes.number,
  wrap: PropTypes.bool,
  bordered: PropTypes.bool,
  style: PropTypes.object,
  card: PropTypes.bool,
  borderW: PropTypes.number,
  borderColor: PropTypes.string,
  radious: PropTypes.number,
  elevation: PropTypes.number,
  shadowColor: PropTypes.string,
  radiousTL: PropTypes.number,
  radiousTR: PropTypes.number,
  radiousBL: PropTypes.number,
  radiousBR: PropTypes.number,
};
export default FlexView;
