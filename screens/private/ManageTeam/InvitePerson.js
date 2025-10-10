import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { colors } from '../../../themes/vars';
import MySearch from '../../../common/components/inputs';
import { NoDataFound } from '../../../common/components/NoDataFound';
import { rh, rw } from '../../../common/helpers/dimentions';
import { useSelector } from 'react-redux';
import PhonContactCardTeam from './PhoneContactCardTeam';
import PropTypes from 'prop-types';

const InvitePerson = ({ modalOpen, onSelectNew }) => {
  const contact = useSelector((state) => state.contact);

  const [phoneContacts, setContacts] = useState(contact?.savedList);
  const [quickSearch, setSearch] = useState('');
  const [selected] = useState({});
  const { loading } = useSelector((state) => state.global);
  useEffect(() => {
    if (quickSearch === '') {
      setContacts(contact?.savedList || []);
    } else {
      filterContacts(quickSearch);
    }
  }, [quickSearch, contact.savedList]);

  const filterContacts = (searchText) => {
    const lowercasedSearchText = searchText.toLowerCase();
    const filtered = contact.savedList.filter((contact) => {
      return (
        (contact?.firstName &&
          contact.firstName.toLowerCase().includes(lowercasedSearchText)) ||
        (contact?.lastName &&
          contact.lastName.toLowerCase().includes(lowercasedSearchText)) ||
        (contact?.name &&
          contact.name.toLowerCase().includes(lowercasedSearchText))
      );
    });
    setContacts(filtered);
  };

  const card = useCallback(
    ({ item, index }) => (
      <PhonContactCardTeam
        item={item}
        index={index}
        selected={selected}
        onSelect={onSelect}
        modalOpen={modalOpen}
      />
    ),
    [selected],
  );

  const onSelect = (item) => {
    onSelectNew(item);
  };

  const renderEmptpyFallBackUi=()=>{
     return(
       <NoDataFound msg={`no-contacts`} style={{marginVertical: rh(5), alignSelf: 'center' }}/>
    )
  }

  return (
    <>
      <View style={styles.container}>
        <MySearch
          placeholder="Name"
          onChange={(text) => setSearch(text)}
          enterKeyHint={`search`}
        />
        {!loading && (
          <FlatList
            data={phoneContacts}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={card}
            ListEmptyComponent={renderEmptpyFallBackUi}
            estimatedItemSize={550}
          />
        )}
      </View>
    </>
  );
};

export default InvitePerson;
InvitePerson.propTypes = {
  modalOpen: PropTypes.func,
  onSelectNew: PropTypes.func,
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: rw(2),
  },
});
