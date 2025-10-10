import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '../../../../themes/vars';
import DepartIncoming from './DepartIncoming';
import Incoming from './Incoming';
import { rh, rw } from '../../../../common/helpers/dimentions';
import {
  loadCallGroupList,
  saveIncomincomingIvr,
} from '../../../../common/redux/actions/voiceTemplate';
import {
  IVRSave,
  InIVRSaved,
  InIVRSavedError,
} from '../../../../common/Constants';
import CustomHeader from '../../../../common/components/CustomHeader';

const CallFlowJourney = () => {
  // eslint-disable-next-line no-unused-vars
  const [type, setType] = useState(0);
  const incRef = useRef();
  const dispatch = useDispatch();
  const { user, profile, loading } = useSelector((state) => state.global);
  const { callGroupList } = useSelector((state) => state.voiceTemplate);

  useEffect(() => {
    if (callGroupList.length === 0) {
      dispatch(loadCallGroupList(user?.authcode));
    }
  }, []);

  const formatCallGroup = (list) => {
    const _list = [];
    list.map((x) =>
      _list.push({ id: x.group_id, group_id: x.group_id, label: x.group_name }),
    );
    return _list;
  };

  const onSave = () => {
    let _ivrData = false;
    if (type === 0) {
      // save incoming
      _ivrData = incRef.current.getData();

      if (_ivrData) {
        _ivrData.did_id = profile.did_id.split(',')[0];
        saveIncomincomingIvr(user?.authcode, _ivrData)
          .then((res) => {
            alert(InIVRSaved);
          })
          .catch(() => {
            alert(InIVRSavedError);
          });
      }
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Call Flow Journey"></CustomHeader>
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.contentContainerStyle}
        >
          {type === 0 && (
            <Incoming
              ref={incRef}
              callGroupList={formatCallGroup(callGroupList)}
            />
          )}
          {type === 1 && <DepartIncoming />}
        </ScrollView>

        <Button disabled={loading} style={styles.button} onPress={onSave}>
          {IVRSave}
        </Button>
        <View style={styles.line}></View>
      </View>
    </View>
  );
};

export default CallFlowJourney;

const styles = StyleSheet.create({
  button: { marginTop: rh(2), width: '100%' },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: rw(3.5),
    paddingTop: rh(1),
  },
  contentContainer: { alignItems: 'center' },
  contentContainerStyle: { width: '100%' },
  line: { minHeight: 50 },
});
