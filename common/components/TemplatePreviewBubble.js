// src/components/TemplatePreviewBubble.js
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  useWindowDimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import Video from 'react-native-video';
import { rw, rh, rf } from '../helpers/dimentions';
import { colors } from '../../themes/vars';
import Markdown from 'react-native-markdown-display';
import ResponsiveImage from './ResponsiveImage';
import MediaDocSvgIcon from '../icons/MediaDocSvgIcon';
import { formatFileSize } from '../helpers/utils';
import PreviewReplySvgIcon from '../icons/PreviewReplySvgIcon';
import PreviewCallSvgIcon from '../icons/PreviewCallSvgIcon';
import PreviewUrlSvgIcon from '../icons/PreviewUrlSvgIcon';
import PreviewCopySvgIcon from '../icons/PreviewCopySvgIcon';
import ModalBottom from './ModalBottom';
import { AllOptionsLabel, SeeAllOptionsLabel } from '../Constants';
import PreviewHambugerSvgIcon from '../icons/PreviewHambugerSvgIcon';

const Triangle = () => (
  <View style={styles.triangle} />
);

// Skeleton loading component for image
const ImageSkeleton = ({ width, height }) => (
  <View style={[styles.imageSkeleton, { width, height }]}>
    <ActivityIndicator size="large" color={colors.white} />
  </View>
);

