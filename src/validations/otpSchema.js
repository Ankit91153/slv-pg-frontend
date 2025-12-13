import * as Yup from 'yup';

export const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
    .length(6, 'OTP must be exactly 6 digits'),
});
