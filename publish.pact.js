const { Publisher } = require('@pact-foundation/pact');
const path = require('path');

if (!process.env.CI) {
  console.log('skipping Pact publish...');
  process.exit();
}

const pactBrokerUrl = process.env.LOCAL_PACT_BROKER ? process.env.LOCAL_PACT_BROKER_URL : process.env.PACT_BROKER_URL;
const providerBaseUrl = process.env.PROVIDER_BASE_URL;
const pactFilesOrDirs = [path.resolve(__dirname, './pacts/')];
const gitCommitHash = require('child_process')
  .execSync('git rev-parse HEAD | tr -d "\n"')
  .toString().trim();

const localGitBranch = require('child_process')
  .execSync('git rev-parse --abbrev-ref HEAD | tr -d "\n"')
  .toString();

const gitBranch = process.env.TRAVIS_BRANCH || localGitBranch;

let opts;
if (typeof process.env.LOCAL_PACT_BROKER === 'undefined' || process.env.LOCAL_PACT_BROKER !== 'true') {
  console.log('Publishing contract to remote Pact Broker...');

  opts = {
    providerBaseUrl,
    pactFilesOrDirs,
    pactBroker: pactBrokerUrl,
    tags: [gitBranch],
    consumerVersion: gitCommitHash,
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  };
} else {
  console.log('Publishing contract to local Pact Broker...');

  opts = {
    providerBaseUrl,
    pactFilesOrDirs,
    pactBroker: pactBrokerUrl,
    tags: [gitBranch],
    consumerVersion: gitCommitHash,
    pactBrokerUsername: process.env.LOCAL_PACT_BROKER_USERNAME,
    pactBrokerPassword: process.env.LOCAL_PACT_BROKER_PASSWORD,
  };
}

console.log('>>>>> opts:');
console.log(opts);

new Publisher(opts)
  .publishPacts(opts)
  .then(() => {
    console.log('Pact contract publishing complete!');
    console.log('');
    console.log(`Head over to ${pactBrokerUrl} and login with`);
    console.log(`=> Username: ${process.env.LOCAL_PACT_BROKER_USERNAME}`);
    console.log(`=> Password: ${process.env.LOCAL_PACT_BROKER_PASSWORD}`);
    console.log('to see your published contracts.');
  })
  .catch((e) => {
    console.log('Pact contract publishing failed: ', e);
  });
