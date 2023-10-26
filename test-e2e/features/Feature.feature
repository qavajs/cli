@one @two
Feature: Feature

  Scenario: verify config
    When I verify that config loaded

  Scenario: verify memory
    When I verify that memory loaded

  Scenario: verify process env
    When I verify that process env loaded

  Scenario: verify overrides
    Given I do test

  Scenario: import cjs
    Given I import cjs

  Scenario: import esm
    Given I import esm

