Feature: User-defined features option consumes and bundles features
  As a user of the cucumberjs-browser cli tool
  I want to define a target features directory
  So that the proper features, steps and support files are bundled for the browser

  Scenario: Features option used in generating features bundle
    Given I invoke the tool with custom features option
    When I use double-quotes like "such"
    Then The bundled features are accessible on the window global