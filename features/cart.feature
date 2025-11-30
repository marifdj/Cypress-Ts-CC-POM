Feature: Cart functionality

  As a user of the online store
  I want to add multiple products to the cart
  And I want to place an order from the cart

  @desktop
  Scenario Outline: User adds <count> products and proceeds to checkout
    Given I open the store
    And I register and login with temporary credentials
    When I add <count> products to the cart
    When I proceed to checkout
    Then I complete all the fields in the checkout page

  Examples:
    | count |
    |   1   |
    |   2   |
    |   3   |

