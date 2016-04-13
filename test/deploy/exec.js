import test from 'ava'

const td = require('testdouble')
const Promise = require('bluebird')

let apiGateway, lambda, deployFunction

test.before(()=> {
  process.chdir('../fixtures/test-api')

  apiGateway = td.replace('../../src/util/api-gateway')
  lambda = td.replace('../../src/util/lambda')
  deployFunction = td.replace('../../src/deploy-function/exec')

  td.when(apiGateway.createDeployment(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))
  td.when(lambda.publishVersion(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))
  td.when(lambda.addPermission(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))
  td.when(lambda.updateAlias(td.matchers.isA(Object))).thenReturn(Promise.resolve({ AliasArn: 'arn:aws:lambda:us-east-1:654843952338:function:graph-api-graph-ql:'}))
  td.when(lambda.getAlias(td.matchers.isA(Object))).thenReturn(Promise.resolve({}))
  td.when(deployFunction(td.matchers.isA(Object)), { ignoreExtraArgs: true }).thenReturn(Promise.resolve({ FunctionName: 'test' }))

  const deploy = require('../../src/deploy/exec')

  return deploy({ region: 'us-east-1'})
})

test('Deploys functions', () => {
  td.verify(deployFunction(td.matchers.isA(Object)), { times: 2, ignoreExtraArgs: true })
})

test('Publishes functions', ()=> {
  td.verify(lambda.publishVersion(td.matchers.isA(Object)), { times: 2 })
})

test('Sets function alias', ()=> {
  td.verify(lambda.getAlias(td.matchers.isA(Object)), { times: 2 })
  td.verify(lambda.updateAlias(td.matchers.isA(Object)), { times: 2 })
})

test('Sets permissions', ()=> {
  td.verify(lambda.addPermission(td.matchers.isA(Object)), { times: 2 })
})

test('Creates new API deployment', ()=> {
  td.verify(apiGateway.createDeployment(td.matchers.isA(Object)))
})
