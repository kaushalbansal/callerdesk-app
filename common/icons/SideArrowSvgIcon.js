import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { rw } from "../helpers/dimentions"

function SideArrowSvgIcon(props) {
  return (
    <Svg
      width={rw(4)}
      height={rw(4)}
      viewBox="0 0 6 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M1 11l4-5-4-5"
        stroke="#0A0614"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default SideArrowSvgIcon
