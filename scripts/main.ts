import { http } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts'
import { uploadJSONToIPFS } from './utils/uploadToIpfs'
import { createHash } from 'crypto'
import { PIL_TYPE, CreateIpAssetWithPilTermsResponse, IpMetadata, StoryClient, StoryConfig } from '@story-protocol/core-sdk'

const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`
const account: Account = privateKeyToAccount(privateKey)

const main = async function (){

	const config: StoryConfig = {  
	  account: account,  
	  transport: http(process.env.RPC_PROVIDER_URL),  
	  chainId: 'iliad',  
	}  
	const client = StoryClient.newClient(config)

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
	  name: 'dieuts',
	  description: 'dieutsNFT NFT',
	  image: 'https://picsum.photos/200',
	}



	const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
	const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
	const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
	const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')



	const response: CreateIpAssetWithPilTermsResponse = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
	  nftContract: process.env.NFT_CONTRACT_ADDRESS as Address,
	  pilType: PIL_TYPE.NON_COMMERCIAL_REMIX,
	  ipMetadata: {
		ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
		ipMetadataHash: `0x${ipHash}`,
		nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
		nftMetadataHash: `0x${nftHash}`,
	  },
	  txOptions: { waitForTransaction: true },
	})

	console.log(`Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`)
	console.log(`View on the explorer: https://explorer.story.foundation/ipa/${response.ipId}`)


}

main()