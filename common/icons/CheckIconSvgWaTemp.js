import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
import { rw } from "../helpers/dimentions"

function CheckIconSvgWaTemp({props, width=rw(5), height=rw(5), color="#08B632"}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={6} cy={6} r={5.5} stroke={color} />
      <Path
        d="M8.526 4.421L6.824 6.464c-.675.81-1.012 1.214-1.456 1.214-.443 0-.78-.405-1.455-1.214l-.44-.527"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export default CheckIconSvgWaTemp
