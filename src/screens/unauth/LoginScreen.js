import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { useLogin } from '../../hooks/useAuth';
import { loginSchema } from '../../validations/loginSchema';
import { SCREEN_NAMES } from '../../constants/screens';
import { useTheme } from '../../context/ThemeContext';
import { createLoginStyles } from '../../styles/screens/loginStyles';

export default function LoginScreen({ navigation }) {
  const { mutate: login, isPending } = useLogin();
  const { theme } = useTheme();
  const styles = createLoginStyles(theme);

  const handleLogin = (values) => {
    login(values, {
      onSuccess: () => {
        // Redux state updated, AppNavigator will handle navigation based on role
        console.log('Login successful - navigating based on role');
      },
      onError: () => {
        // Error is already handled by axios interceptor
        console.log('Login failed');
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.title}>Login</Text>

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={loginSchema}
        onSubmit={handleLogin}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, setFieldTouched }) => (
          <View style={styles.form}>
            <TextInput
              style={[styles.input, errors.email && values.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor={theme.colors.inputPlaceholder}
              value={values.email}
              onChangeText={(text) => {
                handleChange('email')(text);
                setFieldTouched('email', true, false);
              }}
              onBlur={handleBlur('email')}
              autoCapitalize="none"
              keyboardType="email-address"
              keyboardAppearance={theme.isDark ? 'dark' : 'light'}
            />
            {errors.email && values.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            <TextInput
              style={[styles.input, errors.password && values.password && styles.inputError]}
              placeholder="Password"
              placeholderTextColor={theme.colors.inputPlaceholder}
              value={values.password}
              onChangeText={(text) => {
                handleChange('password')(text);
                setFieldTouched('password', true, false);
              }}
              onBlur={handleBlur('password')}
              secureTextEntry
              keyboardAppearance={theme.isDark ? 'dark' : 'light'}
            />
            {errors.password && values.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.button, (!isValid || isPending) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!isValid || isPending}
              activeOpacity={0.7}
            >
              {isPending ? (
                <ActivityIndicator color={theme.colors.textInverse} />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <TouchableOpacity onPress={() => navigation.navigate(SCREEN_NAMES.REGISTER)}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate(SCREEN_NAMES.OTP)}>
        <Text style={styles.link}>Enter OTP</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
