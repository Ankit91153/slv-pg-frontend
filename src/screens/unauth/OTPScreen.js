import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Formik } from "formik";
import { useVerifyOTP, useResendOTP } from "../../hooks/useAuth";
import { otpSchema } from "../../validations/otpSchema";
import { SCREEN_NAMES } from "../../constants/screens";

export default function OTPScreen({ navigation, route }) {
  const userId = route?.params?.userId;
  console.log(userId,"USER");
  
  const { mutate: verifyOTP, isPending: isVerifying } = useVerifyOTP();
  const { mutate: resendOTP, isPending: isResending } = useResendOTP();

  const handleVerifyOTP = (values) => {
    const payload = {
      userId: userId,
      otp: values.otp,
    };

    verifyOTP(payload, {
      onSuccess: () => {
        Alert.alert("Success", "OTP verified successfully! Please login.", [
          {
            text: "OK",
            onPress: () => navigation.navigate(SCREEN_NAMES.LOGIN),
          },
        ]);
      },
      onError: () => {
        // Error is already handled by axios interceptor
        console.log("OTP verification failed");
      },
    });
  };

  const handleResendOTP = () => {
    const payload = {
      userId: userId,
    };

    resendOTP(payload, {
      onSuccess: () => {
        Alert.alert("Success", "OTP resent successfully!");
      },
      onError: () => {
        // Error is already handled by axios interceptor
        console.log("Resend OTP failed");
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        Please enter the 6-digit code sent to your phone
      </Text>

      <Formik
        initialValues={{
          otp: "",
        }}
        validationSchema={otpSchema}
        onSubmit={handleVerifyOTP}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          setFieldTouched,
        }) => (
          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                styles.otpInput,
                errors.otp && values.otp && styles.inputError,
              ]}
              placeholder="Enter 6-digit OTP"
              value={values.otp}
              onChangeText={(text) => {
                // Only allow numbers and max 6 digits
                const numericText = text.replace(/[^0-9]/g, "").slice(0, 6);
                handleChange("otp")(numericText);
                setFieldTouched("otp", true, false);
              }}
              onBlur={handleBlur("otp")}
              keyboardType="number-pad"
              maxLength={6}
            />
            {errors.otp && values.otp ? (
              <Text style={styles.errorText}>{errors.otp}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.button,
                (!isValid || isVerifying) && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isValid || isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResendOTP}
              style={styles.resendButton}
              disabled={isResending}
            >
              {isResending ? (
                <ActivityIndicator color="#007AFF" />
              ) : (
                <Text style={styles.resendText}>Resend OTP</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <TouchableOpacity onPress={() => navigation.navigate(SCREEN_NAMES.LOGIN)}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  form: { width: "100%" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  otpInput: {
    fontSize: 24,
    letterSpacing: 10,
    fontWeight: "bold",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#A0A0A0",
    opacity: 0.6,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  resendButton: {
    marginTop: 20,
    padding: 10,
  },
  resendText: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 14,
  },
  link: { color: "#007AFF", textAlign: "center", marginTop: 20 },
});
