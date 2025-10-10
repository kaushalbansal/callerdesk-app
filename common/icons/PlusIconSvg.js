import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { rw } from "../helpers/dimentions"

function PlusIconSvg({props, width=rw(5), height=rw(5), color="#EC344A", storkeWidth=2}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M10.195 1v17m8.5-8.5h-17"
        stroke={color}
        strokeWidth={storkeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default PlusIconSvg
