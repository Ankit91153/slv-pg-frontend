import * as Yup from 'yup';

export const bookingSchema = Yup.object().shape({
  userId: Yup.string()
    .required('User is required')
    .uuid('Invalid user ID'),
  
  bedId: Yup.string()
    .required('Bed is required')
    .uuid('Invalid bed ID'),
  
  startDate: Yup.date()
    .required('Start date is required')
    .min(new Date(), 'Start date cannot be in the past'),
});
