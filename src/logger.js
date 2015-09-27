export let log = async (mes, extra) => {
	let line = `${ mes }.`.magenta;
	if (extra) {
		line += ` (${ extra.yellow })`;
	}
	console.log(line);
};

export let warn = async mes => {
	console.log(`${ mes }.`.yellow);
};
