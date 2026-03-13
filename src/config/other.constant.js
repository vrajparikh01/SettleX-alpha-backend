
exports.launchType = {
  pre : 1,
  post : 0,
  values : function () {
      return ([this.pre,this.post]);
  }
}

exports.tradeType = {
  SELL : 0,
  BUY : 1,
  CANCEL: 2,
  values : function () {
      return ([this.BUY, this.SELL, this.CANCEL]);
  }
}

exports.lotType = {
  FULL : 0,
  PARTIAL : 1,
  values : function () {
      return ([this.FULL, this.PARTIAL]);
  }
}

exports.PremaketTokenType = {
  NORMAL : 0,
  COLLATERAL : 1,
  values : function () {
      return ([this.NORMAL, this.COLLATERAL]);
  }
}

exports.OTCTokenType = {
  CUSTOM : 0,
  CMC : 1,
  values : function () {
      return ([this.CUSTOM, this.CMC]);
  }
}


exports.offerStatus = {
  PENDING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
  values : function () {
      return ([this.PENDING,this.ACCEPTED, this.REJECTED]);
  }
}
