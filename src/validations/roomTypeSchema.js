import * as Yup from 'yup';

export const roomTypeSchema = Yup.object().shape({
  name: Yup.string()
    .required('Room type name is required')
    .trim()
    .min(2, 'Name must be at least 2 characters'),
  
  bedsCount: Yup.number()
    .required('Beds count is required')
    .positive('Beds count must be positive')
    .integer('Beds count must be an integer')
    .min(1, 'Beds count must be at least 1'),
  
  pricePerBed: Yup.number()
    .required('Price per bed is required')
    .positive('Price must be positive')
    .min(1, 'Price must be at least 1'),
});
