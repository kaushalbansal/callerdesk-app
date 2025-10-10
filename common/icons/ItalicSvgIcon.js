import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { rw } from "../helpers/dimentions"

function ItalicSvgIcon(props) {
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
        d="M11.333 5.167h-1.5m1.5 0h1.5m-1.5 0l-2.666 9.667m0 0h-1.5m1.5 0h1.5"
        stroke="#667085"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default ItalicSvgIcon
