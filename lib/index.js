'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this2 = this;

require('colors');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _unitex = require('unitex');

var _unitex2 = _interopRequireDefault(_unitex);

var _nico = require('./nico');

var _nico2 = _interopRequireDefault(_nico);

var _metagen = require('./metagen');

var _metagen2 = _interopRequireDefault(_metagen);

var _logger = require('./logger');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var id = process.argv[2] || process.exit();

var datafmt = _unitex2['default'].formatter({ unit: 'B', base: 1024, atomic: true });
var ratefmt = _unitex2['default'].formatter({ unit: 'B/s', base: 1024, atomic: true });
var timefmt = _unitex2['default'].formatter({ unit: 's' });

var time = function time() {
	return process.hrtime()[0];
};

void (function callee$0$0() {
	return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
		var _this = this;

		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.prev = 0;
				context$1$0.next = 3;
				return _regeneratorRuntime.awrap((function callee$1$0() {
					var dldir, dirp, loginp, metap, flvp, meta, _ref, url, down;

					return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
						while (1) switch (context$2$0.prev = context$2$0.next) {
							case 0:
								dldir = _path2['default'].join('.', _config2['default'].dl, id);
								dirp = new _Promise(function (res, rej) {
									_fsExtra2['default'].mkdirp(dldir, function (err) {
										if (err) {
											return rej(err);
										}
										res();
									});
								});
								loginp = _nico2['default'].login({
									mail_tel: _config2['default'].email,
									password: _config2['default'].password
								});

								(0, _logger.log)('Logging In');
								context$2$0.next = 6;
								return _regeneratorRuntime.awrap(loginp);

							case 6:
								metap = _nico2['default'].meta(id);
								flvp = _nico2['default'].flv(id);

								(0, _logger.log)('Fetching Metadata');
								context$2$0.next = 11;
								return _regeneratorRuntime.awrap(metap);

							case 11:
								meta = context$2$0.sent;

								(0, _logger.log)('Writing Metafile');
								_fsExtra2['default'].writeFileSync(_path2['default'].join(dldir, 'meta'), (0, _metagen2['default'])({
									id: meta.video_id,
									uploader: meta.user_nickname,
									uploaderid: meta.user_id,
									title: meta.title,
									desc: meta.description
								}));

								(0, _logger.log)('Fetching Video URL');
								context$2$0.next = 17;
								return _regeneratorRuntime.awrap(flvp);

							case 17:
								_ref = context$2$0.sent;
								url = _ref.url;

								if (/low/.test(url)) {
									(0, _logger.warn)('Low Quality');
								}

								(0, _logger.log)('Requesting Video', url);
								context$2$0.next = 23;
								return _regeneratorRuntime.awrap(dirp);

							case 23:
								context$2$0.next = 25;
								return _regeneratorRuntime.awrap(_nico2['default'].r.get(url));

							case 25:
								down = context$2$0.sent;
								context$2$0.next = 28;
								return _regeneratorRuntime.awrap(new _Promise(function (resolve) {
									down.on('response', function (res) {
										var size = res.headers['content-length'];
										(0, _logger.log)('Downloading Video', datafmt(size));

										down.pipe(_fsExtra2['default'].createWriteStream(_path2['default'].join(dldir, id + '.mp4')));

										var stdout = process.stdout;
										var start = time();
										var processed = 0;
										var buffered = 0;

										var logStatus = function logStatus() {
											processed += buffered;
											var line = (processed / size * 100).toFixed(2) + '%\t' + (datafmt(processed) + '\t') + (ratefmt(buffered) + '\t') + (timefmt(time() - start) + '\t') + ('ETA ' + timefmt((size - processed) * (time() - start) / processed));
											buffered = 0;
											stdout.clearLine();
											stdout.cursorTo(0);
											stdout.write(line.cyan);
										};
										logStatus();
										var logger = setInterval(logStatus, 1000);

										down.on('data', function (data) {
											buffered += data.length;
										}).on('end', function () {
											logStatus();
											clearInterval(logger);
											console.log();
											resolve();
										});
									});
								}));

							case 28:
								(0, _logger.log)('Finished');

							case 29:
							case 'end':
								return context$2$0.stop();
						}
					}, null, _this);
				})());

			case 3:
				context$1$0.next = 8;
				break;

			case 5:
				context$1$0.prev = 5;
				context$1$0.t0 = context$1$0['catch'](0);

				(0, _logger.warn)(context$1$0.t0);

			case 8:
			case 'end':
				return context$1$0.stop();
		}
	}, null, _this2, [[0, 5]]);
})();