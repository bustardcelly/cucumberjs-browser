Feature: Message Removal
  As a viewer
  I want to remove a message on my screen
  So I can be clear previous notifications

  Scenario: Button removes message
    Given I am on the home page
    When I click the remove-message button
    Then I am no longer shown a 'hello, world' message