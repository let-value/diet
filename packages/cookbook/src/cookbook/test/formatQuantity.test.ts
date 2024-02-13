import { describe, test, expect } from "bun:test";

import { unit } from "@/scheme";

import { formatQuantity } from "../formatQuantity";

describe("formatQuantity", () => {
	test("gram", () => {
		expect(formatQuantity(unit("1g"))).toEqual("1 g");
		expect(formatQuantity(unit("10g"))).toEqual("10 g");
		expect(formatQuantity(unit("100g"))).toEqual("100 g");
		expect(formatQuantity(unit("1000g"))).toEqual("1 kg");
		expect(formatQuantity(unit("5000g"))).toEqual("5 kg");
		expect(formatQuantity(unit("5500g"))).toEqual("5.5 kg");
		expect(formatQuantity(unit("10000g"))).toEqual("10 kg");
		expect(formatQuantity(unit("100000g"))).toEqual("100 kg");
	});

	test("time", () => {
		expect(formatQuantity(unit("1s"))).toEqual("1 s");
		expect(formatQuantity(unit("10s"))).toEqual("10 s");
		expect(formatQuantity(unit("1min"))).toEqual("1 m");
		expect(formatQuantity(unit("120s"))).toEqual("2 m");
		expect(formatQuantity(unit("140s"))).toEqual("2 m 20 s");
		expect(formatQuantity(unit("10min"))).toEqual("10 m");
		expect(formatQuantity(unit("3600s"))).toEqual("1 h");
		expect(formatQuantity(unit("3720s"))).toEqual("1 h 2 m");
		expect(formatQuantity(unit("1day"))).toEqual("1 d");
		expect(formatQuantity(unit("90000s"))).toEqual("1 d 1 h");
		expect(formatQuantity(unit("90001s"))).toEqual("1 d 1 h 1 s");
	});

	test("temperature", () => {
		expect(formatQuantity(unit("0degC"))).toEqual("0 degC");
		expect(formatQuantity(unit("100degC"))).toEqual("100 degC");
		expect(formatQuantity(unit("0degF"))).toEqual("0 degF");
		expect(formatQuantity(unit("100degF"))).toEqual("100 degF");
	});

	test("spoons", () => {
		expect(formatQuantity(unit("1tsp"))).toEqual("1 tsp");
		expect(formatQuantity(unit("10tsp"))).toEqual("10 tsp");
		expect(formatQuantity(unit("1tbsp"))).toEqual("1 tbsp");
		expect(formatQuantity(unit("10tbsp"))).toEqual("10 tbsp");

		expect(formatQuantity(unit("1tsp").to("ml"))).toEqual("4.9 ml");
		expect(formatQuantity(unit("15tsp").to("tbsp"))).toEqual("5 tbsp");
		expect(formatQuantity(unit("1tbsp").to("ml"))).toEqual("15 ml");
		expect(formatQuantity(unit("15tbsp").to("tsp"))).toEqual("45 tsp");
	});
});
