# pact-demo-consumer

[![Build Status](https://travis-ci.com/shilgam/pact-demo-consumer.svg?branch=master)](https://travis-ci.com/shilgam/pact-demo-consumer)

[![Consumer(prod)/provider(prod) Pact Status](https://telegacom.pact.dius.com.au/matrix/provider/pact-demo-provider/latest/prod/consumer/pact-demo-consumer/latest/prod/badge.svg?initials=true)](https://telegacom.pact.dius.com.au/matrix?q[]pacticipant=pact-demo-consumer&q[]tag=prod&q[]latest=true&q[]pacticipant=pact-demo-provider&q[]tag=prod&q[]latest=true&latestby=cvpv&limit=100)
[![Consumer(master)/provider(prod) Pact Status](https://telegacom.pact.dius.com.au/matrix/provider/pact-demo-provider/latest/prod/consumer/pact-demo-consumer/latest/master/badge.svg?initials=true)](https://telegacom.pact.dius.com.au/matrix?q[]pacticipant=pact-demo-consumer&q[]tag=master&q[]latest=true&q[]pacticipant=pact-demo-provider&q[]tag=prod&q[]latest=true&latestby=cvpv&limit=100)
[![Can I deploy master to prod Status](https://telegacom.pact.dius.com.au/pacticipants/pact-demo-consumer/latest-version/master/can-i-deploy/to/prod/badge)](https://telegacom.pact.dius.com.au/pacticipants/pact-demo-consumer/latest-version/master/can-i-deploy/to/prod)

Product Catalog website provides an interface to query the Product service for product information.


## Usage

1. clone this repo

1. cd into project's root dir

1. launch the app

        $ make start
    NOTE: To get a properly functioning consumer app, first [launch the provider app](https://github.com/shilgam/pact-demo-provider#usage).

1. open your browser and navigate to http://localhost:3000


### Run the test suite

1. run all tests at once

        $ make test

1. run only unit tests

        $ make test_unit

1. run only contract tests

        $ make test_contract


### Publish contracts from consumer app to **local** Pact Broker

1. launch Dockerized [Pact Broker](https://github.com/DiUS/pact_broker-docker) locally:

        $ docker-compose -f docker-compose.pactBroker.yml up
    Pact Broker will be accessible at http://localhost:8081

1. build docker image for consumer app (Run from separate terminal window)

        $ make build

1. generate and publish contracts to Pact Broker

        $ LOCAL_PACT_BROKER=true make publish_pact

### Publish contracts from consumer app to **remote** Pact Broker

1. build docker image for consumer app

        $ make build

1. generate and publish contracts to Pact Broker

        $ PACT_BROKER_TOKEN=<YOUR TOKEN> make publish_pact
    where `<YOUR TOKEN>` - API token from pact broker settings.
