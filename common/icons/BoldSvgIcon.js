import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { rh, rw } from "../helpers/dimentions"

function BoldSvgIcon(props) {
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
        d="M6.5 5.167h3.833a2.5 2.5 0 010 5H6.5v-5zM6.5 10.167h4.667a2.333 2.333 0 010 4.667H6.5v-4.667z"
        stroke="#667085"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default BoldSvgIcon
