/// <reference types="cypress" />

import type { IUser } from '~/types/user'
import type { MainRoleEnum, RoleEnum } from '~/types/bemymateAPI/roles'
import jwtDecode from 'jwt-decode'

interface ITestUser {
  mainRole: MainRoleEnum
  role: RoleEnum
  mainGuid?: string
  guid?: string
  wins?: number
  rating?: number
  toxicRate?: number
}

interface ITestChatMsg {
  initiator: string
  content: string
}

declare global {
  namespace Cypress {
    interface Chainable {
      login(route: string, user?: ITestUser): Chainable<IUser>
      // Тут чет придумать надо с ним
      regUserSearch(user: ITestUser)
      startMatch()
      removeUserFromSearch(guid: string)
      sendChatMsg(guid: string, msgInfo: ITestChatMsg)
    }
  }
}

function userDataset<T>(user: ITestUser) {
  let params = new URLSearchParams();
  for (const key in user) {
    params.append(key, user[key])
  }

  return cy
    .request<T>(Cypress.config().baseUrl + `api/dataset/user?${params.toString()}` )
    .as('dataset:user')
}

Cypress.Commands.add('login', (route: string, user?: ITestUser) => {
  userDataset<{ jwt: string }>(user).then((res) => {
    localStorage.setItem('jwt', res.body.jwt)
    cy.visit(route || '/')
    cy.wrap(jwtDecode(res.body.jwt)).as('user')
  })
})

Cypress.Commands.add('regUserSearch', (user: ITestUser) => {
  // добавление юзера в поиск
  userDataset<{ jwt: string }>(user).then((res) => {
    const { guid } = jwtDecode(res.body.jwt) as IUser
    cy.request({
      url: `http://localhost:5176/${user.mainGuid}/add_participant?guid=${guid}`,
      method: 'POST',
    })
  })
})

Cypress.Commands.add('removeUserFromSearch', (guid: string) => {
  // удаление юзера из поиска
  cy.request({
    url: `http://localhost:5176/remove_participant?guid=${guid}`,
    method: 'POST',
  })
})

Cypress.Commands.add('sendChatMsg', (guid: string, msgInfo: ITestChatMsg) => {
  cy.request({
    url: `http://localhost:5176/send_msg?guid=${guid}`,
    method: 'POST',
    body: msgInfo,
  })
})

Cypress.Commands.add('startMatch', () => {
  cy.request<{playerGuid: string, role: RoleEnum}[]>({
    url: Cypress.config().baseUrl + 'api/dataset/match',
    method: 'GET',
  }).then((res) => {
    return res.body
  })
})

// Иначе тайпскрипт сходит с ума
export {}
