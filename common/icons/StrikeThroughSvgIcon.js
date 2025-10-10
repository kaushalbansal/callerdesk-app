import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { rw } from "../helpers/dimentions"

function StrikethroughSvgIcon(props) {
  return (
    <Svg
      width={rw(6)}
      height={rw(6)}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M5.167 10.166h9.666M14.167 7.5v-.167a2 2 0 00-2-2H7.833a2 2 0 00-2 2v.833a2 2 0 002 2H12M5.833 12.5v.333a2 2 0 002 2h4.334a2 2 0 002-2v-1"
        stroke="#667085"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default StrikethroughSvgIcon
