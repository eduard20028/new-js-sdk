"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _operation = require("../operation");

var _create_atomic_swap_bid_request_builder = require("./create_atomic_swap_bid_request_builder");

var _xdr_generated = _interopRequireDefault(require("../generated/xdr_generated"));

var _lodash = require("lodash");

describe('Create ASwapBid request', function () {
  it('Success', function () {
    var opts = {
      baseAmount: '911',
      askID: '69',
      quoteAsset: 'ETH',
      creatorDetails: {
        data: 'new atomic swap'
      }
    };

    var op = _create_atomic_swap_bid_request_builder.CreateAtomicSwapBidRequestBuilder.createAtomicSwapBidRequest(opts);

    var xdrOp = op.toXDR('hex');

    var operation = _xdr_generated.default.Operation.fromXDR(Buffer.from(xdrOp, 'hex'));

    var obj = _operation.Operation.operationToObject(operation);

    expect(obj.type).to.be.equal(_xdr_generated.default.OperationType.createAtomicSwapBidRequest().name);
    expect(obj.baseAmount).to.be.equal(opts.baseAmount);
    expect(obj.askID).to.be.equal(opts.askID);
    expect(obj.quoteAsset).to.be.equal(opts.quoteAsset);
    expect((0, _lodash.isEqual)(opts.creatorDetails, obj.creatorDetails)).to.be.true;
  });
});