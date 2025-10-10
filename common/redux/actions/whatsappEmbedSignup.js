import { WHATSAPP_END_POINT } from "../../Constants";
import { saveWhatsappUser, toastShow } from "../../helpers/utils";
import { WhatsappEmbedSignup } from "../action-consts";
import store from "../store";



export const startLoading=(message)=>({
    type: WhatsappEmbedSignup.LOAD_WHATSAPP_SIGNUP,
    payload: message
})

export const stopLoading=()=>({
    type: WhatsappEmbedSignup.STOP_LOADING_WHATSAPP_SIGNUP
})

export const verifyOtpLoginSuccess=(data)=>({
    type: WhatsappEmbedSignup.VERIFY_OTP_SUCCESS_WHATSAPP_LOGIN,
    payload: data
})

export const updateUserEmbedSignupIntegrationStatus=()=>({
    type: WhatsappEmbedSignup.UPDATE_USER_EMBED_SIGNUP_INTEGRATION_STATUS
})

export const setWhatsappTemplatesList=(data)=>({
    type: WhatsappEmbedSignup.SET_WHATSAPP_TEMPLATES_LIST,
    payload: data
})

export const startTemplatesListLoading=()=>({
    type: WhatsappEmbedSignup.LOAD_TEMPLATES_LIST
})

export const stopTemplatesListLoading=()=>({
    type: WhatsappEmbedSignup.STOP_LOADING_TEMPLATES_LIST
})

// Pagination action creators - simplified
export const setTotalPages = (totalPages) => ({
    type: WhatsappEmbedSignup.SET_TOTAL_PAGES,
    payload: totalPages
});

export const hydrateWhatsappUser = (user) => ({
  type: WhatsappEmbedSignup.HYDRATE_WHATSAPP_USER,
  payload: user,   // { whatsappAccessToken, whatsappRefreshToken, whatsappIntegration }
});

export const resetWhatsappUser=()=>({
    type: WhatsappEmbedSignup.RESET_WHATSAPP_USER
})

export const registerWhatsapp=()=>{
    return async (dispatch, getState) =>{
        dispatch(startLoading('Checking your whatsapp signup info....'))
        const obj=store.getState()
        const {actual_username, user_name, mobile_no, user_id}=obj.global.user

         const userData={
                name: actual_username ? actual_username: 'unknown',
                email: user_name,
                mobile: mobile_no,
                role: 'admin',
                user_id: user_id
            }
        console.log(userData, 'nomal')
       
        const URL=`${WHATSAPP_END_POINT}auth/register`
        console.log(URL, 'this is url')
        try{
            const response=await fetch(URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                 },
                body: JSON.stringify(userData)
            })

            //  const data=await response.json();
            // console.log(data, 'data')
            // User already exists
            if(!response.ok){
                // console.log(response, 'respoonse++>')
                toastShow('Register failed please try again')
                return false
            }
            const data=await response.json();
            console.log(data, 'register data=======>')
            if(data){
                toastShow(data.message)
                return data
            }
            // toastShow(`${data.message}, Please login now.`)
            // toastShow('You are registered user')
            // return true
        }catch(error){
            console.log(error, 'catch error', )
            toastShow(error.message)
        }finally{
            dispatch(stopLoading())
        }

    }
}


export const loginWhatsapp=(bodyData)=>{
    return async (dispatch, getState) =>{
        dispatch(startLoading('Logging in....'))
        const URL=`${WHATSAPP_END_POINT}auth/login`
       
        try{
            const response=await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData)
            })

            if(!response.ok){
                console.log(response, 'respoonse++>')
                toastShow('Login failed please try again')
                return false
            }

            const data=await response.json()
            console.log(data, 'login data')

            //  if(data.message==="User not found"){
            //     toastShow(`${data.message}, Initializing Auto registration!`)
            //     // await dispatch(registerWhatsapp())
            //      return false
            // }
            // if(data.message!=='OTP sent successfully'){
            //     toastShow(data.message)
            //     return false
            // }
           
            if(data){
                toastShow(data.message)
            return data
            }
            

        }catch(error){
            console.log(error, 'catch error')
            toastShow(error.message)
        }finally{
            dispatch(stopLoading())
        }
    }
}


