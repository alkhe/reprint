import qs from 'querystring';

import Promise from 'bluebird';
import request from 'request';
import { parseString } from 'xml2js';

let xml = async xml =>
	await new Promise((res, rej) => {
		parseString(xml, (err, json) => {
			if (err) {
				return rej(err);
			}
			res(json);
		});
	});

let r = Promise.promisifyAll(request.defaults({ jar: true }));

let login = o => r.postAsync('https://secure.nicovideo.jp/secure/login', { form: o });

let flv = async id => {
	let [{ body }] = await r.getAsync(`http://flapi.nicovideo.jp/api/getflv/${id}`);
	return qs.parse(body);
};

let info = async id => {
	let [{ body }] = await r.getAsync(`http://ext.nicovideo.jp/api/getthumbinfo/${id}`);
	return (await xml(body)).nicovideo_thumb_response.thumb[0];
};

let video = async id => {
	let [{ body }] = await r.getAsync(`http://www.nicovideo.jp/watch/${id}`);
	return body;
};

export default {
	login,
	flv,
	info,
	video,
	r
};