function TemplatePreviewBubble({
  headerType,
  headerText,
  headerMedia,
  bodyText,
  footerText,
  buttons,
  bodyStyle,
  footerStyle,
  buttonContainerStyle,
  buttonTextStyle,
  timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}) {

  const { width: screenWidth } = useWindowDimensions();

  // // caps & clamps
  // const MAX_MEDIA_W = screenWidth * 0.7;
  // const MAX_MEDIA_H = screenWidth * 0.5;
  // const MIN_TEXT_W = screenWidth * 0.35;
  // const MAX_TEXT_W = screenWidth * 0.7;

  // const [mediaDims, setMediaDims]     = useState({ width: MAX_MEDIA_W, height: MAX_MEDIA_W * 0.6 });
  // const [bubbleWidth, setBubbleWidth] = useState(MIN_TEXT_W);


  // caps & clamps
  const MAX_MEDIA_W = rw(70);
  const MAX_MEDIA_H = rw(100);
  const MIN_TEXT_W = rw(35);
  const MAX_TEXT_W = rw(70);

  const [mediaDims, setMediaDims]     = useState({ width: MAX_MEDIA_W, height: rw(40) });
  const [bubbleWidth, setBubbleWidth] = useState(MIN_TEXT_W);
  const [showAllOptions, setShowAllOptions]=useState(false)
  
  // Loading states for image
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [dimensionsCalculated, setDimensionsCalculated] = useState(false);

    // decide bubbleWidth + mediaDims on mount or when inputs change
  useEffect(() => {
    if (headerType === 'IMAGE') {
      setImageLoading(true);
      setImageError(false);
      setDimensionsCalculated(false);
      
      Image.getSize(
        headerMedia.uri,
        (w, h) => {
          let scaledW = MAX_MEDIA_W;
          let scaledH = MAX_MEDIA_W * (h / w);
          if (scaledH > MAX_MEDIA_H) {
            scaledH = MAX_MEDIA_H;
            scaledW = MAX_MEDIA_H * (w / h);
          }
          setMediaDims({ width: scaledW, height: scaledH });
          setBubbleWidth(scaledW);
          setDimensionsCalculated(true);
        },
        (error) => {
          console.warn('Failed to get image dimensions:', error);
          setBubbleWidth(MAX_MEDIA_W);
          setImageError(true);
          setDimensionsCalculated(true);
        }
      );
    }
    else if (headerType === 'VIDEO') {
      const vidH = MAX_MEDIA_W * (9 / 16); 
      setMediaDims({ width: MAX_MEDIA_W, height: vidH });
      setBubbleWidth(MAX_MEDIA_W);
    }
    else if (headerType === 'DOCUMENT') {
      setBubbleWidth(MAX_MEDIA_W);
    }
    else if(buttons?.length){
      setBubbleWidth(MAX_MEDIA_W)
    }
    else {
      // text (or none): clamp estimated width
      const est = Math.min(
        MAX_TEXT_W,
        Math.max(MIN_TEXT_W, bodyText.length * rf(0.5))
      );
      setBubbleWidth(est);
    }
  }, [headerType, headerMedia, bodyText, screenWidth]);

  const renderHeaderText=()=>{
    return(
       <Text style={styles.headerText}>{headerText}</Text>
    )
  }

  const renderHeaderImage=()=>{
    // Show skeleton while calculating dimensions
    if (!dimensionsCalculated) {
      return <ImageSkeleton width={MAX_MEDIA_W} height={rw(40)} />;
    }

    // Show error state if image failed to load
    if (imageError) {
      return (
        <View style={[styles.media, mediaDims, styles.imageErrorContainer]}>
          <Text style={styles.imageErrorText}>Failed to load image</Text>
        </View>
      );
    }

    return(
       <View style={[styles.media, mediaDims]}>
         {imageLoading && (
           <View style={styles.imageLoadingOverlay}>
             <ActivityIndicator size={rf(2)} color={colors.white} />
           </View>
         )}
         <Image
            source={{ uri: headerMedia.uri }}
            style={[styles.media, mediaDims, imageLoading && styles.imageLoading]}
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
            fadeDuration={300}
          />
       </View>
       // <ResponsiveImage uri={headerMedia.uri}/>
    )
  }

  const renderHeaderVideo=()=>{
    return(
       <Video
          source={{ uri: headerMedia.uri }}
          style={[styles.media, mediaDims, styles.headerVideo]}
          paused
          controls
          // resizeMode='cover'
          shutterColor='transparent'
          controlsStyles={{
             hidePrevious: true,
             hideNext: true,
             // hideFullscreen: true    
           }}
        />
    )
  }

  const renderHeaderDocument=()=>{
    return(
      <TouchableOpacity
        style={[styles.headerDoc, { width: bubbleWidth }]}
        // onPress={() => Linking.openURL(headerMedia.uri)}
        activeOpacity={0.8}
      >
        <MediaDocSvgIcon />
        <Text style={styles.headerDocText} numberOfLines={1}>
          {headerMedia.name? headerMedia.name: 'Document'}
        </Text>
        {/* <Text>{formatFileSize(headerMedia.size)}</Text> */}
      </TouchableOpacity>
    )
  }

  function renderHeader(){
    switch(headerType){
      case "TEXT":
        return renderHeaderText()
      case "IMAGE":
        return renderHeaderImage()
      case "VIDEO":
        return renderHeaderVideo()
      case "DOCUMENT":
        return renderHeaderDocument()
      default: 
        return null
    }
  }

  const renderBody=()=>{
    return(
      <View style={styles.bodyContainer}>
        {/* <Text style={[styles.bodyText, bodyStyle]}>
          {bodyText}
        </Text> */}
         <Markdown  style={{body: styles.bodyText}}>
        {bodyText}
      </Markdown>
      </View>
    )
  }

  const renderFooterText=()=>{
    if(!footerText) return null
    return  (
        <Text style={[styles.footerText, footerStyle]}>
            {footerText}
          </Text>
    ) 
  }

  const renderTimeStamp=()=>{
    return(
        <Text style={styles.timestamp}>
          {timestamp}
        </Text>
    )
  }

  const renderFooterButtonIcon=(type, color)=>{
    switch (type){
      case "PHONE_NUMBER":
        return <PreviewCallSvgIcon color={color}/>
      case "URL":
        return <PreviewUrlSvgIcon color={color}/>
      case "COPY_CODE":
        return <PreviewCopySvgIcon color={color}/>
      default: 
        return <PreviewReplySvgIcon color={color}/>
    }
   
  }

  const renderFooterButtons=()=>{
    if(!buttons || buttons.length===0) return null

    if(buttons.length > 3){
      return renderMoreThanThreeFooterButtons()
    }

    return (
        <View style={[styles.buttonsContainer, buttonContainerStyle]}>
          {buttons.map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.button}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={btn.text}
            >
              {renderFooterButtonIcon(btn.type)}
              <Text style={[styles.buttonText, buttonTextStyle]}>
                {btn.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )
    
  }

  const renderMoreThanThreeFooterButtons=()=>{
     // Show first two buttons
      const firstTwo = buttons.slice(0, 2);
    return(

       <View style={[styles.buttonsContainer, buttonContainerStyle]}>
          {firstTwo.map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.button}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={btn.text}
            >
              {renderFooterButtonIcon(btn.type)}
              <Text style={[styles.buttonText, buttonTextStyle]}>
                {btn.text}
              </Text>
            </TouchableOpacity>
          ))}

          {/* "See All Options" button */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="See All Options"
            onPress={() => setShowAllOptions(true)}
          >
           <PreviewHambugerSvgIcon/>
            <Text style={[styles.buttonText, buttonTextStyle]}>
              {SeeAllOptionsLabel}
            </Text>
          </TouchableOpacity>
        </View>
    )
  }

    // Render a single button (used both in footer and inside modal)
  const renderButtonItem = useCallback(
    ({ item, index }) => (
      <View>
      <TouchableOpacity
        key={index}
        style={[styles.button, styles.modalButton]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={item.text}
      >
        <View style={styles.modalButtonIconContainer}>
        {renderFooterButtonIcon(item.type, "grey")}
        </View>
        <Text style={[styles.buttonText, styles.modalButtonText, buttonTextStyle]}>{item.text}</Text>
      </TouchableOpacity>
      </View>
    ),
    [renderFooterButtonIcon, buttonTextStyle]
  );

   const showAllButtonListModal=()=>{
          return (
              <ModalBottom
                  title={AllOptionsLabel}
                  open={showAllOptions}
                  onClose={()=>setShowAllOptions(false)}
                  sideMargin={0}
                  style={{ }}
              >
                  <View>
                      <FlatList
                      style={styles.modalButtonList}
                      scrollEnabled={false}
                      data={buttons}
                      renderItem={renderButtonItem}
                      keyExtractor={(_, index)=>index.toString()}
                      />
                  </View>
  
              </ModalBottom>
          )
      }


  return (
    <View styl={styles.wrapper}>
      <View style={[styles.bubbleContainer, { width: bubbleWidth }]}>
        <Triangle />
        <View style={[styles.bubble,  headerType === "NONE" && styles.noHeaderBubble]}>
          {/* Header */}
          <View style={styles.headerContainer}>
            {renderHeader()}
          </View>
          
          {/* Body */}
          {renderBody()}

          {/* Footer Text */}
          {renderFooterText()}

          {/* Timestamp */}
          {renderTimeStamp()}

          {/* Footer Buttons */}
          {renderFooterButtons()}
        </View>
      </View>
       {showAllButtonListModal()}
    </View>
  );
}

