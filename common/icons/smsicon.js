import React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

export const SmsIcon = ({ size = 18, color = '#08B632' }) => {
  return (
    <SvgXml
      xml={`
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g clip-path="url(#clip0_53_5)">
      <path d="M20 0H0V20H20V0Z" fill="url(#pattern0_53_5)"/>
      </g>
      <defs>
      <pattern id="pattern0_53_5" patternContentUnits="objectBoundingBox" width="1" height="1">
      <use xlink:href="#image0_53_5" transform="scale(0.02)"/>
      </pattern>
      <clipPath id="clip0_53_5">
      <rect width="20" height="20" fill="white"/>
      </clipPath>
      <image id="image0_53_5" width="50" height="50" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEgklEQVR4nO1aa4xccxT/e5Zo6xG+eEaqaEqCSPggJT5pfJCS6qrEN0kFIQ3xikz4hFhcJjvz+91z7mx2RZgSTarUMyRCUe92ERoJqoiIUo9WdOXcPTMmuzO7s7szd+8m+0vuh5n/uf/Xecw5vzMhzGEOc8gESZKcoOSVCjygwDMCfCjAdiF/TB9guwIfpGPk/QKsJHl8yAPiOD5FyHsV+FTJ4RbPr/40HRfyEyHvsblC1pByeZkAm5T8N90MsE+BLQI8LECPiJxdqVSOGP2efZcA5yh5lZKPpBr6/1A21wsKXJCVBp6vLw58KcAtAE6c6pwicpKQtwr5VcOhnusHFnV29yGE4eHh/YRcK+Sfbg7blFxh33dqjUKhsL8AVygw5If5Q4CbOrZGsVicr+TT9cnJtdVq9YDQJRQKhQNdQyOXBqyzPUxr0jiOj1LgnZoWROS0ju144rWXCPmZr725r6/vyClNNBhFCy2Eui+8JCILQsYQkQVKvuKHeX/SezDTSSOIO14URfPCDKFSqRxS24sAGydl1grc7ZrYMjAwcFiYYRSLxfk164iBO9p6qUKepeReIXeRPDnkBP3AIgV+E2BPApw54QsNNnltyBkUuK7ms+MKxnF8kQt+3M0QO1VUzXeBrelFl8vLWgpaQmdCSRyvCjlFDKx2x3+qqQCAw903dgI4KOQU1Wr1YM+m9zQNx5ZWu1kx5BxKahrB4vjyMYNCPuQqWxlyjiSOV3lAenDMoJAv2yDJU0POUQFO9x/rF8cM1vKadvxDgEuF/E6BbxVYnpVco5+4GwyF0VDyewF2hzaQLlir8IBvspJrhGXiCuwIo2E3YqlzmO0HUa+7LUlr4yDLbXFbNC6XL8lKri3Tqjl7UiotDjlHHMdLWjq7Avd5drk65BwC9LQMv1aDu40i5BwCJK6RFWMGre5Q8nchfzYbDDlFFEXzBPhJyb9bVowKPO5a6Qk5hZBX+x6fbClk5JmTbUN5TOMLIwzLNo9Y4xN5Sj7r9nd9yBli4AbXxqYJha28NV+xH5w85V1JqbTYMg9L30kubeslIde4+rY243CzxmAULbSq1UPubZN6WQBxE3tjJpmUam/voVaju0ltMGp1UhNYFlznk8jNAI4OM6EJ8jW/0PemTJ1azK7V8SlbDpwXMgLJpQp87ib+9rRN3MKwpQJpWCb/UeCu0OUQq8DtAvxVIxmmTWI3IiEv89v5IXQB3lboUeALP8BuC7cdX0hEjvWDvNnJedNwbxogv26oSdZ3jeWs80lk1GxcyDsV6FXyGqNdrQ0wukljbQopl89N0wzgUSE/amy9CbCB5PldOUB9o8DGtF4hL26SNkTjNEMtEd3Vshlq3V+ykAnP3F8qHWeObupvjOPW+BHyddfUzrTJOeKoT1ikSdtowA7zK29Vv2sdKKt9jJMycw1ZQsnHfLNr0s+qxzgPtrdWcmbZzZoSROSMlEq1PMcaosB6y3caTGOwo+GxG/DO1VtN7HqfAK8qcGGYDRDyRiV/cYbD/pKxTsmbZwNBMYcww/gPr8SEjQYWYOYAAAAASUVORK5CYII="/>
      </defs>
      </svg>
    `}
    />
  );
};
SmsIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};
