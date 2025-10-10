import React from 'react';
import { StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import { colors } from '../../themes/vars';
import { ReviewText, SubmitText } from '../../common/Constants';
import CustomHeader from '../../common/components/CustomHeader';
import { rh, rw } from '../../common/helpers/dimentions';
import { Rating } from 'react-native-ratings';

const RateApp = () => {
  return (
    <ScrollView style={styles.container}>
      <CustomHeader title="Rate App" />
      <Rating
        type="heart"
        ratingCount={5}
        imageSize={30}
        showRating
        fractions={1}
        ratingTextColor={colors.black}
        ratingColor={colors.primary}
      />
      <TextInput
        style={styles.textInput}
        multiline={true}
        numberOfLines={5}
        placeholder={ReviewText}
        placeholderTextColor={colors.grey}
      ></TextInput>
      <Pressable style={styles.btn}>
        <Text style={styles.btnText}>{SubmitText}</Text>
      </Pressable>
    </ScrollView>
  );
};

export default RateApp;

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
  container: { backgroundColor: colors.white, width: '100%' },
  textInput: {
    backgroundColor: colors.white,
    color: colors.black,
    marginTop: rh(1),
  },
});