TemplatePreviewBubble.propTypes = {
  headerType: PropTypes.oneOf(['NONE','TEXT','IMAGE', 'VIDEO', 'DOCUMENT']),
  headerText: PropTypes.string,
  headerMedia: PropTypes.shape({
    uri: PropTypes.string.isRequired,
    name: PropTypes.string,
    mime: PropTypes.string
  }),
  bodyText: PropTypes.string.isRequired,
  footerText: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      text: PropTypes.string.isRequired,
      payload: PropTypes.any
    })
  ),
  // style overrides
  bodyStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  footerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonTextStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

// TemplatePreviewBubble.defaultProps = {
//   headerType: 'NONE',
//   footerText: '',
//   buttons: [],
//   timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
// };

const styles = StyleSheet.create({
   wrapper: {
    marginVertical: rh(3),
    marginHorizontal: rw(3.5),
   
  },
    bubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: rw(3.5),
    marginVertical: rh(3),

  },
  bubble: {
    backgroundColor: colors.white,
    borderTopRightRadius: rw(2.5),
    borderBottomRightRadius: rw(2.5),
    borderBottomLeftRadius: rw(2.5),
    // paddingHorizontal: rw(1.5),
    paddingVertical: rh(0.5),
    // shadowOpacity: 0.1,
    // shadowRadius: rw(2),
    // elevation: 2,
    minWidth: rw(35),
  },
  noHeaderBubble:{
    paddingTop: rh(0)
  },
    triangle: {
    width: 0,
    height: 0,
    borderTopWidth: rh(0),
    borderBottomWidth: rh(1.8),
    borderRightWidth: rw(3),
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.white,
    marginRight: rw(-1),
  },
  headerContainer:{
    paddingHorizontal: rw(1.2),
  },
  headerText: {
    fontSize: rf(2),
    fontWeight: 'bold',
    color: colors.black,
  },
  media: {
    borderRadius: rw(2.5),
  },
  headerVideo: {
    backgroundColor: '#000'
  },
  headerDoc: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    padding: rw(2.5),
    backgroundColor: '#F0F0F0',
    borderRadius: rw(1),
    // marginBottom: rh(0.5)
  },
  headerDocText: {
    flex: 1,
    marginLeft: rw(2.8),
    fontSize: rf(1.8),
    color: colors.black,
    textDecorationLine: 'underline',
    fontWeight: 'bold'
  },
  bodyContainer: {
    // marginBottom: rh(0.5),
    paddingHorizontal: rw(1.5),
  },
  bodyText: {
    fontSize: rf(1.8),
    color: colors.WhatsappTemplateTextgreyColor,
    fontWeight: '400',
    // lineHeight: rf(1.8),
  },
  footerText: {
    fontSize: rf(1.6),
    color: colors.grey,
    // marginBottom: rh(0.5),
    paddingHorizontal: rw(1.5),
  },
  buttonsContainer: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    marginTop: rh(0.4),
    width: '100%'
  },
  button: {
    flexDirection: 'row',
    borderTopWidth: 1.2,
    borderTopColor: "#EEE",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rh(1.2),
    paddingHorizontal: rw(3),
    // backgroundColor: '#F2F4F7',
    width: '100%'
  },
  modalButton:{
    borderTopWidth: 0,
   justifyContent: "flex-start",
   paddingHorizontal: rw(1)
  },
  modalButtonList:{
    paddingVertical: rh(0.8),
  },
  buttonText: {
    fontSize: rf(1.6),
    color: colors.green,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: rw(1.6)
  },
  modalButtonIconContainer:{
    marginRight: rw(1),
  },
  modalButtonText:{
    color: colors.lightGrey,
    textAlign: 'left',
  },
  timestamp:{
    alignSelf: 'flex-end',
    fontSize: rf(1.6),
    color: colors.grey,
    // marginBottom: rh(0.5),
    paddingHorizontal: rw(1.5),
  },
  imageSkeleton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    borderRadius: rw(2.5),
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: rw(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageErrorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    borderRadius: rw(2.5),
  },
  imageErrorText: {
    color: colors.red,
    fontSize: rf(1.6),
    fontWeight: 'bold',
  },
  imageLoading: {
    opacity: 0.7,
  },
});

export default React.memo(TemplatePreviewBubble);
