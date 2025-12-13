import * as Yup from 'yup';

export const ROOM_TYPE_NAMES = {
  SINGLE: 'SINGLE',
  DOUBLE: 'DOUBLE',
  TRIPLE: 'TRIPLE',
};

export const roomTypeSchema = Yup.object().shape({
  name: Yup.string()
    .required('Room type is required')
    .oneOf(Object.values(ROOM_TYPE_NAMES), 'Invalid room type'),
  
  pricePerBed: Yup.number()
    .required('Price per bed is required')
    .positive('Price must be positive')
    .min(1, 'Price must be at least 1'),
});
