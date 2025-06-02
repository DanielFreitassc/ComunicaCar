import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../screens/theme/colors';

export default function Button({ title, onPress, style, textStyle, variant = 'filled' }) {
  const isOutlined = variant === 'outlined';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isOutlined ? styles.outlined : styles.filled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          isOutlined ? styles.textOutlined : styles.textFilled,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const baseStyle = {
  height: 38,
  paddingHorizontal: 8,
  borderRadius: 5,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'stretch',
  paddingBottom: 4
};

const styles = StyleSheet.create({
  base: {
    ...baseStyle,
  },
  filled: {
    backgroundColor: colors.secondary
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
  },
  textFilled: {
    color: 'white',
  },
  textOutlined: {
    color: colors.secondary,
  },
});
