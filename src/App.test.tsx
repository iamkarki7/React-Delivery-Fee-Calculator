import { describe, test, expect } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import App from './App'
import dayjs from 'dayjs'
import {
  cartValueSurcharge,
  ifDeliveryFee,
  ifRushHour,
  distanceSurcharge,
  amountSurcharge,
  maxDeliveryPrice,
  rushHourDeliveryPrice,
  noRushHourDeliveryPrice,
} from './utils/delivery'
import '@testing-library/jest-dom'

render(<App />)

describe('Initial state of input cart value, and its attributes', () => {
  const input = screen.getByTestId('cart-value').querySelector('input') as HTMLInputElement

  test('If the initial cart value is null', () => {
    expect(input.value).toBe('')
  })

  test('Input step should be equal to 0.01 €', () => {
    expect(input.getAttribute('step')).toBe('0.01')
  })
  test('Minimum input should be equal to 0.01 €', () => {
    expect(input.getAttribute('min')).toBe('0.01')
  })
})

describe('Initial state of input delivery distance, and its attributes', () => {
  const input = screen.getByTestId('delivery-distance').querySelector('input') as HTMLInputElement

  test('If the initial delivery distance value is null', () => {
    expect(input.value).toBe('')
  })
  test('Input step should be equal to 1 meter', () => {
    expect(input.getAttribute('step')).toBe('1')
  })
  test('Minimum input should be equal to 1 meter', () => {
    expect(input.getAttribute('min')).toBe('1')
  })
})

describe('Initial state of input amount of items, and its attributes', () => {
  const input = screen.getByTestId('amount-of-items').querySelector('input') as HTMLInputElement

  test('If the initial amount of items value is null', () => {
    expect(input.value).toBe('')
  })
  test('Input step should be equal to 1', () => {
    expect(input.getAttribute('step')).toBe('1')
  })
  test('Minimum input should be equal to 1', () => {
    expect(input.getAttribute('min')).toBe('1')
  })
})

describe('Initial state of date and time picker', () => {
  const dateTimePicker = screen.getByLabelText('Pick date and time')
  test('If it has initail date and time', () => {
    expect(dateTimePicker).toHaveValue()
  })
})

describe('Check button attribute', () => {
  const btn = screen.getByTestId('submit-button') as HTMLButtonElement
  test('If type of button is submit', () => {
    expect(btn.getAttribute('type')).toBe('submit')
  })
})

describe('If cart value is less than 10€, a small order surcharge has to be charged. The surcharge is the difference between the cart value and 10€', () => {
  test('Returns the difference between cart value and 10€, when the value is less than 10€', () => {
    expect(cartValueSurcharge(5.1)).toBe(4.9)
    expect(cartValueSurcharge(8.19)).toBe(1.81)
  })
  test('Returns 0, when cart value is greater than or equal to 10€', () => {
    expect(cartValueSurcharge(10)).toBe(0)
    expect(cartValueSurcharge(14.99)).toBe(0)
  })
})

describe('If cart value greater than or equal to 100€', () => {
  test('Returns false, when the cart value is greater than or equal to 100€', () => {
    expect(ifDeliveryFee(100)).toBe(false)
    expect(ifDeliveryFee(120)).toBe(false)
  })
  test('returns true, when the cart value is less than 100€', () => {
    expect(ifDeliveryFee(50)).toBe(true)
    expect(ifDeliveryFee(99)).toBe(true)
  })
})

describe('A delivery fee for the first 1000m is 2€. If the delivery distance is longer than that, 1€ is added for every additional 500 meters. Even if the distance would be shorter than 500 meters, the minimum fee is always 1€.', () => {
  test('Returns 2, when distance is less than or equal to 1000m', () => {
    expect(distanceSurcharge(500)).toBe(2)
    expect(distanceSurcharge(1000)).toBe(2)
  })
  test('Returns surcharge of distance based on step distance 500m, when distance is greater than 1000m', () => {
    expect(distanceSurcharge(1499)).toBe(3)
    expect(distanceSurcharge(1500)).toBe(3)
    expect(distanceSurcharge(1501)).toBe(4)
  })
})

