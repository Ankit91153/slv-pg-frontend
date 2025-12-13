import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Formik } from 'formik';
import { useLogin } from '../../hooks/useAuth';
import { loginSchema } from '../../validations/loginSchema';
import { SCREEN_NAMES } from '../../constants/screens';

export default function LoginScreen({ navigation }) {
  const { mutate: login, isPending } = useLogin();

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
    <View style={styles.container}>
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
              value={values.email}
              onChangeText={(text) => {
                handleChange('email')(text);
                setFieldTouched('email', true, false);
              }}
              onBlur={handleBlur('email')}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {errors.email && values.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}

            <TextInput
              style={[styles.input, errors.password && values.password && styles.inputError]}
              placeholder="Password"
              value={values.password}
              onChangeText={(text) => {
                handleChange('password')(text);
                setFieldTouched('password', true, false);
              }}
              onBlur={handleBlur('password')}
              secureTextEntry
            />
            {errors.password && values.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.button, (!isValid || isPending) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!isValid || isPending}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  form: { width: '100%' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 12, 
    marginBottom: 8, 
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
    opacity: 0.6,
  },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  link: { color: '#007AFF', textAlign: 'center', marginTop: 15 },
});
