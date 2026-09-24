var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn2, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vendor/piper/piper-o91UDS6e.js
var piper_o91UDS6e_exports = {};
__export(piper_o91UDS6e_exports, {
  createPiperPhonemize: () => createPiperPhonemize
});
var createPiperPhonemize;
var init_piper_o91UDS6e = __esm({
  "vendor/piper/piper-o91UDS6e.js"() {
    createPiperPhonemize = (() => {
      var _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : void 0;
      if (typeof __filename !== "undefined") _scriptDir = _scriptDir || __filename;
      return function(moduleArg = {}) {
        var Module = moduleArg;
        var readyPromiseResolve, readyPromiseReject;
        Module["ready"] = new Promise((resolve, reject) => {
          readyPromiseResolve = resolve;
          readyPromiseReject = reject;
        });
        if (!Module.expectedDataFileDownloads) {
          Module.expectedDataFileDownloads = 0;
        }
        Module.expectedDataFileDownloads++;
        (function() {
          if (Module["ENVIRONMENT_IS_PTHREAD"] || Module["$ww"]) return;
          var loadPackage = function(metadata) {
            if (typeof window === "object") {
              window["encodeURIComponent"](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf("/")) + "/");
            } else if (typeof process === "undefined" && typeof location !== "undefined") {
              encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf("/")) + "/");
            }
            var PACKAGE_NAME = "piper_phonemize.data";
            var REMOTE_PACKAGE_BASE = "piper_phonemize.data";
            if (typeof Module["locateFilePackage"] === "function" && !Module["locateFile"]) {
              Module["locateFile"] = Module["locateFilePackage"];
              err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)");
            }
            var REMOTE_PACKAGE_NAME = Module["locateFile"] ? Module["locateFile"](REMOTE_PACKAGE_BASE, "") : REMOTE_PACKAGE_BASE;
            var REMOTE_PACKAGE_SIZE = metadata["remote_package_size"];
            function fetchRemotePackage(packageName, packageSize, callback, errback) {
              if (typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string") {
                __require("fs").readFile(packageName, function(err2, contents) {
                  if (err2) {
                    errback(err2);
                  } else {
                    callback(contents.buffer);
                  }
                });
                return;
              }
              var xhr = new XMLHttpRequest();
              xhr.open("GET", packageName, true);
              xhr.responseType = "arraybuffer";
              xhr.onprogress = function(event) {
                var url = packageName;
                var size = packageSize;
                if (event.total) size = event.total;
                if (event.loaded) {
                  if (!xhr.addedTotal) {
                    xhr.addedTotal = true;
                    if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
                    Module.dataFileDownloads[url] = { loaded: event.loaded, total: size };
                  } else {
                    Module.dataFileDownloads[url].loaded = event.loaded;
                  }
                  var total = 0;
                  var loaded = 0;
                  var num = 0;
                  for (var download3 in Module.dataFileDownloads) {
                    var data = Module.dataFileDownloads[download3];
                    total += data.total;
                    loaded += data.loaded;
                    num++;
                  }
                  total = Math.ceil(total * Module.expectedDataFileDownloads / num);
                  if (Module["setStatus"]) Module["setStatus"](`Downloading data... (${loaded}/${total})`);
                } else if (!Module.dataFileDownloads) {
                  if (Module["setStatus"]) Module["setStatus"]("Downloading data...");
                }
              };
              xhr.onerror = function(event) {
                throw new Error("NetworkError for: " + packageName);
              };
              xhr.onload = function(event) {
                if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || xhr.status == 0 && xhr.response) {
                  var packageData = xhr.response;
                  callback(packageData);
                } else {
                  throw new Error(xhr.statusText + " : " + xhr.responseURL);
                }
              };
              xhr.send(null);
            }
            function handleError(error) {
              console.error("package error:", error);
            }
            var fetchedCallback = null;
            var fetched = Module["getPreloadedPackage"] ? Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;
            if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
              if (fetchedCallback) {
                fetchedCallback(data);
                fetchedCallback = null;
              } else {
                fetched = data;
              }
            }, handleError);
            function runWithFS() {
              function assert2(check, msg) {
                if (!check) throw msg + new Error().stack;
              }
              Module["FS_createPath"]("/", "espeak-ng-data", true, true);
              Module["FS_createPath"]("/espeak-ng-data", "lang", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "aav", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "art", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "azc", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "bat", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "bnt", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "ccs", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "cel", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "cus", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "dra", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "esx", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "gmq", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "gmw", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "grk", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "inc", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "ine", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "ira", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "iro", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "itc", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "jpx", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "map", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "miz", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "myn", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "poz", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "roa", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "sai", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "sem", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "sit", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "tai", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "trk", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "urj", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "zle", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "zls", true, true);
              Module["FS_createPath"]("/espeak-ng-data/lang", "zlw", true, true);
              Module["FS_createPath"]("/espeak-ng-data", "mbrola_ph", true, true);
              Module["FS_createPath"]("/espeak-ng-data", "voices", true, true);
              Module["FS_createPath"]("/espeak-ng-data/voices", "!v", true, true);
              Module["FS_createPath"]("/espeak-ng-data/voices", "mb", true, true);
              function DataRequest(start, end, audio) {
                this.start = start;
                this.end = end;
                this.audio = audio;
              }
              DataRequest.prototype = { requests: {}, open: function(mode, name) {
                this.name = name;
                this.requests[name] = this;
                Module["addRunDependency"](`fp ${this.name}`);
              }, send: function() {
              }, onload: function() {
                var byteArray = this.byteArray.subarray(this.start, this.end);
                this.finish(byteArray);
              }, finish: function(byteArray) {
                var that = this;
                Module["FS_createDataFile"](this.name, null, byteArray, true, true, true);
                Module["removeRunDependency"](`fp ${that.name}`);
                this.requests[this.name] = null;
              } };
              var files = metadata["files"];
              for (var i = 0; i < files.length; ++i) {
                new DataRequest(files[i]["start"], files[i]["end"], files[i]["audio"] || 0).open("GET", files[i]["filename"]);
              }
              function processPackageData(arrayBuffer) {
                assert2(arrayBuffer, "Loading data file failed.");
                assert2(arrayBuffer.constructor.name === ArrayBuffer.name, "bad input to processPackageData");
                var byteArray = new Uint8Array(arrayBuffer);
                DataRequest.prototype.byteArray = byteArray;
                var files2 = metadata["files"];
                for (var i2 = 0; i2 < files2.length; ++i2) {
                  DataRequest.prototype.requests[files2[i2].filename].onload();
                }
                Module["removeRunDependency"]("datafile_piper_phonemize.data");
              }
              Module["addRunDependency"]("datafile_piper_phonemize.data");
              if (!Module.preloadResults) Module.preloadResults = {};
              Module.preloadResults[PACKAGE_NAME] = { fromCache: false };
              if (fetched) {
                processPackageData(fetched);
                fetched = null;
              } else {
                fetchedCallback = processPackageData;
              }
            }
            if (Module["calledRun"]) {
              runWithFS();
            } else {
              if (!Module["preRun"]) Module["preRun"] = [];
              Module["preRun"].push(runWithFS);
            }
          };
          loadPackage({ "files": [{ "filename": "/espeak-ng-data/af_dict", "start": 0, "end": 121473 }, { "filename": "/espeak-ng-data/am_dict", "start": 121473, "end": 185351 }, { "filename": "/espeak-ng-data/an_dict", "start": 185351, "end": 192042 }, { "filename": "/espeak-ng-data/ar_dict", "start": 192042, "end": 670207 }, { "filename": "/espeak-ng-data/as_dict", "start": 670207, "end": 675212 }, { "filename": "/espeak-ng-data/az_dict", "start": 675212, "end": 718985 }, { "filename": "/espeak-ng-data/ba_dict", "start": 718985, "end": 721083 }, { "filename": "/espeak-ng-data/be_dict", "start": 721083, "end": 723735 }, { "filename": "/espeak-ng-data/bg_dict", "start": 723735, "end": 810786 }, { "filename": "/espeak-ng-data/bn_dict", "start": 810786, "end": 900765 }, { "filename": "/espeak-ng-data/bpy_dict", "start": 900765, "end": 905991 }, { "filename": "/espeak-ng-data/bs_dict", "start": 905991, "end": 953059 }, { "filename": "/espeak-ng-data/ca_dict", "start": 953059, "end": 998625 }, { "filename": "/espeak-ng-data/chr_dict", "start": 998625, "end": 1001484 }, { "filename": "/espeak-ng-data/cmn_dict", "start": 1001484, "end": 2567819 }, { "filename": "/espeak-ng-data/cs_dict", "start": 2567819, "end": 2617464 }, { "filename": "/espeak-ng-data/cv_dict", "start": 2617464, "end": 2618808 }, { "filename": "/espeak-ng-data/cy_dict", "start": 2618808, "end": 2661938 }, { "filename": "/espeak-ng-data/da_dict", "start": 2661938, "end": 2907225 }, { "filename": "/espeak-ng-data/de_dict", "start": 2907225, "end": 2975501 }, { "filename": "/espeak-ng-data/el_dict", "start": 2975501, "end": 3048342 }, { "filename": "/espeak-ng-data/en_dict", "start": 3048342, "end": 3215286 }, { "filename": "/espeak-ng-data/eo_dict", "start": 3215286, "end": 3219952 }, { "filename": "/espeak-ng-data/es_dict", "start": 3219952, "end": 3269204 }, { "filename": "/espeak-ng-data/et_dict", "start": 3269204, "end": 3313467 }, { "filename": "/espeak-ng-data/eu_dict", "start": 3313467, "end": 3362308 }, { "filename": "/espeak-ng-data/fa_dict", "start": 3362308, "end": 3655543 }, { "filename": "/espeak-ng-data/fi_dict", "start": 3655543, "end": 3699471 }, { "filename": "/espeak-ng-data/fr_dict", "start": 3699471, "end": 3763198 }, { "filename": "/espeak-ng-data/ga_dict", "start": 3763198, "end": 3815871 }, { "filename": "/espeak-ng-data/gd_dict", "start": 3815871, "end": 3864992 }, { "filename": "/espeak-ng-data/gn_dict", "start": 3864992, "end": 3868240 }, { "filename": "/espeak-ng-data/grc_dict", "start": 3868240, "end": 3871673 }, { "filename": "/espeak-ng-data/gu_dict", "start": 3871673, "end": 3954153 }, { "filename": "/espeak-ng-data/hak_dict", "start": 3954153, "end": 3957488 }, { "filename": "/espeak-ng-data/haw_dict", "start": 3957488, "end": 3959931 }, { "filename": "/espeak-ng-data/he_dict", "start": 3959931, "end": 3966894 }, { "filename": "/espeak-ng-data/hi_dict", "start": 3966894, "end": 4059037 }, { "filename": "/espeak-ng-data/hr_dict", "start": 4059037, "end": 4108425 }, { "filename": "/espeak-ng-data/ht_dict", "start": 4108425, "end": 4110228 }, { "filename": "/espeak-ng-data/hu_dict", "start": 4110228, "end": 4264013 }, { "filename": "/espeak-ng-data/hy_dict", "start": 4264013, "end": 4326276 }, { "filename": "/espeak-ng-data/ia_dict", "start": 4326276, "end": 4657551 }, { "filename": "/espeak-ng-data/id_dict", "start": 4657551, "end": 4701009 }, { "filename": "/espeak-ng-data/intonations", "start": 4701009, "end": 4703049 }, { "filename": "/espeak-ng-data/io_dict", "start": 4703049, "end": 4705214 }, { "filename": "/espeak-ng-data/is_dict", "start": 4705214, "end": 4749568 }, { "filename": "/espeak-ng-data/it_dict", "start": 4749568, "end": 4902457 }, { "filename": "/espeak-ng-data/ja_dict", "start": 4902457, "end": 4950109 }, { "filename": "/espeak-ng-data/jbo_dict", "start": 4950109, "end": 4952352 }, { "filename": "/espeak-ng-data/ka_dict", "start": 4952352, "end": 5040127 }, { "filename": "/espeak-ng-data/kk_dict", "start": 5040127, "end": 5041986 }, { "filename": "/espeak-ng-data/kl_dict", "start": 5041986, "end": 5044824 }, { "filename": "/espeak-ng-data/kn_dict", "start": 5044824, "end": 5132652 }, { "filename": "/espeak-ng-data/ko_dict", "start": 5132652, "end": 5180175 }, { "filename": "/espeak-ng-data/kok_dict", "start": 5180175, "end": 5186569 }, { "filename": "/espeak-ng-data/ku_dict", "start": 5186569, "end": 5188834 }, { "filename": "/espeak-ng-data/ky_dict", "start": 5188834, "end": 5253811 }, { "filename": "/espeak-ng-data/la_dict", "start": 5253811, "end": 5257617 }, { "filename": "/espeak-ng-data/lang/aav/vi", "start": 5257617, "end": 5257728 }, { "filename": "/espeak-ng-data/lang/aav/vi-VN-x-central", "start": 5257728, "end": 5257871 }, { "filename": "/espeak-ng-data/lang/aav/vi-VN-x-south", "start": 5257871, "end": 5258013 }, { "filename": "/espeak-ng-data/lang/art/eo", "start": 5258013, "end": 5258054 }, { "filename": "/espeak-ng-data/lang/art/ia", "start": 5258054, "end": 5258083 }, { "filename": "/espeak-ng-data/lang/art/io", "start": 5258083, "end": 5258133 }, { "filename": "/espeak-ng-data/lang/art/jbo", "start": 5258133, "end": 5258202 }, { "filename": "/espeak-ng-data/lang/art/lfn", "start": 5258202, "end": 5258337 }, { "filename": "/espeak-ng-data/lang/art/piqd", "start": 5258337, "end": 5258393 }, { "filename": "/espeak-ng-data/lang/art/py", "start": 5258393, "end": 5258533 }, { "filename": "/espeak-ng-data/lang/art/qdb", "start": 5258533, "end": 5258590 }, { "filename": "/espeak-ng-data/lang/art/qya", "start": 5258590, "end": 5258763 }, { "filename": "/espeak-ng-data/lang/art/sjn", "start": 5258763, "end": 5258938 }, { "filename": "/espeak-ng-data/lang/azc/nci", "start": 5258938, "end": 5259052 }, { "filename": "/espeak-ng-data/lang/bat/lt", "start": 5259052, "end": 5259080 }, { "filename": "/espeak-ng-data/lang/bat/ltg", "start": 5259080, "end": 5259392 }, { "filename": "/espeak-ng-data/lang/bat/lv", "start": 5259392, "end": 5259621 }, { "filename": "/espeak-ng-data/lang/bnt/sw", "start": 5259621, "end": 5259662 }, { "filename": "/espeak-ng-data/lang/bnt/tn", "start": 5259662, "end": 5259704 }, { "filename": "/espeak-ng-data/lang/ccs/ka", "start": 5259704, "end": 5259828 }, { "filename": "/espeak-ng-data/lang/cel/cy", "start": 5259828, "end": 5259865 }, { "filename": "/espeak-ng-data/lang/cel/ga", "start": 5259865, "end": 5259931 }, { "filename": "/espeak-ng-data/lang/cel/gd", "start": 5259931, "end": 5259982 }, { "filename": "/espeak-ng-data/lang/cus/om", "start": 5259982, "end": 5260021 }, { "filename": "/espeak-ng-data/lang/dra/kn", "start": 5260021, "end": 5260076 }, { "filename": "/espeak-ng-data/lang/dra/ml", "start": 5260076, "end": 5260133 }, { "filename": "/espeak-ng-data/lang/dra/ta", "start": 5260133, "end": 5260184 }, { "filename": "/espeak-ng-data/lang/dra/te", "start": 5260184, "end": 5260254 }, { "filename": "/espeak-ng-data/lang/esx/kl", "start": 5260254, "end": 5260284 }, { "filename": "/espeak-ng-data/lang/eu", "start": 5260284, "end": 5260338 }, { "filename": "/espeak-ng-data/lang/gmq/da", "start": 5260338, "end": 5260381 }, { "filename": "/espeak-ng-data/lang/gmq/is", "start": 5260381, "end": 5260408 }, { "filename": "/espeak-ng-data/lang/gmq/nb", "start": 5260408, "end": 5260495 }, { "filename": "/espeak-ng-data/lang/gmq/sv", "start": 5260495, "end": 5260520 }, { "filename": "/espeak-ng-data/lang/gmw/af", "start": 5260520, "end": 5260643 }, { "filename": "/espeak-ng-data/lang/gmw/de", "start": 5260643, "end": 5260685 }, { "filename": "/espeak-ng-data/lang/gmw/en", "start": 5260685, "end": 5260825 }, { "filename": "/espeak-ng-data/lang/gmw/en-029", "start": 5260825, "end": 5261160 }, { "filename": "/espeak-ng-data/lang/gmw/en-GB-scotland", "start": 5261160, "end": 5261455 }, { "filename": "/espeak-ng-data/lang/gmw/en-GB-x-gbclan", "start": 5261455, "end": 5261693 }, { "filename": "/espeak-ng-data/lang/gmw/en-GB-x-gbcwmd", "start": 5261693, "end": 5261881 }, { "filename": "/espeak-ng-data/lang/gmw/en-GB-x-rp", "start": 5261881, "end": 5262130 }, { "filename": "/espeak-ng-data/lang/gmw/en-US", "start": 5262130, "end": 5262387 }, { "filename": "/espeak-ng-data/lang/gmw/en-US-nyc", "start": 5262387, "end": 5262658 }, { "filename": "/espeak-ng-data/lang/gmw/lb", "start": 5262658, "end": 5262689 }, { "filename": "/espeak-ng-data/lang/gmw/nl", "start": 5262689, "end": 5262712 }, { "filename": "/espeak-ng-data/lang/grk/el", "start": 5262712, "end": 5262735 }, { "filename": "/espeak-ng-data/lang/grk/grc", "start": 5262735, "end": 5262834 }, { "filename": "/espeak-ng-data/lang/inc/as", "start": 5262834, "end": 5262876 }, { "filename": "/espeak-ng-data/lang/inc/bn", "start": 5262876, "end": 5262901 }, { "filename": "/espeak-ng-data/lang/inc/bpy", "start": 5262901, "end": 5262940 }, { "filename": "/espeak-ng-data/lang/inc/gu", "start": 5262940, "end": 5262982 }, { "filename": "/espeak-ng-data/lang/inc/hi", "start": 5262982, "end": 5263005 }, { "filename": "/espeak-ng-data/lang/inc/kok", "start": 5263005, "end": 5263031 }, { "filename": "/espeak-ng-data/lang/inc/mr", "start": 5263031, "end": 5263072 }, { "filename": "/espeak-ng-data/lang/inc/ne", "start": 5263072, "end": 5263109 }, { "filename": "/espeak-ng-data/lang/inc/or", "start": 5263109, "end": 5263148 }, { "filename": "/espeak-ng-data/lang/inc/pa", "start": 5263148, "end": 5263173 }, { "filename": "/espeak-ng-data/lang/inc/sd", "start": 5263173, "end": 5263239 }, { "filename": "/espeak-ng-data/lang/inc/si", "start": 5263239, "end": 5263294 }, { "filename": "/espeak-ng-data/lang/inc/ur", "start": 5263294, "end": 5263388 }, { "filename": "/espeak-ng-data/lang/ine/hy", "start": 5263388, "end": 5263449 }, { "filename": "/espeak-ng-data/lang/ine/hyw", "start": 5263449, "end": 5263814 }, { "filename": "/espeak-ng-data/lang/ine/sq", "start": 5263814, "end": 5263917 }, { "filename": "/espeak-ng-data/lang/ira/fa", "start": 5263917, "end": 5264007 }, { "filename": "/espeak-ng-data/lang/ira/fa-Latn", "start": 5264007, "end": 5264276 }, { "filename": "/espeak-ng-data/lang/ira/ku", "start": 5264276, "end": 5264316 }, { "filename": "/espeak-ng-data/lang/iro/chr", "start": 5264316, "end": 5264885 }, { "filename": "/espeak-ng-data/lang/itc/la", "start": 5264885, "end": 5265182 }, { "filename": "/espeak-ng-data/lang/jpx/ja", "start": 5265182, "end": 5265234 }, { "filename": "/espeak-ng-data/lang/ko", "start": 5265234, "end": 5265285 }, { "filename": "/espeak-ng-data/lang/map/haw", "start": 5265285, "end": 5265327 }, { "filename": "/espeak-ng-data/lang/miz/mto", "start": 5265327, "end": 5265510 }, { "filename": "/espeak-ng-data/lang/myn/quc", "start": 5265510, "end": 5265720 }, { "filename": "/espeak-ng-data/lang/poz/id", "start": 5265720, "end": 5265854 }, { "filename": "/espeak-ng-data/lang/poz/mi", "start": 5265854, "end": 5266221 }, { "filename": "/espeak-ng-data/lang/poz/ms", "start": 5266221, "end": 5266651 }, { "filename": "/espeak-ng-data/lang/qu", "start": 5266651, "end": 5266739 }, { "filename": "/espeak-ng-data/lang/roa/an", "start": 5266739, "end": 5266766 }, { "filename": "/espeak-ng-data/lang/roa/ca", "start": 5266766, "end": 5266791 }, { "filename": "/espeak-ng-data/lang/roa/es", "start": 5266791, "end": 5266854 }, { "filename": "/espeak-ng-data/lang/roa/es-419", "start": 5266854, "end": 5267021 }, { "filename": "/espeak-ng-data/lang/roa/fr", "start": 5267021, "end": 5267100 }, { "filename": "/espeak-ng-data/lang/roa/fr-BE", "start": 5267100, "end": 5267184 }, { "filename": "/espeak-ng-data/lang/roa/fr-CH", "start": 5267184, "end": 5267270 }, { "filename": "/espeak-ng-data/lang/roa/ht", "start": 5267270, "end": 5267410 }, { "filename": "/espeak-ng-data/lang/roa/it", "start": 5267410, "end": 5267519 }, { "filename": "/espeak-ng-data/lang/roa/pap", "start": 5267519, "end": 5267581 }, { "filename": "/espeak-ng-data/lang/roa/pt", "start": 5267581, "end": 5267676 }, { "filename": "/espeak-ng-data/lang/roa/pt-BR", "start": 5267676, "end": 5267785 }, { "filename": "/espeak-ng-data/lang/roa/ro", "start": 5267785, "end": 5267811 }, { "filename": "/espeak-ng-data/lang/sai/gn", "start": 5267811, "end": 5267858 }, { "filename": "/espeak-ng-data/lang/sem/am", "start": 5267858, "end": 5267899 }, { "filename": "/espeak-ng-data/lang/sem/ar", "start": 5267899, "end": 5267949 }, { "filename": "/espeak-ng-data/lang/sem/he", "start": 5267949, "end": 5267989 }, { "filename": "/espeak-ng-data/lang/sem/mt", "start": 5267989, "end": 5268030 }, { "filename": "/espeak-ng-data/lang/sit/cmn", "start": 5268030, "end": 5268716 }, { "filename": "/espeak-ng-data/lang/sit/cmn-Latn-pinyin", "start": 5268716, "end": 5268877 }, { "filename": "/espeak-ng-data/lang/sit/hak", "start": 5268877, "end": 5269005 }, { "filename": "/espeak-ng-data/lang/sit/my", "start": 5269005, "end": 5269061 }, { "filename": "/espeak-ng-data/lang/sit/yue", "start": 5269061, "end": 5269255 }, { "filename": "/espeak-ng-data/lang/sit/yue-Latn-jyutping", "start": 5269255, "end": 5269468 }, { "filename": "/espeak-ng-data/lang/tai/shn", "start": 5269468, "end": 5269560 }, { "filename": "/espeak-ng-data/lang/tai/th", "start": 5269560, "end": 5269597 }, { "filename": "/espeak-ng-data/lang/trk/az", "start": 5269597, "end": 5269642 }, { "filename": "/espeak-ng-data/lang/trk/ba", "start": 5269642, "end": 5269667 }, { "filename": "/espeak-ng-data/lang/trk/cv", "start": 5269667, "end": 5269707 }, { "filename": "/espeak-ng-data/lang/trk/kk", "start": 5269707, "end": 5269747 }, { "filename": "/espeak-ng-data/lang/trk/ky", "start": 5269747, "end": 5269790 }, { "filename": "/espeak-ng-data/lang/trk/nog", "start": 5269790, "end": 5269829 }, { "filename": "/espeak-ng-data/lang/trk/tk", "start": 5269829, "end": 5269854 }, { "filename": "/espeak-ng-data/lang/trk/tr", "start": 5269854, "end": 5269879 }, { "filename": "/espeak-ng-data/lang/trk/tt", "start": 5269879, "end": 5269902 }, { "filename": "/espeak-ng-data/lang/trk/ug", "start": 5269902, "end": 5269926 }, { "filename": "/espeak-ng-data/lang/trk/uz", "start": 5269926, "end": 5269965 }, { "filename": "/espeak-ng-data/lang/urj/et", "start": 5269965, "end": 5270202 }, { "filename": "/espeak-ng-data/lang/urj/fi", "start": 5270202, "end": 5270439 }, { "filename": "/espeak-ng-data/lang/urj/hu", "start": 5270439, "end": 5270512 }, { "filename": "/espeak-ng-data/lang/urj/smj", "start": 5270512, "end": 5270557 }, { "filename": "/espeak-ng-data/lang/zle/be", "start": 5270557, "end": 5270609 }, { "filename": "/espeak-ng-data/lang/zle/ru", "start": 5270609, "end": 5270666 }, { "filename": "/espeak-ng-data/lang/zle/ru-LV", "start": 5270666, "end": 5270946 }, { "filename": "/espeak-ng-data/lang/zle/ru-cl", "start": 5270946, "end": 5271037 }, { "filename": "/espeak-ng-data/lang/zle/uk", "start": 5271037, "end": 5271134 }, { "filename": "/espeak-ng-data/lang/zls/bg", "start": 5271134, "end": 5271245 }, { "filename": "/espeak-ng-data/lang/zls/bs", "start": 5271245, "end": 5271475 }, { "filename": "/espeak-ng-data/lang/zls/hr", "start": 5271475, "end": 5271737 }, { "filename": "/espeak-ng-data/lang/zls/mk", "start": 5271737, "end": 5271765 }, { "filename": "/espeak-ng-data/lang/zls/sl", "start": 5271765, "end": 5271808 }, { "filename": "/espeak-ng-data/lang/zls/sr", "start": 5271808, "end": 5272058 }, { "filename": "/espeak-ng-data/lang/zlw/cs", "start": 5272058, "end": 5272081 }, { "filename": "/espeak-ng-data/lang/zlw/pl", "start": 5272081, "end": 5272119 }, { "filename": "/espeak-ng-data/lang/zlw/sk", "start": 5272119, "end": 5272143 }, { "filename": "/espeak-ng-data/lb_dict", "start": 5272143, "end": 5960074 }, { "filename": "/espeak-ng-data/lfn_dict", "start": 5960074, "end": 5962867 }, { "filename": "/espeak-ng-data/lt_dict", "start": 5962867, "end": 6012757 }, { "filename": "/espeak-ng-data/lv_dict", "start": 6012757, "end": 6079094 }, { "filename": "/espeak-ng-data/mbrola_ph/af1_phtrans", "start": 6079094, "end": 6080730 }, { "filename": "/espeak-ng-data/mbrola_ph/ar1_phtrans", "start": 6080730, "end": 6082342 }, { "filename": "/espeak-ng-data/mbrola_ph/ar2_phtrans", "start": 6082342, "end": 6083954 }, { "filename": "/espeak-ng-data/mbrola_ph/ca_phtrans", "start": 6083954, "end": 6085950 }, { "filename": "/espeak-ng-data/mbrola_ph/cmn_phtrans", "start": 6085950, "end": 6087442 }, { "filename": "/espeak-ng-data/mbrola_ph/cr1_phtrans", "start": 6087442, "end": 6089606 }, { "filename": "/espeak-ng-data/mbrola_ph/cs_phtrans", "start": 6089606, "end": 6090186 }, { "filename": "/espeak-ng-data/mbrola_ph/de2_phtrans", "start": 6090186, "end": 6091918 }, { "filename": "/espeak-ng-data/mbrola_ph/de4_phtrans", "start": 6091918, "end": 6093722 }, { "filename": "/espeak-ng-data/mbrola_ph/de6_phtrans", "start": 6093722, "end": 6095118 }, { "filename": "/espeak-ng-data/mbrola_ph/de8_phtrans", "start": 6095118, "end": 6096274 }, { "filename": "/espeak-ng-data/mbrola_ph/ee1_phtrans", "start": 6096274, "end": 6097718 }, { "filename": "/espeak-ng-data/mbrola_ph/en1_phtrans", "start": 6097718, "end": 6098514 }, { "filename": "/espeak-ng-data/mbrola_ph/es3_phtrans", "start": 6098514, "end": 6099574 }, { "filename": "/espeak-ng-data/mbrola_ph/es4_phtrans", "start": 6099574, "end": 6100682 }, { "filename": "/espeak-ng-data/mbrola_ph/es_phtrans", "start": 6100682, "end": 6102414 }, { "filename": "/espeak-ng-data/mbrola_ph/fr_phtrans", "start": 6102414, "end": 6104386 }, { "filename": "/espeak-ng-data/mbrola_ph/gr1_phtrans", "start": 6104386, "end": 6106598 }, { "filename": "/espeak-ng-data/mbrola_ph/gr2_phtrans", "start": 6106598, "end": 6108810 }, { "filename": "/espeak-ng-data/mbrola_ph/grc-de6_phtrans", "start": 6108810, "end": 6109294 }, { "filename": "/espeak-ng-data/mbrola_ph/he_phtrans", "start": 6109294, "end": 6110042 }, { "filename": "/espeak-ng-data/mbrola_ph/hn1_phtrans", "start": 6110042, "end": 6110574 }, { "filename": "/espeak-ng-data/mbrola_ph/hu1_phtrans", "start": 6110574, "end": 6112018 }, { "filename": "/espeak-ng-data/mbrola_ph/ic1_phtrans", "start": 6112018, "end": 6113150 }, { "filename": "/espeak-ng-data/mbrola_ph/id1_phtrans", "start": 6113150, "end": 6114858 }, { "filename": "/espeak-ng-data/mbrola_ph/in_phtrans", "start": 6114858, "end": 6116302 }, { "filename": "/espeak-ng-data/mbrola_ph/ir1_phtrans", "start": 6116302, "end": 6122114 }, { "filename": "/espeak-ng-data/mbrola_ph/it1_phtrans", "start": 6122114, "end": 6123438 }, { "filename": "/espeak-ng-data/mbrola_ph/it3_phtrans", "start": 6123438, "end": 6124330 }, { "filename": "/espeak-ng-data/mbrola_ph/jp_phtrans", "start": 6124330, "end": 6125366 }, { "filename": "/espeak-ng-data/mbrola_ph/la1_phtrans", "start": 6125366, "end": 6126114 }, { "filename": "/espeak-ng-data/mbrola_ph/lt_phtrans", "start": 6126114, "end": 6127174 }, { "filename": "/espeak-ng-data/mbrola_ph/ma1_phtrans", "start": 6127174, "end": 6128114 }, { "filename": "/espeak-ng-data/mbrola_ph/mx1_phtrans", "start": 6128114, "end": 6129918 }, { "filename": "/espeak-ng-data/mbrola_ph/mx2_phtrans", "start": 6129918, "end": 6131746 }, { "filename": "/espeak-ng-data/mbrola_ph/nl_phtrans", "start": 6131746, "end": 6133430 }, { "filename": "/espeak-ng-data/mbrola_ph/nz1_phtrans", "start": 6133430, "end": 6134154 }, { "filename": "/espeak-ng-data/mbrola_ph/pl1_phtrans", "start": 6134154, "end": 6135742 }, { "filename": "/espeak-ng-data/mbrola_ph/pt1_phtrans", "start": 6135742, "end": 6137834 }, { "filename": "/espeak-ng-data/mbrola_ph/ptbr4_phtrans", "start": 6137834, "end": 6140190 }, { "filename": "/espeak-ng-data/mbrola_ph/ptbr_phtrans", "start": 6140190, "end": 6142714 }, { "filename": "/espeak-ng-data/mbrola_ph/ro1_phtrans", "start": 6142714, "end": 6144878 }, { "filename": "/espeak-ng-data/mbrola_ph/sv2_phtrans", "start": 6144878, "end": 6146466 }, { "filename": "/espeak-ng-data/mbrola_ph/sv_phtrans", "start": 6146466, "end": 6148054 }, { "filename": "/espeak-ng-data/mbrola_ph/tl1_phtrans", "start": 6148054, "end": 6148826 }, { "filename": "/espeak-ng-data/mbrola_ph/tr1_phtrans", "start": 6148826, "end": 6149190 }, { "filename": "/espeak-ng-data/mbrola_ph/us3_phtrans", "start": 6149190, "end": 6150346 }, { "filename": "/espeak-ng-data/mbrola_ph/us_phtrans", "start": 6150346, "end": 6151574 }, { "filename": "/espeak-ng-data/mbrola_ph/vz_phtrans", "start": 6151574, "end": 6153858 }, { "filename": "/espeak-ng-data/mi_dict", "start": 6153858, "end": 6155204 }, { "filename": "/espeak-ng-data/mk_dict", "start": 6155204, "end": 6219063 }, { "filename": "/espeak-ng-data/ml_dict", "start": 6219063, "end": 6311408 }, { "filename": "/espeak-ng-data/mr_dict", "start": 6311408, "end": 6398799 }, { "filename": "/espeak-ng-data/ms_dict", "start": 6398799, "end": 6452340 }, { "filename": "/espeak-ng-data/mt_dict", "start": 6452340, "end": 6456724 }, { "filename": "/espeak-ng-data/mto_dict", "start": 6456724, "end": 6460684 }, { "filename": "/espeak-ng-data/my_dict", "start": 6460684, "end": 6556632 }, { "filename": "/espeak-ng-data/nci_dict", "start": 6556632, "end": 6558166 }, { "filename": "/espeak-ng-data/ne_dict", "start": 6558166, "end": 6653543 }, { "filename": "/espeak-ng-data/nl_dict", "start": 6653543, "end": 6719522 }, { "filename": "/espeak-ng-data/no_dict", "start": 6719522, "end": 6723700 }, { "filename": "/espeak-ng-data/nog_dict", "start": 6723700, "end": 6726994 }, { "filename": "/espeak-ng-data/om_dict", "start": 6726994, "end": 6729296 }, { "filename": "/espeak-ng-data/or_dict", "start": 6729296, "end": 6818542 }, { "filename": "/espeak-ng-data/pa_dict", "start": 6818542, "end": 6898495 }, { "filename": "/espeak-ng-data/pap_dict", "start": 6898495, "end": 6900623 }, { "filename": "/espeak-ng-data/phondata", "start": 6900623, "end": 7451047 }, { "filename": "/espeak-ng-data/phondata-manifest", "start": 7451047, "end": 7472868 }, { "filename": "/espeak-ng-data/phonindex", "start": 7472868, "end": 7511942 }, { "filename": "/espeak-ng-data/phontab", "start": 7511942, "end": 7567738 }, { "filename": "/espeak-ng-data/piqd_dict", "start": 7567738, "end": 7569448 }, { "filename": "/espeak-ng-data/pl_dict", "start": 7569448, "end": 7646178 }, { "filename": "/espeak-ng-data/pt_dict", "start": 7646178, "end": 7713995 }, { "filename": "/espeak-ng-data/py_dict", "start": 7713995, "end": 7716404 }, { "filename": "/espeak-ng-data/qdb_dict", "start": 7716404, "end": 7719432 }, { "filename": "/espeak-ng-data/qu_dict", "start": 7719432, "end": 7721351 }, { "filename": "/espeak-ng-data/quc_dict", "start": 7721351, "end": 7722801 }, { "filename": "/espeak-ng-data/qya_dict", "start": 7722801, "end": 7724740 }, { "filename": "/espeak-ng-data/ro_dict", "start": 7724740, "end": 7793278 }, { "filename": "/espeak-ng-data/ru_dict", "start": 7793278, "end": 16325670 }, { "filename": "/espeak-ng-data/sd_dict", "start": 16325670, "end": 16385598 }, { "filename": "/espeak-ng-data/shn_dict", "start": 16385598, "end": 16473770 }, { "filename": "/espeak-ng-data/si_dict", "start": 16473770, "end": 16559154 }, { "filename": "/espeak-ng-data/sjn_dict", "start": 16559154, "end": 16560937 }, { "filename": "/espeak-ng-data/sk_dict", "start": 16560937, "end": 16610939 }, { "filename": "/espeak-ng-data/sl_dict", "start": 16610939, "end": 16655986 }, { "filename": "/espeak-ng-data/smj_dict", "start": 16655986, "end": 16691081 }, { "filename": "/espeak-ng-data/sq_dict", "start": 16691081, "end": 16736084 }, { "filename": "/espeak-ng-data/sr_dict", "start": 16736084, "end": 16782916 }, { "filename": "/espeak-ng-data/sv_dict", "start": 16782916, "end": 16830752 }, { "filename": "/espeak-ng-data/sw_dict", "start": 16830752, "end": 16878556 }, { "filename": "/espeak-ng-data/ta_dict", "start": 16878556, "end": 17088109 }, { "filename": "/espeak-ng-data/te_dict", "start": 17088109, "end": 17182946 }, { "filename": "/espeak-ng-data/th_dict", "start": 17182946, "end": 17185247 }, { "filename": "/espeak-ng-data/tk_dict", "start": 17185247, "end": 17206115 }, { "filename": "/espeak-ng-data/tn_dict", "start": 17206115, "end": 17209187 }, { "filename": "/espeak-ng-data/tr_dict", "start": 17209187, "end": 17255980 }, { "filename": "/espeak-ng-data/tt_dict", "start": 17255980, "end": 17258101 }, { "filename": "/espeak-ng-data/ug_dict", "start": 17258101, "end": 17260171 }, { "filename": "/espeak-ng-data/uk_dict", "start": 17260171, "end": 17263663 }, { "filename": "/espeak-ng-data/ur_dict", "start": 17263663, "end": 17397219 }, { "filename": "/espeak-ng-data/uz_dict", "start": 17397219, "end": 17399759 }, { "filename": "/espeak-ng-data/vi_dict", "start": 17399759, "end": 17452367 }, { "filename": "/espeak-ng-data/voices/!v/Alex", "start": 17452367, "end": 17452495 }, { "filename": "/espeak-ng-data/voices/!v/Alicia", "start": 17452495, "end": 17452969 }, { "filename": "/espeak-ng-data/voices/!v/Andrea", "start": 17452969, "end": 17453326 }, { "filename": "/espeak-ng-data/voices/!v/Andy", "start": 17453326, "end": 17453646 }, { "filename": "/espeak-ng-data/voices/!v/Annie", "start": 17453646, "end": 17453961 }, { "filename": "/espeak-ng-data/voices/!v/AnxiousAndy", "start": 17453961, "end": 17454322 }, { "filename": "/espeak-ng-data/voices/!v/Demonic", "start": 17454322, "end": 17458180 }, { "filename": "/espeak-ng-data/voices/!v/Denis", "start": 17458180, "end": 17458485 }, { "filename": "/espeak-ng-data/voices/!v/Diogo", "start": 17458485, "end": 17458864 }, { "filename": "/espeak-ng-data/voices/!v/Gene", "start": 17458864, "end": 17459145 }, { "filename": "/espeak-ng-data/voices/!v/Gene2", "start": 17459145, "end": 17459428 }, { "filename": "/espeak-ng-data/voices/!v/Henrique", "start": 17459428, "end": 17459809 }, { "filename": "/espeak-ng-data/voices/!v/Hugo", "start": 17459809, "end": 17460187 }, { "filename": "/espeak-ng-data/voices/!v/Jacky", "start": 17460187, "end": 17460454 }, { "filename": "/espeak-ng-data/voices/!v/Lee", "start": 17460454, "end": 17460792 }, { "filename": "/espeak-ng-data/voices/!v/Marco", "start": 17460792, "end": 17461259 }, { "filename": "/espeak-ng-data/voices/!v/Mario", "start": 17461259, "end": 17461529 }, { "filename": "/espeak-ng-data/voices/!v/Michael", "start": 17461529, "end": 17461799 }, { "filename": "/espeak-ng-data/voices/!v/Mike", "start": 17461799, "end": 17461911 }, { "filename": "/espeak-ng-data/voices/!v/Mr serious", "start": 17461911, "end": 17465104 }, { "filename": "/espeak-ng-data/voices/!v/Nguyen", "start": 17465104, "end": 17465384 }, { "filename": "/espeak-ng-data/voices/!v/Reed", "start": 17465384, "end": 17465586 }, { "filename": "/espeak-ng-data/voices/!v/RicishayMax", "start": 17465586, "end": 17465819 }, { "filename": "/espeak-ng-data/voices/!v/RicishayMax2", "start": 17465819, "end": 17466254 }, { "filename": "/espeak-ng-data/voices/!v/RicishayMax3", "start": 17466254, "end": 17466689 }, { "filename": "/espeak-ng-data/voices/!v/Storm", "start": 17466689, "end": 17467109 }, { "filename": "/espeak-ng-data/voices/!v/Tweaky", "start": 17467109, "end": 17470298 }, { "filename": "/espeak-ng-data/voices/!v/UniRobot", "start": 17470298, "end": 17470715 }, { "filename": "/espeak-ng-data/voices/!v/adam", "start": 17470715, "end": 17470790 }, { "filename": "/espeak-ng-data/voices/!v/anika", "start": 17470790, "end": 17471283 }, { "filename": "/espeak-ng-data/voices/!v/anikaRobot", "start": 17471283, "end": 17471795 }, { "filename": "/espeak-ng-data/voices/!v/announcer", "start": 17471795, "end": 17472095 }, { "filename": "/espeak-ng-data/voices/!v/antonio", "start": 17472095, "end": 17472476 }, { "filename": "/espeak-ng-data/voices/!v/aunty", "start": 17472476, "end": 17472834 }, { "filename": "/espeak-ng-data/voices/!v/belinda", "start": 17472834, "end": 17473174 }, { "filename": "/espeak-ng-data/voices/!v/benjamin", "start": 17473174, "end": 17473375 }, { "filename": "/espeak-ng-data/voices/!v/boris", "start": 17473375, "end": 17473599 }, { "filename": "/espeak-ng-data/voices/!v/caleb", "start": 17473599, "end": 17473656 }, { "filename": "/espeak-ng-data/voices/!v/croak", "start": 17473656, "end": 17473749 }, { "filename": "/espeak-ng-data/voices/!v/david", "start": 17473749, "end": 17473861 }, { "filename": "/espeak-ng-data/voices/!v/ed", "start": 17473861, "end": 17474148 }, { "filename": "/espeak-ng-data/voices/!v/edward", "start": 17474148, "end": 17474299 }, { "filename": "/espeak-ng-data/voices/!v/edward2", "start": 17474299, "end": 17474451 }, { "filename": "/espeak-ng-data/voices/!v/f1", "start": 17474451, "end": 17474775 }, { "filename": "/espeak-ng-data/voices/!v/f2", "start": 17474775, "end": 17475132 }, { "filename": "/espeak-ng-data/voices/!v/f3", "start": 17475132, "end": 17475507 }, { "filename": "/espeak-ng-data/voices/!v/f4", "start": 17475507, "end": 17475857 }, { "filename": "/espeak-ng-data/voices/!v/f5", "start": 17475857, "end": 17476289 }, { "filename": "/espeak-ng-data/voices/!v/fast", "start": 17476289, "end": 17476438 }, { "filename": "/espeak-ng-data/voices/!v/grandma", "start": 17476438, "end": 17476701 }, { "filename": "/espeak-ng-data/voices/!v/grandpa", "start": 17476701, "end": 17476957 }, { "filename": "/espeak-ng-data/voices/!v/gustave", "start": 17476957, "end": 17477210 }, { "filename": "/espeak-ng-data/voices/!v/ian", "start": 17477210, "end": 17480378 }, { "filename": "/espeak-ng-data/voices/!v/iven", "start": 17480378, "end": 17480639 }, { "filename": "/espeak-ng-data/voices/!v/iven2", "start": 17480639, "end": 17480918 }, { "filename": "/espeak-ng-data/voices/!v/iven3", "start": 17480918, "end": 17481180 }, { "filename": "/espeak-ng-data/voices/!v/iven4", "start": 17481180, "end": 17481441 }, { "filename": "/espeak-ng-data/voices/!v/john", "start": 17481441, "end": 17484627 }, { "filename": "/espeak-ng-data/voices/!v/kaukovalta", "start": 17484627, "end": 17484988 }, { "filename": "/espeak-ng-data/voices/!v/klatt", "start": 17484988, "end": 17485026 }, { "filename": "/espeak-ng-data/voices/!v/klatt2", "start": 17485026, "end": 17485064 }, { "filename": "/espeak-ng-data/voices/!v/klatt3", "start": 17485064, "end": 17485103 }, { "filename": "/espeak-ng-data/voices/!v/klatt4", "start": 17485103, "end": 17485142 }, { "filename": "/espeak-ng-data/voices/!v/klatt5", "start": 17485142, "end": 17485181 }, { "filename": "/espeak-ng-data/voices/!v/klatt6", "start": 17485181, "end": 17485220 }, { "filename": "/espeak-ng-data/voices/!v/linda", "start": 17485220, "end": 17485570 }, { "filename": "/espeak-ng-data/voices/!v/m1", "start": 17485570, "end": 17485905 }, { "filename": "/espeak-ng-data/voices/!v/m2", "start": 17485905, "end": 17486169 }, { "filename": "/espeak-ng-data/voices/!v/m3", "start": 17486169, "end": 17486469 }, { "filename": "/espeak-ng-data/voices/!v/m4", "start": 17486469, "end": 17486759 }, { "filename": "/espeak-ng-data/voices/!v/m5", "start": 17486759, "end": 17487021 }, { "filename": "/espeak-ng-data/voices/!v/m6", "start": 17487021, "end": 17487209 }, { "filename": "/espeak-ng-data/voices/!v/m7", "start": 17487209, "end": 17487463 }, { "filename": "/espeak-ng-data/voices/!v/m8", "start": 17487463, "end": 17487747 }, { "filename": "/espeak-ng-data/voices/!v/marcelo", "start": 17487747, "end": 17487998 }, { "filename": "/espeak-ng-data/voices/!v/max", "start": 17487998, "end": 17488223 }, { "filename": "/espeak-ng-data/voices/!v/michel", "start": 17488223, "end": 17488627 }, { "filename": "/espeak-ng-data/voices/!v/miguel", "start": 17488627, "end": 17489009 }, { "filename": "/espeak-ng-data/voices/!v/mike2", "start": 17489009, "end": 17489197 }, { "filename": "/espeak-ng-data/voices/!v/norbert", "start": 17489197, "end": 17492386 }, { "filename": "/espeak-ng-data/voices/!v/pablo", "start": 17492386, "end": 17495528 }, { "filename": "/espeak-ng-data/voices/!v/paul", "start": 17495528, "end": 17495812 }, { "filename": "/espeak-ng-data/voices/!v/pedro", "start": 17495812, "end": 17496164 }, { "filename": "/espeak-ng-data/voices/!v/quincy", "start": 17496164, "end": 17496518 }, { "filename": "/espeak-ng-data/voices/!v/rob", "start": 17496518, "end": 17496783 }, { "filename": "/espeak-ng-data/voices/!v/robert", "start": 17496783, "end": 17497057 }, { "filename": "/espeak-ng-data/voices/!v/robosoft", "start": 17497057, "end": 17497508 }, { "filename": "/espeak-ng-data/voices/!v/robosoft2", "start": 17497508, "end": 17497962 }, { "filename": "/espeak-ng-data/voices/!v/robosoft3", "start": 17497962, "end": 17498417 }, { "filename": "/espeak-ng-data/voices/!v/robosoft4", "start": 17498417, "end": 17498864 }, { "filename": "/espeak-ng-data/voices/!v/robosoft5", "start": 17498864, "end": 17499309 }, { "filename": "/espeak-ng-data/voices/!v/robosoft6", "start": 17499309, "end": 17499596 }, { "filename": "/espeak-ng-data/voices/!v/robosoft7", "start": 17499596, "end": 17500006 }, { "filename": "/espeak-ng-data/voices/!v/robosoft8", "start": 17500006, "end": 17500249 }, { "filename": "/espeak-ng-data/voices/!v/sandro", "start": 17500249, "end": 17500779 }, { "filename": "/espeak-ng-data/voices/!v/shelby", "start": 17500779, "end": 17501059 }, { "filename": "/espeak-ng-data/voices/!v/steph", "start": 17501059, "end": 17501423 }, { "filename": "/espeak-ng-data/voices/!v/steph2", "start": 17501423, "end": 17501790 }, { "filename": "/espeak-ng-data/voices/!v/steph3", "start": 17501790, "end": 17502167 }, { "filename": "/espeak-ng-data/voices/!v/travis", "start": 17502167, "end": 17502550 }, { "filename": "/espeak-ng-data/voices/!v/victor", "start": 17502550, "end": 17502803 }, { "filename": "/espeak-ng-data/voices/!v/whisper", "start": 17502803, "end": 17502989 }, { "filename": "/espeak-ng-data/voices/!v/whisperf", "start": 17502989, "end": 17503381 }, { "filename": "/espeak-ng-data/voices/!v/zac", "start": 17503381, "end": 17503656 }, { "filename": "/espeak-ng-data/voices/mb/mb-af1", "start": 17503656, "end": 17503744 }, { "filename": "/espeak-ng-data/voices/mb/mb-af1-en", "start": 17503744, "end": 17503827 }, { "filename": "/espeak-ng-data/voices/mb/mb-ar1", "start": 17503827, "end": 17503911 }, { "filename": "/espeak-ng-data/voices/mb/mb-ar2", "start": 17503911, "end": 17503995 }, { "filename": "/espeak-ng-data/voices/mb/mb-br1", "start": 17503995, "end": 17504127 }, { "filename": "/espeak-ng-data/voices/mb/mb-br2", "start": 17504127, "end": 17504263 }, { "filename": "/espeak-ng-data/voices/mb/mb-br3", "start": 17504263, "end": 17504395 }, { "filename": "/espeak-ng-data/voices/mb/mb-br4", "start": 17504395, "end": 17504531 }, { "filename": "/espeak-ng-data/voices/mb/mb-ca1", "start": 17504531, "end": 17504636 }, { "filename": "/espeak-ng-data/voices/mb/mb-ca2", "start": 17504636, "end": 17504741 }, { "filename": "/espeak-ng-data/voices/mb/mb-cn1", "start": 17504741, "end": 17504833 }, { "filename": "/espeak-ng-data/voices/mb/mb-cr1", "start": 17504833, "end": 17504944 }, { "filename": "/espeak-ng-data/voices/mb/mb-cz1", "start": 17504944, "end": 17505014 }, { "filename": "/espeak-ng-data/voices/mb/mb-cz2", "start": 17505014, "end": 17505096 }, { "filename": "/espeak-ng-data/voices/mb/mb-de1", "start": 17505096, "end": 17505240 }, { "filename": "/espeak-ng-data/voices/mb/mb-de1-en", "start": 17505240, "end": 17505336 }, { "filename": "/espeak-ng-data/voices/mb/mb-de2", "start": 17505336, "end": 17505464 }, { "filename": "/espeak-ng-data/voices/mb/mb-de2-en", "start": 17505464, "end": 17505544 }, { "filename": "/espeak-ng-data/voices/mb/mb-de3", "start": 17505544, "end": 17505643 }, { "filename": "/espeak-ng-data/voices/mb/mb-de3-en", "start": 17505643, "end": 17505739 }, { "filename": "/espeak-ng-data/voices/mb/mb-de4", "start": 17505739, "end": 17505868 }, { "filename": "/espeak-ng-data/voices/mb/mb-de4-en", "start": 17505868, "end": 17505949 }, { "filename": "/espeak-ng-data/voices/mb/mb-de5", "start": 17505949, "end": 17506185 }, { "filename": "/espeak-ng-data/voices/mb/mb-de5-en", "start": 17506185, "end": 17506275 }, { "filename": "/espeak-ng-data/voices/mb/mb-de6", "start": 17506275, "end": 17506397 }, { "filename": "/espeak-ng-data/voices/mb/mb-de6-en", "start": 17506397, "end": 17506471 }, { "filename": "/espeak-ng-data/voices/mb/mb-de6-grc", "start": 17506471, "end": 17506554 }, { "filename": "/espeak-ng-data/voices/mb/mb-de7", "start": 17506554, "end": 17506704 }, { "filename": "/espeak-ng-data/voices/mb/mb-de8", "start": 17506704, "end": 17506775 }, { "filename": "/espeak-ng-data/voices/mb/mb-ee1", "start": 17506775, "end": 17506872 }, { "filename": "/espeak-ng-data/voices/mb/mb-en1", "start": 17506872, "end": 17507003 }, { "filename": "/espeak-ng-data/voices/mb/mb-es1", "start": 17507003, "end": 17507117 }, { "filename": "/espeak-ng-data/voices/mb/mb-es2", "start": 17507117, "end": 17507225 }, { "filename": "/espeak-ng-data/voices/mb/mb-es3", "start": 17507225, "end": 17507329 }, { "filename": "/espeak-ng-data/voices/mb/mb-es4", "start": 17507329, "end": 17507417 }, { "filename": "/espeak-ng-data/voices/mb/mb-fr1", "start": 17507417, "end": 17507583 }, { "filename": "/espeak-ng-data/voices/mb/mb-fr1-en", "start": 17507583, "end": 17507687 }, { "filename": "/espeak-ng-data/voices/mb/mb-fr2", "start": 17507687, "end": 17507790 }, { "filename": "/espeak-ng-data/voices/mb/mb-fr3", "start": 17507790, "end": 17507890 }, { "filename": "/espeak-ng-data/voices/mb/mb-fr4", "start": 17507890, "end": 17508017 }, { "filename": "/espeak-ng-data/voices/mb/mb-fr4-en", "start": 17508017, "end": 17508124 }, { "filename": "/espeak-ng-data/voices/mb/mb-fr5", "start": 17508124, "end": 17508224 }, { "filename": "/espeak-ng-data/voices/mb/mb-fr6", "start": 17508224, "end": 17508324 }, { "filename": "/espeak-ng-data/voices/mb/mb-fr7", "start": 17508324, "end": 17508407 }, { "filename": "/espeak-ng-data/voices/mb/mb-gr1", "start": 17508407, "end": 17508501 }, { "filename": "/espeak-ng-data/voices/mb/mb-gr2", "start": 17508501, "end": 17508595 }, { "filename": "/espeak-ng-data/voices/mb/mb-gr2-en", "start": 17508595, "end": 17508683 }, { "filename": "/espeak-ng-data/voices/mb/mb-hb1", "start": 17508683, "end": 17508751 }, { "filename": "/espeak-ng-data/voices/mb/mb-hb2", "start": 17508751, "end": 17508834 }, { "filename": "/espeak-ng-data/voices/mb/mb-hu1", "start": 17508834, "end": 17508936 }, { "filename": "/espeak-ng-data/voices/mb/mb-hu1-en", "start": 17508936, "end": 17509033 }, { "filename": "/espeak-ng-data/voices/mb/mb-ic1", "start": 17509033, "end": 17509121 }, { "filename": "/espeak-ng-data/voices/mb/mb-id1", "start": 17509121, "end": 17509222 }, { "filename": "/espeak-ng-data/voices/mb/mb-in1", "start": 17509222, "end": 17509291 }, { "filename": "/espeak-ng-data/voices/mb/mb-in2", "start": 17509291, "end": 17509376 }, { "filename": "/espeak-ng-data/voices/mb/mb-ir1", "start": 17509376, "end": 17510129 }, { "filename": "/espeak-ng-data/voices/mb/mb-it1", "start": 17510129, "end": 17510213 }, { "filename": "/espeak-ng-data/voices/mb/mb-it2", "start": 17510213, "end": 17510300 }, { "filename": "/espeak-ng-data/voices/mb/mb-it3", "start": 17510300, "end": 17510442 }, { "filename": "/espeak-ng-data/voices/mb/mb-it4", "start": 17510442, "end": 17510587 }, { "filename": "/espeak-ng-data/voices/mb/mb-jp1", "start": 17510587, "end": 17510658 }, { "filename": "/espeak-ng-data/voices/mb/mb-jp2", "start": 17510658, "end": 17510759 }, { "filename": "/espeak-ng-data/voices/mb/mb-jp3", "start": 17510759, "end": 17510846 }, { "filename": "/espeak-ng-data/voices/mb/mb-la1", "start": 17510846, "end": 17510929 }, { "filename": "/espeak-ng-data/voices/mb/mb-lt1", "start": 17510929, "end": 17511016 }, { "filename": "/espeak-ng-data/voices/mb/mb-lt2", "start": 17511016, "end": 17511103 }, { "filename": "/espeak-ng-data/voices/mb/mb-ma1", "start": 17511103, "end": 17511201 }, { "filename": "/espeak-ng-data/voices/mb/mb-mx1", "start": 17511201, "end": 17511321 }, { "filename": "/espeak-ng-data/voices/mb/mb-mx2", "start": 17511321, "end": 17511441 }, { "filename": "/espeak-ng-data/voices/mb/mb-nl1", "start": 17511441, "end": 17511510 }, { "filename": "/espeak-ng-data/voices/mb/mb-nl2", "start": 17511510, "end": 17511606 }, { "filename": "/espeak-ng-data/voices/mb/mb-nl2-en", "start": 17511606, "end": 17511697 }, { "filename": "/espeak-ng-data/voices/mb/mb-nl3", "start": 17511697, "end": 17511782 }, { "filename": "/espeak-ng-data/voices/mb/mb-nz1", "start": 17511782, "end": 17511850 }, { "filename": "/espeak-ng-data/voices/mb/mb-pl1", "start": 17511850, "end": 17511949 }, { "filename": "/espeak-ng-data/voices/mb/mb-pl1-en", "start": 17511949, "end": 17512031 }, { "filename": "/espeak-ng-data/voices/mb/mb-pt1", "start": 17512031, "end": 17512162 }, { "filename": "/espeak-ng-data/voices/mb/mb-ro1", "start": 17512162, "end": 17512249 }, { "filename": "/espeak-ng-data/voices/mb/mb-ro1-en", "start": 17512249, "end": 17512330 }, { "filename": "/espeak-ng-data/voices/mb/mb-sw1", "start": 17512330, "end": 17512428 }, { "filename": "/espeak-ng-data/voices/mb/mb-sw1-en", "start": 17512428, "end": 17512521 }, { "filename": "/espeak-ng-data/voices/mb/mb-sw2", "start": 17512521, "end": 17512623 }, { "filename": "/espeak-ng-data/voices/mb/mb-sw2-en", "start": 17512623, "end": 17512722 }, { "filename": "/espeak-ng-data/voices/mb/mb-tl1", "start": 17512722, "end": 17512807 }, { "filename": "/espeak-ng-data/voices/mb/mb-tr1", "start": 17512807, "end": 17512892 }, { "filename": "/espeak-ng-data/voices/mb/mb-tr2", "start": 17512892, "end": 17513006 }, { "filename": "/espeak-ng-data/voices/mb/mb-us1", "start": 17513006, "end": 17513176 }, { "filename": "/espeak-ng-data/voices/mb/mb-us2", "start": 17513176, "end": 17513354 }, { "filename": "/espeak-ng-data/voices/mb/mb-us3", "start": 17513354, "end": 17513534 }, { "filename": "/espeak-ng-data/voices/mb/mb-vz1", "start": 17513534, "end": 17513678 }, { "filename": "/espeak-ng-data/yue_dict", "start": 17513678, "end": 18077249 }], "remote_package_size": 18077249 });
        })();
        var moduleOverrides = Object.assign({}, Module);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow) => {
          throw toThrow;
        };
        var ENVIRONMENT_IS_WEB = typeof window == "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
        var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
        var scriptDirectory = "";
        function locateFile(path) {
          if (Module["locateFile"]) {
            return Module["locateFile"](path, scriptDirectory);
          }
          return scriptDirectory + path;
        }
        var read_, readAsync, readBinary;
        if (ENVIRONMENT_IS_NODE) {
          var fs = __require("fs");
          var nodePath = __require("path");
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = nodePath.dirname(scriptDirectory) + "/";
          } else {
            scriptDirectory = __dirname + "/";
          }
          read_ = (filename, binary) => {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            return fs.readFileSync(filename, binary ? void 0 : "utf8");
          };
          readBinary = (filename) => {
            var ret = read_(filename, true);
            if (!ret.buffer) {
              ret = new Uint8Array(ret);
            }
            return ret;
          };
          readAsync = (filename, onload, onerror, binary = true) => {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            fs.readFile(filename, binary ? void 0 : "utf8", (err2, data) => {
              if (err2) onerror(err2);
              else onload(binary ? data.buffer : data);
            });
          };
          if (!Module["thisProgram"] && process.argv.length > 1) {
            thisProgram = process.argv[1].replace(/\\/g, "/");
          }
          arguments_ = process.argv.slice(2);
          quit_ = (status, toThrow) => {
            process.exitCode = status;
            throw toThrow;
          };
          Module["inspect"] = () => "[Emscripten Module object]";
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href;
          } else if (typeof document != "undefined" && document.currentScript) {
            scriptDirectory = document.currentScript.src;
          }
          if (_scriptDir) {
            scriptDirectory = _scriptDir;
          }
          if (scriptDirectory.indexOf("blob:") !== 0) {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
          } else {
            scriptDirectory = "";
          }
          {
            read_ = (url) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.send(null);
              return xhr.responseText;
            };
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = (url) => {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(xhr.response);
              };
            }
            readAsync = (url, onload, onerror) => {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, true);
              xhr.responseType = "arraybuffer";
              xhr.onload = () => {
                if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                  onload(xhr.response);
                  return;
                }
                onerror();
              };
              xhr.onerror = onerror;
              xhr.send(null);
            };
          }
        } else ;
        var out = Module["print"] || console.log.bind(console);
        var err = Module["printErr"] || console.error.bind(console);
        Object.assign(Module, moduleOverrides);
        moduleOverrides = null;
        if (Module["arguments"]) arguments_ = Module["arguments"];
        if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
        if (Module["quit"]) quit_ = Module["quit"];
        var wasmBinary;
        if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
        if (typeof WebAssembly != "object") {
          abort("no native wasm support detected");
        }
        var wasmMemory;
        var ABORT = false;
        var EXITSTATUS;
        function assert(condition, text) {
          if (!condition) {
            abort(text);
          }
        }
        var HEAP8, HEAPU8, HEAP16, HEAP32, HEAPU32;
        function updateMemoryViews() {
          var b = wasmMemory.buffer;
          Module["HEAP8"] = HEAP8 = new Int8Array(b);
          Module["HEAP16"] = HEAP16 = new Int16Array(b);
          Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
          Module["HEAPU16"] = new Uint16Array(b);
          Module["HEAP32"] = HEAP32 = new Int32Array(b);
          Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
          Module["HEAPF32"] = new Float32Array(b);
          Module["HEAPF64"] = new Float64Array(b);
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATPOSTRUN__ = [];
        function preRun() {
          if (Module["preRun"]) {
            if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
            while (Module["preRun"].length) {
              addOnPreRun(Module["preRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
          FS.ignorePermissions = false;
          callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          callRuntimeCallbacks(__ATMAIN__);
        }
        function postRun() {
          if (Module["postRun"]) {
            if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
            while (Module["postRun"].length) {
              addOnPostRun(Module["postRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
          __ATINIT__.unshift(cb);
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        var runDependencies = 0;
        var dependenciesFulfilled = null;
        function getUniqueRunDependency(id) {
          return id;
        }
        function addRunDependency(id) {
          runDependencies++;
          if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies);
          }
        }
        function removeRunDependency(id) {
          runDependencies--;
          if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies);
          }
          if (runDependencies == 0) {
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        function abort(what) {
          if (Module["onAbort"]) {
            Module["onAbort"](what);
          }
          what = "Aborted(" + what + ")";
          err(what);
          ABORT = true;
          EXITSTATUS = 1;
          what += ". Build with -sASSERTIONS for more info.";
          var e = new WebAssembly.RuntimeError(what);
          readyPromiseReject(e);
          throw e;
        }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        var isDataURI = (filename) => filename.startsWith(dataURIPrefix);
        var isFileURI = (filename) => filename.startsWith("file://");
        var wasmBinaryFile;
        wasmBinaryFile = "piper_phonemize.wasm";
        if (!isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        function getBinarySync(file) {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
          }
          if (readBinary) {
            return readBinary(file);
          }
          throw "both async and sync fetching of the wasm failed";
        }
        function getBinaryPromise(binaryFile) {
          if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
            if (typeof fetch == "function" && !isFileURI(binaryFile)) {
              return fetch(binaryFile, { credentials: "same-origin" }).then((response) => {
                if (!response["ok"]) {
                  throw "failed to load wasm binary file at '" + binaryFile + "'";
                }
                return response["arrayBuffer"]();
              }).catch(() => getBinarySync(binaryFile));
            } else if (readAsync) {
              return new Promise((resolve, reject) => {
                readAsync(binaryFile, (response) => resolve(new Uint8Array(response)), reject);
              });
            }
          }
          return Promise.resolve().then(() => getBinarySync(binaryFile));
        }
        function instantiateArrayBuffer(binaryFile, imports, receiver) {
          return getBinaryPromise(binaryFile).then((binary) => WebAssembly.instantiate(binary, imports)).then((instance) => instance).then(receiver, (reason) => {
            err(`failed to asynchronously prepare wasm: ${reason}`);
            abort(reason);
          });
        }
        function instantiateAsync(binary, binaryFile, imports, callback) {
          if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
            return fetch(binaryFile, { credentials: "same-origin" }).then((response) => {
              var result = WebAssembly.instantiateStreaming(response, imports);
              return result.then(callback, function(reason) {
                err(`wasm streaming compile failed: ${reason}`);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(binaryFile, imports, callback);
              });
            });
          }
          return instantiateArrayBuffer(binaryFile, imports, callback);
        }
        function createWasm() {
          var info = { "a": wasmImports };
          function receiveInstance(instance, module) {
            wasmExports = instance.exports;
            wasmMemory = wasmExports["w"];
            updateMemoryViews();
            addOnInit(wasmExports["x"]);
            removeRunDependency();
            return wasmExports;
          }
          addRunDependency();
          function receiveInstantiationResult(result) {
            receiveInstance(result["instance"]);
          }
          if (Module["instantiateWasm"]) {
            try {
              return Module["instantiateWasm"](info, receiveInstance);
            } catch (e) {
              err(`Module.instantiateWasm callback failed with error: ${e}`);
              readyPromiseReject(e);
            }
          }
          instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
          return {};
        }
        var tempDouble;
        var tempI64;
        function ExitStatus(status) {
          this.name = "ExitStatus";
          this.message = `Program terminated with exit(${status})`;
          this.status = status;
        }
        var callRuntimeCallbacks = (callbacks) => {
          while (callbacks.length > 0) {
            callbacks.shift()(Module);
          }
        };
        var noExitRuntime = Module["noExitRuntime"] || true;
        var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0;
        var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
          var endIdx = idx + maxBytesToRead;
          var endPtr = idx;
          while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
          if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
          }
          var str = "";
          while (idx < endPtr) {
            var u0 = heapOrArray[idx++];
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue;
            }
            var u1 = heapOrArray[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode((u0 & 31) << 6 | u1);
              continue;
            }
            var u2 = heapOrArray[idx++] & 63;
            if ((u0 & 240) == 224) {
              u0 = (u0 & 15) << 12 | u1 << 6 | u2;
            } else {
              u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
            }
            if (u0 < 65536) {
              str += String.fromCharCode(u0);
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
          }
          return str;
        };
        var UTF8ToString = (ptr, maxBytesToRead) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        var ___assert_fail = (condition, filename, line, func) => {
          abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"]);
        };
        function ExceptionInfo(excPtr) {
          this.excPtr = excPtr;
          this.ptr = excPtr - 24;
          this.set_type = function(type) {
            HEAPU32[this.ptr + 4 >> 2] = type;
          };
          this.get_type = function() {
            return HEAPU32[this.ptr + 4 >> 2];
          };
          this.set_destructor = function(destructor) {
            HEAPU32[this.ptr + 8 >> 2] = destructor;
          };
          this.get_destructor = function() {
            return HEAPU32[this.ptr + 8 >> 2];
          };
          this.set_caught = function(caught) {
            caught = caught ? 1 : 0;
            HEAP8[this.ptr + 12 >> 0] = caught;
          };
          this.get_caught = function() {
            return HEAP8[this.ptr + 12 >> 0] != 0;
          };
          this.set_rethrown = function(rethrown) {
            rethrown = rethrown ? 1 : 0;
            HEAP8[this.ptr + 13 >> 0] = rethrown;
          };
          this.get_rethrown = function() {
            return HEAP8[this.ptr + 13 >> 0] != 0;
          };
          this.init = function(type, destructor) {
            this.set_adjusted_ptr(0);
            this.set_type(type);
            this.set_destructor(destructor);
          };
          this.set_adjusted_ptr = function(adjustedPtr) {
            HEAPU32[this.ptr + 16 >> 2] = adjustedPtr;
          };
          this.get_adjusted_ptr = function() {
            return HEAPU32[this.ptr + 16 >> 2];
          };
          this.get_exception_ptr = function() {
            var isPointer = ___cxa_is_pointer_type(this.get_type());
            if (isPointer) {
              return HEAPU32[this.excPtr >> 2];
            }
            var adjusted = this.get_adjusted_ptr();
            if (adjusted !== 0) return adjusted;
            return this.excPtr;
          };
        }
        var exceptionLast = 0;
        var ___cxa_throw = (ptr, type, destructor) => {
          var info = new ExceptionInfo(ptr);
          info.init(type, destructor);
          exceptionLast = ptr;
          throw exceptionLast;
        };
        var setErrNo = (value) => {
          HEAP32[___errno_location() >> 2] = value;
          return value;
        };
        var PATH = { isAbs: (path) => path.charAt(0) === "/", splitPath: (filename) => {
          var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          return splitPathRe.exec(filename).slice(1);
        }, normalizeArray: (parts, allowAboveRoot) => {
          var up = 0;
          for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
              parts.splice(i, 1);
            } else if (last === "..") {
              parts.splice(i, 1);
              up++;
            } else if (up) {
              parts.splice(i, 1);
              up--;
            }
          }
          if (allowAboveRoot) {
            for (; up; up--) {
              parts.unshift("..");
            }
          }
          return parts;
        }, normalize: (path) => {
          var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/";
          path = PATH.normalizeArray(path.split("/").filter((p) => !!p), !isAbsolute).join("/");
          if (!path && !isAbsolute) {
            path = ".";
          }
          if (path && trailingSlash) {
            path += "/";
          }
          return (isAbsolute ? "/" : "") + path;
        }, dirname: (path) => {
          var result = PATH.splitPath(path), root = result[0], dir = result[1];
          if (!root && !dir) {
            return ".";
          }
          if (dir) {
            dir = dir.substr(0, dir.length - 1);
          }
          return root + dir;
        }, basename: (path) => {
          if (path === "/") return "/";
          path = PATH.normalize(path);
          path = path.replace(/\/$/, "");
          var lastSlash = path.lastIndexOf("/");
          if (lastSlash === -1) return path;
          return path.substr(lastSlash + 1);
        }, join: function() {
          var paths = Array.prototype.slice.call(arguments);
          return PATH.normalize(paths.join("/"));
        }, join2: (l, r) => PATH.normalize(l + "/" + r) };
        var initRandomFill = () => {
          if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
            return (view) => crypto.getRandomValues(view);
          } else if (ENVIRONMENT_IS_NODE) {
            try {
              var crypto_module = __require("crypto");
              var randomFillSync = crypto_module["randomFillSync"];
              if (randomFillSync) {
                return (view) => crypto_module["randomFillSync"](view);
              }
              var randomBytes = crypto_module["randomBytes"];
              return (view) => (view.set(randomBytes(view.byteLength)), view);
            } catch (e) {
            }
          }
          abort("initRandomDevice");
        };
        var randomFill = (view) => (randomFill = initRandomFill())(view);
        var PATH_FS = { resolve: function() {
          var resolvedPath = "", resolvedAbsolute = false;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? arguments[i] : FS.cwd();
            if (typeof path != "string") {
              throw new TypeError("Arguments to path.resolve must be strings");
            } else if (!path) {
              return "";
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = PATH.isAbs(path);
          }
          resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p) => !!p), !resolvedAbsolute).join("/");
          return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
        }, relative: (from, to) => {
          from = PATH_FS.resolve(from).substr(1);
          to = PATH_FS.resolve(to).substr(1);
          function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
              if (arr[start] !== "") break;
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
              if (arr[end] !== "") break;
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1);
          }
          var fromParts = trim(from.split("/"));
          var toParts = trim(to.split("/"));
          var length = Math.min(fromParts.length, toParts.length);
          var samePartsLength = length;
          for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
              samePartsLength = i;
              break;
            }
          }
          var outputParts = [];
          for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..");
          }
          outputParts = outputParts.concat(toParts.slice(samePartsLength));
          return outputParts.join("/");
        } };
        var FS_stdin_getChar_buffer = [];
        var lengthBytesUTF8 = (str) => {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);
            if (c <= 127) {
              len++;
            } else if (c <= 2047) {
              len += 2;
            } else if (c >= 55296 && c <= 57343) {
              len += 4;
              ++i;
            } else {
              len += 3;
            }
          }
          return len;
        };
        var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
          if (!(maxBytesToWrite > 0)) return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
              var u1 = str.charCodeAt(++i);
              u = 65536 + ((u & 1023) << 10) | u1 & 1023;
            }
            if (u <= 127) {
              if (outIdx >= endIdx) break;
              heap[outIdx++] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx) break;
              heap[outIdx++] = 192 | u >> 6;
              heap[outIdx++] = 128 | u & 63;
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx) break;
              heap[outIdx++] = 224 | u >> 12;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
            } else {
              if (outIdx + 3 >= endIdx) break;
              heap[outIdx++] = 240 | u >> 18;
              heap[outIdx++] = 128 | u >> 12 & 63;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
            }
          }
          heap[outIdx] = 0;
          return outIdx - startIdx;
        };
        function intArrayFromString(stringy, dontAddNull, length) {
          var len = lengthBytesUTF8(stringy) + 1;
          var u8array = new Array(len);
          var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
          if (dontAddNull) u8array.length = numBytesWritten;
          return u8array;
        }
        var FS_stdin_getChar = () => {
          if (!FS_stdin_getChar_buffer.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              var BUFSIZE = 256;
              var buf = Buffer.alloc(BUFSIZE);
              var bytesRead = 0;
              var fd = process.stdin.fd;
              try {
                bytesRead = fs.readSync(fd, buf);
              } catch (e) {
                if (e.toString().includes("EOF")) bytesRead = 0;
                else throw e;
              }
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString("utf-8");
              } else {
                result = null;
              }
            } else if (typeof window != "undefined" && typeof window.prompt == "function") {
              result = window.prompt("Input: ");
              if (result !== null) {
                result += "\n";
              }
            } else if (typeof readline == "function") {
              result = readline();
              if (result !== null) {
                result += "\n";
              }
            }
            if (!result) {
              return null;
            }
            FS_stdin_getChar_buffer = intArrayFromString(result, true);
          }
          return FS_stdin_getChar_buffer.shift();
        };
        var TTY = { ttys: [], init() {
        }, shutdown() {
        }, register(dev, ops) {
          TTY.ttys[dev] = { input: [], output: [], ops };
          FS.registerDevice(dev, TTY.stream_ops);
        }, stream_ops: { open(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        }, close(stream) {
          stream.tty.ops.fsync(stream.tty);
        }, fsync(stream) {
          stream.tty.ops.fsync(stream.tty);
        }, read(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === void 0 && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === void 0) break;
            bytesRead++;
            buffer[offset + i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        }, write(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        } }, default_tty_ops: { get_char(tty) {
          return FS_stdin_getChar();
        }, put_char(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        }, fsync(tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }, ioctl_tcgets(tty) {
          return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
        }, ioctl_tcsets(tty, optional_actions, data) {
          return 0;
        }, ioctl_tiocgwinsz(tty) {
          return [24, 80];
        } }, default_tty1_ops: { put_char(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        }, fsync(tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        } } };
        var mmapAlloc = (size) => {
          abort();
        };
        var MEMFS = { ops_table: null, mount(mount) {
          return MEMFS.createNode(null, "/", 16384 | 511, 0);
        }, createNode(parent, name, mode, dev) {
          if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(63);
          }
          if (!MEMFS.ops_table) {
            MEMFS.ops_table = { dir: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, lookup: MEMFS.node_ops.lookup, mknod: MEMFS.node_ops.mknod, rename: MEMFS.node_ops.rename, unlink: MEMFS.node_ops.unlink, rmdir: MEMFS.node_ops.rmdir, readdir: MEMFS.node_ops.readdir, symlink: MEMFS.node_ops.symlink }, stream: { llseek: MEMFS.stream_ops.llseek } }, file: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: { llseek: MEMFS.stream_ops.llseek, read: MEMFS.stream_ops.read, write: MEMFS.stream_ops.write, allocate: MEMFS.stream_ops.allocate, mmap: MEMFS.stream_ops.mmap, msync: MEMFS.stream_ops.msync } }, link: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, readlink: MEMFS.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: FS.chrdev_stream_ops } };
          }
          var node = FS.createNode(parent, name, mode, dev);
          if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {};
          } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = null;
          } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream;
          } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream;
          }
          node.timestamp = Date.now();
          if (parent) {
            parent.contents[name] = node;
            parent.timestamp = node.timestamp;
          }
          return node;
        }, getFileDataAsTypedArray(node) {
          if (!node.contents) return new Uint8Array(0);
          if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
          return new Uint8Array(node.contents);
        }, expandFileStorage(node, newCapacity) {
          var prevCapacity = node.contents ? node.contents.length : 0;
          if (prevCapacity >= newCapacity) return;
          var CAPACITY_DOUBLING_MAX = 1024 * 1024;
          newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
          if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
          var oldContents = node.contents;
          node.contents = new Uint8Array(newCapacity);
          if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
        }, resizeFileStorage(node, newSize) {
          if (node.usedBytes == newSize) return;
          if (newSize == 0) {
            node.contents = null;
            node.usedBytes = 0;
          } else {
            var oldContents = node.contents;
            node.contents = new Uint8Array(newSize);
            if (oldContents) {
              node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
            }
            node.usedBytes = newSize;
          }
        }, node_ops: { getattr(node) {
          var attr = {};
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        }, setattr(node, attr) {
          if (attr.mode !== void 0) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== void 0) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== void 0) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        }, lookup(parent, name) {
          throw FS.genericErrors[44];
        }, mknod(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        }, rename(old_node, new_dir, new_name) {
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
          }
          delete old_node.parent.contents[old_node.name];
          old_node.parent.timestamp = Date.now();
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          new_dir.timestamp = old_node.parent.timestamp;
          old_node.parent = new_dir;
        }, unlink(parent, name) {
          delete parent.contents[name];
          parent.timestamp = Date.now();
        }, rmdir(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.timestamp = Date.now();
        }, readdir(node) {
          var entries = [".", ".."];
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        }, symlink(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
          node.link = oldpath;
          return node;
        }, readlink(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        } }, stream_ops: { read(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          if (size > 8 && contents.subarray) {
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        }, write(stream, buffer, offset, length, position, canOwn) {
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
          if (buffer.subarray && (!node.contents || node.contents.subarray)) {
            if (canOwn) {
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) {
              node.contents = buffer.slice(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) {
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
          MEMFS.expandFileStorage(node, position + length);
          if (node.contents.subarray && buffer.subarray) {
            node.contents.set(buffer.subarray(offset, offset + length), position);
          } else {
            for (var i = 0; i < length; i++) {
              node.contents[position + i] = buffer[offset + i];
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        }, llseek(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        }, allocate(stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        }, mmap(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = mmapAlloc();
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            HEAP8.set(contents, ptr);
          }
          return { ptr, allocated };
        }, msync(stream, buffer, offset, length, mmapFlags) {
          MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          return 0;
        } } };
        var asyncLoad = (url, onload, onerror, noRunDep) => {
          var dep = getUniqueRunDependency(`al ${url}`);
          readAsync(url, (arrayBuffer) => {
            assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
            onload(new Uint8Array(arrayBuffer));
            if (dep) removeRunDependency();
          }, (event) => {
            if (onerror) {
              onerror();
            } else {
              throw `Loading data file "${url}" failed.`;
            }
          });
          if (dep) addRunDependency();
        };
        var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
        var preloadPlugins = Module["preloadPlugins"] || [];
        var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
          if (typeof Browser != "undefined") Browser.init();
          var handled = false;
          preloadPlugins.forEach((plugin) => {
            if (handled) return;
            if (plugin["canHandle"](fullname)) {
              plugin["handle"](byteArray, fullname, finish, onerror);
              handled = true;
            }
          });
          return handled;
        };
        var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
          var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
          function processData(byteArray) {
            function finish(byteArray2) {
              if (preFinish) preFinish();
              if (!dontCreateFile) {
                FS_createDataFile(parent, name, byteArray2, canRead, canWrite, canOwn);
              }
              if (onload) onload();
              removeRunDependency();
            }
            if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
              if (onerror) onerror();
              removeRunDependency();
            })) {
              return;
            }
            finish(byteArray);
          }
          addRunDependency();
          if (typeof url == "string") {
            asyncLoad(url, (byteArray) => processData(byteArray), onerror);
          } else {
            processData(url);
          }
        };
        var FS_modeStringToFlags = (str) => {
          var flagModes = { "r": 0, "r+": 2, "w": 512 | 64 | 1, "w+": 512 | 64 | 2, "a": 1024 | 64 | 1, "a+": 1024 | 64 | 2 };
          var flags = flagModes[str];
          if (typeof flags == "undefined") {
            throw new Error(`Unknown file open mode: ${str}`);
          }
          return flags;
        };
        var FS_getMode = (canRead, canWrite) => {
          var mode = 0;
          if (canRead) mode |= 292 | 73;
          if (canWrite) mode |= 146;
          return mode;
        };
        var FS = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: false, ignorePermissions: true, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, lookupPath(path, opts = {}) {
          path = PATH_FS.resolve(path);
          if (!path) return { path: "", node: null };
          var defaults = { follow_mount: true, recurse_count: 0 };
          opts = Object.assign(defaults, opts);
          if (opts.recurse_count > 8) {
            throw new FS.ErrnoError(32);
          }
          var parts = path.split("/").filter((p) => !!p);
          var current = FS.root;
          var current_path = "/";
          for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
              break;
            }
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
            if (FS.isMountpoint(current)) {
              if (!islast || islast && opts.follow_mount) {
                current = current.mounted.root;
              }
            }
            if (!islast || opts.follow) {
              var count = 0;
              while (FS.isLink(current.mode)) {
                var link = FS.readlink(current_path);
                current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
                current = lookup.node;
                if (count++ > 40) {
                  throw new FS.ErrnoError(32);
                }
              }
            }
          }
          return { path: current_path, node: current };
        }, getPath(node) {
          var path;
          while (true) {
            if (FS.isRoot(node)) {
              var mount = node.mount.mountpoint;
              if (!path) return mount;
              return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
            }
            path = path ? `${node.name}/${path}` : node.name;
            node = node.parent;
          }
        }, hashName(parentid, name) {
          var hash = 0;
          for (var i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
          }
          return (parentid + hash >>> 0) % FS.nameTable.length;
        }, hashAddNode(node) {
          var hash = FS.hashName(node.parent.id, node.name);
          node.name_next = FS.nameTable[hash];
          FS.nameTable[hash] = node;
        }, hashRemoveNode(node) {
          var hash = FS.hashName(node.parent.id, node.name);
          if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next;
          } else {
            var current = FS.nameTable[hash];
            while (current) {
              if (current.name_next === node) {
                current.name_next = node.name_next;
                break;
              }
              current = current.name_next;
            }
          }
        }, lookupNode(parent, name) {
          var errCode = FS.mayLookup(parent);
          if (errCode) {
            throw new FS.ErrnoError(errCode, parent);
          }
          var hash = FS.hashName(parent.id, name);
          for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
              return node;
            }
          }
          return FS.lookup(parent, name);
        }, createNode(parent, name, mode, rdev) {
          var node = new FS.FSNode(parent, name, mode, rdev);
          FS.hashAddNode(node);
          return node;
        }, destroyNode(node) {
          FS.hashRemoveNode(node);
        }, isRoot(node) {
          return node === node.parent;
        }, isMountpoint(node) {
          return !!node.mounted;
        }, isFile(mode) {
          return (mode & 61440) === 32768;
        }, isDir(mode) {
          return (mode & 61440) === 16384;
        }, isLink(mode) {
          return (mode & 61440) === 40960;
        }, isChrdev(mode) {
          return (mode & 61440) === 8192;
        }, isBlkdev(mode) {
          return (mode & 61440) === 24576;
        }, isFIFO(mode) {
          return (mode & 61440) === 4096;
        }, isSocket(mode) {
          return (mode & 49152) === 49152;
        }, flagsToPermissionString(flag) {
          var perms = ["r", "w", "rw"][flag & 3];
          if (flag & 512) {
            perms += "w";
          }
          return perms;
        }, nodePermissions(node, perms) {
          if (FS.ignorePermissions) {
            return 0;
          }
          if (perms.includes("r") && !(node.mode & 292)) {
            return 2;
          } else if (perms.includes("w") && !(node.mode & 146)) {
            return 2;
          } else if (perms.includes("x") && !(node.mode & 73)) {
            return 2;
          }
          return 0;
        }, mayLookup(dir) {
          var errCode = FS.nodePermissions(dir, "x");
          if (errCode) return errCode;
          if (!dir.node_ops.lookup) return 2;
          return 0;
        }, mayCreate(dir, name) {
          try {
            var node = FS.lookupNode(dir, name);
            return 20;
          } catch (e) {
          }
          return FS.nodePermissions(dir, "wx");
        }, mayDelete(dir, name, isdir) {
          var node;
          try {
            node = FS.lookupNode(dir, name);
          } catch (e) {
            return e.errno;
          }
          var errCode = FS.nodePermissions(dir, "wx");
          if (errCode) {
            return errCode;
          }
          if (isdir) {
            if (!FS.isDir(node.mode)) {
              return 54;
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
              return 10;
            }
          } else {
            if (FS.isDir(node.mode)) {
              return 31;
            }
          }
          return 0;
        }, mayOpen(node, flags) {
          if (!node) {
            return 44;
          }
          if (FS.isLink(node.mode)) {
            return 32;
          } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
              return 31;
            }
          }
          return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
        }, MAX_OPEN_FDS: 4096, nextfd() {
          for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
            if (!FS.streams[fd]) {
              return fd;
            }
          }
          throw new FS.ErrnoError(33);
        }, getStreamChecked(fd) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(8);
          }
          return stream;
        }, getStream: (fd) => FS.streams[fd], createStream(stream, fd = -1) {
          if (!FS.FSStream) {
            FS.FSStream = function() {
              this.shared = {};
            };
            FS.FSStream.prototype = {};
            Object.defineProperties(FS.FSStream.prototype, { object: { get() {
              return this.node;
            }, set(val) {
              this.node = val;
            } }, isRead: { get() {
              return (this.flags & 2097155) !== 1;
            } }, isWrite: { get() {
              return (this.flags & 2097155) !== 0;
            } }, isAppend: { get() {
              return this.flags & 1024;
            } }, flags: { get() {
              return this.shared.flags;
            }, set(val) {
              this.shared.flags = val;
            } }, position: { get() {
              return this.shared.position;
            }, set(val) {
              this.shared.position = val;
            } } });
          }
          stream = Object.assign(new FS.FSStream(), stream);
          if (fd == -1) {
            fd = FS.nextfd();
          }
          stream.fd = fd;
          FS.streams[fd] = stream;
          return stream;
        }, closeStream(fd) {
          FS.streams[fd] = null;
        }, chrdev_stream_ops: { open(stream) {
          var device = FS.getDevice(stream.node.rdev);
          stream.stream_ops = device.stream_ops;
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        }, llseek() {
          throw new FS.ErrnoError(70);
        } }, major: (dev) => dev >> 8, minor: (dev) => dev & 255, makedev: (ma2, mi) => ma2 << 8 | mi, registerDevice(dev, ops) {
          FS.devices[dev] = { stream_ops: ops };
        }, getDevice: (dev) => FS.devices[dev], getMounts(mount) {
          var mounts = [];
          var check = [mount];
          while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push.apply(check, m.mounts);
          }
          return mounts;
        }, syncfs(populate, callback) {
          if (typeof populate == "function") {
            callback = populate;
            populate = false;
          }
          FS.syncFSRequests++;
          if (FS.syncFSRequests > 1) {
            err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
          }
          var mounts = FS.getMounts(FS.root.mount);
          var completed = 0;
          function doCallback(errCode) {
            FS.syncFSRequests--;
            return callback(errCode);
          }
          function done(errCode) {
            if (errCode) {
              if (!done.errored) {
                done.errored = true;
                return doCallback(errCode);
              }
              return;
            }
            if (++completed >= mounts.length) {
              doCallback(null);
            }
          }
          mounts.forEach((mount) => {
            if (!mount.type.syncfs) {
              return done(null);
            }
            mount.type.syncfs(mount, populate, done);
          });
        }, mount(type, opts, mountpoint) {
          var root = mountpoint === "/";
          var pseudo = !mountpoint;
          var node;
          if (root && FS.root) {
            throw new FS.ErrnoError(10);
          } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(10);
            }
            if (!FS.isDir(node.mode)) {
              throw new FS.ErrnoError(54);
            }
          }
          var mount = { type, opts, mountpoint, mounts: [] };
          var mountRoot = type.mount(mount);
          mountRoot.mount = mount;
          mount.root = mountRoot;
          if (root) {
            FS.root = mountRoot;
          } else if (node) {
            node.mounted = mount;
            if (node.mount) {
              node.mount.mounts.push(mount);
            }
          }
          return mountRoot;
        }, unmount(mountpoint) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
          if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(28);
          }
          var node = lookup.node;
          var mount = node.mounted;
          var mounts = FS.getMounts(mount);
          Object.keys(FS.nameTable).forEach((hash) => {
            var current = FS.nameTable[hash];
            while (current) {
              var next = current.name_next;
              if (mounts.includes(current.mount)) {
                FS.destroyNode(current);
              }
              current = next;
            }
          });
          node.mounted = null;
          var idx = node.mount.mounts.indexOf(mount);
          node.mount.mounts.splice(idx, 1);
        }, lookup(parent, name) {
          return parent.node_ops.lookup(parent, name);
        }, mknod(path, mode, dev) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          if (!name || name === "." || name === "..") {
            throw new FS.ErrnoError(28);
          }
          var errCode = FS.mayCreate(parent, name);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(63);
          }
          return parent.node_ops.mknod(parent, name, mode, dev);
        }, create(path, mode) {
          mode = mode !== void 0 ? mode : 438;
          mode &= 4095;
          mode |= 32768;
          return FS.mknod(path, mode, 0);
        }, mkdir(path, mode) {
          mode = mode !== void 0 ? mode : 511;
          mode &= 511 | 512;
          mode |= 16384;
          return FS.mknod(path, mode, 0);
        }, mkdirTree(path, mode) {
          var dirs = path.split("/");
          var d = "";
          for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i]) continue;
            d += "/" + dirs[i];
            try {
              FS.mkdir(d, mode);
            } catch (e) {
              if (e.errno != 20) throw e;
            }
          }
        }, mkdev(path, mode, dev) {
          if (typeof dev == "undefined") {
            dev = mode;
            mode = 438;
          }
          mode |= 8192;
          return FS.mknod(path, mode, dev);
        }, symlink(oldpath, newpath) {
          if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(44);
          }
          var lookup = FS.lookupPath(newpath, { parent: true });
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(44);
          }
          var newname = PATH.basename(newpath);
          var errCode = FS.mayCreate(parent, newname);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(63);
          }
          return parent.node_ops.symlink(parent, newname, oldpath);
        }, rename(old_path, new_path) {
          var old_dirname = PATH.dirname(old_path);
          var new_dirname = PATH.dirname(new_path);
          var old_name = PATH.basename(old_path);
          var new_name = PATH.basename(new_path);
          var lookup, old_dir, new_dir;
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
          if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
          if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(75);
          }
          var old_node = FS.lookupNode(old_dir, old_name);
          var relative = PATH_FS.relative(old_path, new_dirname);
          if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(28);
          }
          relative = PATH_FS.relative(new_path, old_dirname);
          if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(55);
          }
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {
          }
          if (old_node === new_node) {
            return;
          }
          var isdir = FS.isDir(old_node.mode);
          var errCode = FS.mayDelete(old_dir, old_name, isdir);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
            throw new FS.ErrnoError(10);
          }
          if (new_dir !== old_dir) {
            errCode = FS.nodePermissions(old_dir, "w");
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
          }
          FS.hashRemoveNode(old_node);
          try {
            old_dir.node_ops.rename(old_node, new_dir, new_name);
          } catch (e) {
            throw e;
          } finally {
            FS.hashAddNode(old_node);
          }
        }, rmdir(path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, true);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          parent.node_ops.rmdir(parent, name);
          FS.destroyNode(node);
        }, readdir(path) {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(54);
          }
          return node.node_ops.readdir(node);
        }, unlink(path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(44);
          }
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var errCode = FS.mayDelete(parent, name, false);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
          parent.node_ops.unlink(parent, name);
          FS.destroyNode(node);
        }, readlink(path) {
          var lookup = FS.lookupPath(path);
          var link = lookup.node;
          if (!link) {
            throw new FS.ErrnoError(44);
          }
          if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(28);
          }
          return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
        }, stat(path, dontFollow) {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          var node = lookup.node;
          if (!node) {
            throw new FS.ErrnoError(44);
          }
          if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(63);
          }
          return node.node_ops.getattr(node);
        }, lstat(path) {
          return FS.stat(path, true);
        }, chmod(path, mode, dontFollow) {
          var node;
          if (typeof path == "string") {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
          }
          node.node_ops.setattr(node, { mode: mode & 4095 | node.mode & ~4095, timestamp: Date.now() });
        }, lchmod(path, mode) {
          FS.chmod(path, mode, true);
        }, fchmod(fd, mode) {
          var stream = FS.getStreamChecked(fd);
          FS.chmod(stream.node, mode);
        }, chown(path, uid, gid, dontFollow) {
          var node;
          if (typeof path == "string") {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
          }
          node.node_ops.setattr(node, { timestamp: Date.now() });
        }, lchown(path, uid, gid) {
          FS.chown(path, uid, gid, true);
        }, fchown(fd, uid, gid) {
          var stream = FS.getStreamChecked(fd);
          FS.chown(stream.node, uid, gid);
        }, truncate(path, len) {
          if (len < 0) {
            throw new FS.ErrnoError(28);
          }
          var node;
          if (typeof path == "string") {
            var lookup = FS.lookupPath(path, { follow: true });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
          }
          if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          var errCode = FS.nodePermissions(node, "w");
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          node.node_ops.setattr(node, { size: len, timestamp: Date.now() });
        }, ftruncate(fd, len) {
          var stream = FS.getStreamChecked(fd);
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(28);
          }
          FS.truncate(stream.node, len);
        }, utime(path, atime, mtime) {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
        }, open(path, flags, mode) {
          if (path === "") {
            throw new FS.ErrnoError(44);
          }
          flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
          mode = typeof mode == "undefined" ? 438 : mode;
          if (flags & 64) {
            mode = mode & 4095 | 32768;
          } else {
            mode = 0;
          }
          var node;
          if (typeof path == "object") {
            node = path;
          } else {
            path = PATH.normalize(path);
            try {
              var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
              node = lookup.node;
            } catch (e) {
            }
          }
          var created = false;
          if (flags & 64) {
            if (node) {
              if (flags & 128) {
                throw new FS.ErrnoError(20);
              }
            } else {
              node = FS.mknod(path, mode, 0);
              created = true;
            }
          }
          if (!node) {
            throw new FS.ErrnoError(44);
          }
          if (FS.isChrdev(node.mode)) {
            flags &= ~512;
          }
          if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
          if (!created) {
            var errCode = FS.mayOpen(node, flags);
            if (errCode) {
              throw new FS.ErrnoError(errCode);
            }
          }
          if (flags & 512 && !created) {
            FS.truncate(node, 0);
          }
          flags &= ~(128 | 512 | 131072);
          var stream = FS.createStream({ node, path: FS.getPath(node), flags, seekable: true, position: 0, stream_ops: node.stream_ops, ungotten: [], error: false });
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
          if (Module["logReadFiles"] && !(flags & 1)) {
            if (!FS.readFiles) FS.readFiles = {};
            if (!(path in FS.readFiles)) {
              FS.readFiles[path] = 1;
            }
          }
          return stream;
        }, close(stream) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (stream.getdents) stream.getdents = null;
          try {
            if (stream.stream_ops.close) {
              stream.stream_ops.close(stream);
            }
          } catch (e) {
            throw e;
          } finally {
            FS.closeStream(stream.fd);
          }
          stream.fd = null;
        }, isClosed(stream) {
          return stream.fd === null;
        }, llseek(stream, offset, whence) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(70);
          }
          if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(28);
          }
          stream.position = stream.stream_ops.llseek(stream, offset, whence);
          stream.ungotten = [];
          return stream.position;
        }, read(stream, buffer, offset, length, position) {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(8);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(28);
          }
          var seeking = typeof position != "undefined";
          if (!seeking) {
            position = stream.position;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
          }
          var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
          if (!seeking) stream.position += bytesRead;
          return bytesRead;
        }, write(stream, buffer, offset, length, position, canOwn) {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
          }
          if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(28);
          }
          if (stream.seekable && stream.flags & 1024) {
            FS.llseek(stream, 0, 2);
          }
          var seeking = typeof position != "undefined";
          if (!seeking) {
            position = stream.position;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
          }
          var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
          if (!seeking) stream.position += bytesWritten;
          return bytesWritten;
        }, allocate(stream, offset, length) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
          }
          if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(28);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8);
          }
          if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(138);
          }
          stream.stream_ops.allocate(stream, offset, length);
        }, mmap(stream, length, position, prot, flags) {
          if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
            throw new FS.ErrnoError(2);
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(2);
          }
          if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(43);
          }
          return stream.stream_ops.mmap(stream, length, position, prot, flags);
        }, msync(stream, buffer, offset, length, mmapFlags) {
          if (!stream.stream_ops.msync) {
            return 0;
          }
          return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
        }, munmap: (stream) => 0, ioctl(stream, cmd, arg) {
          if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(59);
          }
          return stream.stream_ops.ioctl(stream, cmd, arg);
        }, readFile(path, opts = {}) {
          opts.flags = opts.flags || 0;
          opts.encoding = opts.encoding || "binary";
          if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error(`Invalid encoding type "${opts.encoding}"`);
          }
          var ret;
          var stream = FS.open(path, opts.flags);
          var stat = FS.stat(path);
          var length = stat.size;
          var buf = new Uint8Array(length);
          FS.read(stream, buf, 0, length, 0);
          if (opts.encoding === "utf8") {
            ret = UTF8ArrayToString(buf, 0);
          } else if (opts.encoding === "binary") {
            ret = buf;
          }
          FS.close(stream);
          return ret;
        }, writeFile(path, data, opts = {}) {
          opts.flags = opts.flags || 577;
          var stream = FS.open(path, opts.flags, opts.mode);
          if (typeof data == "string") {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, void 0, opts.canOwn);
          } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
          } else {
            throw new Error("Unsupported data type");
          }
          FS.close(stream);
        }, cwd: () => FS.currentPath, chdir(path) {
          var lookup = FS.lookupPath(path, { follow: true });
          if (lookup.node === null) {
            throw new FS.ErrnoError(44);
          }
          if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(54);
          }
          var errCode = FS.nodePermissions(lookup.node, "x");
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
          FS.currentPath = lookup.path;
        }, createDefaultDirectories() {
          FS.mkdir("/tmp");
          FS.mkdir("/home");
          FS.mkdir("/home/web_user");
        }, createDefaultDevices() {
          FS.mkdir("/dev");
          FS.registerDevice(FS.makedev(1, 3), { read: () => 0, write: (stream, buffer, offset, length, pos) => length });
          FS.mkdev("/dev/null", FS.makedev(1, 3));
          TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
          TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
          FS.mkdev("/dev/tty", FS.makedev(5, 0));
          FS.mkdev("/dev/tty1", FS.makedev(6, 0));
          var randomBuffer = new Uint8Array(1024), randomLeft = 0;
          var randomByte = () => {
            if (randomLeft === 0) {
              randomLeft = randomFill(randomBuffer).byteLength;
            }
            return randomBuffer[--randomLeft];
          };
          FS.createDevice("/dev", "random", randomByte);
          FS.createDevice("/dev", "urandom", randomByte);
          FS.mkdir("/dev/shm");
          FS.mkdir("/dev/shm/tmp");
        }, createSpecialDirectories() {
          FS.mkdir("/proc");
          var proc_self = FS.mkdir("/proc/self");
          FS.mkdir("/proc/self/fd");
          FS.mount({ mount() {
            var node = FS.createNode(proc_self, "fd", 16384 | 511, 73);
            node.node_ops = { lookup(parent, name) {
              var fd = +name;
              var stream = FS.getStreamChecked(fd);
              var ret = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => stream.path } };
              ret.parent = ret;
              return ret;
            } };
            return node;
          } }, {}, "/proc/self/fd");
        }, createStandardStreams() {
          if (Module["stdin"]) {
            FS.createDevice("/dev", "stdin", Module["stdin"]);
          } else {
            FS.symlink("/dev/tty", "/dev/stdin");
          }
          if (Module["stdout"]) {
            FS.createDevice("/dev", "stdout", null, Module["stdout"]);
          } else {
            FS.symlink("/dev/tty", "/dev/stdout");
          }
          if (Module["stderr"]) {
            FS.createDevice("/dev", "stderr", null, Module["stderr"]);
          } else {
            FS.symlink("/dev/tty1", "/dev/stderr");
          }
          FS.open("/dev/stdin", 0);
          FS.open("/dev/stdout", 1);
          FS.open("/dev/stderr", 1);
        }, ensureErrnoError() {
          if (FS.ErrnoError) return;
          FS.ErrnoError = function ErrnoError(errno, node) {
            this.name = "ErrnoError";
            this.node = node;
            this.setErrno = function(errno2) {
              this.errno = errno2;
            };
            this.setErrno(errno);
            this.message = "FS error";
          };
          FS.ErrnoError.prototype = new Error();
          FS.ErrnoError.prototype.constructor = FS.ErrnoError;
          [44].forEach((code) => {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = "<generic error, no stack>";
          });
        }, staticInit() {
          FS.ensureErrnoError();
          FS.nameTable = new Array(4096);
          FS.mount(MEMFS, {}, "/");
          FS.createDefaultDirectories();
          FS.createDefaultDevices();
          FS.createSpecialDirectories();
          FS.filesystems = { "MEMFS": MEMFS };
        }, init(input, output, error) {
          FS.init.initialized = true;
          FS.ensureErrnoError();
          Module["stdin"] = input || Module["stdin"];
          Module["stdout"] = output || Module["stdout"];
          Module["stderr"] = error || Module["stderr"];
          FS.createStandardStreams();
        }, quit() {
          FS.init.initialized = false;
          for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
              continue;
            }
            FS.close(stream);
          }
        }, findObject(path, dontResolveLastLink) {
          var ret = FS.analyzePath(path, dontResolveLastLink);
          if (!ret.exists) {
            return null;
          }
          return ret.object;
        }, analyzePath(path, dontResolveLastLink) {
          try {
            var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            path = lookup.path;
          } catch (e) {
          }
          var ret = { isRoot: false, exists: false, error: 0, name: null, path: null, object: null, parentExists: false, parentPath: null, parentObject: null };
          try {
            var lookup = FS.lookupPath(path, { parent: true });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/";
          } catch (e) {
            ret.error = e.errno;
          }
          return ret;
        }, createPath(parent, path, canRead, canWrite) {
          parent = typeof parent == "string" ? parent : FS.getPath(parent);
          var parts = path.split("/").reverse();
          while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
              FS.mkdir(current);
            } catch (e) {
            }
            parent = current;
          }
          return current;
        }, createFile(parent, name, properties, canRead, canWrite) {
          var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
          var mode = FS_getMode(canRead, canWrite);
          return FS.create(path, mode);
        }, createDataFile(parent, name, data, canRead, canWrite, canOwn) {
          var path = name;
          if (parent) {
            parent = typeof parent == "string" ? parent : FS.getPath(parent);
            path = name ? PATH.join2(parent, name) : parent;
          }
          var mode = FS_getMode(canRead, canWrite);
          var node = FS.create(path, mode);
          if (data) {
            if (typeof data == "string") {
              var arr = new Array(data.length);
              for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
              data = arr;
            }
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, 577);
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode);
          }
          return node;
        }, createDevice(parent, name, input, output) {
          var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
          var mode = FS_getMode(!!input, !!output);
          if (!FS.createDevice.major) FS.createDevice.major = 64;
          var dev = FS.makedev(FS.createDevice.major++, 0);
          FS.registerDevice(dev, { open(stream) {
            stream.seekable = false;
          }, close(stream) {
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          }, read(stream, buffer, offset, length, pos) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === void 0 && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === void 0) break;
              bytesRead++;
              buffer[offset + i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          }, write(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset + i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          } });
          return FS.mkdev(path, mode, dev);
        }, forceLoadFile(obj) {
          if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
          if (typeof XMLHttpRequest != "undefined") {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
          } else if (read_) {
            try {
              obj.contents = intArrayFromString(read_(obj.url), true);
              obj.usedBytes = obj.contents.length;
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
          } else {
            throw new Error("Cannot load without read() or XMLHttpRequest.");
          }
        }, createLazyFile(parent, name, url, canRead, canWrite) {
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = [];
          }
          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
              return void 0;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = idx / this.chunkSize | 0;
            return this.getter(chunkNum)[chunkOffset];
          };
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          };
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            var xhr = new XMLHttpRequest();
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing) chunkSize = datalength;
            var doXHR = (from, to) => {
              if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
              if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
              var xhr2 = new XMLHttpRequest();
              xhr2.open("GET", url, false);
              if (datalength !== chunkSize) xhr2.setRequestHeader("Range", "bytes=" + from + "-" + to);
              xhr2.responseType = "arraybuffer";
              if (xhr2.overrideMimeType) {
                xhr2.overrideMimeType("text/plain; charset=x-user-defined");
              }
              xhr2.send(null);
              if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr2.status);
              if (xhr2.response !== void 0) {
                return new Uint8Array(xhr2.response || []);
              }
              return intArrayFromString(xhr2.responseText || "", true);
            };
            var lazyArray2 = this;
            lazyArray2.setDataGetter((chunkNum) => {
              var start = chunkNum * chunkSize;
              var end = (chunkNum + 1) * chunkSize - 1;
              end = Math.min(end, datalength - 1);
              if (typeof lazyArray2.chunks[chunkNum] == "undefined") {
                lazyArray2.chunks[chunkNum] = doXHR(start, end);
              }
              if (typeof lazyArray2.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
              return lazyArray2.chunks[chunkNum];
            });
            if (usesGzip || !datalength) {
              chunkSize = datalength = 1;
              datalength = this.getter(0).length;
              chunkSize = datalength;
              out("LazyFiles on gzip forces download of the whole file when length is accessed");
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
          };
          if (typeof XMLHttpRequest != "undefined") {
            if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var lazyArray = new LazyUint8Array();
            Object.defineProperties(lazyArray, { length: { get: function() {
              if (!this.lengthKnown) {
                this.cacheLength();
              }
              return this._length;
            } }, chunkSize: { get: function() {
              if (!this.lengthKnown) {
                this.cacheLength();
              }
              return this._chunkSize;
            } } });
            var properties = { isDevice: false, contents: lazyArray };
          } else {
            var properties = { isDevice: false, url };
          }
          var node = FS.createFile(parent, name, properties, canRead, canWrite);
          if (properties.contents) {
            node.contents = properties.contents;
          } else if (properties.url) {
            node.contents = null;
            node.url = properties.url;
          }
          Object.defineProperties(node, { usedBytes: { get: function() {
            return this.contents.length;
          } } });
          var stream_ops = {};
          var keys = Object.keys(node.stream_ops);
          keys.forEach((key) => {
            var fn2 = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
              FS.forceLoadFile(node);
              return fn2.apply(null, arguments);
            };
          });
          function writeChunks(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= contents.length) return 0;
            var size = Math.min(contents.length - position, length);
            if (contents.slice) {
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents[position + i];
              }
            } else {
              for (var i = 0; i < size; i++) {
                buffer[offset + i] = contents.get(position + i);
              }
            }
            return size;
          }
          stream_ops.read = (stream, buffer, offset, length, position) => {
            FS.forceLoadFile(node);
            return writeChunks(stream, buffer, offset, length, position);
          };
          stream_ops.mmap = (stream, length, position, prot, flags) => {
            FS.forceLoadFile(node);
            var ptr = mmapAlloc();
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            writeChunks(stream, HEAP8, ptr, length, position);
            return { ptr, allocated: true };
          };
          node.stream_ops = stream_ops;
          return node;
        } };
        var SYSCALLS = { DEFAULT_POLLMASK: 5, calculateAt(dirfd, path, allowEmpty) {
          if (PATH.isAbs(path)) {
            return path;
          }
          var dir;
          if (dirfd === -100) {
            dir = FS.cwd();
          } else {
            var dirstream = SYSCALLS.getStreamFromFD(dirfd);
            dir = dirstream.path;
          }
          if (path.length == 0) {
            if (!allowEmpty) {
              throw new FS.ErrnoError(44);
            }
            return dir;
          }
          return PATH.join2(dir, path);
        }, doStat(func, path, buf) {
          try {
            var stat = func(path);
          } catch (e) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
              return -54;
            }
            throw e;
          }
          HEAP32[buf >> 2] = stat.dev;
          HEAP32[buf + 4 >> 2] = stat.mode;
          HEAPU32[buf + 8 >> 2] = stat.nlink;
          HEAP32[buf + 12 >> 2] = stat.uid;
          HEAP32[buf + 16 >> 2] = stat.gid;
          HEAP32[buf + 20 >> 2] = stat.rdev;
          tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 24 >> 2] = tempI64[0], HEAP32[buf + 28 >> 2] = tempI64[1];
          HEAP32[buf + 32 >> 2] = 4096;
          HEAP32[buf + 36 >> 2] = stat.blocks;
          var atime = stat.atime.getTime();
          var mtime = stat.mtime.getTime();
          var ctime = stat.ctime.getTime();
          tempI64 = [Math.floor(atime / 1e3) >>> 0, (tempDouble = Math.floor(atime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
          HEAPU32[buf + 48 >> 2] = atime % 1e3 * 1e3;
          tempI64 = [Math.floor(mtime / 1e3) >>> 0, (tempDouble = Math.floor(mtime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 56 >> 2] = tempI64[0], HEAP32[buf + 60 >> 2] = tempI64[1];
          HEAPU32[buf + 64 >> 2] = mtime % 1e3 * 1e3;
          tempI64 = [Math.floor(ctime / 1e3) >>> 0, (tempDouble = Math.floor(ctime / 1e3), +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 72 >> 2] = tempI64[0], HEAP32[buf + 76 >> 2] = tempI64[1];
          HEAPU32[buf + 80 >> 2] = ctime % 1e3 * 1e3;
          tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 88 >> 2] = tempI64[0], HEAP32[buf + 92 >> 2] = tempI64[1];
          return 0;
        }, doMsync(addr, stream, len, flags, offset) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          if (flags & 2) {
            return 0;
          }
          var buffer = HEAPU8.slice(addr, addr + len);
          FS.msync(stream, buffer, offset, len, flags);
        }, varargs: void 0, get() {
          var ret = HEAP32[+SYSCALLS.varargs >> 2];
          SYSCALLS.varargs += 4;
          return ret;
        }, getp() {
          return SYSCALLS.get();
        }, getStr(ptr) {
          var ret = UTF8ToString(ptr);
          return ret;
        }, getStreamFromFD(fd) {
          var stream = FS.getStreamChecked(fd);
          return stream;
        } };
        function ___syscall_fcntl64(fd, cmd, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (cmd) {
              case 0: {
                var arg = SYSCALLS.get();
                if (arg < 0) {
                  return -28;
                }
                while (FS.streams[arg]) {
                  arg++;
                }
                var newStream;
                newStream = FS.createStream(stream, arg);
                return newStream.fd;
              }
              case 1:
              case 2:
                return 0;
              case 3:
                return stream.flags;
              case 4: {
                var arg = SYSCALLS.get();
                stream.flags |= arg;
                return 0;
              }
              case 5: {
                var arg = SYSCALLS.getp();
                var offset = 0;
                HEAP16[arg + offset >> 1] = 2;
                return 0;
              }
              case 6:
              case 7:
                return 0;
              case 16:
              case 8:
                return -28;
              case 9:
                setErrNo(28);
                return -1;
              default: {
                return -28;
              }
            }
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        function ___syscall_getdents64(fd, dirp, count) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            if (!stream.getdents) {
              stream.getdents = FS.readdir(stream.path);
            }
            var struct_size = 280;
            var pos = 0;
            var off = FS.llseek(stream, 0, 1);
            var idx = Math.floor(off / struct_size);
            while (idx < stream.getdents.length && pos + struct_size <= count) {
              var id;
              var type;
              var name = stream.getdents[idx];
              if (name === ".") {
                id = stream.node.id;
                type = 4;
              } else if (name === "..") {
                var lookup = FS.lookupPath(stream.path, { parent: true });
                id = lookup.node.id;
                type = 4;
              } else {
                var child = FS.lookupNode(stream.node, name);
                id = child.id;
                type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8;
              }
              tempI64 = [id >>> 0, (tempDouble = id, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[dirp + pos >> 2] = tempI64[0], HEAP32[dirp + pos + 4 >> 2] = tempI64[1];
              tempI64 = [(idx + 1) * struct_size >>> 0, (tempDouble = (idx + 1) * struct_size, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[dirp + pos + 8 >> 2] = tempI64[0], HEAP32[dirp + pos + 12 >> 2] = tempI64[1];
              HEAP16[dirp + pos + 16 >> 1] = 280;
              HEAP8[dirp + pos + 18 >> 0] = type;
              stringToUTF8(name, dirp + pos + 19, 256);
              pos += struct_size;
              idx += 1;
            }
            FS.llseek(stream, idx * struct_size, 0);
            return pos;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_ioctl(fd, op, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            switch (op) {
              case 21509: {
                if (!stream.tty) return -59;
                return 0;
              }
              case 21505: {
                if (!stream.tty) return -59;
                if (stream.tty.ops.ioctl_tcgets) {
                  var termios = stream.tty.ops.ioctl_tcgets(stream);
                  var argp = SYSCALLS.getp();
                  HEAP32[argp >> 2] = termios.c_iflag || 0;
                  HEAP32[argp + 4 >> 2] = termios.c_oflag || 0;
                  HEAP32[argp + 8 >> 2] = termios.c_cflag || 0;
                  HEAP32[argp + 12 >> 2] = termios.c_lflag || 0;
                  for (var i = 0; i < 32; i++) {
                    HEAP8[argp + i + 17 >> 0] = termios.c_cc[i] || 0;
                  }
                  return 0;
                }
                return 0;
              }
              case 21510:
              case 21511:
              case 21512: {
                if (!stream.tty) return -59;
                return 0;
              }
              case 21506:
              case 21507:
              case 21508: {
                if (!stream.tty) return -59;
                if (stream.tty.ops.ioctl_tcsets) {
                  var argp = SYSCALLS.getp();
                  var c_iflag = HEAP32[argp >> 2];
                  var c_oflag = HEAP32[argp + 4 >> 2];
                  var c_cflag = HEAP32[argp + 8 >> 2];
                  var c_lflag = HEAP32[argp + 12 >> 2];
                  var c_cc = [];
                  for (var i = 0; i < 32; i++) {
                    c_cc.push(HEAP8[argp + i + 17 >> 0]);
                  }
                  return stream.tty.ops.ioctl_tcsets(stream.tty, op, { c_iflag, c_oflag, c_cflag, c_lflag, c_cc });
                }
                return 0;
              }
              case 21519: {
                if (!stream.tty) return -59;
                var argp = SYSCALLS.getp();
                HEAP32[argp >> 2] = 0;
                return 0;
              }
              case 21520: {
                if (!stream.tty) return -59;
                return -28;
              }
              case 21531: {
                var argp = SYSCALLS.getp();
                return FS.ioctl(stream, op, argp);
              }
              case 21523: {
                if (!stream.tty) return -59;
                if (stream.tty.ops.ioctl_tiocgwinsz) {
                  var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
                  var argp = SYSCALLS.getp();
                  HEAP16[argp >> 1] = winsize[0];
                  HEAP16[argp + 2 >> 1] = winsize[1];
                }
                return 0;
              }
              case 21524: {
                if (!stream.tty) return -59;
                return 0;
              }
              case 21515: {
                if (!stream.tty) return -59;
                return 0;
              }
              default:
                return -28;
            }
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_openat(dirfd, path, flags, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            var mode = varargs ? SYSCALLS.get() : 0;
            return FS.open(path, flags, mode).fd;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_rmdir(path) {
          try {
            path = SYSCALLS.getStr(path);
            FS.rmdir(path);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_stat64(path, buf) {
          try {
            path = SYSCALLS.getStr(path);
            return SYSCALLS.doStat(FS.stat, path, buf);
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        function ___syscall_unlinkat(dirfd, path, flags) {
          try {
            path = SYSCALLS.getStr(path);
            path = SYSCALLS.calculateAt(dirfd, path);
            if (flags === 0) {
              FS.unlink(path);
            } else if (flags === 512) {
              FS.rmdir(path);
            } else {
              abort("Invalid flags passed to unlinkat");
            }
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return -e.errno;
          }
        }
        var nowIsMonotonic = true;
        var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;
        var _abort = () => {
          abort("");
        };
        var _emscripten_date_now = () => Date.now();
        var _emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);
        var abortOnCannotGrowMemory = (requestedSize) => {
          abort("OOM");
        };
        var _emscripten_resize_heap = (requestedSize) => {
          HEAPU8.length;
          abortOnCannotGrowMemory();
        };
        var ENV = {};
        var getExecutableName = () => thisProgram || "./this.program";
        var getEnvStrings = () => {
          if (!getEnvStrings.strings) {
            var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
            var env = { "USER": "web_user", "LOGNAME": "web_user", "PATH": "/", "PWD": "/", "HOME": "/home/web_user", "LANG": lang, "_": getExecutableName() };
            for (var x in ENV) {
              if (ENV[x] === void 0) delete env[x];
              else env[x] = ENV[x];
            }
            var strings = [];
            for (var x in env) {
              strings.push(`${x}=${env[x]}`);
            }
            getEnvStrings.strings = strings;
          }
          return getEnvStrings.strings;
        };
        var stringToAscii = (str, buffer) => {
          for (var i = 0; i < str.length; ++i) {
            HEAP8[buffer++ >> 0] = str.charCodeAt(i);
          }
          HEAP8[buffer >> 0] = 0;
        };
        var _environ_get = (__environ, environ_buf) => {
          var bufSize = 0;
          getEnvStrings().forEach((string, i) => {
            var ptr = environ_buf + bufSize;
            HEAPU32[__environ + i * 4 >> 2] = ptr;
            stringToAscii(string, ptr);
            bufSize += string.length + 1;
          });
          return 0;
        };
        var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
          var strings = getEnvStrings();
          HEAPU32[penviron_count >> 2] = strings.length;
          var bufSize = 0;
          strings.forEach((string) => bufSize += string.length + 1);
          HEAPU32[penviron_buf_size >> 2] = bufSize;
          return 0;
        };
        var runtimeKeepaliveCounter = 0;
        var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
        var _proc_exit = (code) => {
          EXITSTATUS = code;
          if (!keepRuntimeAlive()) {
            if (Module["onExit"]) Module["onExit"](code);
            ABORT = true;
          }
          quit_(code, new ExitStatus(code));
        };
        var exitJS = (status, implicit) => {
          EXITSTATUS = status;
          _proc_exit(status);
        };
        var _exit = exitJS;
        function _fd_close(fd) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.close(stream);
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }
        var doReadv = (stream, iov, iovcnt, offset) => {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >> 2];
            var len = HEAPU32[iov + 4 >> 2];
            iov += 8;
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break;
          }
          return ret;
        };
        function _fd_read(fd, iov, iovcnt, pnum) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doReadv(stream, iov, iovcnt);
            HEAPU32[pnum >> 2] = num;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }
        var convertI32PairToI53Checked = (lo, hi) => hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
          var offset = convertI32PairToI53Checked(offset_low, offset_high);
          try {
            if (isNaN(offset)) return 61;
            var stream = SYSCALLS.getStreamFromFD(fd);
            FS.llseek(stream, offset, whence);
            tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
            if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }
        var doWritev = (stream, iov, iovcnt, offset) => {
          var ret = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >> 2];
            var len = HEAPU32[iov + 4 >> 2];
            iov += 8;
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
          }
          return ret;
        };
        function _fd_write(fd, iov, iovcnt, pnum) {
          try {
            var stream = SYSCALLS.getStreamFromFD(fd);
            var num = doWritev(stream, iov, iovcnt);
            HEAPU32[pnum >> 2] = num;
            return 0;
          } catch (e) {
            if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
            return e.errno;
          }
        }
        var isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        var arraySum = (array, index) => {
          var sum = 0;
          for (var i = 0; i <= index; sum += array[i++]) {
          }
          return sum;
        };
        var MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var addDays = (date, days) => {
          var newDate = new Date(date.getTime());
          while (days > 0) {
            var leap = isLeapYear(newDate.getFullYear());
            var currentMonth = newDate.getMonth();
            var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];
            if (days > daysInCurrentMonth - newDate.getDate()) {
              days -= daysInCurrentMonth - newDate.getDate() + 1;
              newDate.setDate(1);
              if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1);
              } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1);
              }
            } else {
              newDate.setDate(newDate.getDate() + days);
              return newDate;
            }
          }
          return newDate;
        };
        var writeArrayToMemory = (array, buffer) => {
          HEAP8.set(array, buffer);
        };
        var _strftime = (s, maxsize, format, tm) => {
          var tm_zone = HEAPU32[tm + 40 >> 2];
          var date = { tm_sec: HEAP32[tm >> 2], tm_min: HEAP32[tm + 4 >> 2], tm_hour: HEAP32[tm + 8 >> 2], tm_mday: HEAP32[tm + 12 >> 2], tm_mon: HEAP32[tm + 16 >> 2], tm_year: HEAP32[tm + 20 >> 2], tm_wday: HEAP32[tm + 24 >> 2], tm_yday: HEAP32[tm + 28 >> 2], tm_isdst: HEAP32[tm + 32 >> 2], tm_gmtoff: HEAP32[tm + 36 >> 2], tm_zone: tm_zone ? UTF8ToString(tm_zone) : "" };
          var pattern = UTF8ToString(format);
          var EXPANSION_RULES_1 = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
          for (var rule in EXPANSION_RULES_1) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
          }
          var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          function leadingSomething(value, digits, character) {
            var str = typeof value == "number" ? value.toString() : value || "";
            while (str.length < digits) {
              str = character[0] + str;
            }
            return str;
          }
          function leadingNulls(value, digits) {
            return leadingSomething(value, digits, "0");
          }
          function compareByDay(date1, date2) {
            function sgn(value) {
              return value < 0 ? -1 : value > 0 ? 1 : 0;
            }
            var compare;
            if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
              if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate());
              }
            }
            return compare;
          }
          function getFirstWeekStartDate(janFourth) {
            switch (janFourth.getDay()) {
              case 0:
                return new Date(janFourth.getFullYear() - 1, 11, 29);
              case 1:
                return janFourth;
              case 2:
                return new Date(janFourth.getFullYear(), 0, 3);
              case 3:
                return new Date(janFourth.getFullYear(), 0, 2);
              case 4:
                return new Date(janFourth.getFullYear(), 0, 1);
              case 5:
                return new Date(janFourth.getFullYear() - 1, 11, 31);
              case 6:
                return new Date(janFourth.getFullYear() - 1, 11, 30);
            }
          }
          function getWeekBasedYear(date2) {
            var thisDate = addDays(new Date(date2.tm_year + 1900, 0, 1), date2.tm_yday);
            var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
            var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
              if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1;
              }
              return thisDate.getFullYear();
            }
            return thisDate.getFullYear() - 1;
          }
          var EXPANSION_RULES_2 = { "%a": (date2) => WEEKDAYS[date2.tm_wday].substring(0, 3), "%A": (date2) => WEEKDAYS[date2.tm_wday], "%b": (date2) => MONTHS[date2.tm_mon].substring(0, 3), "%B": (date2) => MONTHS[date2.tm_mon], "%C": (date2) => {
            var year = date2.tm_year + 1900;
            return leadingNulls(year / 100 | 0, 2);
          }, "%d": (date2) => leadingNulls(date2.tm_mday, 2), "%e": (date2) => leadingSomething(date2.tm_mday, 2, " "), "%g": (date2) => getWeekBasedYear(date2).toString().substring(2), "%G": (date2) => getWeekBasedYear(date2), "%H": (date2) => leadingNulls(date2.tm_hour, 2), "%I": (date2) => {
            var twelveHour = date2.tm_hour;
            if (twelveHour == 0) twelveHour = 12;
            else if (twelveHour > 12) twelveHour -= 12;
            return leadingNulls(twelveHour, 2);
          }, "%j": (date2) => leadingNulls(date2.tm_mday + arraySum(isLeapYear(date2.tm_year + 1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date2.tm_mon - 1), 3), "%m": (date2) => leadingNulls(date2.tm_mon + 1, 2), "%M": (date2) => leadingNulls(date2.tm_min, 2), "%n": () => "\n", "%p": (date2) => {
            if (date2.tm_hour >= 0 && date2.tm_hour < 12) {
              return "AM";
            }
            return "PM";
          }, "%S": (date2) => leadingNulls(date2.tm_sec, 2), "%t": () => "	", "%u": (date2) => date2.tm_wday || 7, "%U": (date2) => {
            var days = date2.tm_yday + 7 - date2.tm_wday;
            return leadingNulls(Math.floor(days / 7), 2);
          }, "%V": (date2) => {
            var val = Math.floor((date2.tm_yday + 7 - (date2.tm_wday + 6) % 7) / 7);
            if ((date2.tm_wday + 371 - date2.tm_yday - 2) % 7 <= 2) {
              val++;
            }
            if (!val) {
              val = 52;
              var dec31 = (date2.tm_wday + 7 - date2.tm_yday - 1) % 7;
              if (dec31 == 4 || dec31 == 5 && isLeapYear(date2.tm_year % 400 - 1)) {
                val++;
              }
            } else if (val == 53) {
              var jan1 = (date2.tm_wday + 371 - date2.tm_yday) % 7;
              if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date2.tm_year))) val = 1;
            }
            return leadingNulls(val, 2);
          }, "%w": (date2) => date2.tm_wday, "%W": (date2) => {
            var days = date2.tm_yday + 7 - (date2.tm_wday + 6) % 7;
            return leadingNulls(Math.floor(days / 7), 2);
          }, "%y": (date2) => (date2.tm_year + 1900).toString().substring(2), "%Y": (date2) => date2.tm_year + 1900, "%z": (date2) => {
            var off = date2.tm_gmtoff;
            var ahead = off >= 0;
            off = Math.abs(off) / 60;
            off = off / 60 * 100 + off % 60;
            return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
          }, "%Z": (date2) => date2.tm_zone, "%%": () => "%" };
          pattern = pattern.replace(/%%/g, "\0\0");
          for (var rule in EXPANSION_RULES_2) {
            if (pattern.includes(rule)) {
              pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
            }
          }
          pattern = pattern.replace(/\0\0/g, "%");
          var bytes = intArrayFromString(pattern, false);
          if (bytes.length > maxsize) {
            return 0;
          }
          writeArrayToMemory(bytes, s);
          return bytes.length - 1;
        };
        var _strftime_l = (s, maxsize, format, tm, loc) => _strftime(s, maxsize, format, tm);
        var handleException = (e) => {
          if (e instanceof ExitStatus || e == "unwind") {
            return EXITSTATUS;
          }
          quit_(1, e);
        };
        var stringToUTF8OnStack = (str) => {
          var size = lengthBytesUTF8(str) + 1;
          var ret = stackAlloc(size);
          stringToUTF8(str, ret, size);
          return ret;
        };
        var FSNode = function(parent, name, mode, rdev) {
          if (!parent) {
            parent = this;
          }
          this.parent = parent;
          this.mount = parent.mount;
          this.mounted = null;
          this.id = FS.nextInode++;
          this.name = name;
          this.mode = mode;
          this.node_ops = {};
          this.stream_ops = {};
          this.rdev = rdev;
        };
        var readMode = 292 | 73;
        var writeMode = 146;
        Object.defineProperties(FSNode.prototype, { read: { get: function() {
          return (this.mode & readMode) === readMode;
        }, set: function(val) {
          val ? this.mode |= readMode : this.mode &= ~readMode;
        } }, write: { get: function() {
          return (this.mode & writeMode) === writeMode;
        }, set: function(val) {
          val ? this.mode |= writeMode : this.mode &= ~writeMode;
        } }, isFolder: { get: function() {
          return FS.isDir(this.mode);
        } }, isDevice: { get: function() {
          return FS.isChrdev(this.mode);
        } } });
        FS.FSNode = FSNode;
        FS.createPreloadedFile = FS_createPreloadedFile;
        FS.staticInit();
        Module["FS_createPath"] = FS.createPath;
        Module["FS_createDataFile"] = FS.createDataFile;
        Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
        Module["FS_unlink"] = FS.unlink;
        Module["FS_createLazyFile"] = FS.createLazyFile;
        Module["FS_createDevice"] = FS.createDevice;
        var wasmImports = { a: ___assert_fail, b: ___cxa_throw, e: ___syscall_fcntl64, r: ___syscall_getdents64, v: ___syscall_ioctl, f: ___syscall_openat, p: ___syscall_rmdir, o: ___syscall_stat64, q: ___syscall_unlinkat, j: __emscripten_get_now_is_monotonic, h: _abort, g: _emscripten_date_now, k: _emscripten_memcpy_js, n: _emscripten_resize_heap, s: _environ_get, t: _environ_sizes_get, d: _exit, c: _fd_close, u: _fd_read, l: _fd_seek, i: _fd_write, m: _strftime_l };
        var wasmExports = createWasm();
        var _main = Module["_main"] = (a0, a1) => (_main = Module["_main"] = wasmExports["y"])(a0, a1);
        var ___errno_location = () => (___errno_location = wasmExports["z"])();
        var stackAlloc = (a0) => (stackAlloc = wasmExports["B"])(a0);
        var ___cxa_is_pointer_type = (a0) => (___cxa_is_pointer_type = wasmExports["C"])(a0);
        Module["addRunDependency"] = addRunDependency;
        Module["removeRunDependency"] = removeRunDependency;
        Module["FS_createPath"] = FS.createPath;
        Module["FS_createLazyFile"] = FS.createLazyFile;
        Module["FS_createDevice"] = FS.createDevice;
        Module["callMain"] = callMain;
        Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
        Module["FS"] = FS;
        Module["FS_createDataFile"] = FS.createDataFile;
        Module["FS_unlink"] = FS.unlink;
        var calledRun;
        dependenciesFulfilled = function runCaller() {
          if (!calledRun) run();
          if (!calledRun) dependenciesFulfilled = runCaller;
        };
        function callMain(args = []) {
          var entryFunction = _main;
          args.unshift(thisProgram);
          var argc = args.length;
          var argv = stackAlloc((argc + 1) * 4);
          var argv_ptr = argv;
          args.forEach((arg) => {
            HEAPU32[argv_ptr >> 2] = stringToUTF8OnStack(arg);
            argv_ptr += 4;
          });
          HEAPU32[argv_ptr >> 2] = 0;
          try {
            var ret = entryFunction(argc, argv);
            exitJS(ret, true);
            return ret;
          } catch (e) {
            return handleException(e);
          }
        }
        function run(args = arguments_) {
          if (runDependencies > 0) {
            return;
          }
          preRun();
          if (runDependencies > 0) {
            return;
          }
          function doRun() {
            if (calledRun) return;
            calledRun = true;
            Module["calledRun"] = true;
            if (ABORT) return;
            initRuntime();
            preMain();
            readyPromiseResolve(Module);
            if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
            if (shouldRunNow) callMain(args);
            postRun();
          }
          if (Module["setStatus"]) {
            Module["setStatus"]("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module["setStatus"]("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
        }
        if (Module["preInit"]) {
          if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
          while (Module["preInit"].length > 0) {
            Module["preInit"].pop()();
          }
        }
        var shouldRunNow = false;
        if (Module["noInitialRun"]) shouldRunNow = false;
        run();
        return moduleArg.ready;
      };
    })();
  }
});

// vendor/piper/ort.wasm.esm.min.js
var ort_wasm_esm_min_exports = {};
__export(ort_wasm_esm_min_exports, {
  InferenceSession: () => xa,
  TRACE: () => yn,
  TRACE_FUNC_BEGIN: () => Je,
  TRACE_FUNC_END: () => Ze,
  Tensor: () => me,
  TrainingSession: () => Da,
  default: () => Ni,
  env: () => j,
  registerBackend: () => yt
});
var tr, Aa, Sa, Ma, H, rt, gt, Ca, nt, Rt, Ve, yt, Pa, Dt, Ut, Zr, Qr, Kr, en, _e, rr, j, tn, rn, nn, an, nr, on, sn, un, fn, ln, Xe, wt, cn, dn, pn, mn, hn, gn, ye, Ft, me, It, yn, wn, Je, Ze, ar, Bt, bn, xa, vn, On, En, _n, Tn, Ra, Lt, An, Da, Sn, or, Qe, ir, Ua, Fa, Cn, sr, ur, Ia, fr, Rn, Dn, Un, Fn, Ba, In, kn, Nn, Hn, ka, dr, pr, kt, Wn, Na, Wa, Ha, $n, ee, at, q, bt, V, Nt, Gn, jn, $a, Ga, ja, za, zn, Yn, mr, qn, hr, Vn, Xn, Wt, Jn, gr, vt, yr, Ya, Qn, Kn, ot, qa, wr, ea, ta, Zn, ra, na, aa, oa, ia, Ke, Te, Ot, $t, Gt, br, vr, it, st, Ja, Ht, sa, ua, fa, la, ca, da, pa, Or, ma, Za, jt, ha, Qa, zt, ga, ya, Ka, wa, Mn, Ni;
var init_ort_wasm_esm_min = __esm({
  "vendor/piper/ort.wasm.esm.min.js"() {
    tr = Object.defineProperty;
    Aa = Object.getOwnPropertyDescriptor;
    Sa = Object.getOwnPropertyNames;
    Ma = Object.prototype.hasOwnProperty;
    H = (r, t) => () => (r && (t = r(r = 0)), t);
    rt = (r, t) => () => (t || r((t = { exports: {} }).exports, t), t.exports);
    gt = (r, t) => {
      for (var n in t) tr(r, n, { get: t[n], enumerable: true });
    };
    Ca = (r, t, n, f) => {
      if (t && typeof t == "object" || typeof t == "function") for (let i of Sa(t)) !Ma.call(r, i) && i !== n && tr(r, i, { get: () => t[i], enumerable: !(f = Aa(t, i)) || f.enumerable });
      return r;
    };
    nt = (r) => Ca(tr({}, "__esModule", { value: true }), r);
    Ut = H(() => {
      "use strict";
      Rt = /* @__PURE__ */ new Map(), Ve = [], yt = (r, t, n) => {
        if (t && typeof t.init == "function" && typeof t.createInferenceSessionHandler == "function") {
          let f = Rt.get(r);
          if (f === void 0) Rt.set(r, { backend: t, priority: n });
          else {
            if (f.priority > n) return;
            if (f.priority === n && f.backend !== t) throw new Error(`cannot register backend "${r}" using priority ${n}`);
          }
          if (n >= 0) {
            let i = Ve.indexOf(r);
            i !== -1 && Ve.splice(i, 1);
            for (let m = 0; m < Ve.length; m++) if (Rt.get(Ve[m]).priority <= n) {
              Ve.splice(m, 0, r);
              return;
            }
            Ve.push(r);
          }
          return;
        }
        throw new TypeError("not a valid backend");
      }, Pa = async (r) => {
        let t = Rt.get(r);
        if (!t) return "backend not found.";
        if (t.initialized) return t.backend;
        if (t.aborted) return t.error;
        {
          let n = !!t.initPromise;
          try {
            return n || (t.initPromise = t.backend.init(r)), await t.initPromise, t.initialized = true, t.backend;
          } catch (f) {
            return n || (t.error = `${f}`, t.aborted = true), t.error;
          } finally {
            delete t.initPromise;
          }
        }
      }, Dt = async (r) => {
        let t = r.executionProviders || [], n = t.map((h) => typeof h == "string" ? h : h.name), f = n.length === 0 ? Ve : n, i, m = [], c = /* @__PURE__ */ new Set();
        for (let h of f) {
          let g = await Pa(h);
          typeof g == "string" ? m.push({ name: h, err: g }) : (i || (i = g), i === g && c.add(h));
        }
        if (!i) throw new Error(`no available backend found. ERR: ${m.map((h) => `[${h.name}] ${h.err}`).join(", ")}`);
        for (let { name: h, err: g } of m) n.includes(h) && console.warn(`removing requested execution provider "${h}" from session options because it is not available: ${g}`);
        let s = t.filter((h) => c.has(typeof h == "string" ? h : h.name));
        return [i, new Proxy(r, { get: (h, g) => g === "executionProviders" ? s : Reflect.get(h, g) })];
      };
    });
    Zr = H(() => {
      "use strict";
      Ut();
    });
    Kr = H(() => {
      "use strict";
      Qr = "1.18.0";
    });
    rr = H(() => {
      "use strict";
      Kr();
      en = "warning", _e = { wasm: {}, webgl: {}, webgpu: {}, versions: { common: Qr }, set logLevel(r) {
        if (r !== void 0) {
          if (typeof r != "string" || ["verbose", "info", "warning", "error", "fatal"].indexOf(r) === -1) throw new Error(`Unsupported logging level: ${r}`);
          en = r;
        }
      }, get logLevel() {
        return en;
      } };
      Object.defineProperty(_e, "logLevel", { enumerable: true });
    });
    tn = H(() => {
      "use strict";
      rr();
      j = _e;
    });
    an = H(() => {
      "use strict";
      rn = (r, t) => {
        let n = typeof document < "u" ? document.createElement("canvas") : new OffscreenCanvas(1, 1);
        n.width = r.dims[3], n.height = r.dims[2];
        let f = n.getContext("2d");
        if (f != null) {
          let i, m;
          t?.tensorLayout !== void 0 && t.tensorLayout === "NHWC" ? (i = r.dims[2], m = r.dims[3]) : (i = r.dims[3], m = r.dims[2]);
          let c = t?.format !== void 0 ? t.format : "RGB", s = t?.norm, h, g;
          s === void 0 || s.mean === void 0 ? h = [255, 255, 255, 255] : typeof s.mean == "number" ? h = [s.mean, s.mean, s.mean, s.mean] : (h = [s.mean[0], s.mean[1], s.mean[2], 0], s.mean[3] !== void 0 && (h[3] = s.mean[3])), s === void 0 || s.bias === void 0 ? g = [0, 0, 0, 0] : typeof s.bias == "number" ? g = [s.bias, s.bias, s.bias, s.bias] : (g = [s.bias[0], s.bias[1], s.bias[2], 0], s.bias[3] !== void 0 && (g[3] = s.bias[3]));
          let _ = m * i, v = 0, O = _, M = _ * 2, P = -1;
          c === "RGBA" ? (v = 0, O = _, M = _ * 2, P = _ * 3) : c === "RGB" ? (v = 0, O = _, M = _ * 2) : c === "RBG" && (v = 0, M = _, O = _ * 2);
          for (let U = 0; U < m; U++) for (let D = 0; D < i; D++) {
            let C = (r.data[v++] - g[0]) * h[0], F = (r.data[O++] - g[1]) * h[1], W = (r.data[M++] - g[2]) * h[2], Z = P === -1 ? 255 : (r.data[P++] - g[3]) * h[3];
            f.fillStyle = "rgba(" + C + "," + F + "," + W + "," + Z + ")", f.fillRect(D, U, 1, 1);
          }
          if ("toDataURL" in n) return n.toDataURL();
          throw new Error("toDataURL is not supported");
        } else throw new Error("Can not access image data");
      }, nn = (r, t) => {
        let n = typeof document < "u" ? document.createElement("canvas").getContext("2d") : new OffscreenCanvas(1, 1).getContext("2d"), f;
        if (n != null) {
          let i, m, c;
          t?.tensorLayout !== void 0 && t.tensorLayout === "NHWC" ? (i = r.dims[2], m = r.dims[1], c = r.dims[3]) : (i = r.dims[3], m = r.dims[2], c = r.dims[1]);
          let s = t !== void 0 && t.format !== void 0 ? t.format : "RGB", h = t?.norm, g, _;
          h === void 0 || h.mean === void 0 ? g = [255, 255, 255, 255] : typeof h.mean == "number" ? g = [h.mean, h.mean, h.mean, h.mean] : (g = [h.mean[0], h.mean[1], h.mean[2], 255], h.mean[3] !== void 0 && (g[3] = h.mean[3])), h === void 0 || h.bias === void 0 ? _ = [0, 0, 0, 0] : typeof h.bias == "number" ? _ = [h.bias, h.bias, h.bias, h.bias] : (_ = [h.bias[0], h.bias[1], h.bias[2], 0], h.bias[3] !== void 0 && (_[3] = h.bias[3]));
          let v = m * i;
          if (t !== void 0 && (t.format !== void 0 && c === 4 && t.format !== "RGBA" || c === 3 && t.format !== "RGB" && t.format !== "BGR")) throw new Error("Tensor format doesn't match input tensor dims");
          let O = 4, M = 0, P = 1, U = 2, D = 3, C = 0, F = v, W = v * 2, Z = -1;
          s === "RGBA" ? (C = 0, F = v, W = v * 2, Z = v * 3) : s === "RGB" ? (C = 0, F = v, W = v * 2) : s === "RBG" && (C = 0, W = v, F = v * 2), f = n.createImageData(i, m);
          for (let te = 0; te < m * i; M += O, P += O, U += O, D += O, te++) f.data[M] = (r.data[C++] - _[0]) * g[0], f.data[P] = (r.data[F++] - _[1]) * g[1], f.data[U] = (r.data[W++] - _[2]) * g[2], f.data[D] = Z === -1 ? 255 : (r.data[Z++] - _[3]) * g[3];
        } else throw new Error("Can not access image data");
        return f;
      };
    });
    ln = H(() => {
      "use strict";
      Ft();
      nr = (r, t) => {
        if (r === void 0) throw new Error("Image buffer must be defined");
        if (t.height === void 0 || t.width === void 0) throw new Error("Image height and width must be defined");
        if (t.tensorLayout === "NHWC") throw new Error("NHWC Tensor layout is not supported yet");
        let { height: n, width: f } = t, i = t.norm ?? { mean: 255, bias: 0 }, m, c;
        typeof i.mean == "number" ? m = [i.mean, i.mean, i.mean, i.mean] : m = [i.mean[0], i.mean[1], i.mean[2], i.mean[3] ?? 255], typeof i.bias == "number" ? c = [i.bias, i.bias, i.bias, i.bias] : c = [i.bias[0], i.bias[1], i.bias[2], i.bias[3] ?? 0];
        let s = t.format !== void 0 ? t.format : "RGBA", h = t.tensorFormat !== void 0 && t.tensorFormat !== void 0 ? t.tensorFormat : "RGB", g = n * f, _ = h === "RGBA" ? new Float32Array(g * 4) : new Float32Array(g * 3), v = 4, O = 0, M = 1, P = 2, U = 3, D = 0, C = g, F = g * 2, W = -1;
        s === "RGB" && (v = 3, O = 0, M = 1, P = 2, U = -1), h === "RGBA" ? W = g * 3 : h === "RBG" ? (D = 0, F = g, C = g * 2) : h === "BGR" && (F = 0, C = g, D = g * 2);
        for (let te = 0; te < g; te++, O += v, P += v, M += v, U += v) _[D++] = (r[O] + c[0]) / m[0], _[C++] = (r[M] + c[1]) / m[1], _[F++] = (r[P] + c[2]) / m[2], W !== -1 && U !== -1 && (_[W++] = (r[U] + c[3]) / m[3]);
        return h === "RGBA" ? new ye("float32", _, [1, 4, n, f]) : new ye("float32", _, [1, 3, n, f]);
      }, on = async (r, t) => {
        let n = typeof HTMLImageElement < "u" && r instanceof HTMLImageElement, f = typeof ImageData < "u" && r instanceof ImageData, i = typeof ImageBitmap < "u" && r instanceof ImageBitmap, m = typeof r == "string", c, s = t ?? {}, h = () => {
          if (typeof document < "u") return document.createElement("canvas");
          if (typeof OffscreenCanvas < "u") return new OffscreenCanvas(1, 1);
          throw new Error("Canvas is not supported");
        }, g = (_) => _ instanceof HTMLCanvasElement || _ instanceof OffscreenCanvas ? _.getContext("2d") : null;
        if (n) {
          let _ = h();
          _.width = r.width, _.height = r.height;
          let v = g(_);
          if (v != null) {
            let O = r.height, M = r.width;
            if (t !== void 0 && t.resizedHeight !== void 0 && t.resizedWidth !== void 0 && (O = t.resizedHeight, M = t.resizedWidth), t !== void 0) {
              if (s = t, t.tensorFormat !== void 0) throw new Error("Image input config format must be RGBA for HTMLImageElement");
              s.tensorFormat = "RGBA", s.height = O, s.width = M;
            } else s.tensorFormat = "RGBA", s.height = O, s.width = M;
            v.drawImage(r, 0, 0), c = v.getImageData(0, 0, M, O).data;
          } else throw new Error("Can not access image data");
        } else if (f) {
          let _, v;
          if (t !== void 0 && t.resizedWidth !== void 0 && t.resizedHeight !== void 0 ? (_ = t.resizedHeight, v = t.resizedWidth) : (_ = r.height, v = r.width), t !== void 0 && (s = t), s.format = "RGBA", s.height = _, s.width = v, t !== void 0) {
            let O = h();
            O.width = v, O.height = _;
            let M = g(O);
            if (M != null) M.putImageData(r, 0, 0), c = M.getImageData(0, 0, v, _).data;
            else throw new Error("Can not access image data");
          } else c = r.data;
        } else if (i) {
          if (t === void 0) throw new Error("Please provide image config with format for Imagebitmap");
          let _ = h();
          _.width = r.width, _.height = r.height;
          let v = g(_);
          if (v != null) {
            let O = r.height, M = r.width;
            return v.drawImage(r, 0, 0, M, O), c = v.getImageData(0, 0, M, O).data, s.height = O, s.width = M, nr(c, s);
          } else throw new Error("Can not access image data");
        } else {
          if (m) return new Promise((_, v) => {
            let O = h(), M = g(O);
            if (!r || !M) return v();
            let P = new Image();
            P.crossOrigin = "Anonymous", P.src = r, P.onload = () => {
              O.width = P.width, O.height = P.height, M.drawImage(P, 0, 0, O.width, O.height);
              let U = M.getImageData(0, 0, O.width, O.height);
              s.height = O.height, s.width = O.width, _(nr(U.data, s));
            };
          });
          throw new Error("Input data provided is not supported - aborted tensor creation");
        }
        if (c !== void 0) return nr(c, s);
        throw new Error("Input data provided is not supported - aborted tensor creation");
      }, sn = (r, t) => {
        let { width: n, height: f, download: i, dispose: m } = t, c = [1, f, n, 4];
        return new ye({ location: "texture", type: "float32", texture: r, dims: c, download: i, dispose: m });
      }, un = (r, t) => {
        let { dataType: n, dims: f, download: i, dispose: m } = t;
        return new ye({ location: "gpu-buffer", type: n ?? "float32", gpuBuffer: r, dims: f, download: i, dispose: m });
      }, fn = (r, t, n) => new ye({ location: "cpu-pinned", type: r, data: t, dims: n ?? [t.length] });
    });
    pn = H(() => {
      "use strict";
      Xe = /* @__PURE__ */ new Map([["float32", Float32Array], ["uint8", Uint8Array], ["int8", Int8Array], ["uint16", Uint16Array], ["int16", Int16Array], ["int32", Int32Array], ["bool", Uint8Array], ["float64", Float64Array], ["uint32", Uint32Array]]), wt = /* @__PURE__ */ new Map([[Float32Array, "float32"], [Uint8Array, "uint8"], [Int8Array, "int8"], [Uint16Array, "uint16"], [Int16Array, "int16"], [Int32Array, "int32"], [Float64Array, "float64"], [Uint32Array, "uint32"]]), cn = false, dn = () => {
        if (!cn) {
          cn = true;
          let r = typeof BigInt64Array < "u" && BigInt64Array.from, t = typeof BigUint64Array < "u" && BigUint64Array.from, n = typeof Float16Array < "u" && Float16Array.from;
          r && (Xe.set("int64", BigInt64Array), wt.set(BigInt64Array, "int64")), t && (Xe.set("uint64", BigUint64Array), wt.set(BigUint64Array, "uint64")), n ? (Xe.set("float16", Float16Array), wt.set(Float16Array, "float16")) : Xe.set("float16", Uint16Array);
        }
      };
    });
    gn = H(() => {
      "use strict";
      Ft();
      mn = (r) => {
        let t = 1;
        for (let n = 0; n < r.length; n++) {
          let f = r[n];
          if (typeof f != "number" || !Number.isSafeInteger(f)) throw new TypeError(`dims[${n}] must be an integer, got: ${f}`);
          if (f < 0) throw new RangeError(`dims[${n}] must be a non-negative integer, got: ${f}`);
          t *= f;
        }
        return t;
      }, hn = (r, t) => {
        switch (r.location) {
          case "cpu":
            return new ye(r.type, r.data, t);
          case "cpu-pinned":
            return new ye({ location: "cpu-pinned", data: r.data, type: r.type, dims: t });
          case "texture":
            return new ye({ location: "texture", texture: r.texture, type: r.type, dims: t });
          case "gpu-buffer":
            return new ye({ location: "gpu-buffer", gpuBuffer: r.gpuBuffer, type: r.type, dims: t });
          default:
            throw new Error(`tensorReshape: tensor location ${r.location} is not supported`);
        }
      };
    });
    Ft = H(() => {
      "use strict";
      an();
      ln();
      pn();
      gn();
      ye = class {
        constructor(t, n, f) {
          dn();
          let i, m;
          if (typeof t == "object" && "location" in t) switch (this.dataLocation = t.location, i = t.type, m = t.dims, t.location) {
            case "cpu-pinned": {
              let s = Xe.get(i);
              if (!s) throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);
              if (!(t.data instanceof s)) throw new TypeError(`buffer should be of type ${s.name}`);
              this.cpuData = t.data;
              break;
            }
            case "texture": {
              if (i !== "float32") throw new TypeError(`unsupported type "${i}" to create tensor from texture`);
              this.gpuTextureData = t.texture, this.downloader = t.download, this.disposer = t.dispose;
              break;
            }
            case "gpu-buffer": {
              if (i !== "float32" && i !== "float16" && i !== "int32" && i !== "int64" && i !== "uint32" && i !== "uint8" && i !== "bool") throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);
              this.gpuBufferData = t.gpuBuffer, this.downloader = t.download, this.disposer = t.dispose;
              break;
            }
            default:
              throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`);
          }
          else {
            let s, h;
            if (typeof t == "string") if (i = t, h = f, t === "string") {
              if (!Array.isArray(n)) throw new TypeError("A string tensor's data must be a string array.");
              s = n;
            } else {
              let g = Xe.get(t);
              if (g === void 0) throw new TypeError(`Unsupported tensor type: ${t}.`);
              if (Array.isArray(n)) {
                if (t === "float16" && g === Uint16Array) throw new TypeError("Creating a float16 tensor from number array is not supported. Please use Uint16Array as data.");
                t === "uint64" || t === "int64" ? s = g.from(n, BigInt) : s = g.from(n);
              } else if (n instanceof g) s = n;
              else throw new TypeError(`A ${i} tensor's data must be type of ${g}`);
            }
            else if (h = n, Array.isArray(t)) {
              if (t.length === 0) throw new TypeError("Tensor type cannot be inferred from an empty array.");
              let g = typeof t[0];
              if (g === "string") i = "string", s = t;
              else if (g === "boolean") i = "bool", s = Uint8Array.from(t);
              else throw new TypeError(`Invalid element type of data array: ${g}.`);
            } else {
              let g = wt.get(t.constructor);
              if (g === void 0) throw new TypeError(`Unsupported type for tensor data: ${t.constructor}.`);
              i = g, s = t;
            }
            if (h === void 0) h = [s.length];
            else if (!Array.isArray(h)) throw new TypeError("A tensor's dims must be a number array");
            m = h, this.cpuData = s, this.dataLocation = "cpu";
          }
          let c = mn(m);
          if (this.cpuData && c !== this.cpuData.length) throw new Error(`Tensor's size(${c}) does not match data length(${this.cpuData.length}).`);
          this.type = i, this.dims = m, this.size = c;
        }
        static async fromImage(t, n) {
          return on(t, n);
        }
        static fromTexture(t, n) {
          return sn(t, n);
        }
        static fromGpuBuffer(t, n) {
          return un(t, n);
        }
        static fromPinnedBuffer(t, n, f) {
          return fn(t, n, f);
        }
        toDataURL(t) {
          return rn(this, t);
        }
        toImageData(t) {
          return nn(this, t);
        }
        get data() {
          if (this.ensureValid(), !this.cpuData) throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");
          return this.cpuData;
        }
        get location() {
          return this.dataLocation;
        }
        get texture() {
          if (this.ensureValid(), !this.gpuTextureData) throw new Error("The data is not stored as a WebGL texture.");
          return this.gpuTextureData;
        }
        get gpuBuffer() {
          if (this.ensureValid(), !this.gpuBufferData) throw new Error("The data is not stored as a WebGPU buffer.");
          return this.gpuBufferData;
        }
        async getData(t) {
          switch (this.ensureValid(), this.dataLocation) {
            case "cpu":
            case "cpu-pinned":
              return this.data;
            case "texture":
            case "gpu-buffer": {
              if (!this.downloader) throw new Error("The current tensor is not created with a specified data downloader.");
              if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
              try {
                this.isDownloading = true;
                let n = await this.downloader();
                return this.downloader = void 0, this.dataLocation = "cpu", this.cpuData = n, t && this.disposer && (this.disposer(), this.disposer = void 0), n;
              } finally {
                this.isDownloading = false;
              }
            }
            default:
              throw new Error(`cannot get data from location: ${this.dataLocation}`);
          }
        }
        dispose() {
          if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
          this.disposer && (this.disposer(), this.disposer = void 0), this.cpuData = void 0, this.gpuTextureData = void 0, this.gpuBufferData = void 0, this.downloader = void 0, this.isDownloading = void 0, this.dataLocation = "none";
        }
        ensureValid() {
          if (this.dataLocation === "none") throw new Error("The tensor is disposed.");
        }
        reshape(t) {
          if (this.ensureValid(), this.downloader || this.disposer) throw new Error("Cannot reshape a tensor that owns GPU resource.");
          return hn(this, t);
        }
      };
    });
    It = H(() => {
      "use strict";
      Ft();
      me = ye;
    });
    ar = H(() => {
      "use strict";
      rr();
      yn = (r, t) => {
        (typeof _e.trace > "u" ? !_e.wasm.trace : !_e.trace) || console.timeStamp(`${r}::ORT::${t}`);
      }, wn = (r, t) => {
        let n = new Error().stack?.split(/\r\n|\r|\n/g) || [], f = false;
        for (let i = 0; i < n.length; i++) {
          if (f && !n[i].includes("TRACE_FUNC")) {
            let m = `FUNC_${r}::${n[i].trim().split(" ")[1]}`;
            t && (m += `::${t}`), yn("CPU", m);
            return;
          }
          n[i].includes("TRACE_FUNC") && (f = true);
        }
      }, Je = (r) => {
        (typeof _e.trace > "u" ? !_e.wasm.trace : !_e.trace) || wn("BEGIN", r);
      }, Ze = (r) => {
        (typeof _e.trace > "u" ? !_e.wasm.trace : !_e.trace) || wn("END", r);
      };
    });
    bn = H(() => {
      "use strict";
      Ut();
      It();
      ar();
      Bt = class r {
        constructor(t) {
          this.handler = t;
        }
        async run(t, n, f) {
          Je();
          let i = {}, m = {};
          if (typeof t != "object" || t === null || t instanceof me || Array.isArray(t)) throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");
          let c = true;
          if (typeof n == "object") {
            if (n === null) throw new TypeError("Unexpected argument[1]: cannot be null.");
            if (n instanceof me) throw new TypeError("'fetches' cannot be a Tensor");
            if (Array.isArray(n)) {
              if (n.length === 0) throw new TypeError("'fetches' cannot be an empty array.");
              c = false;
              for (let g of n) {
                if (typeof g != "string") throw new TypeError("'fetches' must be a string array or an object.");
                if (this.outputNames.indexOf(g) === -1) throw new RangeError(`'fetches' contains invalid output name: ${g}.`);
                i[g] = null;
              }
              if (typeof f == "object" && f !== null) m = f;
              else if (typeof f < "u") throw new TypeError("'options' must be an object.");
            } else {
              let g = false, _ = Object.getOwnPropertyNames(n);
              for (let v of this.outputNames) if (_.indexOf(v) !== -1) {
                let O = n[v];
                (O === null || O instanceof me) && (g = true, c = false, i[v] = O);
              }
              if (g) {
                if (typeof f == "object" && f !== null) m = f;
                else if (typeof f < "u") throw new TypeError("'options' must be an object.");
              } else m = n;
            }
          } else if (typeof n < "u") throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");
          for (let g of this.inputNames) if (typeof t[g] > "u") throw new Error(`input '${g}' is missing in 'feeds'.`);
          if (c) for (let g of this.outputNames) i[g] = null;
          let s = await this.handler.run(t, i, m), h = {};
          for (let g in s) if (Object.hasOwnProperty.call(s, g)) {
            let _ = s[g];
            _ instanceof me ? h[g] = _ : h[g] = new me(_.type, _.data, _.dims);
          }
          return Ze(), h;
        }
        async release() {
          return this.handler.dispose();
        }
        static async create(t, n, f, i) {
          Je();
          let m, c = {};
          if (typeof t == "string") {
            if (m = t, typeof n == "object" && n !== null) c = n;
            else if (typeof n < "u") throw new TypeError("'options' must be an object.");
          } else if (t instanceof Uint8Array) {
            if (m = t, typeof n == "object" && n !== null) c = n;
            else if (typeof n < "u") throw new TypeError("'options' must be an object.");
          } else if (t instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && t instanceof SharedArrayBuffer) {
            let _ = t, v = 0, O = t.byteLength;
            if (typeof n == "object" && n !== null) c = n;
            else if (typeof n == "number") {
              if (v = n, !Number.isSafeInteger(v)) throw new RangeError("'byteOffset' must be an integer.");
              if (v < 0 || v >= _.byteLength) throw new RangeError(`'byteOffset' is out of range [0, ${_.byteLength}).`);
              if (O = t.byteLength - v, typeof f == "number") {
                if (O = f, !Number.isSafeInteger(O)) throw new RangeError("'byteLength' must be an integer.");
                if (O <= 0 || v + O > _.byteLength) throw new RangeError(`'byteLength' is out of range (0, ${_.byteLength - v}].`);
                if (typeof i == "object" && i !== null) c = i;
                else if (typeof i < "u") throw new TypeError("'options' must be an object.");
              } else if (typeof f < "u") throw new TypeError("'byteLength' must be a number.");
            } else if (typeof n < "u") throw new TypeError("'options' must be an object.");
            m = new Uint8Array(_, v, O);
          } else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");
          let [s, h] = await Dt(c), g = await s.createInferenceSessionHandler(m, h);
          return Ze(), new r(g);
        }
        startProfiling() {
          this.handler.startProfiling();
        }
        endProfiling() {
          this.handler.endProfiling();
        }
        get inputNames() {
          return this.handler.inputNames;
        }
        get outputNames() {
          return this.handler.outputNames;
        }
      };
    });
    vn = H(() => {
      "use strict";
      bn();
      xa = Bt;
    });
    On = H(() => {
      "use strict";
    });
    En = H(() => {
      "use strict";
    });
    _n = H(() => {
      "use strict";
    });
    Tn = H(() => {
      "use strict";
    });
    An = H(() => {
      "use strict";
      Ut();
      It();
      Ra = "Training backend could not be resolved. Make sure you're using the correct configuration & WebAssembly files.", Lt = class r {
        constructor(t, n, f) {
          this.handler = t, this.hasOptimizerModel = n, this.hasEvalModel = f;
        }
        get trainingInputNames() {
          return this.handler.inputNames;
        }
        get trainingOutputNames() {
          return this.handler.outputNames;
        }
        get evalInputNames() {
          if (this.hasEvalModel) return this.handler.evalInputNames;
          throw new Error("This training session has no evalModel loaded.");
        }
        get evalOutputNames() {
          if (this.hasEvalModel) return this.handler.evalOutputNames;
          throw new Error("This training session has no evalModel loaded.");
        }
        static async create(t, n) {
          let f = t.evalModel || "", i = t.optimizerModel || "", m = n || {}, [c, s] = await Dt(m);
          if (c.createTrainingSessionHandler) {
            let h = await c.createTrainingSessionHandler(t.checkpointState, t.trainModel, f, i, s);
            return new r(h, !!t.optimizerModel, !!t.evalModel);
          } else throw new Error(Ra);
        }
        typeNarrowingForRunStep(t, n, f, i, m) {
          let c = {}, s = {};
          if (typeof f != "object" || f === null || f instanceof me || Array.isArray(f)) throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");
          let h = true;
          if (typeof i == "object") {
            if (i === null) throw new TypeError("Unexpected argument[1]: cannot be null.");
            if (i instanceof me) throw new TypeError("'fetches' cannot be a Tensor");
            if (Array.isArray(i)) {
              if (i.length === 0) throw new TypeError("'fetches' cannot be an empty array.");
              h = false;
              for (let g of i) {
                if (typeof g != "string") throw new TypeError("'fetches' must be a string array or an object.");
                if (n.indexOf(g) === -1) throw new RangeError(`'fetches' contains invalid output name: ${g}.`);
                c[g] = null;
              }
              if (typeof m == "object" && m !== null) s = m;
              else if (typeof m < "u") throw new TypeError("'options' must be an object.");
            } else {
              let g = false, _ = Object.getOwnPropertyNames(i);
              for (let v of n) if (_.indexOf(v) !== -1) {
                let O = i[v];
                (O === null || O instanceof me) && (g = true, h = false, c[v] = O);
              }
              if (g) {
                if (typeof m == "object" && m !== null) s = m;
                else if (typeof m < "u") throw new TypeError("'options' must be an object.");
              } else s = i;
            }
          } else if (typeof i < "u") throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");
          for (let g of t) if (typeof f[g] > "u") throw new Error(`input '${g}' is missing in 'feeds'.`);
          if (h) for (let g of n) c[g] = null;
          return [c, s];
        }
        convertHandlerReturnTypeToMapOfTensors(t) {
          let n = {};
          for (let f in t) if (Object.hasOwnProperty.call(t, f)) {
            let i = t[f];
            i instanceof me ? n[f] = i : n[f] = new me(i.type, i.data, i.dims);
          }
          return n;
        }
        async lazyResetGrad() {
          await this.handler.lazyResetGrad();
        }
        async runTrainStep(t, n, f) {
          let [i, m] = this.typeNarrowingForRunStep(this.trainingInputNames, this.trainingOutputNames, t, n, f), c = await this.handler.runTrainStep(t, i, m);
          return this.convertHandlerReturnTypeToMapOfTensors(c);
        }
        async runOptimizerStep(t) {
          if (this.hasOptimizerModel) await this.handler.runOptimizerStep(t || {});
          else throw new Error("This TrainingSession has no OptimizerModel loaded.");
        }
        async runEvalStep(t, n, f) {
          if (this.hasEvalModel) {
            let [i, m] = this.typeNarrowingForRunStep(this.evalInputNames, this.evalOutputNames, t, n, f), c = await this.handler.runEvalStep(t, i, m);
            return this.convertHandlerReturnTypeToMapOfTensors(c);
          } else throw new Error("This TrainingSession has no EvalModel loaded.");
        }
        async getParametersSize(t = true) {
          return this.handler.getParametersSize(t);
        }
        async loadParametersBuffer(t, n = true) {
          let f = await this.getParametersSize(n);
          if (t.length !== 4 * f) throw new Error("Size of the buffer passed into loadParametersBuffer must match the number of parameters in the model. Please use getParametersSize method to check.");
          return this.handler.loadParametersBuffer(t, n);
        }
        async getContiguousParameters(t = true) {
          return this.handler.getContiguousParameters(t);
        }
        async release() {
          return this.handler.dispose();
        }
      };
    });
    Sn = H(() => {
      "use strict";
      An();
      Da = Lt;
    });
    or = {};
    gt(or, { InferenceSession: () => xa, TRACE: () => yn, TRACE_FUNC_BEGIN: () => Je, TRACE_FUNC_END: () => Ze, Tensor: () => me, TrainingSession: () => Da, env: () => j, registerBackend: () => yt });
    Qe = H(() => {
      "use strict";
      Zr();
      tn();
      vn();
      It();
      On();
      En();
      ar();
      _n();
      Tn();
      Sn();
    });
    ir = {};
    gt(ir, { createReadStream: () => Cn, readFile: () => Ua, readFileSync: () => Fa });
    sr = H(() => {
      Ua = void 0, Fa = void 0, Cn = void 0;
    });
    ur = {};
    gt(ur, { join: () => Ia });
    fr = H(() => {
      Ia = void 0;
    });
    Rn = rt((xn, lr) => {
      "use strict";
      var Pn = (() => {
        var r = typeof document < "u" ? document.currentScript?.src : void 0;
        return typeof __filename < "u" && (r || (r = __filename)), function(t = {}) {
          var n = t, f, i, m = new Promise((a, l) => {
            f = a, i = l;
          }), c = Object.assign({}, n), s = "./this.program", h = typeof window == "object", g = typeof importScripts == "function", _ = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", v = "", O, M, P;
          if (_) {
            var U = (sr(), nt(ir)), D = (fr(), nt(ur));
            v = g ? D.dirname(v) + "/" : __dirname + "/", O = (a, l) => (a = ge(a) ? new URL(a) : D.normalize(a), U.readFileSync(a, l ? void 0 : "utf8")), P = (a) => (a = O(a, true), a.buffer || (a = new Uint8Array(a)), a), M = (a, l, d, b = true) => {
              a = ge(a) ? new URL(a) : D.normalize(a), U.readFile(a, b ? void 0 : "utf8", (A, R) => {
                A ? d(A) : l(b ? R.buffer : R);
              });
            }, !n.thisProgram && 1 < process.argv.length && (s = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2);
          } else (h || g) && (g ? v = self.location.href : typeof document < "u" && document.currentScript && (v = document.currentScript.src), r && (v = r), v.startsWith("blob:") ? v = "" : v = v.substr(0, v.replace(/[?#].*/, "").lastIndexOf("/") + 1), O = (a) => {
            var l = new XMLHttpRequest();
            return l.open("GET", a, false), l.send(null), l.responseText;
          }, g && (P = (a) => {
            var l = new XMLHttpRequest();
            return l.open("GET", a, false), l.responseType = "arraybuffer", l.send(null), new Uint8Array(l.response);
          }), M = (a, l, d) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, true), b.responseType = "arraybuffer", b.onload = () => {
              b.status == 200 || b.status == 0 && b.response ? l(b.response) : d();
            }, b.onerror = d, b.send(null);
          });
          var C = console.log.bind(console), F = console.error.bind(console);
          Object.assign(n, c), c = null;
          var W, Z = false, te, re, x, Q, Le;
          function he() {
            var a = W.buffer;
            n.HEAP8 = te = new Int8Array(a), n.HEAP16 = new Int16Array(a), n.HEAPU8 = re = new Uint8Array(a), n.HEAPU16 = new Uint16Array(a), n.HEAP32 = x = new Int32Array(a), n.HEAPU32 = Q = new Uint32Array(a), n.HEAPF32 = new Float32Array(a), n.HEAPF64 = Le = new Float64Array(a);
          }
          var $e = [], se = [], K = [], Ae = 0, we = null, L = null;
          function ce(a) {
            throw a = "Aborted(" + a + ")", F(a), Z = true, a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info."), i(a), a;
          }
          var ke = (a) => a.startsWith("data:application/octet-stream;base64,"), ge = (a) => a.startsWith("file://"), Oe;
          if (Oe = "ort-wasm.wasm", !ke(Oe)) {
            var ue = Oe;
            Oe = n.locateFile ? n.locateFile(ue, v) : v + ue;
          }
          function ne(a) {
            if (P) return P(a);
            throw "both async and sync fetching of the wasm failed";
          }
          function ut(a) {
            if (h || g) {
              if (typeof fetch == "function" && !ge(a)) return fetch(a, { credentials: "same-origin" }).then((l) => {
                if (!l.ok) throw `failed to load wasm binary file at '${a}'`;
                return l.arrayBuffer();
              }).catch(() => ne(a));
              if (M) return new Promise((l, d) => {
                M(a, (b) => l(new Uint8Array(b)), d);
              });
            }
            return Promise.resolve().then(() => ne(a));
          }
          function Se(a, l, d) {
            return ut(a).then((b) => WebAssembly.instantiate(b, l)).then(d, (b) => {
              F(`failed to asynchronously prepare wasm: ${b}`), ce(b);
            });
          }
          function Ne(a, l) {
            var d = Oe;
            return typeof WebAssembly.instantiateStreaming != "function" || ke(d) || ge(d) || _ || typeof fetch != "function" ? Se(d, a, l) : fetch(d, { credentials: "same-origin" }).then((b) => WebAssembly.instantiateStreaming(b, a).then(l, function(A) {
              return F(`wasm streaming compile failed: ${A}`), F("falling back to ArrayBuffer instantiation"), Se(d, a, l);
            }));
          }
          var Me, Re = { 798088: (a, l, d, b) => {
            if (typeof n > "u" || !n.ya) return 1;
            if (a = de(a >>> 0), a.startsWith("./") && (a = a.substring(2)), a = n.ya.get(a), !a) return 2;
            if (l >>>= 0, d >>>= 0, l + d > a.byteLength) return 3;
            try {
              return re.set(a.subarray(l, l + d), b >>> 0 >>> 0), 0;
            } catch {
              return 4;
            }
          } };
          class Ce {
            constructor(l) {
              this.wa = l - 24;
            }
          }
          var be = 0, Ge = 0, oe = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, ie = (a, l, d) => {
            l >>>= 0;
            var b = l + d;
            for (d = l; a[d] && !(d >= b); ) ++d;
            if (16 < d - l && a.buffer && oe) return oe.decode(a.subarray(l, d));
            for (b = ""; l < d; ) {
              var A = a[l++];
              if (A & 128) {
                var R = a[l++] & 63;
                if ((A & 224) == 192) b += String.fromCharCode((A & 31) << 6 | R);
                else {
                  var N = a[l++] & 63;
                  A = (A & 240) == 224 ? (A & 15) << 12 | R << 6 | N : (A & 7) << 18 | R << 12 | N << 6 | a[l++] & 63, 65536 > A ? b += String.fromCharCode(A) : (A -= 65536, b += String.fromCharCode(55296 | A >> 10, 56320 | A & 1023));
                }
              } else b += String.fromCharCode(A);
            }
            return b;
          }, de = (a, l) => (a >>>= 0) ? ie(re, a, l) : "", Pe = (a) => {
            for (var l = 0, d = 0; d < a.length; ++d) {
              var b = a.charCodeAt(d);
              127 >= b ? l++ : 2047 >= b ? l += 2 : 55296 <= b && 57343 >= b ? (l += 4, ++d) : l += 3;
            }
            return l;
          }, xe = (a, l, d, b) => {
            if (d >>>= 0, !(0 < b)) return 0;
            var A = d;
            b = d + b - 1;
            for (var R = 0; R < a.length; ++R) {
              var N = a.charCodeAt(R);
              if (55296 <= N && 57343 >= N) {
                var ae = a.charCodeAt(++R);
                N = 65536 + ((N & 1023) << 10) | ae & 1023;
              }
              if (127 >= N) {
                if (d >= b) break;
                l[d++ >>> 0] = N;
              } else {
                if (2047 >= N) {
                  if (d + 1 >= b) break;
                  l[d++ >>> 0] = 192 | N >> 6;
                } else {
                  if (65535 >= N) {
                    if (d + 2 >= b) break;
                    l[d++ >>> 0] = 224 | N >> 12;
                  } else {
                    if (d + 3 >= b) break;
                    l[d++ >>> 0] = 240 | N >> 18, l[d++ >>> 0] = 128 | N >> 12 & 63;
                  }
                  l[d++ >>> 0] = 128 | N >> 6 & 63;
                }
                l[d++ >>> 0] = 128 | N & 63;
              }
            }
            return l[d >>> 0] = 0, d - A;
          }, We = (a) => a % 4 === 0 && (a % 100 !== 0 || a % 400 === 0), ft = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Et = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], De = [], et = {}, je = () => {
            if (!ze) {
              var a = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _: s || "./this.program" }, l;
              for (l in et) et[l] === void 0 ? delete a[l] : a[l] = et[l];
              var d = [];
              for (l in a) d.push(`${l}=${a[l]}`);
              ze = d;
            }
            return ze;
          }, ze, _t = [null, [], []], Ie = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Tt = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          function z(a) {
            var l = Array(Pe(a) + 1);
            return xe(a, l, 0, l.length), l;
          }
          function lt(a, l, d, b) {
            function A(y, $, Y) {
              for (y = typeof y == "number" ? y.toString() : y || ""; y.length < $; ) y = Y[0] + y;
              return y;
            }
            function R(y, $) {
              return A(y, $, "0");
            }
            function N(y, $) {
              function Y(ht) {
                return 0 > ht ? -1 : 0 < ht ? 1 : 0;
              }
              var Ue;
              return (Ue = Y(y.getFullYear() - $.getFullYear())) === 0 && (Ue = Y(y.getMonth() - $.getMonth())) === 0 && (Ue = Y(y.getDate() - $.getDate())), Ue;
            }
            function ae(y) {
              switch (y.getDay()) {
                case 0:
                  return new Date(y.getFullYear() - 1, 11, 29);
                case 1:
                  return y;
                case 2:
                  return new Date(y.getFullYear(), 0, 3);
                case 3:
                  return new Date(y.getFullYear(), 0, 2);
                case 4:
                  return new Date(y.getFullYear(), 0, 1);
                case 5:
                  return new Date(y.getFullYear() - 1, 11, 31);
                case 6:
                  return new Date(y.getFullYear() - 1, 11, 30);
              }
            }
            function Ee(y) {
              var $ = y.sa;
              for (y = new Date(new Date(y.ta + 1900, 0, 1).getTime()); 0 < $; ) {
                var Y = y.getMonth(), Ue = (We(y.getFullYear()) ? Ie : Tt)[Y];
                if ($ > Ue - y.getDate()) $ -= Ue - y.getDate() + 1, y.setDate(1), 11 > Y ? y.setMonth(Y + 1) : (y.setMonth(0), y.setFullYear(y.getFullYear() + 1));
                else {
                  y.setDate(y.getDate() + $);
                  break;
                }
              }
              return Y = new Date(y.getFullYear() + 1, 0, 4), $ = ae(new Date(y.getFullYear(), 0, 4)), Y = ae(Y), 0 >= N($, y) ? 0 >= N(Y, y) ? y.getFullYear() + 1 : y.getFullYear() : y.getFullYear() - 1;
            }
            a >>>= 0, l >>>= 0, d >>>= 0, b >>>= 0;
            var fe = Q[b + 40 >>> 2 >>> 0];
            b = { Ba: x[b >>> 2 >>> 0], Aa: x[b + 4 >>> 2 >>> 0], ua: x[b + 8 >>> 2 >>> 0], xa: x[b + 12 >>> 2 >>> 0], va: x[b + 16 >>> 2 >>> 0], ta: x[b + 20 >>> 2 >>> 0], na: x[b + 24 >>> 2 >>> 0], sa: x[b + 28 >>> 2 >>> 0], Da: x[b + 32 >>> 2 >>> 0], za: x[b + 36 >>> 2 >>> 0], Ca: fe ? de(fe) : "" }, d = de(d), fe = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
            for (var le in fe) d = d.replace(new RegExp(le, "g"), fe[le]);
            var mt = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), He = "January February March April May June July August September October November December".split(" ");
            fe = { "%a": (y) => mt[y.na].substring(0, 3), "%A": (y) => mt[y.na], "%b": (y) => He[y.va].substring(0, 3), "%B": (y) => He[y.va], "%C": (y) => R((y.ta + 1900) / 100 | 0, 2), "%d": (y) => R(y.xa, 2), "%e": (y) => A(y.xa, 2, " "), "%g": (y) => Ee(y).toString().substring(2), "%G": Ee, "%H": (y) => R(y.ua, 2), "%I": (y) => (y = y.ua, y == 0 ? y = 12 : 12 < y && (y -= 12), R(y, 2)), "%j": (y) => {
              for (var $ = 0, Y = 0; Y <= y.va - 1; $ += (We(y.ta + 1900) ? Ie : Tt)[Y++]) ;
              return R(y.xa + $, 3);
            }, "%m": (y) => R(y.va + 1, 2), "%M": (y) => R(y.Aa, 2), "%n": () => `
`, "%p": (y) => 0 <= y.ua && 12 > y.ua ? "AM" : "PM", "%S": (y) => R(y.Ba, 2), "%t": () => "	", "%u": (y) => y.na || 7, "%U": (y) => R(Math.floor((y.sa + 7 - y.na) / 7), 2), "%V": (y) => {
              var $ = Math.floor((y.sa + 7 - (y.na + 6) % 7) / 7);
              if (2 >= (y.na + 371 - y.sa - 2) % 7 && $++, $) $ == 53 && (Y = (y.na + 371 - y.sa) % 7, Y == 4 || Y == 3 && We(y.ta) || ($ = 1));
              else {
                $ = 52;
                var Y = (y.na + 7 - y.sa - 1) % 7;
                (Y == 4 || Y == 5 && We(y.ta % 400 - 1)) && $++;
              }
              return R($, 2);
            }, "%w": (y) => y.na, "%W": (y) => R(Math.floor((y.sa + 7 - (y.na + 6) % 7) / 7), 2), "%y": (y) => (y.ta + 1900).toString().substring(2), "%Y": (y) => y.ta + 1900, "%z": (y) => {
              y = y.za;
              var $ = 0 <= y;
              return y = Math.abs(y) / 60, ($ ? "+" : "-") + ("0000" + (y / 60 * 100 + y % 60)).slice(-4);
            }, "%Z": (y) => y.Ca, "%%": () => "%" }, d = d.replace(/%%/g, "\0\0");
            for (le in fe) d.includes(le) && (d = d.replace(new RegExp(le, "g"), fe[le](b)));
            return d = d.replace(/\0\0/g, "%"), le = z(d), le.length > l ? 0 : (te.set(le, a >>> 0), le.length - 1);
          }
          var ct = { a: function(a, l, d) {
            a >>>= 0;
            var b = new Ce(a);
            throw Q[b.wa + 16 >>> 2 >>> 0] = 0, Q[b.wa + 4 >>> 2 >>> 0] = l >>> 0, Q[b.wa + 8 >>> 2 >>> 0] = d >>> 0, be = a, Ge++, be;
          }, e: function() {
            return 0;
          }, H: function() {
          }, x: function() {
          }, z: function() {
          }, J: function() {
            return 0;
          }, F: function() {
          }, A: function() {
          }, E: function() {
          }, g: function() {
          }, y: function() {
          }, v: function() {
          }, G: function() {
          }, w: function() {
          }, k: () => 1, I: function(a, l, d) {
            return l >>>= 0, re.copyWithin(a >>> 0 >>> 0, l >>> 0, l + (d >>> 0) >>> 0);
          }, n: function(a, l, d) {
            a = l + 2097152 >>> 0 < 4194305 - !!a ? (a >>> 0) + 4294967296 * l : NaN, d >>>= 0, a = new Date(1e3 * a), x[d >>> 2 >>> 0] = a.getUTCSeconds(), x[d + 4 >>> 2 >>> 0] = a.getUTCMinutes(), x[d + 8 >>> 2 >>> 0] = a.getUTCHours(), x[d + 12 >>> 2 >>> 0] = a.getUTCDate(), x[d + 16 >>> 2 >>> 0] = a.getUTCMonth(), x[d + 20 >>> 2 >>> 0] = a.getUTCFullYear() - 1900, x[d + 24 >>> 2 >>> 0] = a.getUTCDay(), x[d + 28 >>> 2 >>> 0] = (a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5 | 0;
          }, o: function(a, l, d) {
            a = l + 2097152 >>> 0 < 4194305 - !!a ? (a >>> 0) + 4294967296 * l : NaN, d >>>= 0, a = new Date(1e3 * a), x[d >>> 2 >>> 0] = a.getSeconds(), x[d + 4 >>> 2 >>> 0] = a.getMinutes(), x[d + 8 >>> 2 >>> 0] = a.getHours(), x[d + 12 >>> 2 >>> 0] = a.getDate(), x[d + 16 >>> 2 >>> 0] = a.getMonth(), x[d + 20 >>> 2 >>> 0] = a.getFullYear() - 1900, x[d + 24 >>> 2 >>> 0] = a.getDay(), x[d + 28 >>> 2 >>> 0] = (We(a.getFullYear()) ? ft : Et)[a.getMonth()] + a.getDate() - 1 | 0, x[d + 36 >>> 2 >>> 0] = -(60 * a.getTimezoneOffset()), l = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
            var b = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
            x[d + 32 >>> 2 >>> 0] = (l != b && a.getTimezoneOffset() == Math.min(b, l)) | 0;
          }, p: function(a) {
            a >>>= 0;
            var l = new Date(x[a + 20 >>> 2 >>> 0] + 1900, x[a + 16 >>> 2 >>> 0], x[a + 12 >>> 2 >>> 0], x[a + 8 >>> 2 >>> 0], x[a + 4 >>> 2 >>> 0], x[a >>> 2 >>> 0], 0), d = x[a + 32 >>> 2 >>> 0], b = l.getTimezoneOffset(), A = new Date(l.getFullYear(), 6, 1).getTimezoneOffset(), R = new Date(l.getFullYear(), 0, 1).getTimezoneOffset(), N = Math.min(R, A);
            return 0 > d ? x[a + 32 >>> 2 >>> 0] = +(A != R && N == b) : 0 < d != (N == b) && (A = Math.max(R, A), l.setTime(l.getTime() + 6e4 * ((0 < d ? N : A) - b))), x[a + 24 >>> 2 >>> 0] = l.getDay(), x[a + 28 >>> 2 >>> 0] = (We(l.getFullYear()) ? ft : Et)[l.getMonth()] + l.getDate() - 1 | 0, x[a >>> 2 >>> 0] = l.getSeconds(), x[a + 4 >>> 2 >>> 0] = l.getMinutes(), x[a + 8 >>> 2 >>> 0] = l.getHours(), x[a + 12 >>> 2 >>> 0] = l.getDate(), x[a + 16 >>> 2 >>> 0] = l.getMonth(), x[a + 20 >>> 2 >>> 0] = l.getYear(), a = l.getTime(), a = isNaN(a) ? -1 : a / 1e3, dt((Me = a, 1 <= +Math.abs(Me) ? 0 < Me ? +Math.floor(Me / 4294967296) >>> 0 : ~~+Math.ceil((Me - +(~~Me >>> 0)) / 4294967296) >>> 0 : 0)), a >>> 0;
          }, l: function() {
            return -52;
          }, m: function() {
          }, t: function(a, l, d, b) {
            d >>>= 0, b >>>= 0;
            var A = (/* @__PURE__ */ new Date()).getFullYear(), R = new Date(A, 0, 1), N = new Date(A, 6, 1);
            A = R.getTimezoneOffset();
            var ae = N.getTimezoneOffset();
            Q[a >>> 0 >>> 2 >>> 0] = 60 * Math.max(A, ae), x[l >>> 0 >>> 2 >>> 0] = +(A != ae), a = (Ee) => Ee.toLocaleTimeString(void 0, { hour12: false, timeZoneName: "short" }).split(" ")[1], R = a(R), N = a(N), ae < A ? (xe(R, re, d, 17), xe(N, re, b, 17)) : (xe(R, re, b, 17), xe(N, re, d, 17));
          }, d: () => {
            ce("");
          }, B: function(a, l, d) {
            a >>>= 0, l >>>= 0, d >>>= 0, De.length = 0;
            for (var b; b = re[l++ >>> 0]; ) {
              var A = b != 105;
              A &= b != 112, d += A && d % 8 ? 4 : 0, De.push(b == 112 ? Q[d >>> 2 >>> 0] : b == 105 ? x[d >>> 2 >>> 0] : Le[d >>> 3 >>> 0]), d += A ? 8 : 4;
            }
            return Re[a](...De);
          }, h: () => Date.now(), u: function() {
            return 4294901760;
          }, b: () => performance.now(), s: function(a) {
            a >>>= 0;
            var l = re.length;
            if (4294901760 < a) return false;
            for (var d = 1; 4 >= d; d *= 2) {
              var b = l * (1 + 0.2 / d);
              b = Math.min(b, a + 100663296);
              var A = Math;
              b = Math.max(a, b);
              e: {
                A = (A.min.call(A, 4294901760, b + (65536 - b % 65536) % 65536) - W.buffer.byteLength + 65535) / 65536;
                try {
                  W.grow(A), he();
                  var R = 1;
                  break e;
                } catch {
                }
                R = void 0;
              }
              if (R) return true;
            }
            return false;
          }, C: function(a, l) {
            a >>>= 0, l >>>= 0;
            var d = 0;
            return je().forEach((b, A) => {
              var R = l + d;
              for (A = Q[a + 4 * A >>> 2 >>> 0] = R, R = 0; R < b.length; ++R) te[A++ >>> 0] = b.charCodeAt(R);
              te[A >>> 0] = 0, d += b.length + 1;
            }), 0;
          }, D: function(a, l) {
            a >>>= 0, l >>>= 0;
            var d = je();
            Q[a >>> 2 >>> 0] = d.length;
            var b = 0;
            return d.forEach((A) => b += A.length + 1), Q[l >>> 2 >>> 0] = b, 0;
          }, f: () => 52, j: function() {
            return 52;
          }, q: function() {
            return 70;
          }, i: function(a, l, d, b) {
            l >>>= 0, d >>>= 0, b >>>= 0;
            for (var A = 0, R = 0; R < d; R++) {
              var N = Q[l >>> 2 >>> 0], ae = Q[l + 4 >>> 2 >>> 0];
              l += 8;
              for (var Ee = 0; Ee < ae; Ee++) {
                var fe = re[N + Ee >>> 0], le = _t[a];
                fe === 0 || fe === 10 ? ((a === 1 ? C : F)(ie(le, 0)), le.length = 0) : le.push(fe);
              }
              A += ae;
            }
            return Q[b >>> 2 >>> 0] = A, 0;
          }, r: lt, c: function(a, l, d, b) {
            return lt(a >>> 0, l >>> 0, d >>> 0, b >>> 0);
          } }, k = (function() {
            function a(d) {
              return k = d.exports, k = St(), W = k.K, he(), se.unshift(k.L), Ae--, Ae == 0 && (we !== null && (clearInterval(we), we = null), L && (d = L, L = null, d())), k;
            }
            var l = { a: ct };
            if (Ae++, n.instantiateWasm) try {
              return n.instantiateWasm(l, a);
            } catch (d) {
              F(`Module.instantiateWasm callback failed with error: ${d}`), i(d);
            }
            return Ne(l, function(d) {
              a(d.instance);
            }).catch(i), {};
          })();
          n._OrtInit = (a, l) => (n._OrtInit = k.M)(a, l), n._OrtGetLastError = (a, l) => (n._OrtGetLastError = k.N)(a, l), n._OrtCreateSessionOptions = (a, l, d, b, A, R, N, ae, Ee, fe) => (n._OrtCreateSessionOptions = k.O)(a, l, d, b, A, R, N, ae, Ee, fe), n._OrtAppendExecutionProvider = (a, l) => (n._OrtAppendExecutionProvider = k.P)(a, l), n._OrtAddFreeDimensionOverride = (a, l, d) => (n._OrtAddFreeDimensionOverride = k.Q)(a, l, d), n._OrtAddSessionConfigEntry = (a, l, d) => (n._OrtAddSessionConfigEntry = k.R)(a, l, d), n._OrtReleaseSessionOptions = (a) => (n._OrtReleaseSessionOptions = k.S)(a), n._OrtCreateSession = (a, l, d) => (n._OrtCreateSession = k.T)(a, l, d), n._OrtReleaseSession = (a) => (n._OrtReleaseSession = k.U)(a), n._OrtGetInputOutputCount = (a, l, d) => (n._OrtGetInputOutputCount = k.V)(a, l, d), n._OrtGetInputName = (a, l) => (n._OrtGetInputName = k.W)(a, l), n._OrtGetOutputName = (a, l) => (n._OrtGetOutputName = k.X)(a, l), n._OrtFree = (a) => (n._OrtFree = k.Y)(a), n._OrtCreateTensor = (a, l, d, b, A, R) => (n._OrtCreateTensor = k.Z)(a, l, d, b, A, R), n._OrtGetTensorData = (a, l, d, b, A) => (n._OrtGetTensorData = k._)(a, l, d, b, A), n._OrtReleaseTensor = (a) => (n._OrtReleaseTensor = k.$)(a), n._OrtCreateRunOptions = (a, l, d, b) => (n._OrtCreateRunOptions = k.aa)(a, l, d, b), n._OrtAddRunConfigEntry = (a, l, d) => (n._OrtAddRunConfigEntry = k.ba)(a, l, d), n._OrtReleaseRunOptions = (a) => (n._OrtReleaseRunOptions = k.ca)(a), n._OrtCreateBinding = (a) => (n._OrtCreateBinding = k.da)(a), n._OrtBindInput = (a, l, d) => (n._OrtBindInput = k.ea)(a, l, d), n._OrtBindOutput = (a, l, d, b) => (n._OrtBindOutput = k.fa)(a, l, d, b), n._OrtClearBoundOutputs = (a) => (n._OrtClearBoundOutputs = k.ga)(a), n._OrtReleaseBinding = (a) => (n._OrtReleaseBinding = k.ha)(a), n._OrtRunWithBinding = (a, l, d, b, A) => (n._OrtRunWithBinding = k.ia)(a, l, d, b, A), n._OrtRun = (a, l, d, b, A, R, N, ae) => (n._OrtRun = k.ja)(a, l, d, b, A, R, N, ae), n._OrtEndProfiling = (a) => (n._OrtEndProfiling = k.ka)(a), n._malloc = (a) => (n._malloc = k.la)(a), n._free = (a) => (n._free = k.ma)(a);
          var dt = (a) => (dt = k.oa)(a), At = (a) => (At = k.pa)(a), I = (a) => (I = k.qa)(a), Ye = () => (Ye = k.ra)();
          function St() {
            var a = k;
            a = Object.assign({}, a);
            var l = (d) => (b) => d(b) >>> 0;
            return a.la = l(a.la), a.qa = l(a.qa), a.ra = /* @__PURE__ */ ((d) => () => d() >>> 0)(a.ra), a;
          }
          n.stackSave = () => Ye(), n.stackRestore = (a) => At(a), n.stackAlloc = (a) => I(a), n.UTF8ToString = de, n.stringToUTF8 = (a, l, d) => xe(a, re, l, d), n.lengthBytesUTF8 = Pe;
          var Be;
          L = function a() {
            Be || pt(), Be || (L = a);
          };
          function pt() {
            if (!(0 < Ae)) {
              if (n.preRun) for (typeof n.preRun == "function" && (n.preRun = [n.preRun]); n.preRun.length; ) {
                var a = n.preRun.shift();
                $e.unshift(a);
              }
              for (; 0 < $e.length; ) $e.shift()(n);
              if (!(0 < Ae || Be || (Be = true, n.calledRun = true, Z))) {
                for (; 0 < se.length; ) se.shift()(n);
                for (f(n); 0 < K.length; ) K.shift()(n);
              }
            }
          }
          return pt(), m;
        };
      })();
      typeof xn == "object" && typeof lr == "object" ? lr.exports = Pn : typeof define == "function" && define.amd && define([], () => Pn);
    });
    Dn = rt(() => {
    });
    Un = rt(() => {
    });
    Fn = {};
    gt(Fn, { cpus: () => Ba });
    In = H(() => {
      Ba = void 0;
    });
    kn = rt((Ln, cr) => {
      "use strict";
      var Bn = (() => {
        var r = typeof document < "u" ? document.currentScript?.src : void 0;
        return typeof __filename < "u" && (r || (r = __filename)), function(t = {}) {
          function n() {
            return K.buffer != ce.buffer && ne(), ce;
          }
          function f() {
            return K.buffer != ce.buffer && ne(), ke;
          }
          function i() {
            return K.buffer != ce.buffer && ne(), ge;
          }
          function m() {
            return K.buffer != ce.buffer && ne(), Oe;
          }
          function c() {
            return K.buffer != ce.buffer && ne(), ue;
          }
          var s = t, h, g, _ = new Promise((e, o) => {
            h = e, g = o;
          }), v = Object.assign({}, s), O = "./this.program", M = (e, o) => {
            throw o;
          }, P = typeof window == "object", U = typeof importScripts == "function", D = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string", C = s.ENVIRONMENT_IS_PTHREAD || false, F = "";
          function W(e) {
            return s.locateFile ? s.locateFile(e, F) : F + e;
          }
          var Z, te, re;
          if (D) {
            var x = (sr(), nt(ir)), Q = (fr(), nt(ur));
            F = U ? Q.dirname(F) + "/" : __dirname + "/", Z = (e, o) => (e = de(e) ? new URL(e) : Q.normalize(e), x.readFileSync(e, o ? void 0 : "utf8")), re = (e) => (e = Z(e, true), e.buffer || (e = new Uint8Array(e)), e), te = (e, o, u, p = true) => {
              e = de(e) ? new URL(e) : Q.normalize(e), x.readFile(e, p ? void 0 : "utf8", (T, E) => {
                T ? u(T) : o(p ? E.buffer : E);
              });
            }, !s.thisProgram && 1 < process.argv.length && (O = process.argv[1].replace(/\\/g, "/")), process.argv.slice(2), M = (e, o) => {
              throw process.exitCode = e, o;
            }, global.Worker = Dn().Worker;
          } else (P || U) && (U ? F = self.location.href : typeof document < "u" && document.currentScript && (F = document.currentScript.src), typeof r < "u" && r && (F = r), F.startsWith("blob:") ? F = "" : F = F.substr(0, F.replace(/[?#].*/, "").lastIndexOf("/") + 1), D || (Z = (e) => {
            var o = new XMLHttpRequest();
            return o.open("GET", e, false), o.send(null), o.responseText;
          }, U && (re = (e) => {
            var o = new XMLHttpRequest();
            return o.open("GET", e, false), o.responseType = "arraybuffer", o.send(null), new Uint8Array(o.response);
          }), te = (e, o, u) => {
            var p = new XMLHttpRequest();
            p.open("GET", e, true), p.responseType = "arraybuffer", p.onload = () => {
              p.status == 200 || p.status == 0 && p.response ? o(p.response) : u();
            }, p.onerror = u, p.send(null);
          }));
          D && typeof performance > "u" && (global.performance = Un().performance);
          var Le = console.log.bind(console), he = console.error.bind(console);
          D && (Le = (...e) => x.writeSync(1, e.join(" ") + `
`), he = (...e) => x.writeSync(2, e.join(" ") + `
`));
          var $e = Le, se = he;
          Object.assign(s, v), v = null;
          var K, Ae, we = false, L, ce, ke, ge, Oe, ue;
          function ne() {
            var e = K.buffer;
            s.HEAP8 = ce = new Int8Array(e), s.HEAP16 = new Int16Array(e), s.HEAPU8 = ke = new Uint8Array(e), s.HEAPU16 = new Uint16Array(e), s.HEAP32 = ge = new Int32Array(e), s.HEAPU32 = Oe = new Uint32Array(e), s.HEAPF32 = new Float32Array(e), s.HEAPF64 = ue = new Float64Array(e);
          }
          var ut = 16777216;
          if (C) K = s.wasmMemory;
          else if (s.wasmMemory) K = s.wasmMemory;
          else if (K = new WebAssembly.Memory({ initial: ut / 65536, maximum: 65536, shared: true }), !(K.buffer instanceof SharedArrayBuffer)) throw se("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"), D && se("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)"), Error("bad memory");
          ne(), ut = K.buffer.byteLength;
          var Se = [], Ne = [], Me = [], Re = 0, Ce = null, be = null;
          function Ge() {
            if (Re--, Re == 0 && (Ce !== null && (clearInterval(Ce), Ce = null), be)) {
              var e = be;
              be = null, e();
            }
          }
          function oe(e) {
            throw e = "Aborted(" + e + ")", se(e), we = true, L = 1, e = new WebAssembly.RuntimeError(e + ". Build with -sASSERTIONS for more info."), g(e), e;
          }
          var ie = (e) => e.startsWith("data:application/octet-stream;base64,"), de = (e) => e.startsWith("file://"), Pe;
          Pe = "ort-wasm-threaded.wasm", ie(Pe) || (Pe = W(Pe));
          function xe(e) {
            if (re) return re(e);
            throw "both async and sync fetching of the wasm failed";
          }
          function We(e) {
            if (P || U) {
              if (typeof fetch == "function" && !de(e)) return fetch(e, { credentials: "same-origin" }).then((o) => {
                if (!o.ok) throw `failed to load wasm binary file at '${e}'`;
                return o.arrayBuffer();
              }).catch(() => xe(e));
              if (te) return new Promise((o, u) => {
                te(e, (p) => o(new Uint8Array(p)), u);
              });
            }
            return Promise.resolve().then(() => xe(e));
          }
          function ft(e, o, u) {
            return We(e).then((p) => WebAssembly.instantiate(p, o)).then(u, (p) => {
              se(`failed to asynchronously prepare wasm: ${p}`), oe(p);
            });
          }
          function Et(e, o) {
            var u = Pe;
            return typeof WebAssembly.instantiateStreaming != "function" || ie(u) || de(u) || D || typeof fetch != "function" ? ft(u, e, o) : fetch(u, { credentials: "same-origin" }).then((p) => WebAssembly.instantiateStreaming(p, e).then(o, function(T) {
              return se(`wasm streaming compile failed: ${T}`), se("falling back to ArrayBuffer instantiation"), ft(u, e, o);
            }));
          }
          var De, et = { 799444: (e, o, u, p) => {
            if (typeof s > "u" || !s.bb) return 1;
            if (e = ae(e >>> 0), e.startsWith("./") && (e = e.substring(2)), e = s.bb.get(e), !e) return 2;
            if (o >>>= 0, u >>>= 0, p >>>= 0, o + u > e.byteLength) return 3;
            try {
              return f().set(e.subarray(o, o + u), p >>> 0), 0;
            } catch {
              return 4;
            }
          } };
          function je(e) {
            this.name = "ExitStatus", this.message = `Program terminated with exit(${e})`, this.status = e;
          }
          var ze = (e) => {
            e.terminate(), e.onmessage = () => {
            };
          }, _t = (e) => {
            I.Oa.length == 0 && (dt(), I.Xa(I.Oa[0]));
            var o = I.Oa.pop();
            if (!o) return 6;
            I.Pa.push(o), I.La[e.Na] = o, o.Na = e.Na;
            var u = { cmd: "run", start_routine: e.gb, arg: e.cb, pthread_ptr: e.Na };
            return D && o.unref(), o.postMessage(u, e.mb), 0;
          }, Ie = 0, Tt = (e) => {
            var o = er();
            return e = e(), Pt(o), e;
          }, z = (e, o, ...u) => Tt(() => {
            for (var p = u.length, T = Kt(8 * p), E = T >>> 3, S = 0; S < u.length; S++) {
              var X = u[S];
              c()[E + S >>> 0] = X;
            }
            return Gr(e, 0, p, T, o);
          });
          function lt(e) {
            if (C) return z(0, 1, e);
            L = e, 0 < Ie || (I.hb(), s.onExit?.(e), we = true), M(e, new je(e));
          }
          var ct = (e) => {
            if (L = e, C) throw St(e), "unwind";
            lt(e);
          };
          function k() {
            for (var e = s.numThreads; e--; ) dt();
            Se.unshift(() => {
              Re++, At(() => Ge());
            });
          }
          function dt() {
            var e = W("ort-wasm-threaded.worker.js");
            e = new Worker(e), I.Oa.push(e);
          }
          function At(e) {
            C ? e() : Promise.all(I.Oa.map(I.Xa)).then(e);
          }
          var I = { Oa: [], Pa: [], ab: [], La: {}, Va() {
            C ? (I.receiveObjectTransfer = I.fb, I.threadInitTLS = I.$a, I.setExitStatus = I.Za) : k();
          }, Za: (e) => L = e, pb: ["$terminateWorker"], hb: () => {
            for (var e of I.Pa) ze(e);
            for (e of I.Oa) ze(e);
            I.Oa = [], I.Pa = [], I.La = [];
          }, Ya: (e) => {
            var o = e.Na;
            delete I.La[o], I.Oa.push(e), I.Pa.splice(I.Pa.indexOf(e), 1), e.Na = 0, Zt(o);
          }, fb() {
          }, $a() {
            I.ab.forEach((e) => e());
          }, Xa: (e) => new Promise((o) => {
            e.onmessage = (E) => {
              E = E.data;
              var S = E.cmd;
              if (E.targetThread && E.targetThread != Ct()) {
                var X = I.La[E.targetThread];
                X ? X.postMessage(E, E.transferList) : se(`Internal error! Worker sent a message "${S}" to target pthread ${E.targetThread}, but that thread no longer exists!`);
              } else S === "checkMailbox" ? Mt() : S === "spawnThread" ? _t(E) : S === "cleanupThread" ? I.Ya(I.La[E.thread]) : S === "killThread" ? (E = E.thread, S = I.La[E], delete I.La[E], ze(S), Zt(E), I.Pa.splice(I.Pa.indexOf(S), 1), S.Na = 0) : S === "cancelThread" ? I.La[E.thread].postMessage({ cmd: "cancel" }) : S === "loaded" ? (e.loaded = true, D && !e.Na && e.unref(), o(e)) : S === "alert" ? alert(`Thread ${E.threadId}: ${E.text}`) : E.target === "setimmediate" ? e.postMessage(E) : S === "callHandler" ? s[E.handler](...E.args) : S && se(`worker sent an unknown command ${S}`);
            }, e.onerror = (E) => {
              throw se(`worker sent an error! ${E.filename}:${E.lineno}: ${E.message}`), E;
            }, D && (e.on("message", (E) => e.onmessage({ data: E })), e.on("error", (E) => e.onerror(E)));
            var u = [], p = ["onExit"], T;
            for (T of p) s.hasOwnProperty(T) && u.push(T);
            e.postMessage({ cmd: "load", handlers: u, urlOrBlob: s.mainScriptUrlOrBlob || r, wasmMemory: K, wasmModule: Ae });
          }) };
          s.PThread = I;
          var Ye = (e) => {
            for (; 0 < e.length; ) e.shift()(s);
          };
          s.establishStackSpace = () => {
            var e = Ct(), o = m()[e + 52 >>> 2 >>> 0];
            e = m()[e + 56 >>> 2 >>> 0], Yr(o, o - e), Pt(o);
          };
          function St(e) {
            if (C) return z(1, 0, e);
            ct(e);
          }
          var Be = [], pt;
          s.invokeEntryPoint = (e, o) => {
            Ie = 0;
            var u = Be[e];
            u || (e >= Be.length && (Be.length = e + 1), Be[e] = u = pt.get(e)), e = u(o), 0 < Ie ? I.Za(e) : Qt(e);
          };
          class a {
            constructor(o) {
              this.Ua = o - 24;
            }
            Va(o, u) {
              m()[this.Ua + 16 >>> 2 >>> 0] = 0, m()[this.Ua + 4 >>> 2 >>> 0] = o, m()[this.Ua + 8 >>> 2 >>> 0] = u;
            }
          }
          var l = 0, d = 0;
          function b(e, o, u, p) {
            return C ? z(2, 1, e, o, u, p) : A(e, o, u, p);
          }
          function A(e, o, u, p) {
            if (e >>>= 0, o >>>= 0, u >>>= 0, p >>>= 0, typeof SharedArrayBuffer > "u") return se("Current environment does not support SharedArrayBuffer, pthreads are not available!"), 6;
            var T = [];
            return C && T.length === 0 ? b(e, o, u, p) : (e = { gb: u, Na: e, cb: p, mb: T }, C ? (e.ob = "spawnThread", postMessage(e, T), 0) : _t(e));
          }
          var R = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, N = (e, o, u) => {
            o >>>= 0;
            var p = o + u;
            for (u = o; e[u] && !(u >= p); ) ++u;
            if (16 < u - o && e.buffer && R) return R.decode(e.buffer instanceof SharedArrayBuffer ? e.slice(o, u) : e.subarray(o, u));
            for (p = ""; o < u; ) {
              var T = e[o++];
              if (T & 128) {
                var E = e[o++] & 63;
                if ((T & 224) == 192) p += String.fromCharCode((T & 31) << 6 | E);
                else {
                  var S = e[o++] & 63;
                  T = (T & 240) == 224 ? (T & 15) << 12 | E << 6 | S : (T & 7) << 18 | E << 12 | S << 6 | e[o++] & 63, 65536 > T ? p += String.fromCharCode(T) : (T -= 65536, p += String.fromCharCode(55296 | T >> 10, 56320 | T & 1023));
                }
              } else p += String.fromCharCode(T);
            }
            return p;
          }, ae = (e, o) => (e >>>= 0) ? N(f(), e, o) : "";
          function Ee(e, o, u) {
            return C ? z(3, 1, e, o, u) : 0;
          }
          function fe(e, o) {
            if (C) return z(4, 1, e, o);
          }
          var le = (e) => {
            for (var o = 0, u = 0; u < e.length; ++u) {
              var p = e.charCodeAt(u);
              127 >= p ? o++ : 2047 >= p ? o += 2 : 55296 <= p && 57343 >= p ? (o += 4, ++u) : o += 3;
            }
            return o;
          }, mt = (e, o, u, p) => {
            if (u >>>= 0, !(0 < p)) return 0;
            var T = u;
            p = u + p - 1;
            for (var E = 0; E < e.length; ++E) {
              var S = e.charCodeAt(E);
              if (55296 <= S && 57343 >= S) {
                var X = e.charCodeAt(++E);
                S = 65536 + ((S & 1023) << 10) | X & 1023;
              }
              if (127 >= S) {
                if (u >= p) break;
                o[u++ >>> 0] = S;
              } else {
                if (2047 >= S) {
                  if (u + 1 >= p) break;
                  o[u++ >>> 0] = 192 | S >> 6;
                } else {
                  if (65535 >= S) {
                    if (u + 2 >= p) break;
                    o[u++ >>> 0] = 224 | S >> 12;
                  } else {
                    if (u + 3 >= p) break;
                    o[u++ >>> 0] = 240 | S >> 18, o[u++ >>> 0] = 128 | S >> 12 & 63;
                  }
                  o[u++ >>> 0] = 128 | S >> 6 & 63;
                }
                o[u++ >>> 0] = 128 | S & 63;
              }
            }
            return o[u >>> 0] = 0, u - T;
          }, He = (e, o, u) => mt(e, f(), o, u);
          function y(e, o) {
            if (C) return z(5, 1, e, o);
          }
          function $(e, o, u) {
            if (C) return z(6, 1, e, o, u);
          }
          function Y(e, o, u) {
            return C ? z(7, 1, e, o, u) : 0;
          }
          function Ue(e, o) {
            if (C) return z(8, 1, e, o);
          }
          function ht(e, o, u) {
            if (C) return z(9, 1, e, o, u);
          }
          function Er(e, o, u, p) {
            if (C) return z(10, 1, e, o, u, p);
          }
          function _r(e, o, u, p) {
            if (C) return z(11, 1, e, o, u, p);
          }
          function Tr(e, o, u, p) {
            if (C) return z(12, 1, e, o, u, p);
          }
          function Ar(e) {
            if (C) return z(13, 1, e);
          }
          function Sr(e, o) {
            if (C) return z(14, 1, e, o);
          }
          function Mr(e, o, u) {
            if (C) return z(15, 1, e, o, u);
          }
          function Yt(e) {
            e >>>= 0, typeof Atomics.nb == "function" && (Atomics.nb(i(), e >>> 2, e).value.then(Mt), e += 128, Atomics.store(i(), e >>> 2, 1));
          }
          s.__emscripten_thread_mailbox_await = Yt;
          var Mt = () => {
            var e = Ct();
            if (e && (Yt(e), e = jr, !we)) try {
              if (e(), !(0 < Ie)) try {
                C ? Qt(L) : ct(L);
              } catch (o) {
                o instanceof je || o == "unwind" || M(1, o);
              }
            } catch (o) {
              o instanceof je || o == "unwind" || M(1, o);
            }
          };
          s.checkMailbox = Mt;
          var qt = [], tt = (e) => e % 4 === 0 && (e % 100 !== 0 || e % 400 === 0), Cr = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Pr = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
          function xr(e, o, u, p, T, E, S, X) {
            return C ? z(16, 1, e, o, u, p, T, E, S, X) : -52;
          }
          function Rr(e, o, u, p, T, E, S) {
            if (C) return z(17, 1, e, o, u, p, T, E, S);
          }
          var Vt = [], Xt = {}, Dr = () => {
            if (!Jt) {
              var e = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _: O || "./this.program" }, o;
              for (o in Xt) Xt[o] === void 0 ? delete e[o] : e[o] = Xt[o];
              var u = [];
              for (o in e) u.push(`${o}=${e[o]}`);
              Jt = u;
            }
            return Jt;
          }, Jt;
          function Ur(e, o) {
            if (C) return z(18, 1, e, o);
            e >>>= 0, o >>>= 0;
            var u = 0;
            return Dr().forEach((p, T) => {
              var E = o + u;
              for (T = m()[e + 4 * T >>> 2 >>> 0] = E, E = 0; E < p.length; ++E) n()[T++ >>> 0] = p.charCodeAt(E);
              n()[T >>> 0] = 0, u += p.length + 1;
            }), 0;
          }
          function Fr(e, o) {
            if (C) return z(19, 1, e, o);
            e >>>= 0, o >>>= 0;
            var u = Dr();
            m()[e >>> 2 >>> 0] = u.length;
            var p = 0;
            return u.forEach((T) => p += T.length + 1), m()[o >>> 2 >>> 0] = p, 0;
          }
          function Ir(e) {
            return C ? z(20, 1, e) : 52;
          }
          function Br(e, o, u, p) {
            return C ? z(21, 1, e, o, u, p) : 52;
          }
          function Lr(e, o, u, p, T) {
            return C ? z(22, 1, e, o, u, p, T) : 70;
          }
          var ba = [null, [], []];
          function kr(e, o, u, p) {
            if (C) return z(23, 1, e, o, u, p);
            o >>>= 0, u >>>= 0, p >>>= 0;
            for (var T = 0, E = 0; E < u; E++) {
              var S = m()[o >>> 2 >>> 0], X = m()[o + 4 >>> 2 >>> 0];
              o += 8;
              for (var Fe = 0; Fe < X; Fe++) {
                var pe = f()[S + Fe >>> 0], ve = ba[e];
                pe === 0 || pe === 10 ? ((e === 1 ? $e : se)(N(ve, 0)), ve.length = 0) : ve.push(pe);
              }
              T += X;
            }
            return m()[p >>> 2 >>> 0] = T, 0;
          }
          var Nr = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Wr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          function va(e) {
            var o = Array(le(e) + 1);
            return mt(e, o, 0, o.length), o;
          }
          var Oa = (e, o) => {
            n().set(e, o >>> 0);
          };
          function Hr(e, o, u, p) {
            function T(w, G, J) {
              for (w = typeof w == "number" ? w.toString() : w || ""; w.length < G; ) w = J[0] + w;
              return w;
            }
            function E(w, G) {
              return T(w, G, "0");
            }
            function S(w, G) {
              function J(Jr) {
                return 0 > Jr ? -1 : 0 < Jr ? 1 : 0;
              }
              var qe;
              return (qe = J(w.getFullYear() - G.getFullYear())) === 0 && (qe = J(w.getMonth() - G.getMonth())) === 0 && (qe = J(w.getDate() - G.getDate())), qe;
            }
            function X(w) {
              switch (w.getDay()) {
                case 0:
                  return new Date(w.getFullYear() - 1, 11, 29);
                case 1:
                  return w;
                case 2:
                  return new Date(w.getFullYear(), 0, 3);
                case 3:
                  return new Date(w.getFullYear(), 0, 2);
                case 4:
                  return new Date(w.getFullYear(), 0, 1);
                case 5:
                  return new Date(w.getFullYear() - 1, 11, 31);
                case 6:
                  return new Date(w.getFullYear() - 1, 11, 30);
              }
            }
            function Fe(w) {
              var G = w.Qa;
              for (w = new Date(new Date(w.Ra + 1900, 0, 1).getTime()); 0 < G; ) {
                var J = w.getMonth(), qe = (tt(w.getFullYear()) ? Nr : Wr)[J];
                if (G > qe - w.getDate()) G -= qe - w.getDate() + 1, w.setDate(1), 11 > J ? w.setMonth(J + 1) : (w.setMonth(0), w.setFullYear(w.getFullYear() + 1));
                else {
                  w.setDate(w.getDate() + G);
                  break;
                }
              }
              return J = new Date(w.getFullYear() + 1, 0, 4), G = X(new Date(w.getFullYear(), 0, 4)), J = X(J), 0 >= S(G, w) ? 0 >= S(J, w) ? w.getFullYear() + 1 : w.getFullYear() : w.getFullYear() - 1;
            }
            e >>>= 0, o >>>= 0, u >>>= 0, p >>>= 0;
            var pe = m()[p + 40 >>> 2 >>> 0];
            p = { kb: i()[p >>> 2 >>> 0], jb: i()[p + 4 >>> 2 >>> 0], Sa: i()[p + 8 >>> 2 >>> 0], Wa: i()[p + 12 >>> 2 >>> 0], Ta: i()[p + 16 >>> 2 >>> 0], Ra: i()[p + 20 >>> 2 >>> 0], Ma: i()[p + 24 >>> 2 >>> 0], Qa: i()[p + 28 >>> 2 >>> 0], qb: i()[p + 32 >>> 2 >>> 0], ib: i()[p + 36 >>> 2 >>> 0], lb: pe ? ae(pe) : "" }, u = ae(u), pe = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
            for (var ve in pe) u = u.replace(new RegExp(ve, "g"), pe[ve]);
            var Vr = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), Xr = "January February March April May June July August September October November December".split(" ");
            pe = { "%a": (w) => Vr[w.Ma].substring(0, 3), "%A": (w) => Vr[w.Ma], "%b": (w) => Xr[w.Ta].substring(0, 3), "%B": (w) => Xr[w.Ta], "%C": (w) => E((w.Ra + 1900) / 100 | 0, 2), "%d": (w) => E(w.Wa, 2), "%e": (w) => T(w.Wa, 2, " "), "%g": (w) => Fe(w).toString().substring(2), "%G": Fe, "%H": (w) => E(w.Sa, 2), "%I": (w) => (w = w.Sa, w == 0 ? w = 12 : 12 < w && (w -= 12), E(w, 2)), "%j": (w) => {
              for (var G = 0, J = 0; J <= w.Ta - 1; G += (tt(w.Ra + 1900) ? Nr : Wr)[J++]) ;
              return E(w.Wa + G, 3);
            }, "%m": (w) => E(w.Ta + 1, 2), "%M": (w) => E(w.jb, 2), "%n": () => `
`, "%p": (w) => 0 <= w.Sa && 12 > w.Sa ? "AM" : "PM", "%S": (w) => E(w.kb, 2), "%t": () => "	", "%u": (w) => w.Ma || 7, "%U": (w) => E(Math.floor((w.Qa + 7 - w.Ma) / 7), 2), "%V": (w) => {
              var G = Math.floor((w.Qa + 7 - (w.Ma + 6) % 7) / 7);
              if (2 >= (w.Ma + 371 - w.Qa - 2) % 7 && G++, G) G == 53 && (J = (w.Ma + 371 - w.Qa) % 7, J == 4 || J == 3 && tt(w.Ra) || (G = 1));
              else {
                G = 52;
                var J = (w.Ma + 7 - w.Qa - 1) % 7;
                (J == 4 || J == 5 && tt(w.Ra % 400 - 1)) && G++;
              }
              return E(G, 2);
            }, "%w": (w) => w.Ma, "%W": (w) => E(Math.floor((w.Qa + 7 - (w.Ma + 6) % 7) / 7), 2), "%y": (w) => (w.Ra + 1900).toString().substring(2), "%Y": (w) => w.Ra + 1900, "%z": (w) => {
              w = w.ib;
              var G = 0 <= w;
              return w = Math.abs(w) / 60, (G ? "+" : "-") + ("0000" + (w / 60 * 100 + w % 60)).slice(-4);
            }, "%Z": (w) => w.lb, "%%": () => "%" }, u = u.replace(/%%/g, "\0\0");
            for (ve in pe) u.includes(ve) && (u = u.replace(new RegExp(ve, "g"), pe[ve](p)));
            return u = u.replace(/\0\0/g, "%"), ve = va(u), ve.length > o ? 0 : (Oa(ve, e), ve.length - 1);
          }
          I.Va();
          var Ea = [lt, St, b, Ee, fe, y, $, Y, Ue, ht, Er, _r, Tr, Ar, Sr, Mr, xr, Rr, Ur, Fr, Ir, Br, Lr, kr], _a = { b: function(e, o, u) {
            throw e >>>= 0, new a(e).Va(o >>> 0, u >>> 0), l = e, d++, l;
          }, L: function(e) {
            $r(e >>> 0, !U, 1, !P, 131072, false), I.$a();
          }, j: function(e) {
            e >>>= 0, C ? postMessage({ cmd: "cleanupThread", thread: e }) : I.Ya(I.La[e]);
          }, H: A, h: Ee, S: fe, D: y, F: $, T: Y, Q: Ue, J: ht, P: Er, n: _r, E: Tr, B: Ar, R: Sr, C: Mr, p: () => 1, z: function(e, o) {
            e >>>= 0, e == o >>> 0 ? setTimeout(Mt) : C ? postMessage({ targetThread: e, cmd: "checkMailbox" }) : (e = I.La[e]) && e.postMessage({ cmd: "checkMailbox" });
          }, I: function(e, o, u, p, T) {
            o >>>= 0, u >>>= 0, qt.length = p, T = T >>> 0 >>> 3;
            for (var E = 0; E < p; E++) qt[E] = c()[T + E >>> 0];
            return e = o ? et[o] : Ea[e], I.eb = u, u = e(...qt), I.eb = 0, u;
          }, K: Yt, o: function(e) {
            D && I.La[e >>> 0].ref();
          }, s: function(e, o, u) {
            e = o + 2097152 >>> 0 < 4194305 - !!e ? (e >>> 0) + 4294967296 * o : NaN, u >>>= 0, e = new Date(1e3 * e), i()[u >>> 2 >>> 0] = e.getUTCSeconds(), i()[u + 4 >>> 2 >>> 0] = e.getUTCMinutes(), i()[u + 8 >>> 2 >>> 0] = e.getUTCHours(), i()[u + 12 >>> 2 >>> 0] = e.getUTCDate(), i()[u + 16 >>> 2 >>> 0] = e.getUTCMonth(), i()[u + 20 >>> 2 >>> 0] = e.getUTCFullYear() - 1900, i()[u + 24 >>> 2 >>> 0] = e.getUTCDay(), e = (e.getTime() - Date.UTC(e.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5 | 0, i()[u + 28 >>> 2 >>> 0] = e;
          }, t: function(e, o, u) {
            e = o + 2097152 >>> 0 < 4194305 - !!e ? (e >>> 0) + 4294967296 * o : NaN, u >>>= 0, e = new Date(1e3 * e), i()[u >>> 2 >>> 0] = e.getSeconds(), i()[u + 4 >>> 2 >>> 0] = e.getMinutes(), i()[u + 8 >>> 2 >>> 0] = e.getHours(), i()[u + 12 >>> 2 >>> 0] = e.getDate(), i()[u + 16 >>> 2 >>> 0] = e.getMonth(), i()[u + 20 >>> 2 >>> 0] = e.getFullYear() - 1900, i()[u + 24 >>> 2 >>> 0] = e.getDay(), o = (tt(e.getFullYear()) ? Cr : Pr)[e.getMonth()] + e.getDate() - 1 | 0, i()[u + 28 >>> 2 >>> 0] = o, i()[u + 36 >>> 2 >>> 0] = -(60 * e.getTimezoneOffset()), o = new Date(e.getFullYear(), 6, 1).getTimezoneOffset();
            var p = new Date(e.getFullYear(), 0, 1).getTimezoneOffset();
            e = (o != p && e.getTimezoneOffset() == Math.min(p, o)) | 0, i()[u + 32 >>> 2 >>> 0] = e;
          }, u: function(e) {
            e >>>= 0;
            var o = new Date(i()[e + 20 >>> 2 >>> 0] + 1900, i()[e + 16 >>> 2 >>> 0], i()[e + 12 >>> 2 >>> 0], i()[e + 8 >>> 2 >>> 0], i()[e + 4 >>> 2 >>> 0], i()[e >>> 2 >>> 0], 0), u = i()[e + 32 >>> 2 >>> 0], p = o.getTimezoneOffset(), T = new Date(o.getFullYear(), 6, 1).getTimezoneOffset(), E = new Date(o.getFullYear(), 0, 1).getTimezoneOffset(), S = Math.min(E, T);
            return 0 > u ? i()[e + 32 >>> 2 >>> 0] = +(T != E && S == p) : 0 < u != (S == p) && (T = Math.max(E, T), o.setTime(o.getTime() + 6e4 * ((0 < u ? S : T) - p))), i()[e + 24 >>> 2 >>> 0] = o.getDay(), u = (tt(o.getFullYear()) ? Cr : Pr)[o.getMonth()] + o.getDate() - 1 | 0, i()[e + 28 >>> 2 >>> 0] = u, i()[e >>> 2 >>> 0] = o.getSeconds(), i()[e + 4 >>> 2 >>> 0] = o.getMinutes(), i()[e + 8 >>> 2 >>> 0] = o.getHours(), i()[e + 12 >>> 2 >>> 0] = o.getDate(), i()[e + 16 >>> 2 >>> 0] = o.getMonth(), i()[e + 20 >>> 2 >>> 0] = o.getYear(), e = o.getTime(), e = isNaN(e) ? -1 : e / 1e3, zr((De = e, 1 <= +Math.abs(De) ? 0 < De ? +Math.floor(De / 4294967296) >>> 0 : ~~+Math.ceil((De - +(~~De >>> 0)) / 4294967296) >>> 0 : 0)), e >>> 0;
          }, q: xr, r: Rr, y: function(e, o, u, p) {
            e >>>= 0, o >>>= 0, u >>>= 0, p >>>= 0;
            var T = (/* @__PURE__ */ new Date()).getFullYear(), E = new Date(T, 0, 1), S = new Date(T, 6, 1);
            T = E.getTimezoneOffset();
            var X = S.getTimezoneOffset(), Fe = Math.max(T, X);
            m()[e >>> 2 >>> 0] = 60 * Fe, i()[o >>> 2 >>> 0] = +(T != X), e = (pe) => pe.toLocaleTimeString(void 0, { hour12: false, timeZoneName: "short" }).split(" ")[1], E = e(E), S = e(S), X < T ? (He(E, u, 17), He(S, p, 17)) : (He(E, p, 17), He(S, u, 17));
          }, c: () => {
            oe("");
          }, O: function(e, o, u) {
            e >>>= 0, o >>>= 0, u >>>= 0, Vt.length = 0;
            for (var p; p = f()[o++ >>> 0]; ) {
              var T = p != 105;
              T &= p != 112, u += T && u % 8 ? 4 : 0, Vt.push(p == 112 ? m()[u >>> 2 >>> 0] : p == 105 ? i()[u >>> 2 >>> 0] : c()[u >>> 3 >>> 0]), u += T ? 8 : 4;
            }
            return et[e](...Vt);
          }, k: () => {
          }, i: () => Date.now(), U: () => {
            throw Ie += 1, "unwind";
          }, A: function() {
            return 4294901760;
          }, e: () => performance.timeOrigin + performance.now(), f: () => D ? (In(), nt(Fn)).cpus().length : navigator.hardwareConcurrency, x: function(e) {
            e >>>= 0;
            var o = f().length;
            if (e <= o || 4294901760 < e) return false;
            for (var u = 1; 4 >= u; u *= 2) {
              var p = o * (1 + 0.2 / u);
              p = Math.min(p, e + 100663296);
              var T = Math;
              p = Math.max(e, p);
              e: {
                T = (T.min.call(T, 4294901760, p + (65536 - p % 65536) % 65536) - K.buffer.byteLength + 65535) / 65536;
                try {
                  K.grow(T), ne();
                  var E = 1;
                  break e;
                } catch {
                }
                E = void 0;
              }
              if (E) return true;
            }
            return false;
          }, M: Ur, N: Fr, G: ct, g: Ir, m: Br, v: Lr, l: kr, a: K || s.wasmMemory, w: Hr, d: function(e, o, u, p) {
            return Hr(e >>> 0, o >>> 0, u >>> 0, p >>> 0);
          } }, B = (function() {
            function e(u, p) {
              return B = u.exports, B = Ta(), I.ab.push(B.ya), pt = B.za, Ne.unshift(B.V), Ae = p, Ge(), B;
            }
            var o = { a: _a };
            if (Re++, s.instantiateWasm) try {
              return s.instantiateWasm(o, e);
            } catch (u) {
              se(`Module.instantiateWasm callback failed with error: ${u}`), g(u);
            }
            return Et(o, function(u) {
              e(u.instance, u.module);
            }).catch(g), {};
          })();
          s._OrtInit = (e, o) => (s._OrtInit = B.W)(e, o), s._OrtGetLastError = (e, o) => (s._OrtGetLastError = B.X)(e, o), s._OrtCreateSessionOptions = (e, o, u, p, T, E, S, X, Fe, pe) => (s._OrtCreateSessionOptions = B.Y)(e, o, u, p, T, E, S, X, Fe, pe), s._OrtAppendExecutionProvider = (e, o) => (s._OrtAppendExecutionProvider = B.Z)(e, o), s._OrtAddFreeDimensionOverride = (e, o, u) => (s._OrtAddFreeDimensionOverride = B._)(e, o, u), s._OrtAddSessionConfigEntry = (e, o, u) => (s._OrtAddSessionConfigEntry = B.$)(e, o, u), s._OrtReleaseSessionOptions = (e) => (s._OrtReleaseSessionOptions = B.aa)(e), s._OrtCreateSession = (e, o, u) => (s._OrtCreateSession = B.ba)(e, o, u), s._OrtReleaseSession = (e) => (s._OrtReleaseSession = B.ca)(e), s._OrtGetInputOutputCount = (e, o, u) => (s._OrtGetInputOutputCount = B.da)(e, o, u), s._OrtGetInputName = (e, o) => (s._OrtGetInputName = B.ea)(e, o), s._OrtGetOutputName = (e, o) => (s._OrtGetOutputName = B.fa)(e, o), s._OrtFree = (e) => (s._OrtFree = B.ga)(e), s._OrtCreateTensor = (e, o, u, p, T, E) => (s._OrtCreateTensor = B.ha)(e, o, u, p, T, E), s._OrtGetTensorData = (e, o, u, p, T) => (s._OrtGetTensorData = B.ia)(e, o, u, p, T), s._OrtReleaseTensor = (e) => (s._OrtReleaseTensor = B.ja)(e), s._OrtCreateRunOptions = (e, o, u, p) => (s._OrtCreateRunOptions = B.ka)(e, o, u, p), s._OrtAddRunConfigEntry = (e, o, u) => (s._OrtAddRunConfigEntry = B.la)(e, o, u), s._OrtReleaseRunOptions = (e) => (s._OrtReleaseRunOptions = B.ma)(e), s._OrtCreateBinding = (e) => (s._OrtCreateBinding = B.na)(e), s._OrtBindInput = (e, o, u) => (s._OrtBindInput = B.oa)(e, o, u), s._OrtBindOutput = (e, o, u, p) => (s._OrtBindOutput = B.pa)(e, o, u, p), s._OrtClearBoundOutputs = (e) => (s._OrtClearBoundOutputs = B.qa)(e), s._OrtReleaseBinding = (e) => (s._OrtReleaseBinding = B.ra)(e), s._OrtRunWithBinding = (e, o, u, p, T) => (s._OrtRunWithBinding = B.sa)(e, o, u, p, T), s._OrtRun = (e, o, u, p, T, E, S, X) => (s._OrtRun = B.ta)(e, o, u, p, T, E, S, X), s._OrtEndProfiling = (e) => (s._OrtEndProfiling = B.ua)(e);
          var Ct = s._pthread_self = () => (Ct = s._pthread_self = B.va)();
          s._malloc = (e) => (s._malloc = B.wa)(e), s._free = (e) => (s._free = B.xa)(e), s.__emscripten_tls_init = () => (s.__emscripten_tls_init = B.ya)();
          var $r = s.__emscripten_thread_init = (e, o, u, p, T, E) => ($r = s.__emscripten_thread_init = B.Aa)(e, o, u, p, T, E);
          s.__emscripten_thread_crashed = () => (s.__emscripten_thread_crashed = B.Ba)();
          var Gr = (e, o, u, p, T) => (Gr = B.Ca)(e, o, u, p, T), Zt = (e) => (Zt = B.Da)(e), Qt = s.__emscripten_thread_exit = (e) => (Qt = s.__emscripten_thread_exit = B.Ea)(e), jr = () => (jr = B.Fa)(), zr = (e) => (zr = B.Ga)(e), Yr = (e, o) => (Yr = B.Ha)(e, o), Pt = (e) => (Pt = B.Ia)(e), Kt = (e) => (Kt = B.Ja)(e), er = () => (er = B.Ka)();
          function Ta() {
            var e = B;
            e = Object.assign({}, e);
            var o = (p) => () => p() >>> 0, u = (p) => (T) => p(T) >>> 0;
            return e.va = o(e.va), e.wa = u(e.wa), e.emscripten_main_runtime_thread_id = o(e.emscripten_main_runtime_thread_id), e.Ja = u(e.Ja), e.Ka = o(e.Ka), e;
          }
          s.wasmMemory = K, s.stackSave = () => er(), s.stackRestore = (e) => Pt(e), s.stackAlloc = (e) => Kt(e), s.keepRuntimeAlive = () => 0 < Ie, s.UTF8ToString = ae, s.stringToUTF8 = He, s.lengthBytesUTF8 = le, s.ExitStatus = je, s.PThread = I;
          var xt;
          be = function e() {
            xt || qr(), xt || (be = e);
          };
          function qr() {
            if (!(0 < Re)) if (C) h(s), C || Ye(Ne), startWorker(s);
            else {
              if (s.preRun) for (typeof s.preRun == "function" && (s.preRun = [s.preRun]); s.preRun.length; ) Se.unshift(s.preRun.shift());
              Ye(Se), 0 < Re || xt || (xt = true, s.calledRun = true, we || (C || Ye(Ne), h(s), C || Ye(Me)));
            }
          }
          return qr(), _;
        };
      })();
      typeof Ln == "object" && typeof cr == "object" ? cr.exports = Bn : typeof define == "function" && define.amd && define([], () => Bn);
    });
    Nn = rt((Zo, La) => {
      La.exports = '"use strict";var Module={},ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";if(ENVIRONMENT_IS_NODE){var nodeWorkerThreads=require("worker_threads"),parentPort=nodeWorkerThreads.parentPort;parentPort.on("message",e=>onmessage({data:e}));var fs=require("fs"),vm=require("vm");Object.assign(global,{self:global,require,Module,location:{href:__filename},Worker:nodeWorkerThreads.Worker,importScripts:e=>vm.runInThisContext(fs.readFileSync(e,"utf8"),{filename:e}),postMessage:e=>parentPort.postMessage(e),performance:global.performance||{now:Date.now}})}var initializedJS=!1;function threadPrintErr(...e){var a=e.join(" ");if(ENVIRONMENT_IS_NODE){fs.writeSync(2,a+`\n`);return}console.error(a)}function threadAlert(...e){var a=e.join(" ");postMessage({cmd:"alert",text:a,threadId:Module._pthread_self()})}var err=threadPrintErr;self.alert=threadAlert,Module.instantiateWasm=(e,a)=>{var r=Module.wasmModule;Module.wasmModule=null;var t=new WebAssembly.Instance(r,e);return a(t)},self.onunhandledrejection=e=>{throw e.reason||e};function handleMessage(e){try{if(e.data.cmd==="load"){let r=[];self.onmessage=t=>r.push(t),self.startWorker=t=>{Module=t,postMessage({cmd:"loaded"});for(let s of r)handleMessage(s);self.onmessage=handleMessage},Module.wasmModule=e.data.wasmModule;for(const t of e.data.handlers)Module[t]=(...s)=>{postMessage({cmd:"callHandler",handler:t,args:s})};if(Module.wasmMemory=e.data.wasmMemory,Module.buffer=Module.wasmMemory.buffer,Module.ENVIRONMENT_IS_PTHREAD=!0,typeof e.data.urlOrBlob=="string")importScripts(e.data.urlOrBlob);else{var a=URL.createObjectURL(e.data.urlOrBlob);importScripts(a),URL.revokeObjectURL(a)}ortWasmThreaded(Module)}else if(e.data.cmd==="run"){Module.__emscripten_thread_init(e.data.pthread_ptr,0,0,1),Module.__emscripten_thread_mailbox_await(e.data.pthread_ptr),Module.establishStackSpace(),Module.PThread.receiveObjectTransfer(e.data),Module.PThread.threadInitTLS(),initializedJS||(initializedJS=!0);try{Module.invokeEntryPoint(e.data.start_routine,e.data.arg)}catch(r){if(r!="unwind")throw r}}else e.data.cmd==="cancel"?Module._pthread_self()&&Module.__emscripten_thread_exit(-1):e.data.target==="setimmediate"||(e.data.cmd==="checkMailbox"?initializedJS&&Module.checkMailbox():e.data.cmd&&(err(`worker.js received unknown command ${e.data.cmd}`),err(e.data)))}catch(r){throw Module.__emscripten_thread_crashed?.(),r}}self.onmessage=handleMessage;\n';
    });
    at = H(() => {
      "use strict";
      Hn = Rn();
      ka = kn(), pr = false, kt = false, Wn = false, Na = (r) => {
        if (r === 1) return false;
        if (typeof SharedArrayBuffer > "u") return typeof self < "u" && !self.crossOriginIsolated && console.warn("env.wasm.numThreads is set to " + r + ", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."), false;
        typeof process < "u" && process.versions && process.versions.node && console.warn("env.wasm.numThreads is set to " + r + ", however, currently onnxruntime-web does not support multi-threads in Node.js. Please consider using onnxruntime-node for performance critical scenarios.");
        try {
          return typeof MessageChannel < "u" && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11]));
        } catch {
          return false;
        }
      }, Wa = () => {
        try {
          return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 30, 1, 28, 0, 65, 0, 253, 15, 253, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 186, 1, 26, 11]));
        } catch {
          return false;
        }
      }, Ha = (r, t) => r ? t ? "ort-wasm-simd-threaded.wasm" : "ort-wasm-simd.wasm" : t ? "ort-wasm-threaded.wasm" : "ort-wasm.wasm", $n = async (r) => {
        if (pr) return Promise.resolve();
        if (kt) throw new Error("multiple calls to 'initializeWebAssembly()' detected.");
        if (Wn) throw new Error("previous call to 'initializeWebAssembly()' failed.");
        kt = true;
        let t = r.initTimeout, n = r.numThreads, f = r.simd, i = Na(n), m = f && Wa(), c = r.wasmPaths, s = typeof c == "string" ? c : void 0, h = Ha(m, i), g = typeof c == "object" ? c[h] : void 0, _ = false, v = [];
        if (t > 0 && v.push(new Promise((O) => {
          setTimeout(() => {
            _ = true, O();
          }, t);
        })), v.push(new Promise((O, M) => {
          let P = i ? ka : Hn, U = { locateFile: (D, C) => i && D.endsWith(".worker.js") && typeof Blob < "u" ? URL.createObjectURL(new Blob([Nn()], { type: "text/javascript" })) : D.endsWith(".wasm") ? g || (s ?? C) + h : C + D };
          if (i) if (U.numThreads = n, typeof Blob > "u") U.mainScriptUrlOrBlob = (void 0)(__dirname, "ort-wasm-threaded.js");
          else {
            let D = `var ortWasmThreaded=${P.toString()};`;
            U.mainScriptUrlOrBlob = new Blob([D], { type: "text/javascript" });
          }
          P(U).then((D) => {
            kt = false, pr = true, dr = D, O();
          }, (D) => {
            kt = false, Wn = true, M(D);
          });
        })), await Promise.race(v), _) throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`);
      }, ee = () => {
        if (pr && dr) return dr;
        throw new Error("WebAssembly is not initialized yet.");
      };
    });
    Nt = H(() => {
      "use strict";
      at();
      q = (r, t) => {
        let n = ee(), f = n.lengthBytesUTF8(r) + 1, i = n._malloc(f);
        return n.stringToUTF8(r, i, f), t.push(i), i;
      }, bt = (r, t, n, f) => {
        if (typeof r == "object" && r !== null) {
          if (n.has(r)) throw new Error("Circular reference in options");
          n.add(r);
        }
        Object.entries(r).forEach(([i, m]) => {
          let c = t ? t + i : i;
          if (typeof m == "object") bt(m, c + ".", n, f);
          else if (typeof m == "string" || typeof m == "number") f(c, m.toString());
          else if (typeof m == "boolean") f(c, m ? "1" : "0");
          else throw new Error(`Can't handle extra config type: ${typeof m}`);
        });
      }, V = (r) => {
        let t = ee(), n = t.stackSave();
        try {
          let f = t.stackAlloc(8);
          t._OrtGetLastError(f, f + 4);
          let i = t.HEAP32[f / 4], m = t.HEAPU32[f / 4 + 1], c = m ? t.UTF8ToString(m) : "";
          throw new Error(`${r} ERROR_CODE: ${i}, ERROR_MESSAGE: ${c}`);
        } finally {
          t.stackRestore(n);
        }
      };
    });
    jn = H(() => {
      "use strict";
      at();
      Nt();
      Gn = (r) => {
        let t = ee(), n = 0, f = [], i = r || {};
        try {
          if (r?.logSeverityLevel === void 0) i.logSeverityLevel = 2;
          else if (typeof r.logSeverityLevel != "number" || !Number.isInteger(r.logSeverityLevel) || r.logSeverityLevel < 0 || r.logSeverityLevel > 4) throw new Error(`log serverity level is not valid: ${r.logSeverityLevel}`);
          if (r?.logVerbosityLevel === void 0) i.logVerbosityLevel = 0;
          else if (typeof r.logVerbosityLevel != "number" || !Number.isInteger(r.logVerbosityLevel)) throw new Error(`log verbosity level is not valid: ${r.logVerbosityLevel}`);
          r?.terminate === void 0 && (i.terminate = false);
          let m = 0;
          return r?.tag !== void 0 && (m = q(r.tag, f)), n = t._OrtCreateRunOptions(i.logSeverityLevel, i.logVerbosityLevel, !!i.terminate, m), n === 0 && V("Can't create run options."), r?.extra !== void 0 && bt(r.extra, "", /* @__PURE__ */ new WeakSet(), (c, s) => {
            let h = q(c, f), g = q(s, f);
            t._OrtAddRunConfigEntry(n, h, g) !== 0 && V(`Can't set a run config entry: ${c} - ${s}.`);
          }), [n, f];
        } catch (m) {
          throw n !== 0 && t._OrtReleaseRunOptions(n), f.forEach((c) => t._free(c)), m;
        }
      };
    });
    Yn = H(() => {
      "use strict";
      at();
      Nt();
      $a = (r) => {
        switch (r) {
          case "disabled":
            return 0;
          case "basic":
            return 1;
          case "extended":
            return 2;
          case "all":
            return 99;
          default:
            throw new Error(`unsupported graph optimization level: ${r}`);
        }
      }, Ga = (r) => {
        switch (r) {
          case "sequential":
            return 0;
          case "parallel":
            return 1;
          default:
            throw new Error(`unsupported execution mode: ${r}`);
        }
      }, ja = (r) => {
        r.extra || (r.extra = {}), r.extra.session || (r.extra.session = {});
        let t = r.extra.session;
        t.use_ort_model_bytes_directly || (t.use_ort_model_bytes_directly = "1"), r.executionProviders && r.executionProviders.some((n) => (typeof n == "string" ? n : n.name) === "webgpu") && (r.enableMemPattern = false);
      }, za = (r, t, n) => {
        for (let f of t) {
          let i = typeof f == "string" ? f : f.name;
          switch (i) {
            case "webnn":
              if (i = "WEBNN", typeof f != "string") {
                let c = f;
                if (c?.deviceType) {
                  let s = q("deviceType", n), h = q(c.deviceType, n);
                  ee()._OrtAddSessionConfigEntry(r, s, h) !== 0 && V(`Can't set a session config entry: 'deviceType' - ${c.deviceType}.`);
                }
                if (c?.numThreads) {
                  let s = c.numThreads;
                  (typeof s != "number" || !Number.isInteger(s) || s < 0) && (s = 0);
                  let h = q("numThreads", n), g = q(s.toString(), n);
                  ee()._OrtAddSessionConfigEntry(r, h, g) !== 0 && V(`Can't set a session config entry: 'numThreads' - ${c.numThreads}.`);
                }
                if (c?.powerPreference) {
                  let s = q("powerPreference", n), h = q(c.powerPreference, n);
                  ee()._OrtAddSessionConfigEntry(r, s, h) !== 0 && V(`Can't set a session config entry: 'powerPreference' - ${c.powerPreference}.`);
                }
              }
              break;
            case "webgpu":
              if (i = "JS", typeof f != "string") {
                let c = f;
                if (c?.preferredLayout) {
                  if (c.preferredLayout !== "NCHW" && c.preferredLayout !== "NHWC") throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${c.preferredLayout}`);
                  let s = q("preferredLayout", n), h = q(c.preferredLayout, n);
                  ee()._OrtAddSessionConfigEntry(r, s, h) !== 0 && V(`Can't set a session config entry: 'preferredLayout' - ${c.preferredLayout}.`);
                }
              }
              break;
            case "wasm":
            case "cpu":
              continue;
            default:
              throw new Error(`not supported execution provider: ${i}`);
          }
          let m = q(i, n);
          ee()._OrtAppendExecutionProvider(r, m) !== 0 && V(`Can't append execution provider: ${i}.`);
        }
      }, zn = (r) => {
        let t = ee(), n = 0, f = [], i = r || {};
        ja(i);
        try {
          let m = $a(i.graphOptimizationLevel ?? "all"), c = Ga(i.executionMode ?? "sequential"), s = typeof i.logId == "string" ? q(i.logId, f) : 0, h = i.logSeverityLevel ?? 2;
          if (!Number.isInteger(h) || h < 0 || h > 4) throw new Error(`log serverity level is not valid: ${h}`);
          let g = i.logVerbosityLevel ?? 0;
          if (!Number.isInteger(g) || g < 0 || g > 4) throw new Error(`log verbosity level is not valid: ${g}`);
          let _ = typeof i.optimizedModelFilePath == "string" ? q(i.optimizedModelFilePath, f) : 0;
          if (n = t._OrtCreateSessionOptions(m, !!i.enableCpuMemArena, !!i.enableMemPattern, c, !!i.enableProfiling, 0, s, h, g, _), n === 0 && V("Can't create session options."), i.executionProviders && za(n, i.executionProviders, f), i.enableGraphCapture !== void 0) {
            if (typeof i.enableGraphCapture != "boolean") throw new Error(`enableGraphCapture must be a boolean value: ${i.enableGraphCapture}`);
            let v = q("enableGraphCapture", f), O = q(i.enableGraphCapture.toString(), f);
            t._OrtAddSessionConfigEntry(n, v, O) !== 0 && V(`Can't set a session config entry: 'enableGraphCapture' - ${i.enableGraphCapture}.`);
          }
          if (i.freeDimensionOverrides) for (let [v, O] of Object.entries(i.freeDimensionOverrides)) {
            if (typeof v != "string") throw new Error(`free dimension override name must be a string: ${v}`);
            if (typeof O != "number" || !Number.isInteger(O) || O < 0) throw new Error(`free dimension override value must be a non-negative integer: ${O}`);
            let M = q(v, f);
            t._OrtAddFreeDimensionOverride(n, M, O) !== 0 && V(`Can't set a free dimension override: ${v} - ${O}.`);
          }
          return i.extra !== void 0 && bt(i.extra, "", /* @__PURE__ */ new WeakSet(), (v, O) => {
            let M = q(v, f), P = q(O, f);
            t._OrtAddSessionConfigEntry(n, M, P) !== 0 && V(`Can't set a session config entry: ${v} - ${O}.`);
          }), [n, f];
        } catch (m) {
          throw n !== 0 && t._OrtReleaseSessionOptions(n), f.forEach((c) => t._free(c)), m;
        }
      };
    });
    gr = H(() => {
      "use strict";
      mr = (r) => {
        switch (r) {
          case "int8":
            return 3;
          case "uint8":
            return 2;
          case "bool":
            return 9;
          case "int16":
            return 5;
          case "uint16":
            return 4;
          case "int32":
            return 6;
          case "uint32":
            return 12;
          case "float16":
            return 10;
          case "float32":
            return 1;
          case "float64":
            return 11;
          case "string":
            return 8;
          case "int64":
            return 7;
          case "uint64":
            return 13;
          default:
            throw new Error(`unsupported data type: ${r}`);
        }
      }, qn = (r) => {
        switch (r) {
          case 3:
            return "int8";
          case 2:
            return "uint8";
          case 9:
            return "bool";
          case 5:
            return "int16";
          case 4:
            return "uint16";
          case 6:
            return "int32";
          case 12:
            return "uint32";
          case 10:
            return "float16";
          case 1:
            return "float32";
          case 11:
            return "float64";
          case 8:
            return "string";
          case 7:
            return "int64";
          case 13:
            return "uint64";
          default:
            throw new Error(`unsupported data type: ${r}`);
        }
      }, hr = (r) => [void 0, 4, 1, 1, 2, 2, 4, 8, void 0, 1, 2, 8, 4, 8, void 0, void 0, void 0][r], Vn = (r) => {
        switch (r) {
          case "float16":
            return typeof Float16Array < "u" && Float16Array.from ? Float16Array : Uint16Array;
          case "float32":
            return Float32Array;
          case "uint8":
            return Uint8Array;
          case "int8":
            return Int8Array;
          case "uint16":
            return Uint16Array;
          case "int16":
            return Int16Array;
          case "int32":
            return Int32Array;
          case "bool":
            return Uint8Array;
          case "float64":
            return Float64Array;
          case "uint32":
            return Uint32Array;
          case "int64":
            return BigInt64Array;
          case "uint64":
            return BigUint64Array;
          default:
            throw new Error(`unsupported type: ${r}`);
        }
      }, Xn = (r) => {
        switch (r) {
          case "verbose":
            return 0;
          case "info":
            return 1;
          case "warning":
            return 2;
          case "error":
            return 3;
          case "fatal":
            return 4;
          default:
            throw new Error(`unsupported logging level: ${r}`);
        }
      }, Wt = (r) => r === "float32" || r === "float16" || r === "int32" || r === "int64" || r === "uint32" || r === "uint8" || r === "bool", Jn = (r) => {
        switch (r) {
          case "none":
            return 0;
          case "cpu":
            return 1;
          case "cpu-pinned":
            return 2;
          case "texture":
            return 3;
          case "gpu-buffer":
            return 4;
          default:
            throw new Error(`unsupported data location: ${r}`);
        }
      };
    });
    yr = H(() => {
      "use strict";
      vt = async (r) => {
        if (typeof r == "string") if (typeof process < "u" && process.versions && process.versions.node) try {
          return new Uint8Array(await (void 0)(r));
        } catch (t) {
          if (t.code === "ERR_FS_FILE_TOO_LARGE") {
            let n = (void 0)(r), f = [];
            for await (let i of n) f.push(i);
            return new Uint8Array(Buffer.concat(f));
          }
          throw t;
        }
        else {
          let t = await fetch(r);
          if (!t.ok) throw new Error(`failed to load external data file: ${r}`);
          let n = t.headers.get("Content-Length"), f = n ? parseInt(n, 10) : 0;
          if (f < 1073741824) return new Uint8Array(await t.arrayBuffer());
          {
            if (!t.body) throw new Error(`failed to load external data file: ${r}, no response body.`);
            let i = t.body.getReader(), m;
            try {
              m = new ArrayBuffer(f);
            } catch (s) {
              if (s instanceof RangeError) {
                let h = Math.ceil(f / 65536);
                m = new WebAssembly.Memory({ initial: h, maximum: h }).buffer;
              } else throw s;
            }
            let c = 0;
            for (; ; ) {
              let { done: s, value: h } = await i.read();
              if (s) break;
              let g = h.byteLength;
              new Uint8Array(m, c, g).set(h), c += g;
            }
            return new Uint8Array(m, 0, f);
          }
        }
        else return r instanceof Blob ? new Uint8Array(await r.arrayBuffer()) : r instanceof Uint8Array ? r : new Uint8Array(r);
      };
    });
    oa = H(() => {
      "use strict";
      jn();
      Yn();
      gr();
      at();
      Nt();
      yr();
      Ya = (r, t) => {
        ee()._OrtInit(r, t) !== 0 && V("Can't initialize onnxruntime.");
      }, Qn = async (r) => {
        Ya(r.wasm.numThreads, Xn(r.logLevel));
      }, Kn = async (r, t) => {
      }, ot = /* @__PURE__ */ new Map(), qa = (r) => {
        let t = ee(), n = t.stackSave();
        try {
          let f = t.stackAlloc(8);
          return t._OrtGetInputOutputCount(r, f, f + 4) !== 0 && V("Can't get session input/output count."), [t.HEAP32[f / 4], t.HEAP32[f / 4 + 1]];
        } finally {
          t.stackRestore(n);
        }
      }, wr = (r) => {
        let t = ee(), n = t._malloc(r.byteLength);
        if (n === 0) throw new Error(`Can't create a session. failed to allocate a buffer of size ${r.byteLength}.`);
        return t.HEAPU8.set(r, n), [n, r.byteLength];
      }, ea = async (r, t) => {
        let n, f, i = ee();
        Array.isArray(r) ? [n, f] = r : r.buffer === i.HEAPU8.buffer ? [n, f] = [r.byteOffset, r.byteLength] : [n, f] = wr(r);
        let m = 0, c = 0, s = 0, h = [], g = [], _ = [];
        try {
          if ([c, h] = zn(t), t?.externalData && i.mountExternalData) {
            let F = [];
            for (let W of t.externalData) {
              let Z = typeof W == "string" ? W : W.path;
              F.push(vt(typeof W == "string" ? W : W.data).then((te) => {
                i.mountExternalData(Z, te);
              }));
            }
            await Promise.all(F);
          }
          m = await i._OrtCreateSession(n, f, c), m === 0 && V("Can't create a session.");
          let [v, O] = qa(m), M = !!t?.enableGraphCapture, P = [], U = [], D = [];
          for (let F = 0; F < v; F++) {
            let W = i._OrtGetInputName(m, F);
            W === 0 && V("Can't get an input name."), g.push(W), P.push(i.UTF8ToString(W));
          }
          for (let F = 0; F < O; F++) {
            let W = i._OrtGetOutputName(m, F);
            W === 0 && V("Can't get an output name."), _.push(W);
            let Z = i.UTF8ToString(W);
            U.push(Z);
          }
          let C = null;
          return ot.set(m, [m, g, _, C, M, false]), [m, P, U];
        } catch (v) {
          throw g.forEach((O) => i._OrtFree(O)), _.forEach((O) => i._OrtFree(O)), s !== 0 && i._OrtReleaseBinding(s), m !== 0 && i._OrtReleaseSession(m), v;
        } finally {
          i._free(n), c !== 0 && i._OrtReleaseSessionOptions(c), h.forEach((v) => i._free(v)), i.unmountExternalData?.();
        }
      }, ta = (r) => {
        let t = ee(), n = ot.get(r);
        if (!n) throw new Error(`cannot release session. invalid session id: ${r}`);
        let [f, i, m, c, s] = n;
        c && (s && t._OrtClearBoundOutputs(c.handle), t._OrtReleaseBinding(c.handle)), t.jsepOnReleaseSession?.(r), i.forEach((h) => t._OrtFree(h)), m.forEach((h) => t._OrtFree(h)), t._OrtReleaseSession(f), ot.delete(r);
      }, Zn = (r, t, n, f, i, m = false) => {
        if (!r) {
          t.push(0);
          return;
        }
        let c = ee(), s = r[0], h = r[1], g = r[3], _, v;
        if (s === "string" && g === "gpu-buffer") throw new Error("String tensor is not supported on GPU.");
        if (m && g !== "gpu-buffer") throw new Error(`External buffer must be provided for input/output index ${i} when enableGraphCapture is true.`);
        if (g === "gpu-buffer") {
          let P = r[2].gpuBuffer, U = hr(mr(s));
          v = h.reduce((C, F) => C * F, 1) * U;
          let D = c.jsepRegisterBuffer;
          if (!D) throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');
          _ = D(f, i, P, v);
        } else {
          let P = r[2];
          if (Array.isArray(P)) {
            v = 4 * P.length, _ = c._malloc(v), n.push(_);
            let U = _ / 4;
            for (let D = 0; D < P.length; D++) {
              if (typeof P[D] != "string") throw new TypeError(`tensor data at index ${D} is not a string`);
              c.HEAPU32[U++] = q(P[D], n);
            }
          } else v = P.byteLength, _ = c._malloc(v), n.push(_), c.HEAPU8.set(new Uint8Array(P.buffer, P.byteOffset, v), _);
        }
        let O = c.stackSave(), M = c.stackAlloc(4 * h.length);
        try {
          let P = M / 4;
          h.forEach((D) => c.HEAP32[P++] = D);
          let U = c._OrtCreateTensor(mr(s), _, v, M, h.length, Jn(g));
          U === 0 && V(`Can't create tensor for input/output. session=${f}, index=${i}.`), t.push(U);
        } finally {
          c.stackRestore(O);
        }
      }, ra = async (r, t, n, f, i, m) => {
        let c = ee(), s = ot.get(r);
        if (!s) throw new Error(`cannot run inference. invalid session id: ${r}`);
        let h = s[0], g = s[1], _ = s[2], v = s[3], O = s[4], M = s[5], P = t.length, U = f.length, D = 0, C = [], F = [], W = [], Z = [], te = c.stackSave(), re = c.stackAlloc(P * 4), x = c.stackAlloc(P * 4), Q = c.stackAlloc(U * 4), Le = c.stackAlloc(U * 4);
        try {
          [D, C] = Gn(m);
          for (let L = 0; L < P; L++) Zn(n[L], F, Z, r, t[L], O);
          for (let L = 0; L < U; L++) Zn(i[L], W, Z, r, P + f[L], O);
          let he = re / 4, $e = x / 4, se = Q / 4, K = Le / 4;
          for (let L = 0; L < P; L++) c.HEAPU32[he++] = F[L], c.HEAPU32[$e++] = g[t[L]];
          for (let L = 0; L < U; L++) c.HEAPU32[se++] = W[L], c.HEAPU32[K++] = _[f[L]];
          c.jsepOnRunStart?.(h);
          let Ae;
          Ae = await c._OrtRun(h, x, re, P, Le, U, Q, D), Ae !== 0 && V("failed to call OrtRun().");
          let we = [];
          for (let L = 0; L < U; L++) {
            let ce = c.HEAPU32[Q / 4 + L];
            if (ce === W[L]) {
              we.push(i[L]);
              continue;
            }
            let ke = c.stackSave(), ge = c.stackAlloc(4 * 4), Oe = false, ue, ne = 0;
            try {
              c._OrtGetTensorData(ce, ge, ge + 4, ge + 8, ge + 12) !== 0 && V(`Can't access output tensor data on index ${L}.`);
              let Se = ge / 4, Ne = c.HEAPU32[Se++];
              ne = c.HEAPU32[Se++];
              let Me = c.HEAPU32[Se++], Re = c.HEAPU32[Se++], Ce = [];
              for (let oe = 0; oe < Re; oe++) Ce.push(c.HEAPU32[Me / 4 + oe]);
              c._OrtFree(Me);
              let be = Ce.reduce((oe, ie) => oe * ie, 1);
              ue = qn(Ne);
              let Ge = v?.outputPreferredLocations[f[L]];
              if (ue === "string") {
                if (Ge === "gpu-buffer") throw new Error("String tensor is not supported on GPU.");
                let oe = [], ie = ne / 4;
                for (let de = 0; de < be; de++) {
                  let Pe = c.HEAPU32[ie++], xe = de === be - 1 ? void 0 : c.HEAPU32[ie] - Pe;
                  oe.push(c.UTF8ToString(Pe, xe));
                }
                we.push([ue, Ce, oe, "cpu"]);
              } else if (Ge === "gpu-buffer" && be > 0) {
                let oe = c.jsepGetBuffer;
                if (!oe) throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');
                let ie = oe(ne), de = hr(Ne);
                if (de === void 0 || !Wt(ue)) throw new Error(`Unsupported data type: ${ue}`);
                Oe = true, we.push([ue, Ce, { gpuBuffer: ie, download: c.jsepCreateDownloader(ie, be * de, ue), dispose: () => {
                  c._OrtReleaseTensor(ce);
                } }, "gpu-buffer"]);
              } else {
                let oe = Vn(ue), ie = new oe(be);
                new Uint8Array(ie.buffer, ie.byteOffset, ie.byteLength).set(c.HEAPU8.subarray(ne, ne + ie.byteLength)), we.push([ue, Ce, ie, "cpu"]);
              }
            } finally {
              c.stackRestore(ke), ue === "string" && ne && c._free(ne), Oe || c._OrtReleaseTensor(ce);
            }
          }
          return v && !O && (c._OrtClearBoundOutputs(v.handle), ot.set(r, [h, g, _, v, O, false])), we;
        } finally {
          c.stackRestore(te), F.forEach((he) => c._OrtReleaseTensor(he)), W.forEach((he) => c._OrtReleaseTensor(he)), Z.forEach((he) => c._free(he)), D !== 0 && c._OrtReleaseRunOptions(D), C.forEach((he) => c._free(he));
        }
      }, na = (r) => {
        let t = ee(), n = ot.get(r);
        if (!n) throw new Error("invalid session id");
        let f = n[0], i = t._OrtEndProfiling(f);
        i === 0 && V("Can't get an profile file name."), t._OrtFree(i);
      }, aa = (r) => {
        let t = [];
        for (let n of r) {
          let f = n[2];
          !Array.isArray(f) && "buffer" in f && t.push(f.buffer);
        }
        return t;
      };
    });
    ia = rt((yi, Xa) => {
      Xa.exports = '/*!\n * ONNX Runtime Web v1.18.0\n * Copyright (c) Microsoft Corporation. All rights reserved.\n * Licensed under the MIT License.\n */\n"use strict";(()=>{var vt=Object.defineProperty;var qr=Object.getOwnPropertyDescriptor;var Vr=Object.getOwnPropertyNames;var Jr=Object.prototype.hasOwnProperty;var _t=(i,c)=>()=>(i&&(c=i(i=0)),c);var Ke=(i,c)=>()=>(c||i((c={exports:{}}).exports,c),c.exports),Et=(i,c)=>{for(var a in c)vt(i,a,{get:c[a],enumerable:!0})},Xr=(i,c,a,h)=>{if(c&&typeof c=="object"||typeof c=="function")for(let f of Vr(c))!Jr.call(i,f)&&f!==a&&vt(i,f,{get:()=>c[f],enumerable:!(h=qr(c,f))||h.enumerable});return i};var et=i=>Xr(vt({},"__esModule",{value:!0}),i);var St={};Et(St,{createReadStream:()=>lr,readFile:()=>Qr,readFileSync:()=>Zr});var Qr,Zr,lr,At=_t(()=>{Qr=void 0,Zr=void 0,lr=void 0});var Tt={};Et(Tt,{join:()=>Kr});var Kr,Mt=_t(()=>{Kr=void 0});var pr=Ke((dr,Ct)=>{"use strict";var cr=(()=>{var i=typeof document<"u"?document.currentScript?.src:void 0;return typeof __filename<"u"&&(i||=__filename),function(c={}){var a=c,h,f,w=new Promise((t,o)=>{h=t,f=o}),g=Object.assign({},a),s="./this.program",S=typeof window=="object",x=typeof importScripts=="function",H=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string",A="",I,V,R;if(H){var B=(At(),et(St)),D=(Mt(),et(Tt));A=x?D.dirname(A)+"/":__dirname+"/",I=(t,o)=>(t=ce(t)?new URL(t):D.normalize(t),B.readFileSync(t,o?void 0:"utf8")),R=t=>(t=I(t,!0),t.buffer||(t=new Uint8Array(t)),t),V=(t,o,u,m=!0)=>{t=ce(t)?new URL(t):D.normalize(t),B.readFile(t,m?void 0:"utf8",(O,E)=>{O?u(O):o(m?E.buffer:E)})},!a.thisProgram&&1<process.argv.length&&(s=process.argv[1].replace(/\\\\/g,"/")),process.argv.slice(2)}else(S||x)&&(x?A=self.location.href:typeof document<"u"&&document.currentScript&&(A=document.currentScript.src),i&&(A=i),A.startsWith("blob:")?A="":A=A.substr(0,A.replace(/[?#].*/,"").lastIndexOf("/")+1),I=t=>{var o=new XMLHttpRequest;return o.open("GET",t,!1),o.send(null),o.responseText},x&&(R=t=>{var o=new XMLHttpRequest;return o.open("GET",t,!1),o.responseType="arraybuffer",o.send(null),new Uint8Array(o.response)}),V=(t,o,u)=>{var m=new XMLHttpRequest;m.open("GET",t,!0),m.responseType="arraybuffer",m.onload=()=>{m.status==200||m.status==0&&m.response?o(m.response):u()},m.onerror=u,m.send(null)});var T=console.log.bind(console),L=console.error.bind(console);Object.assign(a,g),g=null;var W,de=!1,pe,Z,_,J,Pe;function le(){var t=W.buffer;a.HEAP8=pe=new Int8Array(t),a.HEAP16=new Int16Array(t),a.HEAPU8=Z=new Uint8Array(t),a.HEAPU16=new Uint16Array(t),a.HEAP32=_=new Int32Array(t),a.HEAPU32=J=new Uint32Array(t),a.HEAPF32=new Float32Array(t),a.HEAPF64=Pe=new Float64Array(t)}var Ie=[],ne=[],X=[],we=0,me=null,F=null;function ie(t){throw t="Aborted("+t+")",L(t),de=!0,t=new WebAssembly.RuntimeError(t+". Build with -sASSERTIONS for more info."),f(t),t}var xe=t=>t.startsWith("data:application/octet-stream;base64,"),ce=t=>t.startsWith("file://"),be;if(be="ort-wasm.wasm",!xe(be)){var ae=be;be=a.locateFile?a.locateFile(ae,A):A+ae}function K(t){if(R)return R(t);throw"both async and sync fetching of the wasm failed"}function je(t){if(S||x){if(typeof fetch=="function"&&!ce(t))return fetch(t,{credentials:"same-origin"}).then(o=>{if(!o.ok)throw`failed to load wasm binary file at \'${t}\'`;return o.arrayBuffer()}).catch(()=>K(t));if(V)return new Promise((o,u)=>{V(t,m=>o(new Uint8Array(m)),u)})}return Promise.resolve().then(()=>K(t))}function Oe(t,o,u){return je(t).then(m=>WebAssembly.instantiate(m,o)).then(u,m=>{L(`failed to asynchronously prepare wasm: ${m}`),ie(m)})}function Ue(t,o){var u=be;return typeof WebAssembly.instantiateStreaming!="function"||xe(u)||ce(u)||H||typeof fetch!="function"?Oe(u,t,o):fetch(u,{credentials:"same-origin"}).then(m=>WebAssembly.instantiateStreaming(m,t).then(o,function(O){return L(`wasm streaming compile failed: ${O}`),L("falling back to ArrayBuffer instantiation"),Oe(u,t,o)}))}var ve,Ae={798088:(t,o,u,m)=>{if(typeof a>"u"||!a.ya)return 1;if(t=ue(t>>>0),t.startsWith("./")&&(t=t.substring(2)),t=a.ya.get(t),!t)return 2;if(o>>>=0,u>>>=0,o+u>t.byteLength)return 3;try{return Z.set(t.subarray(o,o+u),m>>>0>>>0),0}catch{return 4}}};class _e{constructor(o){this.wa=o-24}}var ge=0,Be=0,te=typeof TextDecoder<"u"?new TextDecoder("utf8"):void 0,re=(t,o,u)=>{o>>>=0;var m=o+u;for(u=o;t[u]&&!(u>=m);)++u;if(16<u-o&&t.buffer&&te)return te.decode(t.subarray(o,u));for(m="";o<u;){var O=t[o++];if(O&128){var E=t[o++]&63;if((O&224)==192)m+=String.fromCharCode((O&31)<<6|E);else{var U=t[o++]&63;O=(O&240)==224?(O&15)<<12|E<<6|U:(O&7)<<18|E<<12|U<<6|t[o++]&63,65536>O?m+=String.fromCharCode(O):(O-=65536,m+=String.fromCharCode(55296|O>>10,56320|O&1023))}}else m+=String.fromCharCode(O)}return m},ue=(t,o)=>(t>>>=0)?re(Z,t,o):"",Ee=t=>{for(var o=0,u=0;u<t.length;++u){var m=t.charCodeAt(u);127>=m?o++:2047>=m?o+=2:55296<=m&&57343>=m?(o+=4,++u):o+=3}return o},Se=(t,o,u,m)=>{if(u>>>=0,!(0<m))return 0;var O=u;m=u+m-1;for(var E=0;E<t.length;++E){var U=t.charCodeAt(E);if(55296<=U&&57343>=U){var ee=t.charCodeAt(++E);U=65536+((U&1023)<<10)|ee&1023}if(127>=U){if(u>=m)break;o[u++>>>0]=U}else{if(2047>=U){if(u+1>=m)break;o[u++>>>0]=192|U>>6}else{if(65535>=U){if(u+2>=m)break;o[u++>>>0]=224|U>>12}else{if(u+3>=m)break;o[u++>>>0]=240|U>>18,o[u++>>>0]=128|U>>12&63}o[u++>>>0]=128|U>>6&63}o[u++>>>0]=128|U&63}}return o[u>>>0]=0,u-O},Le=t=>t%4===0&&(t%100!==0||t%400===0),ze=[0,31,60,91,121,152,182,213,244,274,305,335],rt=[0,31,59,90,120,151,181,212,243,273,304,334],Te=[],Ge={},ke=()=>{if(!We){var t={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:s||"./this.program"},o;for(o in Ge)Ge[o]===void 0?delete t[o]:t[o]=Ge[o];var u=[];for(o in t)u.push(`${o}=${t[o]}`);We=u}return We},We,nt=[null,[],[]],De=[31,29,31,30,31,30,31,31,30,31,30,31],at=[31,28,31,30,31,30,31,31,30,31,30,31];function G(t){var o=Array(Ee(t)+1);return Se(t,o,0,o.length),o}function qe(t,o,u,m){function O(d,k,$){for(d=typeof d=="number"?d.toString():d||"";d.length<k;)d=$[0]+d;return d}function E(d,k){return O(d,k,"0")}function U(d,k){function $(Ze){return 0>Ze?-1:0<Ze?1:0}var Me;return(Me=$(d.getFullYear()-k.getFullYear()))===0&&(Me=$(d.getMonth()-k.getMonth()))===0&&(Me=$(d.getDate()-k.getDate())),Me}function ee(d){switch(d.getDay()){case 0:return new Date(d.getFullYear()-1,11,29);case 1:return d;case 2:return new Date(d.getFullYear(),0,3);case 3:return new Date(d.getFullYear(),0,2);case 4:return new Date(d.getFullYear(),0,1);case 5:return new Date(d.getFullYear()-1,11,31);case 6:return new Date(d.getFullYear()-1,11,30)}}function ye(d){var k=d.sa;for(d=new Date(new Date(d.ta+1900,0,1).getTime());0<k;){var $=d.getMonth(),Me=(Le(d.getFullYear())?De:at)[$];if(k>Me-d.getDate())k-=Me-d.getDate()+1,d.setDate(1),11>$?d.setMonth($+1):(d.setMonth(0),d.setFullYear(d.getFullYear()+1));else{d.setDate(d.getDate()+k);break}}return $=new Date(d.getFullYear()+1,0,4),k=ee(new Date(d.getFullYear(),0,4)),$=ee($),0>=U(k,d)?0>=U($,d)?d.getFullYear()+1:d.getFullYear():d.getFullYear()-1}t>>>=0,o>>>=0,u>>>=0,m>>>=0;var oe=J[m+40>>>2>>>0];m={Ba:_[m>>>2>>>0],Aa:_[m+4>>>2>>>0],ua:_[m+8>>>2>>>0],xa:_[m+12>>>2>>>0],va:_[m+16>>>2>>>0],ta:_[m+20>>>2>>>0],na:_[m+24>>>2>>>0],sa:_[m+28>>>2>>>0],Da:_[m+32>>>2>>>0],za:_[m+36>>>2>>>0],Ca:oe?ue(oe):""},u=ue(u),oe={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"};for(var se in oe)u=u.replace(new RegExp(se,"g"),oe[se]);var Qe="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),Re="January February March April May June July August September October November December".split(" ");oe={"%a":d=>Qe[d.na].substring(0,3),"%A":d=>Qe[d.na],"%b":d=>Re[d.va].substring(0,3),"%B":d=>Re[d.va],"%C":d=>E((d.ta+1900)/100|0,2),"%d":d=>E(d.xa,2),"%e":d=>O(d.xa,2," "),"%g":d=>ye(d).toString().substring(2),"%G":ye,"%H":d=>E(d.ua,2),"%I":d=>(d=d.ua,d==0?d=12:12<d&&(d-=12),E(d,2)),"%j":d=>{for(var k=0,$=0;$<=d.va-1;k+=(Le(d.ta+1900)?De:at)[$++]);return E(d.xa+k,3)},"%m":d=>E(d.va+1,2),"%M":d=>E(d.Aa,2),"%n":()=>`\n`,"%p":d=>0<=d.ua&&12>d.ua?"AM":"PM","%S":d=>E(d.Ba,2),"%t":()=>"	","%u":d=>d.na||7,"%U":d=>E(Math.floor((d.sa+7-d.na)/7),2),"%V":d=>{var k=Math.floor((d.sa+7-(d.na+6)%7)/7);if(2>=(d.na+371-d.sa-2)%7&&k++,k)k==53&&($=(d.na+371-d.sa)%7,$==4||$==3&&Le(d.ta)||(k=1));else{k=52;var $=(d.na+7-d.sa-1)%7;($==4||$==5&&Le(d.ta%400-1))&&k++}return E(k,2)},"%w":d=>d.na,"%W":d=>E(Math.floor((d.sa+7-(d.na+6)%7)/7),2),"%y":d=>(d.ta+1900).toString().substring(2),"%Y":d=>d.ta+1900,"%z":d=>{d=d.za;var k=0<=d;return d=Math.abs(d)/60,(k?"+":"-")+("0000"+(d/60*100+d%60)).slice(-4)},"%Z":d=>d.Ca,"%%":()=>"%"},u=u.replace(/%%/g,"\\0\\0");for(se in oe)u.includes(se)&&(u=u.replace(new RegExp(se,"g"),oe[se](m)));return u=u.replace(/\\0\\0/g,"%"),se=G(u),se.length>o?0:(pe.set(se,t>>>0),se.length-1)}var Ve={a:function(t,o,u){t>>>=0;var m=new _e(t);throw J[m.wa+16>>>2>>>0]=0,J[m.wa+4>>>2>>>0]=o>>>0,J[m.wa+8>>>2>>>0]=u>>>0,ge=t,Be++,ge},e:function(){return 0},H:function(){},x:function(){},z:function(){},J:function(){return 0},F:function(){},A:function(){},E:function(){},g:function(){},y:function(){},v:function(){},G:function(){},w:function(){},k:()=>1,I:function(t,o,u){return o>>>=0,Z.copyWithin(t>>>0>>>0,o>>>0,o+(u>>>0)>>>0)},n:function(t,o,u){t=o+2097152>>>0<4194305-!!t?(t>>>0)+4294967296*o:NaN,u>>>=0,t=new Date(1e3*t),_[u>>>2>>>0]=t.getUTCSeconds(),_[u+4>>>2>>>0]=t.getUTCMinutes(),_[u+8>>>2>>>0]=t.getUTCHours(),_[u+12>>>2>>>0]=t.getUTCDate(),_[u+16>>>2>>>0]=t.getUTCMonth(),_[u+20>>>2>>>0]=t.getUTCFullYear()-1900,_[u+24>>>2>>>0]=t.getUTCDay(),_[u+28>>>2>>>0]=(t.getTime()-Date.UTC(t.getUTCFullYear(),0,1,0,0,0,0))/864e5|0},o:function(t,o,u){t=o+2097152>>>0<4194305-!!t?(t>>>0)+4294967296*o:NaN,u>>>=0,t=new Date(1e3*t),_[u>>>2>>>0]=t.getSeconds(),_[u+4>>>2>>>0]=t.getMinutes(),_[u+8>>>2>>>0]=t.getHours(),_[u+12>>>2>>>0]=t.getDate(),_[u+16>>>2>>>0]=t.getMonth(),_[u+20>>>2>>>0]=t.getFullYear()-1900,_[u+24>>>2>>>0]=t.getDay(),_[u+28>>>2>>>0]=(Le(t.getFullYear())?ze:rt)[t.getMonth()]+t.getDate()-1|0,_[u+36>>>2>>>0]=-(60*t.getTimezoneOffset()),o=new Date(t.getFullYear(),6,1).getTimezoneOffset();var m=new Date(t.getFullYear(),0,1).getTimezoneOffset();_[u+32>>>2>>>0]=(o!=m&&t.getTimezoneOffset()==Math.min(m,o))|0},p:function(t){t>>>=0;var o=new Date(_[t+20>>>2>>>0]+1900,_[t+16>>>2>>>0],_[t+12>>>2>>>0],_[t+8>>>2>>>0],_[t+4>>>2>>>0],_[t>>>2>>>0],0),u=_[t+32>>>2>>>0],m=o.getTimezoneOffset(),O=new Date(o.getFullYear(),6,1).getTimezoneOffset(),E=new Date(o.getFullYear(),0,1).getTimezoneOffset(),U=Math.min(E,O);return 0>u?_[t+32>>>2>>>0]=+(O!=E&&U==m):0<u!=(U==m)&&(O=Math.max(E,O),o.setTime(o.getTime()+6e4*((0<u?U:O)-m))),_[t+24>>>2>>>0]=o.getDay(),_[t+28>>>2>>>0]=(Le(o.getFullYear())?ze:rt)[o.getMonth()]+o.getDate()-1|0,_[t>>>2>>>0]=o.getSeconds(),_[t+4>>>2>>>0]=o.getMinutes(),_[t+8>>>2>>>0]=o.getHours(),_[t+12>>>2>>>0]=o.getDate(),_[t+16>>>2>>>0]=o.getMonth(),_[t+20>>>2>>>0]=o.getYear(),t=o.getTime(),t=isNaN(t)?-1:t/1e3,Je((ve=t,1<=+Math.abs(ve)?0<ve?+Math.floor(ve/4294967296)>>>0:~~+Math.ceil((ve-+(~~ve>>>0))/4294967296)>>>0:0)),t>>>0},l:function(){return-52},m:function(){},t:function(t,o,u,m){u>>>=0,m>>>=0;var O=new Date().getFullYear(),E=new Date(O,0,1),U=new Date(O,6,1);O=E.getTimezoneOffset();var ee=U.getTimezoneOffset();J[t>>>0>>>2>>>0]=60*Math.max(O,ee),_[o>>>0>>>2>>>0]=+(O!=ee),t=ye=>ye.toLocaleTimeString(void 0,{hour12:!1,timeZoneName:"short"}).split(" ")[1],E=t(E),U=t(U),ee<O?(Se(E,Z,u,17),Se(U,Z,m,17)):(Se(E,Z,m,17),Se(U,Z,u,17))},d:()=>{ie("")},B:function(t,o,u){t>>>=0,o>>>=0,u>>>=0,Te.length=0;for(var m;m=Z[o++>>>0];){var O=m!=105;O&=m!=112,u+=O&&u%8?4:0,Te.push(m==112?J[u>>>2>>>0]:m==105?_[u>>>2>>>0]:Pe[u>>>3>>>0]),u+=O?8:4}return Ae[t](...Te)},h:()=>Date.now(),u:function(){return 4294901760},b:()=>performance.now(),s:function(t){t>>>=0;var o=Z.length;if(4294901760<t)return!1;for(var u=1;4>=u;u*=2){var m=o*(1+.2/u);m=Math.min(m,t+100663296);var O=Math;m=Math.max(t,m);e:{O=(O.min.call(O,4294901760,m+(65536-m%65536)%65536)-W.buffer.byteLength+65535)/65536;try{W.grow(O),le();var E=1;break e}catch{}E=void 0}if(E)return!0}return!1},C:function(t,o){t>>>=0,o>>>=0;var u=0;return ke().forEach((m,O)=>{var E=o+u;for(O=J[t+4*O>>>2>>>0]=E,E=0;E<m.length;++E)pe[O++>>>0]=m.charCodeAt(E);pe[O>>>0]=0,u+=m.length+1}),0},D:function(t,o){t>>>=0,o>>>=0;var u=ke();J[t>>>2>>>0]=u.length;var m=0;return u.forEach(O=>m+=O.length+1),J[o>>>2>>>0]=m,0},f:()=>52,j:function(){return 52},q:function(){return 70},i:function(t,o,u,m){o>>>=0,u>>>=0,m>>>=0;for(var O=0,E=0;E<u;E++){var U=J[o>>>2>>>0],ee=J[o+4>>>2>>>0];o+=8;for(var ye=0;ye<ee;ye++){var oe=Z[U+ye>>>0],se=nt[t];oe===0||oe===10?((t===1?T:L)(re(se,0)),se.length=0):se.push(oe)}O+=ee}return J[m>>>2>>>0]=O,0},r:qe,c:function(t,o,u,m){return qe(t>>>0,o>>>0,u>>>0,m>>>0)}},P=function(){function t(u){return P=u.exports,P=st(),W=P.K,le(),ne.unshift(P.L),we--,we==0&&(me!==null&&(clearInterval(me),me=null),F&&(u=F,F=null,u())),P}var o={a:Ve};if(we++,a.instantiateWasm)try{return a.instantiateWasm(o,t)}catch(u){L(`Module.instantiateWasm callback failed with error: ${u}`),f(u)}return Ue(o,function(u){t(u.instance)}).catch(f),{}}();a._OrtInit=(t,o)=>(a._OrtInit=P.M)(t,o),a._OrtGetLastError=(t,o)=>(a._OrtGetLastError=P.N)(t,o),a._OrtCreateSessionOptions=(t,o,u,m,O,E,U,ee,ye,oe)=>(a._OrtCreateSessionOptions=P.O)(t,o,u,m,O,E,U,ee,ye,oe),a._OrtAppendExecutionProvider=(t,o)=>(a._OrtAppendExecutionProvider=P.P)(t,o),a._OrtAddFreeDimensionOverride=(t,o,u)=>(a._OrtAddFreeDimensionOverride=P.Q)(t,o,u),a._OrtAddSessionConfigEntry=(t,o,u)=>(a._OrtAddSessionConfigEntry=P.R)(t,o,u),a._OrtReleaseSessionOptions=t=>(a._OrtReleaseSessionOptions=P.S)(t),a._OrtCreateSession=(t,o,u)=>(a._OrtCreateSession=P.T)(t,o,u),a._OrtReleaseSession=t=>(a._OrtReleaseSession=P.U)(t),a._OrtGetInputOutputCount=(t,o,u)=>(a._OrtGetInputOutputCount=P.V)(t,o,u),a._OrtGetInputName=(t,o)=>(a._OrtGetInputName=P.W)(t,o),a._OrtGetOutputName=(t,o)=>(a._OrtGetOutputName=P.X)(t,o),a._OrtFree=t=>(a._OrtFree=P.Y)(t),a._OrtCreateTensor=(t,o,u,m,O,E)=>(a._OrtCreateTensor=P.Z)(t,o,u,m,O,E),a._OrtGetTensorData=(t,o,u,m,O)=>(a._OrtGetTensorData=P._)(t,o,u,m,O),a._OrtReleaseTensor=t=>(a._OrtReleaseTensor=P.$)(t),a._OrtCreateRunOptions=(t,o,u,m)=>(a._OrtCreateRunOptions=P.aa)(t,o,u,m),a._OrtAddRunConfigEntry=(t,o,u)=>(a._OrtAddRunConfigEntry=P.ba)(t,o,u),a._OrtReleaseRunOptions=t=>(a._OrtReleaseRunOptions=P.ca)(t),a._OrtCreateBinding=t=>(a._OrtCreateBinding=P.da)(t),a._OrtBindInput=(t,o,u)=>(a._OrtBindInput=P.ea)(t,o,u),a._OrtBindOutput=(t,o,u,m)=>(a._OrtBindOutput=P.fa)(t,o,u,m),a._OrtClearBoundOutputs=t=>(a._OrtClearBoundOutputs=P.ga)(t),a._OrtReleaseBinding=t=>(a._OrtReleaseBinding=P.ha)(t),a._OrtRunWithBinding=(t,o,u,m,O)=>(a._OrtRunWithBinding=P.ia)(t,o,u,m,O),a._OrtRun=(t,o,u,m,O,E,U,ee)=>(a._OrtRun=P.ja)(t,o,u,m,O,E,U,ee),a._OrtEndProfiling=t=>(a._OrtEndProfiling=P.ka)(t),a._malloc=t=>(a._malloc=P.la)(t),a._free=t=>(a._free=P.ma)(t);var Je=t=>(Je=P.oa)(t),ot=t=>(ot=P.pa)(t),M=t=>(M=P.qa)(t),Ne=()=>(Ne=P.ra)();function st(){var t=P;t=Object.assign({},t);var o=u=>m=>u(m)>>>0;return t.la=o(t.la),t.qa=o(t.qa),t.ra=(u=>()=>u()>>>0)(t.ra),t}a.stackSave=()=>Ne(),a.stackRestore=t=>ot(t),a.stackAlloc=t=>M(t),a.UTF8ToString=ue,a.stringToUTF8=(t,o,u)=>Se(t,Z,o,u),a.lengthBytesUTF8=Ee;var Fe;F=function t(){Fe||Xe(),Fe||(F=t)};function Xe(){if(!(0<we)){if(a.preRun)for(typeof a.preRun=="function"&&(a.preRun=[a.preRun]);a.preRun.length;){var t=a.preRun.shift();Ie.unshift(t)}for(;0<Ie.length;)Ie.shift()(a);if(!(0<we||Fe||(Fe=!0,a.calledRun=!0,de))){for(;0<ne.length;)ne.shift()(a);for(h(a);0<X.length;)X.shift()(a)}}}return Xe(),w}})();typeof dr=="object"&&typeof Ct=="object"?Ct.exports=cr:typeof define=="function"&&define.amd&&define([],()=>cr)});var mr=Ke(()=>{});var gr=Ke(()=>{});var hr={};Et(hr,{cpus:()=>en});var en,br=_t(()=>{en=void 0});var Or=Ke((wr,Dt)=>{"use strict";var yr=(()=>{var i=typeof document<"u"?document.currentScript?.src:void 0;return typeof __filename<"u"&&(i||=__filename),function(c={}){function a(){return X.buffer!=ie.buffer&&K(),ie}function h(){return X.buffer!=ie.buffer&&K(),xe}function f(){return X.buffer!=ie.buffer&&K(),ce}function w(){return X.buffer!=ie.buffer&&K(),be}function g(){return X.buffer!=ie.buffer&&K(),ae}var s=c,S,x,H=new Promise((e,r)=>{S=e,x=r}),A=Object.assign({},s),I="./this.program",V=(e,r)=>{throw r},R=typeof window=="object",B=typeof importScripts=="function",D=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string",T=s.ENVIRONMENT_IS_PTHREAD||!1,L="";function W(e){return s.locateFile?s.locateFile(e,L):L+e}var de,pe,Z;if(D){var _=(At(),et(St)),J=(Mt(),et(Tt));L=B?J.dirname(L)+"/":__dirname+"/",de=(e,r)=>(e=ue(e)?new URL(e):J.normalize(e),_.readFileSync(e,r?void 0:"utf8")),Z=e=>(e=de(e,!0),e.buffer||(e=new Uint8Array(e)),e),pe=(e,r,n,l=!0)=>{e=ue(e)?new URL(e):J.normalize(e),_.readFile(e,l?void 0:"utf8",(y,b)=>{y?n(y):r(l?b.buffer:b)})},!s.thisProgram&&1<process.argv.length&&(I=process.argv[1].replace(/\\\\/g,"/")),process.argv.slice(2),V=(e,r)=>{throw process.exitCode=e,r},global.Worker=mr().Worker}else(R||B)&&(B?L=self.location.href:typeof document<"u"&&document.currentScript&&(L=document.currentScript.src),typeof i<"u"&&i&&(L=i),L.startsWith("blob:")?L="":L=L.substr(0,L.replace(/[?#].*/,"").lastIndexOf("/")+1),D||(de=e=>{var r=new XMLHttpRequest;return r.open("GET",e,!1),r.send(null),r.responseText},B&&(Z=e=>{var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType="arraybuffer",r.send(null),new Uint8Array(r.response)}),pe=(e,r,n)=>{var l=new XMLHttpRequest;l.open("GET",e,!0),l.responseType="arraybuffer",l.onload=()=>{l.status==200||l.status==0&&l.response?r(l.response):n()},l.onerror=n,l.send(null)}));D&&typeof performance>"u"&&(global.performance=gr().performance);var Pe=console.log.bind(console),le=console.error.bind(console);D&&(Pe=(...e)=>_.writeSync(1,e.join(" ")+`\n`),le=(...e)=>_.writeSync(2,e.join(" ")+`\n`));var Ie=Pe,ne=le;Object.assign(s,A),A=null;var X,we,me=!1,F,ie,xe,ce,be,ae;function K(){var e=X.buffer;s.HEAP8=ie=new Int8Array(e),s.HEAP16=new Int16Array(e),s.HEAPU8=xe=new Uint8Array(e),s.HEAPU16=new Uint16Array(e),s.HEAP32=ce=new Int32Array(e),s.HEAPU32=be=new Uint32Array(e),s.HEAPF32=new Float32Array(e),s.HEAPF64=ae=new Float64Array(e)}var je=16777216;if(T)X=s.wasmMemory;else if(s.wasmMemory)X=s.wasmMemory;else if(X=new WebAssembly.Memory({initial:je/65536,maximum:65536,shared:!0}),!(X.buffer instanceof SharedArrayBuffer))throw ne("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"),D&&ne("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)"),Error("bad memory");K(),je=X.buffer.byteLength;var Oe=[],Ue=[],ve=[],Ae=0,_e=null,ge=null;function Be(){if(Ae--,Ae==0&&(_e!==null&&(clearInterval(_e),_e=null),ge)){var e=ge;ge=null,e()}}function te(e){throw e="Aborted("+e+")",ne(e),me=!0,F=1,e=new WebAssembly.RuntimeError(e+". Build with -sASSERTIONS for more info."),x(e),e}var re=e=>e.startsWith("data:application/octet-stream;base64,"),ue=e=>e.startsWith("file://"),Ee;Ee="ort-wasm-threaded.wasm",re(Ee)||(Ee=W(Ee));function Se(e){if(Z)return Z(e);throw"both async and sync fetching of the wasm failed"}function Le(e){if(R||B){if(typeof fetch=="function"&&!ue(e))return fetch(e,{credentials:"same-origin"}).then(r=>{if(!r.ok)throw`failed to load wasm binary file at \'${e}\'`;return r.arrayBuffer()}).catch(()=>Se(e));if(pe)return new Promise((r,n)=>{pe(e,l=>r(new Uint8Array(l)),n)})}return Promise.resolve().then(()=>Se(e))}function ze(e,r,n){return Le(e).then(l=>WebAssembly.instantiate(l,r)).then(n,l=>{ne(`failed to asynchronously prepare wasm: ${l}`),te(l)})}function rt(e,r){var n=Ee;return typeof WebAssembly.instantiateStreaming!="function"||re(n)||ue(n)||D||typeof fetch!="function"?ze(n,e,r):fetch(n,{credentials:"same-origin"}).then(l=>WebAssembly.instantiateStreaming(l,e).then(r,function(y){return ne(`wasm streaming compile failed: ${y}`),ne("falling back to ArrayBuffer instantiation"),ze(n,e,r)}))}var Te,Ge={799444:(e,r,n,l)=>{if(typeof s>"u"||!s.bb)return 1;if(e=ee(e>>>0),e.startsWith("./")&&(e=e.substring(2)),e=s.bb.get(e),!e)return 2;if(r>>>=0,n>>>=0,l>>>=0,r+n>e.byteLength)return 3;try{return h().set(e.subarray(r,r+n),l>>>0),0}catch{return 4}}};function ke(e){this.name="ExitStatus",this.message=`Program terminated with exit(${e})`,this.status=e}var We=e=>{e.terminate(),e.onmessage=()=>{}},nt=e=>{M.Oa.length==0&&(Je(),M.Xa(M.Oa[0]));var r=M.Oa.pop();if(!r)return 6;M.Pa.push(r),M.La[e.Na]=r,r.Na=e.Na;var n={cmd:"run",start_routine:e.gb,arg:e.cb,pthread_ptr:e.Na};return D&&r.unref(),r.postMessage(n,e.mb),0},De=0,at=e=>{var r=Ot();return e=e(),ft(r),e},G=(e,r,...n)=>at(()=>{for(var l=n.length,y=wt(8*l),b=y>>>3,v=0;v<n.length;v++){var z=n[v];g()[b+v>>>0]=z}return rr(e,0,l,y,r)});function qe(e){if(T)return G(0,1,e);F=e,0<De||(M.hb(),s.onExit?.(e),me=!0),V(e,new ke(e))}var Ve=e=>{if(F=e,T)throw st(e),"unwind";qe(e)};function P(){for(var e=s.numThreads;e--;)Je();Oe.unshift(()=>{Ae++,ot(()=>Be())})}function Je(){var e=W("ort-wasm-threaded.worker.js");e=new Worker(e),M.Oa.push(e)}function ot(e){T?e():Promise.all(M.Oa.map(M.Xa)).then(e)}var M={Oa:[],Pa:[],ab:[],La:{},Va(){T?(M.receiveObjectTransfer=M.fb,M.threadInitTLS=M.$a,M.setExitStatus=M.Za):P()},Za:e=>F=e,pb:["$terminateWorker"],hb:()=>{for(var e of M.Pa)We(e);for(e of M.Oa)We(e);M.Oa=[],M.Pa=[],M.La=[]},Ya:e=>{var r=e.Na;delete M.La[r],M.Oa.push(e),M.Pa.splice(M.Pa.indexOf(e),1),e.Na=0,bt(r)},fb(){},$a(){M.ab.forEach(e=>e())},Xa:e=>new Promise(r=>{e.onmessage=b=>{b=b.data;var v=b.cmd;if(b.targetThread&&b.targetThread!=ut()){var z=M.La[b.targetThread];z?z.postMessage(b,b.transferList):ne(`Internal error! Worker sent a message "${v}" to target pthread ${b.targetThread}, but that thread no longer exists!`)}else v==="checkMailbox"?it():v==="spawnThread"?nt(b):v==="cleanupThread"?M.Ya(M.La[b.thread]):v==="killThread"?(b=b.thread,v=M.La[b],delete M.La[b],We(v),bt(b),M.Pa.splice(M.Pa.indexOf(v),1),v.Na=0):v==="cancelThread"?M.La[b.thread].postMessage({cmd:"cancel"}):v==="loaded"?(e.loaded=!0,D&&!e.Na&&e.unref(),r(e)):v==="alert"?alert(`Thread ${b.threadId}: ${b.text}`):b.target==="setimmediate"?e.postMessage(b):v==="callHandler"?s[b.handler](...b.args):v&&ne(`worker sent an unknown command ${v}`)},e.onerror=b=>{throw ne(`worker sent an error! ${b.filename}:${b.lineno}: ${b.message}`),b},D&&(e.on("message",b=>e.onmessage({data:b})),e.on("error",b=>e.onerror(b)));var n=[],l=["onExit"],y;for(y of l)s.hasOwnProperty(y)&&n.push(y);e.postMessage({cmd:"load",handlers:n,urlOrBlob:s.mainScriptUrlOrBlob||i,wasmMemory:X,wasmModule:we})})};s.PThread=M;var Ne=e=>{for(;0<e.length;)e.shift()(s)};s.establishStackSpace=()=>{var e=ut(),r=w()[e+52>>>2>>>0];e=w()[e+56>>>2>>>0],or(r,r-e),ft(r)};function st(e){if(T)return G(1,0,e);Ve(e)}var Fe=[],Xe;s.invokeEntryPoint=(e,r)=>{De=0;var n=Fe[e];n||(e>=Fe.length&&(Fe.length=e+1),Fe[e]=n=Xe.get(e)),e=n(r),0<De?M.Za(e):yt(e)};class t{constructor(r){this.Ua=r-24}Va(r,n){w()[this.Ua+16>>>2>>>0]=0,w()[this.Ua+4>>>2>>>0]=r,w()[this.Ua+8>>>2>>>0]=n}}var o=0,u=0;function m(e,r,n,l){return T?G(2,1,e,r,n,l):O(e,r,n,l)}function O(e,r,n,l){if(e>>>=0,r>>>=0,n>>>=0,l>>>=0,typeof SharedArrayBuffer>"u")return ne("Current environment does not support SharedArrayBuffer, pthreads are not available!"),6;var y=[];return T&&y.length===0?m(e,r,n,l):(e={gb:n,Na:e,cb:l,mb:y},T?(e.ob="spawnThread",postMessage(e,y),0):nt(e))}var E=typeof TextDecoder<"u"?new TextDecoder("utf8"):void 0,U=(e,r,n)=>{r>>>=0;var l=r+n;for(n=r;e[n]&&!(n>=l);)++n;if(16<n-r&&e.buffer&&E)return E.decode(e.buffer instanceof SharedArrayBuffer?e.slice(r,n):e.subarray(r,n));for(l="";r<n;){var y=e[r++];if(y&128){var b=e[r++]&63;if((y&224)==192)l+=String.fromCharCode((y&31)<<6|b);else{var v=e[r++]&63;y=(y&240)==224?(y&15)<<12|b<<6|v:(y&7)<<18|b<<12|v<<6|e[r++]&63,65536>y?l+=String.fromCharCode(y):(y-=65536,l+=String.fromCharCode(55296|y>>10,56320|y&1023))}}else l+=String.fromCharCode(y)}return l},ee=(e,r)=>(e>>>=0)?U(h(),e,r):"";function ye(e,r,n){return T?G(3,1,e,r,n):0}function oe(e,r){if(T)return G(4,1,e,r)}var se=e=>{for(var r=0,n=0;n<e.length;++n){var l=e.charCodeAt(n);127>=l?r++:2047>=l?r+=2:55296<=l&&57343>=l?(r+=4,++n):r+=3}return r},Qe=(e,r,n,l)=>{if(n>>>=0,!(0<l))return 0;var y=n;l=n+l-1;for(var b=0;b<e.length;++b){var v=e.charCodeAt(b);if(55296<=v&&57343>=v){var z=e.charCodeAt(++b);v=65536+((v&1023)<<10)|z&1023}if(127>=v){if(n>=l)break;r[n++>>>0]=v}else{if(2047>=v){if(n+1>=l)break;r[n++>>>0]=192|v>>6}else{if(65535>=v){if(n+2>=l)break;r[n++>>>0]=224|v>>12}else{if(n+3>=l)break;r[n++>>>0]=240|v>>18,r[n++>>>0]=128|v>>12&63}r[n++>>>0]=128|v>>6&63}r[n++>>>0]=128|v&63}}return r[n>>>0]=0,n-y},Re=(e,r,n)=>Qe(e,h(),r,n);function d(e,r){if(T)return G(5,1,e,r)}function k(e,r,n){if(T)return G(6,1,e,r,n)}function $(e,r,n){return T?G(7,1,e,r,n):0}function Me(e,r){if(T)return G(8,1,e,r)}function Ze(e,r,n){if(T)return G(9,1,e,r,n)}function Rt(e,r,n,l){if(T)return G(10,1,e,r,n,l)}function It(e,r,n,l){if(T)return G(11,1,e,r,n,l)}function Bt(e,r,n,l){if(T)return G(12,1,e,r,n,l)}function kt(e){if(T)return G(13,1,e)}function Wt(e,r){if(T)return G(14,1,e,r)}function Nt(e,r,n){if(T)return G(15,1,e,r,n)}function dt(e){e>>>=0,typeof Atomics.nb=="function"&&(Atomics.nb(f(),e>>>2,e).value.then(it),e+=128,Atomics.store(f(),e>>>2,1))}s.__emscripten_thread_mailbox_await=dt;var it=()=>{var e=ut();if(e&&(dt(e),e=nr,!me))try{if(e(),!(0<De))try{T?yt(F):Ve(F)}catch(r){r instanceof ke||r=="unwind"||V(1,r)}}catch(r){r instanceof ke||r=="unwind"||V(1,r)}};s.checkMailbox=it;var pt=[],$e=e=>e%4===0&&(e%100!==0||e%400===0),Ht=[0,31,60,91,121,152,182,213,244,274,305,335],Gt=[0,31,59,90,120,151,181,212,243,273,304,334];function $t(e,r,n,l,y,b,v,z){return T?G(16,1,e,r,n,l,y,b,v,z):-52}function Yt(e,r,n,l,y,b,v){if(T)return G(17,1,e,r,n,l,y,b,v)}var mt=[],gt={},jt=()=>{if(!ht){var e={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:I||"./this.program"},r;for(r in gt)gt[r]===void 0?delete e[r]:e[r]=gt[r];var n=[];for(r in e)n.push(`${r}=${e[r]}`);ht=n}return ht},ht;function zt(e,r){if(T)return G(18,1,e,r);e>>>=0,r>>>=0;var n=0;return jt().forEach((l,y)=>{var b=r+n;for(y=w()[e+4*y>>>2>>>0]=b,b=0;b<l.length;++b)a()[y++>>>0]=l.charCodeAt(b);a()[y>>>0]=0,n+=l.length+1}),0}function qt(e,r){if(T)return G(19,1,e,r);e>>>=0,r>>>=0;var n=jt();w()[e>>>2>>>0]=n.length;var l=0;return n.forEach(y=>l+=y.length+1),w()[r>>>2>>>0]=l,0}function Vt(e){return T?G(20,1,e):52}function Jt(e,r,n,l){return T?G(21,1,e,r,n,l):52}function Xt(e,r,n,l,y){return T?G(22,1,e,r,n,l,y):70}var Hr=[null,[],[]];function Qt(e,r,n,l){if(T)return G(23,1,e,r,n,l);r>>>=0,n>>>=0,l>>>=0;for(var y=0,b=0;b<n;b++){var v=w()[r>>>2>>>0],z=w()[r+4>>>2>>>0];r+=8;for(var Ce=0;Ce<z;Ce++){var fe=h()[v+Ce>>>0],he=Hr[e];fe===0||fe===10?((e===1?Ie:ne)(U(he,0)),he.length=0):he.push(fe)}y+=z}return w()[l>>>2>>>0]=y,0}var Zt=[31,29,31,30,31,30,31,31,30,31,30,31],Kt=[31,28,31,30,31,30,31,31,30,31,30,31];function Gr(e){var r=Array(se(e)+1);return Qe(e,r,0,r.length),r}var $r=(e,r)=>{a().set(e,r>>>0)};function er(e,r,n,l){function y(p,N,q){for(p=typeof p=="number"?p.toString():p||"";p.length<N;)p=q[0]+p;return p}function b(p,N){return y(p,N,"0")}function v(p,N){function q(fr){return 0>fr?-1:0<fr?1:0}var He;return(He=q(p.getFullYear()-N.getFullYear()))===0&&(He=q(p.getMonth()-N.getMonth()))===0&&(He=q(p.getDate()-N.getDate())),He}function z(p){switch(p.getDay()){case 0:return new Date(p.getFullYear()-1,11,29);case 1:return p;case 2:return new Date(p.getFullYear(),0,3);case 3:return new Date(p.getFullYear(),0,2);case 4:return new Date(p.getFullYear(),0,1);case 5:return new Date(p.getFullYear()-1,11,31);case 6:return new Date(p.getFullYear()-1,11,30)}}function Ce(p){var N=p.Qa;for(p=new Date(new Date(p.Ra+1900,0,1).getTime());0<N;){var q=p.getMonth(),He=($e(p.getFullYear())?Zt:Kt)[q];if(N>He-p.getDate())N-=He-p.getDate()+1,p.setDate(1),11>q?p.setMonth(q+1):(p.setMonth(0),p.setFullYear(p.getFullYear()+1));else{p.setDate(p.getDate()+N);break}}return q=new Date(p.getFullYear()+1,0,4),N=z(new Date(p.getFullYear(),0,4)),q=z(q),0>=v(N,p)?0>=v(q,p)?p.getFullYear()+1:p.getFullYear():p.getFullYear()-1}e>>>=0,r>>>=0,n>>>=0,l>>>=0;var fe=w()[l+40>>>2>>>0];l={kb:f()[l>>>2>>>0],jb:f()[l+4>>>2>>>0],Sa:f()[l+8>>>2>>>0],Wa:f()[l+12>>>2>>>0],Ta:f()[l+16>>>2>>>0],Ra:f()[l+20>>>2>>>0],Ma:f()[l+24>>>2>>>0],Qa:f()[l+28>>>2>>>0],qb:f()[l+32>>>2>>>0],ib:f()[l+36>>>2>>>0],lb:fe?ee(fe):""},n=ee(n),fe={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"};for(var he in fe)n=n.replace(new RegExp(he,"g"),fe[he]);var ir="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),ur="January February March April May June July August September October November December".split(" ");fe={"%a":p=>ir[p.Ma].substring(0,3),"%A":p=>ir[p.Ma],"%b":p=>ur[p.Ta].substring(0,3),"%B":p=>ur[p.Ta],"%C":p=>b((p.Ra+1900)/100|0,2),"%d":p=>b(p.Wa,2),"%e":p=>y(p.Wa,2," "),"%g":p=>Ce(p).toString().substring(2),"%G":Ce,"%H":p=>b(p.Sa,2),"%I":p=>(p=p.Sa,p==0?p=12:12<p&&(p-=12),b(p,2)),"%j":p=>{for(var N=0,q=0;q<=p.Ta-1;N+=($e(p.Ra+1900)?Zt:Kt)[q++]);return b(p.Wa+N,3)},"%m":p=>b(p.Ta+1,2),"%M":p=>b(p.jb,2),"%n":()=>`\n`,"%p":p=>0<=p.Sa&&12>p.Sa?"AM":"PM","%S":p=>b(p.kb,2),"%t":()=>"	","%u":p=>p.Ma||7,"%U":p=>b(Math.floor((p.Qa+7-p.Ma)/7),2),"%V":p=>{var N=Math.floor((p.Qa+7-(p.Ma+6)%7)/7);if(2>=(p.Ma+371-p.Qa-2)%7&&N++,N)N==53&&(q=(p.Ma+371-p.Qa)%7,q==4||q==3&&$e(p.Ra)||(N=1));else{N=52;var q=(p.Ma+7-p.Qa-1)%7;(q==4||q==5&&$e(p.Ra%400-1))&&N++}return b(N,2)},"%w":p=>p.Ma,"%W":p=>b(Math.floor((p.Qa+7-(p.Ma+6)%7)/7),2),"%y":p=>(p.Ra+1900).toString().substring(2),"%Y":p=>p.Ra+1900,"%z":p=>{p=p.ib;var N=0<=p;return p=Math.abs(p)/60,(N?"+":"-")+("0000"+(p/60*100+p%60)).slice(-4)},"%Z":p=>p.lb,"%%":()=>"%"},n=n.replace(/%%/g,"\\0\\0");for(he in fe)n.includes(he)&&(n=n.replace(new RegExp(he,"g"),fe[he](l)));return n=n.replace(/\\0\\0/g,"%"),he=Gr(n),he.length>r?0:($r(he,e),he.length-1)}M.Va();var Yr=[qe,st,m,ye,oe,d,k,$,Me,Ze,Rt,It,Bt,kt,Wt,Nt,$t,Yt,zt,qt,Vt,Jt,Xt,Qt],jr={b:function(e,r,n){throw e>>>=0,new t(e).Va(r>>>0,n>>>0),o=e,u++,o},L:function(e){tr(e>>>0,!B,1,!R,131072,!1),M.$a()},j:function(e){e>>>=0,T?postMessage({cmd:"cleanupThread",thread:e}):M.Ya(M.La[e])},H:O,h:ye,S:oe,D:d,F:k,T:$,Q:Me,J:Ze,P:Rt,n:It,E:Bt,B:kt,R:Wt,C:Nt,p:()=>1,z:function(e,r){e>>>=0,e==r>>>0?setTimeout(it):T?postMessage({targetThread:e,cmd:"checkMailbox"}):(e=M.La[e])&&e.postMessage({cmd:"checkMailbox"})},I:function(e,r,n,l,y){r>>>=0,n>>>=0,pt.length=l,y=y>>>0>>>3;for(var b=0;b<l;b++)pt[b]=g()[y+b>>>0];return e=r?Ge[r]:Yr[e],M.eb=n,n=e(...pt),M.eb=0,n},K:dt,o:function(e){D&&M.La[e>>>0].ref()},s:function(e,r,n){e=r+2097152>>>0<4194305-!!e?(e>>>0)+4294967296*r:NaN,n>>>=0,e=new Date(1e3*e),f()[n>>>2>>>0]=e.getUTCSeconds(),f()[n+4>>>2>>>0]=e.getUTCMinutes(),f()[n+8>>>2>>>0]=e.getUTCHours(),f()[n+12>>>2>>>0]=e.getUTCDate(),f()[n+16>>>2>>>0]=e.getUTCMonth(),f()[n+20>>>2>>>0]=e.getUTCFullYear()-1900,f()[n+24>>>2>>>0]=e.getUTCDay(),e=(e.getTime()-Date.UTC(e.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,f()[n+28>>>2>>>0]=e},t:function(e,r,n){e=r+2097152>>>0<4194305-!!e?(e>>>0)+4294967296*r:NaN,n>>>=0,e=new Date(1e3*e),f()[n>>>2>>>0]=e.getSeconds(),f()[n+4>>>2>>>0]=e.getMinutes(),f()[n+8>>>2>>>0]=e.getHours(),f()[n+12>>>2>>>0]=e.getDate(),f()[n+16>>>2>>>0]=e.getMonth(),f()[n+20>>>2>>>0]=e.getFullYear()-1900,f()[n+24>>>2>>>0]=e.getDay(),r=($e(e.getFullYear())?Ht:Gt)[e.getMonth()]+e.getDate()-1|0,f()[n+28>>>2>>>0]=r,f()[n+36>>>2>>>0]=-(60*e.getTimezoneOffset()),r=new Date(e.getFullYear(),6,1).getTimezoneOffset();var l=new Date(e.getFullYear(),0,1).getTimezoneOffset();e=(r!=l&&e.getTimezoneOffset()==Math.min(l,r))|0,f()[n+32>>>2>>>0]=e},u:function(e){e>>>=0;var r=new Date(f()[e+20>>>2>>>0]+1900,f()[e+16>>>2>>>0],f()[e+12>>>2>>>0],f()[e+8>>>2>>>0],f()[e+4>>>2>>>0],f()[e>>>2>>>0],0),n=f()[e+32>>>2>>>0],l=r.getTimezoneOffset(),y=new Date(r.getFullYear(),6,1).getTimezoneOffset(),b=new Date(r.getFullYear(),0,1).getTimezoneOffset(),v=Math.min(b,y);return 0>n?f()[e+32>>>2>>>0]=+(y!=b&&v==l):0<n!=(v==l)&&(y=Math.max(b,y),r.setTime(r.getTime()+6e4*((0<n?v:y)-l))),f()[e+24>>>2>>>0]=r.getDay(),n=($e(r.getFullYear())?Ht:Gt)[r.getMonth()]+r.getDate()-1|0,f()[e+28>>>2>>>0]=n,f()[e>>>2>>>0]=r.getSeconds(),f()[e+4>>>2>>>0]=r.getMinutes(),f()[e+8>>>2>>>0]=r.getHours(),f()[e+12>>>2>>>0]=r.getDate(),f()[e+16>>>2>>>0]=r.getMonth(),f()[e+20>>>2>>>0]=r.getYear(),e=r.getTime(),e=isNaN(e)?-1:e/1e3,ar((Te=e,1<=+Math.abs(Te)?0<Te?+Math.floor(Te/4294967296)>>>0:~~+Math.ceil((Te-+(~~Te>>>0))/4294967296)>>>0:0)),e>>>0},q:$t,r:Yt,y:function(e,r,n,l){e>>>=0,r>>>=0,n>>>=0,l>>>=0;var y=new Date().getFullYear(),b=new Date(y,0,1),v=new Date(y,6,1);y=b.getTimezoneOffset();var z=v.getTimezoneOffset(),Ce=Math.max(y,z);w()[e>>>2>>>0]=60*Ce,f()[r>>>2>>>0]=+(y!=z),e=fe=>fe.toLocaleTimeString(void 0,{hour12:!1,timeZoneName:"short"}).split(" ")[1],b=e(b),v=e(v),z<y?(Re(b,n,17),Re(v,l,17)):(Re(b,l,17),Re(v,n,17))},c:()=>{te("")},O:function(e,r,n){e>>>=0,r>>>=0,n>>>=0,mt.length=0;for(var l;l=h()[r++>>>0];){var y=l!=105;y&=l!=112,n+=y&&n%8?4:0,mt.push(l==112?w()[n>>>2>>>0]:l==105?f()[n>>>2>>>0]:g()[n>>>3>>>0]),n+=y?8:4}return Ge[e](...mt)},k:()=>{},i:()=>Date.now(),U:()=>{throw De+=1,"unwind"},A:function(){return 4294901760},e:()=>performance.timeOrigin+performance.now(),f:()=>D?(br(),et(hr)).cpus().length:navigator.hardwareConcurrency,x:function(e){e>>>=0;var r=h().length;if(e<=r||4294901760<e)return!1;for(var n=1;4>=n;n*=2){var l=r*(1+.2/n);l=Math.min(l,e+100663296);var y=Math;l=Math.max(e,l);e:{y=(y.min.call(y,4294901760,l+(65536-l%65536)%65536)-X.buffer.byteLength+65535)/65536;try{X.grow(y),K();var b=1;break e}catch{}b=void 0}if(b)return!0}return!1},M:zt,N:qt,G:Ve,g:Vt,m:Jt,v:Xt,l:Qt,a:X||s.wasmMemory,w:er,d:function(e,r,n,l){return er(e>>>0,r>>>0,n>>>0,l>>>0)}},C=function(){function e(n,l){return C=n.exports,C=zr(),M.ab.push(C.ya),Xe=C.za,Ue.unshift(C.V),we=l,Be(),C}var r={a:jr};if(Ae++,s.instantiateWasm)try{return s.instantiateWasm(r,e)}catch(n){ne(`Module.instantiateWasm callback failed with error: ${n}`),x(n)}return rt(r,function(n){e(n.instance,n.module)}).catch(x),{}}();s._OrtInit=(e,r)=>(s._OrtInit=C.W)(e,r),s._OrtGetLastError=(e,r)=>(s._OrtGetLastError=C.X)(e,r),s._OrtCreateSessionOptions=(e,r,n,l,y,b,v,z,Ce,fe)=>(s._OrtCreateSessionOptions=C.Y)(e,r,n,l,y,b,v,z,Ce,fe),s._OrtAppendExecutionProvider=(e,r)=>(s._OrtAppendExecutionProvider=C.Z)(e,r),s._OrtAddFreeDimensionOverride=(e,r,n)=>(s._OrtAddFreeDimensionOverride=C._)(e,r,n),s._OrtAddSessionConfigEntry=(e,r,n)=>(s._OrtAddSessionConfigEntry=C.$)(e,r,n),s._OrtReleaseSessionOptions=e=>(s._OrtReleaseSessionOptions=C.aa)(e),s._OrtCreateSession=(e,r,n)=>(s._OrtCreateSession=C.ba)(e,r,n),s._OrtReleaseSession=e=>(s._OrtReleaseSession=C.ca)(e),s._OrtGetInputOutputCount=(e,r,n)=>(s._OrtGetInputOutputCount=C.da)(e,r,n),s._OrtGetInputName=(e,r)=>(s._OrtGetInputName=C.ea)(e,r),s._OrtGetOutputName=(e,r)=>(s._OrtGetOutputName=C.fa)(e,r),s._OrtFree=e=>(s._OrtFree=C.ga)(e),s._OrtCreateTensor=(e,r,n,l,y,b)=>(s._OrtCreateTensor=C.ha)(e,r,n,l,y,b),s._OrtGetTensorData=(e,r,n,l,y)=>(s._OrtGetTensorData=C.ia)(e,r,n,l,y),s._OrtReleaseTensor=e=>(s._OrtReleaseTensor=C.ja)(e),s._OrtCreateRunOptions=(e,r,n,l)=>(s._OrtCreateRunOptions=C.ka)(e,r,n,l),s._OrtAddRunConfigEntry=(e,r,n)=>(s._OrtAddRunConfigEntry=C.la)(e,r,n),s._OrtReleaseRunOptions=e=>(s._OrtReleaseRunOptions=C.ma)(e),s._OrtCreateBinding=e=>(s._OrtCreateBinding=C.na)(e),s._OrtBindInput=(e,r,n)=>(s._OrtBindInput=C.oa)(e,r,n),s._OrtBindOutput=(e,r,n,l)=>(s._OrtBindOutput=C.pa)(e,r,n,l),s._OrtClearBoundOutputs=e=>(s._OrtClearBoundOutputs=C.qa)(e),s._OrtReleaseBinding=e=>(s._OrtReleaseBinding=C.ra)(e),s._OrtRunWithBinding=(e,r,n,l,y)=>(s._OrtRunWithBinding=C.sa)(e,r,n,l,y),s._OrtRun=(e,r,n,l,y,b,v,z)=>(s._OrtRun=C.ta)(e,r,n,l,y,b,v,z),s._OrtEndProfiling=e=>(s._OrtEndProfiling=C.ua)(e);var ut=s._pthread_self=()=>(ut=s._pthread_self=C.va)();s._malloc=e=>(s._malloc=C.wa)(e),s._free=e=>(s._free=C.xa)(e),s.__emscripten_tls_init=()=>(s.__emscripten_tls_init=C.ya)();var tr=s.__emscripten_thread_init=(e,r,n,l,y,b)=>(tr=s.__emscripten_thread_init=C.Aa)(e,r,n,l,y,b);s.__emscripten_thread_crashed=()=>(s.__emscripten_thread_crashed=C.Ba)();var rr=(e,r,n,l,y)=>(rr=C.Ca)(e,r,n,l,y),bt=e=>(bt=C.Da)(e),yt=s.__emscripten_thread_exit=e=>(yt=s.__emscripten_thread_exit=C.Ea)(e),nr=()=>(nr=C.Fa)(),ar=e=>(ar=C.Ga)(e),or=(e,r)=>(or=C.Ha)(e,r),ft=e=>(ft=C.Ia)(e),wt=e=>(wt=C.Ja)(e),Ot=()=>(Ot=C.Ka)();function zr(){var e=C;e=Object.assign({},e);var r=l=>()=>l()>>>0,n=l=>y=>l(y)>>>0;return e.va=r(e.va),e.wa=n(e.wa),e.emscripten_main_runtime_thread_id=r(e.emscripten_main_runtime_thread_id),e.Ja=n(e.Ja),e.Ka=r(e.Ka),e}s.wasmMemory=X,s.stackSave=()=>Ot(),s.stackRestore=e=>ft(e),s.stackAlloc=e=>wt(e),s.keepRuntimeAlive=()=>0<De,s.UTF8ToString=ee,s.stringToUTF8=Re,s.lengthBytesUTF8=se,s.ExitStatus=ke,s.PThread=M;var lt;ge=function e(){lt||sr(),lt||(ge=e)};function sr(){if(!(0<Ae))if(T)S(s),T||Ne(Ue),startWorker(s);else{if(s.preRun)for(typeof s.preRun=="function"&&(s.preRun=[s.preRun]);s.preRun.length;)Oe.unshift(s.preRun.shift());Ne(Oe),0<Ae||lt||(lt=!0,s.calledRun=!0,me||(T||Ne(Ue),S(s),T||Ne(ve)))}}return sr(),H}})();typeof wr=="object"&&typeof Dt=="object"?Dt.exports=yr:typeof define=="function"&&define.amd&&define([],()=>yr)});var vr=Ke((yn,tn)=>{tn.exports=\'"use strict";var Module={},ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";if(ENVIRONMENT_IS_NODE){var nodeWorkerThreads=require("worker_threads"),parentPort=nodeWorkerThreads.parentPort;parentPort.on("message",e=>onmessage({data:e}));var fs=require("fs"),vm=require("vm");Object.assign(global,{self:global,require,Module,location:{href:__filename},Worker:nodeWorkerThreads.Worker,importScripts:e=>vm.runInThisContext(fs.readFileSync(e,"utf8"),{filename:e}),postMessage:e=>parentPort.postMessage(e),performance:global.performance||{now:Date.now}})}var initializedJS=!1;function threadPrintErr(...e){var a=e.join(" ");if(ENVIRONMENT_IS_NODE){fs.writeSync(2,a+`\\n`);return}console.error(a)}function threadAlert(...e){var a=e.join(" ");postMessage({cmd:"alert",text:a,threadId:Module._pthread_self()})}var err=threadPrintErr;self.alert=threadAlert,Module.instantiateWasm=(e,a)=>{var r=Module.wasmModule;Module.wasmModule=null;var t=new WebAssembly.Instance(r,e);return a(t)},self.onunhandledrejection=e=>{throw e.reason||e};function handleMessage(e){try{if(e.data.cmd==="load"){let r=[];self.onmessage=t=>r.push(t),self.startWorker=t=>{Module=t,postMessage({cmd:"loaded"});for(let s of r)handleMessage(s);self.onmessage=handleMessage},Module.wasmModule=e.data.wasmModule;for(const t of e.data.handlers)Module[t]=(...s)=>{postMessage({cmd:"callHandler",handler:t,args:s})};if(Module.wasmMemory=e.data.wasmMemory,Module.buffer=Module.wasmMemory.buffer,Module.ENVIRONMENT_IS_PTHREAD=!0,typeof e.data.urlOrBlob=="string")importScripts(e.data.urlOrBlob);else{var a=URL.createObjectURL(e.data.urlOrBlob);importScripts(a),URL.revokeObjectURL(a)}ortWasmThreaded(Module)}else if(e.data.cmd==="run"){Module.__emscripten_thread_init(e.data.pthread_ptr,0,0,1),Module.__emscripten_thread_mailbox_await(e.data.pthread_ptr),Module.establishStackSpace(),Module.PThread.receiveObjectTransfer(e.data),Module.PThread.threadInitTLS(),initializedJS||(initializedJS=!0);try{Module.invokeEntryPoint(e.data.start_routine,e.data.arg)}catch(r){if(r!="unwind")throw r}}else e.data.cmd==="cancel"?Module._pthread_self()&&Module.__emscripten_thread_exit(-1):e.data.target==="setimmediate"||(e.data.cmd==="checkMailbox"?initializedJS&&Module.checkMailbox():e.data.cmd&&(err(`worker.js received unknown command ${e.data.cmd}`),err(e.data)))}catch(r){throw Module.__emscripten_thread_crashed?.(),r}}self.onmessage=handleMessage;\\n\'});var Er;Er=pr();var rn=Or(),Ft,Pt=!1,ct=!1,_r=!1,nn=i=>{if(i===1)return!1;if(typeof SharedArrayBuffer>"u")return typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+i+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),!1;typeof process<"u"&&process.versions&&process.versions.node&&console.warn("env.wasm.numThreads is set to "+i+", however, currently onnxruntime-web does not support multi-threads in Node.js. Please consider using onnxruntime-node for performance critical scenarios.");try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},an=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},on=(i,c)=>i?c?"ort-wasm-simd-threaded.wasm":"ort-wasm-simd.wasm":c?"ort-wasm-threaded.wasm":"ort-wasm.wasm",Sr=async i=>{if(Pt)return Promise.resolve();if(ct)throw new Error("multiple calls to \'initializeWebAssembly()\' detected.");if(_r)throw new Error("previous call to \'initializeWebAssembly()\' failed.");ct=!0;let c=i.initTimeout,a=i.numThreads,h=i.simd,f=nn(a),w=h&&an(),g=i.wasmPaths,s=typeof g=="string"?g:void 0,S=on(w,f),x=typeof g=="object"?g[S]:void 0,H=!1,A=[];if(c>0&&A.push(new Promise(I=>{setTimeout(()=>{H=!0,I()},c)})),A.push(new Promise((I,V)=>{let R=f?rn:Er,B={locateFile:(D,T)=>f&&D.endsWith(".worker.js")&&typeof Blob<"u"?URL.createObjectURL(new Blob([vr()],{type:"text/javascript"})):D.endsWith(".wasm")?x||(s??T)+S:T+D};if(f)if(B.numThreads=a,typeof Blob>"u")B.mainScriptUrlOrBlob=(void 0)(__dirname,"ort-wasm-threaded.js");else{let D=`var ortWasmThreaded=${R.toString()};`;B.mainScriptUrlOrBlob=new Blob([D],{type:"text/javascript"})}R(B).then(D=>{ct=!1,Pt=!0,Ft=D,I()},D=>{ct=!1,_r=!0,V(D)})})),await Promise.race(A),H)throw new Error(`WebAssembly backend initializing failed due to timeout: ${c}ms`)},Q=()=>{if(Pt&&Ft)return Ft;throw new Error("WebAssembly is not initialized yet.")};var Y=(i,c)=>{let a=Q(),h=a.lengthBytesUTF8(i)+1,f=a._malloc(h);return a.stringToUTF8(i,f,h),c.push(f),f},tt=(i,c,a,h)=>{if(typeof i=="object"&&i!==null){if(a.has(i))throw new Error("Circular reference in options");a.add(i)}Object.entries(i).forEach(([f,w])=>{let g=c?c+f:f;if(typeof w=="object")tt(w,g+".",a,h);else if(typeof w=="string"||typeof w=="number")h(g,w.toString());else if(typeof w=="boolean")h(g,w?"1":"0");else throw new Error(`Can\'t handle extra config type: ${typeof w}`)})},j=i=>{let c=Q(),a=c.stackSave();try{let h=c.stackAlloc(8);c._OrtGetLastError(h,h+4);let f=c.HEAP32[h/4],w=c.HEAPU32[h/4+1],g=w?c.UTF8ToString(w):"";throw new Error(`${i} ERROR_CODE: ${f}, ERROR_MESSAGE: ${g}`)}finally{c.stackRestore(a)}};var Ar=i=>{let c=Q(),a=0,h=[],f=i||{};try{if(i?.logSeverityLevel===void 0)f.logSeverityLevel=2;else if(typeof i.logSeverityLevel!="number"||!Number.isInteger(i.logSeverityLevel)||i.logSeverityLevel<0||i.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${i.logSeverityLevel}`);if(i?.logVerbosityLevel===void 0)f.logVerbosityLevel=0;else if(typeof i.logVerbosityLevel!="number"||!Number.isInteger(i.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${i.logVerbosityLevel}`);i?.terminate===void 0&&(f.terminate=!1);let w=0;return i?.tag!==void 0&&(w=Y(i.tag,h)),a=c._OrtCreateRunOptions(f.logSeverityLevel,f.logVerbosityLevel,!!f.terminate,w),a===0&&j("Can\'t create run options."),i?.extra!==void 0&&tt(i.extra,"",new WeakSet,(g,s)=>{let S=Y(g,h),x=Y(s,h);c._OrtAddRunConfigEntry(a,S,x)!==0&&j(`Can\'t set a run config entry: ${g} - ${s}.`)}),[a,h]}catch(w){throw a!==0&&c._OrtReleaseRunOptions(a),h.forEach(g=>c._free(g)),w}};var sn=i=>{switch(i){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${i}`)}},un=i=>{switch(i){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${i}`)}},fn=i=>{i.extra||(i.extra={}),i.extra.session||(i.extra.session={});let c=i.extra.session;c.use_ort_model_bytes_directly||(c.use_ort_model_bytes_directly="1"),i.executionProviders&&i.executionProviders.some(a=>(typeof a=="string"?a:a.name)==="webgpu")&&(i.enableMemPattern=!1)},ln=(i,c,a)=>{for(let h of c){let f=typeof h=="string"?h:h.name;switch(f){case"webnn":if(f="WEBNN",typeof h!="string"){let g=h;if(g?.deviceType){let s=Y("deviceType",a),S=Y(g.deviceType,a);Q()._OrtAddSessionConfigEntry(i,s,S)!==0&&j(`Can\'t set a session config entry: \'deviceType\' - ${g.deviceType}.`)}if(g?.numThreads){let s=g.numThreads;(typeof s!="number"||!Number.isInteger(s)||s<0)&&(s=0);let S=Y("numThreads",a),x=Y(s.toString(),a);Q()._OrtAddSessionConfigEntry(i,S,x)!==0&&j(`Can\'t set a session config entry: \'numThreads\' - ${g.numThreads}.`)}if(g?.powerPreference){let s=Y("powerPreference",a),S=Y(g.powerPreference,a);Q()._OrtAddSessionConfigEntry(i,s,S)!==0&&j(`Can\'t set a session config entry: \'powerPreference\' - ${g.powerPreference}.`)}}break;case"webgpu":if(f="JS",typeof h!="string"){let g=h;if(g?.preferredLayout){if(g.preferredLayout!=="NCHW"&&g.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either \'NCHW\' or \'NHWC\': ${g.preferredLayout}`);let s=Y("preferredLayout",a),S=Y(g.preferredLayout,a);Q()._OrtAddSessionConfigEntry(i,s,S)!==0&&j(`Can\'t set a session config entry: \'preferredLayout\' - ${g.preferredLayout}.`)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${f}`)}let w=Y(f,a);Q()._OrtAppendExecutionProvider(i,w)!==0&&j(`Can\'t append execution provider: ${f}.`)}},Tr=i=>{let c=Q(),a=0,h=[],f=i||{};fn(f);try{let w=sn(f.graphOptimizationLevel??"all"),g=un(f.executionMode??"sequential"),s=typeof f.logId=="string"?Y(f.logId,h):0,S=f.logSeverityLevel??2;if(!Number.isInteger(S)||S<0||S>4)throw new Error(`log serverity level is not valid: ${S}`);let x=f.logVerbosityLevel??0;if(!Number.isInteger(x)||x<0||x>4)throw new Error(`log verbosity level is not valid: ${x}`);let H=typeof f.optimizedModelFilePath=="string"?Y(f.optimizedModelFilePath,h):0;if(a=c._OrtCreateSessionOptions(w,!!f.enableCpuMemArena,!!f.enableMemPattern,g,!!f.enableProfiling,0,s,S,x,H),a===0&&j("Can\'t create session options."),f.executionProviders&&ln(a,f.executionProviders,h),f.enableGraphCapture!==void 0){if(typeof f.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${f.enableGraphCapture}`);let A=Y("enableGraphCapture",h),I=Y(f.enableGraphCapture.toString(),h);c._OrtAddSessionConfigEntry(a,A,I)!==0&&j(`Can\'t set a session config entry: \'enableGraphCapture\' - ${f.enableGraphCapture}.`)}if(f.freeDimensionOverrides)for(let[A,I]of Object.entries(f.freeDimensionOverrides)){if(typeof A!="string")throw new Error(`free dimension override name must be a string: ${A}`);if(typeof I!="number"||!Number.isInteger(I)||I<0)throw new Error(`free dimension override value must be a non-negative integer: ${I}`);let V=Y(A,h);c._OrtAddFreeDimensionOverride(a,V,I)!==0&&j(`Can\'t set a free dimension override: ${A} - ${I}.`)}return f.extra!==void 0&&tt(f.extra,"",new WeakSet,(A,I)=>{let V=Y(A,h),R=Y(I,h);c._OrtAddSessionConfigEntry(a,V,R)!==0&&j(`Can\'t set a session config entry: ${A} - ${I}.`)}),[a,h]}catch(w){throw a!==0&&c._OrtReleaseSessionOptions(a),h.forEach(g=>c._free(g)),w}};var xt=i=>{switch(i){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;default:throw new Error(`unsupported data type: ${i}`)}},Mr=i=>{switch(i){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";default:throw new Error(`unsupported data type: ${i}`)}},Ut=i=>[void 0,4,1,1,2,2,4,8,void 0,1,2,8,4,8,void 0,void 0,void 0][i],Cr=i=>{switch(i){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${i}`)}},Dr=i=>{switch(i){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${i}`)}},Fr=i=>i==="float32"||i==="float16"||i==="int32"||i==="int64"||i==="uint32"||i==="uint8"||i==="bool",Pr=i=>{switch(i){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;default:throw new Error(`unsupported data location: ${i}`)}};var xr=async i=>{if(typeof i=="string")if(typeof process<"u"&&process.versions&&process.versions.node)try{return new Uint8Array(await(void 0)(i))}catch(c){if(c.code==="ERR_FS_FILE_TOO_LARGE"){let a=(void 0)(i),h=[];for await(let f of a)h.push(f);return new Uint8Array(Buffer.concat(h))}throw c}else{let c=await fetch(i);if(!c.ok)throw new Error(`failed to load external data file: ${i}`);let a=c.headers.get("Content-Length"),h=a?parseInt(a,10):0;if(h<1073741824)return new Uint8Array(await c.arrayBuffer());{if(!c.body)throw new Error(`failed to load external data file: ${i}, no response body.`);let f=c.body.getReader(),w;try{w=new ArrayBuffer(h)}catch(s){if(s instanceof RangeError){let S=Math.ceil(h/65536);w=new WebAssembly.Memory({initial:S,maximum:S}).buffer}else throw s}let g=0;for(;;){let{done:s,value:S}=await f.read();if(s)break;let x=S.byteLength;new Uint8Array(w,g,x).set(S),g+=x}return new Uint8Array(w,0,h)}}else return i instanceof Blob?new Uint8Array(await i.arrayBuffer()):i instanceof Uint8Array?i:new Uint8Array(i)};var cn=(i,c)=>{Q()._OrtInit(i,c)!==0&&j("Can\'t initialize onnxruntime.")},Lr=async i=>{cn(i.wasm.numThreads,Dr(i.logLevel))},Rr=async(i,c)=>{},Ye=new Map,dn=i=>{let c=Q(),a=c.stackSave();try{let h=c.stackAlloc(8);return c._OrtGetInputOutputCount(i,h,h+4)!==0&&j("Can\'t get session input/output count."),[c.HEAP32[h/4],c.HEAP32[h/4+1]]}finally{c.stackRestore(a)}},Lt=i=>{let c=Q(),a=c._malloc(i.byteLength);if(a===0)throw new Error(`Can\'t create a session. failed to allocate a buffer of size ${i.byteLength}.`);return c.HEAPU8.set(i,a),[a,i.byteLength]},Ir=async(i,c)=>{let a,h,f=Q();Array.isArray(i)?[a,h]=i:i.buffer===f.HEAPU8.buffer?[a,h]=[i.byteOffset,i.byteLength]:[a,h]=Lt(i);let w=0,g=0,s=0,S=[],x=[],H=[];try{if([g,S]=Tr(c),c?.externalData&&f.mountExternalData){let L=[];for(let W of c.externalData){let de=typeof W=="string"?W:W.path;L.push(xr(typeof W=="string"?W:W.data).then(pe=>{f.mountExternalData(de,pe)}))}await Promise.all(L)}w=await f._OrtCreateSession(a,h,g),w===0&&j("Can\'t create a session.");let[A,I]=dn(w),V=!!c?.enableGraphCapture,R=[],B=[],D=[];for(let L=0;L<A;L++){let W=f._OrtGetInputName(w,L);W===0&&j("Can\'t get an input name."),x.push(W),R.push(f.UTF8ToString(W))}for(let L=0;L<I;L++){let W=f._OrtGetOutputName(w,L);W===0&&j("Can\'t get an output name."),H.push(W);let de=f.UTF8ToString(W);B.push(de)}let T=null;return Ye.set(w,[w,x,H,T,V,!1]),[w,R,B]}catch(A){throw x.forEach(I=>f._OrtFree(I)),H.forEach(I=>f._OrtFree(I)),s!==0&&f._OrtReleaseBinding(s),w!==0&&f._OrtReleaseSession(w),A}finally{f._free(a),g!==0&&f._OrtReleaseSessionOptions(g),S.forEach(A=>f._free(A)),f.unmountExternalData?.()}},Br=i=>{let c=Q(),a=Ye.get(i);if(!a)throw new Error(`cannot release session. invalid session id: ${i}`);let[h,f,w,g,s]=a;g&&(s&&c._OrtClearBoundOutputs(g.handle),c._OrtReleaseBinding(g.handle)),c.jsepOnReleaseSession?.(i),f.forEach(S=>c._OrtFree(S)),w.forEach(S=>c._OrtFree(S)),c._OrtReleaseSession(h),Ye.delete(i)},Ur=(i,c,a,h,f,w=!1)=>{if(!i){c.push(0);return}let g=Q(),s=i[0],S=i[1],x=i[3],H,A;if(s==="string"&&x==="gpu-buffer")throw new Error("String tensor is not supported on GPU.");if(w&&x!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${f} when enableGraphCapture is true.`);if(x==="gpu-buffer"){let R=i[2].gpuBuffer,B=Ut(xt(s));A=S.reduce((T,L)=>T*L,1)*B;let D=g.jsepRegisterBuffer;if(!D)throw new Error(\'Tensor location "gpu-buffer" is not supported without using WebGPU.\');H=D(h,f,R,A)}else{let R=i[2];if(Array.isArray(R)){A=4*R.length,H=g._malloc(A),a.push(H);let B=H/4;for(let D=0;D<R.length;D++){if(typeof R[D]!="string")throw new TypeError(`tensor data at index ${D} is not a string`);g.HEAPU32[B++]=Y(R[D],a)}}else A=R.byteLength,H=g._malloc(A),a.push(H),g.HEAPU8.set(new Uint8Array(R.buffer,R.byteOffset,A),H)}let I=g.stackSave(),V=g.stackAlloc(4*S.length);try{let R=V/4;S.forEach(D=>g.HEAP32[R++]=D);let B=g._OrtCreateTensor(xt(s),H,A,V,S.length,Pr(x));B===0&&j(`Can\'t create tensor for input/output. session=${h}, index=${f}.`),c.push(B)}finally{g.stackRestore(I)}},kr=async(i,c,a,h,f,w)=>{let g=Q(),s=Ye.get(i);if(!s)throw new Error(`cannot run inference. invalid session id: ${i}`);let S=s[0],x=s[1],H=s[2],A=s[3],I=s[4],V=s[5],R=c.length,B=h.length,D=0,T=[],L=[],W=[],de=[],pe=g.stackSave(),Z=g.stackAlloc(R*4),_=g.stackAlloc(R*4),J=g.stackAlloc(B*4),Pe=g.stackAlloc(B*4);try{[D,T]=Ar(w);for(let F=0;F<R;F++)Ur(a[F],L,de,i,c[F],I);for(let F=0;F<B;F++)Ur(f[F],W,de,i,R+h[F],I);let le=Z/4,Ie=_/4,ne=J/4,X=Pe/4;for(let F=0;F<R;F++)g.HEAPU32[le++]=L[F],g.HEAPU32[Ie++]=x[c[F]];for(let F=0;F<B;F++)g.HEAPU32[ne++]=W[F],g.HEAPU32[X++]=H[h[F]];g.jsepOnRunStart?.(S);let we;we=await g._OrtRun(S,_,Z,R,Pe,B,J,D),we!==0&&j("failed to call OrtRun().");let me=[];for(let F=0;F<B;F++){let ie=g.HEAPU32[J/4+F];if(ie===W[F]){me.push(f[F]);continue}let xe=g.stackSave(),ce=g.stackAlloc(4*4),be=!1,ae,K=0;try{g._OrtGetTensorData(ie,ce,ce+4,ce+8,ce+12)!==0&&j(`Can\'t access output tensor data on index ${F}.`);let Oe=ce/4,Ue=g.HEAPU32[Oe++];K=g.HEAPU32[Oe++];let ve=g.HEAPU32[Oe++],Ae=g.HEAPU32[Oe++],_e=[];for(let te=0;te<Ae;te++)_e.push(g.HEAPU32[ve/4+te]);g._OrtFree(ve);let ge=_e.reduce((te,re)=>te*re,1);ae=Mr(Ue);let Be=A?.outputPreferredLocations[h[F]];if(ae==="string"){if(Be==="gpu-buffer")throw new Error("String tensor is not supported on GPU.");let te=[],re=K/4;for(let ue=0;ue<ge;ue++){let Ee=g.HEAPU32[re++],Se=ue===ge-1?void 0:g.HEAPU32[re]-Ee;te.push(g.UTF8ToString(Ee,Se))}me.push([ae,_e,te,"cpu"])}else if(Be==="gpu-buffer"&&ge>0){let te=g.jsepGetBuffer;if(!te)throw new Error(\'preferredLocation "gpu-buffer" is not supported without using WebGPU.\');let re=te(K),ue=Ut(Ue);if(ue===void 0||!Fr(ae))throw new Error(`Unsupported data type: ${ae}`);be=!0,me.push([ae,_e,{gpuBuffer:re,download:g.jsepCreateDownloader(re,ge*ue,ae),dispose:()=>{g._OrtReleaseTensor(ie)}},"gpu-buffer"])}else{let te=Cr(ae),re=new te(ge);new Uint8Array(re.buffer,re.byteOffset,re.byteLength).set(g.HEAPU8.subarray(K,K+re.byteLength)),me.push([ae,_e,re,"cpu"])}}finally{g.stackRestore(xe),ae==="string"&&K&&g._free(K),be||g._OrtReleaseTensor(ie)}}return A&&!I&&(g._OrtClearBoundOutputs(A.handle),Ye.set(i,[S,x,H,A,I,!1])),me}finally{g.stackRestore(pe),L.forEach(le=>g._OrtReleaseTensor(le)),W.forEach(le=>g._OrtReleaseTensor(le)),de.forEach(le=>g._free(le)),D!==0&&g._OrtReleaseRunOptions(D),T.forEach(le=>g._free(le))}},Wr=i=>{let c=Q(),a=Ye.get(i);if(!a)throw new Error("invalid session id");let h=a[0],f=c._OrtEndProfiling(h);f===0&&j("Can\'t get an profile file name."),c._OrtFree(f)},Nr=i=>{let c=[];for(let a of i){let h=a[2];!Array.isArray(h)&&"buffer"in h&&c.push(h.buffer)}return c};self.onmessage=i=>{let{type:c,in:a}=i.data;try{switch(c){case"init-wasm":Sr(a.wasm).then(()=>{Lr(a).then(()=>{postMessage({type:c})},h=>{postMessage({type:c,err:h})})},h=>{postMessage({type:c,err:h})});break;case"init-ep":{let{epName:h,env:f}=a;Rr(f,h).then(()=>{postMessage({type:c})},w=>{postMessage({type:c,err:w})});break}case"copy-from":{let{buffer:h}=a,f=Lt(h);postMessage({type:c,out:f});break}case"create":{let{model:h,options:f}=a;Ir(h,f).then(w=>{postMessage({type:c,out:w})},w=>{postMessage({type:c,err:w})});break}case"release":Br(a),postMessage({type:c});break;case"run":{let{sessionId:h,inputIndices:f,inputs:w,outputIndices:g,options:s}=a;kr(h,f,w,g,new Array(g.length).fill(null),s).then(S=>{S.some(x=>x[3]!=="cpu")?postMessage({type:c,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:c,out:S},Nr([...w,...S]))},S=>{postMessage({type:c,err:S})});break}case"end-profiling":Wr(a),postMessage({type:c});break;default:}}catch(h){postMessage({type:c,err:h})}};})();\n';
    });
    Or = H(() => {
      "use strict";
      Qe();
      oa();
      at();
      Ke = () => !!j.wasm.proxy && typeof document < "u", Ot = false, $t = false, Gt = false, vr = /* @__PURE__ */ new Map(), it = (r, t) => {
        let n = vr.get(r);
        n ? n.push(t) : vr.set(r, [t]);
      }, st = () => {
        if (Ot || !$t || Gt || !Te) throw new Error("worker not ready");
      }, Ja = (r) => {
        switch (r.data.type) {
          case "init-wasm":
            Ot = false, r.data.err ? (Gt = true, br[1](r.data.err)) : ($t = true, br[0]());
            break;
          case "init-ep":
          case "copy-from":
          case "create":
          case "release":
          case "run":
          case "end-profiling": {
            let t = vr.get(r.data.type);
            r.data.err ? t.shift()[1](r.data.err) : t.shift()[0](r.data.out);
            break;
          }
          default:
        }
      }, Ht = typeof document < "u" ? document?.currentScript?.src : void 0, sa = async () => {
        if (!$t) {
          if (Ot) throw new Error("multiple calls to 'initWasm()' detected.");
          if (Gt) throw new Error("previous call to 'initWasm()' failed.");
          if (Ot = true, Ke()) return j.wasm.wasmPaths === void 0 && Ht && Ht.indexOf("blob:") !== 0 && (j.wasm.wasmPaths = Ht.substr(0, +Ht.lastIndexOf("/") + 1)), new Promise((r, t) => {
            Te?.terminate();
            let n = URL.createObjectURL(new Blob([ia()], { type: "text/javascript" }));
            Te = new Worker(n, { name: "ort-wasm-proxy-worker" }), Te.onerror = (i) => t(i), Te.onmessage = Ja, URL.revokeObjectURL(n), br = [r, t];
            let f = { type: "init-wasm", in: j };
            Te.postMessage(f);
          });
          try {
            await $n(j.wasm), await Qn(j), $t = true;
          } catch (r) {
            throw Gt = true, r;
          } finally {
            Ot = false;
          }
        }
      }, ua = async (r) => {
        if (Ke()) return st(), new Promise((t, n) => {
          it("init-ep", [t, n]);
          let f = { type: "init-ep", in: { epName: r, env: j } };
          Te.postMessage(f);
        });
        await Kn(j, r);
      }, fa = async (r) => Ke() ? (st(), new Promise((t, n) => {
        it("copy-from", [t, n]);
        let f = { type: "copy-from", in: { buffer: r } };
        Te.postMessage(f, [r.buffer]);
      })) : wr(r), la = async (r, t) => {
        if (Ke()) {
          if (t?.preferredOutputLocation) throw new Error('session option "preferredOutputLocation" is not supported for proxy.');
          return st(), new Promise((n, f) => {
            it("create", [n, f]);
            let i = { type: "create", in: { model: r, options: { ...t } } }, m = [];
            r instanceof Uint8Array && m.push(r.buffer), Te.postMessage(i, m);
          });
        } else return ea(r, t);
      }, ca = async (r) => {
        if (Ke()) return st(), new Promise((t, n) => {
          it("release", [t, n]);
          let f = { type: "release", in: r };
          Te.postMessage(f);
        });
        ta(r);
      }, da = async (r, t, n, f, i, m) => {
        if (Ke()) {
          if (n.some((c) => c[3] !== "cpu")) throw new Error("input tensor on GPU is not supported for proxy.");
          if (i.some((c) => c)) throw new Error("pre-allocated output tensor is not supported for proxy.");
          return st(), new Promise((c, s) => {
            it("run", [c, s]);
            let h = n, g = { type: "run", in: { sessionId: r, inputIndices: t, inputs: h, outputIndices: f, options: m } };
            Te.postMessage(g, aa(h));
          });
        } else return ra(r, t, n, f, i, m);
      }, pa = async (r) => {
        if (Ke()) return st(), new Promise((t, n) => {
          it("end-profiling", [t, n]);
          let f = { type: "end-profiling", in: r };
          Te.postMessage(f);
        });
        na(r);
      };
    });
    ha = H(() => {
      "use strict";
      Qe();
      Or();
      gr();
      yr();
      ma = (r, t) => {
        switch (r.location) {
          case "cpu":
            return [r.type, r.dims, r.data, "cpu"];
          case "gpu-buffer":
            return [r.type, r.dims, { gpuBuffer: r.gpuBuffer }, "gpu-buffer"];
          default:
            throw new Error(`invalid data location: ${r.location} for ${t()}`);
        }
      }, Za = (r) => {
        switch (r[3]) {
          case "cpu":
            return new me(r[0], r[2], r[1]);
          case "gpu-buffer": {
            let t = r[0];
            if (!Wt(t)) throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);
            let { gpuBuffer: n, download: f, dispose: i } = r[2];
            return me.fromGpuBuffer(n, { dataType: t, dims: r[1], download: f, dispose: i });
          }
          default:
            throw new Error(`invalid data location: ${r[3]}`);
        }
      }, jt = class {
        async fetchModelAndCopyToWasmMemory(t) {
          return fa(await vt(t));
        }
        async loadModel(t, n) {
          Je();
          let f;
          typeof t == "string" ? typeof process < "u" && process.versions && process.versions.node ? f = await vt(t) : f = await this.fetchModelAndCopyToWasmMemory(t) : f = t, [this.sessionId, this.inputNames, this.outputNames] = await la(f, n), Ze();
        }
        async dispose() {
          return ca(this.sessionId);
        }
        async run(t, n, f) {
          Je();
          let i = [], m = [];
          Object.entries(t).forEach((O) => {
            let M = O[0], P = O[1], U = this.inputNames.indexOf(M);
            if (U === -1) throw new Error(`invalid input '${M}'`);
            i.push(P), m.push(U);
          });
          let c = [], s = [];
          Object.entries(n).forEach((O) => {
            let M = O[0], P = O[1], U = this.outputNames.indexOf(M);
            if (U === -1) throw new Error(`invalid output '${M}'`);
            c.push(P), s.push(U);
          });
          let h = i.map((O, M) => ma(O, () => `input "${this.inputNames[m[M]]}"`)), g = c.map((O, M) => O ? ma(O, () => `output "${this.outputNames[s[M]]}"`) : null), _ = await da(this.sessionId, m, h, s, g, f), v = {};
          for (let O = 0; O < _.length; O++) v[this.outputNames[s[O]]] = c[O] ?? Za(_[O]);
          return Ze(), v;
        }
        startProfiling() {
        }
        endProfiling() {
          pa(this.sessionId);
        }
      };
    });
    ga = H(() => {
      "use strict";
      Qe();
      Or();
      ha();
      Qa = () => {
        if ((typeof j.wasm.initTimeout != "number" || j.wasm.initTimeout < 0) && (j.wasm.initTimeout = 0), typeof j.wasm.simd != "boolean" && (j.wasm.simd = true), typeof j.wasm.proxy != "boolean" && (j.wasm.proxy = false), typeof j.wasm.trace != "boolean" && (j.wasm.trace = false), typeof j.wasm.numThreads != "number" || !Number.isInteger(j.wasm.numThreads) || j.wasm.numThreads <= 0) {
          (typeof self < "u" && !self.crossOriginIsolated || typeof process < "u" && process.versions && process.versions.node) && (j.wasm.numThreads = 1);
          let r = typeof navigator > "u" ? (void 0)().length : navigator.hardwareConcurrency;
          j.wasm.numThreads = Math.min(4, Math.ceil((r || 1) / 2));
        }
      }, zt = class {
        async init(t) {
          Qa(), await sa(), await ua(t);
        }
        async createInferenceSessionHandler(t, n) {
          let f = new jt();
          return await f.loadModel(t, n), Promise.resolve(f);
        }
      };
    });
    ya = {};
    gt(ya, { wasmBackend: () => Ka });
    wa = H(() => {
      "use strict";
      ga();
      Ka = new zt();
    });
    Qe();
    Qe();
    Qe();
    Mn = "1.18.0";
    Ni = or;
    {
      let r = (wa(), nt(ya)).wasmBackend;
      yt("cpu", r, 10), yt("wasm", r, 10);
    }
    Object.defineProperty(j.versions, "web", { value: Mn, enumerable: true });
  }
});

// vendor/piper/voices_static-D_OtJDHM.js
var voices_static_D_OtJDHM_exports = {};
__export(voices_static_D_OtJDHM_exports, {
  default: () => voices_static
});
var voices_static;
var init_voices_static_D_OtJDHM = __esm({
  "vendor/piper/voices_static-D_OtJDHM.js"() {
    voices_static = {
      "ar_JO-kareem-low": {
        key: "ar_JO-kareem-low",
        name: "kareem",
        language: {
          code: "ar_JO",
          family: "ar",
          region: "JO",
          name_native: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          name_english: "Arabic",
          country_english: "Jordan"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "ar/ar_JO/kareem/low/ar_JO-kareem-low.onnx": {
            size_bytes: 63201294,
            md5_digest: "d335cd06fe4045a7ee9d8fb0712afaa9"
          },
          "ar/ar_JO/kareem/low/ar_JO-kareem-low.onnx.json": {
            size_bytes: 5022,
            md5_digest: "465724f7d2d5f2ff061b53acb8e7f7cc"
          },
          "ar/ar_JO/kareem/low/MODEL_CARD": {
            size_bytes: 274,
            md5_digest: "b6f0eaf5a7fd094be22a1bcb162173fb"
          }
        },
        aliases: []
      },
      "ar_JO-kareem-medium": {
        key: "ar_JO-kareem-medium",
        name: "kareem",
        language: {
          code: "ar_JO",
          family: "ar",
          region: "JO",
          name_native: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
          name_english: "Arabic",
          country_english: "Jordan"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "ar/ar_JO/kareem/medium/ar_JO-kareem-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "c0697df8a7fb180079cc5ac523f91a8e"
          },
          "ar/ar_JO/kareem/medium/ar_JO-kareem-medium.onnx.json": {
            size_bytes: 5024,
            md5_digest: "dd70b31eb5a395907241b1e5367ace3a"
          },
          "ar/ar_JO/kareem/medium/MODEL_CARD": {
            size_bytes: 283,
            md5_digest: "9ec7a4a27b89946848dce9b7f5c53cfd"
          }
        },
        aliases: []
      },
      "ca_ES-upc_ona-medium": {
        key: "ca_ES-upc_ona-medium",
        name: "upc_ona",
        language: {
          code: "ca_ES",
          family: "ca",
          region: "ES",
          name_native: "Catal\xE0",
          name_english: "Catalan",
          country_english: "Spain"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "ca/ca_ES/upc_ona/medium/ca_ES-upc_ona-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "58ff3b049b6b721a4c353a551ec5ef3a"
          },
          "ca/ca_ES/upc_ona/medium/ca_ES-upc_ona-medium.onnx.json": {
            size_bytes: 4875,
            md5_digest: "035e9eb642ab9fa1354f53a77877ae9b"
          },
          "ca/ca_ES/upc_ona/medium/MODEL_CARD": {
            size_bytes: 296,
            md5_digest: "395c782a56632400f46e7c442c7718bb"
          }
        },
        aliases: []
      },
      "ca_ES-upc_ona-x_low": {
        key: "ca_ES-upc_ona-x_low",
        name: "upc_ona",
        language: {
          code: "ca_ES",
          family: "ca",
          region: "ES",
          name_native: "Catal\xE0",
          name_english: "Catalan",
          country_english: "Spain"
        },
        quality: "x_low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "ca/ca_ES/upc_ona/x_low/ca_ES-upc_ona-x_low.onnx": {
            size_bytes: 20628813,
            md5_digest: "ca22734cd8c5b01dd1fefbb42067ab06"
          },
          "ca/ca_ES/upc_ona/x_low/ca_ES-upc_ona-x_low.onnx.json": {
            size_bytes: 4159,
            md5_digest: "82ccdadad1c203feaff8f77aef9087a3"
          },
          "ca/ca_ES/upc_ona/x_low/MODEL_CARD": {
            size_bytes: 258,
            md5_digest: "1f555643ff6f7d9133679d730f3f6016"
          }
        },
        aliases: [
          "ca-upc_ona-x-low"
        ]
      },
      "ca_ES-upc_pau-x_low": {
        key: "ca_ES-upc_pau-x_low",
        name: "upc_pau",
        language: {
          code: "ca_ES",
          family: "ca",
          region: "ES",
          name_native: "Catal\xE0",
          name_english: "Catalan",
          country_english: "Spain"
        },
        quality: "x_low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "ca/ca_ES/upc_pau/x_low/ca_ES-upc_pau-x_low.onnx": {
            size_bytes: 28130791,
            md5_digest: "504e8a643d5284fbfc95e9e392288b86"
          },
          "ca/ca_ES/upc_pau/x_low/ca_ES-upc_pau-x_low.onnx.json": {
            size_bytes: 4159,
            md5_digest: "0f6d8f5c3113d9443b9be1690c7a7d4c"
          },
          "ca/ca_ES/upc_pau/x_low/MODEL_CARD": {
            size_bytes: 258,
            md5_digest: "4ff8699c4439c9f49180457f0becc49e"
          }
        },
        aliases: [
          "ca-upc_pau-x-low"
        ]
      },
      "cs_CZ-jirka-low": {
        key: "cs_CZ-jirka-low",
        name: "jirka",
        language: {
          code: "cs_CZ",
          family: "cs",
          region: "CZ",
          name_native: "\u010Ce\u0161tina",
          name_english: "Czech",
          country_english: "Czech Republic"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "cs/cs_CZ/jirka/low/cs_CZ-jirka-low.onnx": {
            size_bytes: 63201294,
            md5_digest: "82b99b7adeaccf9fec011458623405b2"
          },
          "cs/cs_CZ/jirka/low/cs_CZ-jirka-low.onnx.json": {
            size_bytes: 5022,
            md5_digest: "a28c860a87620da2a44ccae38a915aee"
          },
          "cs/cs_CZ/jirka/low/MODEL_CARD": {
            size_bytes: 275,
            md5_digest: "a37afbc4197ab16ab6e2209e2ecc2ae0"
          }
        },
        aliases: []
      },
      "cs_CZ-jirka-medium": {
        key: "cs_CZ-jirka-medium",
        name: "jirka",
        language: {
          code: "cs_CZ",
          family: "cs",
          region: "CZ",
          name_native: "\u010Ce\u0161tina",
          name_english: "Czech",
          country_english: "Czech Republic"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "cs/cs_CZ/jirka/medium/cs_CZ-jirka-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "da2deb0a3f93226a3f9b6e40d43c46ca"
          },
          "cs/cs_CZ/jirka/medium/cs_CZ-jirka-medium.onnx.json": {
            size_bytes: 5025,
            md5_digest: "2762e45c5b084694093c683a5da7cf94"
          },
          "cs/cs_CZ/jirka/medium/MODEL_CARD": {
            size_bytes: 281,
            md5_digest: "85a220211eadd9b89f3dc023d82966b4"
          }
        },
        aliases: []
      },
      "cy_GB-gwryw_gogleddol-medium": {
        key: "cy_GB-gwryw_gogleddol-medium",
        name: "gwryw_gogleddol",
        language: {
          code: "cy_GB",
          family: "cy",
          region: "GB",
          name_native: "Cymraeg",
          name_english: "Welsh",
          country_english: "Great Britain"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "cy/cy_GB/gwryw_gogleddol/medium/cy_GB-gwryw_gogleddol-medium.onnx": {
            size_bytes: 63511038,
            md5_digest: "76ca79c170b0048b190758c3609e9ab9"
          },
          "cy/cy_GB/gwryw_gogleddol/medium/cy_GB-gwryw_gogleddol-medium.onnx.json": {
            size_bytes: 4975,
            md5_digest: "d780e83a324e9ce8c73146b9d066a283"
          },
          "cy/cy_GB/gwryw_gogleddol/medium/MODEL_CARD": {
            size_bytes: 337,
            md5_digest: "39bd3ade08289afe1cb3f867aef957fa"
          }
        },
        aliases: []
      },
      "da_DK-talesyntese-medium": {
        key: "da_DK-talesyntese-medium",
        name: "talesyntese",
        language: {
          code: "da_DK",
          family: "da",
          region: "DK",
          name_native: "Dansk",
          name_english: "Danish",
          country_english: "Denmark"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "da/da_DK/talesyntese/medium/da_DK-talesyntese-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "9c05494a3e0c1136337581e01222395d"
          },
          "da/da_DK/talesyntese/medium/da_DK-talesyntese-medium.onnx.json": {
            size_bytes: 4878,
            md5_digest: "8a56843f52992e490f062e68c14fa193"
          },
          "da/da_DK/talesyntese/medium/MODEL_CARD": {
            size_bytes: 308,
            md5_digest: "628cc03fca8f5d2c454824d6252955ad"
          }
        },
        aliases: [
          "da-nst_talesyntese-medium"
        ]
      },
      "de_DE-eva_k-x_low": {
        key: "de_DE-eva_k-x_low",
        name: "eva_k",
        language: {
          code: "de_DE",
          family: "de",
          region: "DE",
          name_native: "Deutsch",
          name_english: "German",
          country_english: "Germany"
        },
        quality: "x_low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "de/de_DE/eva_k/x_low/de_DE-eva_k-x_low.onnx": {
            size_bytes: 20628813,
            md5_digest: "51bfc52a58282c2e4fc01ae66567a708"
          },
          "de/de_DE/eva_k/x_low/de_DE-eva_k-x_low.onnx.json": {
            size_bytes: 4158,
            md5_digest: "2034ba7a991ac47d911c98ee4844fc90"
          },
          "de/de_DE/eva_k/x_low/MODEL_CARD": {
            size_bytes: 246,
            md5_digest: "02b01f3d47b2798ece347b2c7e94c9e9"
          }
        },
        aliases: [
          "de-eva_k-x-low"
        ]
      },
      "de_DE-karlsson-low": {
        key: "de_DE-karlsson-low",
        name: "karlsson",
        language: {
          code: "de_DE",
          family: "de",
          region: "DE",
          name_native: "Deutsch",
          name_english: "German",
          country_english: "Germany"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "de/de_DE/karlsson/low/de_DE-karlsson-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "c94b5b8e8c7147b4b2c4a19ca5a3c41b"
          },
          "de/de_DE/karlsson/low/de_DE-karlsson-low.onnx.json": {
            size_bytes: 4159,
            md5_digest: "34efeb531752d0a71ef52eb46600d7bd"
          },
          "de/de_DE/karlsson/low/MODEL_CARD": {
            size_bytes: 289,
            md5_digest: "6e2f3eec10cf7fceb0b68b67eccd06a4"
          }
        },
        aliases: [
          "de-karlsson-low"
        ]
      },
      "de_DE-kerstin-low": {
        key: "de_DE-kerstin-low",
        name: "kerstin",
        language: {
          code: "de_DE",
          family: "de",
          region: "DE",
          name_native: "Deutsch",
          name_english: "German",
          country_english: "Germany"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "de/de_DE/kerstin/low/de_DE-kerstin-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "1d5e5788cfddb04cbb34418f2841931e"
          },
          "de/de_DE/kerstin/low/de_DE-kerstin-low.onnx.json": {
            size_bytes: 4158,
            md5_digest: "a96995af6c1c5b37ed3d62b5107e1d9a"
          },
          "de/de_DE/kerstin/low/MODEL_CARD": {
            size_bytes: 272,
            md5_digest: "69ec1bc99fc7e19c9ddcdf712920a6c7"
          }
        },
        aliases: [
          "de-kerstin-low"
        ]
      },
      "de_DE-mls-medium": {
        key: "de_DE-mls-medium",
        name: "mls",
        language: {
          code: "de_DE",
          family: "de",
          region: "DE",
          name_native: "Deutsch",
          name_english: "German",
          country_english: "Germany"
        },
        quality: "medium",
        num_speakers: 236,
        speaker_id_map: {
          "19": 48,
          "20": 38,
          "91": 83,
          "135": 79,
          "136": 68,
          "137": 81,
          "138": 95,
          "139": 67,
          "140": 137,
          "141": 96,
          "143": 56,
          "144": 105,
          "145": 80,
          "146": 27,
          "252": 8,
          "253": 39,
          "278": 89,
          "287": 158,
          "327": 50,
          "589": 30,
          "989": 61,
          "1033": 170,
          "1054": 99,
          "1091": 163,
          "1163": 98,
          "1171": 74,
          "1262": 127,
          "1474": 66,
          "1593": 93,
          "1613": 157,
          "1649": 26,
          "1660": 117,
          "1724": 161,
          "1757": 82,
          "1844": 100,
          "1874": 126,
          "1897": 45,
          "1920": 184,
          "1946": 86,
          "1965": 165,
          "1998": 31,
          "2034": 142,
          "2037": 2,
          "2043": 55,
          "2158": 144,
          "2234": 53,
          "2252": 132,
          "2314": 172,
          "2422": 0,
          "2497": 24,
          "2506": 166,
          "2602": 13,
          "2677": 43,
          "2732": 143,
          "2792": 202,
          "2840": 183,
          "2859": 181,
          "2909": 164,
          "2946": 21,
          "2974": 107,
          "3040": 112,
          "3052": 134,
          "3124": 54,
          "3244": 51,
          "3276": 189,
          "3277": 87,
          "3330": 180,
          "3363": 111,
          "3494": 20,
          "3503": 7,
          "3588": 118,
          "3631": 71,
          "3685": 226,
          "3698": 145,
          "3731": 77,
          "3759": 42,
          "3797": 32,
          "3862": 94,
          "3885": 15,
          "3990": 10,
          "3995": 234,
          "4001": 135,
          "4153": 179,
          "4174": 14,
          "4396": 65,
          "4414": 167,
          "4463": 130,
          "4468": 198,
          "4512": 154,
          "4533": 23,
          "4536": 1,
          "4542": 29,
          "4576": 153,
          "4650": 78,
          "4705": 122,
          "4730": 140,
          "4739": 138,
          "4748": 119,
          "4911": 101,
          "5055": 6,
          "5244": 33,
          "5283": 22,
          "5295": 121,
          "5324": 52,
          "5405": 62,
          "5406": 182,
          "5424": 12,
          "5595": 88,
          "5632": 76,
          "5675": 146,
          "5753": 11,
          "5764": 168,
          "5819": 227,
          "5823": 218,
          "5934": 108,
          "6067": 113,
          "6117": 214,
          "6315": 147,
          "6448": 215,
          "6507": 5,
          "6611": 199,
          "6646": 209,
          "6659": 141,
          "6719": 44,
          "6826": 173,
          "6880": 47,
          "6905": 178,
          "6952": 232,
          "6982": 160,
          "7002": 109,
          "7006": 225,
          "7120": 90,
          "7150": 231,
          "7194": 41,
          "7202": 149,
          "7242": 70,
          "7261": 102,
          "7270": 196,
          "7272": 124,
          "7320": 125,
          "7328": 34,
          "7406": 91,
          "7449": 235,
          "7456": 136,
          "7479": 75,
          "7483": 195,
          "7486": 210,
          "7515": 217,
          "7579": 193,
          "7624": 104,
          "7906": 73,
          "7998": 35,
          "8125": 123,
          "8139": 57,
          "8223": 103,
          "8294": 64,
          "8305": 187,
          "8325": 133,
          "8337": 28,
          "8427": 175,
          "8450": 120,
          "8470": 17,
          "8567": 219,
          "8634": 155,
          "8659": 59,
          "8675": 194,
          "8704": 197,
          "8732": 206,
          "8743": 115,
          "8769": 110,
          "9132": 9,
          "9168": 176,
          "9207": 159,
          "9241": 185,
          "9287": 177,
          "9353": 228,
          "9494": 114,
          "9514": 84,
          "9515": 49,
          "9538": 60,
          "9565": 3,
          "9610": 37,
          "9639": 19,
          "9646": 58,
          "9706": 174,
          "9908": 72,
          "9948": 97,
          "10087": 63,
          "10148": 4,
          "10162": 204,
          "10163": 186,
          "10179": 36,
          "10191": 162,
          "10349": 131,
          "10364": 213,
          "10433": 216,
          "10536": 191,
          "10614": 192,
          "10625": 151,
          "10791": 69,
          "10819": 205,
          "10870": 128,
          "10904": 148,
          "10947": 220,
          "11299": 139,
          "11328": 207,
          "11355": 229,
          "11413": 190,
          "11480": 150,
          "11481": 203,
          "11497": 200,
          "11546": 152,
          "11695": 92,
          "11772": 201,
          "11869": 221,
          "11870": 211,
          "11920": 208,
          "11927": 18,
          "11987": 233,
          "11990": 46,
          "12174": 230,
          "12275": 25,
          "12335": 222,
          "12379": 129,
          "12415": 16,
          "12417": 212,
          "12461": 188,
          "12500": 223,
          "12776": 169,
          "12899": 40,
          "13255": 116,
          "13494": 85,
          "13626": 156,
          "13726": 171,
          "13755": 224,
          "13871": 106
        },
        files: {
          "de/de_DE/mls/medium/de_DE-mls-medium.onnx": {
            size_bytes: 76961079,
            md5_digest: "bb543a8e82b95993cdd2199a0049623b"
          },
          "de/de_DE/mls/medium/de_DE-mls-medium.onnx.json": {
            size_bytes: 8948,
            md5_digest: "3fb96c627820ac38cff6e8c3ac0e4aa0"
          },
          "de/de_DE/mls/medium/MODEL_CARD": {
            size_bytes: 223,
            md5_digest: "e32e1746dddda1336c1b6725afa6251d"
          }
        },
        aliases: []
      },
      "de_DE-pavoque-low": {
        key: "de_DE-pavoque-low",
        name: "pavoque",
        language: {
          code: "de_DE",
          family: "de",
          region: "DE",
          name_native: "Deutsch",
          name_english: "German",
          country_english: "Germany"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "de/de_DE/pavoque/low/de_DE-pavoque-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "bc37dccbad87fd65c8501c412c0c31ca"
          },
          "de/de_DE/pavoque/low/de_DE-pavoque-low.onnx.json": {
            size_bytes: 4158,
            md5_digest: "424d4f2132ea6d9b7c92f8a19e752ca3"
          },
          "de/de_DE/pavoque/low/MODEL_CARD": {
            size_bytes: 309,
            md5_digest: "e0aacaf7b834938c4e3ad1fb3f68ef87"
          }
        },
        aliases: [
          "de-pavoque-low"
        ]
      },
      "de_DE-ramona-low": {
        key: "de_DE-ramona-low",
        name: "ramona",
        language: {
          code: "de_DE",
          family: "de",
          region: "DE",
          name_native: "Deutsch",
          name_english: "German",
          country_english: "Germany"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "de/de_DE/ramona/low/de_DE-ramona-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "b4aaf3673170a0d96519cdc992c23fda"
          },
          "de/de_DE/ramona/low/de_DE-ramona-low.onnx.json": {
            size_bytes: 4157,
            md5_digest: "d61011961f01f349331b1a1b1b0ca58a"
          },
          "de/de_DE/ramona/low/MODEL_CARD": {
            size_bytes: 255,
            md5_digest: "c970992423b5fc7a26340a9363e15952"
          }
        },
        aliases: [
          "de-ramona-low"
        ]
      },
      "de_DE-thorsten-high": {
        key: "de_DE-thorsten-high",
        name: "thorsten",
        language: {
          code: "de_DE",
          family: "de",
          region: "DE",
          name_native: "Deutsch",
          name_english: "German",
          country_english: "Germany"
        },
        quality: "high",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "de/de_DE/thorsten/high/de_DE-thorsten-high.onnx": {
            size_bytes: 113895201,
            md5_digest: "256505fe58fb8b9d6ed78b83f6b8a9d2"
          },
          "de/de_DE/thorsten/high/de_DE-thorsten-high.onnx.json": {
            size_bytes: 4875,
            md5_digest: "e81686e00a9d825e2488ead660bec6fd"
          },
          "de/de_DE/thorsten/high/MODEL_CARD": {
            size_bytes: 281,
            md5_digest: "582a051328d56a564e8a38c9029ae630"
          }
        },
        aliases: []
      },
      "de_DE-thorsten-low": {
        key: "de_DE-thorsten-low",
        name: "thorsten",
        language: {
          code: "de_DE",
          family: "de",
          region: "DE",
          name_native: "Deutsch",
          name_english: "German",
          country_english: "Germany"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "de/de_DE/thorsten/low/de_DE-thorsten-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "c06eb96aceb61895fcb09ffc30eef60b"
          },
          "de/de_DE/thorsten/low/de_DE-thorsten-low.onnx.json": {
            size_bytes: 4159,
            md5_digest: "c4a38327b98f25524128def8190e8ca0"
          },
          "de/de_DE/thorsten/low/MODEL_CARD": {
            size_bytes: 274,
            md5_digest: "203f58b93f0372564e745f1e05ea47bb"
          }
        },
        aliases: [
          "de-thorsten-low"
        ]
      },
      "de_DE-thorsten-medium": {
        key: "de_DE-thorsten-medium",
        name: "thorsten",
        language: {
          code: "de_DE",
          family: "de",
          region: "DE",
          name_native: "Deutsch",
          name_english: "German",
          country_english: "Germany"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "a129b00fb3078df43c96bab6c94535c0"
          },
          "de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx.json": {
            size_bytes: 4819,
            md5_digest: "843a7bd7272724f750534dd5a26d1aad"
          },
          "de/de_DE/thorsten/medium/MODEL_CARD": {
            size_bytes: 285,
            md5_digest: "e84cf8b09957fccceb068a3c1664d0f3"
          }
        },
        aliases: []
      },
      "de_DE-thorsten_emotional-medium": {
        key: "de_DE-thorsten_emotional-medium",
        name: "thorsten_emotional",
        language: {
          code: "de_DE",
          family: "de",
          region: "DE",
          name_native: "Deutsch",
          name_english: "German",
          country_english: "Germany"
        },
        quality: "medium",
        num_speakers: 8,
        speaker_id_map: {
          amused: 0,
          angry: 1,
          disgusted: 2,
          drunk: 3,
          neutral: 4,
          sleepy: 5,
          surprised: 6,
          whisper: 7
        },
        files: {
          "de/de_DE/thorsten_emotional/medium/de_DE-thorsten_emotional-medium.onnx": {
            size_bytes: 76745905,
            md5_digest: "7cc67d24d9d0b34d7a4f6224d16236b9"
          },
          "de/de_DE/thorsten_emotional/medium/de_DE-thorsten_emotional-medium.onnx.json": {
            size_bytes: 5031,
            md5_digest: "1abac7e46522f774217c170da222f2a6"
          },
          "de/de_DE/thorsten_emotional/medium/MODEL_CARD": {
            size_bytes: 302,
            md5_digest: "91874c31e5b2e497ecda2ea8e6fda4a7"
          }
        },
        aliases: []
      },
      "el_GR-rapunzelina-low": {
        key: "el_GR-rapunzelina-low",
        name: "rapunzelina",
        language: {
          code: "el_GR",
          family: "el",
          region: "GR",
          name_native: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC",
          name_english: "Greek",
          country_english: "Greece"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "el/el_GR/rapunzelina/low/el_GR-rapunzelina-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "04e0151b653bb64540b1cde027054140"
          },
          "el/el_GR/rapunzelina/low/el_GR-rapunzelina-low.onnx.json": {
            size_bytes: 4198,
            md5_digest: "8d6cd8a576008116be5281b13e1c7b45"
          },
          "el/el_GR/rapunzelina/low/MODEL_CARD": {
            size_bytes: 303,
            md5_digest: "c75270b41e7bf60dacd351753a483574"
          }
        },
        aliases: []
      },
      "en_GB-alan-low": {
        key: "en_GB-alan-low",
        name: "alan",
        language: {
          code: "en_GB",
          family: "en",
          region: "GB",
          name_native: "English",
          name_english: "English",
          country_english: "Great Britain"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_GB/alan/low/en_GB-alan-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "2acae8c79395ab109a7572f0afa61fff"
          },
          "en/en_GB/alan/low/en_GB-alan-low.onnx.json": {
            size_bytes: 4170,
            md5_digest: "4c0fa2c6763bf49b343cbb4f655a147b"
          },
          "en/en_GB/alan/low/MODEL_CARD": {
            size_bytes: 309,
            md5_digest: "b116c3cbdebac99ade9af03807cb9301"
          }
        },
        aliases: [
          "en-gb-alan-low"
        ]
      },
      "en_GB-alan-medium": {
        key: "en_GB-alan-medium",
        name: "alan",
        language: {
          code: "en_GB",
          family: "en",
          region: "GB",
          name_native: "English",
          name_english: "English",
          country_english: "Great Britain"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_GB/alan/medium/en_GB-alan-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "8f6b35eeb8ef6269021c6cb6d2414c9b"
          },
          "en/en_GB/alan/medium/en_GB-alan-medium.onnx.json": {
            size_bytes: 4888,
            md5_digest: "b11d9afd0a8f5372c42a52fbd6e021d4"
          },
          "en/en_GB/alan/medium/MODEL_CARD": {
            size_bytes: 320,
            md5_digest: "24a2232470ca1be071debf53c984666e"
          }
        },
        aliases: []
      },
      "en_GB-alba-medium": {
        key: "en_GB-alba-medium",
        name: "alba",
        language: {
          code: "en_GB",
          family: "en",
          region: "GB",
          name_native: "English",
          name_english: "English",
          country_english: "Great Britain"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_GB/alba/medium/en_GB-alba-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "c07f313752bb3aba8061041666251654"
          },
          "en/en_GB/alba/medium/en_GB-alba-medium.onnx.json": {
            size_bytes: 4888,
            md5_digest: "dbb6f2ede31082710665221417906e13"
          },
          "en/en_GB/alba/medium/MODEL_CARD": {
            size_bytes: 324,
            md5_digest: "d5a8716acb311b20e0f28710d0fcc982"
          }
        },
        aliases: []
      },
      "en_GB-aru-medium": {
        key: "en_GB-aru-medium",
        name: "aru",
        language: {
          code: "en_GB",
          family: "en",
          region: "GB",
          name_native: "English",
          name_english: "English",
          country_english: "Great Britain"
        },
        quality: "medium",
        num_speakers: 12,
        speaker_id_map: {
          "10": 2,
          "11": 6,
          "12": 8,
          "03": 0,
          "06": 1,
          "01": 3,
          "09": 4,
          "08": 5,
          "05": 7,
          "02": 9,
          "07": 10,
          "04": 11
        },
        files: {
          "en/en_GB/aru/medium/en_GB-aru-medium.onnx": {
            size_bytes: 76754097,
            md5_digest: "7862d75539b8ef867e7c04e772d323ea"
          },
          "en/en_GB/aru/medium/en_GB-aru-medium.onnx.json": {
            size_bytes: 5048,
            md5_digest: "903a8ec4cdfea0123a004ab4a87e547c"
          },
          "en/en_GB/aru/medium/MODEL_CARD": {
            size_bytes: 368,
            md5_digest: "09496f38078e0eefe220a497b7b70631"
          }
        },
        aliases: []
      },
      "en_GB-cori-high": {
        key: "en_GB-cori-high",
        name: "cori",
        language: {
          code: "en_GB",
          family: "en",
          region: "GB",
          name_native: "English",
          name_english: "English",
          country_english: "Great Britain"
        },
        quality: "high",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_GB/cori/high/en_GB-cori-high.onnx": {
            size_bytes: 114219352,
            md5_digest: "3474a80133d9a03e6870d2ac42c18806"
          },
          "en/en_GB/cori/high/en_GB-cori-high.onnx.json": {
            size_bytes: 4963,
            md5_digest: "0f7d42e77a99193006aa34a34442f5e0"
          },
          "en/en_GB/cori/high/MODEL_CARD": {
            size_bytes: 468,
            md5_digest: "12db31ecedf1d6458a215d3012339a20"
          }
        },
        aliases: []
      },
      "en_GB-cori-medium": {
        key: "en_GB-cori-medium",
        name: "cori",
        language: {
          code: "en_GB",
          family: "en",
          region: "GB",
          name_native: "English",
          name_english: "English",
          country_english: "Great Britain"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_GB/cori/medium/en_GB-cori-medium.onnx": {
            size_bytes: 63531379,
            md5_digest: "f143307611eccea9d976235d0895f57c"
          },
          "en/en_GB/cori/medium/en_GB-cori-medium.onnx.json": {
            size_bytes: 4966,
            md5_digest: "12b1dc45d8919f3475cf296d5f16a4c6"
          },
          "en/en_GB/cori/medium/MODEL_CARD": {
            size_bytes: 474,
            md5_digest: "43861aa2d2c143356702fd966b7812c4"
          }
        },
        aliases: []
      },
      "en_GB-jenny_dioco-medium": {
        key: "en_GB-jenny_dioco-medium",
        name: "jenny_dioco",
        language: {
          code: "en_GB",
          family: "en",
          region: "GB",
          name_native: "English",
          name_english: "English",
          country_english: "Great Britain"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_GB/jenny_dioco/medium/en_GB-jenny_dioco-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "d08f2f7edf0c858275a7eca74ff2a9e4"
          },
          "en/en_GB/jenny_dioco/medium/en_GB-jenny_dioco-medium.onnx.json": {
            size_bytes: 4895,
            md5_digest: "e999a9c0aa535fb42e43b04cebcd65d2"
          },
          "en/en_GB/jenny_dioco/medium/MODEL_CARD": {
            size_bytes: 298,
            md5_digest: "ff351d05502764d5b4a074e0648e9434"
          }
        },
        aliases: []
      },
      "en_GB-northern_english_male-medium": {
        key: "en_GB-northern_english_male-medium",
        name: "northern_english_male",
        language: {
          code: "en_GB",
          family: "en",
          region: "GB",
          name_native: "English",
          name_english: "English",
          country_english: "Great Britain"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_GB/northern_english_male/medium/en_GB-northern_english_male-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "4c9a9735bfb76ad67c8b31b23d6840a0"
          },
          "en/en_GB/northern_english_male/medium/en_GB-northern_english_male-medium.onnx.json": {
            size_bytes: 4847,
            md5_digest: "0ce3f61a9604616ed475c921fdeedb1a"
          },
          "en/en_GB/northern_english_male/medium/MODEL_CARD": {
            size_bytes: 305,
            md5_digest: "8d1b725154c658ead4f068389c319c82"
          }
        },
        aliases: []
      },
      "en_GB-semaine-medium": {
        key: "en_GB-semaine-medium",
        name: "semaine",
        language: {
          code: "en_GB",
          family: "en",
          region: "GB",
          name_native: "English",
          name_english: "English",
          country_english: "Great Britain"
        },
        quality: "medium",
        num_speakers: 4,
        speaker_id_map: {
          prudence: 0,
          spike: 1,
          obadiah: 2,
          poppy: 3
        },
        files: {
          "en/en_GB/semaine/medium/en_GB-semaine-medium.onnx": {
            size_bytes: 76737711,
            md5_digest: "3634c3b388165d3b698ea07ba3cac7d2"
          },
          "en/en_GB/semaine/medium/en_GB-semaine-medium.onnx.json": {
            size_bytes: 5076,
            md5_digest: "c30f92604f6ce3f378e7211440f13c8f"
          },
          "en/en_GB/semaine/medium/MODEL_CARD": {
            size_bytes: 332,
            md5_digest: "340045a0ec470eaf3bec271ea746f946"
          }
        },
        aliases: []
      },
      "en_GB-southern_english_female-low": {
        key: "en_GB-southern_english_female-low",
        name: "southern_english_female",
        language: {
          code: "en_GB",
          family: "en",
          region: "GB",
          name_native: "English",
          name_english: "English",
          country_english: "Great Britain"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_GB/southern_english_female/low/en_GB-southern_english_female-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "596c7ed4d8488cf64e027765dce2dad1"
          },
          "en/en_GB/southern_english_female/low/en_GB-southern_english_female-low.onnx.json": {
            size_bytes: 4189,
            md5_digest: "7548456e9f2bc4c16bf818be26618ea1"
          },
          "en/en_GB/southern_english_female/low/MODEL_CARD": {
            size_bytes: 296,
            md5_digest: "77ac998c8b37842ef98594567f141629"
          }
        },
        aliases: [
          "en-gb-southern_english_female-low"
        ]
      },
      "en_GB-vctk-medium": {
        key: "en_GB-vctk-medium",
        name: "vctk",
        language: {
          code: "en_GB",
          family: "en",
          region: "GB",
          name_native: "English",
          name_english: "English",
          country_english: "Great Britain"
        },
        quality: "medium",
        num_speakers: 109,
        speaker_id_map: {
          p239: 0,
          p236: 1,
          p264: 2,
          p250: 3,
          p259: 4,
          p247: 5,
          p261: 6,
          p263: 7,
          p283: 8,
          p286: 9,
          p274: 10,
          p276: 11,
          p270: 12,
          p281: 13,
          p277: 14,
          p231: 15,
          p271: 16,
          p238: 17,
          p257: 18,
          p273: 19,
          p284: 20,
          p329: 21,
          p361: 22,
          p287: 23,
          p360: 24,
          p374: 25,
          p376: 26,
          p310: 27,
          p304: 28,
          p334: 29,
          p340: 30,
          p323: 31,
          p347: 32,
          p330: 33,
          p308: 34,
          p314: 35,
          p317: 36,
          p339: 37,
          p311: 38,
          p294: 39,
          p305: 40,
          p266: 41,
          p335: 42,
          p318: 43,
          p351: 44,
          p333: 45,
          p313: 46,
          p316: 47,
          p244: 48,
          p307: 49,
          p363: 50,
          p336: 51,
          p297: 52,
          p312: 53,
          p267: 54,
          p275: 55,
          p295: 56,
          p258: 57,
          p288: 58,
          p301: 59,
          p232: 60,
          p292: 61,
          p272: 62,
          p280: 63,
          p278: 64,
          p341: 65,
          p268: 66,
          p298: 67,
          p299: 68,
          p279: 69,
          p285: 70,
          p326: 71,
          p300: 72,
          s5: 73,
          p230: 74,
          p345: 75,
          p254: 76,
          p269: 77,
          p293: 78,
          p252: 79,
          p262: 80,
          p243: 81,
          p227: 82,
          p343: 83,
          p255: 84,
          p229: 85,
          p240: 86,
          p248: 87,
          p253: 88,
          p233: 89,
          p228: 90,
          p282: 91,
          p251: 92,
          p246: 93,
          p234: 94,
          p226: 95,
          p260: 96,
          p245: 97,
          p241: 98,
          p303: 99,
          p265: 100,
          p306: 101,
          p237: 102,
          p249: 103,
          p256: 104,
          p302: 105,
          p364: 106,
          p225: 107,
          p362: 108
        },
        files: {
          "en/en_GB/vctk/medium/en_GB-vctk-medium.onnx": {
            size_bytes: 76952753,
            md5_digest: "573025290fdc68812543b7438ace0c29"
          },
          "en/en_GB/vctk/medium/en_GB-vctk-medium.onnx.json": {
            size_bytes: 6637,
            md5_digest: "68e82dee4c9a723e804f9fc0b14f1802"
          },
          "en/en_GB/vctk/medium/MODEL_CARD": {
            size_bytes: 326,
            md5_digest: "b88a963e3bee27bc4fff84563f1be388"
          }
        },
        aliases: []
      },
      "en_US-amy-low": {
        key: "en_US-amy-low",
        name: "amy",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/amy/low/en_US-amy-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "3c3f6a6ec605f3a59763256d3b2db012"
          },
          "en/en_US/amy/low/en_US-amy-low.onnx.json": {
            size_bytes: 4164,
            md5_digest: "85a339b51379b13bbbb0784382ca75bc"
          },
          "en/en_US/amy/low/MODEL_CARD": {
            size_bytes: 273,
            md5_digest: "e1cdd84aa7493b8fbe1e6471f6f93cea"
          }
        },
        aliases: [
          "en-us-amy-low"
        ]
      },
      "en_US-amy-medium": {
        key: "en_US-amy-medium",
        name: "amy",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/amy/medium/en_US-amy-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "778d28aeb95fcdf8a882344d9df142fc"
          },
          "en/en_US/amy/medium/en_US-amy-medium.onnx.json": {
            size_bytes: 4882,
            md5_digest: "7f37dadb26340c90ebc8088e0b252310"
          },
          "en/en_US/amy/medium/MODEL_CARD": {
            size_bytes: 281,
            md5_digest: "6fca05ee5bfe8b28211b88b86b47e822"
          }
        },
        aliases: []
      },
      "en_US-arctic-medium": {
        key: "en_US-arctic-medium",
        name: "arctic",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 18,
        speaker_id_map: {
          awb: 0,
          rms: 1,
          slt: 2,
          ksp: 3,
          clb: 4,
          lnh: 5,
          aew: 6,
          bdl: 7,
          jmk: 8,
          rxr: 9,
          fem: 10,
          ljm: 11,
          slp: 12,
          aup: 13,
          ahw: 14,
          axb: 15,
          eey: 16,
          gka: 17
        },
        files: {
          "en/en_US/arctic/medium/en_US-arctic-medium.onnx": {
            size_bytes: 76766385,
            md5_digest: "497c47037c2e279faf467e0a06f965d2"
          },
          "en/en_US/arctic/medium/en_US-arctic-medium.onnx.json": {
            size_bytes: 5148,
            md5_digest: "b7ed018d74f0d5ba7cd49051de43a461"
          },
          "en/en_US/arctic/medium/MODEL_CARD": {
            size_bytes: 289,
            md5_digest: "efe5b89e46cf8e0efa254203da8c7baf"
          }
        },
        aliases: []
      },
      "en_US-bryce-medium": {
        key: "en_US-bryce-medium",
        name: "bryce",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/bryce/medium/en_US-bryce-medium.onnx": {
            size_bytes: 63531379,
            md5_digest: "a8482817c3bdc3d20121a0e31bfa9809"
          },
          "en/en_US/bryce/medium/en_US-bryce-medium.onnx.json": {
            size_bytes: 4966,
            md5_digest: "a548d1d4ce8579f5a16926bdec77c7bf"
          },
          "en/en_US/bryce/medium/MODEL_CARD": {
            size_bytes: 405,
            md5_digest: "79f21fcb165d0fcc4680222164bbb569"
          }
        },
        aliases: []
      },
      "en_US-danny-low": {
        key: "en_US-danny-low",
        name: "danny",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/danny/low/en_US-danny-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "73cc296e178ab3d2a5698179b629cd12"
          },
          "en/en_US/danny/low/en_US-danny-low.onnx.json": {
            size_bytes: 4166,
            md5_digest: "c0aa454db4e5a6581e45799c79aa99c6"
          },
          "en/en_US/danny/low/MODEL_CARD": {
            size_bytes: 275,
            md5_digest: "62d30d0cccea265949980cb48212ebee"
          }
        },
        aliases: []
      },
      "en_US-hfc_female-medium": {
        key: "en_US-hfc_female-medium",
        name: "hfc_female",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/hfc_female/medium/en_US-hfc_female-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "7abec91f1d6e19e913fbc4a333f62787"
          },
          "en/en_US/hfc_female/medium/en_US-hfc_female-medium.onnx.json": {
            size_bytes: 5033,
            md5_digest: "c3d00f54dac3b4068f2576c15c5da3bc"
          },
          "en/en_US/hfc_female/medium/MODEL_CARD": {
            size_bytes: 354,
            md5_digest: "a4a7b5da65e03e6972e44e9555a59aef"
          }
        },
        aliases: []
      },
      "en_US-hfc_male-medium": {
        key: "en_US-hfc_male-medium",
        name: "hfc_male",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/hfc_male/medium/en_US-hfc_male-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "cd2fda1933f0653d3ddc85e5f30ebdd2"
          },
          "en/en_US/hfc_male/medium/en_US-hfc_male-medium.onnx.json": {
            size_bytes: 5033,
            md5_digest: "9b4849dbc1e72f35de7391528dea60d9"
          },
          "en/en_US/hfc_male/medium/MODEL_CARD": {
            size_bytes: 352,
            md5_digest: "0bc174f6fe7a6d795a790110e8bf9096"
          }
        },
        aliases: []
      },
      "en_US-joe-medium": {
        key: "en_US-joe-medium",
        name: "joe",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/joe/medium/en_US-joe-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "74fd6a4dc39e0aa9dce145d7f5acd4f6"
          },
          "en/en_US/joe/medium/en_US-joe-medium.onnx.json": {
            size_bytes: 4794,
            md5_digest: "811036b9c1451545f9495fdc1baa0754"
          },
          "en/en_US/joe/medium/MODEL_CARD": {
            size_bytes: 280,
            md5_digest: "7d25cb111aa9699518764a1cb3943af1"
          }
        },
        aliases: []
      },
      "en_US-john-medium": {
        key: "en_US-john-medium",
        name: "john",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/john/medium/en_US-john-medium.onnx": {
            size_bytes: 63531379,
            md5_digest: "70480857f21f2560f3a232722023b36d"
          },
          "en/en_US/john/medium/en_US-john-medium.onnx.json": {
            size_bytes: 4965,
            md5_digest: "f2d04611b498e14d394385d1ec8a2d2d"
          },
          "en/en_US/john/medium/MODEL_CARD": {
            size_bytes: 498,
            md5_digest: "4ef938585cf2cc8da4ada9b6d2c579ec"
          }
        },
        aliases: []
      },
      "en_US-kathleen-low": {
        key: "en_US-kathleen-low",
        name: "kathleen",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/kathleen/low/en_US-kathleen-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "dd1ab131724b1cff76fe388252bec47b"
          },
          "en/en_US/kathleen/low/en_US-kathleen-low.onnx.json": {
            size_bytes: 4169,
            md5_digest: "d970eebfe8e9f8515e405659da658f9b"
          },
          "en/en_US/kathleen/low/MODEL_CARD": {
            size_bytes: 281,
            md5_digest: "0585e0a798d093c9ee090b99d9c8f68e"
          }
        },
        aliases: [
          "en-us-kathleen-low"
        ]
      },
      "en_US-kristin-medium": {
        key: "en_US-kristin-medium",
        name: "kristin",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/kristin/medium/en_US-kristin-medium.onnx": {
            size_bytes: 63531379,
            md5_digest: "5fed42d2296baca042e2bf74785db725"
          },
          "en/en_US/kristin/medium/en_US-kristin-medium.onnx.json": {
            size_bytes: 4968,
            md5_digest: "70bc97d350c796c64ea5e4d08241afac"
          },
          "en/en_US/kristin/medium/MODEL_CARD": {
            size_bytes: 479,
            md5_digest: "9bfb8192299b34cddf76455f04cb8cd2"
          }
        },
        aliases: []
      },
      "en_US-kusal-medium": {
        key: "en_US-kusal-medium",
        name: "kusal",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/kusal/medium/en_US-kusal-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "95334de7385a03c5c9de25b920c33492"
          },
          "en/en_US/kusal/medium/en_US-kusal-medium.onnx.json": {
            size_bytes: 4884,
            md5_digest: "722e434f8e1a768dd6b6fab5b4cfde4d"
          },
          "en/en_US/kusal/medium/MODEL_CARD": {
            size_bytes: 279,
            md5_digest: "b627e950e8e10a1ec7b30e5f9b312a05"
          }
        },
        aliases: []
      },
      "en_US-l2arctic-medium": {
        key: "en_US-l2arctic-medium",
        name: "l2arctic",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 24,
        speaker_id_map: {
          TXHC: 0,
          THV: 1,
          SVBI: 2,
          ZHAA: 3,
          PNV: 4,
          TLV: 5,
          ERMS: 6,
          MBMPS: 7,
          HQTV: 8,
          TNI: 9,
          ASI: 10,
          HJK: 11,
          LXC: 12,
          NCC: 13,
          YKWK: 14,
          YDCK: 15,
          HKK: 16,
          NJS: 17,
          YBAA: 18,
          RRBI: 19,
          BWC: 20,
          ABA: 21,
          EBVS: 22,
          SKA: 23
        },
        files: {
          "en/en_US/l2arctic/medium/en_US-l2arctic-medium.onnx": {
            size_bytes: 76778673,
            md5_digest: "a71d8acf9b01676931cd548f739382cd"
          },
          "en/en_US/l2arctic/medium/en_US-l2arctic-medium.onnx.json": {
            size_bytes: 5252,
            md5_digest: "a0f29a10628f08dccd757aca57ccb163"
          },
          "en/en_US/l2arctic/medium/MODEL_CARD": {
            size_bytes: 365,
            md5_digest: "8d5e9dc31cba2a9b7ee68a2a70e084f2"
          }
        },
        aliases: []
      },
      "en_US-lessac-high": {
        key: "en_US-lessac-high",
        name: "lessac",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "high",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/lessac/high/en_US-lessac-high.onnx": {
            size_bytes: 113895201,
            md5_digest: "99d1f6181a7f5ccbe3f117ba8ce63c93"
          },
          "en/en_US/lessac/high/en_US-lessac-high.onnx.json": {
            size_bytes: 4883,
            md5_digest: "02e8e364c86b5d3b75e81704b0369856"
          },
          "en/en_US/lessac/high/MODEL_CARD": {
            size_bytes: 347,
            md5_digest: "2ff564555f6d6cde3c19dcc8f3815428"
          }
        },
        aliases: []
      },
      "en_US-lessac-low": {
        key: "en_US-lessac-low",
        name: "lessac",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/lessac/low/en_US-lessac-low.onnx": {
            size_bytes: 63201294,
            md5_digest: "31883a7506589feadf3c3474fd8ef658"
          },
          "en/en_US/lessac/low/en_US-lessac-low.onnx.json": {
            size_bytes: 4882,
            md5_digest: "64876daa19dd042b368cd64fa379a75f"
          },
          "en/en_US/lessac/low/MODEL_CARD": {
            size_bytes: 345,
            md5_digest: "999cbf2c337d8fb2f21b0fa2c95e9e85"
          }
        },
        aliases: [
          "en-us-lessac-low"
        ]
      },
      "en_US-lessac-medium": {
        key: "en_US-lessac-medium",
        name: "lessac",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/lessac/medium/en_US-lessac-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "2fc642b535197b6305c7c8f92dc8b24f"
          },
          "en/en_US/lessac/medium/en_US-lessac-medium.onnx.json": {
            size_bytes: 4885,
            md5_digest: "c1f2b7bddefe113f3255ff9ef234cfd3"
          },
          "en/en_US/lessac/medium/MODEL_CARD": {
            size_bytes: 351,
            md5_digest: "42f2dd4a98149e12fc70b301d9579dfd"
          }
        },
        aliases: [
          "en-us-lessac-medium"
        ]
      },
      "en_US-libritts-high": {
        key: "en_US-libritts-high",
        name: "libritts",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "high",
        num_speakers: 904,
        speaker_id_map: {
          p3922: 0,
          p8699: 1,
          p4535: 2,
          p6701: 3,
          p3638: 4,
          p922: 5,
          p2531: 6,
          p1638: 7,
          p8848: 8,
          p6544: 9,
          p3615: 10,
          p318: 11,
          p6104: 12,
          p1382: 13,
          p5400: 14,
          p5712: 15,
          p2769: 16,
          p2573: 17,
          p1463: 18,
          p6458: 19,
          p3274: 20,
          p4356: 21,
          p8498: 22,
          p5570: 23,
          p176: 24,
          p339: 25,
          p28: 26,
          p5909: 27,
          p3869: 28,
          p4899: 29,
          p64: 30,
          p3368: 31,
          p3307: 32,
          p5618: 33,
          p3370: 34,
          p7704: 35,
          p8506: 36,
          p8410: 37,
          p6904: 38,
          p5655: 39,
          p2204: 40,
          p501: 41,
          p7314: 42,
          p1027: 43,
          p5054: 44,
          p534: 45,
          p2853: 46,
          p5935: 47,
          p2404: 48,
          p7874: 49,
          p816: 50,
          p2053: 51,
          p8066: 52,
          p16: 53,
          p4586: 54,
          p1923: 55,
          p2592: 56,
          p1265: 57,
          p6189: 58,
          p100: 59,
          p6371: 60,
          p4957: 61,
          p4116: 62,
          p3003: 63,
          p7739: 64,
          p1752: 65,
          p5717: 66,
          p5012: 67,
          p5062: 68,
          p7481: 69,
          p4595: 70,
          p2299: 71,
          p7188: 72,
          p93: 73,
          p4145: 74,
          p8684: 75,
          p7594: 76,
          p2598: 77,
          p3540: 78,
          p7717: 79,
          p6426: 80,
          p4148: 81,
          p335: 82,
          p1379: 83,
          p2512: 84,
          p242: 85,
          p8855: 86,
          p8118: 87,
          p369: 88,
          p6575: 89,
          p6694: 90,
          p8080: 91,
          p1283: 92,
          p7434: 93,
          p5290: 94,
          p1731: 95,
          p2401: 96,
          p459: 97,
          p192: 98,
          p7910: 99,
          p114: 100,
          p5660: 101,
          p1313: 102,
          p203: 103,
          p7460: 104,
          p207: 105,
          p6497: 106,
          p6696: 107,
          p7766: 108,
          p6233: 109,
          p3185: 110,
          p2010: 111,
          p2056: 112,
          p3717: 113,
          p5802: 114,
          p5622: 115,
          p2156: 116,
          p4243: 117,
          p1422: 118,
          p5039: 119,
          p4110: 120,
          p1093: 121,
          p1776: 122,
          p7995: 123,
          p6877: 124,
          p5635: 125,
          p54: 126,
          p288: 127,
          p4592: 128,
          p7276: 129,
          p688: 130,
          p8388: 131,
          p8152: 132,
          p8194: 133,
          p7000: 134,
          p8527: 135,
          p5126: 136,
          p3923: 137,
          p1054: 138,
          p3927: 139,
          p5029: 140,
          p4098: 141,
          p1789: 142,
          p56: 143,
          p7240: 144,
          p5538: 145,
          p1903: 146,
          p6538: 147,
          p3380: 148,
          p6643: 149,
          p7495: 150,
          p8718: 151,
          p8050: 152,
          p126: 153,
          p7245: 154,
          p2517: 155,
          p4438: 156,
          p4945: 157,
          p7145: 158,
          p724: 159,
          p9022: 160,
          p6637: 161,
          p6927: 162,
          p6937: 163,
          p8113: 164,
          p5724: 165,
          p6006: 166,
          p3584: 167,
          p2971: 168,
          p2230: 169,
          p7982: 170,
          p1649: 171,
          p3994: 172,
          p7720: 173,
          p6981: 174,
          p781: 175,
          p4973: 176,
          p6206: 177,
          p2481: 178,
          p3157: 179,
          p1509: 180,
          p510: 181,
          p7540: 182,
          p8887: 183,
          p7120: 184,
          p2882: 185,
          p7128: 186,
          p8142: 187,
          p7229: 188,
          p2787: 189,
          p8820: 190,
          p2368: 191,
          p4331: 192,
          p4967: 193,
          p4427: 194,
          p6054: 195,
          p3728: 196,
          p274: 197,
          p7134: 198,
          p1603: 199,
          p1383: 200,
          p1165: 201,
          p4363: 202,
          p512: 203,
          p5985: 204,
          p7967: 205,
          p2060: 206,
          p7752: 207,
          p7484: 208,
          p8643: 209,
          p3549: 210,
          p5731: 211,
          p7881: 212,
          p667: 213,
          p6828: 214,
          p5740: 215,
          p3483: 216,
          p718: 217,
          p6341: 218,
          p1913: 219,
          p3228: 220,
          p7247: 221,
          p7705: 222,
          p1018: 223,
          p8193: 224,
          p6098: 225,
          p3989: 226,
          p7828: 227,
          p5876: 228,
          p7754: 229,
          p4719: 230,
          p8011: 231,
          p7939: 232,
          p5975: 233,
          p2004: 234,
          p6139: 235,
          p8183: 236,
          p3482: 237,
          p3361: 238,
          p4289: 239,
          p231: 240,
          p7789: 241,
          p4598: 242,
          p5239: 243,
          p2638: 244,
          p6300: 245,
          p8474: 246,
          p2194: 247,
          p7832: 248,
          p1079: 249,
          p1335: 250,
          p188: 251,
          p1195: 252,
          p5914: 253,
          p1401: 254,
          p7318: 255,
          p5448: 256,
          p1392: 257,
          p3703: 258,
          p2113: 259,
          p7783: 260,
          p8176: 261,
          p6519: 262,
          p7933: 263,
          p7938: 264,
          p7802: 265,
          p6120: 266,
          p224: 267,
          p209: 268,
          p5656: 269,
          p3032: 270,
          p6965: 271,
          p258: 272,
          p4837: 273,
          p5489: 274,
          p272: 275,
          p3851: 276,
          p7140: 277,
          p2562: 278,
          p1472: 279,
          p79: 280,
          p2775: 281,
          p3046: 282,
          p2532: 283,
          p8266: 284,
          p6099: 285,
          p4425: 286,
          p5293: 287,
          p7981: 288,
          p2045: 289,
          p920: 290,
          p511: 291,
          p7416: 292,
          p835: 293,
          p1289: 294,
          p8195: 295,
          p7833: 296,
          p8772: 297,
          p968: 298,
          p1641: 299,
          p7117: 300,
          p1678: 301,
          p5809: 302,
          p8028: 303,
          p500: 304,
          p6505: 305,
          p7868: 306,
          p14: 307,
          p2238: 308,
          p4744: 309,
          p3733: 310,
          p7515: 311,
          p699: 312,
          p5093: 313,
          p6388: 314,
          p7959: 315,
          p98: 316,
          p3914: 317,
          p5246: 318,
          p2570: 319,
          p8396: 320,
          p3513: 321,
          p882: 322,
          p7994: 323,
          p5968: 324,
          p8591: 325,
          p806: 326,
          p5261: 327,
          p1271: 328,
          p899: 329,
          p3945: 330,
          p8404: 331,
          p249: 332,
          p3008: 333,
          p7139: 334,
          p6395: 335,
          p6215: 336,
          p6080: 337,
          p4054: 338,
          p7825: 339,
          p6683: 340,
          p8725: 341,
          p3230: 342,
          p4138: 343,
          p6160: 344,
          p666: 345,
          p6510: 346,
          p3551: 347,
          p8075: 348,
          p225: 349,
          p7169: 350,
          p1851: 351,
          p5984: 352,
          p2960: 353,
          p8329: 354,
          p175: 355,
          p6378: 356,
          p480: 357,
          p7538: 358,
          p479: 359,
          p5519: 360,
          p8534: 361,
          p4856: 362,
          p101: 363,
          p3521: 364,
          p2256: 365,
          p3083: 366,
          p4278: 367,
          p8713: 368,
          p1226: 369,
          p4222: 370,
          p8494: 371,
          p8776: 372,
          p731: 373,
          p6574: 374,
          p5319: 375,
          p8605: 376,
          p5583: 377,
          p6406: 378,
          p4064: 379,
          p4806: 380,
          p3972: 381,
          p7383: 382,
          p5133: 383,
          p597: 384,
          p1025: 385,
          p7313: 386,
          p5304: 387,
          p8758: 388,
          p1050: 389,
          p6499: 390,
          p6956: 391,
          p770: 392,
          p4108: 393,
          p2774: 394,
          p3864: 395,
          p4490: 396,
          p4848: 397,
          p1826: 398,
          p6294: 399,
          p7949: 400,
          p1446: 401,
          p7867: 402,
          p8163: 403,
          p953: 404,
          p8138: 405,
          p353: 406,
          p7553: 407,
          p8825: 408,
          p5189: 409,
          p2012: 410,
          p948: 411,
          p205: 412,
          p1535: 413,
          p8008: 414,
          p1112: 415,
          p7926: 416,
          p4039: 417,
          p716: 418,
          p3967: 419,
          p7932: 420,
          p7525: 421,
          p7316: 422,
          p3448: 423,
          p2393: 424,
          p6788: 425,
          p6550: 426,
          p7011: 427,
          p8791: 428,
          p8119: 429,
          p1777: 430,
          p6014: 431,
          p1046: 432,
          p6269: 433,
          p6188: 434,
          p5266: 435,
          p3490: 436,
          p8786: 437,
          p8824: 438,
          p589: 439,
          p576: 440,
          p1121: 441,
          p1806: 442,
          p7294: 443,
          p3119: 444,
          p2688: 445,
          p1012: 446,
          p4807: 447,
          p7498: 448,
          p3905: 449,
          p7384: 450,
          p2992: 451,
          p30: 452,
          p497: 453,
          p227: 454,
          p4226: 455,
          p5007: 456,
          p1066: 457,
          p8222: 458,
          p7688: 459,
          p6865: 460,
          p6286: 461,
          p8225: 462,
          p3224: 463,
          p8635: 464,
          p1348: 465,
          p3645: 466,
          p1961: 467,
          p8190: 468,
          p6032: 469,
          p7286: 470,
          p5389: 471,
          p3105: 472,
          p1028: 473,
          p6038: 474,
          p764: 475,
          p7437: 476,
          p6555: 477,
          p8875: 478,
          p2074: 479,
          p7809: 480,
          p2240: 481,
          p2827: 482,
          p5386: 483,
          p6763: 484,
          p3009: 485,
          p6339: 486,
          p1825: 487,
          p7569: 488,
          p359: 489,
          p7956: 490,
          p2137: 491,
          p8677: 492,
          p4434: 493,
          p329: 494,
          p3289: 495,
          p4290: 496,
          p2999: 497,
          p2427: 498,
          p637: 499,
          p2229: 500,
          p1874: 501,
          p3446: 502,
          p9023: 503,
          p3114: 504,
          p6235: 505,
          p4860: 506,
          p4519: 507,
          p561: 508,
          p70: 509,
          p4800: 510,
          p2294: 511,
          p6115: 512,
          p2582: 513,
          p8464: 514,
          p5139: 515,
          p6918: 516,
          p337: 517,
          p5810: 518,
          p8401: 519,
          p303: 520,
          p5206: 521,
          p2589: 522,
          p7061: 523,
          p2269: 524,
          p2758: 525,
          p3389: 526,
          p4629: 527,
          p707: 528,
          p5606: 529,
          p1513: 530,
          p2473: 531,
          p664: 532,
          p5092: 533,
          p5154: 534,
          p6288: 535,
          p6308: 536,
          p4731: 537,
          p3328: 538,
          p7816: 539,
          p3221: 540,
          p8687: 541,
          p7030: 542,
          p476: 543,
          p4257: 544,
          p5918: 545,
          p6317: 546,
          p204: 547,
          p8006: 548,
          p6895: 549,
          p1264: 550,
          p2494: 551,
          p112: 552,
          p1859: 553,
          p398: 554,
          p1052: 555,
          p3294: 556,
          p1460: 557,
          p8573: 558,
          p5684: 559,
          p8421: 560,
          p5883: 561,
          p7297: 562,
          p246: 563,
          p8057: 564,
          p3835: 565,
          p1748: 566,
          p3816: 567,
          p3357: 568,
          p1053: 569,
          p409: 570,
          p868: 571,
          p3118: 572,
          p7520: 573,
          p6686: 574,
          p1241: 575,
          p5190: 576,
          p166: 577,
          p1482: 578,
          p5604: 579,
          p1212: 580,
          p2741: 581,
          p1259: 582,
          p984: 583,
          p6492: 584,
          p6167: 585,
          p296: 586,
          p6567: 587,
          p6924: 588,
          p2272: 589,
          p7085: 590,
          p345: 591,
          p2388: 592,
          p1705: 593,
          p1343: 594,
          p7241: 595,
          p451: 596,
          p5401: 597,
          p6446: 598,
          p612: 599,
          p594: 600,
          p7555: 601,
          p7069: 602,
          p2577: 603,
          p5333: 604,
          p8742: 605,
          p6727: 606,
          p1571: 607,
          p4734: 608,
          p7258: 609,
          p3977: 610,
          p373: 611,
          p5723: 612,
          p1365: 613,
          p7285: 614,
          p580: 615,
          p836: 616,
          p6782: 617,
          p3654: 618,
          p1974: 619,
          p6258: 620,
          p925: 621,
          p949: 622,
          p2790: 623,
          p698: 624,
          p6373: 625,
          p2785: 626,
          p1222: 627,
          p2751: 628,
          p3825: 629,
          p5115: 630,
          p1827: 631,
          p3171: 632,
          p119: 633,
          p850: 634,
          p3258: 635,
          p7909: 636,
          p1322: 637,
          p8097: 638,
          p22: 639,
          p7478: 640,
          p1349: 641,
          p4854: 642,
          p2929: 643,
          p7335: 644,
          p5868: 645,
          p454: 646,
          p7945: 647,
          p2654: 648,
          p3493: 649,
          p1060: 650,
          p8545: 651,
          p6509: 652,
          p5002: 653,
          p7732: 654,
          p3082: 655,
          p1779: 656,
          p2709: 657,
          p7398: 658,
          p8879: 659,
          p639: 660,
          p598: 661,
          p5672: 662,
          p6553: 663,
          p4111: 664,
          p1417: 665,
          p7991: 666,
          p380: 667,
          p8459: 668,
          p8347: 669,
          p1769: 670,
          p2673: 671,
          p3330: 672,
          p7051: 673,
          p1337: 674,
          p4057: 675,
          p4839: 676,
          p6060: 677,
          p7095: 678,
          p278: 679,
          p1445: 680,
          p6518: 681,
          p2364: 682,
          p1958: 683,
          p548: 684,
          p4010: 685,
          p3072: 686,
          p6993: 687,
          p8575: 688,
          p2149: 689,
          p240: 690,
          p2920: 691,
          p5588: 692,
          p1885: 693,
          p6082: 694,
          p9026: 695,
          p340: 696,
          p159: 697,
          p7730: 698,
          p7962: 699,
          p1987: 700,
          p3876: 701,
          p8771: 702,
          p5123: 703,
          p3866: 704,
          p3546: 705,
          p7777: 706,
          p115: 707,
          p5337: 708,
          p475: 709,
          p1724: 710,
          p6359: 711,
          p4260: 712,
          p2110: 713,
          p1845: 714,
          p4335: 715,
          p4133: 716,
          p783: 717,
          p8479: 718,
          p1448: 719,
          p1160: 720,
          p7647: 721,
          p2618: 722,
          p3630: 723,
          p4013: 724,
          p5242: 725,
          p7957: 726,
          p3852: 727,
          p3889: 728,
          p1387: 729,
          p439: 730,
          p1425: 731,
          p2061: 732,
          p7395: 733,
          p7837: 734,
          p5147: 735,
          p2319: 736,
          p3781: 737,
          p1311: 738,
          p4733: 739,
          p8705: 740,
          p3094: 741,
          p2823: 742,
          p1914: 743,
          p954: 744,
          p4381: 745,
          p4044: 746,
          p593: 747,
          p8300: 748,
          p7558: 749,
          p6494: 750,
          p6330: 751,
          p5940: 752,
          p7126: 753,
          p1061: 754,
          p6352: 755,
          p5186: 756,
          p1944: 757,
          p2285: 758,
          p6673: 759,
          p5746: 760,
          p208: 761,
          p492: 762,
          p216: 763,
          p979: 764,
          p1668: 765,
          p6620: 766,
          p711: 767,
          p7733: 768,
          p8619: 769,
          p5157: 770,
          p829: 771,
          p3180: 772,
          p3979: 773,
          p1556: 774,
          p3379: 775,
          p5727: 776,
          p596: 777,
          p2127: 778,
          p581: 779,
          p2652: 780,
          p2628: 781,
          p1849: 782,
          p4238: 783,
          p606: 784,
          p1224: 785,
          p1629: 786,
          p1413: 787,
          p957: 788,
          p8592: 789,
          p2254: 790,
          p1323: 791,
          p122: 792,
          p2093: 793,
          p1100: 794,
          p81: 795,
          p323: 796,
          p815: 797,
          p2581: 798,
          p543: 799,
          p6037: 800,
          p2397: 801,
          p5513: 802,
          p4495: 803,
          p5776: 804,
          p17: 805,
          p4590: 806,
          p8228: 807,
          p708: 808,
          p3792: 809,
          p3790: 810,
          p7090: 811,
          p1943: 812,
          p4246: 813,
          p559: 814,
          p3738: 815,
          p2167: 816,
          p1933: 817,
          p2162: 818,
          p549: 819,
          p3025: 820,
          p1182: 821,
          p4358: 822,
          p636: 823,
          p986: 824,
          p8490: 825,
          p3340: 826,
          p90: 827,
          p1487: 828,
          p1639: 829,
          p1547: 830,
          p4152: 831,
          p1498: 832,
          p1740: 833,
          p6157: 834,
          p217: 835,
          p2201: 836,
          p362: 837,
          p2146: 838,
          p1801: 839,
          p5063: 840,
          p7339: 841,
          p663: 842,
          p38: 843,
          p1336: 844,
          p3215: 845,
          p210: 846,
          p6075: 847,
          p55: 848,
          p2411: 849,
          p7445: 850,
          p5767: 851,
          p2812: 852,
          p472: 853,
          p803: 854,
          p4236: 855,
          p7665: 856,
          p1607: 857,
          p1316: 858,
          p7475: 859,
          p3001: 860,
          p1473: 861,
          p3537: 862,
          p3070: 863,
          p1390: 864,
          p1290: 865,
          p2499: 866,
          p154: 867,
          p7518: 868,
          p408: 869,
          p1811: 870,
          p1734: 871,
          p7342: 872,
          p8722: 873,
          p1754: 874,
          p7657: 875,
          p583: 876,
          p830: 877,
          p6690: 878,
          p1552: 879,
          p2498: 880,
          p1296: 881,
          p3686: 882,
          p157: 883,
          p487: 884,
          p6119: 885,
          p4926: 886,
          p4846: 887,
          p1536: 888,
          p2674: 889,
          p1645: 890,
          p3187: 891,
          p1058: 892,
          p2039: 893,
          p4071: 894,
          p4433: 895,
          p1175: 896,
          p434: 897,
          p1001: 898,
          p2816: 899,
          p820: 900,
          p2696: 901,
          p4681: 902,
          p2085: 903
        },
        files: {
          "en/en_US/libritts/high/en_US-libritts-high.onnx": {
            size_bytes: 136673811,
            md5_digest: "61d7845257f8abdc27476f606151ef8d"
          },
          "en/en_US/libritts/high/en_US-libritts-high.onnx.json": {
            size_bytes: 20163,
            md5_digest: "cb1564bb779f3b1f87e2de778adeb669"
          },
          "en/en_US/libritts/high/MODEL_CARD": {
            size_bytes: 255,
            md5_digest: "cdeac934f1154489924a071470b22365"
          }
        },
        aliases: [
          "en-us-libritts-high"
        ]
      },
      "en_US-libritts_r-medium": {
        key: "en_US-libritts_r-medium",
        name: "libritts_r",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 904,
        speaker_id_map: {
          "14": 307,
          "16": 54,
          "17": 805,
          "22": 639,
          "28": 26,
          "30": 453,
          "38": 843,
          "54": 125,
          "55": 848,
          "56": 142,
          "64": 30,
          "70": 509,
          "79": 280,
          "81": 795,
          "90": 827,
          "93": 73,
          "98": 316,
          "100": 60,
          "101": 363,
          "112": 550,
          "114": 100,
          "115": 707,
          "119": 633,
          "122": 792,
          "126": 153,
          "154": 867,
          "157": 883,
          "159": 697,
          "166": 576,
          "175": 355,
          "176": 24,
          "188": 251,
          "192": 98,
          "203": 103,
          "204": 546,
          "205": 412,
          "207": 105,
          "208": 761,
          "209": 268,
          "210": 846,
          "216": 763,
          "217": 835,
          "224": 267,
          "225": 349,
          "227": 455,
          "231": 240,
          "240": 690,
          "242": 85,
          "246": 561,
          "249": 332,
          "258": 272,
          "272": 275,
          "274": 197,
          "278": 679,
          "288": 126,
          "296": 586,
          "303": 520,
          "318": 11,
          "323": 796,
          "329": 495,
          "335": 84,
          "337": 517,
          "339": 25,
          "340": 696,
          "345": 596,
          "353": 406,
          "359": 490,
          "362": 837,
          "369": 88,
          "373": 611,
          "380": 667,
          "398": 552,
          "408": 869,
          "409": 568,
          "434": 897,
          "439": 730,
          "451": 595,
          "454": 646,
          "459": 97,
          "472": 853,
          "475": 709,
          "476": 543,
          "479": 359,
          "480": 357,
          "487": 884,
          "492": 762,
          "497": 454,
          "500": 304,
          "501": 42,
          "510": 181,
          "511": 291,
          "512": 203,
          "534": 46,
          "543": 799,
          "548": 684,
          "549": 819,
          "559": 814,
          "561": 508,
          "576": 440,
          "580": 615,
          "581": 779,
          "583": 876,
          "589": 439,
          "593": 747,
          "594": 600,
          "596": 777,
          "597": 384,
          "598": 661,
          "606": 784,
          "612": 599,
          "636": 823,
          "637": 500,
          "639": 660,
          "663": 842,
          "664": 532,
          "666": 345,
          "667": 213,
          "688": 129,
          "698": 624,
          "699": 312,
          "707": 528,
          "708": 808,
          "711": 767,
          "716": 418,
          "718": 217,
          "724": 158,
          "731": 373,
          "764": 476,
          "770": 392,
          "781": 175,
          "783": 717,
          "803": 854,
          "806": 326,
          "815": 797,
          "816": 51,
          "820": 900,
          "829": 771,
          "830": 877,
          "835": 293,
          "836": 616,
          "850": 634,
          "868": 569,
          "882": 322,
          "899": 329,
          "920": 290,
          "922": 5,
          "925": 621,
          "948": 411,
          "949": 622,
          "953": 404,
          "954": 744,
          "957": 788,
          "968": 298,
          "979": 764,
          "984": 583,
          "986": 824,
          "1001": 898,
          "1012": 447,
          "1018": 223,
          "1025": 385,
          "1027": 44,
          "1028": 474,
          "1046": 431,
          "1050": 389,
          "1052": 553,
          "1053": 567,
          "1054": 138,
          "1058": 892,
          "1060": 650,
          "1061": 754,
          "1066": 458,
          "1079": 249,
          "1093": 120,
          "1100": 794,
          "1112": 415,
          "1121": 441,
          "1160": 720,
          "1165": 201,
          "1175": 896,
          "1182": 821,
          "1195": 252,
          "1212": 580,
          "1222": 627,
          "1224": 785,
          "1226": 369,
          "1241": 574,
          "1259": 582,
          "1264": 549,
          "1265": 58,
          "1271": 328,
          "1283": 92,
          "1289": 294,
          "1290": 865,
          "1296": 881,
          "1311": 738,
          "1313": 102,
          "1316": 858,
          "1322": 637,
          "1323": 791,
          "1335": 250,
          "1336": 844,
          "1337": 674,
          "1343": 593,
          "1348": 466,
          "1349": 641,
          "1365": 613,
          "1379": 82,
          "1382": 15,
          "1383": 200,
          "1387": 729,
          "1390": 864,
          "1392": 257,
          "1401": 254,
          "1413": 787,
          "1417": 665,
          "1422": 131,
          "1425": 731,
          "1445": 680,
          "1446": 401,
          "1448": 719,
          "1460": 555,
          "1463": 18,
          "1472": 279,
          "1473": 861,
          "1482": 578,
          "1487": 828,
          "1498": 832,
          "1509": 180,
          "1513": 530,
          "1535": 413,
          "1536": 888,
          "1547": 830,
          "1552": 879,
          "1556": 774,
          "1571": 607,
          "1603": 199,
          "1607": 857,
          "1629": 786,
          "1638": 7,
          "1639": 829,
          "1641": 299,
          "1645": 890,
          "1649": 171,
          "1668": 765,
          "1678": 301,
          "1705": 592,
          "1724": 710,
          "1731": 95,
          "1734": 871,
          "1740": 833,
          "1748": 564,
          "1752": 66,
          "1754": 874,
          "1769": 670,
          "1776": 121,
          "1777": 429,
          "1779": 656,
          "1789": 152,
          "1801": 839,
          "1806": 442,
          "1811": 870,
          "1825": 488,
          "1826": 398,
          "1827": 631,
          "1845": 714,
          "1849": 782,
          "1851": 351,
          "1859": 551,
          "1874": 502,
          "1885": 693,
          "1903": 145,
          "1913": 219,
          "1914": 743,
          "1923": 56,
          "1933": 817,
          "1943": 812,
          "1944": 757,
          "1958": 683,
          "1961": 468,
          "1974": 619,
          "1987": 700,
          "2004": 234,
          "2010": 111,
          "2012": 410,
          "2039": 893,
          "2045": 289,
          "2053": 52,
          "2056": 112,
          "2060": 206,
          "2061": 732,
          "2074": 480,
          "2085": 903,
          "2093": 793,
          "2110": 713,
          "2113": 259,
          "2127": 778,
          "2137": 492,
          "2146": 838,
          "2149": 689,
          "2156": 116,
          "2162": 818,
          "2167": 816,
          "2194": 247,
          "2201": 836,
          "2204": 41,
          "2229": 501,
          "2230": 169,
          "2238": 308,
          "2240": 482,
          "2254": 790,
          "2256": 365,
          "2269": 524,
          "2272": 589,
          "2285": 758,
          "2294": 511,
          "2299": 71,
          "2319": 736,
          "2364": 682,
          "2368": 191,
          "2388": 591,
          "2393": 423,
          "2397": 801,
          "2401": 96,
          "2404": 49,
          "2411": 849,
          "2427": 499,
          "2473": 531,
          "2481": 178,
          "2494": 572,
          "2498": 880,
          "2499": 866,
          "2512": 83,
          "2517": 155,
          "2531": 6,
          "2532": 283,
          "2562": 278,
          "2570": 319,
          "2573": 17,
          "2577": 603,
          "2581": 798,
          "2582": 513,
          "2589": 522,
          "2592": 57,
          "2598": 77,
          "2618": 722,
          "2628": 781,
          "2638": 244,
          "2652": 780,
          "2654": 648,
          "2673": 671,
          "2674": 889,
          "2688": 445,
          "2696": 901,
          "2709": 657,
          "2741": 581,
          "2751": 628,
          "2758": 525,
          "2769": 16,
          "2774": 394,
          "2775": 281,
          "2785": 626,
          "2787": 189,
          "2790": 623,
          "2812": 852,
          "2816": 899,
          "2823": 742,
          "2827": 483,
          "2853": 47,
          "2882": 185,
          "2920": 691,
          "2929": 643,
          "2960": 353,
          "2971": 168,
          "2992": 452,
          "2999": 498,
          "3001": 860,
          "3003": 64,
          "3008": 333,
          "3009": 486,
          "3025": 820,
          "3032": 270,
          "3046": 282,
          "3070": 863,
          "3072": 686,
          "3082": 655,
          "3083": 366,
          "3094": 741,
          "3105": 473,
          "3114": 504,
          "3118": 570,
          "3119": 444,
          "3157": 179,
          "3171": 632,
          "3180": 772,
          "3185": 110,
          "3187": 891,
          "3215": 845,
          "3221": 540,
          "3224": 464,
          "3228": 220,
          "3230": 342,
          "3258": 635,
          "3274": 21,
          "3289": 496,
          "3294": 554,
          "3307": 32,
          "3328": 538,
          "3330": 672,
          "3340": 826,
          "3357": 566,
          "3361": 238,
          "3368": 31,
          "3370": 34,
          "3379": 775,
          "3380": 147,
          "3389": 526,
          "3446": 446,
          "3448": 438,
          "3482": 237,
          "3483": 216,
          "3490": 435,
          "3493": 649,
          "3513": 321,
          "3521": 364,
          "3537": 862,
          "3540": 78,
          "3546": 705,
          "3549": 210,
          "3551": 347,
          "3584": 167,
          "3615": 10,
          "3630": 723,
          "3638": 4,
          "3645": 467,
          "3654": 618,
          "3686": 882,
          "3703": 258,
          "3717": 113,
          "3728": 196,
          "3733": 310,
          "3738": 815,
          "3781": 737,
          "3790": 810,
          "3792": 809,
          "3816": 565,
          "3825": 629,
          "3835": 563,
          "3851": 276,
          "3852": 727,
          "3864": 395,
          "3866": 704,
          "3869": 28,
          "3876": 701,
          "3889": 728,
          "3905": 450,
          "3914": 317,
          "3922": 0,
          "3923": 137,
          "3927": 139,
          "3945": 330,
          "3967": 419,
          "3972": 381,
          "3977": 610,
          "3979": 773,
          "3989": 226,
          "3994": 172,
          "4010": 685,
          "4013": 724,
          "4039": 417,
          "4044": 746,
          "4054": 338,
          "4057": 675,
          "4064": 379,
          "4071": 894,
          "4098": 141,
          "4108": 393,
          "4110": 119,
          "4111": 664,
          "4116": 63,
          "4133": 716,
          "4138": 343,
          "4145": 74,
          "4148": 81,
          "4152": 831,
          "4222": 370,
          "4226": 456,
          "4236": 855,
          "4238": 783,
          "4243": 117,
          "4246": 813,
          "4257": 577,
          "4260": 712,
          "4278": 367,
          "4289": 239,
          "4290": 497,
          "4331": 192,
          "4335": 715,
          "4356": 20,
          "4358": 822,
          "4363": 202,
          "4381": 745,
          "4425": 286,
          "4427": 194,
          "4433": 895,
          "4434": 494,
          "4438": 156,
          "4490": 396,
          "4495": 803,
          "4519": 507,
          "4535": 2,
          "4586": 55,
          "4590": 806,
          "4592": 127,
          "4595": 35,
          "4598": 242,
          "4629": 527,
          "4681": 902,
          "4719": 230,
          "4731": 537,
          "4733": 739,
          "4734": 608,
          "4744": 309,
          "4800": 510,
          "4806": 380,
          "4807": 448,
          "4837": 273,
          "4839": 676,
          "4846": 887,
          "4848": 397,
          "4854": 642,
          "4856": 362,
          "4860": 506,
          "4899": 29,
          "4926": 886,
          "4945": 159,
          "4957": 62,
          "4967": 193,
          "4973": 176,
          "5002": 653,
          "5007": 457,
          "5012": 68,
          "5029": 140,
          "5039": 118,
          "5054": 45,
          "5062": 69,
          "5063": 840,
          "5092": 533,
          "5093": 313,
          "5115": 630,
          "5123": 703,
          "5126": 136,
          "5133": 383,
          "5139": 515,
          "5147": 735,
          "5154": 534,
          "5157": 770,
          "5186": 756,
          "5189": 409,
          "5190": 575,
          "5206": 521,
          "5239": 243,
          "5242": 725,
          "5246": 318,
          "5261": 327,
          "5266": 434,
          "5290": 94,
          "5293": 287,
          "5304": 387,
          "5319": 375,
          "5333": 604,
          "5337": 708,
          "5386": 484,
          "5389": 472,
          "5400": 13,
          "5401": 597,
          "5448": 256,
          "5489": 274,
          "5513": 802,
          "5519": 360,
          "5538": 144,
          "5570": 23,
          "5583": 377,
          "5588": 692,
          "5604": 579,
          "5606": 529,
          "5618": 33,
          "5622": 115,
          "5635": 124,
          "5655": 40,
          "5656": 269,
          "5660": 101,
          "5672": 662,
          "5684": 557,
          "5712": 14,
          "5717": 67,
          "5723": 612,
          "5724": 165,
          "5727": 776,
          "5731": 211,
          "5740": 215,
          "5746": 760,
          "5767": 851,
          "5776": 804,
          "5802": 114,
          "5809": 302,
          "5810": 518,
          "5868": 645,
          "5876": 228,
          "5883": 559,
          "5909": 27,
          "5914": 253,
          "5918": 544,
          "5935": 48,
          "5940": 752,
          "5968": 324,
          "5975": 233,
          "5984": 352,
          "5985": 204,
          "6006": 166,
          "6014": 430,
          "6032": 470,
          "6037": 800,
          "6038": 475,
          "6054": 195,
          "6060": 677,
          "6075": 847,
          "6080": 337,
          "6082": 694,
          "6098": 225,
          "6099": 285,
          "6104": 12,
          "6115": 512,
          "6119": 885,
          "6120": 266,
          "6139": 235,
          "6157": 834,
          "6160": 344,
          "6167": 585,
          "6188": 433,
          "6189": 59,
          "6206": 177,
          "6215": 336,
          "6233": 109,
          "6235": 505,
          "6258": 620,
          "6269": 432,
          "6286": 462,
          "6288": 535,
          "6294": 399,
          "6300": 245,
          "6308": 536,
          "6317": 545,
          "6330": 751,
          "6339": 487,
          "6341": 218,
          "6352": 755,
          "6359": 711,
          "6371": 61,
          "6373": 625,
          "6378": 356,
          "6388": 314,
          "6395": 335,
          "6406": 378,
          "6426": 80,
          "6446": 598,
          "6458": 19,
          "6492": 584,
          "6494": 750,
          "6497": 106,
          "6499": 390,
          "6505": 305,
          "6509": 652,
          "6510": 346,
          "6518": 681,
          "6519": 262,
          "6538": 146,
          "6544": 9,
          "6550": 425,
          "6553": 663,
          "6555": 478,
          "6567": 587,
          "6574": 374,
          "6575": 89,
          "6620": 766,
          "6637": 161,
          "6643": 148,
          "6673": 759,
          "6683": 340,
          "6686": 573,
          "6690": 878,
          "6694": 90,
          "6696": 107,
          "6701": 3,
          "6727": 606,
          "6763": 485,
          "6782": 617,
          "6788": 424,
          "6828": 214,
          "6865": 461,
          "6877": 123,
          "6895": 548,
          "6904": 39,
          "6918": 516,
          "6924": 588,
          "6927": 162,
          "6937": 163,
          "6956": 391,
          "6965": 271,
          "6981": 174,
          "6993": 687,
          "7000": 134,
          "7011": 426,
          "7030": 542,
          "7051": 673,
          "7061": 523,
          "7069": 602,
          "7085": 590,
          "7090": 811,
          "7095": 678,
          "7117": 300,
          "7120": 184,
          "7126": 753,
          "7128": 186,
          "7134": 198,
          "7139": 334,
          "7140": 277,
          "7145": 157,
          "7169": 350,
          "7188": 72,
          "7229": 188,
          "7240": 143,
          "7241": 594,
          "7245": 154,
          "7247": 221,
          "7258": 609,
          "7276": 128,
          "7285": 614,
          "7286": 471,
          "7294": 443,
          "7297": 560,
          "7313": 386,
          "7314": 43,
          "7316": 422,
          "7318": 255,
          "7335": 644,
          "7339": 841,
          "7342": 872,
          "7383": 382,
          "7384": 451,
          "7395": 733,
          "7398": 658,
          "7416": 292,
          "7434": 93,
          "7437": 477,
          "7445": 850,
          "7460": 104,
          "7475": 859,
          "7478": 640,
          "7481": 70,
          "7484": 208,
          "7495": 149,
          "7498": 449,
          "7515": 311,
          "7518": 868,
          "7520": 571,
          "7525": 421,
          "7538": 358,
          "7540": 182,
          "7553": 407,
          "7555": 601,
          "7558": 749,
          "7569": 489,
          "7594": 76,
          "7647": 721,
          "7657": 875,
          "7665": 856,
          "7688": 460,
          "7704": 36,
          "7705": 222,
          "7717": 79,
          "7720": 173,
          "7730": 698,
          "7732": 654,
          "7733": 768,
          "7739": 65,
          "7752": 207,
          "7754": 229,
          "7766": 108,
          "7777": 706,
          "7783": 260,
          "7789": 241,
          "7802": 265,
          "7809": 481,
          "7816": 539,
          "7825": 339,
          "7828": 227,
          "7832": 248,
          "7833": 296,
          "7837": 734,
          "7867": 402,
          "7868": 306,
          "7874": 50,
          "7881": 212,
          "7909": 636,
          "7910": 99,
          "7926": 416,
          "7932": 420,
          "7933": 263,
          "7938": 264,
          "7939": 232,
          "7945": 647,
          "7949": 400,
          "7956": 491,
          "7957": 726,
          "7959": 315,
          "7962": 699,
          "7967": 205,
          "7981": 288,
          "7982": 170,
          "7991": 666,
          "7994": 323,
          "7995": 122,
          "8006": 547,
          "8008": 414,
          "8011": 231,
          "8028": 303,
          "8050": 151,
          "8057": 562,
          "8066": 53,
          "8075": 348,
          "8080": 91,
          "8097": 638,
          "8113": 164,
          "8118": 87,
          "8119": 428,
          "8138": 405,
          "8142": 187,
          "8152": 132,
          "8163": 403,
          "8176": 261,
          "8183": 236,
          "8190": 469,
          "8193": 224,
          "8194": 133,
          "8195": 295,
          "8222": 459,
          "8225": 463,
          "8228": 807,
          "8266": 284,
          "8300": 748,
          "8329": 354,
          "8347": 669,
          "8388": 130,
          "8396": 320,
          "8401": 519,
          "8404": 331,
          "8410": 38,
          "8421": 558,
          "8459": 668,
          "8464": 514,
          "8474": 246,
          "8479": 718,
          "8490": 825,
          "8494": 371,
          "8498": 22,
          "8506": 37,
          "8527": 135,
          "8534": 361,
          "8545": 651,
          "8573": 556,
          "8575": 688,
          "8591": 325,
          "8592": 789,
          "8605": 376,
          "8619": 769,
          "8635": 465,
          "8643": 209,
          "8677": 493,
          "8684": 75,
          "8687": 541,
          "8699": 1,
          "8705": 740,
          "8713": 368,
          "8718": 150,
          "8722": 873,
          "8725": 341,
          "8742": 605,
          "8758": 388,
          "8771": 702,
          "8772": 297,
          "8776": 372,
          "8786": 436,
          "8791": 427,
          "8820": 190,
          "8824": 437,
          "8825": 408,
          "8848": 8,
          "8855": 86,
          "8875": 479,
          "8879": 659,
          "8887": 183,
          "9022": 160,
          "9023": 503,
          "9026": 695
        },
        files: {
          "en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx": {
            size_bytes: 78580914,
            md5_digest: "bb2c2776cffbfd736c7c497f620c0ca6"
          },
          "en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx.json": {
            size_bytes: 20123,
            md5_digest: "c740db18a0dab11b13ce0292ea1196c6"
          },
          "en/en_US/libritts_r/medium/MODEL_CARD": {
            size_bytes: 279,
            md5_digest: "ae42a6ca5f3fdc81690d4fe191b6fdee"
          }
        },
        aliases: []
      },
      "en_US-ljspeech-high": {
        key: "en_US-ljspeech-high",
        name: "ljspeech",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "high",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/ljspeech/high/en_US-ljspeech-high.onnx": {
            size_bytes: 114199011,
            md5_digest: "dad093b5d2cff6a5fda99883ceda09d1"
          },
          "en/en_US/ljspeech/high/en_US-ljspeech-high.onnx.json": {
            size_bytes: 4970,
            md5_digest: "de98fc398ddead60fb82d93bfafb3ad1"
          },
          "en/en_US/ljspeech/high/MODEL_CARD": {
            size_bytes: 515,
            md5_digest: "59322a9a8d2c0e556f0be1171cd54ea7"
          }
        },
        aliases: []
      },
      "en_US-ljspeech-medium": {
        key: "en_US-ljspeech-medium",
        name: "ljspeech",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/ljspeech/medium/en_US-ljspeech-medium.onnx": {
            size_bytes: 63531379,
            md5_digest: "109d552e9dd78d92d1169a7edd6de38d"
          },
          "en/en_US/ljspeech/medium/en_US-ljspeech-medium.onnx.json": {
            size_bytes: 4972,
            md5_digest: "0668112b8b3ac5bb4b12c2b1a366776a"
          },
          "en/en_US/ljspeech/medium/MODEL_CARD": {
            size_bytes: 517,
            md5_digest: "5ad31d314786587d4f97effb0b716d61"
          }
        },
        aliases: []
      },
      "en_US-norman-medium": {
        key: "en_US-norman-medium",
        name: "norman",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/norman/medium/en_US-norman-medium.onnx": {
            size_bytes: 63531379,
            md5_digest: "829cea515dc724d694b83b71e8083f9f"
          },
          "en/en_US/norman/medium/en_US-norman-medium.onnx.json": {
            size_bytes: 4968,
            md5_digest: "975830d6f230f6eccf657d265de99eba"
          },
          "en/en_US/norman/medium/MODEL_CARD": {
            size_bytes: 528,
            md5_digest: "c34f20bbc4918681ad7a070a8321f2fa"
          }
        },
        aliases: []
      },
      "en_US-ryan-high": {
        key: "en_US-ryan-high",
        name: "ryan",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "high",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/ryan/high/en_US-ryan-high.onnx": {
            size_bytes: 120786792,
            md5_digest: "5d879a17bddf5007f76655b445ba78b4"
          },
          "en/en_US/ryan/high/en_US-ryan-high.onnx.json": {
            size_bytes: 4166,
            md5_digest: "444ff9d6c17218a0eb1d12a20559d869"
          },
          "en/en_US/ryan/high/MODEL_CARD": {
            size_bytes: 265,
            md5_digest: "9c966517ed0bfbffbfdb218e99dbeadd"
          }
        },
        aliases: [
          "en-us-ryan-high"
        ]
      },
      "en_US-ryan-low": {
        key: "en_US-ryan-low",
        name: "ryan",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/ryan/low/en_US-ryan-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "32f6a995d6d561cd040b20a76f4edb1e"
          },
          "en/en_US/ryan/low/en_US-ryan-low.onnx.json": {
            size_bytes: 4165,
            md5_digest: "38eb0602e1f8bf627a0d9a747723cbf6"
          },
          "en/en_US/ryan/low/MODEL_CARD": {
            size_bytes: 263,
            md5_digest: "030252d21b0bd1048c37a9eb7f94eb17"
          }
        },
        aliases: [
          "en-us-ryan-low"
        ]
      },
      "en_US-ryan-medium": {
        key: "en_US-ryan-medium",
        name: "ryan",
        language: {
          code: "en_US",
          family: "en",
          region: "US",
          name_native: "English",
          name_english: "English",
          country_english: "United States"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "en/en_US/ryan/medium/en_US-ryan-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "8f06d3aff8ded5a7f13f907e6bec32ac"
          },
          "en/en_US/ryan/medium/en_US-ryan-medium.onnx.json": {
            size_bytes: 4883,
            md5_digest: "f173a2b5202b3e4128ccc3ed8195306c"
          },
          "en/en_US/ryan/medium/MODEL_CARD": {
            size_bytes: 306,
            md5_digest: "79d9200481a9dcabfa1803cb9e31c28a"
          }
        },
        aliases: [
          "en-us-ryan-medium"
        ]
      },
      "es_ES-carlfm-x_low": {
        key: "es_ES-carlfm-x_low",
        name: "carlfm",
        language: {
          code: "es_ES",
          family: "es",
          region: "ES",
          name_native: "Espa\xF1ol",
          name_english: "Spanish",
          country_english: "Spain"
        },
        quality: "x_low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "es/es_ES/carlfm/x_low/es_ES-carlfm-x_low.onnx": {
            size_bytes: 28130791,
            md5_digest: "4137b5aee01ea6241080fc4dbe59a8ee"
          },
          "es/es_ES/carlfm/x_low/es_ES-carlfm-x_low.onnx.json": {
            size_bytes: 4159,
            md5_digest: "f4ab058cc8b5d024f1b123d06049df22"
          },
          "es/es_ES/carlfm/x_low/MODEL_CARD": {
            size_bytes: 250,
            md5_digest: "19cb47bbe9e07e8d7937cfd39027d3a9"
          }
        },
        aliases: [
          "es-carlfm-x-low"
        ]
      },
      "es_ES-davefx-medium": {
        key: "es_ES-davefx-medium",
        name: "davefx",
        language: {
          code: "es_ES",
          family: "es",
          region: "ES",
          name_native: "Espa\xF1ol",
          name_english: "Spanish",
          country_english: "Spain"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "es/es_ES/davefx/medium/es_ES-davefx-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "dc515cd4ecc5f6f72fe14a941188fc9c"
          },
          "es/es_ES/davefx/medium/es_ES-davefx-medium.onnx.json": {
            size_bytes: 4817,
            md5_digest: "dd157b5eaf6930bf949cf416d9a9307a"
          },
          "es/es_ES/davefx/medium/MODEL_CARD": {
            size_bytes: 275,
            md5_digest: "5569c0fb20448308466216428b52f392"
          }
        },
        aliases: []
      },
      "es_ES-mls_10246-low": {
        key: "es_ES-mls_10246-low",
        name: "mls_10246",
        language: {
          code: "es_ES",
          family: "es",
          region: "ES",
          name_native: "Espa\xF1ol",
          name_english: "Spanish",
          country_english: "Spain"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "es/es_ES/mls_10246/low/es_ES-mls_10246-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "ab8e93c9d2714fd4481fbca4e2a38891"
          },
          "es/es_ES/mls_10246/low/es_ES-mls_10246-low.onnx.json": {
            size_bytes: 4160,
            md5_digest: "8948a322c81cae2bc5fb1b9bbbc4961e"
          },
          "es/es_ES/mls_10246/low/MODEL_CARD": {
            size_bytes: 257,
            md5_digest: "a345cefedda92347f53ea9a84d1b3983"
          }
        },
        aliases: [
          "es-mls_10246-low"
        ]
      },
      "es_ES-mls_9972-low": {
        key: "es_ES-mls_9972-low",
        name: "mls_9972",
        language: {
          code: "es_ES",
          family: "es",
          region: "ES",
          name_native: "Espa\xF1ol",
          name_english: "Spanish",
          country_english: "Spain"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "es/es_ES/mls_9972/low/es_ES-mls_9972-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "587f2fc38dc3f582e771c3748465e2a2"
          },
          "es/es_ES/mls_9972/low/es_ES-mls_9972-low.onnx.json": {
            size_bytes: 4159,
            md5_digest: "97195bce39639d77af82c9c9c2110620"
          },
          "es/es_ES/mls_9972/low/MODEL_CARD": {
            size_bytes: 256,
            md5_digest: "4ba8c18ce72a202a49312ee1914ca6b0"
          }
        },
        aliases: [
          "es-mls_9972-low"
        ]
      },
      "es_ES-sharvard-medium": {
        key: "es_ES-sharvard-medium",
        name: "sharvard",
        language: {
          code: "es_ES",
          family: "es",
          region: "ES",
          name_native: "Espa\xF1ol",
          name_english: "Spanish",
          country_english: "Spain"
        },
        quality: "medium",
        num_speakers: 2,
        speaker_id_map: {
          M: 0,
          F: 1
        },
        files: {
          "es/es_ES/sharvard/medium/es_ES-sharvard-medium.onnx": {
            size_bytes: 76733615,
            md5_digest: "77e6f9c26e92799fb04bb90b46bf1834"
          },
          "es/es_ES/sharvard/medium/es_ES-sharvard-medium.onnx.json": {
            size_bytes: 4903,
            md5_digest: "e49cab310ce362145f7d94b347c291ff"
          },
          "es/es_ES/sharvard/medium/MODEL_CARD": {
            size_bytes: 392,
            md5_digest: "b600a21381af84fa21b29f519a3a829a"
          }
        },
        aliases: []
      },
      "es_MX-ald-medium": {
        key: "es_MX-ald-medium",
        name: "ald",
        language: {
          code: "es_MX",
          family: "es",
          region: "MX",
          name_native: "Espa\xF1ol",
          name_english: "Spanish",
          country_english: "Mexico"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "es/es_MX/ald/medium/es_MX-ald-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "86374058e59b41ac3b7fe4181e1daad6"
          },
          "es/es_MX/ald/medium/es_MX-ald-medium.onnx.json": {
            size_bytes: 4889,
            md5_digest: "31c5463bf001d6e69bf57fc5916c0908"
          },
          "es/es_MX/ald/medium/MODEL_CARD": {
            size_bytes: 320,
            md5_digest: "a858af3698e0c7cda6c9ad5d0d11b651"
          }
        },
        aliases: []
      },
      "es_MX-claude-high": {
        key: "es_MX-claude-high",
        name: "claude",
        language: {
          code: "es_MX",
          family: "es",
          region: "MX",
          name_native: "Espa\xF1ol",
          name_english: "Spanish",
          country_english: "Mexico"
        },
        quality: "high",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "es/es_MX/claude/high/es_MX-claude-high.onnx": {
            size_bytes: 63122309,
            md5_digest: "cb1966e0ff20ca3aa010f6c9a0ce296a"
          },
          "es/es_MX/claude/high/es_MX-claude-high.onnx.json": {
            size_bytes: 4963,
            md5_digest: "36882201922fabb409f18d284af3eddd"
          },
          "es/es_MX/claude/high/MODEL_CARD": {
            size_bytes: 247,
            md5_digest: "bca99dc9b9a6c8f2f8563d73d52c4a3b"
          }
        },
        aliases: []
      },
      "fa_IR-amir-medium": {
        key: "fa_IR-amir-medium",
        name: "amir",
        language: {
          code: "fa_IR",
          family: "fa",
          region: "IR",
          name_native: "\u0641\u0627\u0631\u0633\u06CC",
          name_english: "Farsi",
          country_english: "Iran"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "fa/fa_IR/amir/medium/fa_IR-amir-medium.onnx": {
            size_bytes: 63531379,
            md5_digest: "7c0598c9726427869e1e86447b333539"
          },
          "fa/fa_IR/amir/medium/fa_IR-amir-medium.onnx.json": {
            size_bytes: 4958,
            md5_digest: "48c5e81f5aa4e1c5eba3dda0be403b58"
          },
          "fa/fa_IR/amir/medium/MODEL_CARD": {
            size_bytes: 264,
            md5_digest: "0728165259eb968913a680077607cd5c"
          }
        },
        aliases: []
      },
      "fa_IR-gyro-medium": {
        key: "fa_IR-gyro-medium",
        name: "gyro",
        language: {
          code: "fa_IR",
          family: "fa",
          region: "IR",
          name_native: "\u0641\u0627\u0631\u0633\u06CC",
          name_english: "Farsi",
          country_english: "Iran"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "fa/fa_IR/gyro/medium/fa_IR-gyro-medium.onnx": {
            size_bytes: 63122309,
            md5_digest: "e8ce094894c8ec2a77bfd0397b45d112"
          },
          "fa/fa_IR/gyro/medium/fa_IR-gyro-medium.onnx.json": {
            size_bytes: 7210,
            md5_digest: "15bcedc4117870524b30b0e07bdee27f"
          },
          "fa/fa_IR/gyro/medium/MODEL_CARD": {
            size_bytes: 262,
            md5_digest: "b30a1713c6e67946e3f1ed33eac06039"
          }
        },
        aliases: []
      },
      "fi_FI-harri-low": {
        key: "fi_FI-harri-low",
        name: "harri",
        language: {
          code: "fi_FI",
          family: "fi",
          region: "FI",
          name_native: "Suomi",
          name_english: "Finnish",
          country_english: "Finland"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "fi/fi_FI/harri/low/fi_FI-harri-low.onnx": {
            size_bytes: 69795191,
            md5_digest: "f44b67203de7fd488eabc4692d30b598"
          },
          "fi/fi_FI/harri/low/fi_FI-harri-low.onnx.json": {
            size_bytes: 4155,
            md5_digest: "76822a028ed11d02d9d7c25a49223a10"
          },
          "fi/fi_FI/harri/low/MODEL_CARD": {
            size_bytes: 284,
            md5_digest: "93ccf398abae82b7d7a3d420658e26f1"
          }
        },
        aliases: [
          "fi-harri-low"
        ]
      },
      "fi_FI-harri-medium": {
        key: "fi_FI-harri-medium",
        name: "harri",
        language: {
          code: "fi_FI",
          family: "fi",
          region: "FI",
          name_native: "Suomi",
          name_english: "Finnish",
          country_english: "Finland"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "fi/fi_FI/harri/medium/fi_FI-harri-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "8e96b9e765f8db3e910943520aa0f475"
          },
          "fi/fi_FI/harri/medium/fi_FI-harri-medium.onnx.json": {
            size_bytes: 4873,
            md5_digest: "d944b7607e545ee3a0d06887c3e4ccc4"
          },
          "fi/fi_FI/harri/medium/MODEL_CARD": {
            size_bytes: 304,
            md5_digest: "95d5aff86d27b69c8ee7deed6c056aff"
          }
        },
        aliases: []
      },
      "fr_FR-gilles-low": {
        key: "fr_FR-gilles-low",
        name: "gilles",
        language: {
          code: "fr_FR",
          family: "fr",
          region: "FR",
          name_native: "Fran\xE7ais",
          name_english: "French",
          country_english: "France"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "fr/fr_FR/gilles/low/fr_FR-gilles-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "f984386d1f0927597f09a3ec10b11b5d"
          },
          "fr/fr_FR/gilles/low/fr_FR-gilles-low.onnx.json": {
            size_bytes: 4158,
            md5_digest: "38b1775fef8b9de50f15f63c5d8b8643"
          },
          "fr/fr_FR/gilles/low/MODEL_CARD": {
            size_bytes: 300,
            md5_digest: "9317af9efdb0d9986d42357b180f06e2"
          }
        },
        aliases: [
          "fr-gilles-low"
        ]
      },
      "fr_FR-mls-medium": {
        key: "fr_FR-mls-medium",
        name: "mls",
        language: {
          code: "fr_FR",
          family: "fr",
          region: "FR",
          name_native: "Fran\xE7ais",
          name_english: "French",
          country_english: "France"
        },
        quality: "medium",
        num_speakers: 125,
        speaker_id_map: {
          "14": 48,
          "27": 113,
          "28": 112,
          "30": 106,
          "52": 85,
          "62": 32,
          "66": 52,
          "94": 116,
          "103": 47,
          "112": 115,
          "115": 107,
          "123": 2,
          "125": 69,
          "177": 114,
          "204": 98,
          "694": 73,
          "707": 105,
          "753": 84,
          "1127": 53,
          "1243": 30,
          "1329": 43,
          "1474": 3,
          "1590": 27,
          "1624": 74,
          "1649": 22,
          "1664": 50,
          "1745": 82,
          "1798": 81,
          "1817": 91,
          "1840": 0,
          "1844": 89,
          "1887": 75,
          "1977": 96,
          "1989": 58,
          "2033": 66,
          "2155": 92,
          "2284": 63,
          "2506": 44,
          "2544": 111,
          "2587": 109,
          "2596": 117,
          "2607": 110,
          "2771": 67,
          "2776": 23,
          "2825": 103,
          "2904": 123,
          "2926": 76,
          "2946": 93,
          "3060": 8,
          "3182": 64,
          "3190": 78,
          "3204": 70,
          "3270": 54,
          "3344": 79,
          "3503": 65,
          "3595": 118,
          "3698": 1,
          "4018": 87,
          "4174": 86,
          "4336": 94,
          "4396": 90,
          "4512": 9,
          "4609": 95,
          "4650": 99,
          "4699": 80,
          "4744": 102,
          "5077": 83,
          "5232": 15,
          "5295": 100,
          "5525": 28,
          "5553": 72,
          "5595": 71,
          "5612": 25,
          "5764": 16,
          "5840": 108,
          "5968": 101,
          "6070": 19,
          "6128": 14,
          "6249": 10,
          "6348": 61,
          "6362": 124,
          "6381": 49,
          "6856": 45,
          "7032": 119,
          "7150": 77,
          "7193": 60,
          "7239": 38,
          "7377": 40,
          "7423": 5,
          "7439": 122,
          "7614": 68,
          "7679": 62,
          "7848": 120,
          "8102": 35,
          "8582": 36,
          "8778": 7,
          "9121": 21,
          "9242": 6,
          "9804": 104,
          "9854": 39,
          "10058": 46,
          "10065": 13,
          "10082": 41,
          "10620": 34,
          "10827": 29,
          "10957": 97,
          "11247": 121,
          "11772": 24,
          "11822": 26,
          "11875": 37,
          "11954": 51,
          "12501": 20,
          "12512": 42,
          "12541": 11,
          "12709": 4,
          "12713": 17,
          "12823": 18,
          "12899": 88,
          "12968": 57,
          "12981": 59,
          "13142": 31,
          "13177": 33,
          "13611": 55,
          "13634": 12,
          "13658": 56
        },
        files: {
          "fr/fr_FR/mls/medium/fr_FR-mls-medium.onnx": {
            size_bytes: 76733750,
            md5_digest: "87831389d3ae92347d91e38b0c57add9"
          },
          "fr/fr_FR/mls/medium/fr_FR-mls-medium.onnx.json": {
            size_bytes: 7036,
            md5_digest: "be41a30aab03788f5e5c4fe51620ccbe"
          },
          "fr/fr_FR/mls/medium/MODEL_CARD": {
            size_bytes: 222,
            md5_digest: "88d84c1c548aa27c1d119d2964f8fcf0"
          }
        },
        aliases: []
      },
      "fr_FR-mls_1840-low": {
        key: "fr_FR-mls_1840-low",
        name: "mls_1840",
        language: {
          code: "fr_FR",
          family: "fr",
          region: "FR",
          name_native: "Fran\xE7ais",
          name_english: "French",
          country_english: "France"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "fr/fr_FR/mls_1840/low/fr_FR-mls_1840-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "1873b5d95cb0aad9909d32d1747ae72b"
          },
          "fr/fr_FR/mls_1840/low/fr_FR-mls_1840-low.onnx.json": {
            size_bytes: 4160,
            md5_digest: "eb0a76447f47f9114f832b1a0da9a8b3"
          },
          "fr/fr_FR/mls_1840/low/MODEL_CARD": {
            size_bytes: 257,
            md5_digest: "35d860ab0a8497966c73da525728e711"
          }
        },
        aliases: [
          "fr-mls_1840-low"
        ]
      },
      "fr_FR-siwis-low": {
        key: "fr_FR-siwis-low",
        name: "siwis",
        language: {
          code: "fr_FR",
          family: "fr",
          region: "FR",
          name_native: "Fran\xE7ais",
          name_english: "French",
          country_english: "France"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "fr/fr_FR/siwis/low/fr_FR-siwis-low.onnx": {
            size_bytes: 28130791,
            md5_digest: "fcb614122005d70f27e4e61e58b4bb56"
          },
          "fr/fr_FR/siwis/low/fr_FR-siwis-low.onnx.json": {
            size_bytes: 4157,
            md5_digest: "5222111c6eaa632c7ea01a5a8938e5e1"
          },
          "fr/fr_FR/siwis/low/MODEL_CARD": {
            size_bytes: 274,
            md5_digest: "5d4a6b6e8d4a476e9b415ec0c1f030da"
          }
        },
        aliases: [
          "fr-siwis-low"
        ]
      },
      "fr_FR-siwis-medium": {
        key: "fr_FR-siwis-medium",
        name: "siwis",
        language: {
          code: "fr_FR",
          family: "fr",
          region: "FR",
          name_native: "Fran\xE7ais",
          name_english: "French",
          country_english: "France"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "20e876e8c839e9b11a26085858f2300c"
          },
          "fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx.json": {
            size_bytes: 4875,
            md5_digest: "a407e7e6901feb79c2ea2a5466076cce"
          },
          "fr/fr_FR/siwis/medium/MODEL_CARD": {
            size_bytes: 284,
            md5_digest: "2b9ea48b15e9e1fd25f95b415caaf66f"
          }
        },
        aliases: [
          "fr-siwis-medium"
        ]
      },
      "fr_FR-tom-medium": {
        key: "fr_FR-tom-medium",
        name: "tom",
        language: {
          code: "fr_FR",
          family: "fr",
          region: "FR",
          name_native: "Fran\xE7ais",
          name_english: "French",
          country_english: "France"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "fr/fr_FR/tom/medium/fr_FR-tom-medium.onnx": {
            size_bytes: 63511038,
            md5_digest: "5b460c2394a871e675f5c798af149412"
          },
          "fr/fr_FR/tom/medium/fr_FR-tom-medium.onnx.json": {
            size_bytes: 4959,
            md5_digest: "964d58602df7adf76c2401b070f68ea2"
          },
          "fr/fr_FR/tom/medium/MODEL_CARD": {
            size_bytes: 233,
            md5_digest: "d82342c0c27cfbe9342814c7da46cb83"
          }
        },
        aliases: []
      },
      "fr_FR-upmc-medium": {
        key: "fr_FR-upmc-medium",
        name: "upmc",
        language: {
          code: "fr_FR",
          family: "fr",
          region: "FR",
          name_native: "Fran\xE7ais",
          name_english: "French",
          country_english: "France"
        },
        quality: "medium",
        num_speakers: 2,
        speaker_id_map: {
          jessica: 0,
          pierre: 1
        },
        files: {
          "fr/fr_FR/upmc/medium/fr_FR-upmc-medium.onnx": {
            size_bytes: 76733615,
            md5_digest: "6837ede9408c7e1b39fa4a126af9e865"
          },
          "fr/fr_FR/upmc/medium/fr_FR-upmc-medium.onnx.json": {
            size_bytes: 4996,
            md5_digest: "574571ae93aba72dbd159582981037da"
          },
          "fr/fr_FR/upmc/medium/MODEL_CARD": {
            size_bytes: 316,
            md5_digest: "9a49df5c79d89290ac626ebe08f05830"
          }
        },
        aliases: []
      },
      "hu_HU-anna-medium": {
        key: "hu_HU-anna-medium",
        name: "anna",
        language: {
          code: "hu_HU",
          family: "hu",
          region: "HU",
          name_native: "Magyar",
          name_english: "Hungarian",
          country_english: "Hungary"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "hu/hu_HU/anna/medium/hu_HU-anna-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "3796f9fa28bd8d390d17828e2e2e952d"
          },
          "hu/hu_HU/anna/medium/hu_HU-anna-medium.onnx.json": {
            size_bytes: 5018,
            md5_digest: "ae63867e2c2cb6695555a17bdee8b751"
          },
          "hu/hu_HU/anna/medium/MODEL_CARD": {
            size_bytes: 277,
            md5_digest: "1a1332b041bc211d4d14fbd93eff03e9"
          }
        },
        aliases: []
      },
      "hu_HU-berta-medium": {
        key: "hu_HU-berta-medium",
        name: "berta",
        language: {
          code: "hu_HU",
          family: "hu",
          region: "HU",
          name_native: "Magyar",
          name_english: "Hungarian",
          country_english: "Hungary"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "hu/hu_HU/berta/medium/hu_HU-berta-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "a94cc2562ba892f462cb502f9d3c3ca3"
          },
          "hu/hu_HU/berta/medium/hu_HU-berta-medium.onnx.json": {
            size_bytes: 4961,
            md5_digest: "1f722cc72f330e3ba0222c6a94a527fa"
          },
          "hu/hu_HU/berta/medium/MODEL_CARD": {
            size_bytes: 278,
            md5_digest: "009624d3fa8f0f1e73c22a6277798c95"
          }
        },
        aliases: []
      },
      "hu_HU-imre-medium": {
        key: "hu_HU-imre-medium",
        name: "imre",
        language: {
          code: "hu_HU",
          family: "hu",
          region: "HU",
          name_native: "Magyar",
          name_english: "Hungarian",
          country_english: "Hungary"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "hu/hu_HU/imre/medium/hu_HU-imre-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "aa0b1d1fdd539881c64ed249097e75ff"
          },
          "hu/hu_HU/imre/medium/hu_HU-imre-medium.onnx.json": {
            size_bytes: 5019,
            md5_digest: "9b6974c685cd8289619660f5e078de06"
          },
          "hu/hu_HU/imre/medium/MODEL_CARD": {
            size_bytes: 277,
            md5_digest: "3efe4f497211542985d2d52d403eecad"
          }
        },
        aliases: []
      },
      "is_IS-bui-medium": {
        key: "is_IS-bui-medium",
        name: "bui",
        language: {
          code: "is_IS",
          family: "is",
          region: "IS",
          name_native: "\xEDslenska",
          name_english: "Icelandic",
          country_english: "Iceland"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "is/is_IS/bui/medium/is_IS-bui-medium.onnx": {
            size_bytes: 76495465,
            md5_digest: "08332bb41a67b52a3361bd1e8e36fb10"
          },
          "is/is_IS/bui/medium/is_IS-bui-medium.onnx.json": {
            size_bytes: 4162,
            md5_digest: "dae8bd862a11dd826a01d262d8fe62cf"
          },
          "is/is_IS/bui/medium/MODEL_CARD": {
            size_bytes: 246,
            md5_digest: "a055aad199d8cc58e52913ff2af461d8"
          }
        },
        aliases: [
          "is-bui-medium"
        ]
      },
      "is_IS-salka-medium": {
        key: "is_IS-salka-medium",
        name: "salka",
        language: {
          code: "is_IS",
          family: "is",
          region: "IS",
          name_native: "\xEDslenska",
          name_english: "Icelandic",
          country_english: "Iceland"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "is/is_IS/salka/medium/is_IS-salka-medium.onnx": {
            size_bytes: 76495465,
            md5_digest: "5967c9456b931d6123687d7b78fd81a7"
          },
          "is/is_IS/salka/medium/is_IS-salka-medium.onnx.json": {
            size_bytes: 4164,
            md5_digest: "ce262d355da30218152cbc256b0f2b69"
          },
          "is/is_IS/salka/medium/MODEL_CARD": {
            size_bytes: 241,
            md5_digest: "0f3d286069e4c7bead9b40ece3bbefe6"
          }
        },
        aliases: [
          "is-salka-medium"
        ]
      },
      "is_IS-steinn-medium": {
        key: "is_IS-steinn-medium",
        name: "steinn",
        language: {
          code: "is_IS",
          family: "is",
          region: "IS",
          name_native: "\xEDslenska",
          name_english: "Icelandic",
          country_english: "Iceland"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "is/is_IS/steinn/medium/is_IS-steinn-medium.onnx": {
            size_bytes: 76495465,
            md5_digest: "fd8189eb0a72e78d525e70a71aaa792c"
          },
          "is/is_IS/steinn/medium/is_IS-steinn-medium.onnx.json": {
            size_bytes: 4165,
            md5_digest: "9d4ac17e0cd1f83cd940e2563c04b8a1"
          },
          "is/is_IS/steinn/medium/MODEL_CARD": {
            size_bytes: 242,
            md5_digest: "45ab46f37e5a6bdf739d58496752e6a0"
          }
        },
        aliases: [
          "is-steinn-medium"
        ]
      },
      "is_IS-ugla-medium": {
        key: "is_IS-ugla-medium",
        name: "ugla",
        language: {
          code: "is_IS",
          family: "is",
          region: "IS",
          name_native: "\xEDslenska",
          name_english: "Icelandic",
          country_english: "Iceland"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "is/is_IS/ugla/medium/is_IS-ugla-medium.onnx": {
            size_bytes: 76495465,
            md5_digest: "722fcea3546f0113ad6664290aa97cab"
          },
          "is/is_IS/ugla/medium/is_IS-ugla-medium.onnx.json": {
            size_bytes: 4163,
            md5_digest: "c8c1aebf00bdc7ae6541ce68e3b83f31"
          },
          "is/is_IS/ugla/medium/MODEL_CARD": {
            size_bytes: 240,
            md5_digest: "a3ba0a35bc26d440ee3b0872e435fcd5"
          }
        },
        aliases: [
          "is-ugla-medium"
        ]
      },
      "it_IT-paola-medium": {
        key: "it_IT-paola-medium",
        name: "paola",
        language: {
          code: "it_IT",
          family: "it",
          region: "IT",
          name_native: "Italiano",
          name_english: "Italian",
          country_english: "Italy"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "it/it_IT/paola/medium/it_IT-paola-medium.onnx": {
            size_bytes: 63511038,
            md5_digest: "3a44e73b12ca5d0c21a72e388b5847c8"
          },
          "it/it_IT/paola/medium/it_IT-paola-medium.onnx.json": {
            size_bytes: 7099,
            md5_digest: "cd471a3757c88a7a4baee6207248b5d5"
          },
          "it/it_IT/paola/medium/MODEL_CARD": {
            size_bytes: 303,
            md5_digest: "436971e8acb0a92dd8dbc42542e59d03"
          }
        },
        aliases: []
      },
      "it_IT-riccardo-x_low": {
        key: "it_IT-riccardo-x_low",
        name: "riccardo",
        language: {
          code: "it_IT",
          family: "it",
          region: "IT",
          name_native: "Italiano",
          name_english: "Italian",
          country_english: "Italy"
        },
        quality: "x_low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "it/it_IT/riccardo/x_low/it_IT-riccardo-x_low.onnx": {
            size_bytes: 28130791,
            md5_digest: "2c564b67f6bfaf3ad02d28ab528929b8"
          },
          "it/it_IT/riccardo/x_low/it_IT-riccardo-x_low.onnx.json": {
            size_bytes: 4161,
            md5_digest: "ed24cd550b79acbdc337e519849e9636"
          },
          "it/it_IT/riccardo/x_low/MODEL_CARD": {
            size_bytes: 260,
            md5_digest: "3e70f29ab998ac0380edc0cec7395e80"
          }
        },
        aliases: [
          "it-riccardo_fasol-x-low"
        ]
      },
      "ka_GE-natia-medium": {
        key: "ka_GE-natia-medium",
        name: "natia",
        language: {
          code: "ka_GE",
          family: "ka",
          region: "GE",
          name_native: "\u10E5\u10D0\u10E0\u10D7\u10E3\u10DA\u10D8 \u10D4\u10DC\u10D0",
          name_english: "Georgian",
          country_english: "Georgia"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "ka/ka_GE/natia/medium/ka_GE-natia-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "83bd40f8d176a83d3d8d605fada2a5e7"
          },
          "ka/ka_GE/natia/medium/ka_GE-natia-medium.onnx.json": {
            size_bytes: 4842,
            md5_digest: "f992d9a6887cce43e707119e66c0db55"
          },
          "ka/ka_GE/natia/medium/MODEL_CARD": {
            size_bytes: 288,
            md5_digest: "81ac71dd5b3dac89bf7762bf7b738c95"
          }
        },
        aliases: []
      },
      "kk_KZ-iseke-x_low": {
        key: "kk_KZ-iseke-x_low",
        name: "iseke",
        language: {
          code: "kk_KZ",
          family: "kk",
          region: "KZ",
          name_native: "\u049B\u0430\u0437\u0430\u049B\u0448\u0430",
          name_english: "Kazakh",
          country_english: "Kazakhstan"
        },
        quality: "x_low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "kk/kk_KZ/iseke/x_low/kk_KZ-iseke-x_low.onnx": {
            size_bytes: 28130791,
            md5_digest: "1674f3f4ce48981d77e500741afa4ff9"
          },
          "kk/kk_KZ/iseke/x_low/kk_KZ-iseke-x_low.onnx.json": {
            size_bytes: 4168,
            md5_digest: "bc9832bc17f9d64367ee3bfb64f7f944"
          },
          "kk/kk_KZ/iseke/x_low/MODEL_CARD": {
            size_bytes: 239,
            md5_digest: "fce637093c4437a1f929280913a86aa5"
          }
        },
        aliases: [
          "kk-iseke-x-low"
        ]
      },
      "kk_KZ-issai-high": {
        key: "kk_KZ-issai-high",
        name: "issai",
        language: {
          code: "kk_KZ",
          family: "kk",
          region: "KZ",
          name_native: "\u049B\u0430\u0437\u0430\u049B\u0448\u0430",
          name_english: "Kazakh",
          country_english: "Kazakhstan"
        },
        quality: "high",
        num_speakers: 6,
        speaker_id_map: {
          ISSAI_KazakhTTS2_M2: 0,
          ISSAI_KazakhTTS_M1_Iseke: 1,
          ISSAI_KazakhTTS2_F3: 2,
          ISSAI_KazakhTTS_F1_Raya: 3,
          ISSAI_KazakhTTS2_F1: 4,
          ISSAI_KazakhTTS2_F2: 5
        },
        files: {
          "kk/kk_KZ/issai/high/kk_KZ-issai-high.onnx": {
            size_bytes: 127864258,
            md5_digest: "d5a97c25feb0949c187ae5f8e72753e3"
          },
          "kk/kk_KZ/issai/high/kk_KZ-issai-high.onnx.json": {
            size_bytes: 4358,
            md5_digest: "cfef5328137c8a1e4d1e5d3dac0c7056"
          },
          "kk/kk_KZ/issai/high/MODEL_CARD": {
            size_bytes: 237,
            md5_digest: "30487d1011336ed15feabd156424cbd9"
          }
        },
        aliases: [
          "kk-issai-high"
        ]
      },
      "kk_KZ-raya-x_low": {
        key: "kk_KZ-raya-x_low",
        name: "raya",
        language: {
          code: "kk_KZ",
          family: "kk",
          region: "KZ",
          name_native: "\u049B\u0430\u0437\u0430\u049B\u0448\u0430",
          name_english: "Kazakh",
          country_english: "Kazakhstan"
        },
        quality: "x_low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "kk/kk_KZ/raya/x_low/kk_KZ-raya-x_low.onnx": {
            size_bytes: 28130791,
            md5_digest: "476ecc32e07cad26572a50f26d0ebe28"
          },
          "kk/kk_KZ/raya/x_low/kk_KZ-raya-x_low.onnx.json": {
            size_bytes: 4167,
            md5_digest: "cc696dbf95d53a280b6805d81b4eac64"
          },
          "kk/kk_KZ/raya/x_low/MODEL_CARD": {
            size_bytes: 238,
            md5_digest: "fb34d2e65fac42f4d6e003d3d30c897e"
          }
        },
        aliases: [
          "kk-raya-x-low"
        ]
      },
      "lb_LU-marylux-medium": {
        key: "lb_LU-marylux-medium",
        name: "marylux",
        language: {
          code: "lb_LU",
          family: "lb",
          region: "LU",
          name_native: "L\xEBtzebuergesch",
          name_english: "Luxembourgish",
          country_english: "Luxembourg"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "lb/lb_LU/marylux/medium/lb_LU-marylux-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "966856e665a46cee45cb0cd2c475f8d5"
          },
          "lb/lb_LU/marylux/medium/lb_LU-marylux-medium.onnx.json": {
            size_bytes: 4979,
            md5_digest: "aea98b0e4fecaa0b3b7adc2048561095"
          },
          "lb/lb_LU/marylux/medium/MODEL_CARD": {
            size_bytes: 330,
            md5_digest: "1eeb3d600789cdd8b3f23866023d8543"
          }
        },
        aliases: []
      },
      "ne_NP-google-medium": {
        key: "ne_NP-google-medium",
        name: "google",
        language: {
          code: "ne_NP",
          family: "ne",
          region: "NP",
          name_native: "\u0928\u0947\u092A\u093E\u0932\u0940",
          name_english: "Nepali",
          country_english: "Nepal"
        },
        quality: "medium",
        num_speakers: 18,
        speaker_id_map: {
          "2027": 16,
          "2099": 2,
          "2139": 10,
          "3154": 14,
          "3614": 1,
          "3960": 3,
          "3997": 13,
          "5687": 11,
          "6329": 6,
          "6587": 8,
          "6834": 4,
          "7957": 5,
          "9407": 7,
          "0546": 0,
          "0258": 9,
          "0283": 12,
          "0883": 15,
          "0649": 17
        },
        files: {
          "ne/ne_NP/google/medium/ne_NP-google-medium.onnx": {
            size_bytes: 76766385,
            md5_digest: "2c24ccfe18eca2f14bccd0a188516109"
          },
          "ne/ne_NP/google/medium/ne_NP-google-medium.onnx.json": {
            size_bytes: 5165,
            md5_digest: "28ebbba4fbbbaa5f7ed302e5e7c7105f"
          },
          "ne/ne_NP/google/medium/MODEL_CARD": {
            size_bytes: 283,
            md5_digest: "afe022ba061870d0c9fe085fe9a9f31f"
          }
        },
        aliases: [
          "ne-google-medium"
        ]
      },
      "ne_NP-google-x_low": {
        key: "ne_NP-google-x_low",
        name: "google",
        language: {
          code: "ne_NP",
          family: "ne",
          region: "NP",
          name_native: "\u0928\u0947\u092A\u093E\u0932\u0940",
          name_english: "Nepali",
          country_english: "Nepal"
        },
        quality: "x_low",
        num_speakers: 18,
        speaker_id_map: {
          "2027": 16,
          "2099": 2,
          "2139": 10,
          "3154": 14,
          "3614": 1,
          "3960": 3,
          "3997": 13,
          "5687": 11,
          "6329": 6,
          "6587": 8,
          "6834": 4,
          "7957": 5,
          "9407": 7,
          "0546": 0,
          "0258": 9,
          "0283": 12,
          "0883": 15,
          "0649": 17
        },
        files: {
          "ne/ne_NP/google/x_low/ne_NP-google-x_low.onnx": {
            size_bytes: 27693157,
            md5_digest: "b11030daccc781a7db64c9413197ca8a"
          },
          "ne/ne_NP/google/x_low/ne_NP-google-x_low.onnx.json": {
            size_bytes: 4449,
            md5_digest: "c6856d6ad593dc459bd50204e9b29b1c"
          },
          "ne/ne_NP/google/x_low/MODEL_CARD": {
            size_bytes: 244,
            md5_digest: "5ea405c002a69df5961c8d43cadbb844"
          }
        },
        aliases: [
          "ne-google-x-low"
        ]
      },
      "nl_BE-nathalie-medium": {
        key: "nl_BE-nathalie-medium",
        name: "nathalie",
        language: {
          code: "nl_BE",
          family: "nl",
          region: "BE",
          name_native: "Nederlands",
          name_english: "Dutch",
          country_english: "Belgium"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "nl/nl_BE/nathalie/medium/nl_BE-nathalie-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "ab0c38b5f66764b59ad9e3e98b1c2172"
          },
          "nl/nl_BE/nathalie/medium/nl_BE-nathalie-medium.onnx.json": {
            size_bytes: 4879,
            md5_digest: "13c6e6c9511447e1906c25748a93f0bd"
          },
          "nl/nl_BE/nathalie/medium/MODEL_CARD": {
            size_bytes: 284,
            md5_digest: "ff335f87ca41a3f89180781498e02635"
          }
        },
        aliases: []
      },
      "nl_BE-nathalie-x_low": {
        key: "nl_BE-nathalie-x_low",
        name: "nathalie",
        language: {
          code: "nl_BE",
          family: "nl",
          region: "BE",
          name_native: "Nederlands",
          name_english: "Dutch",
          country_english: "Belgium"
        },
        quality: "x_low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "nl/nl_BE/nathalie/x_low/nl_BE-nathalie-x_low.onnx": {
            size_bytes: 20628813,
            md5_digest: "4a00803b60caecad30ea612bcd9f9344"
          },
          "nl/nl_BE/nathalie/x_low/nl_BE-nathalie-x_low.onnx.json": {
            size_bytes: 4163,
            md5_digest: "5307e9c8398ab02060611bb9c2e0f137"
          },
          "nl/nl_BE/nathalie/x_low/MODEL_CARD": {
            size_bytes: 246,
            md5_digest: "5df62094bde427374223f91f44476392"
          }
        },
        aliases: [
          "nl-nathalie-x-low"
        ]
      },
      "nl_BE-rdh-medium": {
        key: "nl_BE-rdh-medium",
        name: "rdh",
        language: {
          code: "nl_BE",
          family: "nl",
          region: "BE",
          name_native: "Nederlands",
          name_english: "Dutch",
          country_english: "Belgium"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "nl/nl_BE/rdh/medium/nl_BE-rdh-medium.onnx": {
            size_bytes: 63104526,
            md5_digest: "33d3469d745677ec4d7e96eb4145b09e"
          },
          "nl/nl_BE/rdh/medium/nl_BE-rdh-medium.onnx.json": {
            size_bytes: 4159,
            md5_digest: "4a7629a2d00a62e72b8692f7a19135f1"
          },
          "nl/nl_BE/rdh/medium/MODEL_CARD": {
            size_bytes: 244,
            md5_digest: "dc4487b06fcef6ff270c852ce12947b9"
          }
        },
        aliases: [
          "nl-rdh-medium"
        ]
      },
      "nl_BE-rdh-x_low": {
        key: "nl_BE-rdh-x_low",
        name: "rdh",
        language: {
          code: "nl_BE",
          family: "nl",
          region: "BE",
          name_native: "Nederlands",
          name_english: "Dutch",
          country_english: "Belgium"
        },
        quality: "x_low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "nl/nl_BE/rdh/x_low/nl_BE-rdh-x_low.onnx": {
            size_bytes: 20628813,
            md5_digest: "7d60d0de9ad9ec11a1d293665743afda"
          },
          "nl/nl_BE/rdh/x_low/nl_BE-rdh-x_low.onnx.json": {
            size_bytes: 4158,
            md5_digest: "d222d7fa8654d49e3b35c640cc28891f"
          },
          "nl/nl_BE/rdh/x_low/MODEL_CARD": {
            size_bytes: 242,
            md5_digest: "6d0157bcd5ff281717e663d56dab980e"
          }
        },
        aliases: [
          "nl-rdh-x-low"
        ]
      },
      "nl_NL-mls-medium": {
        key: "nl_NL-mls-medium",
        name: "mls",
        language: {
          code: "nl_NL",
          family: "nl",
          region: "NL",
          name_native: "Nederlands",
          name_english: "Dutch",
          country_english: "Netherlands"
        },
        quality: "medium",
        num_speakers: 52,
        speaker_id_map: {
          "123": 28,
          "496": 4,
          "880": 15,
          "960": 30,
          "1085": 44,
          "1666": 2,
          "1724": 1,
          "1775": 13,
          "2239": 42,
          "2450": 0,
          "2506": 5,
          "2602": 49,
          "2792": 32,
          "2825": 17,
          "2951": 12,
          "2981": 35,
          "3024": 29,
          "3034": 16,
          "3245": 19,
          "3619": 7,
          "3798": 9,
          "4174": 34,
          "4396": 20,
          "4429": 8,
          "5367": 50,
          "5438": 18,
          "5764": 36,
          "5809": 3,
          "6282": 47,
          "6513": 37,
          "6697": 39,
          "6916": 23,
          "7432": 6,
          "7579": 27,
          "7588": 26,
          "7723": 33,
          "7884": 38,
          "8331": 46,
          "8480": 45,
          "9861": 14,
          "10079": 25,
          "10294": 24,
          "10587": 11,
          "10632": 48,
          "10879": 43,
          "10984": 31,
          "11157": 41,
          "11290": 21,
          "11472": 51,
          "11936": 22,
          "12500": 10,
          "12749": 40
        },
        files: {
          "nl/nl_NL/mls/medium/nl_NL-mls-medium.onnx": {
            size_bytes: 76584246,
            md5_digest: "f1d4b1452ccfdac24be72085b2b6b55c"
          },
          "nl/nl_NL/mls/medium/nl_NL-mls-medium.onnx.json": {
            size_bytes: 5856,
            md5_digest: "1915807d7cb85274ba957846370fff39"
          },
          "nl/nl_NL/mls/medium/MODEL_CARD": {
            size_bytes: 225,
            md5_digest: "6e5d961780907a4d7746eada893b8eca"
          }
        },
        aliases: []
      },
      "nl_NL-mls_5809-low": {
        key: "nl_NL-mls_5809-low",
        name: "mls_5809",
        language: {
          code: "nl_NL",
          family: "nl",
          region: "NL",
          name_native: "Nederlands",
          name_english: "Dutch",
          country_english: "Netherlands"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "nl/nl_NL/mls_5809/low/nl_NL-mls_5809-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "e69130a776b04c9962a1fefb4878d7d9"
          },
          "nl/nl_NL/mls_5809/low/nl_NL-mls_5809-low.onnx.json": {
            size_bytes: 4165,
            md5_digest: "b927009215c55c28654ddbc7b86674c2"
          },
          "nl/nl_NL/mls_5809/low/MODEL_CARD": {
            size_bytes: 261,
            md5_digest: "ac4b35e581cea8418909947a29a671bb"
          }
        },
        aliases: [
          "nl-mls_5809-low"
        ]
      },
      "nl_NL-mls_7432-low": {
        key: "nl_NL-mls_7432-low",
        name: "mls_7432",
        language: {
          code: "nl_NL",
          family: "nl",
          region: "NL",
          name_native: "Nederlands",
          name_english: "Dutch",
          country_english: "Netherlands"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "nl/nl_NL/mls_7432/low/nl_NL-mls_7432-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "044b69d583e191203997761434607273"
          },
          "nl/nl_NL/mls_7432/low/nl_NL-mls_7432-low.onnx.json": {
            size_bytes: 4165,
            md5_digest: "4d6ecdff8b7cd39e8f7137983140cf1c"
          },
          "nl/nl_NL/mls_7432/low/MODEL_CARD": {
            size_bytes: 260,
            md5_digest: "5d8ee8e955f077fc99cac61191d00892"
          }
        },
        aliases: [
          "nl-mls_7432-low"
        ]
      },
      "no_NO-talesyntese-medium": {
        key: "no_NO-talesyntese-medium",
        name: "talesyntese",
        language: {
          code: "no_NO",
          family: "no",
          region: "NO",
          name_native: "Norsk",
          name_english: "Norwegian",
          country_english: "Norway"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "no/no_NO/talesyntese/medium/no_NO-talesyntese-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "9fc876e7edc6593086b4f2f34889f44b"
          },
          "no/no_NO/talesyntese/medium/no_NO-talesyntese-medium.onnx.json": {
            size_bytes: 4880,
            md5_digest: "94b938e1bd319e6a084dc8380fb53619"
          },
          "no/no_NO/talesyntese/medium/MODEL_CARD": {
            size_bytes: 312,
            md5_digest: "5fe51d2a4a0e05e85c88a80373000ae1"
          }
        },
        aliases: [
          "no-talesyntese-medium"
        ]
      },
      "pl_PL-darkman-medium": {
        key: "pl_PL-darkman-medium",
        name: "darkman",
        language: {
          code: "pl_PL",
          family: "pl",
          region: "PL",
          name_native: "Polski",
          name_english: "Polish",
          country_english: "Poland"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "pl/pl_PL/darkman/medium/pl_PL-darkman-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "27bf2d71e934b112657544fd0b100a7a"
          },
          "pl/pl_PL/darkman/medium/pl_PL-darkman-medium.onnx.json": {
            size_bytes: 4816,
            md5_digest: "1c13180312cca98cb75ca39b31972056"
          },
          "pl/pl_PL/darkman/medium/MODEL_CARD": {
            size_bytes: 276,
            md5_digest: "952772905864f6f6375df54a675895b7"
          }
        },
        aliases: []
      },
      "pl_PL-gosia-medium": {
        key: "pl_PL-gosia-medium",
        name: "gosia",
        language: {
          code: "pl_PL",
          family: "pl",
          region: "PL",
          name_native: "Polski",
          name_english: "Polish",
          country_english: "Poland"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "pl/pl_PL/gosia/medium/pl_PL-gosia-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "ecf817530e575025166e454adde1f382"
          },
          "pl/pl_PL/gosia/medium/pl_PL-gosia-medium.onnx.json": {
            size_bytes: 4814,
            md5_digest: "e57055b9eec14e570617af2b716bd5c3"
          },
          "pl/pl_PL/gosia/medium/MODEL_CARD": {
            size_bytes: 274,
            md5_digest: "e1355330fe5fab166e6f2e20af7e91e9"
          }
        },
        aliases: []
      },
      "pl_PL-mc_speech-medium": {
        key: "pl_PL-mc_speech-medium",
        name: "mc_speech",
        language: {
          code: "pl_PL",
          family: "pl",
          region: "PL",
          name_native: "Polski",
          name_english: "Polish",
          country_english: "Poland"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "pl/pl_PL/mc_speech/medium/pl_PL-mc_speech-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "a927e2f2c882bb40cbc2e5f3356ce19b"
          },
          "pl/pl_PL/mc_speech/medium/pl_PL-mc_speech-medium.onnx.json": {
            size_bytes: 4961,
            md5_digest: "3f506e68bb9531b11e94e5f5dda5dd21"
          },
          "pl/pl_PL/mc_speech/medium/MODEL_CARD": {
            size_bytes: 296,
            md5_digest: "affe6073af7777237f73d0768103547e"
          }
        },
        aliases: []
      },
      "pl_PL-mls_6892-low": {
        key: "pl_PL-mls_6892-low",
        name: "mls_6892",
        language: {
          code: "pl_PL",
          family: "pl",
          region: "PL",
          name_native: "Polski",
          name_english: "Polish",
          country_english: "Poland"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "pl/pl_PL/mls_6892/low/pl_PL-mls_6892-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "8590d8e979292ca35d20e6e123bfa612"
          },
          "pl/pl_PL/mls_6892/low/pl_PL-mls_6892-low.onnx.json": {
            size_bytes: 4157,
            md5_digest: "7da3504b7726d6a7143a9265d9295fa1"
          },
          "pl/pl_PL/mls_6892/low/MODEL_CARD": {
            size_bytes: 257,
            md5_digest: "74ebc618d120896113449ad2f957b7a4"
          }
        },
        aliases: [
          "pl-mls_6892-low"
        ]
      },
      "pt_BR-edresson-low": {
        key: "pt_BR-edresson-low",
        name: "edresson",
        language: {
          code: "pt_BR",
          family: "pt",
          region: "BR",
          name_native: "Portugu\xEAs",
          name_english: "Portuguese",
          country_english: "Brazil"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "pt/pt_BR/edresson/low/pt_BR-edresson-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "53e365c040dd07890fe1855b64c7cc58"
          },
          "pt/pt_BR/edresson/low/pt_BR-edresson-low.onnx.json": {
            size_bytes: 4168,
            md5_digest: "806966b457e27c01d9b8eed2bc76a185"
          },
          "pt/pt_BR/edresson/low/MODEL_CARD": {
            size_bytes: 283,
            md5_digest: "62cde47b9a3214109e601f90eeadea11"
          }
        },
        aliases: [
          "pt-br-edresson-low"
        ]
      },
      "pt_BR-faber-medium": {
        key: "pt_BR-faber-medium",
        name: "faber",
        language: {
          code: "pt_BR",
          family: "pt",
          region: "BR",
          name_native: "Portugu\xEAs",
          name_english: "Portuguese",
          country_english: "Brazil"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "e0724a2f07965f6523d2a1e96b488a4c"
          },
          "pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json": {
            size_bytes: 4855,
            md5_digest: "a1258e1e113c47d9a1486a9bef1daab4"
          },
          "pt/pt_BR/faber/medium/MODEL_CARD": {
            size_bytes: 278,
            md5_digest: "a81a3840b1749cf34b0e31de1577ef47"
          }
        },
        aliases: []
      },
      "pt_PT-tug\xE3o-medium": {
        key: "pt_PT-tug\xE3o-medium",
        name: "tug\xE3o",
        language: {
          code: "pt_PT",
          family: "pt",
          region: "PT",
          name_native: "Portugu\xEAs",
          name_english: "Portuguese",
          country_english: "Portugal"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "pt/pt_PT/tug\xE3o/medium/pt_PT-tug\xE3o-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "0642048511ffe36c3b519520614b53f4"
          },
          "pt/pt_PT/tug\xE3o/medium/pt_PT-tug\xE3o-medium.onnx.json": {
            size_bytes: 5026,
            md5_digest: "c4113a1da477aa6db28420454c142ebd"
          },
          "pt/pt_PT/tug\xE3o/medium/MODEL_CARD": {
            size_bytes: 281,
            md5_digest: "fcaafaf8d265f5a5b8e83df547f49bfd"
          }
        },
        aliases: []
      },
      "ro_RO-mihai-medium": {
        key: "ro_RO-mihai-medium",
        name: "mihai",
        language: {
          code: "ro_RO",
          family: "ro",
          region: "RO",
          name_native: "Rom\xE2n\u0103",
          name_english: "Romanian",
          country_english: "Romania"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "ro/ro_RO/mihai/medium/ro_RO-mihai-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "45f4253916c93d3d05ad3fe1b07ea4f3"
          },
          "ro/ro_RO/mihai/medium/ro_RO-mihai-medium.onnx.json": {
            size_bytes: 4877,
            md5_digest: "f820f8ba65a8646c68792be581b85144"
          },
          "ro/ro_RO/mihai/medium/MODEL_CARD": {
            size_bytes: 277,
            md5_digest: "4075864685b207c9a98bf1af237a1502"
          }
        },
        aliases: []
      },
      "ru_RU-denis-medium": {
        key: "ru_RU-denis-medium",
        name: "denis",
        language: {
          code: "ru_RU",
          family: "ru",
          region: "RU",
          name_native: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
          name_english: "Russian",
          country_english: "Russia"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "ru/ru_RU/denis/medium/ru_RU-denis-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "76c2f14e521fef3ed574f97ad492728e"
          },
          "ru/ru_RU/denis/medium/ru_RU-denis-medium.onnx.json": {
            size_bytes: 4823,
            md5_digest: "e3df5957c07647cab05cf9910ef3ede0"
          },
          "ru/ru_RU/denis/medium/MODEL_CARD": {
            size_bytes: 275,
            md5_digest: "6fe09e0e097e4538809cc420653974e4"
          }
        },
        aliases: []
      },
      "ru_RU-dmitri-medium": {
        key: "ru_RU-dmitri-medium",
        name: "dmitri",
        language: {
          code: "ru_RU",
          family: "ru",
          region: "RU",
          name_native: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
          name_english: "Russian",
          country_english: "Russia"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "ru/ru_RU/dmitri/medium/ru_RU-dmitri-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "589ccc91745a1e2353508ff62c5941b7"
          },
          "ru/ru_RU/dmitri/medium/ru_RU-dmitri-medium.onnx.json": {
            size_bytes: 4824,
            md5_digest: "4eaf0d090190ecb8d958d40c76fd85e8"
          },
          "ru/ru_RU/dmitri/medium/MODEL_CARD": {
            size_bytes: 276,
            md5_digest: "c19f9eff768d0c0e1f476a4c6ca1ff1e"
          }
        },
        aliases: []
      },
      "ru_RU-irina-medium": {
        key: "ru_RU-irina-medium",
        name: "irina",
        language: {
          code: "ru_RU",
          family: "ru",
          region: "RU",
          name_native: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
          name_english: "Russian",
          country_english: "Russia"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "ru/ru_RU/irina/medium/ru_RU-irina-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "21fbe77fdc68bdc35d7adb6bf4f52199"
          },
          "ru/ru_RU/irina/medium/ru_RU-irina-medium.onnx.json": {
            size_bytes: 4765,
            md5_digest: "e239bb7f22d5de4a44ec6b1cb6c06bb5"
          },
          "ru/ru_RU/irina/medium/MODEL_CARD": {
            size_bytes: 271,
            md5_digest: "397e67453b4ea5a95642673d0debb5ba"
          }
        },
        aliases: [
          "ru-irinia-medium"
        ]
      },
      "ru_RU-ruslan-medium": {
        key: "ru_RU-ruslan-medium",
        name: "ruslan",
        language: {
          code: "ru_RU",
          family: "ru",
          region: "RU",
          name_native: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
          name_english: "Russian",
          country_english: "Russia"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "ru/ru_RU/ruslan/medium/ru_RU-ruslan-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "731eb188e63b4c57320e38047ba2d850"
          },
          "ru/ru_RU/ruslan/medium/ru_RU-ruslan-medium.onnx.json": {
            size_bytes: 4882,
            md5_digest: "ae6e273bd38d6ecb05c2d1969b24db0c"
          },
          "ru/ru_RU/ruslan/medium/MODEL_CARD": {
            size_bytes: 313,
            md5_digest: "7b50a255192cc1c44358d7cb20ddbb5c"
          }
        },
        aliases: []
      },
      "sk_SK-lili-medium": {
        key: "sk_SK-lili-medium",
        name: "lili",
        language: {
          code: "sk_SK",
          family: "sk",
          region: "SK",
          name_native: "Sloven\u010Dina",
          name_english: "Slovak",
          country_english: "Slovakia"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "sk/sk_SK/lili/medium/sk_SK-lili-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "836e078518042448bda8416a8ea52984"
          },
          "sk/sk_SK/lili/medium/sk_SK-lili-medium.onnx.json": {
            size_bytes: 4963,
            md5_digest: "e49cbd13cb5ce5b8f7e1c1479ec2cc91"
          },
          "sk/sk_SK/lili/medium/MODEL_CARD": {
            size_bytes: 275,
            md5_digest: "101dc437bf775a45dd6eedb14d9cfb4e"
          }
        },
        aliases: []
      },
      "sl_SI-artur-medium": {
        key: "sl_SI-artur-medium",
        name: "artur",
        language: {
          code: "sl_SI",
          family: "sl",
          region: "SI",
          name_native: "Sloven\u0161\u010Dina",
          name_english: "Slovenian",
          country_english: "Slovenia"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "sl/sl_SI/artur/medium/sl_SI-artur-medium.onnx": {
            size_bytes: 63200492,
            md5_digest: "ca0aac61139e446bebf98561e8cf9407"
          },
          "sl/sl_SI/artur/medium/sl_SI-artur-medium.onnx.json": {
            size_bytes: 4970,
            md5_digest: "8683796803bce4e9131eec00a93251ad"
          },
          "sl/sl_SI/artur/medium/MODEL_CARD": {
            size_bytes: 329,
            md5_digest: "c7547b0d2c97f38dcbb231c5e77c75c9"
          }
        },
        aliases: []
      },
      "sr_RS-serbski_institut-medium": {
        key: "sr_RS-serbski_institut-medium",
        name: "serbski_institut",
        language: {
          code: "sr_RS",
          family: "sr",
          region: "RS",
          name_native: "srpski",
          name_english: "Serbian",
          country_english: "Serbia"
        },
        quality: "medium",
        num_speakers: 2,
        speaker_id_map: {
          dsb: 0,
          hsb: 1
        },
        files: {
          "sr/sr_RS/serbski_institut/medium/sr_RS-serbski_institut-medium.onnx": {
            size_bytes: 76733615,
            md5_digest: "02c6e27ac7b4dfa84272df89edca9feb"
          },
          "sr/sr_RS/serbski_institut/medium/sr_RS-serbski_institut-medium.onnx.json": {
            size_bytes: 4999,
            md5_digest: "dacee7595352af9b4d78bb42237bd759"
          },
          "sr/sr_RS/serbski_institut/medium/MODEL_CARD": {
            size_bytes: 343,
            md5_digest: "407a5b8ebef4877405de2e89eb806633"
          }
        },
        aliases: []
      },
      "sv_SE-nst-medium": {
        key: "sv_SE-nst-medium",
        name: "nst",
        language: {
          code: "sv_SE",
          family: "sv",
          region: "SE",
          name_native: "Svenska",
          name_english: "Swedish",
          country_english: "Sweden"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "sv/sv_SE/nst/medium/sv_SE-nst-medium.onnx": {
            size_bytes: 63104526,
            md5_digest: "20266cf58e93ca2140444b77398aea04"
          },
          "sv/sv_SE/nst/medium/sv_SE-nst-medium.onnx.json": {
            size_bytes: 4157,
            md5_digest: "3a95d9b88bb3214bf4d0d7fcf8a1aea9"
          },
          "sv/sv_SE/nst/medium/MODEL_CARD": {
            size_bytes: 306,
            md5_digest: "4a7cdb8f218a909b2b5e81d1903628da"
          }
        },
        aliases: []
      },
      "sw_CD-lanfrica-medium": {
        key: "sw_CD-lanfrica-medium",
        name: "lanfrica",
        language: {
          code: "sw_CD",
          family: "sw",
          region: "CD",
          name_native: "Kiswahili",
          name_english: "Swahili",
          country_english: "Democratic Republic of the Congo"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "sw/sw_CD/lanfrica/medium/sw_CD-lanfrica-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "7b28078f0e76cb201dc8b512ea4bf4d6"
          },
          "sw/sw_CD/lanfrica/medium/sw_CD-lanfrica-medium.onnx.json": {
            size_bytes: 4905,
            md5_digest: "fee67ee6bbb0ad9d9376b0d1cf2923d1"
          },
          "sw/sw_CD/lanfrica/medium/MODEL_CARD": {
            size_bytes: 315,
            md5_digest: "225cc22fc4a35a83f2039988499baa85"
          }
        },
        aliases: []
      },
      "tr_TR-dfki-medium": {
        key: "tr_TR-dfki-medium",
        name: "dfki",
        language: {
          code: "tr_TR",
          family: "tr",
          region: "TR",
          name_native: "T\xFCrk\xE7e",
          name_english: "Turkish",
          country_english: "Turkey"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "tr/tr_TR/dfki/medium/tr_TR-dfki-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "f51287b350a042dd8d67b2b215145e5a"
          },
          "tr/tr_TR/dfki/medium/tr_TR-dfki-medium.onnx.json": {
            size_bytes: 4960,
            md5_digest: "683c97d5bf7588abb4d7b9ff556c9466"
          },
          "tr/tr_TR/dfki/medium/MODEL_CARD": {
            size_bytes: 319,
            md5_digest: "870d6bc19719328699449cb7b4dd56cf"
          }
        },
        aliases: []
      },
      "tr_TR-fahrettin-medium": {
        key: "tr_TR-fahrettin-medium",
        name: "fahrettin",
        language: {
          code: "tr_TR",
          family: "tr",
          region: "TR",
          name_native: "T\xFCrk\xE7e",
          name_english: "Turkish",
          country_english: "Turkey"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "tr/tr_TR/fahrettin/medium/tr_TR-fahrettin-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "3ab8730ec3a132c79c74a45c451372f8"
          },
          "tr/tr_TR/fahrettin/medium/tr_TR-fahrettin-medium.onnx.json": {
            size_bytes: 5022,
            md5_digest: "38b7beb509cb459da3c8f95841a59435"
          },
          "tr/tr_TR/fahrettin/medium/MODEL_CARD": {
            size_bytes: 279,
            md5_digest: "f0fe18e5a6b7615d59a89dfe4873247f"
          }
        },
        aliases: []
      },
      "tr_TR-fettah-medium": {
        key: "tr_TR-fettah-medium",
        name: "fettah",
        language: {
          code: "tr_TR",
          family: "tr",
          region: "TR",
          name_native: "T\xFCrk\xE7e",
          name_english: "Turkish",
          country_english: "Turkey"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "tr/tr_TR/fettah/medium/tr_TR-fettah-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "596984449bd075fc18e6412c66ed99c2"
          },
          "tr/tr_TR/fettah/medium/tr_TR-fettah-medium.onnx.json": {
            size_bytes: 4877,
            md5_digest: "583aa5f4bfac5237afb1cdbdf5bfc992"
          },
          "tr/tr_TR/fettah/medium/MODEL_CARD": {
            size_bytes: 276,
            md5_digest: "9c51c87dc191bd556c0634793c233d5c"
          }
        },
        aliases: []
      },
      "uk_UA-lada-x_low": {
        key: "uk_UA-lada-x_low",
        name: "lada",
        language: {
          code: "uk_UA",
          family: "uk",
          region: "UA",
          name_native: "\u0443\u043A\u0440\u0430\u0457\u0301\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0301\u0432\u0430",
          name_english: "Ukrainian",
          country_english: "Ukraine"
        },
        quality: "x_low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "uk/uk_UA/lada/x_low/uk_UA-lada-x_low.onnx": {
            size_bytes: 20628813,
            md5_digest: "b84110e3923d64cdd4e0056a22090557"
          },
          "uk/uk_UA/lada/x_low/uk_UA-lada-x_low.onnx.json": {
            size_bytes: 4186,
            md5_digest: "c447c945fa6abcde575333fa479e005d"
          },
          "uk/uk_UA/lada/x_low/MODEL_CARD": {
            size_bytes: 267,
            md5_digest: "8de03ca7a0aee2a1c088638ec18fdb87"
          }
        },
        aliases: [
          "uk-lada-x-low"
        ]
      },
      "uk_UA-ukrainian_tts-medium": {
        key: "uk_UA-ukrainian_tts-medium",
        name: "ukrainian_tts",
        language: {
          code: "uk_UA",
          family: "uk",
          region: "UA",
          name_native: "\u0443\u043A\u0440\u0430\u0457\u0301\u043D\u0441\u044C\u043A\u0430 \u043C\u043E\u0301\u0432\u0430",
          name_english: "Ukrainian",
          country_english: "Ukraine"
        },
        quality: "medium",
        num_speakers: 3,
        speaker_id_map: {
          lada: 0,
          mykyta: 1,
          tetiana: 2
        },
        files: {
          "uk/uk_UA/ukrainian_tts/medium/uk_UA-ukrainian_tts-medium.onnx": {
            size_bytes: 76735663,
            md5_digest: "3366c3d4f31cb77966fb14d042956b4f"
          },
          "uk/uk_UA/ukrainian_tts/medium/uk_UA-ukrainian_tts-medium.onnx.json": {
            size_bytes: 2002,
            md5_digest: "3bf9b2b1fcc8e599947cdda4af130498"
          },
          "uk/uk_UA/ukrainian_tts/medium/MODEL_CARD": {
            size_bytes: 266,
            md5_digest: "d615c1c54d0017f4eb42c95dabc5573b"
          }
        },
        aliases: []
      },
      "vi_VN-25hours_single-low": {
        key: "vi_VN-25hours_single-low",
        name: "25hours_single",
        language: {
          code: "vi_VN",
          family: "vi",
          region: "VN",
          name_native: "Ti\u1EBFng Vi\u1EC7t",
          name_english: "Vietnamese",
          country_english: "Vietnam"
        },
        quality: "low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "vi/vi_VN/25hours_single/low/vi_VN-25hours_single-low.onnx": {
            size_bytes: 63104526,
            md5_digest: "54ff8fb35b0084336377ddd10717e1fa"
          },
          "vi/vi_VN/25hours_single/low/vi_VN-25hours_single-low.onnx.json": {
            size_bytes: 4176,
            md5_digest: "d626bc458e9eb1a12650709bfc89d4a2"
          },
          "vi/vi_VN/25hours_single/low/MODEL_CARD": {
            size_bytes: 343,
            md5_digest: "25eb4744418cd7b8da0a9096dcfa6e61"
          }
        },
        aliases: [
          "vi-25hours-single-low"
        ]
      },
      "vi_VN-vais1000-medium": {
        key: "vi_VN-vais1000-medium",
        name: "vais1000",
        language: {
          code: "vi_VN",
          family: "vi",
          region: "VN",
          name_native: "Ti\u1EBFng Vi\u1EC7t",
          name_english: "Vietnamese",
          country_english: "Vietnam"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "vi/vi_VN/vais1000/medium/vi_VN-vais1000-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "5e42428c4f6131f75557cf156c9c1526"
          },
          "vi/vi_VN/vais1000/medium/vi_VN-vais1000-medium.onnx.json": {
            size_bytes: 4860,
            md5_digest: "5ec9669253541d64ba97f60e422f1ad0"
          },
          "vi/vi_VN/vais1000/medium/MODEL_CARD": {
            size_bytes: 361,
            md5_digest: "1beeecba9042e5925b0c5fbd138c779d"
          }
        },
        aliases: []
      },
      "vi_VN-vivos-x_low": {
        key: "vi_VN-vivos-x_low",
        name: "vivos",
        language: {
          code: "vi_VN",
          family: "vi",
          region: "VN",
          name_native: "Ti\u1EBFng Vi\u1EC7t",
          name_english: "Vietnamese",
          country_english: "Vietnam"
        },
        quality: "x_low",
        num_speakers: 65,
        speaker_id_map: {
          VIVOSSPK13: 0,
          VIVOSSPK14: 1,
          VIVOSSPK15: 2,
          VIVOSSPK16: 3,
          VIVOSSPK17: 4,
          VIVOSSPK18: 5,
          VIVOSSPK19: 6,
          VIVOSSPK20: 7,
          VIVOSSPK21: 8,
          VIVOSSPK22: 9,
          VIVOSSPK26: 10,
          VIVOSSPK34: 11,
          VIVOSSPK40: 12,
          VIVOSSPK41: 13,
          VIVOSSPK42: 14,
          VIVOSSPK43: 15,
          VIVOSSPK44: 16,
          VIVOSSPK45: 17,
          VIVOSSPK46: 18,
          VIVOSSPK38: 19,
          VIVOSSPK31: 20,
          VIVOSSPK35: 21,
          VIVOSSPK01: 22,
          VIVOSSPK02: 23,
          VIVOSSPK03: 24,
          VIVOSSPK04: 25,
          VIVOSSPK05: 26,
          VIVOSSPK06: 27,
          VIVOSSPK07: 28,
          VIVOSSPK08: 29,
          VIVOSSPK09: 30,
          VIVOSSPK10: 31,
          VIVOSSPK11: 32,
          VIVOSSPK12: 33,
          VIVOSSPK27: 34,
          VIVOSSPK36: 35,
          VIVOSSPK33: 36,
          VIVOSSPK32: 37,
          VIVOSSPK29: 38,
          VIVOSSPK39: 39,
          VIVOSSPK25: 40,
          VIVOSSPK28: 41,
          VIVOSSPK30: 42,
          VIVOSSPK37: 43,
          VIVOSSPK23: 44,
          VIVOSSPK24: 45,
          VIVOSDEV02: 46,
          VIVOSDEV03: 47,
          VIVOSDEV01: 48,
          VIVOSDEV04: 49,
          VIVOSDEV05: 50,
          VIVOSDEV06: 51,
          VIVOSDEV07: 52,
          VIVOSDEV08: 53,
          VIVOSDEV09: 54,
          VIVOSDEV10: 55,
          VIVOSDEV11: 56,
          VIVOSDEV12: 57,
          VIVOSDEV13: 58,
          VIVOSDEV14: 59,
          VIVOSDEV15: 60,
          VIVOSDEV16: 61,
          VIVOSDEV17: 62,
          VIVOSDEV18: 63,
          VIVOSDEV19: 64
        },
        files: {
          "vi/vi_VN/vivos/x_low/vi_VN-vivos-x_low.onnx": {
            size_bytes: 27789413,
            md5_digest: "d5880d32e340f57489dcb9d4f1f7aa04"
          },
          "vi/vi_VN/vivos/x_low/vi_VN-vivos-x_low.onnx.json": {
            size_bytes: 5592,
            md5_digest: "708356072a75e33cff652f1b5d455795"
          },
          "vi/vi_VN/vivos/x_low/MODEL_CARD": {
            size_bytes: 272,
            md5_digest: "6bd1265a94a8f6bcce74a5b1145a7f95"
          }
        },
        aliases: [
          "vi-vivos-x-low"
        ]
      },
      "zh_CN-huayan-medium": {
        key: "zh_CN-huayan-medium",
        name: "huayan",
        language: {
          code: "zh_CN",
          family: "zh",
          region: "CN",
          name_native: "\u7B80\u4F53\u4E2D\u6587",
          name_english: "Chinese",
          country_english: "China"
        },
        quality: "medium",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "zh/zh_CN/huayan/medium/zh_CN-huayan-medium.onnx": {
            size_bytes: 63201294,
            md5_digest: "40cdb7930ff91b81574d5f0489e076ea"
          },
          "zh/zh_CN/huayan/medium/zh_CN-huayan-medium.onnx.json": {
            size_bytes: 4822,
            md5_digest: "1fda3ec1d0d3a5a74064397ea8fe0af0"
          },
          "zh/zh_CN/huayan/medium/MODEL_CARD": {
            size_bytes: 276,
            md5_digest: "b23255ace0cda4c2e02134d8a70c2e03"
          }
        },
        aliases: []
      },
      "zh_CN-huayan-x_low": {
        key: "zh_CN-huayan-x_low",
        name: "huayan",
        language: {
          code: "zh_CN",
          family: "zh",
          region: "CN",
          name_native: "\u7B80\u4F53\u4E2D\u6587",
          name_english: "Chinese",
          country_english: "China"
        },
        quality: "x_low",
        num_speakers: 1,
        speaker_id_map: {},
        files: {
          "zh/zh_CN/huayan/x_low/zh_CN-huayan-x_low.onnx": {
            size_bytes: 20628813,
            md5_digest: "2b96570db6becd09814a608c8d14a64f"
          },
          "zh/zh_CN/huayan/x_low/zh_CN-huayan-x_low.onnx.json": {
            size_bytes: 4164,
            md5_digest: "39efce50e05f04893ae656f9008698f7"
          },
          "zh/zh_CN/huayan/x_low/MODEL_CARD": {
            size_bytes: 237,
            md5_digest: "715587a977945498c5741b74eb81a1fd"
          }
        },
        aliases: [
          "zh-cn-huayan-x-low"
        ]
      }
    };
  }
});

// vendor/piper/piper-tts-web.js
var __defProp2 = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _createPiperPhonemize;
var _modelConfig;
var _ort;
var _ortSession;
var _progressCallback;
var _wasmPaths;
var _logger;
var _TtsSession_instances;
var predictChunk_fn;
var HF_BASE = "https://huggingface.co/diffusionstudio/piper-voices/resolve/main";
var ONNX_BASE = new URL("./", import.meta.url).href;
var WASM_BASE = new URL("./piper_phonemize", import.meta.url).href;
var PATH_MAP = {
  "ar_JO-kareem-low": "ar/ar_JO/kareem/low/ar_JO-kareem-low.onnx",
  "ar_JO-kareem-medium": "ar/ar_JO/kareem/medium/ar_JO-kareem-medium.onnx",
  "ca_ES-upc_ona-medium": "ca/ca_ES/upc_ona/medium/ca_ES-upc_ona-medium.onnx",
  "ca_ES-upc_ona-x_low": "ca/ca_ES/upc_ona/x_low/ca_ES-upc_ona-x_low.onnx",
  "ca_ES-upc_pau-x_low": "ca/ca_ES/upc_pau/x_low/ca_ES-upc_pau-x_low.onnx",
  "cs_CZ-jirka-low": "cs/cs_CZ/jirka/low/cs_CZ-jirka-low.onnx",
  "cs_CZ-jirka-medium": "cs/cs_CZ/jirka/medium/cs_CZ-jirka-medium.onnx",
  "da_DK-talesyntese-medium": "da/da_DK/talesyntese/medium/da_DK-talesyntese-medium.onnx",
  "de_DE-eva_k-x_low": "de/de_DE/eva_k/x_low/de_DE-eva_k-x_low.onnx",
  "de_DE-karlsson-low": "de/de_DE/karlsson/low/de_DE-karlsson-low.onnx",
  "de_DE-kerstin-low": "de/de_DE/kerstin/low/de_DE-kerstin-low.onnx",
  "de_DE-mls-medium": "de/de_DE/mls/medium/de_DE-mls-medium.onnx",
  "de_DE-pavoque-low": "de/de_DE/pavoque/low/de_DE-pavoque-low.onnx",
  "de_DE-ramona-low": "de/de_DE/ramona/low/de_DE-ramona-low.onnx",
  "de_DE-thorsten-high": "de/de_DE/thorsten/high/de_DE-thorsten-high.onnx",
  "de_DE-thorsten-low": "de/de_DE/thorsten/low/de_DE-thorsten-low.onnx",
  "de_DE-thorsten-medium": "de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx",
  "de_DE-thorsten_emotional-medium": "de/de_DE/thorsten_emotional/medium/de_DE-thorsten_emotional-medium.onnx",
  "el_GR-rapunzelina-low": "el/el_GR/rapunzelina/low/el_GR-rapunzelina-low.onnx",
  "en_GB-alan-low": "en/en_GB/alan/low/en_GB-alan-low.onnx",
  "en_GB-alan-medium": "en/en_GB/alan/medium/en_GB-alan-medium.onnx",
  "en_GB-alba-medium": "en/en_GB/alba/medium/en_GB-alba-medium.onnx",
  "en_GB-aru-medium": "en/en_GB/aru/medium/en_GB-aru-medium.onnx",
  "en_GB-cori-high": "en/en_GB/cori/high/en_GB-cori-high.onnx",
  "en_GB-cori-medium": "en/en_GB/cori/medium/en_GB-cori-medium.onnx",
  "en_GB-jenny_dioco-medium": "en/en_GB/jenny_dioco/medium/en_GB-jenny_dioco-medium.onnx",
  "en_GB-northern_english_male-medium": "en/en_GB/northern_english_male/medium/en_GB-northern_english_male-medium.onnx",
  "en_GB-semaine-medium": "en/en_GB/semaine/medium/en_GB-semaine-medium.onnx",
  "en_GB-southern_english_female-low": "en/en_GB/southern_english_female/low/en_GB-southern_english_female-low.onnx",
  "en_GB-vctk-medium": "en/en_GB/vctk/medium/en_GB-vctk-medium.onnx",
  "en_US-amy-low": "en/en_US/amy/low/en_US-amy-low.onnx",
  "en_US-amy-medium": "en/en_US/amy/medium/en_US-amy-medium.onnx",
  "en_US-arctic-medium": "en/en_US/arctic/medium/en_US-arctic-medium.onnx",
  "en_US-danny-low": "en/en_US/danny/low/en_US-danny-low.onnx",
  "en_US-hfc_female-medium": "en/en_US/hfc_female/medium/en_US-hfc_female-medium.onnx",
  "en_US-hfc_male-medium": "en/en_US/hfc_male/medium/en_US-hfc_male-medium.onnx",
  "en_US-joe-medium": "en/en_US/joe/medium/en_US-joe-medium.onnx",
  "en_US-kathleen-low": "en/en_US/kathleen/low/en_US-kathleen-low.onnx",
  "en_US-kristin-medium": "en/en_US/kristin/medium/en_US-kristin-medium.onnx",
  "en_US-kusal-medium": "en/en_US/kusal/medium/en_US-kusal-medium.onnx",
  "en_US-l2arctic-medium": "en/en_US/l2arctic/medium/en_US-l2arctic-medium.onnx",
  "en_US-lessac-high": "en/en_US/lessac/high/en_US-lessac-high.onnx",
  "en_US-lessac-low": "en/en_US/lessac/low/en_US-lessac-low.onnx",
  "en_US-lessac-medium": "en/en_US/lessac/medium/en_US-lessac-medium.onnx",
  "en_US-libritts-high": "en/en_US/libritts/high/en_US-libritts-high.onnx",
  "en_US-libritts_r-medium": "en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx",
  "en_US-ljspeech-high": "en/en_US/ljspeech/high/en_US-ljspeech-high.onnx",
  "en_US-ljspeech-medium": "en/en_US/ljspeech/medium/en_US-ljspeech-medium.onnx",
  "en_US-ryan-high": "en/en_US/ryan/high/en_US-ryan-high.onnx",
  "en_US-ryan-low": "en/en_US/ryan/low/en_US-ryan-low.onnx",
  "en_US-ryan-medium": "en/en_US/ryan/medium/en_US-ryan-medium.onnx",
  "es_ES-carlfm-x_low": "es/es_ES/carlfm/x_low/es_ES-carlfm-x_low.onnx",
  "es_ES-davefx-medium": "es/es_ES/davefx/medium/es_ES-davefx-medium.onnx",
  "es_ES-mls_10246-low": "es/es_ES/mls_10246/low/es_ES-mls_10246-low.onnx",
  "es_ES-mls_9972-low": "es/es_ES/mls_9972/low/es_ES-mls_9972-low.onnx",
  "es_ES-sharvard-medium": "es/es_ES/sharvard/medium/es_ES-sharvard-medium.onnx",
  "es_MX-ald-medium": "es/es_MX/ald/medium/es_MX-ald-medium.onnx",
  "es_MX-claude-high": "es/es_MX/claude/high/es_MX-claude-high.onnx",
  "fa_IR-amir-medium": "fa/fa_IR/amir/medium/fa_IR-amir-medium.onnx",
  "fa_IR-gyro-medium": "fa/fa_IR/gyro/medium/fa_IR-gyro-medium.onnx",
  "fi_FI-harri-low": "fi/fi_FI/harri/low/fi_FI-harri-low.onnx",
  "fi_FI-harri-medium": "fi/fi_FI/harri/medium/fi_FI-harri-medium.onnx",
  "fr_FR-gilles-low": "fr/fr_FR/gilles/low/fr_FR-gilles-low.onnx",
  "fr_FR-mls-medium": "fr/fr_FR/mls/medium/fr_FR-mls-medium.onnx",
  "fr_FR-mls_1840-low": "fr/fr_FR/mls_1840/low/fr_FR-mls_1840-low.onnx",
  "fr_FR-siwis-low": "fr/fr_FR/siwis/low/fr_FR-siwis-low.onnx",
  "fr_FR-siwis-medium": "fr/fr_FR/siwis/medium/fr_FR-siwis-medium.onnx",
  "fr_FR-tom-medium": "fr/fr_FR/tom/medium/fr_FR-tom-medium.onnx",
  "fr_FR-upmc-medium": "fr/fr_FR/upmc/medium/fr_FR-upmc-medium.onnx",
  "hu_HU-anna-medium": "hu/hu_HU/anna/medium/hu_HU-anna-medium.onnx",
  "hu_HU-berta-medium": "hu/hu_HU/berta/medium/hu_HU-berta-medium.onnx",
  "hu_HU-imre-medium": "hu/hu_HU/imre/medium/hu_HU-imre-medium.onnx",
  "is_IS-bui-medium": "is/is_IS/bui/medium/is_IS-bui-medium.onnx",
  "is_IS-salka-medium": "is/is_IS/salka/medium/is_IS-salka-medium.onnx",
  "is_IS-steinn-medium": "is/is_IS/steinn/medium/is_IS-steinn-medium.onnx",
  "is_IS-ugla-medium": "is/is_IS/ugla/medium/is_IS-ugla-medium.onnx",
  "it_IT-riccardo-x_low": "it/it_IT/riccardo/x_low/it_IT-riccardo-x_low.onnx",
  "ka_GE-natia-medium": "ka/ka_GE/natia/medium/ka_GE-natia-medium.onnx",
  "kk_KZ-iseke-x_low": "kk/kk_KZ/iseke/x_low/kk_KZ-iseke-x_low.onnx",
  "kk_KZ-issai-high": "kk/kk_KZ/issai/high/kk_KZ-issai-high.onnx",
  "kk_KZ-raya-x_low": "kk/kk_KZ/raya/x_low/kk_KZ-raya-x_low.onnx",
  "lb_LU-marylux-medium": "lb/lb_LU/marylux/medium/lb_LU-marylux-medium.onnx",
  "ne_NP-google-medium": "ne/ne_NP/google/medium/ne_NP-google-medium.onnx",
  "ne_NP-google-x_low": "ne/ne_NP/google/x_low/ne_NP-google-x_low.onnx",
  "nl_BE-nathalie-medium": "nl/nl_BE/nathalie/medium/nl_BE-nathalie-medium.onnx",
  "nl_BE-nathalie-x_low": "nl/nl_BE/nathalie/x_low/nl_BE-nathalie-x_low.onnx",
  "nl_BE-rdh-medium": "nl/nl_BE/rdh/medium/nl_BE-rdh-medium.onnx",
  "nl_BE-rdh-x_low": "nl/nl_BE/rdh/x_low/nl_BE-rdh-x_low.onnx",
  "nl_NL-mls-medium": "nl/nl_NL/mls/medium/nl_NL-mls-medium.onnx",
  "nl_NL-mls_5809-low": "nl/nl_NL/mls_5809/low/nl_NL-mls_5809-low.onnx",
  "nl_NL-mls_7432-low": "nl/nl_NL/mls_7432/low/nl_NL-mls_7432-low.onnx",
  "no_NO-talesyntese-medium": "no/no_NO/talesyntese/medium/no_NO-talesyntese-medium.onnx",
  "pl_PL-darkman-medium": "pl/pl_PL/darkman/medium/pl_PL-darkman-medium.onnx",
  "pl_PL-gosia-medium": "pl/pl_PL/gosia/medium/pl_PL-gosia-medium.onnx",
  "pl_PL-mc_speech-medium": "pl/pl_PL/mc_speech/medium/pl_PL-mc_speech-medium.onnx",
  "pl_PL-mls_6892-low": "pl/pl_PL/mls_6892/low/pl_PL-mls_6892-low.onnx",
  "pt_BR-edresson-low": "pt/pt_BR/edresson/low/pt_BR-edresson-low.onnx",
  "pt_BR-faber-medium": "pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx",
  "pt_PT-tug\xE3o-medium": "pt/pt_PT/tug\xE3o/medium/pt_PT-tug\xE3o-medium.onnx",
  "ro_RO-mihai-medium": "ro/ro_RO/mihai/medium/ro_RO-mihai-medium.onnx",
  "ru_RU-denis-medium": "ru/ru_RU/denis/medium/ru_RU-denis-medium.onnx",
  "ru_RU-dmitri-medium": "ru/ru_RU/dmitri/medium/ru_RU-dmitri-medium.onnx",
  "ru_RU-irina-medium": "ru/ru_RU/irina/medium/ru_RU-irina-medium.onnx",
  "ru_RU-ruslan-medium": "ru/ru_RU/ruslan/medium/ru_RU-ruslan-medium.onnx",
  "sk_SK-lili-medium": "sk/sk_SK/lili/medium/sk_SK-lili-medium.onnx",
  "sl_SI-artur-medium": "sl/sl_SI/artur/medium/sl_SI-artur-medium.onnx",
  "sr_RS-serbski_institut-medium": "sr/sr_RS/serbski_institut/medium/sr_RS-serbski_institut-medium.onnx",
  "sv_SE-nst-medium": "sv/sv_SE/nst/medium/sv_SE-nst-medium.onnx",
  "sw_CD-lanfrica-medium": "sw/sw_CD/lanfrica/medium/sw_CD-lanfrica-medium.onnx",
  "tr_TR-dfki-medium": "tr/tr_TR/dfki/medium/tr_TR-dfki-medium.onnx",
  "tr_TR-fahrettin-medium": "tr/tr_TR/fahrettin/medium/tr_TR-fahrettin-medium.onnx",
  "tr_TR-fettah-medium": "tr/tr_TR/fettah/medium/tr_TR-fettah-medium.onnx",
  "uk_UA-lada-x_low": "uk/uk_UA/lada/x_low/uk_UA-lada-x_low.onnx",
  "uk_UA-ukrainian_tts-medium": "uk/uk_UA/ukrainian_tts/medium/uk_UA-ukrainian_tts-medium.onnx",
  "vi_VN-25hours_single-low": "vi/vi_VN/25hours_single/low/vi_VN-25hours_single-low.onnx",
  "vi_VN-vais1000-medium": "vi/vi_VN/vais1000/medium/vi_VN-vais1000-medium.onnx",
  "vi_VN-vivos-x_low": "vi/vi_VN/vivos/x_low/vi_VN-vivos-x_low.onnx",
  "zh_CN-huayan-medium": "zh/zh_CN/huayan/medium/zh_CN-huayan-medium.onnx",
  "zh_CN-huayan-x_low": "zh/zh_CN/huayan/x_low/zh_CN-huayan-x_low.onnx",
  // Added by Mintplex Labs - missing or new.
  "cy_GB-gwryw_gogleddol-medium": "cy/cy_GB/gwryw_gogleddol/medium/cy_GB-gwryw_gogleddol-medium.onnx",
  "en_US-bryce-medium": "en/en_US/bryce/medium/en_US-bryce-medium.onnx",
  "en_US-john-medium": "en/en_US/john/medium/en_US-john-medium.onnx",
  "en_US-norman-medium": "en/en_US/norman/medium/en_US-norman-medium.onnx",
  "it_IT-paola-medium": "it/it_IT/paola/medium/it_IT-paola-medium.onnx"
};
async function writeBlob(url, blob) {
  if (!url.match("https://huggingface.co")) return;
  try {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle("piper", {
      create: true
    });
    const path = url.split("/").at(-1);
    const file = await dir.getFileHandle(path, { create: true });
    const writable = await file.createWritable();
    await writable.write(blob);
    await writable.close();
  } catch (e) {
    console.error(e);
  }
}
async function removeBlob(url) {
  try {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle("piper");
    const path = url.split("/").at(-1);
    const file = await dir.getFileHandle(path);
    await file.remove();
  } catch (e) {
    console.error(e);
  }
}
async function readBlob(url) {
  if (!url.match("https://huggingface.co")) return;
  try {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle("piper", {
      create: true
    });
    const path = url.split("/").at(-1);
    const file = await dir.getFileHandle(path);
    return await file.getFile();
  } catch (e) {
    return void 0;
  }
}
async function fetchBlob(url, callback) {
  var _a;
  const res = await fetch(url);
  const reader = (_a = res.body) == null ? void 0 : _a.getReader();
  const contentLength = +(res.headers.get("Content-Length") ?? 0);
  let receivedLength = 0;
  let chunks = [];
  while (reader) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    receivedLength += value.length;
    callback == null ? void 0 : callback({
      url,
      total: contentLength,
      loaded: receivedLength
    });
  }
  return new Blob(chunks, { type: res.headers.get("Content-Type") ?? void 0 });
}
function pcm2wav(buffer, numChannels, sampleRate) {
  const bufferLength = buffer.length;
  const headerLength = 44;
  const view = new DataView(new ArrayBuffer(bufferLength * numChannels * 2 + headerLength));
  view.setUint32(0, 1179011410, true);
  view.setUint32(4, view.buffer.byteLength - 8, true);
  view.setUint32(8, 1163280727, true);
  view.setUint32(12, 544501094, true);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, numChannels * 2 * sampleRate, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 1635017060, true);
  view.setUint32(40, 2 * bufferLength, true);
  let p = headerLength;
  for (let i = 0; i < bufferLength; i++) {
    const v = buffer[i];
    if (v >= 1)
      view.setInt16(p, 32767, true);
    else if (v <= -1)
      view.setInt16(p, -32768, true);
    else
      view.setInt16(p, v * 32768 | 0, true);
    p += 2;
  }
  return view.buffer;
}
var DEFAULT_WASM_PATHS = {
  onnxWasm: ONNX_BASE,
  piperData: `${WASM_BASE}.data`,
  piperWasm: `${WASM_BASE}.wasm`
};
var _TtsSession = class _TtsSession2 {
  constructor({
    voiceId,
    progress,
    logger,
    wasmPaths
  }) {
    __privateAdd(this, _TtsSession_instances);
    __publicField(this, "ready", false);
    __publicField(this, "voiceId", "en_US-hfc_female-medium");
    __publicField(this, "waitReady", false);
    __privateAdd(this, _createPiperPhonemize);
    __privateAdd(this, _modelConfig);
    __privateAdd(this, _ort);
    __privateAdd(this, _ortSession);
    __privateAdd(this, _progressCallback);
    __privateAdd(this, _wasmPaths, DEFAULT_WASM_PATHS);
    __privateAdd(this, _logger);
    var _a;
    if (_TtsSession2._instance) {
      logger == null ? void 0 : logger("Reusing session for TTS!");
      _TtsSession2._instance.voiceId = voiceId ?? _TtsSession2._instance.voiceId;
      __privateSet(_TtsSession2._instance, _progressCallback, progress ?? __privateGet(_TtsSession2._instance, _progressCallback));
      return _TtsSession2._instance;
    }
    logger == null ? void 0 : logger("New session");
    __privateSet(this, _logger, logger);
    this.voiceId = voiceId;
    __privateSet(this, _progressCallback, progress);
    this.waitReady = this.init();
    __privateSet(this, _wasmPaths, wasmPaths ?? DEFAULT_WASM_PATHS);
    (_a = __privateGet(this, _logger)) == null ? void 0 : _a.call(this, `Loaded WASMPaths at: ${JSON.stringify(__privateGet(this, _wasmPaths))}`);
    _TtsSession2._instance = this;
    return this;
  }
  static async create(options) {
    const session = new _TtsSession2(options);
    await session.waitReady;
    return session;
  }
  async init() {
    var _a, _b;
    const { createPiperPhonemize: createPiperPhonemize2 } = await Promise.resolve().then(() => (init_piper_o91UDS6e(), piper_o91UDS6e_exports));
    __privateSet(this, _createPiperPhonemize, createPiperPhonemize2);
    const ortModule = await Promise.resolve().then(() => (init_ort_wasm_esm_min(), ort_wasm_esm_min_exports));
    const ort = ortModule.default || ortModule;
    __privateSet(this, _ort, ort);
    (_b = __privateGet(this, _logger)) == null ? void 0 : _b.call(
      this,
      `piper-tts-web@1.0.5: onnxruntime-web loaded (env: ${!!ort.env}, wasm: ${!!((_a = ort.env) == null ? void 0 : _a.wasm)})`
    );
    if (ort.env) {
      if ("allowLocalModels" in ort.env) ort.env.allowLocalModels = true;
      if (ort.env.wasm) {
        ort.env.wasm.numThreads = 1;
        ort.env.wasm.wasmPaths = __privateGet(this, _wasmPaths).onnxWasm;
      }
    }
    const path = PATH_MAP[this.voiceId];
    const modelConfigBlob = await getBlob(`${HF_BASE}/${path}.json`);
    __privateSet(this, _modelConfig, JSON.parse(await modelConfigBlob.text()));
    const modelBlob = await getBlob(
      `${HF_BASE}/${path}`,
      __privateGet(this, _progressCallback)
    );
    __privateSet(this, _ortSession, await ort.InferenceSession.create(
      await modelBlob.arrayBuffer(),
      { executionProviders: ["wasm"] }
    ));
  }
  async predict(text) {
    var _a, _b, _c, _d, _e2;
    await this.waitReady;
    const sampleRate = __privateGet(this, _modelConfig).audio.sample_rate;
    const chunks = splitIntoChunks(text);
    if (chunks.length === 0) throw new Error("No text to predict on.");
    if (chunks.length > 1)
      (_a = __privateGet(this, _logger)) == null ? void 0 : _a.call(this, `Long text - splitting into ${chunks.length} chunks for inference.`);
    const pcms = [];
    for (let i = 0; i < chunks.length; i++) {
      if (chunks.length > 1) {
        (_b = __privateGet(this, _logger)) == null ? void 0 : _b.call(
          this,
          `TTS inference: chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)...`
        );
        (_c = __privateGet(this, _progressCallback)) == null ? void 0 : _c.call(this, {
          url: INFERENCE_PROGRESS_URL,
          loaded: i,
          total: chunks.length
        });
      }
      pcms.push(await __privateMethod(this, _TtsSession_instances, predictChunk_fn).call(this, chunks[i]));
    }
    if (chunks.length > 1) {
      (_d = __privateGet(this, _logger)) == null ? void 0 : _d.call(this, "TTS inference: all chunks complete.");
      (_e2 = __privateGet(this, _progressCallback)) == null ? void 0 : _e2.call(this, {
        url: INFERENCE_PROGRESS_URL,
        loaded: chunks.length,
        total: chunks.length
      });
    }
    const totalLength = pcms.reduce((sum, pcm) => sum + pcm.length, 0);
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const pcm of pcms) {
      merged.set(pcm, offset);
      offset += pcm.length;
    }
    return new Blob([pcm2wav(merged, 1, sampleRate)], {
      type: "audio/x-wav"
    });
  }
};
_createPiperPhonemize = /* @__PURE__ */ new WeakMap();
_modelConfig = /* @__PURE__ */ new WeakMap();
_ort = /* @__PURE__ */ new WeakMap();
_ortSession = /* @__PURE__ */ new WeakMap();
_progressCallback = /* @__PURE__ */ new WeakMap();
_wasmPaths = /* @__PURE__ */ new WeakMap();
_logger = /* @__PURE__ */ new WeakMap();
_TtsSession_instances = /* @__PURE__ */ new WeakSet();
predictChunk_fn = async function(text) {
  const input = JSON.stringify([{ text: text.trim() }]);
  const phonemeIds = await new Promise(async (resolve) => {
    const module = await __privateGet(this, _createPiperPhonemize).call(this, {
      print: (data) => {
        resolve(JSON.parse(data).phoneme_ids);
      },
      printErr: (message) => {
        throw new Error(message);
      },
      locateFile: (url) => {
        if (url.endsWith(".wasm")) return __privateGet(this, _wasmPaths).piperWasm;
        if (url.endsWith(".data")) return __privateGet(this, _wasmPaths).piperData;
        return url;
      }
    });
    module.callMain([
      "-l",
      __privateGet(this, _modelConfig).espeak.voice,
      "--input",
      input,
      "--espeak_data",
      "/espeak-ng-data"
    ]);
  });
  const speakerId = 0;
  const noiseScale = __privateGet(this, _modelConfig).inference.noise_scale;
  const lengthScale = __privateGet(this, _modelConfig).inference.length_scale;
  const noiseW = __privateGet(this, _modelConfig).inference.noise_w;
  const session = __privateGet(this, _ortSession);
  const feeds = {
    input: new (__privateGet(this, _ort)).Tensor("int64", phonemeIds, [1, phonemeIds.length]),
    input_lengths: new (__privateGet(this, _ort)).Tensor("int64", [phonemeIds.length]),
    scales: new (__privateGet(this, _ort)).Tensor("float32", [
      noiseScale,
      lengthScale,
      noiseW
    ])
  };
  if (Object.keys(__privateGet(this, _modelConfig).speaker_id_map).length) {
    Object.assign(feeds, {
      sid: new (__privateGet(this, _ort)).Tensor("int64", [speakerId])
    });
  }
  const {
    output: { data: pcm }
  } = await session.run(feeds);
  return pcm;
};
__publicField(_TtsSession, "WASM_LOCATIONS", DEFAULT_WASM_PATHS);
__publicField(_TtsSession, "_instance", null);
var TtsSession = _TtsSession;
var INFERENCE_PROGRESS_URL = "tts://inference-progress";
var MAX_CHUNK_LENGTH = 400;
function splitIntoChunks(text, maxLength = MAX_CHUNK_LENGTH) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length <= maxLength) return [trimmed];
  const sentences = trimmed.match(/[^.!?…\n]+[.!?…]*\s*/g) ?? [trimmed];
  const chunks = [];
  let current = "";
  const pushCurrent = () => {
    const c = current.trim();
    if (c) chunks.push(c);
    current = "";
  };
  for (const sentence of sentences) {
    if ((current + sentence).length > maxLength) pushCurrent();
    if (sentence.length > maxLength) {
      let piece = "";
      for (const word of sentence.split(/\s+/)) {
        if ((piece + " " + word).trim().length > maxLength) {
          const p = piece.trim();
          if (p) chunks.push(p);
          piece = word;
        } else {
          piece = piece ? `${piece} ${word}` : word;
        }
      }
      current = piece;
    } else {
      current += sentence;
    }
  }
  pushCurrent();
  return chunks;
}
async function getBlob(url, callback) {
  let blob = await readBlob(url);
  if (!blob) {
    blob = await fetchBlob(url, callback);
    await writeBlob(url, blob);
  }
  return blob;
}
async function download(voiceId, callback) {
  const path = PATH_MAP[voiceId];
  const urls = [`${HF_BASE}/${path}`, `${HF_BASE}/${path}.json`];
  await Promise.all(urls.map(async (url) => {
    writeBlob(url, await fetchBlob(url, url.endsWith(".onnx") ? callback : void 0));
  }));
}
async function remove(voiceId) {
  const path = PATH_MAP[voiceId];
  const urls = [`${HF_BASE}/${path}`, `${HF_BASE}/${path}.json`];
  await Promise.all(urls.map((url) => removeBlob(url)));
}
async function stored() {
  const root = await navigator.storage.getDirectory();
  const dir = await root.getDirectoryHandle("piper", {
    create: true
  });
  const result = [];
  for await (const name of dir.keys()) {
    const key = name.split(".")[0];
    if (name.endsWith(".onnx") && key in PATH_MAP) {
      result.push(key);
    }
  }
  return result;
}
async function flush() {
  try {
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle("piper");
    await dir.remove({ recursive: true });
  } catch (e) {
    console.error(e);
  }
}
async function voices() {
  try {
    const res = await fetch(`${HF_BASE}/voices.json`);
    if (!res.ok) throw new Error("Could not retrieve voices file from huggingface");
    return Object.values(await res.json());
  } catch {
    const LOCAL_VOICES_JSON = await Promise.resolve().then(() => (init_voices_static_D_OtJDHM(), voices_static_D_OtJDHM_exports));
    console.log(`Could not fetch voices.json remote ${HF_BASE}. Fetching local`);
    return Object.values(LOCAL_VOICES_JSON.default);
  }
}

// vendor/piper/piper-entry.js
var BASE = new URL("./", import.meta.url).href;
var DEFAULT_WASM = {
  onnxWasm: BASE,
  piperData: BASE + "piper_phonemize.data",
  piperWasm: BASE + "piper_phonemize.wasm"
};
async function predict(config, callback) {
  const voiceId = config.voiceId || config.voice || "en_US-amy-low";
  const session = await TtsSession.create({
    voiceId,
    progress: callback,
    wasmPaths: config.wasmPaths || DEFAULT_WASM,
    logger: config.logger
  });
  return session.predict(config.text);
}
async function download2(voiceId, callback) {
  return download(voiceId, callback);
}
var api = {
  predict,
  download: download2,
  remove,
  flush,
  stored,
  voices,
  TtsSession,
  DEFAULT_WASM,
  HF_BASE: "https://huggingface.co/rhasspy/piper-voices/resolve/main"
};
var piper_entry_default = api;
if (typeof window !== "undefined") {
  window.FocusPiper = api;
}
export {
  piper_entry_default as default,
  download2 as download,
  predict
};
/*!
 * ONNX Runtime Web v1.18.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
