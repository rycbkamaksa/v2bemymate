import { MainRoleEnum, RoleEnum } from '~/types/bemymateAPI/roles'
import { RoleRates } from '~/types/bemymateAPI/matches'
import { searchConf } from '~/modules/socketio-server/consts/matchingConfig'

function slotsLength(players: number, freeSlots: number) {
  cy.get('.player-card').should('have.length', players)
  cy.get('.free-slot').should('have.length', freeSlots)
}

describe('Search', () => {
  it('BeginnerConnectToRoom', () => {
    cy.login('/', {
      mainRole: MainRoleEnum.Rifler,
      role: RoleEnum.Lurker,
      wins: 0
    }).then((user) => {
      slotsLength(1, 4)
      cy.get('#start-search').click()
      // убираем рамку выделения
      cy.get('body').click()

      cy.regUserSearch({
        mainRole: MainRoleEnum.AWP,
        role: RoleEnum.IGL,
        mainGuid: user.guid,
        wins: 0
      })

      cy.wait(2 * searchConf.BEGINNER_SEARCH_DURATION)

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.Entry,
        mainGuid: user.guid,
        wins: 0
      })

      slotsLength(3, 2)

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.Support,
        mainGuid: user.guid,
        wins: 10
      })

      slotsLength(3, 2)

      cy.wait(2 * searchConf.BEGINNER_SEARCH_DURATION)
      slotsLength(4, 1)

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.Anchor,
        mainGuid: user.guid,
        wins: 0
      })

      cy.wait(searchConf.BEGINNER_SEARCH_DURATION / 2)
      slotsLength(4, 1)

      cy.wait(2 * searchConf.BEGINNER_SEARCH_DURATION)
      slotsLength(5, 0)
      cy.wait(1000)

      cy.pause()
    })
  })

  it('Beginner', () => {
    cy.login('/', {
      mainRole: MainRoleEnum.Rifler,
      role: RoleEnum.Lurker,
      wins: 10
    }).then((user) => {
      slotsLength(1, 4)
      cy.get('#start-search').click()

      cy.regUserSearch({
        mainRole: MainRoleEnum.AWP,
        role: RoleEnum.IGL,
        mainGuid: user.guid,
        wins: 10
      })

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.Entry,
        mainGuid: user.guid,
        wins: 0
      })

      slotsLength(2, 3)

      cy.wait(2 * searchConf.BEGINNER_SEARCH_DURATION)
      slotsLength(3, 2)

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.Support,
        mainGuid: user.guid,
        wins: 0
      })

      cy.wait(searchConf.BEGINNER_SEARCH_DURATION / 2)
      slotsLength(3, 2)

      cy.wait(2 * searchConf.BEGINNER_SEARCH_DURATION)
      slotsLength(4, 1)

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.Anchor,
        mainGuid: user.guid,
        wins: 0
      })

      cy.wait(searchConf.BEGINNER_SEARCH_DURATION / 2)
      slotsLength(4, 1)

      cy.wait(2 * searchConf.BEGINNER_SEARCH_DURATION)
      slotsLength(5, 0)

      cy.pause()
    })
  })

  it('Common', () => {
    cy.login('/', {
      mainRole: MainRoleEnum.Rifler,
      role: RoleEnum.Lurker,
      wins: 10
    }).then((user) => {
      slotsLength(1, 4)
      cy.get('#start-search').click()

      cy.regUserSearch({
        mainRole: MainRoleEnum.AWP,
        role: RoleEnum.IGL,
        mainGuid: user.guid,
      })
      cy.pause()

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.Entry,
        mainGuid: user.guid,
      })
      cy.pause()

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.Support,
        mainGuid: user.guid,
      })
      cy.pause()

      // slotsLength(2, 3)

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.Anchor,
        mainGuid: user.guid,
      })
      cy.pause()
      slotsLength(5, 0)
      cy.url().should('include', 'match')
    })
    })

  it('Invariants', () => {
    cy.login('/', {
      mainRole: MainRoleEnum.Rifler,
      role: RoleEnum.Lurker,
      wins: 10
    }).then((user) => {
      slotsLength(1, 4)
      cy.regUserSearch({
        mainRole: MainRoleEnum.AWP,
        role: RoleEnum.Entry,
        mainGuid: user.guid,
      })
      slotsLength(1, 4)
      cy.get('#start-search').click()
      slotsLength(1, 4)

      cy.regUserSearch({
        mainRole: MainRoleEnum.AWP,
        role: RoleEnum.Entry,
        mainGuid: user.guid,
      })
      // slotsLength(2, 3)
      // cy.contains('Entry')
      cy.pause()

      // slotsLength(2, 3)

      cy.regUserSearch({
        mainRole: MainRoleEnum.AWP,
        role: RoleEnum.IGL,
        mainGuid: user.guid,
      })
      cy.pause()

      // slotsLength(2, 3)

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.IGL,
        mainGuid: user.guid,
      })
      cy.pause()

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.IGL,
        mainGuid: user.guid,
      })

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.IGL,
        mainGuid: user.guid,
      })
      // slotsLength(3, 2)

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.IGL,
        mainGuid: user.guid,
      })
      cy.pause()
      // slotsLength(3, 2)

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.Support,
        mainGuid: user.guid,
      }).then((support) => {
        // slotsLength(4, 1)
        cy.removeUserFromSearch(support.guid)
        // slotsLength(3, 2)
      })

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.Support,
        mainGuid: user.guid,
      })
      cy.pause()
      // slotsLength(4, 1)

      cy.regUserSearch({
        mainRole: MainRoleEnum.Rifler,
        role: RoleEnum.Anchor,
        mainGuid: user.guid,
      })
      // slotsLength(5, 0)
    })
  })
})

