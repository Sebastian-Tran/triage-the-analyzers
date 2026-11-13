/* global cy, describe, it, beforeEach */

// UserRegistration.vue reads courseId and sectionId from the invitation link. The backend validates both for every
// role (UserInvitationService.validateUserInvitation), so a link without them can never register: the page must
// reject it up front, as it already does for a link missing email, token, or role.
describe('Registration link validation', () => {
  beforeEach(() => {
    // The email is not registered yet; stubbed so no backend is needed
    cy.intercept('GET', '**/users/exists/*', {
      body: { flag: true, code: 200, message: 'Check email successfully', data: false }
    }).as('checkEmail')
  })

  it('shows the registration form for a complete link', () => {
    cy.visit('/register?email=new.student@abc.edu&token=abc123&courseId=1&sectionId=2&role=student')

    cy.get('.el-form').should('be.visible')
    cy.location('pathname').should('eq', '/register')
  })

  it('rejects a link without courseId and sectionId', () => {
    cy.visit('/register?email=new.student@abc.edu&token=abc123&role=student')

    cy.location('pathname').should('eq', '/403')
  })

  it('rejects a link whose courseId is not a number', () => {
    cy.visit(
      '/register?email=new.student@abc.edu&token=abc123&courseId=abc&sectionId=2&role=student'
    )

    cy.location('pathname').should('eq', '/403')
  })
})
