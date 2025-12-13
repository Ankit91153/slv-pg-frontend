import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/unauth/LoginScreen";
import RegisterScreen from "../screens/unauth/RegisterScreen";
import OTPScreen from "../screens/unauth/OTPScreen";
import { SCREEN_NAMES } from "../constants/screens";

const Stack = createNativeStackNavigator();

export default function UnauthRouter({ onLogin }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name={SCREEN_NAMES.LOGIN}>
        {(props) => <LoginScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name={SCREEN_NAMES.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={SCREEN_NAMES.OTP} component={OTPScreen} />
    </Stack.Navigator>
  );
}
