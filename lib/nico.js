'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _this = this;

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _xml2js = require('xml2js');

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _he = require('he');

var _he2 = _interopRequireDefault(_he);

var xmlToJson = function xmlToJson(xml) {
	return _regeneratorRuntime.async(function xmlToJson$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return _regeneratorRuntime.awrap(new _bluebird2['default'](function (res, rej) {
					return (0, _xml2js.parseString)(xml, function (err, json) {
						return err ? rej(err) : res(json);
					});
				}));

			case 2:
				return context$1$0.abrupt('return', context$1$0.sent);

			case 3:
			case 'end':
				return context$1$0.stop();
		}
	}, null, _this);
};

var r = _bluebird2['default'].promisifyAll(_request2['default'].defaults({ jar: true }));

var login = function login(o) {
	return r.postAsync('https://secure.nicovideo.jp/secure/login', { form: o });
};

var flv = function flv(id) {
	var _ref, _ref2, body;

	return _regeneratorRuntime.async(function flv$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return _regeneratorRuntime.awrap(r.getAsync('http://flapi.nicovideo.jp/api/getflv/' + id));

			case 2:
				_ref = context$1$0.sent;
				_ref2 = _slicedToArray(_ref, 1);
				body = _ref2[0].body;
				return context$1$0.abrupt('return', _querystring2['default'].parse(body));

			case 6:
			case 'end':
				return context$1$0.stop();
		}
	}, null, _this);
};

var info = function info(id) {
	var _ref3, _ref32, body;

	return _regeneratorRuntime.async(function info$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return _regeneratorRuntime.awrap(r.getAsync('http://ext.nicovideo.jp/api/getthumbinfo/' + id));

			case 2:
				_ref3 = context$1$0.sent;
				_ref32 = _slicedToArray(_ref3, 1);
				body = _ref32[0].body;
				context$1$0.next = 7;
				return _regeneratorRuntime.awrap(xmlToJson(body));

			case 7:
				return context$1$0.abrupt('return', context$1$0.sent.nicovideo_thumb_response.thumb[0]);

			case 8:
			case 'end':
				return context$1$0.stop();
		}
	}, null, _this);
};

var video = function video(id) {
	var _ref4, _ref42, body;

	return _regeneratorRuntime.async(function video$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return _regeneratorRuntime.awrap(r.getAsync('http://www.nicovideo.jp/watch/' + id));

			case 2:
				_ref4 = context$1$0.sent;
				_ref42 = _slicedToArray(_ref4, 1);
				body = _ref42[0].body;
				return context$1$0.abrupt('return', body);

			case 6:
			case 'end':
				return context$1$0.stop();
		}
	}, null, _this);
};

var decodeDesc = function decodeDesc(html) {
	return _he2['default'].decode(html.replace(/\<br\s*\/?\>/g, '\n').replace(/\<.*?\>/g, ''));
};

var meta = function meta(id) {
	var _ref5, _ref52, v, i, $, el;

	return _regeneratorRuntime.async(function meta$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return _regeneratorRuntime.awrap(_bluebird2['default'].all([video(id), info(id)]));

			case 2:
				_ref5 = context$1$0.sent;
				_ref52 = _slicedToArray(_ref5, 2);
				v = _ref52[0];
				i = _ref52[1];
				$ = _cheerio2['default'].load(v);
				el = $('#topVideoInfo > p.videoDescription.description');

				i.description = decodeDesc(el.html());
				return context$1$0.abrupt('return', i);

			case 10:
			case 'end':
				return context$1$0.stop();
		}
	}, null, _this);
};

exports['default'] = {
	login: login,
	flv: flv,
	info: info,
	video: video,
	meta: meta,
	r: r
};
module.exports = exports['default'];