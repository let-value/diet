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

// recipeseme/RecipeCo
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

// recipeseme/Recipe
function jsx(tag, props, ...children) {
  return new tag({ ...props, children });
}
// recipeseme/RecipeCon
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

// recipeseme/RecipeContainer.ts
class RecipeContainer {
  children;
  constructor(props) {
    this.children = props.children;
  }
}

// recipeseme/RecipeCon
class Recipe extends RecipeContainer {
  name;
  meal;
  servings;
  constructor(props) {
    super(props);
    this.name = props.name;
    this.meal = props.meal;
    this.servings = new Amount(props.servings);
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
// recipeseme/RecipeCont
class Options extends Array {
  constructor(options = "") {
    const optionsArray = options instanceof Options ? [...options] : Array.isArray(options) ? options : options.split(",").map((option) => option.trim());
    super(...optionsArray);
  }
}

// recipeseme/RecipeContain
class Ingredient {
  key;
  name;
  amount;
  category;
  manipulation;
  constructor(props) {
    this.key = props.key;
    this.name = props.children ?? props.name;
    this.amount = new Amount(props.amount);
    this.category = new Options(props.category);
    this.manipulation = new Options(props.manipulation);
  }
}
// recipeseme/R
Object.assign(globalThis, exports_scheme);
var recipes = {};
export {
  recipes
};
// recipeseme/RecipeContainer.ts Sc
recipes["Chicken Stir-Fry"] = jsx(Recipe, {
  name: "Chicken Stir-Fry",
  meal: "dinner",
  servings: "1"
}, jsx(Directions, null, jsx(Step, null, "Cut the pre-cooked chicken into strips or chunks."), jsx(Step, null, "Heat the chicken stock in a non-stick wok over medium-high heat. Add the chicken and cook until almost done."), jsx(Step, null, "Add the pre-cooked vegetables, cayenne pepper, and ginger to the wok. Cook until the vegetables are tender."), jsx(Step, null, "In a separate pan, quickly scramble the pre-cooked egg and then mix it thoroughly through the stir-fry."), jsx(Step, null, "Serve the stir-fry hot.")), jsx(Ingredients, null, jsx(Ingredient, {
  category: "Protein",
  amount: "118g"
}, "Chicken breast (raw)"), jsx(Ingredient, {
  category: "Protein",
  amount: "1"
}, "Egg (whole, fresh)"), jsx(Ingredient, {
  category: "Vegetable",
  amount: "34g"
}, "Asparagus (raw)"), jsx(Ingredient, {
  category: "Vegetable",
  amount: "23g"
}, "Broccoli (raw)"), jsx(Ingredient, {
  category: "Vegetable",
  amount: "35g"
}, "Mushrooms (white, raw)"), jsx(Ingredient, {
  category: "Vegetable",
  amount: "15g"
}, "Carrots (raw)"), jsx(Ingredient, {
  category: "Condiment",
  amount: "0.1g"
}, "Cayenne pepper (spices)"), jsx(Ingredient, {
  category: "Condiment",
  amount: "0.5g"
}, "Ginger (ground)"), jsx(Ingredient, {
  category: "Condiment",
  amount: "15g"
}, "Chicken broth (ready-to-serve)")), jsx(Preparation, null, jsx(Step, null, "Chop", " ", jsx(Ingredient, {
  key: "chicken_breast",
  amount: "118g",
  manipulation: "chop,cook"
}, "chicken breast"), " ", "into small pieces and cook in a pan until fully done. Store in an airtight container in the refrigerator."), jsx(Step, null, "Wash and chop", " ", jsx(Ingredient, {
  amount: "34g",
  manipulation: "wash,chop"
}, "asparagus"), ",", " ", jsx(Ingredient, {
  amount: "23g",
  manipulation: "wash,chop"
}, "broccoli"), ",", " ", jsx(Ingredient, {
  amount: "35g",
  manipulation: "wash,chop"
}, "mushrooms"), ", and", " ", jsx(Ingredient, {
  amount: "15g",
  manipulation: "wash,chop"
}, "carrots"), ". Store each in separate airtight containers in the refrigerator."), jsx(Step, null, "Beat and lightly scramble", " ", jsx(Ingredient, {
  amount: "1",
  manipulation: "beat,scramble"
}, "egg"), ". Once cooked, store in an airtight container in the refrigerator.")));
// recipeseme/RecipeContainer.ts Scramble.tsx
recipes["Egg and Vegetable Scramble"] = jsx(Recipe, {
  name: "Egg and Vegetable Scramble",
  meal: "breakfast",
  servings: "1"
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

// recipeseme/Reci
var cookbook = Object.keys(recipes);
export {
  cookbook
};
