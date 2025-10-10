import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import CustomHeader from '../../../common/components/CustomHeader';
import { IconAddNewContact } from '../../../common/icons/iconaddnewcontact';
import ProfileImg from '../../../common/components/ProfileImg';
import ModalBottom from '../../../common/components/ModalBottom';
import CreateContact from './CreateContact';
import {
  ContactDetailsLabel,
  CreateContactLabel,
} from '../../../common/Constants';
import Editcontact from '../CallLog/EditContact';
import PropTypes from 'prop-types';
import { EditContactIcon } from '../../../common/icons/editcontacticon';

const ContactHeader = ({
  title,
  hideUserIcon = false,
  hideAddIcon = false,
  meta = {},
  data,
  from,
  right = true,
}) => {
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const RightActions = () => {
    return (
      <>
        <View style={styles.rightActions}>
          {!hideUserIcon && (
            <TouchableOpacity>
              <ProfileImg />
            </TouchableOpacity>
          )}
          {!hideAddIcon && (
            <TouchableOpacity
              onPress={() => {
                // nav.navigate("AddContact", {meta})
                setOpenCreateModal(true);
              }}
            >
              {from === `details` ? (
                <EditContactIcon size={26} />
              ) : (
                <IconAddNewContact size={26} />
              )}
            </TouchableOpacity>
          )}
        </View>
        {from === `details` ? (
          <Editcontact
            data={data}
            open={openCreateModal}
            onClose={() => {
              setOpenCreateModal(false);
            }}
          />
        ) : (
          <ModalBottom
            open={openCreateModal}
            title={CreateContactLabel}
            onClose={() => setOpenCreateModal(false)}
          >
            <CreateContact
              meta={meta}
              onClose={() => setOpenCreateModal(false)}
            />
          </ModalBottom>
        )}
      </>
    );
  };

  return (
    <>
      <CustomHeader
        title={title || ContactDetailsLabel}
        right={right || <RightActions />}
      />
    </>
  );
};
export default ContactHeader;

const styles = StyleSheet.create({
  rightActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
});
ContactHeader.propTypes = {
  title: PropTypes.string,
  hideUserIcon: PropTypes.bool,
  hideAddIcon: PropTypes.bool,
  right: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  meta: PropTypes.object,
  data: PropTypes.object,
  from: PropTypes.string,
};
