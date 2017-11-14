'use strict';

/* Versioning */
const VERSION_MAJOR = 0;
const VERSION_MINOR = 1;
const VERSION_PATCH = 1;

const VERSION = [ VERSION_MAJOR, VERSION_MINOR, VERSION_PATCH ].join('.');

/* Dependencies */
const hashids = require('hashids');

/* FlakeId */
class FlakeId {

	constructor(options){
		this.options = options || {};

		if(typeof(this.options.id) !== 'undefined'){
			this.id = this.options.id & 0x3FF;
		}else{
			this.id = ((this.options.datacenter || 0) & 0x0F) << 5 | ((this.options.worker || 0) & 0x1F);
		}

		this.id <<= 12;
		this.epoch = +this.options.epoch || 0;
		this.seq = 0;
		this.lastTime = 0;
		this.overflow = false;
		this.seqMask = this.options.seqMask || 0xFFF;

		this.hashids = new hashids();

		return this;
	}

	get(){
		const id = new Buffer(8);
		const time = Date.now() - this.epoch;

		id.fill(0);

		if(time === this.lastTime){
			if(this.overflow){
				throw new Error('Sequence exceeded its maximum value.');
			}

			this.seq = (this.seq + 1) & this.seqMask;

			if(this.seq === 0){
				this.overflow = true;

				throw new Error('Sequence exceeded its maximum value.');
			}
		}else{
			this.overflow = false;
			this.seq = 0;
		}

		this.lastTime = time;

		id.writeUInt32BE(((time & 0x7) << 21) | this.id | this.seq, 4);
		id.writeUInt8(Math.floor(time / (1 << 3)) & 0xFF, 4);
		id.writeUInt16BE(Math.floor(time / (1 << 11)) & 0xFFFF, 2);
		id.writeUInt16BE(Math.floor(time / (1 << 27)) & 0x7FFF, 0);

		return {
			id: id,
			hash: this.hashids.encodeHex(id.toString('hex'))
		};
	}

}

/* Export */
FlakeId.VERSION = VERSION;

module.exports = FlakeId;
