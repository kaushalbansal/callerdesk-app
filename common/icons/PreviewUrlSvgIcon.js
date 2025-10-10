import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { rw } from "../helpers/dimentions"

function PreviewUrlSvgIcon({props, width=rw(4), height=rw(4), color="#30D158"}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M6 2H4.2c-1.12 0-1.68 0-2.108.218a1.999 1.999 0 00-.874.874C1 3.52 1 4.08 1 5.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874c.427.218.987.218 2.105.218h7.606c1.118 0 1.677 0 2.104-.218.377-.191.684-.498.875-.874.218-.428.218-.987.218-2.105V11m1-5V1m0 0h-5m5 0L9 8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default PreviewUrlSvgIcon
