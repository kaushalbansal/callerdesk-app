import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { rw, rh, rf } from '../helpers/dimentions';
import { AnsweredCallsIcon } from '../icons/answeredcallsicon';
import { colors } from '../../themes/vars';
import { IconMissed } from '../icons/iconmissedcall';
import { getRandomColor } from '../helpers/utils';
import { CopyIconNew } from '../icons/copyiconnew';
import { SmsIcon } from '../icons/smsicon';
import { InfoIcon } from '../icons/infoicon';
import { EditIcon } from '../icons/editiconnew';
import { CallPhone } from '../icons/callphone';
import { TextIcon } from '../icons/texticon';
import { SwipeText } from '../Constants';
import { Text as Text2 } from '@ui-kitten/components';

 const _defaultModal = {
    paymentUpi: false,
    businessAddress: false,
    info: false,
    whatsappConfirm: false,
  };

function SimCallLogCard({ entry, copyFunc, sendSmsCard, openDialer, openWhatsapp, openContact }) {
    const time = new Date(entry.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const date = new Date(entry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', });
    const mins = Math.floor(entry.duration / 60);
    const secs = entry.duration % 60;
    const duration = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    // pick the right SVG icon component
    const callTypeIcon = useMemo(() => {
        switch (entry.type) {
            // incoming answered
            case 1:
                return <AnsweredCallsIcon size={rf(2)} color={colors.grey} />;
            // outgoing answered
            case 2:
                return <AnsweredCallsIcon size={rf(2)} color={colors.grey} />;
            // Missed calls
            case 3:
            default:
                return <IconMissed size={rf(2)} color={colors.grey} />;
        }
    }, [entry.type]);

    const bg = useMemo(() => getRandomColor(), []);

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: bg }]}>
                    <Text2 style={styles.avatarText}>
                        {entry.name && entry.name.length > 0 ? entry.name[0] : 'U'}
                    </Text2>
                </View>
                <View style={styles.info}>
                    <Text2 style={styles.name} numberOfLines={1}>{entry.name || 'Unknown'}</Text2>
                    <Text2 style={[styles.number]} appearance='hint'>
                        {entry.number}
                        {/* {entry.to ? `  to ${entry.to}` : ''} */}
                    </Text2>
                    <Text2 appearance='hint' style={styles.datetime}>{time} | {date}</Text2>
                </View>
                <View style={styles.right}>
                    {/* <Text style={styles.duration}>{duration}</Text> */}
                    <Text2 appearance='hint' style={styles.duration}>{duration}</Text2>
                    {callTypeIcon}
                </View>
            </View>


            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.iconsButton}
                    onPress={() =>
                        copyFunc(entry.number)
                    }
                >
                    <CopyIconNew size={rf(2)} color={colors.grey}></CopyIconNew>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconsButton}
                    onPress={() =>
                        sendSmsCard(
                            entry.number,
                            `Hello`,
                        )
                    }
                >
                    <SmsIcon size={rf(2)} color={colors.grey}></SmsIcon>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconsButton}
                    onPress={() =>
                        openWhatsapp({..._defaultModal, info: true}, entry)
                    }
                >
                    <InfoIcon size={rf(2)} color={colors.grey}></InfoIcon>
                </TouchableOpacity>
                <TouchableOpacity
                        onPress={() => openContact(entry)}
                        style={styles.iconsButton}
                      >
                        <EditIcon size={rf(2)} color={colors.grey}></EditIcon>
                      </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconsButton}
                    onPress={() => openDialer(entry.number)}
                >
                    <CallPhone size={rf(2)} />
                </TouchableOpacity>
            </View>
            <View style={styles.swipeView}>
                <TextIcon size={16}></TextIcon>
                <Text2 style={styles.swipeText}>{SwipeText}</Text2>
            </View>
        </View>
    );
}


export default React.memo(SimCallLogCard);

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        // marginVertical: rh(1),
        marginTop: rh(1.2),
        marginHorizontal: rw(4),
        paddingTop: rh(0.2),
        paddingBottom: 0,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: rw(2),
        height: rh(7.5),
        // borderWidth: 1
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 45,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: rw(2),
        elevation: 4,
    },
    avatarText: {
        color: colors.white,
        fontSize: rf(1.8),
        // fontWeight: '600',
    },
    info: {
        flex: 1,
        // borderWidth: 1
    },
    name: {
        fontSize: rf(1.8),
        // marginBottom: rh(0.3),
    },
    number: {
        fontSize: rf(1.5),
        // color: colors.grey,
        // marginBottom: rh(0.3),
    },
    datetime: {
        fontSize: rf(1.5),
        // color: colors.grey,
    },

    right: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    duration: {
        // fontSize: rf(1.8),
        // color: colors.grey,
        marginBottom: rh(0.5),
        marginRight: rw(2.7)
    },
    typeIcon: {
        width: rw(5),
        height: rw(5),
        tintColor: '#546E7A',
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: rh(1.2),
        // paddingTop: rh(0.8),
        paddingHorizontal: rw(5),
        // width: '90%',
        // alignSelf: 'center'
        // borderTopWidth: 1,
        // borderColor: '#ECEFF1',
    },
    footerButton: {
        padding: rh(0.5),
    },
    footerIcon: {
        width: rw(5),
        height: rw(5),
        tintColor: '#78909C',
    },
    iconsButton: {
        justifyContent: `center`,
    },
     swipeText: { color: colors.swipe, fontSize: 11, paddingLeft: `2%` },
  swipeView: {
    alignItems: `center`,
    alignSelf: `center`,
    backgroundColor: colors.swipeBg,
    flexDirection: `row`,
    marginTop: rh(0.7),
    paddingHorizontal: 12,
    paddingVertical: rh(1),
    width: '100%',
  },
});
