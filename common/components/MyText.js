import React from 'react';
import { Text } from '@ui-kitten/components';
import { rf } from '../helpers/dimentions';
import { colors } from '../../themes/vars';
import PropTypes from 'prop-types';

export const MyText = ({
  children,
  responsiveSize,
  type = 'text',
  hint = false,
  bold = false,
  color = colors.black,
  error = false,
  align = 'left',
  selectable = false,
  weight = `500`,
  style = {},
}) => {
  const _color = error ? colors.error : hint ? colors.grey : color;
  const _style = { textAlign: align || 'left', ...style };
  return (
    <>
      {type === 'text' && (
        <Text
          appearance={hint ? 'hint' : 'p1'}
          selectable={selectable}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: rf(responsiveSize || 1.8),
            color: _color,
            fontWeight: bold ? 'bold' : weight,
            ..._style,
          }}
        >
          {children}
        </Text>
      )}

      {type === 'heading' && (
        <Text
          appearance={hint ? 'hint' : 'p1'}
          selectable={selectable}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: rf(responsiveSize || 2),
            color: _color,
            fontWeight: bold ? 'bold' : weight,
            ..._style,
          }}
        >
          {children}
        </Text>
      )}

      {type === 'help' && (
        <Text
          appearance={hint ? 'hint' : 'p1'}
          selectable={selectable}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: rf(responsiveSize || 1.5),
            flexShrink: 1,
            color: _color,
            fontWeight: bold ? 'bold' : weight,
            ..._style,
          }}
        >
          {children}
        </Text>
      )}

      {type === 'title' && (
        <Text
          appearance={hint ? 'hint' : 'p1'}
          selectable={selectable}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: rf(responsiveSize || 2.5),
            color: _color,
            fontWeight: 'bold',
            ..._style,
          }}
        >
          {children}
        </Text>
      )}
    </>
  );
};

export default MyText;
MyText.propTypes = {
  hint: PropTypes.bool,
  bold: PropTypes.bool,
  selectable: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  align: PropTypes.string,
  weight: PropTypes.string,
  responsiveSize: PropTypes.number,
  type: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
};


// // MyText.js
// import React from 'react';
// import { Text } from '@ui-kitten/components';
// import { rf } from '../helpers/dimentions';
// import { colors } from '../../themes/vars';
// import PropTypes from 'prop-types';

// const MyText = ({
//   children,
//   responsiveSize,
//   type = 'text',
//   hint = false,
//   bold = false,
//   color = colors.black,
//   error = false,
//   align = 'left',
//   selectable = false,
//   weight = `500`,
//   style = {},
// }) => {
//   const _color = error ? colors.error : hint ? colors.grey : color;
//   const baseStyle = { textAlign: align || 'left', ...style };

//   let fontSize = rf(responsiveSize || 1.8);
//   let fontWeight = bold ? 'bold' : weight;

//   if (type === 'heading') {
//     fontSize = rf(responsiveSize || 2);
//   } else if (type === 'help') {
//     fontSize = rf(responsiveSize || 1.5);
//   } else if (type === 'title') {
//     fontSize = rf(responsiveSize || 2.5);
//     fontWeight = 'bold';
//   }

//   return (
//     <Text
//       appearance={hint ? 'hint' : 'p1'}
//       selectable={selectable}
//       style={{
//         fontSize,
//         color: _color,
//         fontWeight,
//         ...(type === 'help' ? { flexShrink: 1 } : {}),
//         ...baseStyle,
//       }}
//     >
//       {children}
//     </Text>
//   );
// };

// MyText.propTypes = {
//   hint: PropTypes.bool,
//   bold: PropTypes.bool,
//   selectable: PropTypes.bool,
//   error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
//   align: PropTypes.string,
//   weight: PropTypes.string,
//   responsiveSize: PropTypes.number,
//   type: PropTypes.string,
//   color: PropTypes.string,
//   children: PropTypes.node,
//   style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
// };

// export default MyText;
