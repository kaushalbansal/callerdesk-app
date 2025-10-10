
// src/components/TemplateWizardMediaUploader.js
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import * as DocPickerModule from '@react-native-documents/picker';
// import  DocumentPicker from 'react-native-document-picker'
import { launchImageLibrary } from 'react-native-image-picker';
import { rw, rh, rf } from '../helpers/dimentions';
import { colors } from '../../themes/vars';
import PropTypes from 'prop-types';
import { ClickToUploadLabel, MaxFileSizeLabel, WhatsappTemplateWizardMediaSubtitle } from '../Constants';
import MediaImageSvgIcon from '../icons/MediaImageSvgIcon';
import MediaVideoSvgIcon from '../icons/MediaVideoSvgIcon';
import MediaDocSvgIcon from '../icons/MediaDocSvgIcon';
import MediaDeleteSvgIcon from '../icons/MediaDeleteSvgIcon';
import { uploadMedia } from '../redux/actions/templateWizardWhatsapp';
import { useDispatch, useSelector } from 'react-redux';
import { formatFileSize } from '../helpers/utils';


async function pickDocumentSingle() {
  // Newer package exposes 'pick' or 'pickSingle' etc. We try multiple paths for compatibility.
  try {
    // 1) New API: pick({ multiple: false, type: [types.allFiles] })
    if (typeof DocPickerModule.pick === 'function') {
      const types = DocPickerModule.types || DocPickerModule.Type || {};
      // pick may return array or single item depending on API/version
      const res = await DocPickerModule.pick({
        allowMultiSelection: false,
        // some versions use `type: [types.allFiles]`, some use `types` naming:
        type: Array.isArray(types.allFiles) ? types.allFiles : [types.allFiles ?? types.all],
      }).catch((err) => { throw err; });

      // normalize
      const item = Array.isArray(res) ? res[0] : res;
      return item
      // return {
      //   uri: item.uri || item.fileCopyUri || item.file || item.path,
      //   name: item.name || item.fileName || item.filename || (item.uri ? item.uri.split('/').pop() : ''),
      //   size: item.size || item.fileSize || 0,
      //   mime: item.type || item.mimeType || item.mime || '',
      // };
    }


    // If nothing matched, throw to be caught below
    throw new Error('Document picker API not found');
  } catch (err) {

    const msg = (err && (err.message || err.toString())).toLowerCase();
    if (
      err?.code === 'DOCUMENT_PICKER_CANCELED' ||
      err?.name === 'DocumentPickerCancel' ||
      msg?.includes('cancel') ||
      msg?.includes('canceled') ||
      msg?.includes('cancelled')
    ) {
      // return { cancelled: true };
    }
    // rethrow for error handling by caller
    throw err;
  }
}


const CONFIG = {
  image: {
    maxSize: 5 * 1024 * 1024,
    extensions: ['jpg','jpeg','png'],
    mimeTypes: ['image/jpeg','image/png'],
    picker: opts => launchImageLibrary({ mediaType: 'photo', selectionLimit: 1, ...opts }),
    checkPermission: async () => {
      if (Platform.OS !== 'android' || Platform.Version >= 33) return true;
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (status !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission required',
          'Please enable storage permission in settings to pick images',
          [{ text: 'Open Settings', onPress: Linking.openSettings() }]
        );
        return false;
      }
      return true;
    },
    icon: <MediaImageSvgIcon/>
  },
  video: {
    maxSize: 16 * 1024 * 1024,
    extensions: ['mp4','3gp'],
    mimeTypes: ['video/mp4','video/3gp'],
    picker: opts => launchImageLibrary({ mediaType: 'video', selectionLimit: 1, ...opts }),
    checkPermission: async () => {
      if (Platform.OS !== 'android' || Platform.Version >= 33) return true;
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (status !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission required',
          'Please enable storage permission in settings to pick videos',
          [{ text: 'Open Settings', onPress: Linking.openSettings() }]
        );
        return false;
      }
      return true;
    },
    icon: <MediaVideoSvgIcon/>
  },
  document: {
    maxSize: 100 * 1024 * 1024,
    extensions: ['txt','xls','xlsx','doc','docx','ppt','pptx','pdf'],
    mimeTypes: [
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/pdf',
    ],
    // picker: () => DocumentPicker.pickSingle({ type: DocumentPicker.types.allFiles }),
    picker: ()=>pickDocumentSingle(),
    // DocumentPicker itself prompts as needed; no extra permission
    checkPermission: async () => true,
    icon: <MediaDocSvgIcon/>
  },
};

