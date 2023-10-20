import { useAccount, useConfig, useConnect, useDisconnect } from 'wagmi'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { PasskeyConnector } from '@forum/passkeys'
import { connect } from 'wagmi/dist/actions'

export const useCreateAccount() {
   const config = useConfig()

   const createAccount = async (
     username: string,
     privateKey = generatePrivateKey()
  ) => {
   		const passkey = new ForumPasskey()
       const { address } = privateKeyToAccount(privateKey)

           // - generate the initial passkey for the new user & check that they are 
           // - using a device/browser that supports `largeBlob` webauthn extension
   		const credential = await passkey.create({
   			user: {
   				id: base64URLFromString(address),
   				name: username,
   				displayName: username,
   			},
   			extensions: { largeBlob: { support: 'required' } },
   		})

   		if (!credential?.clientExtensionResults?.largeBlob?.supported)
   			throw new Error('LargeBlob not supported')

           // - optional: if you have access to a secure store (e.g. keychain access)
           // - you can store the pk at this point
         	await storeInYourOwnSecureStoreForPrivateKeys({
               credentialId: credential.id,
               privateKey
           })

           // - init the viem passkey account
   		const largeBlobAccount = new LargeBlobPasskeyAccount({
   			passkey: new ForumPasskey(),
   			privateKey
   		})

           // - init the wagmi passkey connector
   		const connector = new PasskeyConnector({
   			account: largeBlobAccount.toAccount(),
   			config,
   		})

   		connect({ connector })

        // - you could choose to delay the following (storing the large blob)
        // - until the users first tx but for the example we do it here
      	const write = await passkey.get({
          	extensions: { largeBlob: { write: privateKey } },
          	allowCredentials: [{ type: 'public-key', id: credential.id }],
      	})

      	if(!write?.clientExtensionResults.largeBlob?.written)
             throw new Error('failed to store large blob')

   		return credential
   	}

   	return { createAccount }
}