Feature: Output options generates files into target directory
  As a user of the cucumberjs-browser cli tool
  I want to provide a custom output directory for the browser-based testrunner
  So that I can keep my environment organized

  Scenario: Output option provided generates directory
    Given I invoke the tool with output option 'test'
    When The tool is finished
    Then The target directory is accessible at the provided location

  Scenario: Temporary directory generated internally is removed
    Given I invoke the tool with output option 'test'
    When The tool is finished
    Then The directory '.tmp' is not accessible
