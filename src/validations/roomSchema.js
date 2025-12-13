import * as Yup from 'yup';

export const roomSchema = Yup.object().shape({
  floorId: Yup.string()
    .required('Floor is required')
    .uuid('Invalid floor ID'),
  
  roomTypeId: Yup.string()
    .required('Room type is required')
    .uuid('Invalid room type ID'),
  
  roomNumber: Yup.string()
    .required('Room number is required')
    .trim(),
});
