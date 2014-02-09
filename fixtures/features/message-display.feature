Feature: Message Display
  As a viewer
  I want to see a messages on my screen
  So I can be notified of actions

  Scenario: Button adds message
    Given I am on the home page
    When I click the add-message button
    Then I am shown a 'hello, world' message