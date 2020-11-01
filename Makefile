PACTICIPANT := "pact-demo-consumer"
PACT_CLI="docker run --rm -v ${PWD}:${PWD} -e PACT_BROKER_BASE_URL -e PACT_BROKER_TOKEN pactfoundation/pact-cli:0.16.3.0"
# NOTE: Env vars PACT_BROKER_BASE_URL and PACT_BROKER_TOKEN should be specified
# See details: https://github.com/pact-foundation/pact-ruby-cli#usage

TIMES=20   # The # of times to retry while there is an unknown verification result
SECONDS=15 # The time between retries in seconds

# Only deploy from master
ifeq ($(TRAVIS_BRANCH),master)
	DEPLOY_TARGET=deploy
else
	DEPLOY_TARGET=no_deploy
endif


## ====================
## local development tasks
## ====================

build:
	docker-compose -f docker-compose.yml build

start:
	docker-compose -f docker-compose.yml -f docker-compose.override.yml run --service-ports --rm consumer

test:
	docker-compose -f docker-compose.yml -f docker-compose.override.yml run --rm consumer npm test

test_unit:
	docker-compose -f docker-compose.yml -f docker-compose.override.yml run --rm consumer npm run test:unit

test_contract:
	docker-compose -f docker-compose.yml -f docker-compose.override.yml run --rm consumer npm run test:pact

publish_pact:
	docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.publish.yml run --rm consumer sh -c "npm run test:pact && CI=true npm rum posttest:pact"


## =====================
## CI tasks
## =====================

test_unit_ci:
	docker-compose -f docker-compose.yml run --rm consumer npm run test:unit

test_contract_ci:
	docker-compose -f docker-compose.yml run --rm consumer npm run test:pact

publish_pact_ci:
	docker-compose -f docker-compose.yml -f docker-compose.publish.yml run --rm consumer sh -c "npm run test:pact && CI=true npm run posttest:pact"

deploy_to_prod: can_i_deploy $(DEPLOY_TARGET)


## =====================
## Deploy tasks
## =====================

deploy: deploy_app tag_as_prod

no_deploy:
	@echo "Not deploying as not on master branch"

can_i_deploy:
	"${PACT_CLI}" broker can-i-deploy \
	  --pacticipant ${PACTICIPANT} \
	  --version ${TRAVIS_COMMIT} \
	  --retry-while-unknown ${TIMES} \
	  --retry-interval ${SECONDS} \
	  --to prod

deploy_app:
	@echo ">>> Deploying to prod"

tag_as_prod:
	"${PACT_CLI}" broker create-version-tag \
		--pacticipant ${PACTICIPANT} \
		--version ${TRAVIS_COMMIT} \
		--tag prod
