import * as Yup from 'yup';

export const floorSchema = Yup.object().shape({
  floorNumber: Yup.number()
    .required('Floor number is required')
    .positive('Floor number must be positive')
    .integer('Floor number must be an integer'),
});
