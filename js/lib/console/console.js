(function(con) {
  var prop, method;
  var empty = {};
  var dummy = function() {};
  var properties = "memory".split(",");
  var methods = ("assert,count,debug,dir,dirxml,error,exception,group," + "groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd," + "time,timeEnd,trace,warn").split(",");
  while (prop = properties.pop()) {
    con[prop] = con[prop] || empty;
  }
  while (method = methods.pop()) {
    con[method] = con[method] || dummy;
  }
})(this.console = this.console || {});
