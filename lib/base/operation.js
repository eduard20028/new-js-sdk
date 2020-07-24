"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs2/core-js/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.Operation = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs2/helpers/inherits"));

var _xdr_generated = _interopRequireDefault(require("./generated/xdr_generated"));

var _keypair = require("./keypair");

var _jsXdr = require("js-xdr");

var _hashing = require("./hashing");

var _strkey = require("./strkey");

var _isUndefined = _interopRequireDefault(require("lodash/isUndefined"));

var _base_operation = require("./operations/base_operation");

var _manage_signer_builder = require("./operations/manage_signer_builder");

var _create_account_builder = require("./operations/create_account_builder");

var _manage_key_value_builder = require("./operations/manage_key_value_builder");

var _stamp = require("./operations/stamp");

var _license_operation = require("./operations/license_operation");

var _manage_account_role_builder = require("./operations/manage_account_role_builder");

var _create_data_builder = require("./operations/create_data_builder");

var _update_data_builder = require("./operations/update_data_builder");

var _remove_data_builder = require("./operations/remove_data_builder");

var Operation =
/*#__PURE__*/
function (_BaseOperation) {
  (0, _inherits2.default)(Operation, _BaseOperation);

  function Operation() {
    (0, _classCallCheck2.default)(this, Operation);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Operation).apply(this, arguments));
  }

  (0, _createClass2.default)(Operation, null, [{
    key: "payment",

    /**
       * Create a payment operation.
       * @param {object} opts
       * @param {string} opts.sourceBalanceId - The balance id of source.
       * @param {string} opts.destinationBalanceId - The destination balance ID.
       * @param {boolean} opts.feeFromSource - if true - fee charged from source account, if false - from destination
       * @param {string} opts.amount - The amount to send.
       * @param {string} opts.paymentFee - The payment fee.
       * @param {string} opts.fixedFee - The fixed fee.
       * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
       * @returns {xdr.PaymentOp}
       */
    value: function payment(opts) {
      var attributes = {};

      if (!Operation.isValidAmount(opts.amount)) {
        throw new TypeError('amount argument must be of type String and represent a positive number');
      }

      if (!_keypair.Keypair.isValidBalanceKey(opts.sourceBalanceId)) {
        throw new TypeError('sourceBalanceId is invalid');
      }

      if (!_keypair.Keypair.isValidBalanceKey(opts.destinationBalanceId)) {
        throw new TypeError('destinationBalanceId is invalid');
      }

      if (!Operation.isValidSubject(opts.subject)) {
        throw new Error('subject argument must be of type String 0-256 long');
      }

      if (!(0, _isUndefined.default)(opts.feeData)) {
        var sourceFee = new _xdr_generated.default.Fee({
          percent: _base_operation.BaseOperation._toUnsignedXDRAmount(opts.feeData.sourceFee.percent),
          fixed: _base_operation.BaseOperation._toUnsignedXDRAmount(opts.feeData.sourceFee.fixed),
          ext: new _xdr_generated.default.FeeExt(_xdr_generated.default.LedgerVersion.emptyVersion())
        });
        var destinationFee = new _xdr_generated.default.Fee({
          percent: _base_operation.BaseOperation._toUnsignedXDRAmount(opts.feeData.destinationFee.percent),
          fixed: _base_operation.BaseOperation._toUnsignedXDRAmount(opts.feeData.destinationFee.fixed),
          ext: new _xdr_generated.default.FeeExt(_xdr_generated.default.LedgerVersion.emptyVersion())
        });
        attributes.feeData = new _xdr_generated.default.PaymentFeeData({
          sourceFee: sourceFee,
          destinationFee: destinationFee,
          sourcePaysForDest: opts.feeData.sourcePaysForDest,
          ext: new _xdr_generated.default.PaymentFeeDataExt(_xdr_generated.default.LedgerVersion.emptyVersion())
        });
      } else {
        throw new Error('feeData argument must be defined');
      }

      if ((0, _isUndefined.default)(opts.reference)) {
        opts.reference = '';
      }

      attributes.amount = _base_operation.BaseOperation._toUnsignedXDRAmount(opts.amount);
      attributes.sourceBalanceId = _keypair.Keypair.fromBalanceId(opts.sourceBalanceId).xdrBalanceId();

      var d = _xdr_generated.default.PaymentOpDestination.balance();

      d.set('balance', _keypair.Keypair.fromBalanceId(opts.destinationBalanceId).xdrBalanceId());
      attributes.destination = d;
      attributes.subject = opts.subject;
      attributes.reference = opts.reference;
      attributes.ext = new _xdr_generated.default.PaymentOpExt(_xdr_generated.default.LedgerVersion.emptyVersion());
      var payment = new _xdr_generated.default.PaymentOp(attributes);
      var opAttributes = {};
      opAttributes.body = _xdr_generated.default.OperationBody.payment(payment);
      Operation.setSourceAccount(opAttributes, opts);
      return new _xdr_generated.default.Operation(opAttributes);
    }
    /**
     * Set Fees to the ledger
     * @param {object} opts
     * @param {string} opts.destination - Destination account ID to create an account for.
     * @param {Object} [opts.fee] - Amount in XLM the account should be funded for.
     * @param {string} opts.fee.feeType - feeType
     * @param {string} opts.fee.feeAmount - fee amount
     * @param {string} opts.fee.accountRole - id of account role
     * @param {bool} [opts.isDelete] - isDelete - true for remove fee
     * @param {string} [opts.source] - The source account for the payment. Defaults to the transaction's source account.
     * @returns {xdr.SetFeesOp}
     */

  }, {
    key: "setFees",
    value: function setFees(opts) {
      var attributes = {
        ext: new _xdr_generated.default.SetFeesOpExt(_xdr_generated.default.LedgerVersion.emptyVersion())
      };

      if (!(0, _isUndefined.default)(opts.fee)) {
        if (!Operation.isValidAmount(opts.fee.fixedFee, true)) {
          throw new TypeError('fixedFee argument must be of type String and represent a non-negative number');
        }

        if (!Operation.isValidAmount(opts.fee.percentFee, true, 100)) {
          throw new TypeError('percentFee argument must be of type String and represent a non-negative number less than 100');
        }

        if ((0, _isUndefined.default)(opts.fee.feeType)) {
          throw new TypeError('feeType must be defined');
        }

        if (!(opts.fee.feeType instanceof _xdr_generated.default.FeeType)) {
          throw new TypeError('feeType must be xdr.FeeType');
        }

        if (!Operation.isValidAsset(opts.fee.asset)) {
          throw new TypeError('Asset is invalid');
        }

        if ((0, _isUndefined.default)(opts.fee.period)) {
          opts.fee.period = '0'; // <<clear
        }

        if ((0, _isUndefined.default)(opts.fee.subtype)) {
          opts.fee.subtype = '0';
        }

        if ((0, _isUndefined.default)(opts.fee.lowerBound)) {
          opts.fee.lowerBound = '0';
        }

        if ((0, _isUndefined.default)(opts.fee.upperBound)) {
          opts.fee.upperBound = _base_operation.BaseOperation.MAX_INT64_AMOUNT;
        }

        var feeData = {
          fixedFee: Operation._toXDRAmount(opts.fee.fixedFee),
          percentFee: Operation._toXDRAmount(opts.fee.percentFee),
          feeType: opts.fee.feeType,
          asset: opts.fee.asset,
          subtype: _jsXdr.Hyper.fromString(opts.fee.subtype),
          lowerBound: Operation._toXDRAmount(opts.fee.lowerBound),
          upperBound: Operation._toXDRAmount(opts.fee.upperBound),
          ext: new _xdr_generated.default.FeeEntryExt(_xdr_generated.default.LedgerVersion.emptyVersion())
        };
        var data = "type:".concat(opts.fee.feeType.value, "asset:").concat(opts.fee.asset, "subtype:").concat(opts.fee.subtype.toString());

        if (opts.fee.accountId) {
          if (!_keypair.Keypair.isValidPublicKey(opts.fee.accountId)) {
            throw new TypeError('accountId is invalid');
          } else {
            feeData.accountId = _keypair.Keypair.fromAccountId(opts.fee.accountId).xdrAccountId();
            data += "accountID:".concat(opts.fee.accountId);
          }
        }

        if (opts.fee.accountRole) {
          feeData.accountRole = _jsXdr.UnsignedHyper.fromString(opts.fee.accountRole);
          data += "accountRole:".concat(opts.fee.accountRole);
        }

        feeData.hash = (0, _hashing.hash)(data);
        attributes.fee = new _xdr_generated.default.FeeEntry(feeData);
      }

      if ((0, _isUndefined.default)(opts.isDelete)) {
        attributes.isDelete = false;
      } else {
        attributes.isDelete = opts.isDelete;
      }

      var setfees = new _xdr_generated.default.SetFeesOp(attributes);
      var opAttributes = {};
      opAttributes.body = _xdr_generated.default.OperationBody.setFee(setfees);
      Operation.setSourceAccount(opAttributes, opts);
      return new _xdr_generated.default.Operation(opAttributes);
    }
    /**
       * Returns an XDR ManageBalanceOp. A "manage account" operations creates|deletes balance for account.
       * @param {object} opts
       * @param {string} opts.destination - Account to create account for.
       * @param {string} opts.asset - Asset to manage asset for.
       * @param {xdr.ManageBalanceAction} – Delete or create
       * @returns {xdr.ManageBalanceOp}
       */

  }, {
    key: "manageBalance",
    value: function manageBalance(opts) {
      var attributes = {
        ext: new _xdr_generated.default.ManageBalanceOpExt(_xdr_generated.default.LedgerVersion.emptyVersion())
      };

      if (!_keypair.Keypair.isValidPublicKey(opts.destination)) {
        throw new Error('account is invalid');
      }

      if (!(opts.action instanceof _xdr_generated.default.ManageBalanceAction)) {
        throw new TypeError('action argument should be value of xdr.ManageBalanceAction enum');
      }

      if (!Operation.isValidAsset(opts.asset)) {
        throw new TypeError('asset is invalid');
      }

      attributes.destination = _keypair.Keypair.fromAccountId(opts.destination).xdrAccountId();
      attributes.action = opts.action;
      attributes.asset = opts.asset;
      var manageBalanceOp = new _xdr_generated.default.ManageBalanceOp(attributes);
      var opAttributes = {};
      opAttributes.body = _xdr_generated.default.OperationBody.manageBalance(manageBalanceOp);
      Operation.setSourceAccount(opAttributes, opts);
      return new _xdr_generated.default.Operation(opAttributes);
    }
    /**
       * Returns an XDR ManageAssetPairOp. A "manage asset pair" operations creates|updates asset pair.
       * @param {object} opts
       * @param {string} opts.base - base asset
       * @param {string} opts.quote - quote asset
       * @param {number|string} opts.policies - asset pair policies
       * @param {number|string} opts.physicalPriceCorrection - correction of physical price in percents. If physical price is set and restriction by physical price set, mininal price for offer for this pair will be physicalPrice * physicalPriceCorrection
       * @param {number|string} opts.maxPriceStep - max price step in percent. User is allowed to set offer with price < (1 - maxPriceStep)*currentPrice and > (1 + maxPriceStep)*currentPrice
       * @param {number|string} opts.physicalPrice - physical price
       * @param {xdr.ManageAssetPairAction} – Create or update
       * @returns {xdr.ManageBalanceOp}
       */

  }, {
    key: "manageAssetPair",
    value: function manageAssetPair(opts) {
      var attributes = {
        ext: new _xdr_generated.default.ManageAssetPairOpExt(_xdr_generated.default.LedgerVersion.emptyVersion())
      };

      if (!Operation.isValidAsset(opts.base)) {
        throw new TypeError('base is invalid');
      }

      if (!Operation.isValidAsset(opts.quote)) {
        throw new TypeError('quote is invalid');
      }

      if (!(opts.action instanceof _xdr_generated.default.ManageAssetPairAction)) {
        throw new TypeError('action argument should be value of xdr.ManageAssetPairAction enum');
      }

      if ((0, _isUndefined.default)(opts.policies)) {
        throw new TypeError('policies are not defined');
      }

      if (!Operation.isValidAmount(opts.physicalPriceCorrection, true)) {
        throw new TypeError('physicalPriceCorrection argument must be of type String and represent a positive number or zero');
      }

      if (!Operation.isValidAmount(opts.maxPriceStep, true)) {
        throw new TypeError('maxPriceStep argument must be of type String and represent a positive number or zero');
      }

      if (!Operation.isValidAmount(opts.physicalPrice, true)) {
        throw new TypeError('physicalPrice argument must be of type String and represent a positive number or zero');
      }

      attributes.base = opts.base;
      attributes.quote = opts.quote;
      attributes.policies = opts.policies;
      attributes.action = opts.action;
      attributes.physicalPriceCorrection = Operation._toXDRAmount(opts.physicalPriceCorrection); // won't be updated

      attributes.physicalPrice = Operation._toXDRAmount(opts.physicalPrice);
      attributes.maxPriceStep = Operation._toXDRAmount(opts.maxPriceStep);
      var manageAssetPairOp = new _xdr_generated.default.ManageAssetPairOp(attributes);
      var opAttributes = {};
      opAttributes.body = _xdr_generated.default.OperationBody.manageAssetPair(manageAssetPairOp);
      Operation.setSourceAccount(opAttributes, opts);
      return new _xdr_generated.default.Operation(opAttributes);
    }
    /**
       * Converts the XDR Operation object to the opts object used to create the XDR
       * operation.
       * @param {xdr.Operation} operation - An XDR Operation.
       * @return {Operation}
       */

  }, {
    key: "operationToObject",
    value: function operationToObject(operation) {
      function accountIdtoAddress(accountId) {
        return (0, _strkey.encodeCheck)('accountId', accountId.ed25519());
      }

      var result = {};

      if (operation.sourceAccount()) {
        result.source = accountIdtoAddress(operation.sourceAccount());
      }

      var attrs = operation.body().value();
      result.type = operation.body().switch().name;

      switch (operation.body().switch()) {
        case _xdr_generated.default.OperationType.createAccount():
          _create_account_builder.CreateAccountBuilder.createAccountToObject(result, attrs);

          break;

        case _xdr_generated.default.OperationType.manageSigner():
          _manage_signer_builder.ManageSignerBuilder.manageSignerToObject(result, attrs);

          break;

        case _xdr_generated.default.OperationType.manageKeyValue():
          _manage_key_value_builder.ManageKeyValueBuilder.manageKeyValueOpToObject(result, attrs);

          break;

        case _xdr_generated.default.OperationType.stamp():
          _stamp.StampBuilder.stampToObject(result, attrs);

          break;

        case _xdr_generated.default.OperationType.license():
          _license_operation.LicenseBuilder.licenseToObject(result, attrs);

          break;

        case _xdr_generated.default.OperationType.manageAccountRole():
          _manage_account_role_builder.ManageAccountRoleBuilder.manageAccountRoleToObject(result, attrs);

          break;

        case _xdr_generated.default.OperationType.createDatum():
          _create_data_builder.CreateDataBuilder.createDataToObject(result, attrs);

          break;

        case _xdr_generated.default.OperationType.updateDatum():
          _update_data_builder.UpdateDataBuilder.updateDataToObject(result, attrs);

          break;

        case _xdr_generated.default.OperationType.removeDatum():
          _remove_data_builder.RemoveDataBuilder.removeDataToObject(result, attrs);

          break;

        default:
          throw new Error('Unknown operation');
      }

      return result;
    }
  }]);
  return Operation;
}(_base_operation.BaseOperation);

exports.Operation = Operation;