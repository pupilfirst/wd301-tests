import React from 'react'
import TaskCard from './TaskCard'

describe('<TaskCard /> component', () => {
  it('when given an `assigneeName` prop, renders it', () => {
    cy.mount(<TaskCard assigneeName="Avishek"/>)
    cy.contains("Avishek")
  })

  it('when given a `dueDate` renders it as due, and not completed', () => {
    cy.mount(<TaskCard dueDate="22nd March" />)
    cy.contains("Due on: 22nd March", { matchCase: false })
    cy.contains("completed on: 22nd March", { matchCase: false }).should('not.exist')
  })

  it('when given a `completedAtDate`, renders completed on date and not as due', () => {
    cy.mount(<TaskCard completedAtDate="22nd March" />)
    cy.contains("Completed on: 22nd March", { matchCase: false })
    cy.contains("Due on: 22nd March", { matchCase: false }).should('not.exist')
  })

  it('when given `title`, `completedAtDate` and `assigneeName`, renders all the details', () => {
    const props = {
      title: 'Finish React course',
      completedAtDate: '12th April',
      assigneeName: 'Vignesh rajendran'
    }

    cy.mount(<TaskCard {...props} />)
    cy.contains(props.title)
    cy.contains(`Completed on: ${props.completedAtDate}`)
    cy.contains(`Assignee: ${props.assigneeName}`)
  })

  it('when given `title`, `dueDate` and `assigneeName`, renders all the details', () => {
    const props = {
      title: 'Finish React course',
      dueDate: '20th April',
      assigneeName: 'Vignesh rajendran'
    }

    cy.mount(<TaskCard {...props} />)
    cy.contains(props.title)
    cy.contains(`Due on: ${props.dueDate}`)
    cy.contains(`Assignee: ${props.assigneeName}`)
  })
})
