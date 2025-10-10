import { View, Text, StyleSheet } from "react-native";
import { rf, rh, rw } from "../helpers/dimentions";
import { colors } from "../../themes/vars";
import PropTypes from "prop-types";


export default function CustomTitleViewWrapper({title, subTitle, children, containerStyle={}, titleTextStyle={}, subTitleTextStyle={}}){

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={[styles.titleStyle, titleTextStyle]}>{title}</Text>
            <Text style={[styles.subTitleStyle, subTitleTextStyle]}>{subTitle}</Text>
            {children}
        </View>
    )
}

const styles=StyleSheet.create({
    container:{
        width: '100%',
        paddingHorizontal: rw(4),
        // alignItems: 'center',
        paddingVertical: rh(1.6),
        borderWidth: 1,
        borderColor: '#E1DDDD',
        borderRadius: rw(3),
        marginBottom: rh(1)
    },
    titleStyle:{
        fontSize: rf(2),
        color: colors.black,
        // fontFamily: `Lexend`,
        fontWeight: '500',
        marginBottom: rh(0.4)
    },
    subTitleStyle:{
        fontSize: rh(1.5),
        color: colors.WhatsappTemplateTextgreyColor,
        // fontFamily: `Lexend`,
        fontWeight: '300',
        marginBottom: rh(1)
    }
})

CustomTitleViewWrapper.prototypes={
    title: PropTypes.string,
    subTitle: PropTypes.string,
    children: PropTypes.node,
    containerStyle: PropTypes.object,
    titleTextStyle: PropTypes.object,
    subTitleTextStyle: PropTypes.object
}