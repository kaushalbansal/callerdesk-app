import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../themes/vars';
import { PrivacyLabel, TnS } from '../../common/Constants';
import CustomHeader from '../../common/components/CustomHeader';
import { rf, rh, rw } from '../../common/helpers/dimentions';
import { IconArrowRight } from '../../common/icons/iconarrowright';
import { useNavigation } from '@react-navigation/native';
import { PrivacyIcon } from '../../common/icons/privacyicon';
import { TermsServiceIcon } from '../../common/icons/termsofserviceicon';
import PropTypes from 'prop-types';

const LegalScreen = () => {
  const nav = useNavigation();
  const ListCard = ({ title = '', mt = 0, onPress = () => {}, icon }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{ width: rw(95), alignSelf: `center` }}
      >
        <View style={[styles.flexRow, { marginTop: mt }]}>
          <View style={styles.flexRow1}>
            {icon}
            <Text
              style={{
                fontSize: rf(2),
                fontWeight: `400`,
                color: colors.black,
                marginLeft: rw(2),
              }}
            >
              {title}
            </Text>
          </View>
          <View style={styles.arrowStyle}>
            <IconArrowRight />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  ListCard.propTypes = {
    title: PropTypes.string,
    mt: PropTypes.number,
    onPress: PropTypes.func,
    icon: PropTypes.object,
  };
  return (
    <ScrollView style={styles.container}>
      <CustomHeader title="Legal" />
      {/* <ListCard
          title={CommunityLabel}
          mt={16}
          icon={<LegalIcon size={15}/>}
        /> */}
      <ListCard
        title={PrivacyLabel}
        //   onPress={() => handleLinkPress(urls.privacyPolicy)}
        onPress={() => nav.navigate('Privacy')}
        icon={<PrivacyIcon size={15} />}
      />
      <ListCard
        title={TnS}
        //   onPress={() => handleLinkPress(urls.termsOfUse)}
        onPress={() => nav.navigate('TNC')}
        icon={<TermsServiceIcon size={15} />}
      />
    </ScrollView>
  );
};

export default LegalScreen;

const styles = StyleSheet.create({
  arrowStyle: {
    alignItems: 'flex-end',
    paddingRight: rw(1.4),
    width: '15%',
  },
  container: { backgroundColor: colors.white, width: '100%' },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: rh(1.5),
  },
  flexRow1: { alignItems: `center`, flexDirection: `row`, width: '85%' },
});
