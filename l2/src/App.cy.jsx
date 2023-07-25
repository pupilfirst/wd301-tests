import React from 'react'
import App from './App'

describe('<App /> component', () => {
  it('renders without errors', () => {
    cy.mount(<App />)
  })

  it('renders both `pending` and `done` task lists', () => {
    cy.mount(<App />)
    cy.contains("pending", { matchCase: false })
    cy.contains("done", { matchCase: false })
  })
})
