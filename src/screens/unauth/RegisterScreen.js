import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Formik } from 'formik';
import { useRegister } from '../../hooks/useAuth';
import { registerSchema } from '../../validations/registerSchema';
import { SCREEN_NAMES } from '../../constants/screens';

export default function RegisterScreen({ navigation }) {
  const { mutate: register, isPending } = useRegister();

  const handleRegister = (values) => {
    console.log('📝 Registration Payload:', JSON.stringify(values, null, 2));
    
    register(values, {
      onSuccess: (data) => {
        console.log(data,"YYYYYYYYYY");
        
        Alert.alert('Success', 'Registration successful! Please verify OTP.', [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate(SCREEN_NAMES.OTP, { 
              userId: data.userId || data.id 
            }) 
          }
        ]);
      },
      onError: (error) => {
        // Error is already handled by axios interceptor
        console.log('Registration failed');
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>
      
      <Formik
        initialValues={{
          name: '',
          phoneNumber: '',
          alternativeNumber: '',
          email: '',
          companyOrCollegeName: '',
          address: '',
          password: '',
        }}
        validationSchema={registerSchema}
        onSubmit={handleRegister}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, setFieldTouched }) => (
          <View style={styles.form}>
            <TextInput
              style={[styles.input, errors.name && values.name && styles.inputError]}
              placeholder="Name *"
              value={values.name}
              onChangeText={(text) => {
                handleChange('name')(text);
                setFieldTouched('name', true, false);
              }}
              onBlur={handleBlur('name')}
            />
            {errors.name && values.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}

            <TextInput
              style={[styles.input, errors.phoneNumber && values.phoneNumber && styles.inputError]}
              placeholder="Phone Number *"
              value={values.phoneNumber}
              onChangeText={(text) => {
                handleChange('phoneNumber')(text);
                setFieldTouched('phoneNumber', true, false);
              }}
              onBlur={handleBlur('phoneNumber')}
              keyboardType="phone-pad"
            />
            {errors.phoneNumber && values.phoneNumber ? (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Alternative Number (Optional)"
              value={values.alternativeNumber}
              onChangeText={handleChange('alternativeNumber')}
              onBlur={handleBlur('alternativeNumber')}
              keyboardType="phone-pad"
            />

            <TextInput
              style={[styles.input, errors.email && values.email && styles.inputError]}
              placeholder="Email *"
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
              style={[styles.input, errors.companyOrCollegeName && values.companyOrCollegeName && styles.inputError]}
              placeholder="Company or College Name *"
              value={values.companyOrCollegeName}
              onChangeText={(text) => {
                handleChange('companyOrCollegeName')(text);
                setFieldTouched('companyOrCollegeName', true, false);
              }}
              onBlur={handleBlur('companyOrCollegeName')}
            />
            {errors.companyOrCollegeName && values.companyOrCollegeName ? (
              <Text style={styles.errorText}>{errors.companyOrCollegeName}</Text>
            ) : null}

            <TextInput
              style={[styles.input, errors.address && values.address && styles.inputError]}
              placeholder="Address *"
              value={values.address}
              onChangeText={(text) => {
                handleChange('address')(text);
                setFieldTouched('address', true, false);
              }}
              onBlur={handleBlur('address')}
              multiline
              numberOfLines={2}
            />
            {errors.address && values.address ? (
              <Text style={styles.errorText}>{errors.address}</Text>
            ) : null}

            <TextInput
              style={[styles.input, errors.password && values.password && styles.inputError]}
              placeholder="Password *"
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
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <TouchableOpacity onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN)}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, paddingTop: 40 },
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
