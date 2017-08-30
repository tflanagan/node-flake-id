Flake ID
========

Generate 64-Bit (with 63 signigicant bits) k-ordered, conflict-free ids in a distributed environment.

## Installation
`$ npm install --save git@gitlab.tristianflanagan.com:node-portal/flake-id.git`

## Usage

```js
const FlakeId = require('flake-id');

const flakeid = new FlakeId({
	epoch: 0,
	worker: 0,
	datacenter: 0,
	seqMask: 0xFFF
});

flakeid.get();
// <Buffer 2b 35 05 94 a1 80 00 00>
```

Returns a [Buffer](https://nodejs.org/api/buffer.html) object
