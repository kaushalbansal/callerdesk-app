import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import MySearch from '../../common/components/inputs';
import { Phone } from '../../common/icons/Contactdetailsicons/phone';
import { AccHName } from '../../common/Constants';
import { colors } from '../../themes/vars';
const Contacts = () => {
  const [setData] = useState([]);
  const [setLoading] = useState(true); // Initialize loading state to true
  const [imageUrl, setImageUrl] = useState(true); // Initialize loading state to true
  const url = '';

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setImageUrl(json.imageUrl); // Assuming imageUrl is the property containing the image URL
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <MySearch />
        <View>
          {/* {loading ? ( // Use the loading state here to conditionally render the ActivityIndicator
            <ActivityIndicator />
          ) : (
            data.map((post) => ( */}
          <View
            style={styles.ContactCard}
            // key={post.id} // Assuming there's an "id" property in your contact data
          >
            <View style={styles.contactsImg}>
              <Image source={{ uri: imageUrl }} style={styles.contactsImg} />
            </View>
            <View style={styles.accName}>
              <Text>{AccHName}</Text>
            </View>
            <View style={styles.phone}>
              <Phone />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default Contacts;

const styles = StyleSheet.create({
  ContactCard: {
    alignItems: 'center',
    borderBottomColor: colors.answeredCallsLabel,
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 16,
    width: '100%',
  },
  accName: { paddingHorizontal: 16 },
  contactsImg: {
    alignItems: 'center',
    borderRadius: 35,
    color: colors.white,
    elevation: 5,
    height: 35,
    justifyContent: 'center',
    resizeMode: 'contain',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 35,
    // Drop shadow for iOS
  },
  container: { width: '100%' },
  content: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 16,
    width: '100%',
  },
  phone: { position: 'absolute', right: '2%' },
});
