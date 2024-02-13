import { Quantity, Unit } from "@/scheme";

const timeUnits = {
	day: 86400,
	hour: 3600,
	minute: 60,
};

function formatTime(quantity: Quantity): string {
	let seconds = quantity.to("second").getValue();
	let result = "";

	if (seconds >= timeUnits.day) {
		const days = Math.floor(seconds / timeUnits.day);
		result += `${days} d `;
		seconds %= timeUnits.day;
	}

	if (seconds >= timeUnits.hour) {
		const hours = Math.floor(seconds / timeUnits.hour);
		result += `${hours} h `;
		seconds %= timeUnits.hour;
	}

	if (seconds >= timeUnits.minute) {
		const minutes = Math.floor(seconds / timeUnits.minute);
		result += `${minutes} m `;
		seconds %= timeUnits.minute;
	}

	if (seconds > 0) result += `${seconds} s`;

	return result.trim();
}

export function formatQuantity(
	quantity: Quantity,
	{
		simplify = { prefixMin: 1, prefixMax: 100 },
		format = { precision: 2 },
	}: {
		simplify?: Parameters<Unit["simplify"]>[0];
		format?: Parameters<Unit["toString"]>[0];
	} = {},
) {
	const dimensions = Object.keys(quantity?.dimension ?? {});

	if (dimensions.includes("TIME")) {
		return formatTime(quantity);
	}

	return quantity?.simplify(simplify)?.toString(format);
}