export const verifyLoginOtp=(userData)=>{
    return async (dispatch, getState) =>{
        dispatch(startLoading('Verfying OTP....'))
        const URL=`${WHATSAPP_END_POINT}auth/verifyotp`
        console.log(JSON.stringify(userData))
        try{
            const response=await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData)
            })

             const data=await response.json()
            console.log(data, ' otp verify data')
             if(!response.ok){
                console.log(response, 'respoonse++>')
                toastShow('OTP verification failed please try again')
                return false
            }

           

            if(data.message!=="OTP verified successfully"){
                toastShow(data.message)
                return data
            }
            toastShow(data.message)
            const user={
                whatsappAccessToken: data.accessToken,
                whatsappRefreshToken: data.refreshToken,
                whatsappIntegration: true,
            }
            saveWhatsappUser(user)
           await dispatch(verifyOtpLoginSuccess(user))
            return data
        }catch(error){
            console.log(error, 'catch error')
            toastShow(error.message)
        }finally{
            dispatch(stopLoading())
        }
    }
}


export const registerEmbedWhatsapp=(code, token)=>{
    return async (dispatch, getState)=>{
        dispatch(startLoading("Setting up WhatsApp Business Account..., Don't press go back!"))
        const URL = `${WHATSAPP_END_POINT}whatsappauth?code=${code}`
        try{
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const data=await response.json()
            console.log(data, 'data')
            if(data.message==="Unauthorized"){
                toastShow('Session expired please login again')
                return 'token expired'
            }

            if(!response.ok){
                // console.log(response, 'respoonse++>')
                toastShow('Failed to Embedded whatsappn register')
                return false
            }
             console.log(data, 'embedded success api')
            if(data.message!=="WhatsApp authentication created successfully"){
                toastShow(data.message)
                return false
            }
            toastShow(data.message)
            return true
           

        } catch(error){
            console.log(error, 'catch error')
            toastShow(error.message)
        }finally{
            dispatch(stopLoading())
        }
    }
}

export const getWhatsappTemplatesList=(token, page = 1, isLoadMore = false)=>{
    return async (dispatch, getState)=>{
        if (!isLoadMore) {
            dispatch(startTemplatesListLoading());
        }
        const URL = `${WHATSAPP_END_POINT}getmytemplate?page=${page}`

        try{
            const response = await fetch(URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

            })

            const data =await response.json()
            console.log(data, 'tmeplate data')
            if(data.message==="Unauthorized"){
                return 'token expire'
            }

            // Handle different response structures
            const templates = data.matchedTemplates || data.templates || data.data || [];
            const totalPages = data.totalPages || 1;
            
            if(templates && templates.length >= 0){
                const currentState = getState().whatsappEmbedSingnup;
                let updatedTemplatesList;
                
                if (isLoadMore) {
                    // Append new templates to existing list
                    updatedTemplatesList = [...currentState.whatsappTemplatesList, ...templates];
                } else {
                    // Replace templates list for fresh load
                    updatedTemplatesList = templates;
                }
                
                dispatch(setWhatsappTemplatesList(updatedTemplatesList));
                dispatch(setTotalPages(totalPages));
                
                return templates;
            }
            
        }catch(error){
            console.log(error, 'catch error')
            toastShow(error.message)
        }finally{
            dispatch(stopTemplatesListLoading())
        }
    }
}

export const setWhatsappPin=(pin, token)=>{
    return async (dispatch, getState)=>{
        dispatch(startLoading('Setting WhatsApp Pin..., Hold on a moment!'))
        const URL = `${WHATSAPP_END_POINT}register`
        const body={
            "pin":pin
        }
        try{
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body),
            })
            const data =await response.json()
            console.log(data, 'pin data')

            if(!response.ok){
                toastShow('Setting WhatsApp pin failed, please try again')
                return false
            }

            if(data.message!=="Register number successful"){
                toastShow(data.message)
                return false
            }
            toastShow(data.message)
            return true
        }catch(error){
            console.log(error, 'catch error')
            toastShow(error.message)
        }finally{
            dispatch(stopLoading())
        }
    }
}


export const sendTemplate=(body, token)=>{
    return async (dispatch, getState)=>{
        dispatch(startLoading(''))
        const URL = `https://a688-223-233-76-156.ngrok-free.app/sendtemplate`

        try{
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body),
            })

            if(!response.ok){
                toastShow('Sending WhatsApp template failed, please try again')
                return false
            }

             const data =await response.json()
            console.log(data, 'sending template data')

            if(!data.success && data.message!=="Template sent successfully"){
                toastShow(data.message)
                return
            }
            toastShow(data.message)
            return
        }catch(error){
            console.log(error, 'catch error')
            toastShow(error.message)
        }finally{
            dispatch(stopLoading())
        }
    }
}