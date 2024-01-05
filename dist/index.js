var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// recipeseme/Options.
var exports_scheme = {};
__export(exports_scheme, {
  jsx: () => {
    {
      return jsx;
    }
  },
  Step: () => {
    {
      return Step;
    }
  },
  Recipe: () => {
    {
      return Recipe;
    }
  },
  Preparation: () => {
    {
      return Preparation;
    }
  },
  Ingredients: () => {
    {
      return Ingredients;
    }
  },
  Ingredient: () => {
    {
      return Ingredient;
    }
  },
  Directions: () => {
    {
      return Directions;
    }
  }
});

// recipeseme/Option
function jsx(tag, props, ...children) {
  return new tag({ ...props, children });
}
// recipeseme/Options.tsainer.ts
class RecipeContainer {
  children;
  constructor(props) {
    this.children = props.children;
  }
}

// recipeseme/Options.t
class Recipe extends RecipeContainer {
  name;
  meal;
  constructor(props) {
    super(props);
    this.name = props.name;
    this.meal = props.meal;
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

class Step extends RecipeContainer {
  constructor() {
    super(...arguments);
  }
}
// recipeseme/Options.t
var regexp = /(?<count>\d+)(?<separator>\W+)?(?<unit>\w+)?/;

class Amount {
  count;
  unit;
  constructor(options = "") {
    if (typeof options === "string") {
      const match = options.match(regexp);
      const { count, unit } = match?.groups ?? {};
      this.count = count ? Number(count) : undefined;
      this.unit = unit;
    }
    if (options instanceof Amount) {
      this.count = options.count;
      this.unit = options.unit;
    }
  }
}

// recipeseme/Options.ts
class Options extends Array {
  constructor(options = "") {
    const optionsArray = options instanceof Options ? [...options] : Array.isArray(options) ? options : options.split(",").map((option) => option.trim());
    super(...optionsArray);
  }
}

// recipeseme/Options.tsain
class Ingredient {
  key;
  name;
  amount;
  category;
  manipulation;
  constructor(props) {
    this.key = props.key;
    this.name = props.name;
    this.amount = new Amount(props.amount);
    this.category = new Options(props.category);
    this.manipulation = new Options(props.manipulation);
  }
}
// recipeseme/O
Object.assign(globalThis, exports_scheme);
var recipes = {};
export {
  recipes
};
// recipeseme/Options.tsainer.ts Scramble.tsx
recipes["Egg and Vegetable Scramble"] = jsx(Recipe, {
  name: "Egg and Vegetable Scramble",
  meal: "breakfast"
}, jsx(Directions, null, jsx(Step, null, "Beat the eggs and set aside."), jsx(Step, null, "Heat oil in a pan."), jsx(Step, null, "Add the diced bell peppers, onions, and tomatoes."), jsx(Step, null, "Once vegetables are softened, pour in the eggs."), jsx(Step, null, "Scramble until fully cooked."), jsx(Step, null, "Season with salt, pepper, and chili flakes."), jsx(Step, null, "Serve with a toasted tortilla slice.")), jsx(Ingredients, null, jsx(Ingredient, {
  category: "Protein",
  amount: "3"
}, "Large eggs"), jsx(Ingredient, {
  key: "bell_peppers",
  category: "Vegetable"
}, "Bell peppers (mixed colors)"), jsx(Ingredient, {
  category: "Carbohydrate",
  name: "Tortillas",
  amount: "1 slice"
})), jsx(Preparation, null, jsx(Step, null, "Wash and dice", " ", jsx(Ingredient, {
  key: "bell_peppers",
  amount: "60g",
  manipulation: "wash,dice"
}, "bell peppers"), ",", " ", jsx(Ingredient, {
  amount: "60g",
  manipulation: "dice"
}, "onions"), ", and", " ", jsx(Ingredient, {
  amount: "60g",
  manipulation: "wash,dice"
}, "tomatoes"), ".")));
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// recipeseme/Opti
var cookbook = Object.keys(recipes);
export {
  cookbook
};
