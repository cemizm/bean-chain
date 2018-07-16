# Hyperledger Chaincode
This folder contains the chaincode for hyperledger and implements the business
logic of the vending machine application.

## vending.js
The business logic is implementend in this file and uses wrappers to access the
state informations in the chaincode. This is required in order to mock the
hyperledger chaincode environment and to test the business logic without deploying
it to hyperledger network.

## chaincode.js
This file is reponsible for parsing the chaincode invoke arguments and calling
the corresponding function in the vending machine chaincode. 
