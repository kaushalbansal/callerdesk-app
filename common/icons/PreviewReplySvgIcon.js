import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { rw } from "../helpers/dimentions"

function PreviewReplySvgIcon({props, width=rw(4), height=rw(4), color="#30D158"}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 36 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M34.437 15L19 27.864v-8.15h-4.646c-5.088 0-9.995 2.466-13.225 6.46C2.178 17.438 9.487 10.524 18 10.524h1V2.135L34.437 15z"
        stroke={color}
        strokeWidth={3}
      />
    </Svg>
  )
}

export default PreviewReplySvgIcon
