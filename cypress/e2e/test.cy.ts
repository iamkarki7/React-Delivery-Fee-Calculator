import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

describe('Delivery Fee Calculator Tests', () => {
  beforeEach(() => {
    cy.visit('/')
    const now = dayjs.tz('2024-05-08 17:00:00')
    cy.clock(now.valueOf())
  })

  it('contains a correct app name', () => {
    cy.getDataTestId('app-title')
      .contains(/delivery fee calculator/i)
      .should('be.visible')
  })

  it('caculates the delivery price correctly (not in rush hour)', () => {
    cy.getDataTestId('cart-value').type('10')

    cy.getDataTestId('delivery-distance').type('999')

    cy.getDataTestId('amount-of-items').type('3')

    cy.getDataTestId('CalendarIcon').click()

    cy.get('.MuiCalendarPicker-root').should('be.visible')

    cy.get('button.MuiButtonBase-root').then(($btn) => {
      if ($btn.is(':enabled')) {
        cy.wrap($btn).contains('9').click()
      } else {
        throw new Error('Button not found or is disabled')
      }
    })

    cy.getDataTestId('your-delivery-price').should('not.be.visible')

    cy.getDataTestId('submit-button').click()

    cy.getDataTestId('your-delivery-price').should('be.visible')

    cy.getDataTestId('delivery-price').should('not.be.empty').and('have.text', '2 €')
  })

  it('caculates the delivery price correctly (in rush hour)', () => {
    cy.getDataTestId('cart-value').type('10')

    cy.getDataTestId('delivery-distance').type('999')

    cy.getDataTestId('amount-of-items').type('3')

    cy.getDataTestId('CalendarIcon').click()

    cy.get('.MuiCalendarPicker-root').should('be.visible')

    cy.get('button.MuiButtonBase-root').then(($btn) => {
      if ($btn.is(':enabled')) {
        cy.wrap($btn).contains('17').click()
      } else {
        throw new Error('Button not found or is disabled')
      }
    })

    cy.getDataTestId('your-delivery-price').should('not.be.visible')

    cy.getDataTestId('submit-button').click()

    cy.getDataTestId('your-delivery-price').should('be.visible')

    cy.getDataTestId('delivery-price').should('not.be.empty').and('have.text', '2.4 €')
  })

  it('shows error messages for invalid inputs', () => {
    cy.getDataTestId('cart-value').type('9999999')
    cy.get('body').click(0, 0)
    cy.get('.cart-value .MuiFormHelperText-root').and(
      'have.text',
      'cartValue must be less than or equal to 1000',
    )

    cy.getDataTestId('delivery-distance').type('12000')
    cy.get('body').click(0, 0)
    cy.get('.delivery-distance .MuiFormHelperText-root').and(
      'have.text',
      'distance must be less than or equal to 10000',
    )

    cy.getDataTestId('amount-of-items').type('30')
    cy.get('body').click(0, 0)
    cy.get('.amount-of-items .MuiFormHelperText-root').and(
      'have.text',
      'amount must be less than or equal to 20',
    )
  })

  it('shows error messages when any of the fields is not filled on submit', () => {
    cy.getDataTestId('cart-value').type('1')

    cy.getDataTestId('delivery-distance').type('150')

    cy.getDataTestId('submit-button').click()

    cy.get('.MuiFormHelperText-root').and('have.text', 'This field is required.')
  })
})
