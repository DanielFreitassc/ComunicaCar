import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View
} from 'react-native';
import colors from '../../globals/theme/colors';

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'filled',
  isLoading = false,
  disabled = false
}) => {
  const isOutlined = variant === 'outlined';
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isOutlined ? styles.outlined : styles.filled,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isDisabled}
    >
      <View style={styles.contentContainer}>

        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={isOutlined ? colors.secondary : 'white'}
            style={styles.loadingIndicator}
          />
        ) : <Text
          style={[
            styles.text,
            isOutlined ? styles.textOutlined : styles.textFilled,
            isDisabled && styles.textDisabled,
            textStyle,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    minWidth: 120,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  filled: {
    backgroundColor: colors.secondary,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  disabled: {
    opacity: 0.6,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
  },
  textFilled: {
    color: 'white',
  },
  textOutlined: {
    color: colors.secondary,
  },
  textDisabled: {
    opacity: 0.8,
  },
  loadingIndicator: {
    marginRight: 4,
  },
});

export default Button;