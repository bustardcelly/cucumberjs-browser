Feature: Custom template used to run specs properly
  As a user of the cucumberjs-browser cli tool
  I want to define a custom template
  So that I can run specs in a realistic browser environment for my project

  Scenario: Template option used in generating testrunner document
    Given I invoke the tool with custom template option
    When The tool is finished
    Then The testrunner document should be generated