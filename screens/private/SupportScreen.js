import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../themes/vars';
import { FAQText, VisitUs } from '../../common/Constants';
import CustomHeader from '../../common/components/CustomHeader';
import { rf, rh, rw } from '../../common/helpers/dimentions';
import { IconArrowRight } from '../../common/icons/iconarrowright';
import { useNavigation } from '@react-navigation/native';
import { FaqIcon } from '../../common/icons/faqicon';
import { VisitIcon } from '../../common/icons/visiticon';
import PropTypes from 'prop-types';

const SupportScreen = () => {
  const nav = useNavigation();

  const ListCard = ({ title = '', mt = 0, onPress = () => {}, icon }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{ width: rw(95), alignSelf: `center` }}
      >
        <View style={[styles.flexRow, { marginTop: mt }]}>
          <View style={styles.iconStyl}>
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
          <View style={styles.arrow}>
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
      <CustomHeader title="Support" />
      <ListCard
        title={VisitUs}
        onPress={() => {
          nav.navigate(`VisitUs`);
        }}
        mt={16}
        icon={<VisitIcon color={colors.primary} size={15} />}
      />
      <ListCard
        title={FAQText}
        onPress={() => nav.navigate('Faq')}
        icon={<FaqIcon size={16} />}
      />
    </ScrollView>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  arrow: {
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
  iconStyl: { alignItems: `center`, flexDirection: `row`, width: '85%' },
});
