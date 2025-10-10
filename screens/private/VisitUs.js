import { StyleSheet, Text, View, Pressable, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { toastShow } from '../../common/helpers/utils';
import { colors } from '../../themes/vars';
import {
  BizRequirement,
  BizRequirementEmail,
  SubmitText,
} from '../../common/Constants';
import CustomHeader from '../../common/components/CustomHeader';
import { rh, rw } from '../../common/helpers/dimentions';
import TextInputWithIcon from '../../common/components/textinputwithicon';
import TextArea from '../../common/components/TextArea';

const VisitUs = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [companyName, setCompanyName] = useState();
  const [text, setText] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const validEmailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validEmailRegex.test(email);
  };
  
  const validatePhoneNumber = (phone) => {
    const validPhoneRegex = /^\d{10}$/;
    return validPhoneRegex.test(phone);
  };
  
  const onSubmit = async () => {
    Keyboard.dismiss();
    const isFormValid =
      name &&
      validateEmail(email) &&
      phoneNumber &&
      validatePhoneNumber(phoneNumber) &&
      companyName &&
      text;
  
    if (!isFormValid) {
      toastShow('Fill form properly');
      return;
    }
  
    const payload = {
      name,
      email,
      phoneNumber,
      companyName,
      text,
    };
  
    try {
      setIsLoading(true);
  
      const response = await fetch('https://www.apibuild.callerdesk.io/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      
      if(response.ok){
        toastShow('Query sent successfully');
        setName('');
        setEmail('');
        setPhoneNumber('');
        setCompanyName('');
        setText('');
      }else{
        toastShow("Failed to send query. Please try again.")
      }
     
    } catch (error) {
      console.error('Submission error:', error);
      toastShow('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <CustomHeader title="Contact us" />
      <View style={{ backgroundColor: colors.white, justifyContent: `center` }}>
        <TextInputWithIcon
          from={`contact`}
          value={name}
          placeholder="Name"
          style={{ width: rw(90), marginTop: rh(1.5) }}
          onChangeText={(value) => setName(value)}
        ></TextInputWithIcon>
        <TextInputWithIcon
          from={`contact`}
          value={email}
          placeholder="Contact Email"
          inputMode={'email-address'}
          style={{ width: rw(90) }}
          onChangeText={(value) => setEmail(value)}
        ></TextInputWithIcon>
        <TextInputWithIcon
          from={`contact`}
          value={phoneNumber}
          placeholder="Contact Number"
          inputMode={'phone-pad'}
          style={{ width: rw(90) }}
          onChangeText={(value) => setPhoneNumber(value)}
        ></TextInputWithIcon>
        <TextInputWithIcon
          from={`contact`}
          value={companyName}
          placeholder="Company Name"
          style={{ width: rw(90) }}
          onChangeText={(value) => setCompanyName(value)}
        ></TextInputWithIcon>
        <TextArea
          from={`contact`}
          value={text}
          placeholder="Message"
          style={{ width: rw(90) }}
          onChange={(value) => setText(value)}
        />
        <Pressable style={styles.btn} onPress={onSubmit}>
          <Text style={styles.btnText}>
            {isLoading ? 'Submitting' : SubmitText}
          </Text>
        </Pressable>
        <Text style={[styles.text, { marginTop: rh(2) }]}>
          {BizRequirement}
        </Text>
        <Text style={styles.textEmail}>{BizRequirementEmail}</Text>
      </View>
    </View>
  );
};

export default VisitUs;

const styles = StyleSheet.create({
  btn: {
    alignSelf: `center`,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginTop: rh(2),
    paddingVertical: rh(1),
    width: rw(90),
  },
  btnText: { color: colors.white, fontWeight: `700`, textAlign: `center` },
  container: { backgroundColor: colors.white, flex: 1 },
  text: { letterSpacing: 0, textAlign: `center` },
  textEmail: {
    color: colors.black,
    fontWeight: `700`,
    letterSpacing: 0,
    textAlign: `center`,
  },
});
