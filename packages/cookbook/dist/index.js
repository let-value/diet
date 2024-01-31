var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// /home/alex/diet/node_modules/unitmath/dist/UnitMath.js
var require_UnitMath = __commonJS((exports, module) => {
  (function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.UnitMath = factory());
  })(exports, function() {
    const ignoredCharacters = " \t()*";
    function createParser(options, findUnit) {
      let text, index, c;
      function skipIgnored() {
        while (c && ignoredCharacters.includes(c)) {
          next();
        }
      }
      function isDigitDot(c2) {
        return c2 >= "0" && c2 <= "9" || c2 === ".";
      }
      function isDigit(c2) {
        return c2 >= "0" && c2 <= "9";
      }
      function next() {
        index++;
        c = text.charAt(index);
      }
      function revert(oldIndex) {
        index = oldIndex;
        c = text.charAt(index);
      }
      function parseNonFinite() {
        const nonFiniteStrings = ["NaN", "Infinity", "-Infinity"];
        for (let nonFiniteString of nonFiniteStrings) {
          if (text.substr(index, nonFiniteString.length) === nonFiniteString) {
            index += nonFiniteString.length;
            c = text.charAt(index);
            return nonFiniteString;
          }
        }
        return null;
      }
      function parseNumber() {
        let number = "";
        let oldIndex;
        oldIndex = index;
        if (c === "+") {
          next();
        } else if (c === "-") {
          number += c;
          next();
        }
        if (!isDigitDot(c)) {
          revert(oldIndex);
          return null;
        }
        if (c === ".") {
          number += c;
          next();
          if (!isDigit(c)) {
            revert(oldIndex);
            return null;
          }
        } else {
          while (isDigit(c)) {
            number += c;
            next();
          }
          if (c === ".") {
            number += c;
            next();
          }
        }
        while (isDigit(c)) {
          number += c;
          next();
        }
        if (c === "E" || c === "e") {
          let tentativeNumber = "";
          const tentativeIndex = index;
          tentativeNumber += c;
          next();
          if (c === "+" || c === "-") {
            tentativeNumber += c;
            next();
          }
          if (!isDigit(c)) {
            revert(tentativeIndex);
            return number;
          }
          number = number + tentativeNumber;
          while (isDigit(c)) {
            number += c;
            next();
          }
        }
        return number;
      }
      function parseUnit() {
        let unitName = "";
        let code = text.charCodeAt(index);
        while (code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122) {
          unitName += c;
          next();
          code = text.charCodeAt(index);
        }
        code = unitName.charCodeAt(0);
        if (code >= 65 && code <= 90 || code >= 97 && code <= 122) {
          return unitName;
        } else {
          return null;
        }
      }
      function parseCharacter(toFind) {
        if (c === toFind) {
          next();
          return toFind;
        } else {
          return null;
        }
      }
      function parse(str) {
        text = str;
        index = -1;
        c = "";
        if (typeof text !== "string") {
          throw new TypeError("Invalid argument in parse, string expected");
        }
        const unit = {
          type: "Unit",
          value: null,
          unitList: [],
          dimension: {}
        };
        let powerMultiplierCurrent = 1;
        let expectingUnit = false;
        next();
        skipIgnored();
        const valueStr = parseNonFinite() || parseNumber();
        if (valueStr) {
          unit.value = options.type.conv(valueStr);
          skipIgnored();
          if (parseCharacter("/")) {
            powerMultiplierCurrent = -1;
            expectingUnit = true;
          }
        }
        while (true) {
          skipIgnored();
          let uStr;
          if (c) {
            const oldC = c;
            uStr = parseUnit();
            if (uStr === null) {
              throw new SyntaxError('Unexpected "' + oldC + '" in "' + text + '" at index ' + index.toString());
            }
          } else {
            break;
          }
          const found = findUnit(uStr);
          if (found === null) {
            throw new SyntaxError('Unit "' + uStr + '" not found.');
          }
          let power = powerMultiplierCurrent;
          skipIgnored();
          if (parseCharacter("^")) {
            skipIgnored();
            const p = parseNumber();
            if (p === null) {
              throw new SyntaxError('In "' + str + '", "^" must be followed by a floating-point number');
            }
            power *= +p;
          }
          unit.unitList.push({
            unit: found.unit,
            prefix: found.prefix,
            power
          });
          for (let dim of Object.keys(found.unit.dimension)) {
            unit.dimension[dim] = (unit.dimension[dim] || 0) + (found.unit.dimension[dim] || 0) * power;
          }
          skipIgnored();
          expectingUnit = false;
          if (parseCharacter("/")) {
            if (powerMultiplierCurrent === -1) {
              throw new SyntaxError(`Unexpected additional "/" in "${text}" at index ${index}`);
            }
            powerMultiplierCurrent = -1;
            expectingUnit = true;
          }
        }
        if (expectingUnit) {
          throw new SyntaxError('Trailing characters: "' + str + '"');
        }
        return unit;
      }
      return parse;
    }
    function normalize(unitList, value, type) {
      let unitValue, unitOffset, unitPower, unitPrefixValue;
      if (value === null || value === undefined || unitList.length === 0) {
        return value;
      } else if (isCompound(unitList)) {
        let result = value;
        for (let i = 0;i < unitList.length; i++) {
          unitValue = type.conv(unitList[i].unit.value);
          unitPrefixValue = type.conv(unitList[i].unit.prefixGroup[unitList[i].prefix]);
          unitPower = type.conv(unitList[i].power);
          result = type.mul(result, type.pow(type.mul(unitValue, unitPrefixValue), unitPower));
        }
        return result;
      } else {
        unitValue = type.conv(unitList[0].unit.value);
        unitOffset = type.conv(unitList[0].unit.offset);
        unitPrefixValue = type.conv(unitList[0].unit.prefixGroup[unitList[0].prefix]);
        return type.mul(type.add(type.mul(value, unitPrefixValue), unitOffset), unitValue);
      }
    }
    function denormalize(unitList, value, type) {
      let unitValue, unitOffset, unitPower, unitPrefixValue;
      if (value === null || value === undefined || unitList.length === 0) {
        return value;
      } else if (isCompound(unitList)) {
        let result = value;
        for (let i = 0;i < unitList.length; i++) {
          unitValue = type.conv(unitList[i].unit.value);
          unitPrefixValue = type.conv(unitList[i].unit.prefixGroup[unitList[i].prefix]);
          unitPower = type.conv(unitList[i].power);
          result = type.div(result, type.pow(type.mul(unitValue, unitPrefixValue), unitPower));
        }
        return result;
      } else {
        unitValue = type.conv(unitList[0].unit.value);
        unitPrefixValue = type.conv(unitList[0].unit.prefixGroup[unitList[0].prefix]);
        unitOffset = type.conv(unitList[0].unit.offset);
        return type.div(type.sub(type.div(value, unitValue), unitOffset), unitPrefixValue);
      }
    }
    function isCompound(unitList) {
      if (unitList.length === 0) {
        return false;
      }
      return unitList.length > 1 || Math.abs(unitList[0].power - 1) > 0.000000000000001;
    }
    function isBase(unitList) {
      return unitList.length === 1 && Math.abs(unitList[0].power - 1) < 0.000000000000001 && Object.keys(unitList[0].unit.dimension).length === 1 && unitList[0].unit.dimension[Object.keys(unitList[0].unit.dimension)[0]] === 1;
    }
    const systems = {
      si: ["m", "meter", "s", "A", "kg", "K", "mol", "rad", "b", "F", "C", "S", "V", "J", "N", "Hz", "ohm", "H", "cd", "lm", "lx", "Wb", "T", "W", "Pa", "ohm", "sr"],
      cgs: ["cm", "s", "A", "g", "K", "mol", "rad", "b", "F", "C", "S", "V", "erg", "dyn", "Hz", "ohm", "H", "cd", "lm", "lx", "Wb", "T", "Pa", "ohm", "sr"],
      us: ["ft", "mi", "mile", "in", "inch", "s", "A", "lbm", "degF", "mol", "rad", "b", "F", "C", "S", "V", "BTU", "lbf", "Hz", "ohm", "H", "cd", "lm", "lx", "Wb", "T", "psi", "ohm", "sr", "hp"]
    };
    const prefixes = {
      NONE: {
        "": 1
      },
      SHORT: {
        "": 1,
        da: 10,
        h: 100,
        k: 1000,
        M: 1e6,
        G: 1e9,
        T: 1000000000000,
        P: 1000000000000000,
        E: 1000000000000000000,
        Z: 1000000000000000000000,
        Y: 1000000000000000000000000,
        d: 0.1,
        c: 0.01,
        m: 0.001,
        u: 0.000001,
        n: 0.000000001,
        p: 0.000000000001,
        f: 0.000000000000001,
        a: 0.000000000000000001,
        z: 0.000000000000000000001,
        y: 0.000000000000000000000001
      },
      LONG: {
        "": 1,
        deca: 10,
        hecto: 100,
        kilo: 1000,
        mega: 1e6,
        giga: 1e9,
        tera: 1000000000000,
        peta: 1000000000000000,
        exa: 1000000000000000000,
        zetta: 1000000000000000000000,
        yotta: 1000000000000000000000000,
        deci: 0.1,
        centi: 0.01,
        milli: 0.001,
        micro: 0.000001,
        nano: 0.000000001,
        pico: 0.000000000001,
        femto: 0.000000000000001,
        atto: 0.000000000000000001,
        zepto: 0.000000000000000000001,
        yocto: 0.000000000000000000000001
      },
      BINARY_SHORT_SI: {
        "": 1,
        k: 1000,
        M: 1e6,
        G: 1e9,
        T: 1000000000000,
        P: 1000000000000000,
        E: 1000000000000000000,
        Z: 1000000000000000000000,
        Y: 1000000000000000000000000
      },
      BINARY_SHORT_IEC: {
        "": 1,
        Ki: 1024,
        Mi: Math.pow(1024, 2),
        Gi: Math.pow(1024, 3),
        Ti: Math.pow(1024, 4),
        Pi: Math.pow(1024, 5),
        Ei: Math.pow(1024, 6),
        Zi: Math.pow(1024, 7),
        Yi: Math.pow(1024, 8)
      },
      BINARY_LONG_SI: {
        "": 1,
        kilo: 1000,
        mega: 1e6,
        giga: 1e9,
        tera: 1000000000000,
        peta: 1000000000000000,
        exa: 1000000000000000000,
        zetta: 1000000000000000000000,
        yotta: 1000000000000000000000000
      },
      BINARY_LONG_IEC: {
        "": 1,
        kibi: 1024,
        mebi: Math.pow(1024, 2),
        gibi: Math.pow(1024, 3),
        tebi: Math.pow(1024, 4),
        pebi: Math.pow(1024, 5),
        exi: Math.pow(1024, 6),
        zebi: Math.pow(1024, 7),
        yobi: Math.pow(1024, 8)
      },
      BTU: {
        "": 1,
        MM: 1e6
      },
      SHORT_LONG: {},
      BINARY_SHORT: {},
      BINARY_LONG: {}
    };
    prefixes.SHORT_LONG = Object.assign({}, prefixes.SHORT, prefixes.LONG);
    prefixes.BINARY_SHORT = Object.assign({}, prefixes.BINARY_SHORT_SI, prefixes.BINARY_SHORT_IEC);
    prefixes.BINARY_LONG = Object.assign({}, prefixes.BINARY_LONG_SI, prefixes.BINARY_LONG_IEC);
    const units = {
      "": {
        quantity: "UNITLESS",
        value: 1
      },
      m: {
        quantity: "LENGTH",
        prefixGroup: "SHORT",
        formatPrefixes: ["n", "u", "m", "c", "", "k"],
        value: 1
      },
      meter: {
        prefixGroup: "LONG",
        formatPrefixes: ["nano", "micro", "milli", "centi", "", "kilo"],
        value: "1 m",
        aliases: ["meters"]
      },
      inch: {
        value: "0.0254 meter",
        aliases: ["inches", "in"]
      },
      foot: {
        value: "12 inch",
        aliases: ["ft", "feet"]
      },
      yard: {
        value: "3 foot",
        aliases: ["yd", "yards"]
      },
      mile: {
        value: "5280 ft",
        aliases: ["mi", "miles"]
      },
      link: {
        value: "7.92 in",
        aliases: ["li", "links"]
      },
      rod: {
        value: "25 link",
        aliases: ["rd", "rods"]
      },
      chain: {
        value: "100 link",
        aliases: ["ch", "chains"]
      },
      angstrom: {
        value: "1e-10 m",
        aliases: ["angstroms"]
      },
      mil: {
        value: "1e-3 inch"
      },
      sqin: { value: "1 in^2" },
      sqft: { value: "1 ft^2" },
      sqyd: { value: "1 yd^2" },
      sqmi: { value: "1 mi^2" },
      sqrd: { value: "1 rod^2" },
      sqch: { value: "1 chain^2" },
      sqmil: { value: "1 mil^2" },
      acre: { value: "10 chain^2" },
      hectare: { value: "1e4 m^2" },
      L: {
        prefixGroup: "SHORT",
        formatPrefixes: ["n", "u", "m", ""],
        value: "1e-3 m^3",
        aliases: ["l", "lt"]
      },
      litre: {
        prefixGroup: "LONG",
        formatPrefixes: ["nano", "micro", "milli", ""],
        value: "1 L",
        aliases: ["liter", "liters", "litres"]
      },
      cuin: { value: "1 in^3" },
      cuft: { value: "1 ft^3" },
      cuyd: { value: "1 yd^3" },
      teaspoon: {
        value: "4.92892159375 mL",
        aliases: ["teaspoons", "tsp"]
      },
      tablespoon: {
        value: "3 teaspoon",
        aliases: ["tablespoons", "tbsp"]
      },
      drop: { value: "0.05 mL" },
      gtt: { value: "0.05 mL" },
      minim: {
        value: "0.0125 teaspoon",
        aliases: ["minims"]
      },
      fluidounce: {
        value: "0.125 cups",
        aliases: ["floz", "fluidounces"]
      },
      fluiddram: {
        value: "0.125 floz",
        aliases: ["fldr", "fluiddrams"]
      },
      cc: { value: "1 cm^3" },
      cup: {
        value: "236.5882365 mL",
        aliases: ["cp", "cups"]
      },
      pint: {
        value: "2 cup",
        aliases: ["pt", "pints"]
      },
      quart: {
        value: "4 cup",
        aliases: ["qt", "quarts"]
      },
      gallon: {
        value: "16 cup",
        aliases: ["gal", "gallons"]
      },
      oilbarrel: {
        value: "42 gal",
        aliases: ["obl", "oilbarrels"]
      },
      g: {
        quantity: "MASS",
        prefixGroup: "SHORT",
        formatPrefixes: ["n", "u", "m", "", "k"],
        value: 0.001,
        basePrefix: "k"
      },
      gram: {
        prefixGroup: "LONG",
        formatPrefixes: ["nano", "micro", "milli", "", "kilo"],
        value: "1 g"
      },
      poundmass: {
        value: "0.45359237 kg",
        aliases: ["lb", "lbs", "lbm", "poundmasses"]
      },
      ton: { value: "2000 lbm" },
      tonne: {
        prefixGroup: "LONG",
        formatPrefixes: ["", "kilo", "mega", "giga"],
        value: "1000 kg"
      },
      t: {
        prefixGroup: "SHORT",
        value: "1 tonne"
      },
      grain: {
        value: "64.79891 mg",
        aliases: ["gr"]
      },
      ounce: {
        value: "0.0625 lbm",
        aliases: ["oz", "ounces"]
      },
      dram: {
        value: "0.0625 oz",
        aliases: ["dr"]
      },
      hundredweight: {
        value: "100 lbm",
        aliases: ["cwt", "hundredweights"]
      },
      stick: {
        value: "4 oz",
        aliases: ["sticks"]
      },
      stone: { value: "14 lbm" },
      s: {
        quantity: "TIME",
        prefixGroup: "SHORT",
        formatPrefixes: ["f", "p", "n", "u", "m", ""],
        value: 1,
        aliases: ["sec"]
      },
      min: {
        value: "60 s",
        aliases: ["minute", "minutes"]
      },
      h: {
        value: "60 min",
        aliases: ["hr", "hrs", "hour", "hours"]
      },
      second: {
        prefixGroup: "LONG",
        formatPrefixes: ["femto", "pico", "nano", "micro", "milli", ""],
        value: "1 s",
        aliases: ["seconds"]
      },
      day: {
        value: "24 hr",
        aliases: ["days"]
      },
      week: {
        value: "7 day",
        aliases: ["weeks"]
      },
      month: {
        value: "30.4375 day",
        aliases: ["months"]
      },
      year: {
        value: "365.25 day",
        aliases: ["years"]
      },
      decade: {
        value: "10 year",
        aliases: ["decades"]
      },
      century: {
        value: "100 year",
        aliases: ["centuries"]
      },
      millennium: {
        value: "1000 year",
        aliases: ["millennia"]
      },
      hertz: {
        prefixGroup: "LONG",
        formatPrefixes: ["", "kilo", "mega", "giga", "tera"],
        value: "1/s"
      },
      Hz: {
        prefixGroup: "SHORT",
        formatPrefixes: ["", "k", "M", "G", "T"],
        value: "1 hertz"
      },
      rad: {
        quantity: "ANGLE",
        prefixGroup: "SHORT",
        formatPrefixes: ["m", ""],
        value: 1
      },
      radian: {
        prefixGroup: "LONG",
        formatPrefixes: ["milli", ""],
        value: "1 rad",
        aliases: ["radians"]
      },
      sr: {
        quantity: "SOLID_ANGLE",
        prefixGroup: "SHORT",
        formatPrefixes: ["u", "m", ""],
        value: 1
      },
      steradian: {
        prefixGroup: "LONG",
        formatPrefixes: ["micro", "milli", ""],
        value: "1 sr",
        aliases: ["steradians"]
      },
      deg: {
        value: [Math.PI / 180, "rad"],
        aliases: ["degree", "degrees"]
      },
      grad: {
        prefixGroup: "SHORT",
        formatPrefixes: ["c"],
        value: [Math.PI / 200, "rad"]
      },
      gradian: {
        prefixGroup: "LONG",
        formatPrefixes: ["centi", ""],
        value: [Math.PI / 200, "rad"],
        aliases: ["gradians"]
      },
      cycle: {
        value: [2 * Math.PI, "rad"],
        aliases: ["cycles"]
      },
      arcmin: {
        value: "0.016666666666666666 deg",
        aliases: ["arcminute", "arcminutes"]
      },
      arcsec: {
        value: "0.016666666666666666 arcmin",
        aliases: ["arcsecond", "arcseconds"]
      },
      A: {
        quantity: "CURRENT",
        prefixGroup: "SHORT",
        formatPrefixes: ["u", "m", "", "k"],
        value: 1
      },
      ampere: {
        prefixGroup: "LONG",
        formatPrefixes: ["micro", "milli", "", "kilo"],
        value: "1 A",
        aliases: ["amperes"]
      },
      K: {
        quantity: "TEMPERATURE",
        prefixGroup: "SHORT",
        formatPrefixes: ["n", "u", "m", ""],
        value: 1
      },
      kelvin: {
        prefixGroup: "LONG",
        formatPrefixes: ["nano", "micro", "milli", ""],
        value: "1 K"
      },
      degC: {
        value: "1 K",
        offset: 273.15,
        aliases: ["celsius"]
      },
      degR: {
        value: [1 / 1.8, "K"],
        aliases: ["rankine", "R"]
      },
      degF: {
        value: "1 R",
        offset: 459.67,
        aliases: ["fahrenheit"]
      },
      mol: {
        quantity: "AMOUNT_OF_SUBSTANCE",
        prefixGroup: "SHORT",
        formatPrefixes: ["", "k"],
        value: 1
      },
      mole: {
        prefixGroup: "LONG",
        formatPrefixes: ["", "kilo"],
        value: "1 mol",
        aliases: ["moles"]
      },
      cd: {
        quantity: "LUMINOUS_INTENSITY",
        value: 1,
        prefixGroup: "SHORT",
        formatPrefixes: ["", "m"]
      },
      candela: {
        value: "1 cd",
        prefixGroup: "LONG",
        formatPrefixes: ["", "milli"]
      },
      lumen: {
        prefixGroup: "LONG",
        value: "1 cd sr",
        aliases: ["lumens"]
      },
      lm: {
        prefixGroup: "SHORT",
        value: "1 lumen"
      },
      lux: {
        prefixGroup: "LONG",
        value: "1 cd/m^2"
      },
      lx: {
        prefixGroup: "SHORT",
        value: "1 lux"
      },
      N: {
        prefixGroup: "SHORT",
        formatPrefixes: ["u", "m", "", "k", "M"],
        value: "1 kg m/s^2"
      },
      newton: {
        prefixGroup: "LONG",
        formatPrefixes: ["micro", "milli", "", "kilo", "mega"],
        value: "1 N",
        aliases: ["newtons"]
      },
      dyn: {
        prefixGroup: "SHORT",
        formatPrefixes: ["m", "k", "M"],
        value: "1 g cm/s^2"
      },
      dyne: {
        prefixGroup: "LONG",
        formatPrefixes: ["milli", "kilo", "mega"],
        value: "1 dyn"
      },
      lbf: {
        value: "4.4482216152605 N",
        aliases: ["poundforce"]
      },
      kip: {
        value: "1000 lbf",
        aliases: ["kips"]
      },
      J: {
        prefixGroup: "SHORT",
        formatPrefixes: ["m", "", "k", "M", "G"],
        value: "1 N m"
      },
      joule: {
        prefixGroup: "LONG",
        formatPrefixes: ["milli", "", "kilo", "mega", "giga"],
        value: "1 J",
        aliases: ["joules"]
      },
      erg: {
        value: "1 dyn cm"
      },
      Wh: {
        prefixGroup: "SHORT",
        formatPrefixes: ["k", "M", "G", "T"],
        value: "1 W hr"
      },
      BTU: {
        prefixGroup: "BTU",
        formatPrefixes: ["", "MM"],
        value: "1055.05585262 J",
        aliases: ["BTUs"]
      },
      eV: {
        prefixGroup: "SHORT",
        formatPrefixes: ["u", "m", "", "k", "M", "G"],
        value: "1.602176565e-19 J"
      },
      electronvolt: {
        prefixGroup: "LONG",
        formatPrefixes: ["micro", "milli", "", "kilo", "mega", "giga"],
        value: "1 eV",
        aliases: ["electronvolts"]
      },
      W: {
        prefixGroup: "SHORT",
        formatPrefixes: ["p", "n", "u", "m", "", "k", "M", "G", "T", "P"],
        value: "1 J/s"
      },
      watt: {
        prefixGroup: "LONG",
        formatPrefixes: ["pico", "nano", "micro", "milli", "", "kilo", "mega", "tera", "peta"],
        value: "1 W",
        aliases: ["watts"]
      },
      hp: { value: "550 ft lbf / s" },
      VA: {
        prefixGroup: "SHORT",
        formatPrefixes: ["", "k"],
        value: "1 W"
      },
      Pa: {
        prefixGroup: "SHORT",
        formatPrefixes: ["", "k", "M", "G"],
        value: "1 N / m^2"
      },
      psi: {
        value: "1 lbf/in^2"
      },
      atm: { value: "101325 Pa" },
      bar: {
        prefixGroup: "SHORT_LONG",
        formatPrefixes: ["m", ""],
        value: "1e5 Pa"
      },
      torr: {
        prefixGroup: "LONG",
        formatPrefixes: ["milli", ""],
        value: "133.32236842105263 Pa"
      },
      Torr: {
        prefixGroup: "SHORT",
        formatPrefixes: ["m", ""],
        value: "1 torr"
      },
      mmHg: {
        value: "133.322387415 Pa",
        aliases: ["mmhg"]
      },
      inH2O: {
        value: "249.082 Pa",
        aliases: ["inh2o", "inAq"]
      },
      C: {
        prefixGroup: "SHORT",
        formatPrefixes: ["p", "n", "u", "m", ""],
        value: "1 A s"
      },
      coulomb: {
        prefixGroup: "LONG",
        formatPrefixes: ["pico", "nano", "micro", "milli", ""],
        value: "1 C",
        aliases: ["coulombs"]
      },
      V: {
        prefixGroup: "SHORT",
        formatPrefixes: ["m", "", "k", "M"],
        value: "1 W/A"
      },
      volt: {
        prefixGroup: "LONG",
        formatPrefixes: ["milli", "", "kilo", "mega"],
        value: "1 V",
        aliases: ["volts"]
      },
      F: {
        prefixGroup: "SHORT",
        formatPrefixes: ["p", "n", "u", "m", ""],
        value: "1 C/V"
      },
      farad: {
        prefixGroup: "LONG",
        formatPrefixes: ["pico", "nano", "micro", "milli", ""],
        value: "1 F",
        aliases: ["farads"]
      },
      ohm: {
        prefixGroup: "SHORT_LONG",
        formatPrefixes: ["", "k", "M"],
        value: "1 V/A",
        aliases: ["ohms"]
      },
      H: {
        prefixGroup: "SHORT",
        formatPrefixes: ["u", "m", ""],
        value: "1 V s / A"
      },
      henry: {
        prefixGroup: "LONG",
        formatPrefixes: ["micro", "milli", ""],
        value: "1 H",
        aliases: ["henries"]
      },
      S: {
        prefixGroup: "SHORT",
        formatPrefixes: ["u", "m", ""],
        value: "1 / ohm"
      },
      siemens: {
        prefixGroup: "LONG",
        formatPrefixes: ["micro", "milli", ""],
        value: "1 S"
      },
      Wb: {
        prefixGroup: "SHORT",
        formatPrefixes: ["n", "u", "m", ""],
        value: "1 V s"
      },
      weber: {
        prefixGroup: "LONG",
        formatPrefixes: ["nano", "micro", "milli", ""],
        value: "1 Wb",
        aliases: ["webers"]
      },
      T: {
        prefixGroup: "SHORT",
        formatPrefixes: ["n", "u", "m", ""],
        value: "1 N s / C m"
      },
      tesla: {
        prefixGroup: "LONG",
        formatPrefixes: ["nano", "micro", "milli", ""],
        value: "1 T",
        aliases: ["teslas"]
      },
      b: {
        quantity: "BIT",
        prefixGroup: "BINARY_SHORT",
        value: 1
      },
      bits: {
        prefixGroup: "BINARY_LONG",
        value: "1 b",
        aliases: ["bit"]
      },
      B: {
        prefixGroup: "BINARY_SHORT",
        value: "8 b"
      },
      bytes: {
        prefixGroup: "BINARY_LONG",
        value: "1 B",
        aliases: ["byte"]
      }
    };
    function createUnitStore(options) {
      const { skipBuiltIns } = options.definitions;
      let systems$1;
      if (skipBuiltIns) {
        systems$1 = { ...options.definitions.systems };
      } else {
        systems$1 = { ...systems };
        for (let system of Object.keys(options.definitions.systems)) {
          if (systems$1.hasOwnProperty(system)) {
            systems$1[system] = [...options.definitions.systems[system], ...systems$1[system]];
          } else {
            systems$1[system] = [...options.definitions.systems[system]];
          }
        }
      }
      const originalDefinitions = {
        systems: systems$1,
        prefixGroups: {
          ...skipBuiltIns ? {} : prefixes,
          ...options.definitions.prefixGroups
        },
        units: {
          ...skipBuiltIns ? {} : units,
          ...options.definitions.units
        }
      };
      const defs = {
        units: {},
        prefixGroups: { ...originalDefinitions.prefixGroups },
        systems: {}
      };
      const parser = createParser(options, findUnit);
      while (true) {
        let unitsAdded = 0;
        let unitsSkipped = [];
        let reasonsSkipped = [];
        for (const unitDefKey of Object.keys(originalDefinitions.units)) {
          if (defs.units.hasOwnProperty(unitDefKey))
            continue;
          const unitDef = originalDefinitions.units[unitDefKey];
          if (!unitDef)
            continue;
          if (typeof unitDef !== "string" && unitDef.prefixGroup && !defs.prefixGroups.hasOwnProperty(unitDef.prefixGroup)) {
            throw new Error(`Unknown prefixes '${unitDef.prefixGroup}' for unit '${unitDefKey}'`);
          }
          let unitValue;
          let unitDimension;
          let unitQuantity;
          let skipThisUnit = false;
          if (isUnitPropsWithQuantity(unitDef)) {
            unitValue = options.type.conv(unitDef.value);
            unitDimension = { [unitDef.quantity]: 1 };
            unitQuantity = unitDef.quantity;
          } else {
            let parsed;
            try {
              if (unitDef.hasOwnProperty("value")) {
                if (unitDef && typeof unitDef.value === "string") {
                  parsed = parser(unitDef.value);
                } else if (Array.isArray(unitDef.value) && unitDef.value.length === 2) {
                  parsed = parser(unitDef.value[1]);
                  parsed.value = options.type.conv(unitDef.value[0]);
                } else {
                  throw new TypeError(`Unit definition for '${unitDefKey}' must be an object with a value property where the value is a string or a two-element array.`);
                }
              } else {
                throw new TypeError(`Unit definition for '${unitDefKey}' must be an object with a value property where the value is a string or a two-element array.`);
              }
              if (parsed.value == null) {
                throw new Error(`Parsing value for '${unitDefKey}' resulted in invalid value: ${parsed.value}`);
              }
              unitValue = normalize(parsed.unitList, parsed.value, options.type);
              unitDimension = Object.freeze(parsed.dimension);
            } catch (ex) {
              if (ex instanceof Error && /Unit.*not found/.test(ex.toString())) {
                unitsSkipped.push(unitDefKey);
                reasonsSkipped.push(ex.toString());
                skipThisUnit = true;
              } else {
                throw ex;
              }
            }
          }
          if (!skipThisUnit) {
            let unitAndAliases = [unitDefKey];
            if (unitDef.aliases) {
              unitAndAliases.push(...unitDef.aliases);
            }
            unitAndAliases.forEach((newUnitName) => {
              if (defs.units.hasOwnProperty(newUnitName)) {
                throw new Error(`Alias '${newUnitName}' would override an existing unit`);
              }
              if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(newUnitName) && newUnitName !== "") {
                throw new SyntaxError(`Unit name contains non-alphanumeric characters or begins with a number: '${newUnitName}'`);
              }
              const newUnit = {
                name: newUnitName,
                value: unitValue,
                offset: options.type.conv(unitDef.offset ? unitDef.offset : 0),
                dimension: unitDimension,
                prefixGroup: unitDef.prefixGroup && defs.prefixGroups[unitDef.prefixGroup] || { "": 1 },
                formatPrefixes: unitDef.formatPrefixes,
                basePrefix: unitDef.basePrefix
              };
              if (unitQuantity)
                newUnit.quantity = unitQuantity;
              Object.freeze(newUnit);
              defs.units[newUnitName] = newUnit;
              unitsAdded++;
            });
          }
        }
        if (unitsSkipped.length === 0)
          break;
        else if (unitsAdded === 0) {
          throw new Error(`Could not create the following units: ${unitsSkipped.join(", ")}. Reasons follow: ${reasonsSkipped.join(" ")}`);
        }
      }
      if (options.system !== "auto") {
        if (!originalDefinitions.systems.hasOwnProperty(options.system)) {
          throw new Error(`Unknown unit system ${options.system}. Available systems are: auto, ${Object.keys(originalDefinitions.systems).join(", ")} `);
        }
      }
      for (let system of Object.keys(originalDefinitions.systems)) {
        let sys = originalDefinitions.systems[system];
        defs.systems[system] = [];
        for (let i = 0;i < sys.length; i++) {
          let unit = parser(sys[i]);
          unit.type = "Unit";
          Object.freeze(unit);
          defs.systems[system][i] = unit;
        }
      }
      for (let key of Object.keys(defs.units)) {
        const unit = defs.units[key];
        if (unit.formatPrefixes) {
          for (let i = 0;i < unit.formatPrefixes.length; i++) {
            let s = unit.formatPrefixes[i];
            if (!unit.prefixGroup.hasOwnProperty(s)) {
              throw new Error(`In unit ${unit.name}, common prefix ${s} was not found among the allowable prefixes`);
            }
          }
        }
      }
      function exists(singleUnitString) {
        return findUnit(singleUnitString) !== null;
      }
      function findUnit(unitString) {
        if (typeof unitString !== "string") {
          throw new TypeError(`parameter must be a string (${unitString} given)`);
        }
        if (defs.units.hasOwnProperty(unitString)) {
          const unit = defs.units[unitString];
          return {
            unit,
            prefix: ""
          };
        }
        for (const name of Object.keys(defs.units)) {
          if (unitString.substring(unitString.length - name.length, unitString.length) === name) {
            const unit = defs.units[name];
            const prefixLen = unitString.length - name.length;
            const prefix = unitString.substring(0, prefixLen);
            if (unit.prefixGroup.hasOwnProperty(prefix)) {
              return {
                unit,
                prefix
              };
            }
          }
        }
        return null;
      }
      Object.freeze(defs.prefixGroups);
      Object.freeze(defs.systems);
      Object.freeze(defs.units);
      return { originalDefinitions, defs, exists, findUnit, parser };
    }
    function isUnitPropsWithQuantity(unit) {
      return typeof unit !== "string" && unit.quantity !== undefined;
    }
    const symIsDefaultFun = Symbol("_IS_UNITMATH_DEFAULT_FUNCTION");
    let _config = function _config(options) {
      options = { ...options };
      const validFormatPrefixDefault = ["all", "none"];
      if (options.formatPrefixDefault && !validFormatPrefixDefault.includes(options.formatPrefixDefault)) {
        throw new Error(`Invalid option for formatPrefixDefault: '${options.formatPrefixDefault}'. Valid options are ${validFormatPrefixDefault.join(", ")}`);
      }
      const requiredTypeFns = ["conv", "clone", "add", "sub", "mul", "div", "pow"];
      let allRequiredTypeFnsPresent = true;
      let oneRequiredTypeFnsPresent = false;
      for (const fn of requiredTypeFns) {
        if (options.type?.[fn][symIsDefaultFun]) {
          allRequiredTypeFnsPresent = false;
        } else {
          oneRequiredTypeFnsPresent = true;
        }
      }
      if (oneRequiredTypeFnsPresent) {
        if (!allRequiredTypeFnsPresent) {
          throw new Error(`You must supply all required custom type functions: ${requiredTypeFns.join(", ")}`);
        }
        if (options.autoPrefix) {
          const prefixRequiredTypeFns = ["lt", "gt", "le", "ge", "abs"];
          let allPrefixRequiredTypeFnsPresent = true;
          for (const fn of prefixRequiredTypeFns) {
            if (options.type?.[fn][symIsDefaultFun]) {
              allPrefixRequiredTypeFnsPresent = false;
            }
          }
          if (!allPrefixRequiredTypeFnsPresent) {
            throw new Error(`The following custom type functions are required when prefix is true: ${prefixRequiredTypeFns.join(", ")}`);
          }
        }
      }
      Object.freeze(options);
      function unitmath(value, unitString) {
        let unit = new _Unit(value, unitString);
        Object.freeze(unit);
        return unit;
      }

      class _Unit {
        type = "Unit";
        value;
        unitList;
        dimension;
        fixed;
        constructor(value, unitString) {
          let parseResult;
          if (typeof value === "undefined" && typeof unitString === "undefined") {
            parseResult = unitStore.parser("");
            parseResult.value = null;
          } else if (typeof value === "string" && typeof unitString === "undefined") {
            parseResult = unitStore.parser(value);
          } else if (_isParsedUnit(value)) {
            parseResult = value;
          } else if (typeof unitString === "string") {
            parseResult = unitStore.parser(unitString);
            parseResult.value = value == null ? null : options.type.conv(value);
          } else if (typeof unitString === "undefined") {
            parseResult = unitStore.parser("");
            parseResult.value = value == null ? null : options.type.conv(value);
          } else {
            throw new TypeError("To construct a unit, you must supply a single string, two strings, a number and a string, or a custom type and a string.");
          }
          this.dimension = _removeZeroDimensions(parseResult.dimension);
          this.unitList = _combineDuplicateUnits(parseResult.unitList);
          this.value = parseResult.value === undefined || parseResult.value === null ? null : denormalize(this.unitList, normalize(parseResult.unitList, parseResult.value, options.type), options.type);
          this.fixed = false;
        }
        clone() {
          let unit = _clone(this);
          Object.freeze(unit);
          return unit;
        }
        add(value, unitString) {
          const other = _convertParamToUnit(value, unitString);
          const unit = _add(this, other);
          Object.freeze(unit);
          return unit;
        }
        sub(value, unitString) {
          const other = _convertParamToUnit(value, unitString);
          const unit = _sub(this, other);
          Object.freeze(unit);
          return unit;
        }
        mul(value, unitString) {
          const other = _convertParamToUnit(value, unitString);
          const unit = _mul(this, other);
          Object.freeze(unit);
          return unit;
        }
        div(value, unitString) {
          const other = _convertParamToUnit(value, unitString);
          const unit = _div(this, other);
          Object.freeze(unit);
          return unit;
        }
        pow(p) {
          const unit = _pow(this, p);
          Object.freeze(unit);
          return unit;
        }
        sqrt() {
          const unit = _sqrt(this);
          Object.freeze(unit);
          return unit;
        }
        abs() {
          const unit = _abs(this);
          Object.freeze(unit);
          return unit;
        }
        split(units2) {
          let us = _split(this, units2);
          for (let i = 0;i < us.length; i++) {
            Object.freeze(us[i]);
          }
          return us;
        }
        to(valuelessUnit) {
          let unit;
          if (valuelessUnit == null) {
            throw new Error("to() requires a unit as a parameter");
          } else {
            if (typeof valuelessUnit !== "string" && valuelessUnit.type !== "Unit") {
              throw new TypeError("Parameter must be a Unit or a string.");
            }
            valuelessUnit = _convertParamToUnit(valuelessUnit);
            unit = _to(this, valuelessUnit);
            Object.freeze(unit);
            return unit;
          }
        }
        toBaseUnits() {
          let unit = _toBaseUnits(this);
          Object.freeze(unit);
          return unit;
        }
        getComplexity() {
          return _getComplexity(this.unitList);
        }
        setValue(value) {
          let unit = _setValue(this, value);
          Object.freeze(unit);
          return unit;
        }
        getValue() {
          return this.value;
        }
        getNormalizedValue() {
          return this.value === null ? null : normalize(this.unitList, this.value, options.type);
        }
        setNormalizedValue(normalizedValue) {
          let unit = _setValue(this, denormalize(this.unitList, normalizedValue, options.type));
          Object.freeze(unit);
          return unit;
        }
        getInferredSystem() {
          let systemStr = null;
          let identifiedSystems = {};
          for (let unit of this.unitList) {
            for (let system of Object.keys(unitStore.defs.systems)) {
              for (let systemUnit of unitStore.defs.systems[system]) {
                let systemUnitString = `${systemUnit.unitList[0].prefix}${systemUnit.unitList[0].unit.name}`;
                let unitString = `${unit.prefix}${unit.unit.name}`;
                if (systemUnitString === unitString) {
                  identifiedSystems[system] = (identifiedSystems[system] || 0) + 1;
                } else if (unit.unit.name === systemUnit.unitList[0].unit.name) {
                  identifiedSystems[system] = (identifiedSystems[system] || 0) + 0.5;
                }
              }
            }
          }
          let ids = Object.keys(identifiedSystems);
          if (ids.length > 0) {
            let bestId = ids[0];
            let bestScore = identifiedSystems[ids[0]];
            for (let i = 1;i < ids.length; i++) {
              if (identifiedSystems[ids[i]] > bestScore) {
                bestId = ids[i];
                bestScore = identifiedSystems[ids[i]];
              }
            }
            systemStr = bestId;
          }
          return systemStr;
        }
        simplify(simplifyOptions) {
          let extendedOptions = _withDefaults(simplifyOptions);
          let systemStr = extendedOptions.system;
          if (systemStr === "auto") {
            let inferredSystemStr = this.getInferredSystem();
            if (inferredSystemStr) {
              systemStr = inferredSystemStr;
            }
          }
          let unitsOfSystem = unitStore.defs.systems[systemStr] || [];
          const proposedUnitList = [];
          let matchingUnit;
          let matchingUnitsOfSystem = [];
          for (let unit of unitsOfSystem) {
            if (this.equalsQuantity(unit)) {
              matchingUnitsOfSystem.push(unit);
            }
          }
          if (matchingUnitsOfSystem.length > 0) {
            matchingUnit = matchingUnitsOfSystem[0];
          }
          for (let baseUnit of this.unitList) {
            for (let systemUnit of matchingUnitsOfSystem) {
              let systemUnitString = `${systemUnit.unitList[0].prefix}${systemUnit.unitList[0].unit.name}`;
              let unitString = `${baseUnit.prefix}${baseUnit.unit.name}`;
              if (systemUnit.unitList.length === 1 && systemUnitString === unitString) {
                matchingUnit = systemUnit;
                break;
              }
            }
          }
          if (!matchingUnit) {
            for (let baseUnit of this.unitList) {
              if (this.equalsQuantity(baseUnit.unit.name)) {
                matchingUnit = new _Unit(baseUnit.unit.name);
                break;
              }
            }
          }
          let ok = true;
          if (matchingUnit) {
            proposedUnitList.push(...matchingUnit.unitList);
          } else {
            for (let dim of Object.keys(this.dimension)) {
              if (Math.abs(this.dimension[dim] || 0) > 0.000000000001) {
                let found = false;
                for (let unit of unitsOfSystem) {
                  if (isBase(unit.unitList) && unit.dimension[dim] === 1) {
                    proposedUnitList.push({
                      unit: unit.unitList[0].unit,
                      prefix: unit.unitList[0].prefix,
                      power: this.dimension[dim]
                    });
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  for (const unit of Object.values(unitStore.defs.units)) {
                    if (unit.quantity === dim) {
                      proposedUnitList.push({
                        unit,
                        prefix: unit.basePrefix || "",
                        power: this.dimension[dim]
                      });
                      found = true;
                      break;
                    }
                  }
                }
                if (!found)
                  ok = false;
              }
            }
          }
          let simplifiedUnit = _clone(this);
          if (ok) {
            simplifiedUnit.unitList = proposedUnitList;
            if (this.value !== null) {
              simplifiedUnit.value = denormalize(simplifiedUnit.unitList, normalize(this.unitList, this.value, options.type), options.type);
            } else {
              simplifiedUnit.value = null;
            }
          }
          if (extendedOptions.autoPrefix) {
            return _choosePrefix(simplifiedUnit, extendedOptions);
          } else {
            Object.freeze(simplifiedUnit);
            return simplifiedUnit;
          }
        }
        getUnits() {
          let result = _clone(this);
          result.value = null;
          Object.freeze(result);
          return result;
        }
        isCompound() {
          return isCompound(this.unitList);
        }
        isBase() {
          return isBase(this.unitList);
        }
        equalsQuantity(other) {
          other = _convertParamToUnit(other);
          for (let dim of Object.keys({ ...this.dimension, ...other.dimension })) {
            if (Math.abs((this.dimension[dim] || 0) - (other.dimension[dim] || 0)) > 0.000000000001) {
              return false;
            }
          }
          return true;
        }
        equals(other) {
          if (!options.type.conv[symIsDefaultFun] && options.type.eq[symIsDefaultFun]) {
            throw new Error(`When using custom types, equals requires a type.eq function`);
          }
          other = _convertParamToUnit(other);
          if (this.value === null !== (other.value === null)) {
            return false;
          }
          let { value1, value2 } = _comparePrepare(this, other, false);
          return this.equalsQuantity(other) && options.type.eq(value1, value2);
        }
        compare(other) {
          if (!options.type.conv[symIsDefaultFun] && (options.type.gt[symIsDefaultFun] || options.type.lt[symIsDefaultFun])) {
            throw new Error(`When using custom types, compare requires a type.gt and a type.lt function`);
          }
          other = _convertParamToUnit(other);
          let { value1, value2 } = _comparePrepare(this, other, true);
          if (typeof value1 === "number" && isNaN(value1)) {
            return 1;
          } else if (typeof value2 === "number" && isNaN(value2)) {
            return -1;
          } else if (options.type.lt(value1, value2)) {
            return -1;
          } else if (options.type.gt(value1, value2)) {
            return 1;
          } else {
            return 0;
          }
        }
        lessThan(other) {
          if (!options.type.conv[symIsDefaultFun] && options.type.lt[symIsDefaultFun]) {
            throw new Error(`When using custom types, lessThan requires a type.lt function`);
          }
          other = _convertParamToUnit(other);
          let { value1, value2 } = _comparePrepare(this, other, true);
          return options.type.lt(value1, value2);
        }
        lessThanOrEqual(other) {
          if (!options.type.conv[symIsDefaultFun] && options.type.le[symIsDefaultFun]) {
            throw new Error(`When using custom types, lessThanOrEqual requires a type.le function`);
          }
          other = _convertParamToUnit(other);
          let { value1, value2 } = _comparePrepare(this, other, true);
          return options.type.le(value1, value2);
        }
        greaterThan(other) {
          if (!options.type.conv[symIsDefaultFun] && options.type.gt[symIsDefaultFun]) {
            throw new Error(`When using custom types, greaterThan requires a type.gt function`);
          }
          other = _convertParamToUnit(other);
          let { value1, value2 } = _comparePrepare(this, other, true);
          return options.type.gt(value1, value2);
        }
        greaterThanOrEqual(other) {
          if (!options.type.conv[symIsDefaultFun] && options.type.ge[symIsDefaultFun]) {
            throw new Error(`When using custom types, greaterThanOrEqual requires a type.ge function`);
          }
          other = _convertParamToUnit(other);
          let { value1, value2 } = _comparePrepare(this, other, true);
          return options.type.ge(value1, value2);
        }
        toString(formatOptions) {
          let simp = this.clone();
          let extendedOptions = _withDefaults(formatOptions);
          let str = "";
          if (typeof simp.value === "number" && extendedOptions.formatter[symIsDefaultFun] && extendedOptions.precision > 0) {
            str += +simp.value.toPrecision(extendedOptions.precision);
          } else if (simp.value !== null) {
            str += extendedOptions.formatter(simp.value);
          }
          const unitStr = _formatUnits(simp, extendedOptions);
          if (unitStr.length > 0 && str.length > 0) {
            str += " ";
          }
          str += unitStr;
          return str;
        }
      }
      function _isUnit(a) {
        return a?.type === "Unit" && a.clone;
      }
      function _isParsedUnit(a) {
        return a?.type === "Unit" && !a.clone;
      }
      function _convertParamToUnit(otherOrValue, unit) {
        if (_isUnit(otherOrValue)) {
          return otherOrValue;
        } else if (_isParsedUnit(otherOrValue)) {
          let u = new _Unit(otherOrValue);
          return u;
        } else if (typeof otherOrValue === "string") {
          return unitmath(otherOrValue);
        } else {
          return unitmath(otherOrValue, unit);
        }
      }
      function _getComplexity(unitList) {
        let comp = unitList.length;
        let unitsDen = unitList.filter((a) => a.power < 0.00000000000001);
        let unitsNum = unitList.filter((a) => a.power > 0.00000000000001);
        comp += unitsNum.filter((a) => Math.abs(a.power - 1) > 0.00000000000001).length * 2;
        let denPowerInvert = unitsDen.length > 0 && unitsNum.length > 0 ? -1 : 1;
        comp += unitsDen.filter((a) => a.power < 0 && Math.abs(a.power * denPowerInvert - 1) > 0.00000000000001).length * 2;
        if (unitsDen.length > 0 && unitsNum.length > 0) {
          comp += 1;
        }
        return comp;
      }
      function _clone(unit) {
        const result = new _Unit;
        result.value = unit.value === null ? null : options.type.clone(unit.value);
        result.dimension = { ...unit.dimension };
        result.unitList = [];
        for (let i = 0;i < unit.unitList.length; i++) {
          result.unitList[i] = {};
          result.unitList[i] = { ...unit.unitList[i] };
        }
        return result;
      }
      function _combineDuplicateUnits(unitList) {
        let combinedUnitList = unitList.map((u) => Object.assign({}, u));
        if (combinedUnitList.length >= 2) {
          let foundUnits = {};
          for (let i = 0;i < combinedUnitList.length; i++) {
            if (foundUnits.hasOwnProperty(combinedUnitList[i].unit.name)) {
              let firstUnit2 = foundUnits[combinedUnitList[i].unit.name];
              firstUnit2.power += combinedUnitList[i].power;
              combinedUnitList.splice(i, 1);
              i--;
            } else {
              foundUnits[combinedUnitList[i].unit.name] = combinedUnitList[i];
            }
          }
          for (let i = 0;i < combinedUnitList.length; i++) {
            if (Math.abs(combinedUnitList[i].power) < 0.000000000000001) {
              combinedUnitList.splice(i, 1);
              i--;
            }
          }
        }
        return combinedUnitList;
      }
      function _removeZeroDimensions(dimensions) {
        let result = { ...dimensions };
        for (let dim of Object.keys(result)) {
          if (Math.abs(result[dim]) < 0.000000000000001) {
            delete result[dim];
          }
        }
        return result;
      }
      function _comparePrepare(unit1, unit2, requireMatchingDimensions) {
        if (requireMatchingDimensions && !unit1.equalsQuantity(unit2)) {
          throw new Error(`Cannot compare units ${unit1} and ${unit2}; dimensions do not match`);
        }
        let value1, value2;
        if (unit1.value === null && unit2.value === null) {
          value1 = normalize(unit1.unitList, options.type.conv(1), options.type);
          value2 = normalize(unit2.unitList, options.type.conv(1), options.type);
        } else if (unit1.value !== null && unit2.value !== null) {
          value1 = normalize(unit1.unitList, unit1.value, options.type);
          value2 = normalize(unit2.unitList, unit2.value, options.type);
        } else {
          throw new Error(`Cannot compare units ${unit1} and ${unit2}; one has a value and the other does not`);
        }
        return { value1, value2 };
      }
      function _add(unit1, unit2) {
        if (unit1.value === null || unit1.value === undefined || unit2.value === null || unit2.value === undefined) {
          throw new Error(`Cannot add ${unit1.toString()} and ${unit2.toString()}: both units must have values`);
        }
        if (!unit1.equalsQuantity(unit2)) {
          throw new Error(`Cannot add ${unit1.toString()} and ${unit2.toString()}: dimensions do not match`);
        }
        const result = _clone(unit1);
        result.value = denormalize(unit1.unitList, options.type.add(normalize(unit1.unitList, unit1.value, options.type), normalize(unit2.unitList, unit2.value, options.type)), options.type);
        return result;
      }
      function _sub(unit1, unit2) {
        if (unit1.value === null || unit1.value === undefined || unit2.value === null || unit2.value === undefined) {
          throw new Error(`Cannot subtract ${unit1.toString()} and ${unit2.toString()}: both units must have values`);
        }
        if (!unit1.equalsQuantity(unit2)) {
          throw new Error(`Cannot subtract ${unit1.toString()} and ${unit2.toString()}: dimensions do not match`);
        }
        const result = _clone(unit1);
        result.value = denormalize(unit1.unitList, options.type.sub(normalize(unit1.unitList, unit1.value, options.type), normalize(unit2.unitList, unit2.value, options.type)), options.type);
        return result;
      }
      function _mul(unit1, unit2) {
        const result = _clone(unit1);
        for (let dim of Object.keys({ ...unit1.dimension, ...unit2.dimension })) {
          result.dimension[dim] = (unit1.dimension[dim] || 0) + (unit2.dimension[dim] || 0);
          if (Math.abs(result.dimension[dim]) < 0.000000000000001)
            delete result.dimension[dim];
        }
        for (let i = 0;i < unit2.unitList.length; i++) {
          const inverted = { ...unit2.unitList[i] };
          result.unitList.push(inverted);
        }
        result.unitList = _combineDuplicateUnits(result.unitList);
        result.dimension = _removeZeroDimensions(result.dimension);
        if (unit1.value !== null || unit2.value !== null) {
          let one = options.type.conv(1);
          const val1 = unit1.value === null ? normalize(unit1.unitList, one, options.type) : normalize(unit1.unitList, unit1.value, options.type);
          const val2 = unit2.value === null ? normalize(unit2.unitList, one, options.type) : normalize(unit2.unitList, unit2.value, options.type);
          result.value = denormalize(result.unitList, options.type.mul(val1, val2), options.type);
        } else {
          result.value = null;
        }
        return result;
      }
      function _div(unit1, unit2) {
        const result = _clone(unit1);
        for (let dim of Object.keys({ ...unit1.dimension, ...unit2.dimension })) {
          result.dimension[dim] = (unit1.dimension[dim] || 0) - (unit2.dimension[dim] || 0);
          if (Math.abs(result.dimension[dim]) < 0.000000000000001)
            delete result.dimension[dim];
        }
        for (let i = 0;i < unit2.unitList.length; i++) {
          const inverted = { ...unit2.unitList[i] };
          inverted.power = -inverted.power;
          result.unitList.push(inverted);
        }
        result.unitList = _combineDuplicateUnits(result.unitList);
        result.dimension = _removeZeroDimensions(result.dimension);
        if (unit1.value !== null || unit2.value !== null) {
          let one = options.type.conv(1);
          const val1 = unit1.value === null ? normalize(unit1.unitList, one, options.type) : normalize(unit1.unitList, unit1.value, options.type);
          const val2 = unit2.value === null ? normalize(unit2.unitList, one, options.type) : normalize(unit2.unitList, unit2.value, options.type);
          result.value = denormalize(result.unitList, options.type.div(val1, val2), options.type);
        } else {
          result.value = null;
        }
        return result;
      }
      function _pow(unit, p) {
        const result = _clone(unit);
        for (let dim of Object.keys(result.dimension)) {
          result.dimension[dim] = unit.dimension[dim] * p;
        }
        for (let i = 0;i < result.unitList.length; i++) {
          result.unitList[i].power = result.unitList[i].power * p;
        }
        if (result.value !== null) {
          result.value = options.type.pow(result.value, options.type.conv(p));
        } else {
          result.value = null;
        }
        return result;
      }
      function _sqrt(unit) {
        return _pow(unit, 0.5);
      }
      function _split(unit, units2) {
        if (!options.type.conv[symIsDefaultFun] && (options.type.round[symIsDefaultFun] || options.type.trunc[symIsDefaultFun])) {
          throw new Error(`When using custom types, split requires a type.round and a type.trunc function`);
        }
        if (unit.value === null) {
          throw new Error(`Cannot split ${unit.toString()}: unit has no value`);
        }
        let x = _clone(unit);
        const result = [];
        for (let i = 0;i < units2.length; i++) {
          x = _to(x, _convertParamToUnit(units2[i]));
          if (i === units2.length - 1)
            break;
          const xRounded = options.type.round(x.value);
          let xFixed;
          const isNearlyEqual = options.type.eq(xRounded, x.value);
          if (isNearlyEqual) {
            xFixed = xRounded;
          } else {
            xFixed = options.type.trunc(x.value);
          }
          const y = new _Unit(xFixed, units2[i].toString());
          result.push(y);
          x = _sub(x, y);
        }
        let testSum = options.type.conv(0);
        for (let i = 0;i < result.length; i++) {
          testSum = options.type.add(testSum, normalize(result[i].unitList, result[i].value, options.type));
        }
        if (options.type.eq(testSum, normalize(unit.unitList, unit.value, options.type))) {
          x.value = options.type.conv(0);
        }
        result.push(x);
        return result;
      }
      function _abs(unit) {
        const result = _clone(unit);
        if (result.value !== null) {
          result.value = denormalize(result.unitList, options.type.abs(normalize(result.unitList, result.value, options.type)), options.type);
        }
        return result;
      }
      function _to(unit, valuelessUnit) {
        let result;
        const value = unit.value === null ? options.type.conv(1) : unit.value;
        if (!unit.equalsQuantity(valuelessUnit)) {
          throw new TypeError(`Cannot convert ${unit.toString()} to ${valuelessUnit}: dimensions do not match`);
        }
        if (valuelessUnit.value !== null) {
          throw new Error(`Cannot convert ${unit.toString()}: target unit must be valueless`);
        }
        result = _clone(valuelessUnit);
        result.value = denormalize(result.unitList, normalize(unit.unitList, value, options.type), options.type);
        return result;
      }
      function _choosePrefix(unit, prefixOptions) {
        let result = _clone(unit);
        let piece = result.unitList[0];
        if (unit.unitList.length !== 1) {
          return unit;
        }
        if (unit.value === null) {
          return unit;
        }
        if (Math.abs(piece.power - Math.round(piece.power)) >= 0.00000000000001) {
          return unit;
        }
        if (Math.abs(piece.power) < 0.00000000000001) {
          return unit;
        }
        if (options.type.lt(options.type.abs(unit.value), options.type.conv(0.00000000000000000000000000000000000000000000000001))) {
          return unit;
        }
        if (options.type.le(options.type.abs(unit.value), prefixOptions.prefixMax) && options.type.ge(options.type.abs(unit.value), prefixOptions.prefixMin)) {
          return unit;
        }
        function calcValue(prefix) {
          return options.type.div(unit.value, options.type.pow(options.type.div(options.type.conv(piece.unit.prefixGroup[prefix]), options.type.conv(piece.unit.prefixGroup[piece.prefix])), options.type.conv(piece.power)));
        }
        let unitValue = options.type.abs(unit.value);
        function calcScore(prefix) {
          let thisValue = options.type.abs(calcValue(prefix));
          if (options.type.lt(thisValue, prefixOptions.prefixMin)) {
            return options.type.div(options.type.conv(prefixOptions.prefixMin), thisValue);
          }
          if (options.type.gt(thisValue, prefixOptions.prefixMax)) {
            return options.type.div(thisValue, options.type.conv(prefixOptions.prefixMax));
          }
          if (options.type.le(thisValue, unitValue)) {
            return options.type.sub(options.type.conv(1), options.type.div(thisValue, unitValue));
          } else {
            return options.type.sub(options.type.conv(1), options.type.div(unitValue, thisValue));
          }
        }
        let bestPrefix = piece.prefix;
        let bestScore = calcScore(bestPrefix);
        let prefixes2 = piece.unit.formatPrefixes ?? (prefixOptions.formatPrefixDefault === "all" ? Object.keys(piece.unit.prefixGroup) : undefined);
        if (!prefixes2) {
          return unit;
        }
        for (let i = 0;i < prefixes2.length; i++) {
          let thisPrefix = prefixes2[i];
          let thisScore = calcScore(thisPrefix);
          if (options.type.lt(thisScore, bestScore)) {
            bestScore = thisScore;
            bestPrefix = thisPrefix;
          }
        }
        piece.prefix = bestPrefix;
        result.value = denormalize(result.unitList, normalize(unit.unitList, unit.value, options.type), options.type);
        Object.freeze(result);
        return result;
      }
      function _toBaseUnits(unit) {
        const result = _clone(unit);
        const proposedUnitList = [];
        for (let dim of Object.keys(result.dimension)) {
          if (Math.abs(result.dimension[dim] || 0) > 0.000000000001) {
            for (let unit2 of Object.keys(unitStore.defs.units)) {
              if (unitStore.defs.units[unit2].quantity === dim) {
                proposedUnitList.push({
                  unit: unitStore.defs.units[unit2],
                  prefix: unitStore.defs.units[unit2].basePrefix || "",
                  power: result.dimension[dim]
                });
                break;
              }
            }
          }
        }
        result.unitList = proposedUnitList;
        if (unit.value !== null) {
          result.value = denormalize(result.unitList, normalize(unit.unitList, unit.value, options.type), options.type);
        }
        return result;
      }
      function _setValue(unit, value) {
        let result = _clone(unit);
        if (typeof value === "undefined" || value === null) {
          result.value = null;
        } else {
          result.value = options.type.conv(value);
        }
        return result;
      }
      function _formatUnits(unit, opts) {
        let strNum = "";
        let strDen = "";
        let nNum = 0;
        let nDen = 0;
        for (let i = 0;i < unit.unitList.length; i++) {
          if (unit.unitList[i].power > 0) {
            nNum++;
            strNum += " " + unit.unitList[i].prefix + unit.unitList[i].unit.name;
            if (Math.abs(unit.unitList[i].power - 1) > 0.000000000000001) {
              strNum += "^" + unit.unitList[i].power;
            }
          } else if (unit.unitList[i].power < 0) {
            nDen++;
          }
        }
        if (nDen > 0) {
          for (let i = 0;i < unit.unitList.length; i++) {
            if (unit.unitList[i].power < 0) {
              if (nNum > 0) {
                strDen += " " + unit.unitList[i].prefix + unit.unitList[i].unit.name;
                if (Math.abs(unit.unitList[i].power + 1) > 0.000000000000001) {
                  strDen += "^" + -unit.unitList[i].power;
                }
              } else {
                strDen += " " + unit.unitList[i].prefix + unit.unitList[i].unit.name;
                strDen += "^" + unit.unitList[i].power;
              }
            }
          }
        }
        strNum = strNum.substr(1);
        strDen = strDen.substr(1);
        if (opts.parentheses) {
          if (nNum > 1 && nDen > 0) {
            strNum = "(" + strNum + ")";
          }
          if (nDen > 1 && nNum > 0) {
            strDen = "(" + strDen + ")";
          }
        }
        let str = strNum;
        if (nNum > 0 && nDen > 0) {
          str += " / ";
        }
        str += strDen;
        return str;
      }
      function _withDefaults(newOptions) {
        let extendedOptions = { ...options };
        if (typeof newOptions === "object") {
          extendedOptions = Object.assign(extendedOptions, newOptions);
        }
        return extendedOptions;
      }
      let unitStore = createUnitStore(options);
      function configFunction(newOptions) {
        let retOptions = Object.assign({}, options, newOptions);
        retOptions.definitions = Object.assign({}, options.definitions, newOptions.definitions);
        retOptions.type = Object.assign({}, options.type, newOptions.type);
        return _config(retOptions);
      }
      unitmath.config = configFunction;
      unitmath.getConfig = function getConfig() {
        return options;
      };
      unitmath.definitions = function definitions() {
        return unitStore.originalDefinitions;
      };
      unitmath.add = function add(a, b) {
        return _convertParamToUnit(a).add(b);
      };
      unitmath.sub = function sub(a, b) {
        return _convertParamToUnit(a).sub(b);
      };
      unitmath.mul = function mul(a, b) {
        return _convertParamToUnit(a).mul(b);
      };
      unitmath.div = function div(a, b) {
        return _convertParamToUnit(a).div(b);
      };
      unitmath.pow = function pow(a, b) {
        return _convertParamToUnit(a).pow(b);
      };
      unitmath.sqrt = function sqrt(a) {
        return _convertParamToUnit(a).sqrt();
      };
      unitmath.abs = function abs(a) {
        return _convertParamToUnit(a).abs();
      };
      unitmath.to = function to(unit, valuelessUnit) {
        return _convertParamToUnit(unit).to(valuelessUnit);
      };
      unitmath.toBaseUnits = function toBaseUnits(unit) {
        return _convertParamToUnit(unit).toBaseUnits();
      };
      unitmath.exists = unitStore.exists;
      unitmath._unitStore = unitStore;
      Object.freeze(unitmath);
      return unitmath;
    };
    let defaults = {
      add: (a, b) => a + b,
      sub: (a, b) => a - b,
      mul: (a, b) => a * b,
      div: (a, b) => a / b,
      pow: (a, b) => Math.pow(a, b),
      abs: (a) => Math.abs(a),
      eq: (a, b) => a === b || Math.abs(a - b) / Math.abs(a + b) < 0.000000000000001,
      lt: (a, b) => a < b,
      gt: (a, b) => a > b,
      le: (a, b) => a <= b,
      ge: (a, b) => a >= b,
      round: (a) => Math.round(a),
      trunc: (a) => Math.trunc(a),
      conv: (a) => typeof a === "string" ? parseFloat(a) : a,
      clone: (a) => a
    };
    for (const key of Object.keys(defaults)) {
      defaults[key][symIsDefaultFun] = true;
    }
    const defaultFormatter = (a) => a.toString();
    defaultFormatter[symIsDefaultFun] = true;
    const defaultOptions = {
      parentheses: false,
      precision: 15,
      autoPrefix: true,
      prefixMin: 0.1,
      prefixMax: 1000,
      formatPrefixDefault: "none",
      system: "auto",
      formatter: defaultFormatter,
      definitions: {
        skipBuiltIns: false,
        units: {},
        prefixGroups: {},
        systems: {}
      },
      type: defaults
    };
    const firstUnit = _config(defaultOptions);
    return firstUnit;
  });
});

