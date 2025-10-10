// ResponsiveImage.tsx
import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { rw } from '../helpers/dimentions';

const ResponsiveImage = ({ uri, maxWidth = rw(70), maxHeight=rw(100) }) => {
//   const [dimensions, setDimensions] = useState({ width: maxWidth, height: rw(40) });

//   useEffect(() => {
//     Image.getSize(
//       uri,
//       (width, height) => {
//         const aspectRatio = width / height;
//         const adjustedHeight = maxWidth / aspectRatio;
//         setDimensions({ width: maxWidth, height: adjustedHeight });
//       },
//       (error) => {
//         console.error('Error getting image size', error);
//       }
//     );
//   }, [uri]);

  const [dimensions, setDimensions] = useState({ width: maxWidth, height: rw(40) });

  useEffect(() => {
    Image.getSize(
      uri,
      (width, height) => {
        let adjustedHeight = maxWidth / (width / height);
        if (adjustedHeight > maxHeight) {
          adjustedHeight = maxHeight;
          const adjustedWidth = maxHeight * (width / height);
          setDimensions({ width: adjustedWidth, height: maxHeight });
        } else {
          setDimensions({ width: maxWidth, height: adjustedHeight });
        }
      },
      (error) => {
        console.error('Error getting image size', error);
      }
    );
  }, [uri]);
console.log(dimensions, 'dime')
  return (
    <Image
      source={{ uri }}
      style={[styles.image, dimensions]}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: rw(2),
  },
});

export default ResponsiveImage;
