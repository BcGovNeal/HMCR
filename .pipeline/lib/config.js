'use strict';
const options= require('pipeline-cli').Util.parseArguments()
const changeId = options.pr //aka pull-request
const version = '1.0.0'
const name = 'hmcr'

const phases = {
  build:  {namespace:'txkggj-tools' , name: `${name}`, phase: 'build' , changeId:changeId, suffix: `-build-${changeId}` , instance: `${name}-build-${changeId}` , version:`${version}-${changeId}`  , tag:`build-${version}-${changeId}`},
  dev:    {namespace:'txkggj-dev'   , name: `${name}`, phase: 'dev'   , changeId:changeId, suffix: `-dev-${changeId}`   , instance: `${name}-dev-${changeId}`   , version:`${version}-${changeId}`  , tag:`dev-${version}-${changeId}`  , host: `hmr-${changeId}-txkggj-dev.pathfinder.gov.bc.ca` , dotnet_env: 'Development'},
  test:   {namespace:'txkggj-test'  , name: `${name}`, phase: 'test'  , changeId:changeId, suffix: `-test`              , instance: `${name}-test`              , version:`${version}`              , tag:`test-${version}`             , host: `hmr-txkggj-test.pathfinder.gov.bc.ca`            , dotnet_env: 'Test'},
  uat:    {namespace:'txkggj-test'  , name: `${name}`, phase: 'uat'  ,  changeId:changeId, suffix: `-uat`              ,  instance: `${name}-uat`              ,  version:`${version}`              , tag:`uat-${version}`             ,  host: `hmr-txkggj-uat.pathfinder.gov.bc.ca`            ,  dotnet_env: 'UAT'},
  prod:   {namespace:'txkggj-prod'  , name: `${name}`, phase: 'prod'  , changeId:changeId, suffix: `-prod`              , instance: `${name}-prod`              , version:`${version}`              , tag:`prod-${version}`             , host: `hmr-txkggj.pathfinder.gov.bc.ca`            ,      dotnet_env: 'Production'},
};

// This callback forces the node process to exit as failure.
process.on('unhandledRejection', (reason) => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = {phases, options};