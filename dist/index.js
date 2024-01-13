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

// recipeseme/helpers.tsities/build/quantities.js
var require_quantities = __commonJS((exports, module) => {
  (function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Qty = factory());
  })(exports, function() {
    function isString(value) {
      return typeof value === "string" || value instanceof String;
    }
    var isFiniteImpl = Number.isFinite || window.isFinite;
    function isNumber(value) {
      return isFiniteImpl(value);
    }
    function identity(value) {
      return value;
    }
    function uniq(strings) {
      var seen = {};
      return strings.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : seen[item] = true;
      });
    }
    function compareArray(array1, array2) {
      if (array2.length !== array1.length) {
        return false;
      }
      for (var i2 = 0;i2 < array1.length; i2++) {
        if (array2[i2].compareArray) {
          if (!array2[i2].compareArray(array1[i2])) {
            return false;
          }
        }
        if (array2[i2] !== array1[i2]) {
          return false;
        }
      }
      return true;
    }
    function assign(target, properties) {
      Object.keys(properties).forEach(function(key) {
        target[key] = properties[key];
      });
    }
    function mulSafe() {
      var result = 1, decimals = 0;
      for (var i2 = 0;i2 < arguments.length; i2++) {
        var arg = arguments[i2];
        decimals = decimals + getFractional(arg);
        result *= arg;
      }
      return decimals !== 0 ? round(result, decimals) : result;
    }
    function divSafe(num, den) {
      if (den === 0) {
        throw new Error("Divide by zero");
      }
      var factor = Math.pow(10, getFractional(den));
      var invDen = factor / (factor * den);
      return mulSafe(num, invDen);
    }
    function round(val, decimals) {
      return Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }
    function getFractional(num) {
      if (!isFinite(num)) {
        return 0;
      }
      var count = 0;
      while (num % 1 !== 0) {
        num *= 10;
        count++;
      }
      return count;
    }
    function QtyError() {
      var err;
      if (!this) {
        err = Object.create(QtyError.prototype);
        QtyError.apply(err, arguments);
        return err;
      }
      err = Error.apply(this, arguments);
      this.name = "QtyError";
      this.message = err.message;
      this.stack = err.stack;
    }
    QtyError.prototype = Object.create(Error.prototype, { constructor: { value: QtyError } });
    function throwIncompatibleUnits(left, right) {
      throw new QtyError("Incompatible units: " + left + " and " + right);
    }
    var UNITS = {
      "<googol>": [["googol"], 10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000, "prefix"],
      "<kibi>": [["Ki", "Kibi", "kibi"], Math.pow(2, 10), "prefix"],
      "<mebi>": [["Mi", "Mebi", "mebi"], Math.pow(2, 20), "prefix"],
      "<gibi>": [["Gi", "Gibi", "gibi"], Math.pow(2, 30), "prefix"],
      "<tebi>": [["Ti", "Tebi", "tebi"], Math.pow(2, 40), "prefix"],
      "<pebi>": [["Pi", "Pebi", "pebi"], Math.pow(2, 50), "prefix"],
      "<exi>": [["Ei", "Exi", "exi"], Math.pow(2, 60), "prefix"],
      "<zebi>": [["Zi", "Zebi", "zebi"], Math.pow(2, 70), "prefix"],
      "<yebi>": [["Yi", "Yebi", "yebi"], Math.pow(2, 80), "prefix"],
      "<yotta>": [["Y", "Yotta", "yotta"], 1000000000000000000000000, "prefix"],
      "<zetta>": [["Z", "Zetta", "zetta"], 1000000000000000000000, "prefix"],
      "<exa>": [["E", "Exa", "exa"], 1000000000000000000, "prefix"],
      "<peta>": [["P", "Peta", "peta"], 1000000000000000, "prefix"],
      "<tera>": [["T", "Tera", "tera"], 1000000000000, "prefix"],
      "<giga>": [["G", "Giga", "giga"], 1e9, "prefix"],
      "<mega>": [["M", "Mega", "mega"], 1e6, "prefix"],
      "<kilo>": [["k", "kilo"], 1000, "prefix"],
      "<hecto>": [["h", "Hecto", "hecto"], 100, "prefix"],
      "<deca>": [["da", "Deca", "deca", "deka"], 10, "prefix"],
      "<deci>": [["d", "Deci", "deci"], 0.1, "prefix"],
      "<centi>": [["c", "Centi", "centi"], 0.01, "prefix"],
      "<milli>": [["m", "Milli", "milli"], 0.001, "prefix"],
      "<micro>": [
        ["u", "\u03BC", "\xB5", "Micro", "mc", "micro"],
        0.000001,
        "prefix"
      ],
      "<nano>": [["n", "Nano", "nano"], 0.000000001, "prefix"],
      "<pico>": [["p", "Pico", "pico"], 0.000000000001, "prefix"],
      "<femto>": [["f", "Femto", "femto"], 0.000000000000001, "prefix"],
      "<atto>": [["a", "Atto", "atto"], 0.000000000000000001, "prefix"],
      "<zepto>": [["z", "Zepto", "zepto"], 0.000000000000000000001, "prefix"],
      "<yocto>": [["y", "Yocto", "yocto"], 0.000000000000000000000001, "prefix"],
      "<1>": [["1", "<1>"], 1, ""],
      "<meter>": [["m", "meter", "meters", "metre", "metres"], 1, "length", ["<meter>"]],
      "<inch>": [["in", "inch", "inches", "\""], 0.0254, "length", ["<meter>"]],
      "<foot>": [["ft", "foot", "feet", "'"], 0.3048, "length", ["<meter>"]],
      "<yard>": [["yd", "yard", "yards"], 0.9144, "length", ["<meter>"]],
      "<mile>": [["mi", "mile", "miles"], 1609.344, "length", ["<meter>"]],
      "<naut-mile>": [["nmi", "naut-mile"], 1852, "length", ["<meter>"]],
      "<league>": [["league", "leagues"], 4828, "length", ["<meter>"]],
      "<furlong>": [["furlong", "furlongs"], 201.2, "length", ["<meter>"]],
      "<rod>": [["rd", "rod", "rods"], 5.029, "length", ["<meter>"]],
      "<mil>": [["mil", "mils"], 0.0000254, "length", ["<meter>"]],
      "<angstrom>": [["ang", "angstrom", "angstroms"], 0.0000000001, "length", ["<meter>"]],
      "<fathom>": [["fathom", "fathoms"], 1.829, "length", ["<meter>"]],
      "<pica>": [["pica", "picas"], 0.00423333333, "length", ["<meter>"]],
      "<point>": [["pt", "point", "points"], 0.000352777778, "length", ["<meter>"]],
      "<redshift>": [["z", "red-shift", "redshift"], 130277300000000000000000000, "length", ["<meter>"]],
      "<AU>": [["AU", "astronomical-unit"], 149597900000, "length", ["<meter>"]],
      "<light-second>": [["ls", "light-second"], 299792500, "length", ["<meter>"]],
      "<light-minute>": [["lmin", "light-minute"], 17987550000, "length", ["<meter>"]],
      "<light-year>": [["ly", "light-year"], 9460528000000000, "length", ["<meter>"]],
      "<parsec>": [["pc", "parsec", "parsecs"], 30856780000000000, "length", ["<meter>"]],
      "<datamile>": [["DM", "datamile"], 1828.8, "length", ["<meter>"]],
      "<kilogram>": [["kg", "kilogram", "kilograms"], 1, "mass", ["<kilogram>"]],
      "<AMU>": [["u", "AMU", "amu"], 0.000000000000000000000000001660538921, "mass", ["<kilogram>"]],
      "<dalton>": [["Da", "Dalton", "Daltons", "dalton", "daltons"], 0.000000000000000000000000001660538921, "mass", ["<kilogram>"]],
      "<slug>": [["slug", "slugs"], 14.5939029, "mass", ["<kilogram>"]],
      "<short-ton>": [["tn", "ton", "short-ton"], 907.18474, "mass", ["<kilogram>"]],
      "<metric-ton>": [["t", "tonne", "metric-ton"], 1000, "mass", ["<kilogram>"]],
      "<carat>": [["ct", "carat", "carats"], 0.0002, "mass", ["<kilogram>"]],
      "<pound>": [["lbs", "lb", "pound", "pounds", "#"], 0.45359237, "mass", ["<kilogram>"]],
      "<ounce>": [["oz", "ounce", "ounces"], 0.0283495231, "mass", ["<kilogram>"]],
      "<gram>": [["g", "gram", "grams", "gramme", "grammes"], 0.001, "mass", ["<kilogram>"]],
      "<grain>": [["grain", "grains", "gr"], 0.00006479891, "mass", ["<kilogram>"]],
      "<dram>": [["dram", "drams", "dr"], 0.0017718452, "mass", ["<kilogram>"]],
      "<stone>": [["stone", "stones", "st"], 6.35029318, "mass", ["<kilogram>"]],
      "<hectare>": [["hectare"], 1e4, "area", ["<meter>", "<meter>"]],
      "<acre>": [["acre", "acres"], 4046.85642, "area", ["<meter>", "<meter>"]],
      "<sqft>": [["sqft"], 1, "area", ["<foot>", "<foot>"]],
      "<liter>": [["l", "L", "liter", "liters", "litre", "litres"], 0.001, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<gallon>": [["gal", "gallon", "gallons"], 0.0037854118, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<gallon-imp>": [["galimp", "gallon-imp", "gallons-imp"], 0.00454609, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<quart>": [["qt", "quart", "quarts"], 0.00094635295, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<pint>": [["pt", "pint", "pints"], 0.000473176475, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<pint-imp>": [["ptimp", "pint-imp", "pints-imp"], 0.00056826125, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<cup>": [["cu", "cup", "cups"], 0.000236588238, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<fluid-ounce>": [["floz", "fluid-ounce", "fluid-ounces"], 0.0000295735297, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<fluid-ounce-imp>": [["flozimp", "floz-imp", "fluid-ounce-imp", "fluid-ounces-imp"], 0.0000284130625, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<tablespoon>": [["tb", "tbsp", "tbs", "tablespoon", "tablespoons"], 0.0000147867648, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<teaspoon>": [["tsp", "teaspoon", "teaspoons"], 0.00000492892161, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<bushel>": [["bu", "bsh", "bushel", "bushels"], 0.035239072, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<oilbarrel>": [["bbl", "oilbarrel", "oilbarrels", "oil-barrel", "oil-barrels"], 0.158987294928, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<beerbarrel>": [["bl", "bl-us", "beerbarrel", "beerbarrels", "beer-barrel", "beer-barrels"], 0.1173477658, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<beerbarrel-imp>": [["blimp", "bl-imp", "beerbarrel-imp", "beerbarrels-imp", "beer-barrel-imp", "beer-barrels-imp"], 0.16365924, "volume", ["<meter>", "<meter>", "<meter>"]],
      "<kph>": [["kph"], 0.277777778, "speed", ["<meter>"], ["<second>"]],
      "<mph>": [["mph"], 0.44704, "speed", ["<meter>"], ["<second>"]],
      "<knot>": [["kt", "kn", "kts", "knot", "knots"], 0.514444444, "speed", ["<meter>"], ["<second>"]],
      "<fps>": [["fps"], 0.3048, "speed", ["<meter>"], ["<second>"]],
      "<gee>": [["gee"], 9.80665, "acceleration", ["<meter>"], ["<second>", "<second>"]],
      "<Gal>": [["Gal"], 0.01, "acceleration", ["<meter>"], ["<second>", "<second>"]],
      "<kelvin>": [["degK", "kelvin"], 1, "temperature", ["<kelvin>"]],
      "<celsius>": [["degC", "celsius", "celsius", "centigrade"], 1, "temperature", ["<kelvin>"]],
      "<fahrenheit>": [["degF", "fahrenheit"], 5 / 9, "temperature", ["<kelvin>"]],
      "<rankine>": [["degR", "rankine"], 5 / 9, "temperature", ["<kelvin>"]],
      "<temp-K>": [["tempK", "temp-K"], 1, "temperature", ["<temp-K>"]],
      "<temp-C>": [["tempC", "temp-C"], 1, "temperature", ["<temp-K>"]],
      "<temp-F>": [["tempF", "temp-F"], 5 / 9, "temperature", ["<temp-K>"]],
      "<temp-R>": [["tempR", "temp-R"], 5 / 9, "temperature", ["<temp-K>"]],
      "<second>": [["s", "sec", "secs", "second", "seconds"], 1, "time", ["<second>"]],
      "<minute>": [["min", "mins", "minute", "minutes"], 60, "time", ["<second>"]],
      "<hour>": [["h", "hr", "hrs", "hour", "hours"], 3600, "time", ["<second>"]],
      "<day>": [["d", "day", "days"], 3600 * 24, "time", ["<second>"]],
      "<week>": [["wk", "week", "weeks"], 7 * 3600 * 24, "time", ["<second>"]],
      "<fortnight>": [["fortnight", "fortnights"], 1209600, "time", ["<second>"]],
      "<year>": [["y", "yr", "year", "years", "annum"], 31556926, "time", ["<second>"]],
      "<decade>": [["decade", "decades"], 315569260, "time", ["<second>"]],
      "<century>": [["century", "centuries"], 3155692600, "time", ["<second>"]],
      "<pascal>": [["Pa", "pascal", "Pascal"], 1, "pressure", ["<kilogram>"], ["<meter>", "<second>", "<second>"]],
      "<bar>": [["bar", "bars"], 1e5, "pressure", ["<kilogram>"], ["<meter>", "<second>", "<second>"]],
      "<mmHg>": [["mmHg"], 133.322368, "pressure", ["<kilogram>"], ["<meter>", "<second>", "<second>"]],
      "<inHg>": [["inHg"], 3386.3881472, "pressure", ["<kilogram>"], ["<meter>", "<second>", "<second>"]],
      "<torr>": [["torr"], 133.322368, "pressure", ["<kilogram>"], ["<meter>", "<second>", "<second>"]],
      "<atm>": [["atm", "ATM", "atmosphere", "atmospheres"], 101325, "pressure", ["<kilogram>"], ["<meter>", "<second>", "<second>"]],
      "<psi>": [["psi"], 6894.76, "pressure", ["<kilogram>"], ["<meter>", "<second>", "<second>"]],
      "<cmh2o>": [["cmH2O", "cmh2o"], 98.0638, "pressure", ["<kilogram>"], ["<meter>", "<second>", "<second>"]],
      "<inh2o>": [["inH2O", "inh2o"], 249.082052, "pressure", ["<kilogram>"], ["<meter>", "<second>", "<second>"]],
      "<poise>": [["P", "poise"], 0.1, "viscosity", ["<kilogram>"], ["<meter>", "<second>"]],
      "<stokes>": [["St", "stokes"], 0.0001, "viscosity", ["<meter>", "<meter>"], ["<second>"]],
      "<mole>": [["mol", "mole"], 1, "substance", ["<mole>"]],
      "<molar>": [["M", "molar"], 1000, "molar_concentration", ["<mole>"], ["<meter>", "<meter>", "<meter>"]],
      "<wtpercent>": [["wt%", "wtpercent"], 10, "molar_concentration", ["<kilogram>"], ["<meter>", "<meter>", "<meter>"]],
      "<katal>": [["kat", "katal", "Katal"], 1, "activity", ["<mole>"], ["<second>"]],
      "<unit>": [["U", "enzUnit", "unit"], 0.0000000000000016667, "activity", ["<mole>"], ["<second>"]],
      "<farad>": [["F", "farad", "Farad"], 1, "capacitance", ["<second>", "<second>", "<second>", "<second>", "<ampere>", "<ampere>"], ["<meter>", "<meter>", "<kilogram>"]],
      "<coulomb>": [["C", "coulomb", "Coulomb"], 1, "charge", ["<ampere>", "<second>"]],
      "<Ah>": [["Ah"], 3600, "charge", ["<ampere>", "<second>"]],
      "<ampere>": [["A", "Ampere", "ampere", "amp", "amps"], 1, "current", ["<ampere>"]],
      "<siemens>": [["S", "Siemens", "siemens"], 1, "conductance", ["<second>", "<second>", "<second>", "<ampere>", "<ampere>"], ["<kilogram>", "<meter>", "<meter>"]],
      "<henry>": [["H", "Henry", "henry"], 1, "inductance", ["<meter>", "<meter>", "<kilogram>"], ["<second>", "<second>", "<ampere>", "<ampere>"]],
      "<volt>": [["V", "Volt", "volt", "volts"], 1, "potential", ["<meter>", "<meter>", "<kilogram>"], ["<second>", "<second>", "<second>", "<ampere>"]],
      "<ohm>": [
        ["Ohm", "ohm", "\u03A9", "\u2126"],
        1,
        "resistance",
        ["<meter>", "<meter>", "<kilogram>"],
        ["<second>", "<second>", "<second>", "<ampere>", "<ampere>"]
      ],
      "<weber>": [["Wb", "weber", "webers"], 1, "magnetism", ["<meter>", "<meter>", "<kilogram>"], ["<second>", "<second>", "<ampere>"]],
      "<tesla>": [["T", "tesla", "teslas"], 1, "magnetism", ["<kilogram>"], ["<second>", "<second>", "<ampere>"]],
      "<gauss>": [["G", "gauss"], 0.0001, "magnetism", ["<kilogram>"], ["<second>", "<second>", "<ampere>"]],
      "<maxwell>": [["Mx", "maxwell", "maxwells"], 0.00000001, "magnetism", ["<meter>", "<meter>", "<kilogram>"], ["<second>", "<second>", "<ampere>"]],
      "<oersted>": [["Oe", "oersted", "oersteds"], 250 / Math.PI, "magnetism", ["<ampere>"], ["<meter>"]],
      "<joule>": [["J", "joule", "Joule", "joules", "Joules"], 1, "energy", ["<meter>", "<meter>", "<kilogram>"], ["<second>", "<second>"]],
      "<erg>": [["erg", "ergs"], 0.0000001, "energy", ["<meter>", "<meter>", "<kilogram>"], ["<second>", "<second>"]],
      "<btu>": [["BTU", "btu", "BTUs"], 1055.056, "energy", ["<meter>", "<meter>", "<kilogram>"], ["<second>", "<second>"]],
      "<calorie>": [["cal", "calorie", "calories"], 4.184, "energy", ["<meter>", "<meter>", "<kilogram>"], ["<second>", "<second>"]],
      "<Calorie>": [["Cal", "Calorie", "Calories"], 4184, "energy", ["<meter>", "<meter>", "<kilogram>"], ["<second>", "<second>"]],
      "<therm-US>": [["th", "therm", "therms", "Therm", "therm-US"], 105480400, "energy", ["<meter>", "<meter>", "<kilogram>"], ["<second>", "<second>"]],
      "<Wh>": [["Wh"], 3600, "energy", ["<meter>", "<meter>", "<kilogram>"], ["<second>", "<second>"]],
      "<electronvolt>": [["eV", "electronvolt", "electronvolts"], 0.0000000000000000001602176634, "energy", ["<meter>", "<meter>", "<kilogram>"], ["<second>", "<second>"]],
      "<newton>": [["N", "Newton", "newton"], 1, "force", ["<kilogram>", "<meter>"], ["<second>", "<second>"]],
      "<dyne>": [["dyn", "dyne"], 0.00001, "force", ["<kilogram>", "<meter>"], ["<second>", "<second>"]],
      "<pound-force>": [["lbf", "pound-force"], 4.448222, "force", ["<kilogram>", "<meter>"], ["<second>", "<second>"]],
      "<hertz>": [["Hz", "hertz", "Hertz"], 1, "frequency", ["<1>"], ["<second>"]],
      "<radian>": [["rad", "radian", "radians"], 1, "angle", ["<radian>"]],
      "<degree>": [["deg", "degree", "degrees"], Math.PI / 180, "angle", ["<radian>"]],
      "<arcminute>": [["arcmin", "arcminute", "arcminutes"], Math.PI / 10800, "angle", ["<radian>"]],
      "<arcsecond>": [["arcsec", "arcsecond", "arcseconds"], Math.PI / 648000, "angle", ["<radian>"]],
      "<gradian>": [["gon", "grad", "gradian", "grads"], Math.PI / 200, "angle", ["<radian>"]],
      "<steradian>": [["sr", "steradian", "steradians"], 1, "solid_angle", ["<steradian>"]],
      "<rotation>": [["rotation"], 2 * Math.PI, "angle", ["<radian>"]],
      "<rpm>": [["rpm"], 2 * Math.PI / 60, "angular_velocity", ["<radian>"], ["<second>"]],
      "<byte>": [["B", "byte", "bytes"], 1, "information", ["<byte>"]],
      "<bit>": [["b", "bit", "bits"], 0.125, "information", ["<byte>"]],
      "<Bps>": [["Bps"], 1, "information_rate", ["<byte>"], ["<second>"]],
      "<bps>": [["bps"], 0.125, "information_rate", ["<byte>"], ["<second>"]],
      "<dollar>": [["USD", "dollar"], 1, "currency", ["<dollar>"]],
      "<cents>": [["cents"], 0.01, "currency", ["<dollar>"]],
      "<candela>": [["cd", "candela"], 1, "luminosity", ["<candela>"]],
      "<lumen>": [["lm", "lumen"], 1, "luminous_power", ["<candela>", "<steradian>"]],
      "<lux>": [["lux"], 1, "illuminance", ["<candela>", "<steradian>"], ["<meter>", "<meter>"]],
      "<watt>": [["W", "watt", "watts"], 1, "power", ["<kilogram>", "<meter>", "<meter>"], ["<second>", "<second>", "<second>"]],
      "<volt-ampere>": [["VA", "volt-ampere"], 1, "power", ["<kilogram>", "<meter>", "<meter>"], ["<second>", "<second>", "<second>"]],
      "<volt-ampere-reactive>": [["var", "Var", "VAr", "VAR", "volt-ampere-reactive"], 1, "power", ["<kilogram>", "<meter>", "<meter>"], ["<second>", "<second>", "<second>"]],
      "<horsepower>": [["hp", "horsepower"], 745.699872, "power", ["<kilogram>", "<meter>", "<meter>"], ["<second>", "<second>", "<second>"]],
      "<gray>": [["Gy", "gray", "grays"], 1, "radiation", ["<meter>", "<meter>"], ["<second>", "<second>"]],
      "<roentgen>": [["R", "roentgen"], 0.00933, "radiation", ["<meter>", "<meter>"], ["<second>", "<second>"]],
      "<sievert>": [["Sv", "sievert", "sieverts"], 1, "radiation", ["<meter>", "<meter>"], ["<second>", "<second>"]],
      "<becquerel>": [["Bq", "becquerel", "becquerels"], 1, "radiation", ["<1>"], ["<second>"]],
      "<curie>": [["Ci", "curie", "curies"], 37000000000, "radiation", ["<1>"], ["<second>"]],
      "<cpm>": [["cpm"], 1 / 60, "rate", ["<count>"], ["<second>"]],
      "<dpm>": [["dpm"], 1 / 60, "rate", ["<count>"], ["<second>"]],
      "<bpm>": [["bpm"], 1 / 60, "rate", ["<count>"], ["<second>"]],
      "<dot>": [["dot", "dots"], 1, "resolution", ["<each>"]],
      "<pixel>": [["pixel", "px"], 1, "resolution", ["<each>"]],
      "<ppi>": [["ppi"], 1, "resolution", ["<pixel>"], ["<inch>"]],
      "<dpi>": [["dpi"], 1, "typography", ["<dot>"], ["<inch>"]],
      "<cell>": [["cells", "cell"], 1, "counting", ["<each>"]],
      "<each>": [["each"], 1, "counting", ["<each>"]],
      "<count>": [["count"], 1, "counting", ["<each>"]],
      "<base-pair>": [["bp", "base-pair"], 1, "counting", ["<each>"]],
      "<nucleotide>": [["nt", "nucleotide"], 1, "counting", ["<each>"]],
      "<molecule>": [["molecule", "molecules"], 1, "counting", ["<1>"]],
      "<dozen>": [["doz", "dz", "dozen"], 12, "prefix_only", ["<each>"]],
      "<percent>": [["%", "percent"], 0.01, "prefix_only", ["<1>"]],
      "<ppm>": [["ppm"], 0.000001, "prefix_only", ["<1>"]],
      "<ppb>": [["ppb"], 0.000000001, "prefix_only", ["<1>"]],
      "<ppt>": [["ppt"], 0.000000000001, "prefix_only", ["<1>"]],
      "<ppq>": [["ppq"], 0.000000000000001, "prefix_only", ["<1>"]],
      "<gross>": [["gr", "gross"], 144, "prefix_only", ["<dozen>", "<dozen>"]],
      "<decibel>": [["dB", "decibel", "decibels"], 1, "logarithmic", ["<decibel>"]]
    };
    var BASE_UNITS = ["<meter>", "<kilogram>", "<second>", "<mole>", "<ampere>", "<radian>", "<kelvin>", "<temp-K>", "<byte>", "<dollar>", "<candela>", "<each>", "<steradian>", "<decibel>"];
    var UNITY = "<1>";
    var UNITY_ARRAY = [UNITY];
    function validateUnitDefinition(unitDef2, definition2) {
      var scalar = definition2[1];
      var numerator = definition2[3] || [];
      var denominator = definition2[4] || [];
      if (!isNumber(scalar)) {
        throw new QtyError(unitDef2 + ": Invalid unit definition. 'scalar' must be a number");
      }
      numerator.forEach(function(unit) {
        if (UNITS[unit] === undefined) {
          throw new QtyError(unitDef2 + ": Invalid unit definition. Unit " + unit + " in 'numerator' is not recognized");
        }
      });
      denominator.forEach(function(unit) {
        if (UNITS[unit] === undefined) {
          throw new QtyError(unitDef2 + ": Invalid unit definition. Unit " + unit + " in 'denominator' is not recognized");
        }
      });
    }
    var PREFIX_VALUES = {};
    var PREFIX_MAP = {};
    var UNIT_VALUES = {};
    var UNIT_MAP = {};
    var OUTPUT_MAP = {};
    for (var unitDef in UNITS) {
      if (UNITS.hasOwnProperty(unitDef)) {
        var definition = UNITS[unitDef];
        if (definition[2] === "prefix") {
          PREFIX_VALUES[unitDef] = definition[1];
          for (var i = 0;i < definition[0].length; i++) {
            PREFIX_MAP[definition[0][i]] = unitDef;
          }
        } else {
          validateUnitDefinition(unitDef, definition);
          UNIT_VALUES[unitDef] = {
            scalar: definition[1],
            numerator: definition[3],
            denominator: definition[4]
          };
          for (var j = 0;j < definition[0].length; j++) {
            UNIT_MAP[definition[0][j]] = unitDef;
          }
        }
        OUTPUT_MAP[unitDef] = definition[0][0];
      }
    }
    function getUnits(kind) {
      var i2;
      var units = [];
      var unitKeys = Object.keys(UNITS);
      if (typeof kind === "undefined") {
        for (i2 = 0;i2 < unitKeys.length; i2++) {
          if (["", "prefix"].indexOf(UNITS[unitKeys[i2]][2]) === -1) {
            units.push(unitKeys[i2].substr(1, unitKeys[i2].length - 2));
          }
        }
      } else if (this.getKinds().indexOf(kind) === -1) {
        throw new QtyError("Kind not recognized");
      } else {
        for (i2 = 0;i2 < unitKeys.length; i2++) {
          if (UNITS[unitKeys[i2]][2] === kind) {
            units.push(unitKeys[i2].substr(1, unitKeys[i2].length - 2));
          }
        }
      }
      return units.sort(function(a, b) {
        if (a.toLowerCase() < b.toLowerCase()) {
          return -1;
        }
        if (a.toLowerCase() > b.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    }
    function getAliases(unitName) {
      if (!UNIT_MAP[unitName]) {
        throw new QtyError("Unit not recognized");
      }
      return UNITS[UNIT_MAP[unitName]][0];
    }
    var SIGNATURE_VECTOR = ["length", "time", "temperature", "mass", "current", "substance", "luminosity", "currency", "information", "angle"];
    function unitSignature() {
      if (this.signature) {
        return this.signature;
      }
      var vector = unitSignatureVector.call(this);
      for (var i2 = 0;i2 < vector.length; i2++) {
        vector[i2] *= Math.pow(20, i2);
      }
      return vector.reduce(function(previous, current) {
        return previous + current;
      }, 0);
    }
    function unitSignatureVector() {
      if (!this.isBase()) {
        return unitSignatureVector.call(this.toBase());
      }
      var vector = new Array(SIGNATURE_VECTOR.length);
      for (var i2 = 0;i2 < vector.length; i2++) {
        vector[i2] = 0;
      }
      var r, n;
      for (var j2 = 0;j2 < this.numerator.length; j2++) {
        if (r = UNITS[this.numerator[j2]]) {
          n = SIGNATURE_VECTOR.indexOf(r[2]);
          if (n >= 0) {
            vector[n] = vector[n] + 1;
          }
        }
      }
      for (var k = 0;k < this.denominator.length; k++) {
        if (r = UNITS[this.denominator[k]]) {
          n = SIGNATURE_VECTOR.indexOf(r[2]);
          if (n >= 0) {
            vector[n] = vector[n] - 1;
          }
        }
      }
      return vector;
    }
    var SIGN = "[+-]";
    var INTEGER = "\\d+";
    var SIGNED_INTEGER = SIGN + "?" + INTEGER;
    var FRACTION = "\\." + INTEGER;
    var FLOAT = "(?:" + INTEGER + "(?:" + FRACTION + ")?)|(?:" + FRACTION + ")";
    var EXPONENT = "[Ee]" + SIGNED_INTEGER;
    var SCI_NUMBER = "(?:" + FLOAT + ")(?:" + EXPONENT + ")?";
    var SIGNED_NUMBER = SIGN + "?\\s*" + SCI_NUMBER;
    var QTY_STRING = "(" + SIGNED_NUMBER + ")?" + "\\s*([^/]*)(?:/(.+))?";
    var QTY_STRING_REGEX = new RegExp("^" + QTY_STRING + "$");
    var POWER_OP = "\\^|\\*{2}";
    var SAFE_POWER = "[01234]";
    var TOP_REGEX = new RegExp("([^ \\*\\d]+?)(?:" + POWER_OP + ")?(-?" + SAFE_POWER + "(?![a-zA-Z]))");
    var BOTTOM_REGEX = new RegExp("([^ \\*\\d]+?)(?:" + POWER_OP + ")?(" + SAFE_POWER + "(?![a-zA-Z]))");
    function parse(val) {
      if (!isString(val)) {
        val = val.toString();
      }
      val = val.trim();
      var result = QTY_STRING_REGEX.exec(val);
      if (!result) {
        throw new QtyError(val + ": Quantity not recognized");
      }
      var scalarMatch = result[1];
      if (scalarMatch) {
        scalarMatch = scalarMatch.replace(/\s/g, "");
        this.scalar = parseFloat(scalarMatch);
      } else {
        this.scalar = 1;
      }
      var top = result[2];
      var bottom = result[3];
      var n, x, nx;
      while (result = TOP_REGEX.exec(top)) {
        n = parseFloat(result[2]);
        if (isNaN(n)) {
          throw new QtyError("Unit exponent is not a number");
        }
        if (n === 0 && !UNIT_TEST_REGEX.test(result[1])) {
          throw new QtyError("Unit not recognized");
        }
        x = result[1] + " ";
        nx = "";
        for (var i2 = 0;i2 < Math.abs(n); i2++) {
          nx += x;
        }
        if (n >= 0) {
          top = top.replace(result[0], nx);
        } else {
          bottom = bottom ? bottom + nx : nx;
          top = top.replace(result[0], "");
        }
      }
      while (result = BOTTOM_REGEX.exec(bottom)) {
        n = parseFloat(result[2]);
        if (isNaN(n)) {
          throw new QtyError("Unit exponent is not a number");
        }
        if (n === 0 && !UNIT_TEST_REGEX.test(result[1])) {
          throw new QtyError("Unit not recognized");
        }
        x = result[1] + " ";
        nx = "";
        for (var j2 = 0;j2 < n; j2++) {
          nx += x;
        }
        bottom = bottom.replace(result[0], nx);
      }
      if (top) {
        this.numerator = parseUnits(top.trim());
      }
      if (bottom) {
        this.denominator = parseUnits(bottom.trim());
      }
    }
    var PREFIX_REGEX = Object.keys(PREFIX_MAP).sort(function(a, b) {
      return b.length - a.length;
    }).join("|");
    var UNIT_REGEX = Object.keys(UNIT_MAP).sort(function(a, b) {
      return b.length - a.length;
    }).join("|");
    var BOUNDARY_REGEX = "\\b|$";
    var UNIT_MATCH = "(" + PREFIX_REGEX + ")??(" + UNIT_REGEX + ")(?:" + BOUNDARY_REGEX + ")";
    var UNIT_TEST_REGEX = new RegExp("^\\s*(" + UNIT_MATCH + "[\\s\\*]*)+$");
    var UNIT_MATCH_REGEX = new RegExp(UNIT_MATCH, "g");
    var parsedUnitsCache = {};
    function parseUnits(units) {
      var cached = parsedUnitsCache[units];
      if (cached) {
        return cached;
      }
      var unitMatch, normalizedUnits = [];
      if (!UNIT_TEST_REGEX.test(units)) {
        throw new QtyError("Unit not recognized");
      }
      while (unitMatch = UNIT_MATCH_REGEX.exec(units)) {
        normalizedUnits.push(unitMatch.slice(1));
      }
      normalizedUnits = normalizedUnits.map(function(item) {
        return PREFIX_MAP[item[0]] ? [PREFIX_MAP[item[0]], UNIT_MAP[item[1]]] : [UNIT_MAP[item[1]]];
      });
      normalizedUnits = normalizedUnits.reduce(function(a, b) {
        return a.concat(b);
      }, []);
      normalizedUnits = normalizedUnits.filter(function(item) {
        return item;
      });
      parsedUnitsCache[units] = normalizedUnits;
      return normalizedUnits;
    }
    function globalParse(value) {
      if (!isString(value)) {
        throw new QtyError("Argument should be a string");
      }
      try {
        return this(value);
      } catch (e) {
        return null;
      }
    }
    function isQty(value) {
      return value instanceof Qty;
    }
    function Qty(initValue, initUnits) {
      assertValidConstructorArgs.apply(null, arguments);
      if (!isQty(this)) {
        return new Qty(initValue, initUnits);
      }
      this.scalar = null;
      this.baseScalar = null;
      this.signature = null;
      this._conversionCache = {};
      this.numerator = UNITY_ARRAY;
      this.denominator = UNITY_ARRAY;
      if (isDefinitionObject(initValue)) {
        this.scalar = initValue.scalar;
        this.numerator = initValue.numerator && initValue.numerator.length !== 0 ? initValue.numerator : UNITY_ARRAY;
        this.denominator = initValue.denominator && initValue.denominator.length !== 0 ? initValue.denominator : UNITY_ARRAY;
      } else if (initUnits) {
        parse.call(this, initUnits);
        this.scalar = initValue;
      } else {
        parse.call(this, initValue);
      }
      if (this.denominator.join("*").indexOf("temp") >= 0) {
        throw new QtyError("Cannot divide with temperatures");
      }
      if (this.numerator.join("*").indexOf("temp") >= 0) {
        if (this.numerator.length > 1) {
          throw new QtyError("Cannot multiply by temperatures");
        }
        if (!compareArray(this.denominator, UNITY_ARRAY)) {
          throw new QtyError("Cannot divide with temperatures");
        }
      }
      this.initValue = initValue;
      updateBaseScalar.call(this);
      if (this.isTemperature() && this.baseScalar < 0) {
        throw new QtyError("Temperatures must not be less than absolute zero");
      }
    }
    Qty.prototype = {
      constructor: Qty
    };
    function assertValidConstructorArgs(value, units) {
      if (units) {
        if (!(isNumber(value) && isString(units))) {
          throw new QtyError("Only number accepted as initialization value when units are explicitly provided");
        }
      } else {
        if (!(isString(value) || isNumber(value) || isQty(value) || isDefinitionObject(value))) {
          throw new QtyError("Only string, number or quantity accepted as single initialization value");
        }
      }
    }
    function isDefinitionObject(value) {
      return value && typeof value === "object" && value.hasOwnProperty("scalar");
    }
    function updateBaseScalar() {
      if (this.baseScalar) {
        return this.baseScalar;
      }
      if (this.isBase()) {
        this.baseScalar = this.scalar;
        this.signature = unitSignature.call(this);
      } else {
        var base = this.toBase();
        this.baseScalar = base.scalar;
        this.signature = base.signature;
      }
    }
    var KINDS = {
      "-312078": "elastance",
      "-312058": "resistance",
      "-312038": "inductance",
      "-152058": "potential",
      "-152040": "magnetism",
      "-152038": "magnetism",
      "-7997": "specific_volume",
      "-79": "snap",
      "-59": "jolt",
      "-39": "acceleration",
      "-38": "radiation",
      "-20": "frequency",
      "-19": "speed",
      "-18": "viscosity",
      "-17": "volumetric_flow",
      "-1": "wavenumber",
      "0": "unitless",
      "1": "length",
      "2": "area",
      "3": "volume",
      "20": "time",
      "400": "temperature",
      "7941": "yank",
      "7942": "power",
      "7959": "pressure",
      "7961": "force",
      "7962": "energy",
      "7979": "viscosity",
      "7981": "momentum",
      "7982": "angular_momentum",
      "7997": "density",
      "7998": "area_density",
      "8000": "mass",
      "152020": "radiation_exposure",
      "159999": "magnetism",
      "160000": "current",
      "160020": "charge",
      "312058": "conductance",
      "312078": "capacitance",
      "3199980": "activity",
      "3199997": "molar_concentration",
      "3200000": "substance",
      "63999998": "illuminance",
      "64000000": "luminous_power",
      "1280000000": "currency",
      "25599999980": "information_rate",
      "25600000000": "information",
      "511999999980": "angular_velocity",
      "512000000000": "angle"
    };
    function getKinds() {
      return uniq(Object.keys(KINDS).map(function(knownSignature) {
        return KINDS[knownSignature];
      }));
    }
    Qty.prototype.kind = function() {
      return KINDS[this.signature.toString()];
    };
    assign(Qty.prototype, {
      isDegrees: function() {
        return (this.signature === null || this.signature === 400) && this.numerator.length === 1 && compareArray(this.denominator, UNITY_ARRAY) && (this.numerator[0].match(/<temp-[CFRK]>/) || this.numerator[0].match(/<(kelvin|celsius|rankine|fahrenheit)>/));
      },
      isTemperature: function() {
        return this.isDegrees() && this.numerator[0].match(/<temp-[CFRK]>/);
      }
    });
    function subtractTemperatures(lhs, rhs) {
      var lhsUnits = lhs.units();
      var rhsConverted = rhs.to(lhsUnits);
      var dstDegrees = Qty(getDegreeUnits(lhsUnits));
      return Qty({ scalar: lhs.scalar - rhsConverted.scalar, numerator: dstDegrees.numerator, denominator: dstDegrees.denominator });
    }
    function subtractTempDegrees(temp, deg) {
      var tempDegrees = deg.to(getDegreeUnits(temp.units()));
      return Qty({ scalar: temp.scalar - tempDegrees.scalar, numerator: temp.numerator, denominator: temp.denominator });
    }
    function addTempDegrees(temp, deg) {
      var tempDegrees = deg.to(getDegreeUnits(temp.units()));
      return Qty({ scalar: temp.scalar + tempDegrees.scalar, numerator: temp.numerator, denominator: temp.denominator });
    }
    function getDegreeUnits(units) {
      if (units === "tempK") {
        return "degK";
      } else if (units === "tempC") {
        return "degC";
      } else if (units === "tempF") {
        return "degF";
      } else if (units === "tempR") {
        return "degR";
      } else {
        throw new QtyError("Unknown type for temp conversion from: " + units);
      }
    }
    function toDegrees(src, dst) {
      var srcDegK = toDegK(src);
      var dstUnits = dst.units();
      var dstScalar;
      if (dstUnits === "degK") {
        dstScalar = srcDegK.scalar;
      } else if (dstUnits === "degC") {
        dstScalar = srcDegK.scalar;
      } else if (dstUnits === "degF") {
        dstScalar = srcDegK.scalar * 9 / 5;
      } else if (dstUnits === "degR") {
        dstScalar = srcDegK.scalar * 9 / 5;
      } else {
        throw new QtyError("Unknown type for degree conversion to: " + dstUnits);
      }
      return Qty({ scalar: dstScalar, numerator: dst.numerator, denominator: dst.denominator });
    }
    function toDegK(qty) {
      var units = qty.units();
      var q;
      if (units.match(/(deg)[CFRK]/)) {
        q = qty.baseScalar;
      } else if (units === "tempK") {
        q = qty.scalar;
      } else if (units === "tempC") {
        q = qty.scalar;
      } else if (units === "tempF") {
        q = qty.scalar * 5 / 9;
      } else if (units === "tempR") {
        q = qty.scalar * 5 / 9;
      } else {
        throw new QtyError("Unknown type for temp conversion from: " + units);
      }
      return Qty({ scalar: q, numerator: ["<kelvin>"], denominator: UNITY_ARRAY });
    }
    function toTemp(src, dst) {
      var dstUnits = dst.units();
      var dstScalar;
      if (dstUnits === "tempK") {
        dstScalar = src.baseScalar;
      } else if (dstUnits === "tempC") {
        dstScalar = src.baseScalar - 273.15;
      } else if (dstUnits === "tempF") {
        dstScalar = src.baseScalar * 9 / 5 - 459.67;
      } else if (dstUnits === "tempR") {
        dstScalar = src.baseScalar * 9 / 5;
      } else {
        throw new QtyError("Unknown type for temp conversion to: " + dstUnits);
      }
      return Qty({ scalar: dstScalar, numerator: dst.numerator, denominator: dst.denominator });
    }
    function toTempK(qty) {
      var units = qty.units();
      var q;
      if (units.match(/(deg)[CFRK]/)) {
        q = qty.baseScalar;
      } else if (units === "tempK") {
        q = qty.scalar;
      } else if (units === "tempC") {
        q = qty.scalar + 273.15;
      } else if (units === "tempF") {
        q = (qty.scalar + 459.67) * 5 / 9;
      } else if (units === "tempR") {
        q = qty.scalar * 5 / 9;
      } else {
        throw new QtyError("Unknown type for temp conversion from: " + units);
      }
      return Qty({ scalar: q, numerator: ["<temp-K>"], denominator: UNITY_ARRAY });
    }
    assign(Qty.prototype, {
      to: function(other) {
        var cached, target;
        if (other === undefined || other === null) {
          return this;
        }
        if (!isString(other)) {
          return this.to(other.units());
        }
        cached = this._conversionCache[other];
        if (cached) {
          return cached;
        }
        target = Qty(other);
        if (target.units() === this.units()) {
          return this;
        }
        if (!this.isCompatible(target)) {
          if (this.isInverse(target)) {
            target = this.inverse().to(other);
          } else {
            throwIncompatibleUnits(this.units(), target.units());
          }
        } else {
          if (target.isTemperature()) {
            target = toTemp(this, target);
          } else if (target.isDegrees()) {
            target = toDegrees(this, target);
          } else {
            var q = divSafe(this.baseScalar, target.baseScalar);
            target = Qty({ scalar: q, numerator: target.numerator, denominator: target.denominator });
          }
        }
        this._conversionCache[other] = target;
        return target;
      },
      toBase: function() {
        if (this.isBase()) {
          return this;
        }
        if (this.isTemperature()) {
          return toTempK(this);
        }
        var cached = baseUnitCache[this.units()];
        if (!cached) {
          cached = toBaseUnits(this.numerator, this.denominator);
          baseUnitCache[this.units()] = cached;
        }
        return cached.mul(this.scalar);
      },
      toFloat: function() {
        if (this.isUnitless()) {
          return this.scalar;
        }
        throw new QtyError("Can't convert to Float unless unitless.  Use Unit#scalar");
      },
      toPrec: function(precQuantity) {
        if (isString(precQuantity)) {
          precQuantity = Qty(precQuantity);
        }
        if (isNumber(precQuantity)) {
          precQuantity = Qty(precQuantity + " " + this.units());
        }
        if (!this.isUnitless()) {
          precQuantity = precQuantity.to(this.units());
        } else if (!precQuantity.isUnitless()) {
          throwIncompatibleUnits(this.units(), precQuantity.units());
        }
        if (precQuantity.scalar === 0) {
          throw new QtyError("Divide by zero");
        }
        var precRoundedResult = mulSafe(Math.round(this.scalar / precQuantity.scalar), precQuantity.scalar);
        return Qty(precRoundedResult + this.units());
      }
    });
    function swiftConverter(srcUnits, dstUnits) {
      var srcQty = Qty(srcUnits);
      var dstQty = Qty(dstUnits);
      if (srcQty.eq(dstQty)) {
        return identity;
      }
      var convert;
      if (!srcQty.isTemperature()) {
        convert = function(value) {
          return value * srcQty.baseScalar / dstQty.baseScalar;
        };
      } else {
        convert = function(value) {
          return srcQty.mul(value).to(dstQty).scalar;
        };
      }
      return function converter(value) {
        var i2, length, result;
        if (!Array.isArray(value)) {
          return convert(value);
        } else {
          length = value.length;
          result = [];
          for (i2 = 0;i2 < length; i2++) {
            result.push(convert(value[i2]));
          }
          return result;
        }
      };
    }
    var baseUnitCache = {};
    function toBaseUnits(numerator, denominator) {
      var num = [];
      var den = [];
      var q = 1;
      var unit;
      for (var i2 = 0;i2 < numerator.length; i2++) {
        unit = numerator[i2];
        if (PREFIX_VALUES[unit]) {
          q = mulSafe(q, PREFIX_VALUES[unit]);
        } else {
          if (UNIT_VALUES[unit]) {
            q *= UNIT_VALUES[unit].scalar;
            if (UNIT_VALUES[unit].numerator) {
              num.push(UNIT_VALUES[unit].numerator);
            }
            if (UNIT_VALUES[unit].denominator) {
              den.push(UNIT_VALUES[unit].denominator);
            }
          }
        }
      }
      for (var j2 = 0;j2 < denominator.length; j2++) {
        unit = denominator[j2];
        if (PREFIX_VALUES[unit]) {
          q /= PREFIX_VALUES[unit];
        } else {
          if (UNIT_VALUES[unit]) {
            q /= UNIT_VALUES[unit].scalar;
            if (UNIT_VALUES[unit].numerator) {
              den.push(UNIT_VALUES[unit].numerator);
            }
            if (UNIT_VALUES[unit].denominator) {
              num.push(UNIT_VALUES[unit].denominator);
            }
          }
        }
      }
      num = num.reduce(function(a, b) {
        return a.concat(b);
      }, []);
      den = den.reduce(function(a, b) {
        return a.concat(b);
      }, []);
      return Qty({ scalar: q, numerator: num, denominator: den });
    }
    Qty.parse = globalParse;
    Qty.getUnits = getUnits;
    Qty.getAliases = getAliases;
    Qty.mulSafe = mulSafe;
    Qty.divSafe = divSafe;
    Qty.getKinds = getKinds;
    Qty.swiftConverter = swiftConverter;
    Qty.Error = QtyError;
    assign(Qty.prototype, {
      add: function(other) {
        if (isString(other)) {
          other = Qty(other);
        }
        if (!this.isCompatible(other)) {
          throwIncompatibleUnits(this.units(), other.units());
        }
        if (this.isTemperature() && other.isTemperature()) {
          throw new QtyError("Cannot add two temperatures");
        } else if (this.isTemperature()) {
          return addTempDegrees(this, other);
        } else if (other.isTemperature()) {
          return addTempDegrees(other, this);
        }
        return Qty({ scalar: this.scalar + other.to(this).scalar, numerator: this.numerator, denominator: this.denominator });
      },
      sub: function(other) {
        if (isString(other)) {
          other = Qty(other);
        }
        if (!this.isCompatible(other)) {
          throwIncompatibleUnits(this.units(), other.units());
        }
        if (this.isTemperature() && other.isTemperature()) {
          return subtractTemperatures(this, other);
        } else if (this.isTemperature()) {
          return subtractTempDegrees(this, other);
        } else if (other.isTemperature()) {
          throw new QtyError("Cannot subtract a temperature from a differential degree unit");
        }
        return Qty({ scalar: this.scalar - other.to(this).scalar, numerator: this.numerator, denominator: this.denominator });
      },
      mul: function(other) {
        if (isNumber(other)) {
          return Qty({ scalar: mulSafe(this.scalar, other), numerator: this.numerator, denominator: this.denominator });
        } else if (isString(other)) {
          other = Qty(other);
        }
        if ((this.isTemperature() || other.isTemperature()) && !(this.isUnitless() || other.isUnitless())) {
          throw new QtyError("Cannot multiply by temperatures");
        }
        var op1 = this;
        var op2 = other;
        if (op1.isCompatible(op2) && op1.signature !== 400) {
          op2 = op2.to(op1);
        }
        var numdenscale = cleanTerms(op1.numerator, op1.denominator, op2.numerator, op2.denominator);
        return Qty({ scalar: mulSafe(op1.scalar, op2.scalar, numdenscale[2]), numerator: numdenscale[0], denominator: numdenscale[1] });
      },
      div: function(other) {
        if (isNumber(other)) {
          if (other === 0) {
            throw new QtyError("Divide by zero");
          }
          return Qty({ scalar: this.scalar / other, numerator: this.numerator, denominator: this.denominator });
        } else if (isString(other)) {
          other = Qty(other);
        }
        if (other.scalar === 0) {
          throw new QtyError("Divide by zero");
        }
        if (other.isTemperature()) {
          throw new QtyError("Cannot divide with temperatures");
        } else if (this.isTemperature() && !other.isUnitless()) {
          throw new QtyError("Cannot divide with temperatures");
        }
        var op1 = this;
        var op2 = other;
        if (op1.isCompatible(op2) && op1.signature !== 400) {
          op2 = op2.to(op1);
        }
        var numdenscale = cleanTerms(op1.numerator, op1.denominator, op2.denominator, op2.numerator);
        return Qty({ scalar: mulSafe(op1.scalar, numdenscale[2]) / op2.scalar, numerator: numdenscale[0], denominator: numdenscale[1] });
      },
      inverse: function() {
        if (this.isTemperature()) {
          throw new QtyError("Cannot divide with temperatures");
        }
        if (this.scalar === 0) {
          throw new QtyError("Divide by zero");
        }
        return Qty({ scalar: 1 / this.scalar, numerator: this.denominator, denominator: this.numerator });
      }
    });
    function cleanTerms(num1, den1, num2, den2) {
      function notUnity(val) {
        return val !== UNITY;
      }
      num1 = num1.filter(notUnity);
      num2 = num2.filter(notUnity);
      den1 = den1.filter(notUnity);
      den2 = den2.filter(notUnity);
      var combined = {};
      function combineTerms(terms, direction) {
        var k;
        var prefix;
        var prefixValue;
        for (var i2 = 0;i2 < terms.length; i2++) {
          if (PREFIX_VALUES[terms[i2]]) {
            k = terms[i2 + 1];
            prefix = terms[i2];
            prefixValue = PREFIX_VALUES[prefix];
            i2++;
          } else {
            k = terms[i2];
            prefix = null;
            prefixValue = 1;
          }
          if (k && k !== UNITY) {
            if (combined[k]) {
              combined[k][0] += direction;
              var combinedPrefixValue = combined[k][2] ? PREFIX_VALUES[combined[k][2]] : 1;
              combined[k][direction === 1 ? 3 : 4] *= divSafe(prefixValue, combinedPrefixValue);
            } else {
              combined[k] = [direction, k, prefix, 1, 1];
            }
          }
        }
      }
      combineTerms(num1, 1);
      combineTerms(den1, -1);
      combineTerms(num2, 1);
      combineTerms(den2, -1);
      var num = [];
      var den = [];
      var scale = 1;
      for (var prop in combined) {
        if (combined.hasOwnProperty(prop)) {
          var item = combined[prop];
          var n;
          if (item[0] > 0) {
            for (n = 0;n < item[0]; n++) {
              num.push(item[2] === null ? item[1] : [item[2], item[1]]);
            }
          } else if (item[0] < 0) {
            for (n = 0;n < -item[0]; n++) {
              den.push(item[2] === null ? item[1] : [item[2], item[1]]);
            }
          }
          scale *= divSafe(item[3], item[4]);
        }
      }
      if (num.length === 0) {
        num = UNITY_ARRAY;
      }
      if (den.length === 0) {
        den = UNITY_ARRAY;
      }
      num = num.reduce(function(a, b) {
        return a.concat(b);
      }, []);
      den = den.reduce(function(a, b) {
        return a.concat(b);
      }, []);
      return [num, den, scale];
    }
    assign(Qty.prototype, {
      eq: function(other) {
        return this.compareTo(other) === 0;
      },
      lt: function(other) {
        return this.compareTo(other) === -1;
      },
      lte: function(other) {
        return this.eq(other) || this.lt(other);
      },
      gt: function(other) {
        return this.compareTo(other) === 1;
      },
      gte: function(other) {
        return this.eq(other) || this.gt(other);
      },
      compareTo: function(other) {
        if (isString(other)) {
          return this.compareTo(Qty(other));
        }
        if (!this.isCompatible(other)) {
          throwIncompatibleUnits(this.units(), other.units());
        }
        if (this.baseScalar < other.baseScalar) {
          return -1;
        } else if (this.baseScalar === other.baseScalar) {
          return 0;
        } else if (this.baseScalar > other.baseScalar) {
          return 1;
        }
      },
      same: function(other) {
        return this.scalar === other.scalar && this.units() === other.units();
      }
    });
    assign(Qty.prototype, {
      isUnitless: function() {
        return [this.numerator, this.denominator].every(function(item) {
          return compareArray(item, UNITY_ARRAY);
        });
      },
      isCompatible: function(other) {
        if (isString(other)) {
          return this.isCompatible(Qty(other));
        }
        if (!isQty(other)) {
          return false;
        }
        if (other.signature !== undefined) {
          return this.signature === other.signature;
        } else {
          return false;
        }
      },
      isInverse: function(other) {
        return this.inverse().isCompatible(other);
      },
      isBase: function() {
        if (this._isBase !== undefined) {
          return this._isBase;
        }
        if (this.isDegrees() && this.numerator[0].match(/<(kelvin|temp-K)>/)) {
          this._isBase = true;
          return this._isBase;
        }
        this.numerator.concat(this.denominator).forEach(function(item) {
          if (item !== UNITY && BASE_UNITS.indexOf(item) === -1) {
            this._isBase = false;
          }
        }, this);
        if (this._isBase === false) {
          return this._isBase;
        }
        this._isBase = true;
        return this._isBase;
      }
    });
    function NestedMap() {
    }
    NestedMap.prototype.get = function(keys) {
      if (arguments.length > 1) {
        keys = Array.apply(null, arguments);
      }
      return keys.reduce(function(map, key, index) {
        if (map) {
          var childMap = map[key];
          if (index === keys.length - 1) {
            return childMap ? childMap.data : undefined;
          } else {
            return childMap;
          }
        }
      }, this);
    };
    NestedMap.prototype.set = function(keys, value) {
      if (arguments.length > 2) {
        keys = Array.prototype.slice.call(arguments, 0, -1);
        value = arguments[arguments.length - 1];
      }
      return keys.reduce(function(map, key, index) {
        var childMap = map[key];
        if (childMap === undefined) {
          childMap = map[key] = {};
        }
        if (index === keys.length - 1) {
          childMap.data = value;
          return value;
        } else {
          return childMap;
        }
      }, this);
    };
    function defaultFormatter(scalar, units) {
      return (scalar + " " + units).trim();
    }
    Qty.formatter = defaultFormatter;
    assign(Qty.prototype, {
      units: function() {
        if (this._units !== undefined) {
          return this._units;
        }
        var numIsUnity = compareArray(this.numerator, UNITY_ARRAY);
        var denIsUnity = compareArray(this.denominator, UNITY_ARRAY);
        if (numIsUnity && denIsUnity) {
          this._units = "";
          return this._units;
        }
        var numUnits = stringifyUnits(this.numerator);
        var denUnits = stringifyUnits(this.denominator);
        this._units = numUnits + (denIsUnity ? "" : "/" + denUnits);
        return this._units;
      },
      toString: function(targetUnitsOrMaxDecimalsOrPrec, maxDecimals) {
        var targetUnits;
        if (isNumber(targetUnitsOrMaxDecimalsOrPrec)) {
          targetUnits = this.units();
          maxDecimals = targetUnitsOrMaxDecimalsOrPrec;
        } else if (isString(targetUnitsOrMaxDecimalsOrPrec)) {
          targetUnits = targetUnitsOrMaxDecimalsOrPrec;
        } else if (isQty(targetUnitsOrMaxDecimalsOrPrec)) {
          return this.toPrec(targetUnitsOrMaxDecimalsOrPrec).toString(maxDecimals);
        }
        var out = this.to(targetUnits);
        var outScalar = maxDecimals !== undefined ? round(out.scalar, maxDecimals) : out.scalar;
        out = (outScalar + " " + out.units()).trim();
        return out;
      },
      format: function(targetUnits, formatter) {
        if (arguments.length === 1) {
          if (typeof targetUnits === "function") {
            formatter = targetUnits;
            targetUnits = undefined;
          }
        }
        formatter = formatter || Qty.formatter;
        var targetQty = this.to(targetUnits);
        return formatter.call(this, targetQty.scalar, targetQty.units());
      }
    });
    var stringifiedUnitsCache = new NestedMap;
    function stringifyUnits(units) {
      var stringified = stringifiedUnitsCache.get(units);
      if (stringified) {
        return stringified;
      }
      var isUnity = compareArray(units, UNITY_ARRAY);
      if (isUnity) {
        stringified = "1";
      } else {
        stringified = simplify(getOutputNames(units)).join("*");
      }
      stringifiedUnitsCache.set(units, stringified);
      return stringified;
    }
    function getOutputNames(units) {
      var unitNames = [], token, tokenNext;
      for (var i2 = 0;i2 < units.length; i2++) {
        token = units[i2];
        tokenNext = units[i2 + 1];
        if (PREFIX_VALUES[token]) {
          unitNames.push(OUTPUT_MAP[token] + OUTPUT_MAP[tokenNext]);
          i2++;
        } else {
          unitNames.push(OUTPUT_MAP[token]);
        }
      }
      return unitNames;
    }
    function simplify(units) {
      var unitCounts = units.reduce(function(acc, unit) {
        var unitCounter = acc[unit];
        if (!unitCounter) {
          acc.push(unitCounter = acc[unit] = [unit, 0]);
        }
        unitCounter[1]++;
        return acc;
      }, []);
      return unitCounts.map(function(unitCount) {
        return unitCount[0] + (unitCount[1] > 1 ? unitCount[1] : "");
      });
    }
    Qty.version = "1.8.0";
    return Qty;
  });
});

// recipeseme/helper
function jsx(tag, props, ...children) {
  return new tag({ ...props, children });
}
// recipeseme/helpers.t
function parseAmount(options) {
  if (options === undefined) {
    return;
  }
  let quantity = undefined;
  let unit = undefined;
  if (typeof options === "number") {
    quantity = options;
  }
  if (typeof options === "string") {
    const match = options.match(regexp);
    const { rawQuantity, rawUnit } = match?.groups ?? {};
    quantity = rawQuantity ? Number(rawQuantity) : undefined;
    unit = rawUnit;
  }
  if (options instanceof Amount) {
    quantity = options.quantity;
    unit = options.unit;
  }
  return new Amount({ quantity, unit });
}
var regexp = /(?<rawQuantity>\d+)(?<separator>\W+)?(?<rawUnit>\w+)?/;

class Amount {
  quantity;
  unit;
  constructor(props) {
    this.quantity = props.quantity;
    this.unit = props.unit;
  }
}

// recipeseme/helpers.ts
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

// recipeseme/helpers.tsities/bu
class RecipeContainer {
  children;
  constructor(props) {
    this.children = Array.isArray(props.children) ? props.children : [props.children];
  }
}

// recipeseme/helpers.t
class Recipe extends RecipeContainer {
  name;
  meal;
  servings;
  constructor(props) {
    super(props);
    this.name = props.name;
    this.meal = new Options(props.meal);
    this.servings = parseAmount(props.servings);
  }
}

class Directions extends RecipeContainer {
  constructor() {
    super(...arguments);
  }
}

class Ingredients extends RecipeContainer {
  constructor() {
    super(...arguments);
  }
}

class Preparation extends RecipeContainer {
  constructor() {
    super(...arguments);
  }
}
// recipeseme/helpers.tsi
var import_js_quantities = __toESM(require_quantities(), 1);
function parseQuantity(value) {
  try {
    return new import_js_quantities.default(value);
  } catch {
    return;
  }
}

// recipeseme/helpers.ts
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

// recipeseme/helpers.tsiti
class Ingredient {
  key;
  name;
  quantity;
  category;
  manipulation;
  constructor(props) {
    this.key = props.key;
    this.name = joinStringChildren(props.children) ?? props.name;
    this.quantity = parseQuantity(props.quantity);
    this.category = new Options(props.category);
    this.manipulation = new Options(props.manipulation);
  }
}
// recipeseme/helpers
class Step extends RecipeContainer {
  duration;
  constructor(props) {
    super(props);
    this.duration = parseAmount(props.duration);
  }
}
// recipeseme/hel
var recipes = {};
// recipeseme/helpers.tsiti
function buildCookbook() {
  const list = Object.keys(recipes);
  const groups = Object.values(recipes).reduce((groups2, recipe) => {
    for (const group of recipe.meal) {
      if (!groups2[group]) {
        groups2[group] = [];
      }
      groups2[group].push(recipe.name);
      return groups2;
    }
  }, {});
  function getRandomRecipe(group = []) {
    return group[Math.floor(Math.random() * group.length)];
  }
  cookbook = {
    list,
    groups,
    getRandomRecipe
  };
  return cookbook;
}
var cookbook = null;
var export_Quantity = import_js_quantities.default;

export {
  recipes,
  parseQuantity,
  parseAmount,
  jsx,
  cookbook,
  buildCookbook,
  Step,
  RecipeContainer,
  Recipe,
  export_Quantity as Quantity,
  Preparation,
  Ingredients,
  Ingredient,
  Directions,
  Amount
};
// recipeseme/helpers.tsities/build/quantitie
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
// recipeseme/helpers.tsities/build
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