function setRate(playerNum: number, roleRate: RoleRates, toxicRate: RoleRates, radios: JQuery<HTMLElement>) {
  const playerOffset = (playerNum - 1) * 10
  radios[playerOffset + roleRate - 1].click()
  radios[playerOffset + 5 + toxicRate - 1].click()
}

describe('Lobby', () => {
  // FIXME: Need to ignore elo for this test
  it('Rating and chatting', () => {
    cy.startMatch().then((users)=> {
      cy.login('/', {
        mainRole: users[0].role === RoleEnum.IGL ? MainRoleEnum.AWP : MainRoleEnum.Rifler,
        role: users[0].role,
        guid: users[0].playerGuid,
        wins: 10
      }).then((mainUser) => {
        users.slice(1).forEach((user) => {
          cy.regUserSearch({
            mainRole: user.role === RoleEnum.IGL ? MainRoleEnum.AWP : MainRoleEnum.Rifler,
            role: user.role,
            guid: user.playerGuid,
            wins: 10,
          })
        })

        cy.get('#start-search').click()
        // убираем рамку выделения
        cy.get('body').click()

        cy.wait(2000)
        cy.get('#text-field').type('Всем привет{enter}')
        cy.get('.message-container-own .text-message').should('have.text', 'Всем привет')
        cy.sendChatMsg(mainUser.guid, {
          initiator: '',
          content: '',
        })
        cy.wait(1000)
        cy.get('.message-container-others .text-message').should('have.text', 'Привет')

        // видно ли оценку
        cy.get('#team-review').should('be.visible')

        // натыкиваем значения
        cy.get('.radio-input').then((radios) => {
          setRate(1, RoleRates.Great, RoleRates.Good, radios)
          setRate(2, RoleRates.Ok, RoleRates.Good, radios)
          setRate(3, RoleRates.Terrible, RoleRates.Bad, radios)
        })

        // публикуем оценку
        cy.get('#rates-submit').click()
        cy.wait(1000)
        cy.url().should('eq', Cypress.config().baseUrl+'profile')


        // TODO
        // проверка прошла ли оценка (пока глазами за неимением id)
        // cy.request(`${Cypress.config().baseUrl}api/matches/${}/stats`)

        //дождаться записи резов матча и посмотреть его статы для всех юзеров
        cy.wait(searchConf.MATCH_SUBMIT_TIMEOUT)

        // почистить юзеров, статы и матч
        cy.pause()
      })
    })
  })
})
