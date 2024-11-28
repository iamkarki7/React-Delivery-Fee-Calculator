import dayjs from 'dayjs'

export const cartValueSurcharge = (cartValue: number | undefined): number => {
  const minValue = 10
  return cartValue !== undefined && cartValue < minValue
    ? Number((minValue - cartValue).toFixed(2))
    : 0
}

export const ifDeliveryFee = (cartValue: number | undefined): boolean => {
  const maxValue = 100
  return cartValue !== undefined ? cartValue < maxValue : false
}

export const distanceSurcharge = (distance: number | undefined): number => {
  const surcharge = 2
  const minDistance = 1000
  const stepDistance = 500
  return distance !== undefined && distance > minDistance
    ? surcharge + Math.ceil((distance - minDistance) / stepDistance) * 1
    : surcharge
}

export const amountSurcharge = (amount: number | undefined): number => {
  let surcharge = 0
  const numberOfItemNoSurcharge = 4
  const unitExtraCost = 0.5
  const numberOfItemExtraBulkFee = 12
  const extraBulkFee = 1.2
  if (amount !== undefined && amount > numberOfItemNoSurcharge) {
    surcharge =
      amount > numberOfItemExtraBulkFee
        ? (amount - numberOfItemNoSurcharge) * unitExtraCost + extraBulkFee
        : (amount - numberOfItemNoSurcharge) * unitExtraCost
  }
  return surcharge
}

export const ifRushHour = (dateTime: dayjs.Dayjs | null): boolean => {
  const orderMin = dayjs(dateTime).minute()
  const orderHour = dayjs(dateTime).hour()
  const orderDay = dayjs(dateTime).day()
  const rushDay = 5
  const rushHourStart = 15
  const rushHourEnd = 18

  return (orderDay === rushDay && orderHour >= rushHourStart && orderHour <= rushHourEnd) ||
    (orderDay === rushDay && orderHour === rushHourEnd + 1 && orderMin === 0)
    ? true
    : false
}

export const maxDeliveryPrice = (deliveryPrice: number): number => {
  const maxDeliveryPrice = 15
  return deliveryPrice >= maxDeliveryPrice ? maxDeliveryPrice : deliveryPrice
}

export const rushHourDeliveryPrice = (
  cartValue: number | undefined,
  distance: number | undefined,
  amount: number | undefined,
): number => {
  const rushHourSurcharge = 1.2
  const deliveryPrice =
    (cartValueSurcharge(cartValue) + distanceSurcharge(distance) + amountSurcharge(amount)) *
    rushHourSurcharge
  return Number(deliveryPrice.toFixed(2))
}

export const noRushHourDeliveryPrice = (
  cartValue: number | undefined,
  distance: number | undefined,
  amount: number | undefined,
): number => {
  const deliveryPrice =
    cartValueSurcharge(cartValue) + distanceSurcharge(distance) + amountSurcharge(amount)
  return Number(deliveryPrice.toFixed(2))
}
