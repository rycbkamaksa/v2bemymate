import { MainRoleEnum, RoleEnum } from '~/types/bemymateAPI/roles'

describe('Profile', () => {
  it('Login', () => {
    cy.login('profile', {
      mainRole: MainRoleEnum.AWP,
      role: RoleEnum.IGL,
      guid: '4cd0d638-8cf3-4770-8b44-d6576f69d2a5',
      wins: 10,
    }).then((user) => {
      cy.intercept('/api/users/*/data/profile').as('profile')
      cy.url().should('include', 'profile')
      cy.wait('@profile')
      cy.contains(user.nickname)
      // TODO проверять статистику
      cy.pause()
      cy.get('#logout').click()
      cy.url().should('include', 'login')
    })
  })
})
