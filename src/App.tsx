import { Box, Button, Grid, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import './App.css'
import {
  ifDeliveryFee,
  ifRushHour,
  maxDeliveryPrice,
  noRushHourDeliveryPrice,
  rushHourDeliveryPrice,
} from './utils/delivery'
import { validationSchema } from './validations/validation'

function App() {
  const formik = useFormik({
    initialValues: {
      cartValue: '',
      distance: '',
      amount: '',
      dateTime: dayjs(new Date()),
      deliveryPrice: '',
      isSubmit: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const cartValue = Number(values.cartValue)
      const distance = Number(values.distance)
      const amount = Number(values.amount)
      const dateTime = values.dateTime

      let newDeliveryPrice = 0
      if (ifDeliveryFee(cartValue)) {
        if (ifRushHour(dateTime)) {
          newDeliveryPrice = maxDeliveryPrice(rushHourDeliveryPrice(cartValue, distance, amount))
        } else {
          newDeliveryPrice = maxDeliveryPrice(noRushHourDeliveryPrice(cartValue, distance, amount))
        }
      }

      formik.setFieldValue('deliveryPrice', newDeliveryPrice)
      formik.setFieldValue('isSubmit', true)
    },
  })

  return (
    <Grid
      container
      sx={{
        margin: 'auto',
        justifyContent: 'center',
      }}
    >
      <Grid item xs={10} md={8} lg={6} xl={5} mt={5}>
        <h1 data-testid='app-title'>Delivery Fee Calculator</h1>
        <form onSubmit={formik.handleSubmit}>
          <Box className='box'>
            <div className='cart-value'>
              <label>Cart Value: </label>
              <TextField
                name='cartValue'
                data-testid='cart-value'
                onChange={formik.handleChange}
                value={formik.values.cartValue}
                onBlur={formik.handleBlur}
                error={formik.touched.cartValue && Boolean(formik.errors.cartValue)}
                helperText={formik.touched.cartValue && formik.errors.cartValue}
                type='number'
                inputProps={{ min: 0.01, step: 0.01 }}
              />
              &nbsp;€
            </div>

            <div className='delivery-distance'>
              <label>Delivery Distance: </label>
              <TextField
                name='distance'
                data-testid='delivery-distance'
                onChange={formik.handleChange}
                value={formik.values.distance}
                onBlur={formik.handleBlur}
                error={formik.touched.distance && Boolean(formik.errors.distance)}
                helperText={formik.touched.distance && formik.errors.distance}
                type='number'
                inputProps={{ min: 1, step: 1 }}
              />
              &nbsp;m
            </div>

            <div className='amount-of-items'>
              <label>Amount of Items: </label>

              <TextField
                name='amount'
                data-testid='amount-of-items'
                onChange={formik.handleChange}
                value={formik.values.amount}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
                type='number'
                inputProps={{ min: 1, step: 1 }}
              />
            </div>

            <Grid
              container
              display='flex'
              justifyContent='center'
              alignItems='center'
              direction='row'
            >
              <label>Time:&nbsp;</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label='Pick date and time'
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      data-testid='date-time'
                      name='dateTime'
                      onBlur={formik.handleBlur}
                      error={formik.touched.dateTime && Boolean(formik.errors.dateTime)}
                      helperText={
                        formik.touched.dateTime && formik.errors.dateTime
                          ? String(formik.errors.dateTime)
                          : ''
                      }
                    />
                  )}
                  value={formik.values.dateTime}
                  onChange={(e) => formik.setFieldValue('dateTime', e)}
                  disablePast={true}
                  inputFormat='MM/DD/YYYY hh:mm'
                />
              </LocalizationProvider>
            </Grid>
            <Button
              data-testid='submit-button'
              type='submit'
              variant='contained'
              sx={{
                backgroundColor: 'rgb(50, 178, 228)',
                ':hover': { backgroundColor: 'rgb(114, 190, 220)' },
              }}
            >
              Calculate delivery price
            </Button>
            <div>
              <Grid
                container
                display='flex'
                alignItems='center'
                direction='row'
                data-testid='your-delivery-price'
                visibility={formik.values.isSubmit ? 'visible' : 'hidden'}
                style={{ paddingTop: '10px', fontSize: '2rem' }}
              >
                Your Delivery Price is: &ensp;
                <span data-testid='delivery-price' style={{ paddingTop: '3px', fontSize: '2rem' }}>
                  {formik.values.deliveryPrice} €
                </span>
              </Grid>
            </div>
          </Box>
        </form>
      </Grid>
    </Grid>
  )
}

export default App
