"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.ManageAssetBuilder = void 0;

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/json/stringify"));

var _isNan = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/number/is-nan"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _xdr_generated = _interopRequireDefault(require("../generated/xdr_generated"));

var _isUndefined = _interopRequireDefault(require("lodash/isUndefined"));

var _base_operation = require("./base_operation");

var _keypair = require("../keypair");

var _jsXdr = require("js-xdr");

var _hashing = require("../hashing");

var ManageAssetBuilder =
/*#__PURE__*/
function () {
  function ManageAssetBuilder() {
    (0, _classCallCheck2.default)(this, ManageAssetBuilder);
  }

  (0, _createClass2.default)(ManageAssetBuilder, null, [{
    key: "assetCreationRequest",

    /**
       * Creates operation to create asset creation request
       * @param {object} opts
       *
       * @param {string} opts.requestID - request ID, if 0 - creates new, updates otherwise
       * @param {string} opts.code - Asset code
       * @param {string} opts.preissuedAssetSigner - AccountID of keypair which will sign request for asset to be authrorized to be issued
       * @param {string} opts.maxIssuanceAmount - Max amount can be issued of that asset
       * @param {number} opts.policies - Asset policies
       * @param {string} opts.assetType - asset type
       * @param {string} opts.initialPreissuedAmount - Amount of pre issued tokens available after creation of the asset
       * @param {number} opts.trailingDigitsCount - Count of digits after the comma
       * @param {number} opts.allTasks - tasks for the request
       * @param {object} opts.creatorDetails - Additional details about asset
       * @param {string} opts.creatorDetails.name - Name of the asset
       * @param {array}  opts.creatorDetails.documents - Documents attached to asset
       * @param {string} opts.creatorDetails.logo - Asset picture
       * @param {string} opts.creatorDetails.logo.key - Key to compose asset picture url
       * @param {string} opts.creatorDetails.logo.type - Content type of asset logo
       * @param {string} opts.creatorDetails.terms - Asset terms
       * @param {string} opts.creatorDetails.terms.type - Content type of terms document
       * @param {string} opts.creatorDetails.terms.name - Name of terms document
       *
       * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
       *
       * @returns {xdr.ManageAssetOp}
       */
    value: function assetCreationRequest(opts) {
      var attrs = ManageAssetBuilder._createUpdateAttrs(opts);

      if (!_keypair.Keypair.isValidPublicKey(opts.preissuedAssetSigner)) {
        throw new Error('opts.preissuedAssetSigner is invalid');
      }

      attrs.preissuedAssetSigner = _keypair.Keypair.fromAccountId(opts.preissuedAssetSigner).xdrAccountId();

      if (!_base_operation.BaseOperation.isValidAmount(opts.maxIssuanceAmount, true)) {
        throw new Error('opts.maxIssuanceAmount is invalid');
      }

      attrs.maxIssuanceAmount = _base_operation.BaseOperation._toUnsignedXDRAmount(opts.maxIssuanceAmount);

      if ((0, _isUndefined.default)(opts.initialPreissuedAmount)) {
        opts.initialPreissuedAmount = '0';
      }

      if (!_base_operation.BaseOperation.isValidAmount(opts.initialPreissuedAmount, true)) {
        throw new Error('opts.initialPreissuedAmount is invalid');
      }

      attrs.initialPreissuedAmount = _base_operation.BaseOperation._toUnsignedXDRAmount(opts.initialPreissuedAmount);
      attrs.sequenceNumber = 0;
      attrs.type = _jsXdr.UnsignedHyper.fromString(opts.assetType);

      if ((0, _isNan.default)(opts.trailingDigitsCount) && opts.trailingDigitsCount >= 0 && opts.trailingDigitsCount <= 6) {
        throw new Error('opts.trailingDigitsCount is invalid');
      }

      attrs.trailingDigitsCount = opts.trailingDigitsCount;
      attrs.ext = new _xdr_generated.default.AssetCreationRequestExt(_xdr_generated.default.LedgerVersion.emptyVersion());

      var r = _xdr_generated.default.ManageAssetOpRequest.createAssetCreationRequest();

      r.set('createAssetCreationRequest', new _xdr_generated.default.ManageAssetOpCreateAssetCreationRequest({
        createAsset: new _xdr_generated.default.AssetCreationRequest(attrs),
        allTasks: opts.allTasks,
        ext: new _xdr_generated.default.ManageAssetOpCreateAssetCreationRequestExt(_xdr_generated.default.LedgerVersion.emptyVersion())
      }));
      return ManageAssetBuilder._createManageAssetOp(opts, r);
    }
    /**
       * Creates operation to create asset update request
       * @param {object} opts
       *
       * @param {string} opts.requestID - request ID, if 0 - creates new, updates otherwise
       * @param {string} opts.code - Asset code
       * @param {number} opts.policies - asset policies
       * @param {number} opts.allTasks - tasks for the request
       *
       * @param {object} opts.creatorDetails - Additional details about asset
       * @param {string} opts.creatorDetails.name - Name of the asset
       * @param {string} opts.creatorDetails.logo - Asset picture
       * @param {string} opts.creatorDetails.logo.key - Key to compose asset picture url
       * @param {string} opts.creatorDetails.logo.type - Content type of asset logo
       * @param {string} opts.creatorDetails.terms - Asset terms
       * @param {string} opts.creatorDetails.terms.type - Content type of terms document
       * @param {string} opts.creatorDetails.terms.name - Name of terms document
       *
       * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
       *
       * @returns {xdr.ManageAssetOp}
       */

  }, {
    key: "assetUpdateRequest",
    value: function assetUpdateRequest(opts) {
      var attrs = ManageAssetBuilder._createUpdateAttrs(opts);

      attrs.sequenceNumber = 0;
      attrs.ext = new _xdr_generated.default.AssetUpdateRequestExt(_xdr_generated.default.LedgerVersion.emptyVersion());

      var r = _xdr_generated.default.ManageAssetOpRequest.createAssetUpdateRequest();

      r.set('createAssetUpdateRequest', new _xdr_generated.default.ManageAssetOpCreateAssetUpdateRequest({
        updateAsset: new _xdr_generated.default.AssetUpdateRequest(attrs),
        allTasks: opts.allTasks,
        ext: new _xdr_generated.default.ManageAssetOpCreateAssetUpdateRequestExt(_xdr_generated.default.LedgerVersion.emptyVersion())
      }));
      return ManageAssetBuilder._createManageAssetOp(opts, r);
    }
    /**
       * Creates operation to cancel asset creation/update request
       * @param {object} opts
       * @param {string} opts.requestID - request ID
       * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
       * @returns {xdr.ManageAssetOp}
       */

  }, {
    key: "cancelAssetRequest",
    value: function cancelAssetRequest(opts) {
      var attrs = {
        ext: new _xdr_generated.default.CancelAssetRequestExt(_xdr_generated.default.LedgerVersion.emptyVersion())
      };
      var cancelAssetRequest = new _xdr_generated.default.CancelAssetRequest(attrs);
      return ManageAssetBuilder._createManageAssetOp(opts, new _xdr_generated.default.ManageAssetOpRequest.cancelAssetRequest(cancelAssetRequest));
    }
    /**
       * Creates operation to cancel asset creation/update request
       * @param {object} opts
       * @param {string} opts.accountID - accountID to whome rights will be passed
       * @param {string} opts.code - asset code for which to rights will be passed
       * @param {KeyPair} opts.keyPair - current pre issue signer of the asset
       * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
       * @returns {xdr.ManageAssetOp}
       */

  }, {
    key: "changeAssetPreIssuer",
    value: function changeAssetPreIssuer(opts) {
      if (!_keypair.Keypair.isValidPublicKey(opts.accountID)) {
        throw new Error('opts.accountID is invalid');
      }

      if ((0, _isUndefined.default)(opts.code)) {
        throw new Error('opts.code is invalid - must be string');
      }

      opts.requestID = '0';
      var attrs = {
        ext: new _xdr_generated.default.AssetChangePreissuedSignerExt(_xdr_generated.default.LedgerVersion.emptyVersion()),
        accountId: _keypair.Keypair.fromAccountId(opts.accountID).xdrAccountId(),
        code: opts.code,
        signature: opts.keyPair.signDecorated(this._getSignatureData(opts))
      };
      var changePreissuedSigner = new _xdr_generated.default.AssetChangePreissuedSigner(attrs);
      return ManageAssetBuilder._createManageAssetOp(opts, new _xdr_generated.default.ManageAssetOpRequest.changePreissuedAssetSigner(changePreissuedSigner));
    }
  }, {
    key: "_getSignatureData",
    value: function _getSignatureData(opts) {
      if ((0, _isUndefined.default)(opts.accountID)) {
        throw new Error('opts.accountId is invalid');
      }

      if ((0, _isUndefined.default)(opts.code)) {
        throw new Error('opts.code is invalid');
      }

      var rawSignatureData = "".concat(opts.code, ":").concat(opts.accountID);
      return (0, _hashing.hash)(rawSignatureData);
    }
  }, {
    key: "_getValidDetails",
    value: function _getValidDetails(opts) {
      var creatorDetails = opts.creatorDetails;

      if ((0, _isUndefined.default)(creatorDetails)) {
        creatorDetails = {};
      }

      if ((0, _isUndefined.default)(creatorDetails.name)) {
        creatorDetails.name = '';
      }

      if ((0, _isUndefined.default)(creatorDetails.terms)) {
        creatorDetails.terms = {};
      }

      if ((0, _isUndefined.default)(creatorDetails.terms.key)) {
        creatorDetails.terms.key = '';
      }

      if ((0, _isUndefined.default)(creatorDetails.terms.type)) {
        creatorDetails.terms.type = '';
      }

      if ((0, _isUndefined.default)(creatorDetails.terms.name)) {
        creatorDetails.terms.name = '';
      }

      if ((0, _isUndefined.default)(creatorDetails.logo)) {
        creatorDetails.logo = {};
      }

      if ((0, _isUndefined.default)(creatorDetails.logo.key)) {
        creatorDetails.logo.key = '';
      }

      if ((0, _isUndefined.default)(creatorDetails.logo.type)) {
        creatorDetails.logo.type = '';
      }

      return creatorDetails;
    }
  }, {
    key: "_createUpdateAttrs",
    value: function _createUpdateAttrs(opts) {
      if (!_base_operation.BaseOperation.isValidAsset(opts.code)) {
        throw new Error('opts.code is invalid');
      }

      if ((0, _isUndefined.default)(opts.policies) || opts.policies < 0) {
        throw new Error('opts.policies must be nonnegative number');
      }

      var creatorDetails = ManageAssetBuilder._getValidDetails(opts);

      if ((0, _isUndefined.default)(opts.requestID)) {
        opts.requestID = '0';
      }

      if ((0, _isUndefined.default)(opts.sequenceNumber)) {
        opts.sequenceNumber = 0;
      }

      var attrs = {
        code: opts.code,
        policies: opts.policies,
        creatorDetails: (0, _stringify.default)(creatorDetails),
        sequenceNumber: opts.sequenceNumber
      };
      return attrs;
    }
  }, {
    key: "_createManageAssetOp",
    value: function _createManageAssetOp(opts, request) {
      if ((0, _isUndefined.default)(opts.requestID)) {
        throw new Error('opts.requestID is invalid');
      }

      var assetUpdateOp = new _xdr_generated.default.ManageAssetOp({
        requestId: _jsXdr.UnsignedHyper.fromString(opts.requestID),
        request: request,
        ext: new _xdr_generated.default.ManageAssetOpExt(_xdr_generated.default.LedgerVersion.emptyVersion())
      });
      var opAttributes = {
        source: undefined
      };
      opAttributes.body = _xdr_generated.default.OperationBody.manageAsset(assetUpdateOp);

      _base_operation.BaseOperation.setSourceAccount(opAttributes, opts);

      return new _xdr_generated.default.Operation(opAttributes);
    }
  }, {
    key: "manageAssetToObject",
    value: function manageAssetToObject(result, attrs) {
      result.requestID = attrs.requestId().toString();
      result.requestType = attrs.request().switch().name;

      switch (attrs.request().switch()) {
        case _xdr_generated.default.ManageAssetAction.createAssetCreationRequest():
          {
            var request = attrs.request().createAssetCreationRequest().createAsset();
            result.code = request.code().toString();
            result.preissuedAssetSigner = _base_operation.BaseOperation.accountIdtoAddress(request.preissuedAssetSigner());
            result.policies = request.policies();
            result.maxIssuanceAmount = _base_operation.BaseOperation._fromXDRAmount(request.maxIssuanceAmount());
            result.initialPreissuedAmount = _base_operation.BaseOperation._fromXDRAmount(request.initialPreissuedAmount());
            result.creatorDetails = JSON.parse(request.creatorDetails());
            result.assetType = request.type().toString();
            result.allTasks = attrs.request().createAssetCreationRequest().allTasks();
            break;
          }

        case _xdr_generated.default.ManageAssetAction.createAssetUpdateRequest():
          {
            var _request = attrs.request().createAssetUpdateRequest().updateAsset();

            result.code = _request.code().toString();
            result.policies = _request.policies();
            result.creatorDetails = JSON.parse(_request.creatorDetails());
            result.allTasks = attrs.request().createAssetUpdateRequest().allTasks();
            break;
          }

        case _xdr_generated.default.ManageAssetAction.cancelAssetRequest():
          {
            // nothing to do here
            break;
          }

        case _xdr_generated.default.ManageAssetAction.changePreissuedAssetSigner():
          {
            var _request2 = attrs.request().changePreissuedSigner();

            result.code = _request2.code().toString();
            result.accountID = _base_operation.BaseOperation.accountIdtoAddress(_request2.accountId());
            break;
          }
      }
    }
  }]);
  return ManageAssetBuilder;
}();

exports.ManageAssetBuilder = ManageAssetBuilder;