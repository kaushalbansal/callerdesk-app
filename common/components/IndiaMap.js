// IndiaMap.js
import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import PropTypes from "prop-types";
import { STATE_PATHS } from "../Constants";        // your paths file
import { rf, rw, rh } from "../helpers/dimentions";
import { colors } from "../../themes/vars";

const DEFAULT_FILL_WITH_DATA = colors.primary;
const DEFAULT_FILL_NO_DATA   = "#E0E0E0";
const DEFAULT_STROKE         = "#FFFFFF";
const DEFAULT_STROKE_WIDTH   = 1.0;

const IndiaMap = ({
  data,
  width  = rw(100),
  height = rh(60),
  onStatePress = () => {},
  fillWithData = DEFAULT_FILL_WITH_DATA,
  fillNoData   = DEFAULT_FILL_NO_DATA,
  stroke       = DEFAULT_STROKE,
  strokeWidth  = DEFAULT_STROKE_WIDTH,
}) => {
  const dataLookup = useMemo(() => {
    const L = {};
    (data || []).forEach(({ circle, total }) => {
      L[circle.trim()] = total;
    });
    return L;
  }, [data]);

  const allStates = useMemo(() => Object.keys(STATE_PATHS), []);

  return (
    <View style={[styles.wrapper, { width, height }]}>
      <Svg
        width={width}
        height={height}
        // **Match this to the coordinate system your .d strings use.**
        // Many India-map SVGs live in a 0–1000×0–1000 box.
        viewBox="0 0 1000 1000"
      >
        <G >
          {allStates.map((stateName) => {
            const { d } = STATE_PATHS[stateName] || {};
            if (!d) return null;

            const hasData  = dataLookup[stateName] != null;
            const fillColor = hasData ? fillWithData : fillNoData;

            return (
              <Path
                key={stateName}
                d={d}
                fill={fillColor}
                stroke={stroke}
                strokeWidth={strokeWidth}
                // **Use onPress directly on the Path** if you want interactivity
                onPress={() =>  onStatePress(stateName, dataLookup[stateName])}
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

IndiaMap.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      circle: PropTypes.string.isRequired,
      total: PropTypes.string.isRequired,
    })
  ).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  onStatePress: PropTypes.func,
  fillWithData: PropTypes.string,
  fillNoData: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
};

const styles = StyleSheet.create({
  wrapper: {
    // borderWidth: 1,     // you had this, just make sure it’s comma-separated
    borderColor: "#DDD",
    overflow: "hidden",
  },
});

export default React.memo(IndiaMap);