// recipeskbook/utils.tsitm
function buildCookbook() {
  const list = Object.keys(recipes);
  const groups = Object.values(recipes).reduce((groups2, recipe) => {
    for (const group of recipe.meal) {
      if (!groups2[group]) {
        groups2[group] = [];
      }
      groups2[group].push(recipe.name);
    }
    return groups2;
  }, {});
  function getRandomRecipe(group = []) {
    return group[Math.floor(Math.random() * group.length)];
  }
  return {
    list,
    groups,
    getRandomRecipe
  };
}
// recipeskbook/util
function jsx(tag, props, ...children) {
  return new tag({ ...props, children });
}
// recipeskbook/utils.ts
var parseOptions = function(options) {
  if (options === undefined) {
    return [];
  }
  if (options instanceof Options) {
    return [...options];
  }
  if (Array.isArray(options)) {
    return options;
  }
  return `${options}`.split(",").map((option) => option.trim());
};

class Options extends Array {
  constructor(...args) {
    const optionsArray = parseOptions(...args);
    super(...optionsArray);
  }
}

// recipeskbook/utils.tsitmath/d
class RecipeContainer {
  children;
  constructor(props) {
    this.children = Array.isArray(props.children) ? props.children : [props.children];
  }
}

// recipeskbook/utils.tsitma
var import_unitmath = __toESM(require_UnitMath(), 1);
var tsp = {
  name: "tsp",
  definition: "1 teaspoon",
  aliases: ["tsp", "ts", "t"]
};
var tbsp = {
  name: "tbsp",
  definition: "1 tablespoon",
  aliases: ["tbsp", "tbs", "tb"]
};
var things = {
  name: "things",
  aliases: [
    "slice",
    "slices",
    "serving",
    "servings",
    "thing",
    "item",
    "items",
    "piece",
    "pieces",
    "portion",
    "portions",
    "part",
    "parts",
    "unit",
    "units",
    "chunk",
    "chunks",
    "hunk",
    "hunks",
    "slab",
    "slabs",
    "sliver",
    "slivers",
    "wedge",
    "wedges",
    "container",
    "containers",
    "package",
    "packages",
    "dash",
    "dashes",
    "stalk",
    "stalks"
  ]
};
var bit = {
  name: "bit",
  definition: "1 thing",
  aliases: ["bit", "bits"]
};
var unit = import_unitmath.default.config({
  definitions: {
    units: {
      [tsp.name]: {
        value: tsp.definition,
        aliases: tsp.aliases
      },
      [tbsp.name]: {
        value: tbsp.definition,
        aliases: tbsp.aliases
      },
      [things.name]: {
        value: "1",
        aliases: things.aliases
      },
      [bit.name]: {
        value: bit.definition,
        aliases: bit.aliases
      }
    }
  }
});

