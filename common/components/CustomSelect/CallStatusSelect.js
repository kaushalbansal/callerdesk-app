import React, { useState, useEffect } from 'react';
import { Text, Select, SelectItem, IndexPath } from '@ui-kitten/components';

import { IconCold } from '../../icons/iconcold';
import { IconWarm } from '../../icons/iconwarm';
import { IconHot } from '../../icons/iconhot';
import { IconInvalid } from '../../icons/contactstatus';
import { IconProspect } from '../../icons/iconprospect';
import { IconDisqualified } from '../../icons/icondisqualified';
import { contactStatusList } from '../../Constants';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

const CallStatusSelect = ({
  selectedIndex = new IndexPath(0),
  onChange = (val = { id: 0, name: 'All' }, index = new IndexPath(0)) => {},
  accessoryRight,
}) => {
  const [value, setValue] = useState(new IndexPath(0));

  useEffect(() => {
    setValue(selectedIndex);
  }, [selectedIndex]);

  const StatusComponent = ({ title }) => {
    return (
      <View style={styles.statusContainer}>
        {title === 'Cold' ? <IconCold /> : <></>}
        {title === 'Warm' ? <IconWarm /> : <></>}
        {title === 'Hot' ? <IconHot /> : <></>}
        {title === 'Prospect' ? <IconProspect /> : <></>}
        {title === 'Disqualified' ? <IconDisqualified /> : <></>}
        {title === 'Invalid' ? <IconInvalid /> : <></>}
        <Text style={styles.statusTitle}>{title}</Text>
      </View>
    );
  };

  const onSelect = (index) => {
    setValue(index);
    onChange(contactStatusList.filter((x) => x.id === index.row)[0], index);
  };

  return (
    <>
      <Select
        selectedIndex={value}
        onSelect={onSelect}
        accessoryRight={accessoryRight}
        value={() => (
          <StatusComponent title={contactStatusList[value.row]?.name || ''} />
        )}
      >
        <SelectItem
          title={() => {
            return (
              <View style={styles.select}>
                <Text style={styles.all}>All</Text>
              </View>
            );
          }}
        />
        <SelectItem
          title={() => {
            return (
              <View style={styles.select}>
                <IconHot />
                <Text>Hot</Text>
              </View>
            );
          }}
        />
        <SelectItem
          title={() => {
            return (
              <View style={styles.select}>
                <IconWarm />
                <Text>Warm</Text>
              </View>
            );
          }}
        />
        <SelectItem
          title={() => {
            return (
              <View style={styles.select}>
                <IconCold />
                <Text>Cold</Text>
              </View>
            );
          }}
        />
        <SelectItem
          title={() => {
            return (
              <View style={styles.select}>
                <IconInvalid />
                <Text>Invalid</Text>
              </View>
            );
          }}
        />
        <SelectItem
          title={() => {
            return (
              <View style={styles.select}>
                <IconDisqualified />
                <Text>Disqualified</Text>
              </View>
            );
          }}
        />
        <SelectItem
          title={() => {
            return (
              <View style={styles.select}>
                <IconProspect />
                <Text>Prospect</Text>
              </View>
            );
          }}
        />
      </Select>
    </>
  );
};

export default CallStatusSelect;

const styles = StyleSheet.create({
  all: { marginLeft: 12 },
  select: { flexDirection: 'row', gap: 12 },
  statusContainer: { flexDirection: 'row' },
  statusTitle: { marginLeft: 12 },
});
CallStatusSelect.propTypes = {
  selectedIndex: PropTypes.object,
  onChange: PropTypes.func,
  title: PropTypes.string,
  from: PropTypes.string,
  sideMargin: PropTypes.number,
  height: PropTypes.string,
  onClose: PropTypes.func,
  accessoryRight: PropTypes.node,
};