describe('If the number of items is five or more, an additional 50 cent surcharge is added for each item above five. An extra bulk fee applies for more than 12 items of 1,20€', () => {
  test('Surcharge of amount is 0, when amount is less or equal than 4', () => {
    expect(amountSurcharge(4)).toBe(0)
  })
  test('Returns surcharge of amount based on unit cost 50 cent, when amount is greater than 4 and less than or equal to 12', () => {
    expect(amountSurcharge(5)).toBe(0.5)
    expect(amountSurcharge(10)).toBe(3)
    expect(amountSurcharge(12)).toBe(4)
  })
  test('Returns surcharge of amount based on unit cost 50 cent and extra bulk fee 1,20€, when amount is greater than 12', () => {
    expect(amountSurcharge(13)).toBe(5.7)
    expect(amountSurcharge(15)).toBe(6.7)
  })
})

describe('If the day and time during the rush hour (Friday 15:00 - 19:00 UTC)', () => {
  test('Returns true, if day and time is in rush hour', () => {
    expect(ifRushHour(dayjs('2023-02-24 15:00:00'))).toBe(true)
    expect(ifRushHour(dayjs('2023-03-17 19:00:00'))).toBe(true)
  })
  test('Returns false, if day and time is not in rush hour', () => {
    expect(ifRushHour(dayjs('2023-02-21 14:08:00'))).toBe(false)
    expect(ifRushHour(dayjs('2023-02-23 19:00:00'))).toBe(false)
  })
})

describe('The delivery price can never be more than 15€, including possible surcharges', () => {
  test('If delivery price more than or equal 15€, then only charge 15€', () => {
    expect(maxDeliveryPrice(123)).toBe(15)
    expect(maxDeliveryPrice(15.99)).toBe(15)
  })
  test('If delivery price less than 15€, then charge the price', () => {
    expect(maxDeliveryPrice(14.99)).toBe(14.99)
    expect(maxDeliveryPrice(3)).toBe(3)
  })
})

describe('Considering cart value, distance and amount of iteams to calculate delivery price, when in a rush hour (Friday 15:00 - 19:00 UTC)', () => {
  test('The delivery price, when in a rush hour', () => {
    expect(rushHourDeliveryPrice(7.19, 2000, 4)).toBe(8.17)
  })
})

describe('Considering cart value, distance and amount of iteams to calculate delivery price, when not in a rush hour (Friday 15:00 - 19:00 UTC)', () => {
  test('The delivery price, when not in a rush hour', () => {
    expect(noRushHourDeliveryPrice(7.19, 2000, 4)).toBe(6.81)
  })
})

describe('Submit the form', () => {
  test('Calculates the delivery price based on the input values', async () => {
    render(<App />)
    const cartValueInput = screen
      .getByTestId('cart-value')
      .querySelector('input') as HTMLInputElement
    const deliveryDistanceInput = screen
      .getByTestId('delivery-distance')
      .querySelector('input') as HTMLInputElement
    const amountInput = screen
      .getByTestId('amount-of-items')
      .querySelector('input') as HTMLInputElement
    const dateTimePicker = screen
      .getByTestId('date-time')
      .querySelector('input') as HTMLInputElement
    const submitButton = screen.getByTestId('submit-button') as HTMLButtonElement

    await act(async () => {
      fireEvent.change(cartValueInput, { target: { value: '18.59' } })
      fireEvent.change(deliveryDistanceInput, { target: { value: '1000' } })
      fireEvent.change(amountInput, { target: { value: '4' } })
      fireEvent.change(dateTimePicker, {
        target: { value: '06/14/2024 05:23' },
      })
    })
    await act(async () => {
      fireEvent.submit(submitButton)
    })
    expect(screen.getByTestId('delivery-price')?.textContent).toBe('2 €')

    await act(async () => {
      fireEvent.change(cartValueInput, { target: { value: '100' } })
      fireEvent.change(deliveryDistanceInput, { target: { value: '10' } })
      fireEvent.change(amountInput, { target: { value: '20' } })
      fireEvent.change(dateTimePicker, {
        target: { value: '01/27/2023 17:23' },
      })
    })
    await act(async () => {
      fireEvent.submit(submitButton)
    })
    expect(screen.getByTestId('delivery-price')?.textContent).toBe('0 €')

    await act(async () => {
      fireEvent.change(cartValueInput, { target: { value: '7.89' } })
      fireEvent.change(deliveryDistanceInput, { target: { value: '1001' } })
      fireEvent.change(amountInput, { target: { value: '9' } })
      fireEvent.change(dateTimePicker, {
        target: { value: '01/26/2023 17:23' },
      })
    })
    await act(async () => {
      fireEvent.submit(submitButton)
    })
    expect(screen.getByTestId('delivery-price')?.textContent).toBe('7.61 €')
  })
})
