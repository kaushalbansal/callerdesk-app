import { ToastAndroid } from "react-native";
import { WHATSAPP_END_POINT } from "../../Constants";
import { mapDisplayToBackend, toastShow } from "../../helpers/utils";
import { TemplateWizardWhatsapp } from "../action-consts";
import { selectWizardState } from "../selectors/templateWizardWhatsapp";


export const nextStep     = () => ({ type: TemplateWizardWhatsapp.NEXT_STEP });
export const prevStep     = () => ({ type: TemplateWizardWhatsapp.PREV_STEP });
export const resetWizard  = () => ({ type: TemplateWizardWhatsapp.RESET_WIZARD });
export const setName      = (name )  => ({ type: TemplateWizardWhatsapp.SET_NAME,      payload: name });
export const setLanguage  = (lang )  => ({ type: TemplateWizardWhatsapp.SET_LANGUAGE,  payload: lang });
export const setHeaderType = (htype)  => ({ type: TemplateWizardWhatsapp.SET_HEADER_TYPE,payload: htype });
export const setHeaderContent=(content)=>({type: TemplateWizardWhatsapp.SET_HEADER_CONTENT, payload: content})
export const setHeaderMedia=(media, mediaToken)=>({type: TemplateWizardWhatsapp.SET_HEADER_MEDIA, payload: {media, mediaToken}})
export const setBodyText  = (text )  => ({ type: TemplateWizardWhatsapp.SET_BODY_TEXT, payload: text });

export const setFooter    = (text )  => ({ type: TemplateWizardWhatsapp.SET_FOOTER,    payload: text });
export const addImage     = (uri  )  => ({ type: TemplateWizardWhatsapp.ADD_IMAGE,     payload: uri });
export const removeImage  = (index )  => ({ type: TemplateWizardWhatsapp.REMOVE_IMAGE,  payload: index });
export const addButton    = (btn  )  => ({ type: TemplateWizardWhatsapp.ADD_BUTTON,    payload: btn });
export const removeButton = (index )  => ({ type: TemplateWizardWhatsapp.REMOVE_BUTTON, payload: index });
export function updateButton(index, newData) {
  return {
    type: TemplateWizardWhatsapp.UPDATE_BUTTON,
    payload: { index, newData },
  };
}
export const setBtnLabel  = (i, l) => ({ type: TemplateWizardWhatsapp.SET_BTN_LABEL, payload: { index: i, label: l } });




// sync action creators
export const createTemplateRequest = () => ({ type: TemplateWizardWhatsapp.CREATE_TEMPLATE_REQUEST });
export const createTemplateSuccess = payload => ({
  type: TemplateWizardWhatsapp.CREATE_TEMPLATE_SUCCESS,
  payload
});
export const createTemplateFailure = error => ({
  type: TemplateWizardWhatsapp.CREATE_TEMPLATE_FAILURE,
  error
});

/**
 * Thunk that builds the body from the current wizard state and calls the API.
 */
export const createTemplate = (token) => async (dispatch, getState) => {
    dispatch(createTemplateRequest());
  
    try {
      // pull all fields at once
      const {
        name,
        language,
        headerType,
        headerData,
        headerTextVariable,
        bodyText,
        bodyTextVars,
        footerText,
        ctaButtons,
        headerUploadedMediaToken
      } = selectWizardState(getState());
  // console.log(headerTextVariable,  "++++", bodyTextVars)
      // assemble components array
      const components = [];
  
      // 1) HEADER
      if (headerType==="TEXT") {
        const {backendText: header_text_backend, exampleRow: header_example}=mapDisplayToBackend(headerData)

        const headerComp={
          type: 'HEADER',
          format: headerType,
          text: header_text_backend
        }

        if(header_example.length>0){
          headerComp.example={
            header_text: header_example
          }
        }

        components.push(headerComp);
      }

      // 1.1) HEADER WITH IMAGE, VIDEO AND DOCUMENT

      if(headerType !=="NONE" && headerType!=="TEXT"){
        const headerComp={
          type: 'HEADER',
          format: headerType,
          example:{
            header_handle:[headerUploadedMediaToken]
          }
        }
        components.push(headerComp)
      }
      const {backendText: body_backend,exampleRow: body_examples}=mapDisplayToBackend(bodyText)
      // 2) BODY
      const bodyComp={
        type: 'BODY',
        text: body_backend
      }

      if(body_examples.length>0){
       

        bodyComp.example={
          body_text:[body_examples]
        }
      }

      components.push(bodyComp)
     
  
      // 3) FOOTER
      if (footerText) {
        components.push({
          type: 'FOOTER',
          text: footerText
        });
      }
  
      // 4) BUTTONS
      if (ctaButtons.length) {
        components.push({
          type:    'BUTTONS',
          buttons: ctaButtons
        });
      }
  
      // full payload
      const payload = {
        name,
        language: language.value,
        category : "MARKETING",
        components
      };
  console.log(JSON.stringify(payload),"==>json paylod", payload, 'normal payload')
      const res = await fetch(`${WHATSAPP_END_POINT}createtemplate`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          Authorization:   `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

       const data = await res.json();

       if(data.message==="Unauthorized"){
                toastShow('Session expired please Signup again')
                return 'token expired'
            }

  
      if (!res.ok) {
        toastShow('Failed to Create template..., Please try again')
        return
        const errText = await res.text();
        throw new Error(errText || res.statusText);
        return 
      }
  
     
      console.log(data, 'data')
      // "Template created successfully"
      // console.log('api respones data', data)
      dispatch(createTemplateSuccess(data));
      toastShow(data.message)
      
      
      return data;
  
    } catch (err) {
      console.log(err, err.message, "api error response==>")
      dispatch(createTemplateFailure(err.message));
      toastShow(err.message)
      throw err;
    }
  };

  export const uploadMedia=(media, token)=>{
    return async (dispatch, getState) =>{
      console.log(media.asset, 'media')
      const file={
        uri: media.uri,
        name: media.name,
        type: media.mime
      }
      console.log(file, 'file')
      try {  
        const formData=new FormData()
        formData.append("file", file)
        formData.append("filename", media.name)
        formData.append("filetype", media.mime)
        formData.append("filelength", media.size)

        console.log(formData, 'formData==.')


        const response=await fetch(`${WHATSAPP_END_POINT}media`, {
          method: 'POST',
          headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
          body: formData
        })

         

          //  if(data.message==="Unauthorized"){
          //       toastShow('Session expired please Signup again')
          //       return 'token expired'
          //   }

        if(!response.ok){
          
          // console.log(data, "data error")
          toastShow("Upload media failed, pleas try again")
          // const data=await response.json()
          // console.log(response, "response error")
          return
        }

        const data=await response.json()
       
         console.log(data, 'data response image')
        if(data.success){
          toastShow("Media upload successfully")
          console.log(data.facebook_response.h, "upload success data")
          return data
        }else{
          console.log(data, "upload failed data")
          toastShow(data?.message)
          return 
        }

       
    }catch(error){
      console.log(error, "catch error")
      toastShow(error.message)
    }finally{

    }
  }
}