# Decent Bookmarks

### a Farcaster shared data project, launched in beta 20 May 2024

Works hand-in-hand with [[decent-bookmarks-cast-action](https://github.com/artlu99/decent-bookmarks-cast-action)]. Further discussion in the [[beta launch thread](https://www.supercast.xyz/c/0x0706ea2903a950e7470142fb95451191eec7fe84)]
 and in the gc.

## HOWTO for Users

**Decent Bookmarks** is *beta* and details are subject to change.

**ANY BOOKMARK YOU SAVE IS VISIBLE TO DEVS** but kept private with respect to the general public.

1. execute the Cast Action on any cast. [[Install here](https://warpcast.com/artlu/0x732f2bd1)].
2. execute the Cast Action on the same cast to remove. Example video [[here](https://warpcast.com/artlu/0x7f2c3cb8)].
3. view in a client that has enabled Decent Bookmarks:
   
   - BCBHShow Lite Client [[WIP live client](https://client-bcbhshow.artlu.xyz)] [[FOSS code](https://github.com/artlu99/pinata-lite-client/blob/main/components/bookmarks.tsx)]
   
## Technical HOWTO for Client devs

- see shape of GET API results

   ```
  curl -X GET 'https://decent-bookmarks.artlu.xyz/?fid=6546'
   ```

	 ```
  curl -X GET 'https://decent-bookmarks.artlu.xyz/?fid=6546' | jq
   ```

	- this is an **open** FID which chooses to share data unencrypted
	- almost all FIDs are **closed**, that is, data is only made available to authorized clients
   
- example API call to get encrypted data
  
	 ```
	curl -X GET 'https://decent-bookmarks.artlu.xyz/?fid=391262' -H 'Authorization: Basic {secret}'
	 ```

- message [@artlu99](https://t.me/artlu99) for credentials
    
- show Decent Bookmarks in your FC client
	-  [[live](https://client-bcbhshow.artlu.xyz)] example in Next/React, sorted by time-added-to-list [[code](https://github.com/artlu99/pinata-lite-client/blob/main/components/bookmarks.tsx)]

	-  in *beta*, all user-saved Decent Bookmarks are available to any client on the allowlist. Future development needed to allow users to opt-in to a more cumbersome flow, in order to further customize and segregate access to their data.
 
 -    Basic mental model is a shared pool of data, with a privileged gatekeeper who can rotate keys in order to cut off future access. This invalidates current/future state, but does nothing with data that already was shared broadly. Not suitable for sharing sensitive, unencrypted information.
  
---
	
 ### A Cloudflare Worker endpoint with 3 methods:

- GET - retrieves the entire list of stored bookmarks, decrypting as necessary and as authorized

- POST - adds a cast to the `unfiled` bookmarks list, adding a timestamp

- DELETE - deletes a bookmark from the `unfiled` list

study `types.ts`, run-time validation performed with `@cfworker/json-schema`

Data Availability is handled in *beta* by my "L4", i.e., a Cloudflare datastore. Next step is writing to Hub, L3, or L2.

