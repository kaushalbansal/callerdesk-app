import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { rw } from "../helpers/dimentions"

function PreviewHambugerSvgIcon({props, width=rw(5), height=rw(5)}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7 5.25a.75.75 0 000 1.5h14a.75.75 0 000-1.5H7zM7 11.25a.75.75 0 000 1.5h14a.75.75 0 000-1.5H7zM7 17.25a.75.75 0 000 1.5h14a.75.75 0 000-1.5H7zM5 12a1 1 0 11-2 0 1 1 0 012 0zM5 6a1 1 0 11-2 0 1 1 0 012 0zM5 18a1 1 0 11-2 0 1 1 0 012 0z"
        fill="#30D158"
        strokeWidth={3}
      />
    </Svg>
  )
}

export default PreviewHambugerSvgIcon