function TemplateWizardMediaUploader({
  type = 'image',               // 'image' | 'video' | 'document'
  onFileChange,
  maxFiles = 1,
  style,
  buttonLabel = 'Click to Upload',
  file=null
}) {
  // const [file, setFile] = useState(file);
  const isChecking = useRef(false);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch=useDispatch()
   const {whatsappAccessToken}=useSelector((state)=>state?.whatsappEmbedSingnup)

  const config = CONFIG[type];

  const handleAdd = useCallback(async () => {
    if (isChecking.current) return;
    isChecking.current = true;

    try {
      // 1️⃣ Permission
      const ok = await config.checkPermission();
      if (!ok) return;

      // 2️⃣ Pick
      const result = await config.picker();
      // image-picker returns an object with .assets; document-picker returns the file
      const asset = Array.isArray(result.assets)
        ? result.assets[0]
        : result;
      console.log(asset, 'asset')
      // 3️⃣ Cancelled?
      if (asset.didCancel || result.didCancel) {
        return;
      }

      // 4️⃣ Error?
      if (asset.errorCode || result.error) {
        Alert.alert(
          'Picker Error',
          asset.errorMessage || result.error || 'Unknown error'
        );
        return;
      }
      const uri  = asset.uri;
      const name = asset.fileName || asset.name || '';
      const size = asset.fileSize || asset.size || 0;
      const mime = asset.type || '';

      const ext = name.split('.').pop().toLowerCase();

      // 5️⃣ Validate
      if (!config.extensions.includes(ext) || !config.mimeTypes.includes(mime)) {
        Alert.alert('Invalid File', `Allowed: ${config.extensions.join(', ')}`);
      } else if (size > config.maxSize) {
        Alert.alert(
          'File Too Large',
          `Max ${config.maxSize / 1024 / 1024} MB allowed.`
        );
      } else {
        // 6️⃣ Success
        const media={uri, name, size, mime};
        handleUploadeMedia(media)
        console.log(media, 'this is media')
        // onFileChange({ uri, name, size, mime }, "");
      }
    } catch (err) {
      // 📌 DocumentPicker throws on cancel, so catch & ignore
     // catch & ignore cancellation thrown by native pickers
      const msg = (err && (err.message || err.toString())).toLowerCase();
      if (
        err?.code === 'DOCUMENT_PICKER_CANCELED' ||
        err?.name === 'DocumentPickerCancel' ||
        msg?.includes('cancel') ||
        msg?.includes('canceled') ||
        msg?.includes('cancelled')
      ) {
        // user cancelled
        return;
      }
      console.error(err);
      Alert.alert('Upload Error', 'Unexpected error occurred.');
    } finally {
      isChecking.current = false;
    }
  }, [config, onFileChange]);

  const handleRemove = useCallback(()=> {
    // setFile(null);
    onFileChange(null, "");
  }, [onFileChange]);

  const handleUploadeMedia=async(media)=>{
    setIsUploading(true)

    try{
      const result=await dispatch(uploadMedia(media, whatsappAccessToken))
      if( result && result==='token expired'){
        onFileChange(media, 'token expired')
        return
      }

      if(result?.success){
        if(result.facebook_response.h){
          const token=result.facebook_response.h     
          onFileChange(media, token)
           }
      }
    }finally{
      setIsUploading(false)
    }

  }


  return (
    <View style={[styles.container, style]}>
      <Text style={styles.titleText}>{type}</Text>
      <Text style={styles.subtitleText}>{buttonLabel} {WhatsappTemplateWizardMediaSubtitle}</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={handleAdd}>
        <View style={styles.uploadBoxIconContianer}>
        {config.icon}
        </View>
        
        <Text style={styles.uploadText}>
          {ClickToUploadLabel}
        </Text>
        <Text style={styles.subText}>
          ({MaxFileSizeLabel} {config.maxSize / (1024 * 1024)} MB)
        </Text>
      </TouchableOpacity>

      {isUploading ? <ActivityIndicator size={rf(3)} color={colors.primary}/> 

      : file && (
          <View style={styles.fileContainer}>
            <View style={styles.fileContainerHeader}>
              {config.icon}
              <View style={styles.fileContaineHeaderTextContainer}>
                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                {/* <Text style={styles.fileName} numberOfLines={1}>HannahBusing_Resume.png</Text> */}
                <Text style={styles.fileSize}>
                {/* {(file.size / (1024 * 1024)).toFixed(2)} MB */}
                {formatFileSize(file.size)}
                {/* 200 KB */}
                </Text>
              </View>
              <TouchableOpacity  onPress={handleRemove}
              style={styles.removeButton}>
                <MediaDeleteSvgIcon/>
              </TouchableOpacity>
            </View>
            <View style={styles.fileContainerFooter}>
              <View style={styles.fileUploadProgressBar}/>
              <Text style={[styles.fileSize, styles.progressText]}>100%</Text>
            </View>
            
          </View>
         )} 
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: rh(2),
  },
  titleText:{
    textTransform: 'capitalize',
    fontWeight: '500',
    fontSize: rf(2),
    color: colors.black,
    marginBottom: rh(0.5)
  },
  subtitleText:{
    fontSize: rh(1.5),
    color: colors.WhatsappTemplateTextgreyColor,
    // fontFamily: `Lexend`,
    fontWeight: '300',
  },
  uploadBox: {
    borderWidth: 1.5  ,
    borderColor: colors.WhatsappTemplateMediaGreenColor,
    borderStyle: 'dashed',
    borderRadius: rw(2),
    paddingVertical: rw(5),
    alignItems: 'center',
    marginVertical: rh(1.5),
  },
  uploadBoxIconContianer:{
    width: rw(10),
    height: rw(10),
    borderRadius: rw(5),
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rh(1.5)
  },
  uploadText: {
    // fontFamily: "Hind",
    fontSize: rf(1.8),
    color: colors.WhatsappTemplateMediaGreenColor,
    fontWeight:'500',
    textAlign: 'center',
    marginBottom: rh(0.8)
  },
  subText: {
    fontSize: rf(1.45),
    color: colors.WhatsappTemplateMediaGreenColor,
    fontWeight: '400',
    textAlign: 'center'
  },
  list: {
    marginTop: rh(1),
  },
  fileContainer: {
    borderWidth: 0.8,
    borderColor: colors.WhatsappTemplateInputBorderColor,
    borderRadius: rw(1),
    paddingVertical: rh(1.5),
    paddingTop: rh(1.8),
    paddingHorizontal: rw(3),
    // alignItems: 'center',
  },
  fileContainerHeader:{
    flexDirection: 'row',
    marginBottom: rh(0.5),
    // alignItems: 'center',
    // justifyContent: 'center',
    // borderWidth: 1,
  },
  fileContaineHeaderTextContainer:{
    flex: 1,
    marginLeft: rw(3),
    marginRight: rw(1),
  },
  fileName: {
    // fontFamily: 'Hind',
    fontSize: rf(1.8),
    fontWeight: '500',
    lineHeight: rf(2.1),
    marginBottom: rh(0.5),
    color: colors.WhatsTemplateMediaFileNameTextColor,
  },
  fileSize: {
    // fontFamily: 'Poppins',
    fontSize: rf(1.6),
    color: '#989692',
    // fontWeight: '500',
  },
  removeButton: {
    // padding: rw(1),
  },
  fileContainerFooter:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileUploadProgressBar:{
    marginRight: rw(3),
    flex: 1,
    height: rh(0.7),
    backgroundColor: '#009556',
    borderRadius: rw(1),
  },
  progressText:{
    color: colors.WhatsTemplateMediaFileNameTextColor
  }
});

TemplateWizardMediaUploader.propTypes = {
  type: PropTypes.oneOf(['image','video','document']),
  file: PropTypes.oneOfType([
    PropTypes.shape({
      uri:   PropTypes.string.isRequired,
      name:  PropTypes.string.isRequired,
      size:  PropTypes.number.isRequired,
      mime:  PropTypes.string.isRequired,
    }),
    PropTypes.oneOf([null])
  ]),
  onFileChange: PropTypes.func.isRequired,
  maxFiles: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  buttonLabel: PropTypes.string,
};

export default React.memo(TemplateWizardMediaUploader);
