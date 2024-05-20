```
pnpm run dev
pnpm run deploy
```

# Decent Bookmarks

### a Farcaster shared data project, launched 20 May 2024

[[launch thread](https://www.supercast.xyz/c/0x0706ea2903a950e7470142fb95451191eec7fe84)]

Works hand-in-hand with [[decent-bookmarks-cast-action](https://github.com/artlu99/decent-bookmarks-cast-action)]

A Cloudflare Worker endpoint with 3 methods:

- GET - retrieves the entire list of stored bookmarks, decrypting as necessary and as authorized

- POST - adds a cast to the `unfiled` bookmarks list, adding a timestamp

- DELETE - deletes a bookmark from the `unfiled` list


`types.ts`, run-time validation with `@cfworker/json-schema`
---
Further discussion on Farcaster, in the launch thread and in the gc
