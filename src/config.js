const CONTRACT_NAME = process.env.CONTRACT_NAME || 'cryptokids'
const MINTBASE_API_KEY = process.env.MINTBASE_API_KEY || ''
const MINTBASE_CONTRACT =
  process.env.MINTBASE_CONTRACT || 'cryptokids.mintspace2.testnet'

let default_config = {
  contractName: CONTRACT_NAME,
}

function getConfig(env) {
  switch (env) {
    case 'production':
    case 'mainnet':
      return {
        ...default_config,
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
      }
    case 'development':
    case 'testnet':
      return {
        ...default_config,
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
      }
    case 'betanet':
      return {
        ...default_config,
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org',
        explorerUrl: 'https://explorer.betanet.near.org',
      }
    case 'local':
      return {
        ...default_config,
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet',
      }
    case 'test':
    case 'ci':
      return {
        ...default_config,
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        masterAccount: 'test.near',
      }
    case 'ci-betanet':
      return {
        ...default_config,
        networkId: 'shared-test-staging',
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        masterAccount: 'test.near',
      }
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/config.js.`
      )
  }
}

function getMintbaseConfig(env) {
  switch (env) {
    case 'production':
    case 'mainnet':
      return {
        mintbaseApiKey: MINTBASE_API_KEY,
        mintbaseContractName: MINTBASE_CONTRACT,
      }
    case 'development':
    case 'testnet':
      return {
        mintbaseApiKey: MINTBASE_API_KEY,
        mintbaseContractName: MINTBASE_CONTRACT,
      }
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/config.js.`
      )
  }
}

module.exports = getConfig

exports.getMintbaseConfig = getMintbaseConfig
