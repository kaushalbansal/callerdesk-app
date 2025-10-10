import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Platform,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../themes/vars';
import { IconHome } from '../../common/icons/homeicon';
import { IconContactDetails } from '../../common/icons/iconcontactdetails';
import { IconProfile } from '../../common/icons/iconprofile';
import { Dialbutton } from '../../common/icons/dial';
import { rw } from '../../common/helpers/dimentions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import NoPermissionModal from '../../common/helpers/NoPermissionModal';
import NoAppRoutingModal from '../../common/helpers/NoAppRoutingModal';
import { handleOpenKeypadDialer } from '../../common/helpers/dialerHelpers';
import { IconCall } from '../../common/icons/Contactdetailsicons/iconcall';
import PropTypes from 'prop-types';

const BottomTabs = ({ state, navigation }) => {
  const [showDiler, setShowDiler] = useState(false);
  const [showDilerAppRoute, setShowDilerAppRoute] = useState(false);
  const device = Dimensions.get('window');
  const [, setUserRole] = useState();
  const [role, setRole] = useState();
  const { user, selectedDialerMode } = useSelector((state) => state.global);
  const dispatch = useDispatch();

  const getRole = async () => {
    const ans = await AsyncStorage.getItem('user_role');
    const ansRole = await AsyncStorage.getItem('role');
    setUserRole(ans);
    setRole(ansRole);
  };

  useEffect(() => {
    getRole();
  }, []);
  return (
    <>
      <View style={tabStyles.container}>
        <Image
          style={tabStyles.imageStyle}
          source={require('../../assets/tabimg.png')}
        />
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableHighlight
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={
                route.name === `CallLogTab`
                  ? tabStyles.tabButtonGraph
                  : route.name === `Contact`
                    ? tabStyles.tabButtonContact
                    : route.name === `Home`
                      ? tabStyles.tabButton
                      : route.name === `Profile`
                        ? tabStyles.tabButtonProfile
                        : tabStyles.tabButtonDefault
              }
              underlayColor="transparent"
            >
              <View style={isFocused ? {} : {}}>
                {route.name === 'Home' && (
                  <IconHome color={isFocused ? colors.primary : undefined} />
                )}
                {route.name === 'CallLogTab' && (
                  <IconCall
                    color={isFocused ? colors.primary : undefined}
                    size={21}
                  />
                )}
                {route.name === 'Contact' && (
                  <IconContactDetails
                    color={isFocused ? colors.primary : undefined}
                  />
                )}
                {route.name === 'Profile' && (
                  <IconProfile color={isFocused ? colors.primary : undefined} />
                )}
              </View>
            </TouchableHighlight>
          );
        })}
        <View
          style={[
            tabStyles.notch,
            { left: device.width / 2 + 0.5, transform: [{ translateX: -39 }] },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              if(selectedDialerMode===1){
                setShowDiler(true)
              }else  if (
                user?.appcall_routing_did === null ||
                user?.appcall_routing_did === ''
              ) {
                setShowDilerAppRoute(true);
              } else {
                handleOpenKeypadDialer(
                  dispatch,
                  role,
                  setShowDiler,
                  user,
                  '',
                  'no_list',
                );
              }
            }}
          >
            <View style={tabStyles.dialButton}>
              <Dialbutton color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <NoPermissionModal showDiler={showDiler} setShowDiler={setShowDiler} dialerMode={selectedDialerMode}/>
      <NoAppRoutingModal
        showDiler={showDilerAppRoute}
        setShowDiler={setShowDilerAppRoute}
      />
    </>
  );
};
BottomTabs.propTypes = {
  state: PropTypes.shape(),
  navigation: PropTypes.object,
};
const tabStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: -20,
    borderTopWidth: 0,
    bottom: 0,
    flexDirection: 'row',
    height: 60,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  dialButton: {
    borderRadius: 40,
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageStyle: {
    bottom: 2,
    flex: 1,
    height: 86,
    position: 'absolute',
    width: rw(100),
  },
  notch: {
    bottom: -34,
    height: 120,
    padding: 7,
    position: 'absolute',
    width: 80,
  },
  tabButton: {
    alignContent: `center`,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  tabButtonContact: {
    alignItems: `center`,
    flex: 1,
    justifyContent: 'center',
    paddingLeft: rw(12),
  },
  tabButtonDefault: {
    alignContent: `center`,
    alignItems: 'center',
    justifyContent: 'center',
    width: 0,
  },
  tabButtonGraph: {
    alignItems: `center`,
    flex: 1,
    justifyContent: 'center',
    paddingRight: rw(12),
  },
  tabButtonProfile: {
    alignContent: `center`,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default BottomTabs;
