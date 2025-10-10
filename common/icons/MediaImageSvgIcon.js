import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { rw } from "../helpers/dimentions"

function MediaImageSvgIcon(props) {
  return (
    <Svg
      width={rw(5.5)}
      height={rw(5.5)}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M20.5 12.9l-2.792-2.01a3.8 3.8 0 00-4.762.259l-3.892 3.502a3.8 3.8 0 01-4.762.26L1.5 12.9m3.8 7.6h11.4a3.8 3.8 0 003.8-3.8V5.3a3.8 3.8 0 00-3.8-3.8H5.3a3.8 3.8 0 00-3.8 3.8v11.4a3.8 3.8 0 003.8 3.8zm4.75-12.825a2.375 2.375 0 11-4.75 0 2.375 2.375 0 014.75 0z"
        stroke="#084A4B"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export default MediaImageSvgIcon
