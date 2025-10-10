import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { rw, rh } from "../helpers/dimentions"

export default function SuccessCheckIcon({props, width=rw(18), height=rh(4), color="#fff"}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M15 27.5c6.875 0 12.5-5.625 12.5-12.5S21.875 2.5 15 2.5 2.5 8.125 2.5 15 8.125 27.5 15 27.5z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.688 15l3.537 3.538 7.088-7.075"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

