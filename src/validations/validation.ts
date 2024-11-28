import * as yup from 'yup'

export const validationSchema = yup.object({
  cartValue: yup.number().required('This field is required.').min(1).max(1000),
  distance: yup.number().required('This field is required.').min(1).max(10000),
  amount: yup.number().required('This field is required.').min(1).max(20),
  dateTime: yup.string().required('Please choose date and time.'),
})
