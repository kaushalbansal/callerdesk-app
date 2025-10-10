import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { rw } from "../helpers/dimentions"

function VoiceIconSvg(props) {
  return (
    <Svg
      width={rw(5)}
      height={rw(5)}
      viewBox="0 0 17 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M15.695 10.5v1a7 7 0 01-7 7m-7-8v1a7 7 0 007 7m0 0v3m0 0h3m-3 0h-3m3-6a4 4 0 01-4-4v-6a4 4 0 118 0v6a4 4 0 01-4 4z"
        stroke="#EC344A"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default VoiceIconSvg