// recipeskbook/utils.tsi
function parseQuantity(value) {
  if (value === undefined)
    return;
  try {
    return unit(value);
  } catch (error) {
    return;
  }
}

// recipeskbook/utils.t
class Recipe extends RecipeContainer {
  name;
  description;
  meal;
  servings;
  constructor(props) {
    super(props);
    this.name = props.name;
    this.description = props.description;
    this.meal = new Options(props.meal);
    this.servings = parseQuantity(props.servings);
  }
}
// recipeskbook/utils.ts
function joinStringChildren(children) {
  if (children === undefined) {
    return;
  }
  if (typeof children === "string") {
    return children;
  }
  if (!children.length) {
    return;
  }
  return children.join("");
}

// recipeskbook/utils.tsitm
class Ingredient {
  key;
  name;
  description;
  quantity;
  category;
  manipulation;
  optional;
  constructor(props) {
    this.key = props.key;
    this.name = joinStringChildren(props.children) ?? props.name;
    this.description = props.description;
    this.quantity = parseQuantity(props.quantity);
    this.category = new Options(props.category);
    this.manipulation = new Options(props.manipulation);
    this.optional = Boolean(props.optional);
  }
}
// recipeskbook/utils.tsitma
class Ingredients extends RecipeContainer {
  constructor() {
    super(...arguments);
  }
}
// recipeskbook/utils
class Step extends RecipeContainer {
  duration;
  constructor(props) {
    super(props);
    this.duration = parseQuantity(props.duration);
  }
}
// recipeskbook/utils.tsitma
class Preparation extends RecipeContainer {
  constructor() {
    super(...arguments);
  }
}
// recipeskbook/utils.tsitm
class Directions extends RecipeContainer {
  constructor() {
    super(...arguments);
  }
}
// recipeskbook/utils.tsitma
class Measurement {
  scale;
  quantity;
  constructor(props) {
    this.scale = props.scale;
    const quantity = joinStringChildren(props.children) ?? props.value;
    this.quantity = parseQuantity(quantity);
  }
}
// recipeskbook/utils.tsitmath/dist/UnitMath
function findRecipeContainer(container, predicate) {
  for (const child of container.children) {
    if (predicate(child)) {
      return child;
    }
    if (child instanceof RecipeContainer) {
      const found = findRecipeContainer(child, predicate);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
function filterRecipeContainer(container, predicate) {
  const found = [];
  for (const child of container.children) {
    if (predicate(child)) {
      found.push(child);
    }
    if (child instanceof RecipeContainer) {
      found.push(...filterRecipeContainer(child, predicate));
    }
  }
  return found;
}
function mapRecipeContainer(container, map) {
  let mapped = map(container);
  if (!(mapped instanceof RecipeContainer)) {
    return mapped;
  }
  mapped = map(Object.assign(Object.create(Object.getPrototypeOf(container)), container));
  mapped.children = container.children.map((child) => {
    if (child instanceof RecipeContainer) {
      return mapRecipeContainer(child, map);
    }
    return map(child);
  });
  return mapped;
}

// recipeskbook/utils.ts
function groupBy(array, getKey) {
  const grouped = {};
  for (const item of array) {
    const key = getKey(item);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  }
  return grouped;
}

// recipeskbook/utils.tsitmath/dist/
var getIngredients = function(container) {
  return filterRecipeContainer(container, (node) => node instanceof Ingredient);
};
function getIngredientKey({ key, name }) {
  const regex = /\(.*?\)/g;
  if (key) {
    return key;
  }
  const cleanName = name?.replace(regex, "")?.trim();
  return cleanName ?? name?.trim();
}
var combineQuantity = function(ingredients) {
  return ingredients.reduce((acc, { quantity }) => quantity ? acc.add(quantity) : acc, parseQuantity("0g"));
};
var combineOptions = function(options) {
  const set = new Set([].concat(...options));
  return Array.from(set);
};
function gatherIngredients(recipe) {
  const ingredientsContainer = findRecipeContainer(recipe, (node) => node instanceof Ingredients);
  const mainIngredients = getIngredients(ingredientsContainer);
  const allIngredients = getIngredients(recipe);
  const similar = groupBy(allIngredients, getIngredientKey);
  const children = [];
  for (const [key, variants] of Object.entries(similar)) {
    let main = variants.find((ingredient2) => mainIngredients.includes(ingredient2));
    if (!main) {
      main = variants[0];
    }
    const name = main?.name ?? variants.map(({ name: name2 }) => name2).find(Boolean);
    assertIngredientPart("name", name);
    const quantity = main?.quantity ?? combineQuantity(variants);
    assertIngredientPart("quantity", quantity);
    const category = combineOptions(variants.map(({ category: category2 }) => category2));
    assertIngredientPart("category", quantity);
    const manipulation = combineOptions(variants.map(({ manipulation: manipulation2 }) => manipulation2));
    const ingredient = new Ingredient({
      key,
      name,
      quantity,
      category,
      manipulation
    });
    children.push(ingredient);
  }
  return new Ingredients({ children });
}
var assertIngredientPart = function(part, name) {
  if (!name) {
    throw new Error(`Missing ${part} for ingredient`);
  }
};

// recipeskbook/utils.tsitmath/dis
function normalizeRecipe(original) {
  const ingredients = gatherIngredients(original);
  const preparation = findRecipeContainer(original, (node) => node instanceof Preparation);
  const directions = findRecipeContainer(original, (node) => node instanceof Directions);
  return new Recipe({
    name: original.name ?? "",
    meal: original.meal,
    servings: original.servings,
    children: [ingredients, preparation, directions]
  });
}
// recipeskbook/utils.tsitmath/dis
function scaleRecipe(original, days) {
  return mapRecipeContainer(original, (node) => {
    if (node instanceof Ingredient && node.quantity) {
      const quantity = node.quantity.mul(unit(`${days}`));
      const result = new Ingredient(node);
      result.quantity = quantity;
      return result;
    }
    return node;
  });
}
function convertRecipeUnits(original, system) {
  return mapRecipeContainer(original, (node) => {
    if (node instanceof Ingredient && node.quantity) {
      const quantity = node.quantity.simplify({ system });
      const result = new Ingredient(node);
      result.quantity = quantity;
      return result;
    }
    return node;
  });
}
// recipeskbook/u
var recipes = {};
export {
  unit,
  scaleRecipe,
  recipes,
  parseQuantity,
  normalizeRecipe,
  jsx,
  convertRecipeUnits,
  buildCookbook,
  Step,
  RecipeContainer,
  Recipe,
  Preparation,
  Options,
  Measurement,
  Ingredients,
  Ingredient,
  Directions
};
// recipeskbook/utils.tsitmath/dist/UnitMath.
recipes["Egg and Vegetable Scramble"] = jsx(Recipe, {
  name: "Egg and Vegetable Scramble",
  meal: "breakfast",
  servings: "1"
}, jsx(Directions, null, jsx(Step, null, "Beat the eggs and set aside."), jsx(Step, null, "Heat oil in a pan."), jsx(Step, null, "Add the diced bell peppers, onions, and tomatoes."), jsx(Step, null, "Once vegetables are softened, pour in the eggs."), jsx(Step, null, "Scramble until fully cooked."), jsx(Step, null, "Season with salt, pepper, and chili flakes."), jsx(Step, null, "Serve with a toasted tortilla slice.")), jsx(Ingredients, null, jsx(Ingredient, {
  category: "Protein",
  quantity: "3"
}, "Large eggs"), jsx(Ingredient, {
  key: "bell_peppers",
  category: "Vegetable"
}, "Bell peppers (mixed colors)"), jsx(Ingredient, {
  category: "Carbohydrate",
  name: "Tortillas",
  quantity: "1 slice"
})), jsx(Preparation, null, jsx(Step, null, "Wash and dice", " ", jsx(Ingredient, {
  key: "bell_peppers",
  quantity: "60g",
  manipulation: "wash,dice"
}, "bell peppers"), ",", " ", jsx(Ingredient, {
  quantity: "60g",
  manipulation: "dice"
}, "onions"), ", and", " ", jsx(Ingredient, {
  quantity: "60g",
  manipulation: "wash,dice"
}, "tomatoes"), ".")));
// recipeskbook/utils.tsitmath/dist/UnitMa
recipes["Ranch Chicken Meal Prep"] = jsx(Recipe, {
  name: "Ranch Chicken Meal Prep",
  description: "This simple chicken meal prep features garlic herb chicken, roasted potatoes and broccoli, and a little ranch dressing to drizzle over top!",
  servings: "4 servings",
  meal: "lunch,dinner"
}, jsx(Ingredients, null), jsx(Preparation, null, jsx(Step, null, "Clean and dice the", " ", jsx(Ingredient, {
  manipulation: "clean,dice"
}, "potatoes"), " into roughly", " ", jsx(Measurement, null, "2 cm"), "pieces."), jsx(Step, null, "In a small bowl, combine the", " ", jsx(Ingredient, {
  quantity: "1/3 cup"
}, "Parmesan"), ",", " ", jsx(Ingredient, {
  quantity: "1/2 tsp"
}, "garlic powder"), ",", " ", jsx(Ingredient, {
  quantity: "1/4 tsp"
}, "paprika"), ", and", " ", jsx(Ingredient, {
  quantity: "1/4 tsp"
}, "salt"), "."), jsx(Step, null, "Place the diced potatoes in a bowl, drizzle with", " ", jsx(Ingredient, {
  quantity: "1 tbsp"
}, "cooking oil"), " and the seasoned Parmesan, then toss until evenly coated."), jsx(Step, null, "Place the ", jsx(Ingredient, {
  quantity: "1 lb"
}, "broccoli florets"), " in a bowl and drizzle with", " ", jsx(Ingredient, {
  quantity: "1 tbsp"
}, "cooking oil"), ", and add a", " ", jsx(Ingredient, {
  quantity: "1/4 tsp"
}, "salt"), " and", " ", jsx(Ingredient, {
  quantity: "1/4 tsp"
}, "pepper"), ". Toss until the broccoli is evenly coated."), jsx(Step, null, "Fillet the ", jsx(Ingredient, {
  quantity: "1 lb"
}, "chicken breast"), " into two thinner pieces to help them cook faster and more evenly. Season both sides of the chicken with", " ", jsx(Ingredient, {
  quantity: "1 tbsp"
}, "garlic herb seasoning"), ".")), jsx(Directions, null, jsx(Step, null, "Preheat the oven to ", jsx(Measurement, null, "200 celsius"), "."), jsx(Step, {
  duration: "15 minutes"
}, "Spread the potatoes out over a parchment-lined baking sheet, place in the oven and roast for 15 minutes."), jsx(Step, null, "After 15 minutes, add the broccoli to the baking sheet with the potatoes."), jsx(Step, {
  duration: "10 minutes"
}, "Roast the potatoes and broccoli together for 10 minutes."), jsx(Step, null, "Then, add the chicken to the baking sheet."), jsx(Step, {
  duration: "20 minutes"
}, "Continue roasting for an additional 15-20 minutes or until the chicken is fully cooked, the potatoes are golden and crispy, and the broccoli is tender and browned at the edges")));
// recipeskbook/utils.tsitmath/dist
recipes["Chicken Stir-Fry"] = jsx(Recipe, {
  name: "Chicken Stir-Fry",
  meal: "dinner",
  servings: "1"
}, jsx(Directions, null, jsx(Step, null, "Cut the pre-cooked chicken into strips or chunks."), jsx(Step, null, "Heat the chicken stock in a non-stick wok over medium-high heat. Add the chicken and cook until almost done."), jsx(Step, null, "Add the pre-cooked vegetables, cayenne pepper, and ginger to the wok. Cook until the vegetables are tender."), jsx(Step, null, "In a separate pan, quickly scramble the pre-cooked egg and then mix it thoroughly through the stir-fry."), jsx(Step, null, "Serve the stir-fry hot.")), jsx(Ingredients, null, jsx(Ingredient, {
  category: "Protein",
  quantity: "118g"
}, "Chicken breast (raw)"), jsx(Ingredient, {
  category: "Protein",
  quantity: "1"
}, "Egg (whole, fresh)"), jsx(Ingredient, {
  category: "Vegetable",
  quantity: "34g"
}, "Asparagus (raw)"), jsx(Ingredient, {
  category: "Vegetable",
  quantity: "23g"
}, "Broccoli (raw)"), jsx(Ingredient, {
  category: "Vegetable",
  quantity: "35g"
}, "Mushrooms (white, raw)"), jsx(Ingredient, {
  category: "Vegetable",
  quantity: "15g"
}, "Carrots (raw)"), jsx(Ingredient, {
  category: "Condiment",
  quantity: "0.1g"
}, "Cayenne pepper (spices)"), jsx(Ingredient, {
  category: "Condiment",
  quantity: "0.5g"
}, "Ginger (ground)"), jsx(Ingredient, {
  category: "Condiment",
  quantity: "15g"
}, "Chicken broth (ready-to-serve)")), jsx(Preparation, null, jsx(Step, null, "Chop", " ", jsx(Ingredient, {
  key: "chicken_breast",
  quantity: "118g",
  manipulation: "chop,cook"
}, "chicken breast"), " ", "into small pieces and cook in a pan until fully done. Store in an airtight container in the refrigerator."), jsx(Step, null, "Wash and chop", " ", jsx(Ingredient, {
  quantity: "34g",
  manipulation: "wash,chop"
}, "asparagus"), ",", " ", jsx(Ingredient, {
  quantity: "23g",
  manipulation: "wash,chop"
}, "broccoli"), ",", " ", jsx(Ingredient, {
  quantity: "35g",
  manipulation: "wash,chop"
}, "mushrooms"), ", and", " ", jsx(Ingredient, {
  quantity: "15g",
  manipulation: "wash,chop"
}, "carrots"), ". Store each in separate airtight containers in the refrigerator."), jsx(Step, null, "Beat and lightly scramble", " ", jsx(Ingredient, {
  quantity: "1",
  manipulation: "beat,scramble"
}, "egg"), ". Once cooked, store in an airtight container in the refrigerator.")));
