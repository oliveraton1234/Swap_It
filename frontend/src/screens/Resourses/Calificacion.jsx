import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Calificacion = ({ calificacion, size, cl, }) => {
  const estrellasLlenas = Math.round(calificacion);
  const estrellasVacias = 5 - estrellasLlenas;

  return (
    <View style={{ flexDirection: 'row' }} className={cl}>
      {[...Array(estrellasLlenas)].map((e, i) => (
        <MaterialCommunityIcons
          key={i}
          name="star"
          style={{ marginRight: 1 }}
          size={size || 12}
          color="#F6AD55"
        />
      ))}
      {[...Array(estrellasVacias)].map((e, i) => (
        <MaterialCommunityIcons
          key={i}
          name="star-outline"
          style={{ marginRight: 1 }}
          size={size || 12}
          color="#F6AD55"
        />
      ))}
    </View>
  );
};

export default Calificacion;