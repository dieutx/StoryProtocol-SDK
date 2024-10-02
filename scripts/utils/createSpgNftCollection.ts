import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts'
//import { uploadJSONToIPFS } from './utils/uploadToIpfs'
//import { createHash } from 'crypto'


const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`
const account: Account = privateKeyToAccount(privateKey)

const config: StoryConfig = {  
  account: account,  
  transport: http(process.env.RPC_PROVIDER_URL),  
  chainId: 'iliad',  
}  
const client = StoryClient.newClient(config)

const newCollection = await client.nftClient.createNFTCollection({
  name: 'dieuts NFT',
  symbol: 'DTS',
  txOptions: { waitForTransaction: true },
})

console.log(
  `New SPG NFT collection created at transaction hash ${newCollection.txHash}`,
  `NFT contract address: ${newCollection.nftContract}`
)


/*
const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
  title: 'My IP Asset',
  description: 'This is a test IP asset',
  watermarkImg: 'https://picsum.photos/200',
  attributes: [
    {
      key: 'Rarity',
      value: 'Legendary',
    },
  ],
})

const nftMetadata = {
  name: 'Test NFT',
  description: 'This is a test NFT',
  image: 'https://picsum.photos/200',
}

const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')

*/
