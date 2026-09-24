/**
 * FocusLibrary — Drive "Focus Reader Books" folder + public-domain pack.
 * Classic script; depends on RecentStore, FocusSync (optional), ORP.
 */
(function (global) {
  'use strict';

  var LS_FOLDER = 'focusReader.libraryFolderName';
  var DEFAULT_FOLDER = 'Focus Reader Books';
  var DRIVE_API = 'https://www.googleapis.com/drive/v3/files';

  function folderName() {
    try {
      return localStorage.getItem(LS_FOLDER) || DEFAULT_FOLDER;
    } catch (e) {
      return DEFAULT_FOLDER;
    }
  }

  function setFolderName(name) {
    var n = (name || DEFAULT_FOLDER).trim() || DEFAULT_FOLDER;
    try { localStorage.setItem(LS_FOLDER, n); } catch (e) {}
    return n;
  }

  function getToken() {
    if (!global.FocusSync) return null;
    var st = FocusSync.getStatus && FocusSync.getStatus();
    // FocusSync keeps token private — expose via helper if present
    if (FocusSync._getAccessToken) return FocusSync._getAccessToken();
    return null;
  }

  function authFetch(url, opts) {
    opts = opts || {};
    return Promise.resolve(getToken()).then(function (token) {
      if (!token) throw new Error('not connected');
      var headers = Object.assign({}, opts.headers || {}, {
        Authorization: 'Bearer ' + token
      });
      return fetch(url, Object.assign({}, opts, { headers: headers })).then(function (r) {
        if (r.status === 401) {
          var err = new Error('unauthorized');
          err.code = 401;
          throw err;
        }
        return r;
      });
    });
  }

  function findLibraryFolder() {
    var name = folderName().replace(/'/g, "\\'");
    var q = encodeURIComponent(
      "name='" + name + "' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    );
    var url = DRIVE_API + '?q=' + q + '&fields=files(id,name,webViewLink)&pageSize=10';
    return authFetch(url).then(function (r) {
      if (!r.ok) throw new Error('folder search failed');
      return r.json();
    }).then(function (data) {
      var files = data.files || [];
      return files[0] || null;
    });
  }

  function listFolderFiles(folderId) {
    var q = encodeURIComponent("'" + folderId + "' in parents and trashed=false");
    var url = DRIVE_API + '?q=' + q +
      '&fields=files(id,name,mimeType,size,modifiedTime)&pageSize=200&orderBy=name';
    return authFetch(url).then(function (r) {
      if (!r.ok) throw new Error('list failed');
      return r.json();
    }).then(function (data) {
      var files = data.files || [];
      return files.filter(function (f) {
        var n = (f.name || '').toLowerCase();
        var m = f.mimeType || '';
        return (
          n.endsWith('.txt') || n.endsWith('.md') || n.endsWith('.pdf') ||
          m === 'text/plain' || m === 'text/markdown' || m === 'application/pdf' ||
          m === 'application/vnd.google-apps.document'
        );
      });
    });
  }

  function downloadDriveFile(file) {
    if (file.mimeType === 'application/vnd.google-apps.document') {
      var exp = DRIVE_API + '/' + encodeURIComponent(file.id) + '/export?mimeType=text/plain';
      return authFetch(exp).then(function (r) {
        if (!r.ok) throw new Error('export failed');
        return r.text();
      });
    }
    if ((file.mimeType || '').indexOf('pdf') !== -1 || /\.pdf$/i.test(file.name || '')) {
      var media = DRIVE_API + '/' + encodeURIComponent(file.id) + '?alt=media';
      return authFetch(media).then(function (r) {
        if (!r.ok) throw new Error('pdf download failed');
        return r.arrayBuffer();
      }).then(function (buf) {
        return extractPdf(buf);
      });
    }
    var url = DRIVE_API + '/' + encodeURIComponent(file.id) + '?alt=media';
    return authFetch(url).then(function (r) {
      if (!r.ok) throw new Error('download failed');
      return r.text();
    });
  }

  function extractPdf(arrayBuffer) {
    if (typeof pdfjsLib === 'undefined') return Promise.reject(new Error('pdf.js missing'));
    var isHttp = location.protocol === 'http:' || location.protocol === 'https:';
    if (isHttp) pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';
    else if (typeof __PDFJS_WORKER_BLOB_URL__ !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = __PDFJS_WORKER_BLOB_URL__;
    }
    return pdfjsLib.getDocument({ data: arrayBuffer }).promise.then(function (doc) {
      var parts = [];
      var i = 1;
      function next() {
        if (i > doc.numPages) return parts.join('\n\n');
        return doc.getPage(i++).then(function (page) {
          return page.getTextContent().then(function (content) {
            parts.push(content.items.map(function (it) { return it.str; }).join(' '));
            return next();
          });
        });
      }
      return next();
    });
  }

  function loadPublicManifest() {
    return fetch('library-seed/manifest.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('manifest missing');
      return r.json();
    });
  }

  function loadPublicBook(fileName) {
    return fetch('library-seed/' + encodeURIComponent(fileName)).then(function (r) {
      if (!r.ok) throw new Error('book missing');
      return r.text();
    });
  }

  function formatSize(n) {
    n = Number(n) || 0;
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(0) + ' KB';
    return (n / (1024 * 1024)).toFixed(1) + ' MB';
  }

  global.FocusLibrary = {
    DEFAULT_FOLDER: DEFAULT_FOLDER,
    folderName: folderName,
    setFolderName: setFolderName,
    findLibraryFolder: findLibraryFolder,
    listFolderFiles: listFolderFiles,
    downloadDriveFile: downloadDriveFile,
    loadPublicManifest: loadPublicManifest,
    loadPublicBook: loadPublicBook,
    formatSize: formatSize
  };
})(typeof window !== 'undefined' ? window : globalThis);
