Feature: Format option generates target listener
  As a user of the cucumberjs-browser cli tool
  I want to define the format of test results in the browser environment
  So that I can view failing and passing specs

  Scenario: Format option provided generates file
    Given I invoke the tool with format option 'tap'
    When The tool is finished
    Then The target format listener lib is placed in the 'script' directory

  Scenario: Format library is loaded in browser
    Given I invoke the tool with format option 'tap'
    When The tool is finished
    Then The listener is accessible on the window with global name 'cukelistener'
    And Invokable using instance()