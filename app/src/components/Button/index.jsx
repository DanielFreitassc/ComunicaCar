import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../screens/theme/colors';
export default function Button({ title, onPress, style, textStyle }) {

  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
