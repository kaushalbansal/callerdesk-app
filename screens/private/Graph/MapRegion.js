// MapRegion.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableOpacity,
} from "react-native";
import IndiaMap from "../../../common/components/IndiaMap";
import { MonthlyWiseRegionTrafficTitle, STATE_PATHS } from "../../../common/Constants";
import { rw, rh, rf } from "../../../common/helpers/dimentions";
import Svg, { Path } from "react-native-svg";
import { colors } from "../../../themes/vars";
import CustomHeader from "../../../common/components/CustomHeader";

const exampleData = [
  { circle: "Andhra Pradesh", total: "78" },
  { circle: "Delhi", total: "33" },
  { circle: "Madhya Pradesh", total: "1" },
  { circle: "Sikkim", total: "4" },
  {circle: "Tamil Nadu", total: "8"},
];

const STATE_MODAL_MAP_SIZE = rw(60); 

const MapRegion = () => {
  const [mapData]      = useState(exampleData);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedState, setSelectedState] = useState({
    name: "",
    total: "0",
  });

  const handleStatePress = (stateName, total) => {
    setSelectedState({
      name: stateName,
      total: total != null ? total : "0",
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedState({ name: "", total: "0" });
  };

  // Grab the single-state path for our modal preview
  const selectedD = STATE_PATHS[selectedState.name]?.d;

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={MonthlyWiseRegionTrafficTitle} />
      <View style={styles.innerContainer}>

      <IndiaMap
        data={mapData}
        width={rw(100)}
        height={rh(70)}
        onStatePress={handleStatePress}
      />

           <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Has Calls</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: "#E0E0E0" }]} />
          <Text style={styles.legendText}>No Calls</Text>
        </View>
      </View>

      </View>

      {/* Legend omitted for brevity... */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {/* {selectedD ? (
              <View style={styles.svgWrapper}>
              <Svg
                width={'100%'}
                height={'100%'}
                viewBox="0 0 1000 1000"
                 preserveAspectRatio="xMidYMid meet"
                style={styles.stateSvg}
              >
                <Path
                  d={selectedD}
                  fill="#4CAF50"
                  stroke="black"
                  strokeWidth={1}
                />
              </Svg>
              </View>
            ) : (
              <Text style={styles.noShapeText}>No map for {selectedState.name}</Text>
            )} */}

            <Text style={styles.modalStateName}>{selectedState.name}</Text>
            <Text style={styles.modalTotal}>
              Total Calls: {selectedState.total}
            </Text>

            <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MapRegion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  innerContainer:{
    paddingHorizontal: rw(4),
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: rw(80),
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    padding: rw(4),
    alignItems: "center",
  },
  stateSvg: {
    marginBottom: rh(2),
    borderWidth: 1,
  },
  noShapeText: {
    fontSize: rf(2),
    color: "#888",
    marginBottom: rh(2),
  },
  modalStateName: {
    fontSize: rf(2.4),
    fontWeight: "700",
    marginBottom: rh(1),
  },
  modalTotal: {
    fontSize: rf(2),
    color: "#333",
    marginBottom: rh(3),
  },
  closeBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: rh(1.2),
    paddingHorizontal: rw(6),
    borderRadius: 4,
  },
  closeBtnText: {
    color: "#FFF",
    fontSize: rf(2),
    fontWeight: "600",
  },
  
  // New wrapper to force square container and center the svg
  svgWrapper: {
    width: STATE_MODAL_MAP_SIZE,
    height: STATE_MODAL_MAP_SIZE,
    marginBottom: rh(2),
    borderWidth: 1
    // optional: give it a light background so you can see its edges
    // backgroundColor: "#fafafa",
  },
   legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: rh(2),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: rw(2),
  },
  colorBox: {
    width: rw(4),
    height: rw(4),
    borderRadius: rw(0.5),
    marginRight: rw(1),
  },
  legendText: {
    fontSize: rf(2),
    color: "#333",
  },
});
