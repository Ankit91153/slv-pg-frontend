import * as Yup from 'yup';

export const bedSchema = Yup.object().shape({
  roomId: Yup.string()
    .required('Room is required')
    .uuid('Invalid room ID'),
  
  bedNumber: Yup.number()
    .required('Bed number is required')
    .positive('Bed number must be positive')
    .integer('Bed number must be an integer')
    .min(1, 'Bed number must be at least 1'),
});
