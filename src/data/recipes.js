// Recipe data keyed by meal ID. Merged into meals on first load via useMealPlan.js.
export const RECIPE_DATA = {

  // ── BEEF ──────────────────────────────────────────────────────────────────

  1: { // Burgers
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'ground beef (80/20)' },
      { quantity: '4', unit: '', name: 'hamburger buns' },
      { quantity: '4', unit: 'slices', name: 'Cheddar Cheese' },
      { quantity: '1', unit: 'tsp', name: 'garlic powder' },
      { quantity: '1', unit: 'tsp', name: 'salt and black pepper' },
      { quantity: '', unit: '', name: 'lettuce, tomato, onion, condiments' },
    ],
    instructions: [
      'Divide beef into 4 equal patties, season both sides with salt, pepper, and garlic powder.',
      'Heat grill or skillet over medium-high. Cook patties 3–4 min per side for medium doneness.',
      'Add cheese in the last minute and cover to melt.',
      'Toast buns, assemble with desired toppings.',
    ],
  },

  2: { // Burger and Rice
    servings: 4, prepTime: '5 min', cookTime: '20 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '2', unit: 'cups', name: 'white rice (cooked)' },
      { quantity: '1', unit: 'packet', name: 'onion soup mix or seasoning' },
      { quantity: '1', unit: 'can', name: 'diced tomatoes (optional)' },
      { quantity: '', unit: '', name: 'salt and pepper to taste' },
    ],
    instructions: [
      'Cook rice according to package directions.',
      'Brown ground beef in a skillet over medium-high heat; drain fat.',
      'Stir in seasoning and diced tomatoes if using; simmer 5 min.',
      'Serve beef mixture over rice.',
    ],
  },

  3: { // Sloppy Joes
    servings: 6, prepTime: '5 min', cookTime: '20 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'ground beef' },
      { quantity: '1', unit: 'can', name: 'Manwich or sloppy joe sauce' },
      { quantity: '1', unit: '', name: 'small onion, diced' },
      { quantity: '6', unit: '', name: 'hamburger buns' },
    ],
    instructions: [
      'Brown ground beef and onion in a skillet; drain fat.',
      'Stir in sloppy joe sauce and simmer 10 min.',
      'Spoon onto toasted buns.',
    ],
  },

  4: { // Spaghetti
    servings: 6, prepTime: '10 min', cookTime: '30 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '1', unit: 'lb', name: 'spaghetti' },
      { quantity: '1', unit: 'jar', name: 'marinara sauce' },
      { quantity: '1', unit: '', name: 'small onion, diced' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '', unit: '', name: 'parmesan for serving' },
    ],
    instructions: [
      'Cook spaghetti in salted boiling water; drain.',
      'Brown beef with onion and garlic; drain fat.',
      'Add marinara, simmer 15 min.',
      'Serve sauce over pasta with parmesan.',
    ],
  },

  5: { // Ravioli
    servings: 4, prepTime: '5 min', cookTime: '15 min',
    ingredients: [
      { quantity: '2', unit: 'cans', name: 'beef ravioli (Chef Boyardee) or 1 pkg frozen ravioli' },
      { quantity: '1', unit: 'cup', name: 'shredded mozzarella (optional)' },
      { quantity: '1', unit: 'jar', name: 'marinara (if using frozen)' },
    ],
    instructions: [
      'For canned: heat in saucepan over medium, stirring occasionally, 8–10 min.',
      'For frozen: boil ravioli per package, drain, top with warmed marinara and cheese.',
    ],
  },

  6: { // Lasagna
    servings: 8, prepTime: '30 min', cookTime: '60 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '12', unit: '', name: 'lasagna noodles, cooked' },
      { quantity: '15', unit: 'oz', name: 'Ricotta Cheese' },
      { quantity: '2', unit: 'cups', name: 'Mozzarella Cheese' },
      { quantity: '1', unit: 'jar', name: 'marinara sauce' },
      { quantity: '1', unit: '', name: 'egg' },
    ],
    instructions: [
      'Preheat oven to 375°F. Brown beef; drain. Stir into marinara.',
      'Mix ricotta, egg, and half the mozzarella.',
      'Layer: sauce, noodles, ricotta mix, mozzarella. Repeat; top with sauce and remaining mozzarella.',
      'Cover with foil, bake 45 min; uncover last 10 min. Rest 10 min before cutting.',
    ],
  },

  7: { // Lasagna Soup
    servings: 6, prepTime: '10 min', cookTime: '30 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '4', unit: 'cups', name: 'chicken or beef broth' },
      { quantity: '1', unit: 'can', name: 'crushed tomatoes (28 oz)' },
      { quantity: '8', unit: 'oz', name: 'lasagna noodles, broken' },
      { quantity: '1', unit: 'tsp', name: 'Italian seasoning' },
      { quantity: '1', unit: 'cup', name: 'shredded mozzarella for topping' },
      { quantity: '½', unit: 'cup', name: 'ricotta for topping' },
    ],
    instructions: [
      'Brown beef in a large pot; drain fat.',
      'Add broth, crushed tomatoes, and Italian seasoning. Bring to a boil.',
      'Add broken noodles; cook 10–12 min until tender.',
      'Ladle into bowls; top with a dollop of ricotta and mozzarella.',
    ],
  },

  8: { // Chili
    servings: 8, prepTime: '10 min', cookTime: '45 min',
    ingredients: [
      { quantity: '2', unit: 'lbs', name: 'ground beef' },
      { quantity: '2', unit: 'cans', name: 'kidney beans, drained' },
      { quantity: '1', unit: 'can', name: 'diced tomatoes (28 oz)' },
      { quantity: '1', unit: 'can', name: 'tomato sauce (15 oz)' },
      { quantity: '2', unit: 'tbsp', name: 'chili powder' },
      { quantity: '1', unit: 'tsp', name: 'cumin, garlic powder, salt' },
      { quantity: '1', unit: '', name: 'onion, diced' },
    ],
    instructions: [
      'Brown beef and onion in a large pot; drain fat.',
      'Add tomatoes, tomato sauce, beans, and all spices.',
      'Bring to boil, reduce heat, simmer 30–40 min.',
      'Serve with shredded cheese, sour cream, and crackers.',
    ],
  },

  9: { // Vegetable Soup (Beef)
    servings: 8, prepTime: '15 min', cookTime: '60 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'stew beef, cubed' },
      { quantity: '4', unit: 'cups', name: 'beef broth' },
      { quantity: '3', unit: '', name: 'carrots, sliced' },
      { quantity: '3', unit: '', name: 'potatoes, diced' },
      { quantity: '2', unit: 'stalks', name: 'celery, sliced' },
      { quantity: '1', unit: 'can', name: 'diced tomatoes' },
      { quantity: '1', unit: 'cup', name: 'frozen green beans or peas' },
    ],
    instructions: [
      'Brown beef in a large pot over medium-high; remove and set aside.',
      'Add broth, tomatoes, carrots, potatoes, and celery. Return beef.',
      'Bring to boil, reduce heat, simmer 45 min until beef is tender.',
      'Add green beans last 10 min. Season with salt and pepper.',
    ],
  },

  10: { // Beef Stew
    servings: 6, prepTime: '20 min', cookTime: '90 min',
    ingredients: [
      { quantity: '2', unit: 'lbs', name: 'beef chuck, cut into 1-inch cubes' },
      { quantity: '4', unit: '', name: 'potatoes, cubed' },
      { quantity: '3', unit: '', name: 'carrots, sliced' },
      { quantity: '2', unit: 'cups', name: 'beef broth' },
      { quantity: '2', unit: 'tbsp', name: 'tomato paste' },
      { quantity: '2', unit: 'tbsp', name: 'flour' },
      { quantity: '1', unit: '', name: 'onion, diced' },
    ],
    instructions: [
      'Toss beef in flour, salt, and pepper. Brown in batches in a Dutch oven.',
      'Add onion, broth, tomato paste; bring to a boil.',
      'Reduce heat, cover, simmer 1 hour.',
      'Add potatoes and carrots; cook 30 more min until tender.',
    ],
  },

  11: { // Pot Roast
    servings: 6, prepTime: '15 min', cookTime: '480 min',
    ingredients: [
      { quantity: '3', unit: 'lbs', name: 'beef chuck roast' },
      { quantity: '4', unit: '', name: 'potatoes, quartered' },
      { quantity: '4', unit: '', name: 'carrots, cut into chunks' },
      { quantity: '1', unit: '', name: 'onion, quartered' },
      { quantity: '1', unit: 'cup', name: 'beef broth' },
      { quantity: '1', unit: 'packet', name: 'onion soup mix' },
    ],
    instructions: [
      'Season roast with salt and pepper; sear in a skillet over high heat.',
      'Place in slow cooker. Add onion, broth, and soup mix.',
      'Cook on Low 8 hours (or High 4–5 hours).',
      'Add potatoes and carrots halfway through cooking.',
    ],
  },

  12: { // Cube Steak
    servings: 4, prepTime: '10 min', cookTime: '25 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'cube steaks' },
      { quantity: '½', unit: 'cup', name: 'flour' },
      { quantity: '2', unit: 'cups', name: 'beef broth' },
      { quantity: '2', unit: 'tbsp', name: 'vegetable oil' },
      { quantity: '1', unit: '', name: 'onion, sliced' },
      { quantity: '', unit: '', name: 'salt and pepper' },
    ],
    instructions: [
      'Season steaks with salt and pepper; dredge in flour.',
      'Brown in oil over medium-high, 3 min per side; remove.',
      'Sauté onion in same pan. Whisk in remaining flour and broth; bring to a boil.',
      'Return steaks, cover, simmer 20 min until tender.',
    ],
  },

  13: { // Steak Bites
    servings: 4, prepTime: '10 min', cookTime: '10 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'sirloin steak, cut into 1-inch cubes' },
      { quantity: '3', unit: 'tbsp', name: 'butter' },
      { quantity: '4', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '1', unit: 'tbsp', name: 'Worcestershire sauce' },
      { quantity: '', unit: '', name: 'salt, pepper, fresh parsley' },
    ],
    instructions: [
      'Pat steak dry; season with salt and pepper.',
      'Heat a cast iron skillet over high; sear steak bites in a single layer 1–2 min per side.',
      'Reduce heat, add butter and garlic; baste steak bites 1 min.',
      'Drizzle with Worcestershire, garnish with parsley.',
    ],
  },

  14: { // Beef and Noodles
    servings: 6, prepTime: '10 min', cookTime: '90 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'stew beef, cubed' },
      { quantity: '12', unit: 'oz', name: 'egg noodles' },
      { quantity: '3', unit: 'cups', name: 'beef broth' },
      { quantity: '1', unit: 'can', name: 'cream of mushroom soup' },
      { quantity: '1', unit: '', name: 'onion, diced' },
      { quantity: '', unit: '', name: 'salt and pepper' },
    ],
    instructions: [
      'Brown beef with onion in a pot; drain excess fat.',
      'Add broth and cream of mushroom; bring to boil.',
      'Reduce heat, simmer covered 60–75 min until beef is tender.',
      'Cook egg noodles separately; serve beef and gravy over noodles.',
    ],
  },

  15: { // Hamburger Gravy
    servings: 4, prepTime: '5 min', cookTime: '20 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '2', unit: 'cups', name: 'beef broth' },
      { quantity: '3', unit: 'tbsp', name: 'flour' },
      { quantity: '1', unit: '', name: 'onion, diced' },
      { quantity: '', unit: '', name: 'salt and pepper' },
      { quantity: '', unit: '', name: 'mashed potatoes or bread for serving' },
    ],
    instructions: [
      'Brown beef and onion in a skillet; drain most fat, leaving about 2 tbsp.',
      'Sprinkle flour over beef, stir to coat, cook 1 min.',
      'Gradually whisk in broth; simmer until thickened, about 5–8 min.',
      'Season with salt and pepper. Serve over mashed potatoes or toast.',
    ],
  },

  16: { // Round Steak and Gravy
    servings: 4, prepTime: '10 min', cookTime: '480 min',
    ingredients: [
      { quantity: '2', unit: 'lbs', name: 'round steak, cut into pieces' },
      { quantity: '1', unit: 'can', name: 'cream of mushroom soup' },
      { quantity: '1', unit: 'cup', name: 'beef broth' },
      { quantity: '1', unit: 'packet', name: 'onion soup mix' },
    ],
    instructions: [
      'Place round steak in slow cooker.',
      'Whisk together mushroom soup, broth, and onion soup mix; pour over steak.',
      'Cook on Low 7–8 hours until fork-tender.',
      'Serve over mashed potatoes or egg noodles.',
    ],
  },

  17: { // Taco - Traditional
    servings: 6, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'ground beef' },
      { quantity: '1', unit: 'packet', name: 'taco seasoning' },
      { quantity: '12', unit: '', name: 'corn tortillas, warmed' },
      { quantity: '1', unit: 'cup', name: 'salsa' },
      { quantity: '½', unit: 'cup', name: 'white onion, diced' },
      { quantity: '¼', unit: 'cup', name: 'fresh cilantro, chopped' },
      { quantity: '1', unit: '', name: 'lime, cut into wedges' },
    ],
    instructions: [
      'Brown ground beef; drain fat.',
      'Add taco seasoning and ¾ cup water; simmer until thickened.',
      'Warm corn tortillas on a dry skillet or open flame.',
      'Top with beef, onion, cilantro, salsa, and a squeeze of lime.',
    ],
  },

  18: { // Taco - American
    servings: 6, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'ground beef' },
      { quantity: '1', unit: 'packet', name: 'taco seasoning' },
      { quantity: '12', unit: '', name: 'hard taco shells or flour tortillas' },
      { quantity: '1', unit: 'cup', name: 'Cheddar Cheese' },
      { quantity: '1', unit: 'cup', name: 'Lettuce' },
      { quantity: '1', unit: '', name: 'tomato, diced' },
      { quantity: '', unit: '', name: 'sour cream, taco sauce' },
    ],
    instructions: [
      'Brown ground beef; drain fat. Add taco seasoning and ¾ cup water; simmer.',
      'Warm taco shells in oven at 325°F for 5 min.',
      'Fill shells with beef, then top with cheese, lettuce, tomato, and sour cream.',
    ],
  },

  19: { // Spanish Rice Burritos
    servings: 6, prepTime: '15 min', cookTime: '30 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '1.5', unit: 'cups', name: 'long-grain white rice' },
      { quantity: '1', unit: 'can', name: 'diced tomatoes with green chiles' },
      { quantity: '1', unit: 'can', name: 'black beans, drained' },
      { quantity: '1', unit: 'tsp', name: 'cumin and chili powder' },
      { quantity: '6', unit: '', name: 'Flour Tortillas' },
      { quantity: '1', unit: 'cup', name: 'Cheddar Cheese' },
    ],
    instructions: [
      'Cook rice in 2.5 cups broth or water with diced tomatoes and spices.',
      'Brown ground beef; drain. Season with cumin and chili powder.',
      'Mix beef, rice, and beans together.',
      'Spoon into tortillas with cheese; fold and roll into burritos.',
    ],
  },

  20: { // Beef Stroganoff
    servings: 6, prepTime: '10 min', cookTime: '25 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'ground beef or sirloin strips' },
      { quantity: '12', unit: 'oz', name: 'egg noodles' },
      { quantity: '1', unit: 'cup', name: 'sour cream' },
      { quantity: '1', unit: 'can', name: 'cream of mushroom soup' },
      { quantity: '1', unit: 'cup', name: 'sliced mushrooms' },
      { quantity: '1', unit: '', name: 'onion, diced' },
      { quantity: '1', unit: 'cup', name: 'beef broth' },
    ],
    instructions: [
      'Cook egg noodles; drain and set aside.',
      'Brown beef with onion and mushrooms; drain fat.',
      'Stir in cream of mushroom soup and broth; simmer 10 min.',
      'Remove from heat, stir in sour cream. Serve over egg noodles.',
    ],
  },

  21: { // Cowboy Bean Bake
    servings: 8, prepTime: '15 min', cookTime: '90 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '6', unit: 'slices', name: 'bacon, chopped' },
      { quantity: '1', unit: 'can', name: 'pork and beans (28 oz)' },
      { quantity: '1', unit: 'can', name: 'kidney beans, drained' },
      { quantity: '1', unit: 'can', name: 'black beans, drained' },
      { quantity: '¼', unit: 'cup', name: 'brown sugar' },
      { quantity: '¼', unit: 'cup', name: 'ketchup' },
      { quantity: '2', unit: 'tbsp', name: 'yellow mustard and cider vinegar' },
    ],
    instructions: [
      'Preheat oven to 350°F. Brown beef and bacon together; drain fat.',
      'Combine beef, bacon, all beans, brown sugar, ketchup, mustard, and vinegar in a large baking dish.',
      'Stir well, cover with foil, bake 1 hour 15 min.',
      'Uncover last 15 min to thicken.',
    ],
  },

  22: { // Shepherd's Pie
    servings: 6, prepTime: '20 min', cookTime: '35 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'ground beef' },
      { quantity: '4', unit: 'cups', name: 'mashed potatoes (prepared)' },
      { quantity: '1.5', unit: 'cups', name: 'frozen mixed vegetables' },
      { quantity: '1', unit: 'cup', name: 'beef broth' },
      { quantity: '2', unit: 'tbsp', name: 'tomato paste' },
      { quantity: '1', unit: '', name: 'onion, diced' },
    ],
    instructions: [
      'Preheat oven to 375°F. Brown beef with onion; drain.',
      'Add tomato paste, broth, and vegetables; simmer 5 min.',
      'Transfer to a baking dish; spread mashed potatoes over the top.',
      'Bake 25 min until potatoes are lightly golden.',
    ],
  },

  23: { // Hamburger Mac
    servings: 6, prepTime: '5 min', cookTime: '25 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '2', unit: 'cups', name: 'elbow macaroni, uncooked' },
      { quantity: '2', unit: 'cups', name: 'Cheddar Cheese' },
      { quantity: '1', unit: 'can', name: 'diced tomatoes (optional)' },
      { quantity: '2', unit: 'cups', name: 'beef broth or water' },
      { quantity: '', unit: '', name: 'salt, pepper, garlic powder' },
    ],
    instructions: [
      'Brown ground beef in a large skillet; drain.',
      'Add broth and macaroni; bring to boil, cover, simmer 10–12 min until pasta is tender.',
      'Stir in tomatoes if using; fold in cheese until melted.',
      'Season with salt, pepper, and garlic powder.',
    ],
  },

  24: { // Meatloaf
    servings: 6, prepTime: '15 min', cookTime: '60 min',
    ingredients: [
      { quantity: '2', unit: 'lbs', name: 'ground beef' },
      { quantity: '½', unit: 'cup', name: 'breadcrumbs' },
      { quantity: '2', unit: '', name: 'eggs' },
      { quantity: '¼', unit: 'cup', name: 'Milk' },
      { quantity: '1', unit: '', name: 'onion, diced fine' },
      { quantity: '½', unit: 'cup', name: 'ketchup (for top)' },
      { quantity: '1', unit: 'tbsp', name: 'Worcestershire sauce' },
    ],
    instructions: [
      'Preheat oven to 350°F.',
      'Mix beef, breadcrumbs, eggs, milk, onion, Worcestershire; do not overwork.',
      'Form into a loaf in a baking dish; spread ketchup over top.',
      'Bake 55–60 min until internal temp reaches 160°F. Rest 10 min before slicing.',
    ],
  },

  26: { // Country Fried Steak
    servings: 4, prepTime: '15 min', cookTime: '20 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'cube steaks' },
      { quantity: '1', unit: 'cup', name: 'all-purpose flour' },
      { quantity: '2', unit: '', name: 'eggs, beaten' },
      { quantity: '½', unit: 'cup', name: 'vegetable oil' },
      { quantity: '2', unit: 'cups', name: 'Milk' },
      { quantity: '3', unit: 'tbsp', name: 'butter' },
      { quantity: '', unit: '', name: 'salt, pepper, garlic powder' },
    ],
    instructions: [
      'Season steaks with salt and pepper; dredge in flour, dip in egg, dredge in flour again.',
      'Fry in hot oil 3–4 min per side until golden; set aside.',
      'Pour off all but 3 tbsp oil; whisk in 3 tbsp flour, cook 1 min.',
      'Gradually whisk in milk; simmer until thickened into cream gravy. Season well. Serve over steaks.',
    ],
  },

  27: { // Garlic Parm Beef Rotini
    servings: 6, prepTime: '10 min', cookTime: '20 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '12', unit: 'oz', name: 'rotini pasta' },
      { quantity: '4', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '4', unit: 'tbsp', name: 'butter' },
      { quantity: '1', unit: 'cup', name: 'grated parmesan' },
      { quantity: '½', unit: 'cup', name: 'pasta water reserved' },
    ],
    instructions: [
      'Cook rotini in salted water; reserve ½ cup pasta water before draining.',
      'Brown beef; drain. Push to the side, melt butter, sauté garlic 1 min.',
      'Add drained pasta and reserved pasta water; toss together.',
      'Remove from heat, fold in parmesan. Season with salt and pepper.',
    ],
  },

  28: { // Crock Pot Taco Rice Soup
    servings: 8, prepTime: '10 min', cookTime: '360 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef, browned and drained' },
      { quantity: '1', unit: 'can', name: 'diced tomatoes with green chiles (Rotel)' },
      { quantity: '1', unit: 'can', name: 'corn, drained' },
      { quantity: '1', unit: 'can', name: 'black beans, drained' },
      { quantity: '4', unit: 'cups', name: 'chicken broth' },
      { quantity: '1', unit: 'packet', name: 'taco seasoning' },
      { quantity: '1', unit: 'cup', name: 'white rice (add last 30 min)' },
    ],
    instructions: [
      'Add browned beef, tomatoes, corn, beans, broth, and taco seasoning to slow cooker.',
      'Cook on Low 6 hours or High 3 hours.',
      'Stir in rice during last 30 min of cooking.',
      'Serve topped with sour cream, shredded cheese, and tortilla strips.',
    ],
  },

  29: { // Cheeseburger Soup
    servings: 8, prepTime: '15 min', cookTime: '30 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '3', unit: '', name: 'potatoes, diced' },
      { quantity: '4', unit: 'cups', name: 'chicken broth' },
      { quantity: '8', unit: 'oz', name: 'Velveeta or processed cheddar, cubed' },
      { quantity: '1', unit: 'cup', name: 'Milk' },
      { quantity: '1', unit: '', name: 'onion, diced' },
      { quantity: '2', unit: 'stalks', name: 'celery, sliced' },
    ],
    instructions: [
      'Brown beef with onion and celery; drain.',
      'Add broth and potatoes; bring to boil, simmer 15 min until potatoes are tender.',
      'Stir in Velveeta and milk over low heat until melted and smooth.',
      'Season with salt and pepper. Top with crumbled bacon or shredded cheese.',
    ],
  },

  30: { // Swedish Meatballs
    servings: 6, prepTime: '20 min', cookTime: '30 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'ground beef (or beef/pork mix)' },
      { quantity: '½', unit: 'cup', name: 'breadcrumbs' },
      { quantity: '1', unit: '', name: 'egg' },
      { quantity: '2', unit: 'cups', name: 'beef broth' },
      { quantity: '1', unit: 'cup', name: 'sour cream' },
      { quantity: '3', unit: 'tbsp', name: 'flour' },
      { quantity: '2', unit: 'tbsp', name: 'butter' },
    ],
    instructions: [
      'Mix beef, breadcrumbs, egg, salt, pepper, and a pinch of nutmeg; roll into 1-inch meatballs.',
      'Brown meatballs in butter; remove and set aside.',
      'Whisk flour into pan drippings; gradually add broth, simmer until thickened.',
      'Remove from heat, stir in sour cream; return meatballs and heat through. Serve over egg noodles.',
    ],
  },

  69: { // Philly Cheesesteak
    servings: 4, prepTime: '15 min', cookTime: '20 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'shaved ribeye or thin-sliced sirloin' },
      { quantity: '2', unit: '', name: 'bell peppers, sliced' },
      { quantity: '1', unit: '', name: 'onion, sliced' },
      { quantity: '4', unit: 'slices', name: 'Provolone Cheese' },
      { quantity: '4', unit: '', name: 'hoagie rolls' },
      { quantity: '2', unit: 'tbsp', name: 'vegetable oil' },
    ],
    instructions: [
      'Sauté peppers and onion in oil over medium-high until soft; remove.',
      'Cook shaved beef in same pan, breaking apart, until cooked through. Season with salt and pepper.',
      'Return vegetables to pan; top with provolone, cover 1 min to melt.',
      'Pile into hoagie rolls.',
    ],
  },

  70: { // Beef Enchiladas
    servings: 6, prepTime: '20 min', cookTime: '25 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '2', unit: 'cans', name: 'red enchilada sauce (10 oz each)' },
      { quantity: '12', unit: '', name: 'corn tortillas' },
      { quantity: '2', unit: 'cups', name: 'shredded Mexican cheese blend' },
      { quantity: '1', unit: 'packet', name: 'taco seasoning' },
    ],
    instructions: [
      'Preheat oven to 375°F. Brown beef; drain. Add taco seasoning and ¼ cup water.',
      'Dip each tortilla briefly in enchilada sauce; fill with beef and cheese, roll up.',
      'Place seam-down in a baking dish. Pour remaining sauce over top; add cheese.',
      'Bake 20–25 min until bubbly.',
    ],
  },

  71: { // Beef Fried Rice
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '3', unit: 'cups', name: 'cooked white rice (day-old preferred)' },
      { quantity: '1', unit: 'cup', name: 'frozen peas and carrots' },
      { quantity: '3', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '2', unit: '', name: 'eggs, scrambled' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '2', unit: 'tbsp', name: 'sesame oil' },
    ],
    instructions: [
      'Brown beef in a large skillet or wok; drain. Add garlic, cook 1 min.',
      'Push beef to the side; scramble eggs in the pan.',
      'Add rice and frozen vegetables; stir-fry 3–4 min.',
      'Drizzle soy sauce and sesame oil; toss to combine.',
    ],
  },

  72: { // Stuffed Bell Peppers
    servings: 6, prepTime: '20 min', cookTime: '40 min',
    ingredients: [
      { quantity: '6', unit: '', name: 'bell peppers, tops cut off and seeded' },
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '1.5', unit: 'cups', name: 'White Rice' },
      { quantity: '1', unit: 'can', name: 'diced tomatoes (15 oz)' },
      { quantity: '1.5', unit: 'cups', name: 'shredded mozzarella or cheddar' },
      { quantity: '1', unit: 'tsp', name: 'Italian seasoning or taco seasoning' },
    ],
    instructions: [
      'Preheat oven to 375°F. Brown beef; drain. Stir in tomatoes, rice, and seasoning.',
      'Stand peppers upright in a baking dish; fill with beef mixture.',
      'Top with cheese; add ¼ cup water to the bottom of the dish.',
      'Cover with foil; bake 30 min. Uncover last 10 min.',
    ],
  },

  73: { // Beef Fajitas
    servings: 4, prepTime: '15 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'flank or skirt steak' },
      { quantity: '3', unit: '', name: 'bell peppers, sliced' },
      { quantity: '1', unit: '', name: 'onion, sliced' },
      { quantity: '2', unit: 'tbsp', name: 'fajita or taco seasoning' },
      { quantity: '2', unit: 'tbsp', name: 'lime juice' },
      { quantity: '8', unit: '', name: 'Flour Tortillas' },
    ],
    instructions: [
      'Marinate steak with seasoning, lime juice, and 1 tbsp oil for at least 30 min.',
      'Sear steak in a hot cast iron skillet 4–5 min per side; rest 5 min, then slice thin against the grain.',
      'Cook peppers and onion in the same skillet until charred and tender.',
      'Serve steak and vegetables in warm tortillas with salsa and sour cream.',
    ],
  },

  74: { // Korean Beef Bowl
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '3', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '2', unit: 'tbsp', name: 'brown sugar' },
      { quantity: '1', unit: 'tbsp', name: 'sesame oil' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '1', unit: 'tsp', name: 'fresh ginger, grated' },
      { quantity: '3', unit: 'cups', name: 'White Rice' },
    ],
    instructions: [
      'Brown ground beef; drain fat.',
      'Stir in garlic and ginger; cook 1 min.',
      'Add soy sauce, brown sugar, and sesame oil; stir to combine and simmer 3 min.',
      'Serve over rice; garnish with green onion and sesame seeds.',
    ],
  },

  75: { // French Dip Sandwich
    servings: 6, prepTime: '10 min', cookTime: '480 min',
    ingredients: [
      { quantity: '3', unit: 'lbs', name: 'beef chuck roast' },
      { quantity: '2', unit: 'cans', name: 'beef broth (14 oz each)' },
      { quantity: '1', unit: 'packet', name: 'onion soup mix' },
      { quantity: '6', unit: '', name: 'hoagie rolls' },
      { quantity: '6', unit: 'slices', name: 'Provolone Cheese' },
    ],
    instructions: [
      'Place roast in slow cooker; pour broth over and sprinkle soup mix.',
      'Cook on Low 8 hours.',
      'Shred beef; return to juices.',
      'Pile beef onto rolls with provolone; broil 2 min to melt. Serve with broth for dipping.',
    ],
  },

  76: { // Patty Melt
    servings: 4, prepTime: '15 min', cookTime: '30 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '2', unit: '', name: 'onions, thinly sliced' },
      { quantity: '8', unit: 'slices', name: 'rye or sourdough bread' },
      { quantity: '8', unit: 'slices', name: 'Swiss Cheese' },
      { quantity: '4', unit: 'tbsp', name: 'butter' },
    ],
    instructions: [
      'Caramelize onions in 2 tbsp butter over medium-low heat, 25–30 min.',
      'Form beef into 4 thin patties to match bread shape; season with salt and pepper.',
      'Cook patties in a skillet 3–4 min per side.',
      'Butter bread, build sandwiches with beef, onions, and Swiss; grill until golden on both sides.',
    ],
  },

  77: { // Reuben Sandwich
    servings: 4, prepTime: '5 min', cookTime: '10 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'sliced deli corned beef' },
      { quantity: '8', unit: 'slices', name: 'rye bread' },
      { quantity: '8', unit: 'slices', name: 'Swiss Cheese' },
      { quantity: '1', unit: 'cup', name: 'sauerkraut, drained' },
      { quantity: '½', unit: 'cup', name: 'Thousand Island dressing' },
      { quantity: '4', unit: 'tbsp', name: 'butter' },
    ],
    instructions: [
      'Spread Thousand Island on one side of each bread slice.',
      'Build sandwiches: bread, cheese, corned beef, sauerkraut, cheese, bread.',
      'Butter outer bread; grill in a skillet or griddle over medium until golden, about 3 min per side.',
    ],
  },

  78: { // Beef Nachos
    servings: 6, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '1', unit: 'packet', name: 'taco seasoning' },
      { quantity: '1', unit: 'bag', name: 'tortilla chips' },
      { quantity: '2', unit: 'cups', name: 'shredded Mexican cheese blend' },
      { quantity: '1', unit: 'can', name: 'black beans, drained' },
      { quantity: '', unit: '', name: 'jalapeños, sour cream, salsa for topping' },
    ],
    instructions: [
      'Preheat oven to 375°F. Brown beef; drain. Add taco seasoning and ¼ cup water.',
      'Spread chips on a large baking sheet; layer with beef, beans, and cheese.',
      'Bake 8–10 min until cheese is melted.',
      'Top with jalapeños, sour cream, and salsa.',
    ],
  },

  79: { // Chili Mac
    servings: 8, prepTime: '10 min', cookTime: '30 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '2', unit: 'cups', name: 'elbow macaroni, uncooked' },
      { quantity: '1', unit: 'can', name: 'kidney beans, drained' },
      { quantity: '1', unit: 'can', name: 'diced tomatoes (15 oz)' },
      { quantity: '2', unit: 'tbsp', name: 'chili powder' },
      { quantity: '2', unit: 'cups', name: 'beef broth' },
      { quantity: '1', unit: 'cup', name: 'Shredded Cheddar Cheese for topping' },
    ],
    instructions: [
      'Brown beef in a large pot; drain fat.',
      'Add tomatoes, beans, broth, and chili powder; bring to boil.',
      'Stir in macaroni; reduce heat, simmer 10–12 min until pasta is tender.',
      'Top bowls with shredded cheddar.',
    ],
  },

  80: { // Salisbury Steak
    servings: 4, prepTime: '15 min', cookTime: '25 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'ground beef' },
      { quantity: '¼', unit: 'cup', name: 'breadcrumbs' },
      { quantity: '1', unit: '', name: 'egg' },
      { quantity: '8', unit: 'oz', name: 'mushrooms, sliced' },
      { quantity: '2', unit: 'cups', name: 'beef broth' },
      { quantity: '2', unit: 'tbsp', name: 'flour' },
      { quantity: '1', unit: 'tbsp', name: 'Worcestershire sauce' },
    ],
    instructions: [
      'Mix beef, breadcrumbs, egg, salt, and pepper; form 4 oval patties.',
      'Brown patties in a skillet 3 min per side; remove.',
      'Sauté mushrooms; whisk in flour, then broth and Worcestershire. Simmer until thickened.',
      'Return patties to gravy; cover and simmer 15 min. Serve over mashed potatoes.',
    ],
  },

  81: { // Mississippi Pot Roast
    servings: 6, prepTime: '5 min', cookTime: '480 min',
    ingredients: [
      { quantity: '3', unit: 'lbs', name: 'beef chuck roast' },
      { quantity: '1', unit: 'packet', name: 'ranch dressing mix' },
      { quantity: '1', unit: 'packet', name: 'au jus gravy mix' },
      { quantity: '½', unit: 'stick', name: 'butter' },
      { quantity: '6–8', unit: '', name: 'pepperoncini peppers' },
    ],
    instructions: [
      'Place chuck roast in slow cooker.',
      'Sprinkle ranch and au jus mixes over roast.',
      'Place butter on top; add pepperoncini around the roast.',
      'Cook on Low 8 hours; shred beef in the juices before serving.',
    ],
  },

  82: { // Birria Tacos
    servings: 8, prepTime: '30 min', cookTime: '180 min',
    ingredients: [
      { quantity: '3', unit: 'lbs', name: 'beef chuck roast, cut into chunks' },
      { quantity: '4', unit: '', name: 'dried guajillo chiles, stemmed and seeded' },
      { quantity: '2', unit: '', name: 'dried ancho chiles' },
      { quantity: '4', unit: 'cloves', name: 'garlic' },
      { quantity: '1', unit: 'can', name: 'diced tomatoes' },
      { quantity: '1', unit: 'tsp', name: 'cumin, oregano, and smoked paprika' },
      { quantity: '16', unit: '', name: 'corn tortillas' },
      { quantity: '1', unit: 'cup', name: 'shredded Oaxaca or mozzarella cheese' },
    ],
    instructions: [
      'Toast dried chiles in a dry skillet; soak in hot water 20 min. Blend with garlic, tomatoes, and spices.',
      'Brown beef; add chile sauce and enough water to cover. Simmer covered 2–2.5 hours until beef shreds.',
      'Shred beef; reserve consommé (broth) for dipping.',
      'Dip tortillas in fat from consommé; fill with beef and cheese, fold, and griddle until crispy. Serve with consommé.',
    ],
  },

  83: { // Carne Asada
    servings: 6, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '2', unit: 'lbs', name: 'flank or skirt steak' },
      { quantity: '¼', unit: 'cup', name: 'orange juice' },
      { quantity: '3', unit: 'tbsp', name: 'lime juice' },
      { quantity: '4', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '2', unit: 'tsp', name: 'cumin and chili powder' },
      { quantity: '3', unit: 'tbsp', name: 'olive oil' },
      { quantity: '', unit: '', name: 'cilantro and jalapeño for serving' },
    ],
    instructions: [
      'Whisk together orange juice, lime juice, garlic, cumin, chili powder, and olive oil.',
      'Marinate steak at least 2 hours (overnight preferred).',
      'Grill over high heat 4–5 min per side; rest 5 min.',
      'Slice thin against the grain. Serve in tortillas with salsa, onion, and cilantro.',
    ],
  },

  84: { // Bolognese
    servings: 6, prepTime: '15 min', cookTime: '60 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '½', unit: 'lb', name: 'Pork' },
      { quantity: '1', unit: 'can', name: 'crushed tomatoes (28 oz)' },
      { quantity: '½', unit: 'cup', name: 'dry red wine or beef broth' },
      { quantity: '½', unit: 'cup', name: 'Milk' },
      { quantity: '1', unit: '', name: 'onion, celery stalk, carrot — all diced fine' },
      { quantity: '1', unit: 'lb', name: 'pasta (tagliatelle or rigatoni)' },
    ],
    instructions: [
      'Sauté onion, celery, and carrot in olive oil until softened.',
      'Add beef and pork; brown thoroughly. Add wine; cook until evaporated.',
      'Stir in tomatoes and milk; simmer uncovered 45 min, stirring occasionally.',
      'Cook pasta; toss with sauce and parmesan.',
    ],
  },

  85: { // Beef Stuffed Shells
    servings: 6, prepTime: '25 min', cookTime: '35 min',
    ingredients: [
      { quantity: '20', unit: '', name: 'jumbo pasta shells, cooked' },
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '15', unit: 'oz', name: 'Ricotta Cheese' },
      { quantity: '2', unit: 'cups', name: 'Mozzarella Cheese' },
      { quantity: '1', unit: 'jar', name: 'marinara sauce' },
      { quantity: '1', unit: '', name: 'egg' },
    ],
    instructions: [
      'Preheat oven to 375°F. Brown beef; drain.',
      'Mix beef with ricotta, egg, and 1 cup mozzarella.',
      'Spread half the marinara in a baking dish; fill shells with beef mixture and place on sauce.',
      'Top with remaining marinara and mozzarella. Bake 30 min.',
    ],
  },

  86: { // Beef Quesadillas
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '1', unit: 'packet', name: 'taco seasoning' },
      { quantity: '8', unit: '', name: 'flour tortillas (medium)' },
      { quantity: '2', unit: 'cups', name: 'shredded Mexican cheese blend' },
      { quantity: '', unit: '', name: 'salsa and sour cream for serving' },
    ],
    instructions: [
      'Brown beef; drain. Add taco seasoning and ¼ cup water; simmer.',
      'Heat a skillet over medium. Place a tortilla in pan; top half with beef and cheese.',
      'Fold over; cook 2–3 min per side until golden and cheese is melted.',
      'Slice into wedges; serve with salsa and sour cream.',
    ],
  },

  87: { // Beef Barley Soup
    servings: 8, prepTime: '15 min', cookTime: '60 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'stew beef, cubed' },
      { quantity: '½', unit: 'cup', name: 'pearl barley' },
      { quantity: '6', unit: 'cups', name: 'beef broth' },
      { quantity: '3', unit: '', name: 'carrots, sliced' },
      { quantity: '3', unit: 'stalks', name: 'celery, sliced' },
      { quantity: '1', unit: '', name: 'onion, diced' },
      { quantity: '2', unit: 'tbsp', name: 'tomato paste' },
    ],
    instructions: [
      'Brown beef in a large pot; remove and set aside.',
      'Sauté onion, carrots, and celery in same pot until softened.',
      'Add broth, tomato paste, beef, and barley; bring to boil.',
      'Reduce heat; simmer 45–50 min until beef is tender and barley is cooked.',
    ],
  },

  88: { // Smash Burgers
    servings: 4, prepTime: '10 min', cookTime: '10 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'ground beef (80/20)' },
      { quantity: '4', unit: '', name: 'brioche buns, toasted' },
      { quantity: '8', unit: 'slices', name: 'American cheese' },
      { quantity: '2', unit: 'tbsp', name: 'butter' },
      { quantity: '', unit: '', name: 'smash burger sauce: mayo, ketchup, mustard, pickles, diced onion' },
    ],
    instructions: [
      'Divide beef into 8 loosely packed 3-oz balls.',
      'Heat a cast iron over high until smoking. Place a ball, smash flat immediately with a spatula.',
      'Season with salt; cook 90 sec. Flip; add cheese; cook 60 sec. Stack two patties per bun.',
      'Spread sauce on toasted buns; assemble with pickles and onion.',
    ],
  },

  89: { // Beef Ziti
    servings: 6, prepTime: '15 min', cookTime: '35 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '12', unit: 'oz', name: 'ziti pasta' },
      { quantity: '1', unit: 'jar', name: 'marinara sauce' },
      { quantity: '1', unit: 'cup', name: 'Ricotta Cheese' },
      { quantity: '2', unit: 'cups', name: 'Mozzarella Cheese' },
    ],
    instructions: [
      'Preheat oven to 375°F. Cook ziti; drain. Brown beef; drain fat.',
      'Mix pasta, beef, marinara, and ricotta; transfer to a greased baking dish.',
      'Top with mozzarella.',
      'Bake 25 min until bubbly and cheese is golden.',
    ],
  },

  90: { // Beef Bulgogi
    servings: 4, prepTime: '15 min', cookTime: '10 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'beef ribeye or sirloin, thinly sliced' },
      { quantity: '4', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '2', unit: 'tbsp', name: 'brown sugar' },
      { quantity: '1', unit: 'tbsp', name: 'sesame oil' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '½', unit: '', name: 'Asian pear or kiwi, grated (tenderizer)' },
      { quantity: '3', unit: 'cups', name: 'cooked rice for serving' },
    ],
    instructions: [
      'Combine soy sauce, brown sugar, sesame oil, garlic, and grated pear.',
      'Marinate sliced beef at least 30 min.',
      'Cook in a very hot skillet or grill in batches until caramelized, 2–3 min per side.',
      'Serve over rice with kimchi and green onions.',
    ],
  },

  91: { // Beef Kebabs
    servings: 4, prepTime: '20 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'sirloin, cut into 1.5-inch cubes' },
      { quantity: '2', unit: '', name: 'bell peppers, cut into chunks' },
      { quantity: '1', unit: '', name: 'red onion, cut into chunks' },
      { quantity: '3', unit: 'tbsp', name: 'olive oil' },
      { quantity: '2', unit: 'tbsp', name: 'soy sauce, lemon juice, and garlic' },
    ],
    instructions: [
      'Marinate beef in olive oil, soy sauce, lemon juice, and garlic for 1 hour.',
      'Thread beef, peppers, and onion onto skewers alternating.',
      'Grill over medium-high heat, turning every 3–4 min, about 12 min total.',
      'Rest 5 min before serving.',
    ],
  },

  92: { // Stuffed Cabbage Rolls
    servings: 6, prepTime: '30 min', cookTime: '90 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '1', unit: 'cup', name: 'White Rice' },
      { quantity: '1', unit: '', name: 'head of cabbage' },
      { quantity: '1', unit: 'can', name: 'tomato soup (10 oz)' },
      { quantity: '1', unit: 'can', name: 'diced tomatoes' },
      { quantity: '1', unit: '', name: 'egg' },
    ],
    instructions: [
      'Boil cabbage head until outer leaves can be peeled off; separate 12 leaves.',
      'Mix beef, rice, egg, salt, and pepper.',
      'Place filling in each leaf; roll tightly tucking in sides.',
      'Place in a baking dish; mix tomato soup and diced tomatoes, pour over rolls. Cover; bake at 350°F for 1.5 hours.',
    ],
  },

  93: { // Ground Beef Casserole
    servings: 6, prepTime: '15 min', cookTime: '30 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'ground beef' },
      { quantity: '3', unit: 'cups', name: 'egg noodles, cooked' },
      { quantity: '1', unit: 'can', name: 'cream of mushroom soup' },
      { quantity: '1', unit: 'cup', name: 'sour cream' },
      { quantity: '1', unit: 'cup', name: 'Cheddar Cheese' },
      { quantity: '1', unit: '', name: 'onion, diced' },
    ],
    instructions: [
      'Preheat oven to 350°F. Brown beef and onion; drain.',
      'Stir in cream of mushroom soup, sour cream, and cooked noodles.',
      'Transfer to a greased baking dish; top with cheddar.',
      'Bake 25–30 min until bubbly.',
    ],
  },

  // ── CHICKEN ───────────────────────────────────────────────────────────────

  32: { // Stir Fry
    servings: 4, prepTime: '15 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'chicken breast, sliced thin' },
      { quantity: '4', unit: 'cups', name: 'mixed vegetables (broccoli, snap peas, bell pepper, carrots)' },
      { quantity: '3', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '2', unit: 'tbsp', name: 'oyster sauce or hoisin sauce' },
      { quantity: '1', unit: 'tbsp', name: 'sesame oil' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '3', unit: 'cups', name: 'cooked rice for serving' },
    ],
    instructions: [
      'Stir together soy sauce, oyster sauce, and sesame oil; set aside.',
      'Heat wok or large skillet over high. Cook chicken in batches until golden; remove.',
      'Add vegetables and garlic; stir-fry 3–4 min until crisp-tender.',
      'Return chicken, pour sauce over, toss 1 min. Serve over rice.',
    ],
  },

  33: { // Chicken Tacos
    servings: 6, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'chicken breast or thighs' },
      { quantity: '1', unit: 'packet', name: 'taco seasoning' },
      { quantity: '12', unit: '', name: 'corn or flour tortillas' },
      { quantity: '1', unit: 'cup', name: 'shredded cheese' },
      { quantity: '', unit: '', name: 'salsa, sour cream, lettuce, lime' },
    ],
    instructions: [
      'Season chicken with taco seasoning.',
      'Cook in a skillet with a little oil over medium-high, 6–7 min per side. Rest and shred.',
      'Warm tortillas.',
      'Fill tortillas with chicken and desired toppings.',
    ],
  },

  34: { // Alfredo
    servings: 4, prepTime: '10 min', cookTime: '25 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'fettuccine' },
      { quantity: '1.5', unit: 'lbs', name: 'chicken breast, sliced' },
      { quantity: '1.5', unit: 'cups', name: 'heavy cream' },
      { quantity: '1', unit: 'cup', name: 'grated parmesan' },
      { quantity: '4', unit: 'tbsp', name: 'butter' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
    ],
    instructions: [
      'Cook fettuccine; reserve ½ cup pasta water. Drain.',
      'Season and cook chicken in butter until cooked through; remove and slice.',
      'In same pan, sauté garlic; add heavy cream, simmer 5 min until slightly thickened.',
      'Stir in parmesan; toss with pasta and chicken, adding pasta water as needed.',
    ],
  },

  35: { // Chicken Parm
    servings: 4, prepTime: '20 min', cookTime: '25 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'chicken breasts, pounded thin' },
      { quantity: '1', unit: 'cup', name: 'Italian breadcrumbs' },
      { quantity: '2', unit: '', name: 'eggs, beaten' },
      { quantity: '1.5', unit: 'cups', name: 'marinara sauce' },
      { quantity: '1', unit: 'cup', name: 'Mozzarella Cheese' },
      { quantity: '¼', unit: 'cup', name: 'grated parmesan' },
    ],
    instructions: [
      'Dip chicken in egg then breadcrumbs; pan-fry in oil over medium-high 3–4 min per side.',
      'Transfer to a baking dish; top each piece with marinara, mozzarella, and parmesan.',
      'Bake at 400°F for 15 min until cheese is bubbly.',
      'Serve over pasta with extra marinara.',
    ],
  },

  36: { // Pesto Pasta
    servings: 4, prepTime: '10 min', cookTime: '20 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'pasta (penne or rotini)' },
      { quantity: '1.5', unit: 'lbs', name: 'chicken breast, sliced' },
      { quantity: '1', unit: 'jar', name: 'basil pesto (6–7 oz)' },
      { quantity: '½', unit: 'cup', name: 'cherry tomatoes, halved' },
      { quantity: '½', unit: 'cup', name: 'grated parmesan' },
    ],
    instructions: [
      'Cook pasta; reserve ¼ cup pasta water, drain.',
      'Season and cook chicken in olive oil until cooked through; slice.',
      'Toss warm pasta with pesto, adding pasta water to loosen.',
      'Top with chicken, tomatoes, and parmesan.',
    ],
  },

  37: { // Chicken Parm Soup
    servings: 6, prepTime: '15 min', cookTime: '30 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'chicken breast, cubed' },
      { quantity: '4', unit: 'cups', name: 'chicken broth' },
      { quantity: '1', unit: 'can', name: 'crushed tomatoes (15 oz)' },
      { quantity: '2', unit: 'cups', name: 'ditalini or small pasta' },
      { quantity: '1', unit: 'tsp', name: 'Italian seasoning' },
      { quantity: '1', unit: 'cup', name: 'shredded mozzarella for topping' },
      { quantity: '¼', unit: 'cup', name: 'grated parmesan for topping' },
    ],
    instructions: [
      'Cook chicken in a large pot with a little oil; season with Italian seasoning.',
      'Add broth and crushed tomatoes; bring to boil.',
      'Add pasta; cook 10 min until tender.',
      'Ladle into bowls; top with mozzarella and parmesan.',
    ],
  },

  38: { // Pot Pie
    servings: 6, prepTime: '20 min', cookTime: '45 min',
    ingredients: [
      { quantity: '2', unit: 'cups', name: 'cooked chicken, diced or shredded' },
      { quantity: '2', unit: 'cups', name: 'frozen mixed vegetables' },
      { quantity: '1', unit: 'can', name: 'cream of chicken soup' },
      { quantity: '½', unit: 'cup', name: 'chicken broth' },
      { quantity: '2', unit: '', name: 'pie crusts (store-bought)' },
      { quantity: '½', unit: 'cup', name: 'sour cream' },
    ],
    instructions: [
      'Preheat oven to 375°F. Mix chicken, vegetables, soup, broth, and sour cream.',
      'Line a 9-inch pie dish with one crust; pour in filling.',
      'Top with second crust; crimp edges, cut vent slits.',
      'Bake 40–45 min until crust is golden. Rest 10 min before serving.',
    ],
  },

  39: { // Chicken and Rice
    servings: 4, prepTime: '10 min', cookTime: '35 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'chicken thighs or breasts (bone-in)' },
      { quantity: '1.5', unit: 'cups', name: 'long-grain white rice' },
      { quantity: '3', unit: 'cups', name: 'chicken broth' },
      { quantity: '1', unit: 'can', name: 'cream of chicken soup' },
      { quantity: '1', unit: '', name: 'onion, diced' },
      { quantity: '', unit: '', name: 'garlic powder, salt, pepper' },
    ],
    instructions: [
      'Preheat oven to 350°F.',
      'Mix rice, broth, cream of chicken, and onion in a 9x13 dish.',
      'Nestle chicken pieces on top; season generously.',
      'Cover tightly with foil; bake 45–50 min until rice is cooked and chicken reaches 165°F.',
    ],
  },

  40: { // Chicken and Noodles
    servings: 6, prepTime: '10 min', cookTime: '60 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'chicken breast or thighs' },
      { quantity: '12', unit: 'oz', name: 'egg noodles' },
      { quantity: '6', unit: 'cups', name: 'chicken broth' },
      { quantity: '2', unit: 'stalks', name: 'celery, sliced' },
      { quantity: '2', unit: '', name: 'carrots, sliced' },
      { quantity: '1', unit: '', name: 'onion, diced' },
    ],
    instructions: [
      'Simmer chicken in broth with celery, carrots, and onion until cooked, about 25 min.',
      'Remove chicken; shred.',
      'Bring broth back to a boil; add noodles and cook per package directions.',
      'Return chicken; season with salt and pepper.',
    ],
  },

  41: { // Creamy Chicken and Noodles
    servings: 6, prepTime: '10 min', cookTime: '25 min',
    ingredients: [
      { quantity: '2', unit: 'cups', name: 'cooked chicken, shredded' },
      { quantity: '12', unit: 'oz', name: 'egg noodles, cooked' },
      { quantity: '1', unit: 'can', name: 'cream of chicken soup' },
      { quantity: '1', unit: 'cup', name: 'sour cream' },
      { quantity: '1', unit: 'cup', name: 'chicken broth' },
      { quantity: '1', unit: 'cup', name: 'frozen peas' },
    ],
    instructions: [
      'In a large pot, whisk together cream of chicken soup, sour cream, and broth over medium heat.',
      'Stir in chicken, peas, and cooked noodles.',
      'Heat through, stirring occasionally, about 10 min.',
      'Season with salt and pepper.',
    ],
  },

  42: { // Garlic Parm Crock Pot Chicken
    servings: 6, prepTime: '10 min', cookTime: '360 min',
    ingredients: [
      { quantity: '2', unit: 'lbs', name: 'chicken breasts' },
      { quantity: '4', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '4', unit: 'oz', name: 'cream cheese, cubed' },
      { quantity: '1', unit: 'cup', name: 'chicken broth' },
      { quantity: '½', unit: 'cup', name: 'grated parmesan' },
      { quantity: '2', unit: 'tbsp', name: 'butter' },
    ],
    instructions: [
      'Place chicken in slow cooker; add garlic, broth, and butter.',
      'Cook on Low 6 hours or High 3 hours.',
      'Shred chicken; stir in cream cheese and parmesan until smooth.',
      'Serve over pasta, mashed potatoes, or rice.',
    ],
  },

  43: { // Chicken Strips
    servings: 4, prepTime: '15 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'chicken tenders' },
      { quantity: '1', unit: 'cup', name: 'seasoned breadcrumbs or panko' },
      { quantity: '2', unit: '', name: 'eggs, beaten' },
      { quantity: '½', unit: 'cup', name: 'all-purpose flour' },
      { quantity: '3', unit: 'tbsp', name: 'vegetable oil (for pan) or cooking spray (for oven)' },
      { quantity: '', unit: '', name: 'salt, pepper, garlic powder, paprika' },
    ],
    instructions: [
      'Season flour; dredge chicken in flour, dip in egg, then coat in breadcrumbs.',
      'Pan-fry: cook in oil over medium-high 3–4 min per side until golden and cooked through.',
      'Oven: bake at 400°F for 20 min, flipping halfway, until crispy.',
      'Serve with dipping sauce.',
    ],
  },

  44: { // Chicken Potato Bake
    servings: 4, prepTime: '15 min', cookTime: '50 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'chicken thighs (bone-in, skin-on)' },
      { quantity: '4', unit: '', name: 'potatoes, cut into wedges' },
      { quantity: '1', unit: '', name: 'onion, sliced' },
      { quantity: '3', unit: 'tbsp', name: 'olive oil' },
      { quantity: '1', unit: 'tsp', name: 'garlic powder, paprika, Italian seasoning' },
    ],
    instructions: [
      'Preheat oven to 400°F. Toss potatoes and onion with olive oil and seasoning.',
      'Spread in a single layer in a large baking pan.',
      'Season chicken thighs; nestle among vegetables skin-side up.',
      'Bake 45–50 min until chicken skin is crispy and potatoes are tender.',
    ],
  },

  45: { // Chicken With Garlic Parmesan Rice
    servings: 4, prepTime: '10 min', cookTime: '30 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'chicken breasts' },
      { quantity: '1.5', unit: 'cups', name: 'long-grain white rice' },
      { quantity: '3', unit: 'cups', name: 'chicken broth' },
      { quantity: '4', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '½', unit: 'cup', name: 'grated parmesan' },
      { quantity: '2', unit: 'tbsp', name: 'butter' },
    ],
    instructions: [
      'Cook rice in chicken broth with garlic and butter; fluff, stir in parmesan.',
      'Season chicken; cook in an oven-safe skillet over medium-high 4 min per side.',
      'Transfer skillet to 375°F oven; bake 15 min until chicken reaches 165°F.',
      'Serve chicken over garlic parmesan rice.',
    ],
  },

  46: { // Slow Cooker Chicken Chili
    servings: 8, prepTime: '10 min', cookTime: '360 min',
    ingredients: [
      { quantity: '2', unit: 'lbs', name: 'chicken breasts' },
      { quantity: '2', unit: 'cans', name: 'white beans (cannellini), drained' },
      { quantity: '1', unit: 'can', name: 'green chiles (4 oz)' },
      { quantity: '1', unit: 'can', name: 'corn, drained' },
      { quantity: '4', unit: 'cups', name: 'chicken broth' },
      { quantity: '1', unit: 'packet', name: 'ranch dressing mix' },
      { quantity: '8', unit: 'oz', name: 'cream cheese (add last 30 min)' },
    ],
    instructions: [
      'Add chicken, beans, chiles, corn, broth, and ranch mix to slow cooker.',
      'Cook on Low 6 hours or High 3 hours.',
      'Shred chicken with two forks directly in the pot.',
      'Stir in cream cheese; cover 20–30 min until melted and smooth.',
    ],
  },

  94: { // Buffalo Chicken
    servings: 4, prepTime: '10 min', cookTime: '25 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'chicken breast or tenders' },
      { quantity: '½', unit: 'cup', name: 'Frank\'s RedHot or buffalo sauce' },
      { quantity: '4', unit: 'tbsp', name: 'butter, melted' },
      { quantity: '', unit: '', name: 'ranch or blue cheese dressing, celery, carrot sticks' },
    ],
    instructions: [
      'Cook chicken in oven at 400°F for 20–22 min or pan-fry until cooked through.',
      'Whisk buffalo sauce and melted butter together.',
      'Toss hot cooked chicken in buffalo sauce.',
      'Serve with ranch or blue cheese, celery, and carrots. Use as-is or over rice, in wraps, or on pizza.',
    ],
  },

  95: { // Chicken Enchiladas
    servings: 6, prepTime: '20 min', cookTime: '25 min',
    ingredients: [
      { quantity: '2', unit: 'cups', name: 'cooked chicken, shredded' },
      { quantity: '2', unit: 'cans', name: 'green or red enchilada sauce (10 oz each)' },
      { quantity: '12', unit: '', name: 'corn tortillas' },
      { quantity: '2', unit: 'cups', name: 'shredded Mexican cheese blend' },
      { quantity: '4', unit: 'oz', name: 'cream cheese, softened' },
    ],
    instructions: [
      'Preheat oven to 375°F. Mix chicken with cream cheese and ¼ cup enchilada sauce.',
      'Dip tortillas in sauce; fill with chicken mixture, roll up, place seam-down in dish.',
      'Pour remaining sauce over; top with cheese.',
      'Bake 20–25 min until bubbly.',
    ],
  },

  96: { // Chicken Fried Rice
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'chicken breast, diced small' },
      { quantity: '3', unit: 'cups', name: 'cooked white rice (day-old preferred)' },
      { quantity: '1', unit: 'cup', name: 'frozen peas and carrots' },
      { quantity: '3', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '2', unit: '', name: 'eggs, scrambled' },
      { quantity: '2', unit: 'tbsp', name: 'sesame oil' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
    ],
    instructions: [
      'Cook chicken in a hot wok or skillet until golden; add garlic.',
      'Push to side; scramble eggs in pan.',
      'Add rice and frozen vegetables; stir-fry 3–4 min.',
      'Drizzle soy sauce and sesame oil; toss everything together.',
    ],
  },

  97: { // Chicken Fajitas
    servings: 4, prepTime: '15 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'chicken breast, sliced thin' },
      { quantity: '3', unit: '', name: 'bell peppers, sliced' },
      { quantity: '1', unit: '', name: 'onion, sliced' },
      { quantity: '2', unit: 'tbsp', name: 'fajita or taco seasoning' },
      { quantity: '2', unit: 'tbsp', name: 'lime juice' },
      { quantity: '8', unit: '', name: 'flour tortillas, warmed' },
    ],
    instructions: [
      'Toss chicken with seasoning and lime juice; let sit 15 min.',
      'Cook chicken in a hot skillet over high heat until cooked through; set aside.',
      'Cook peppers and onion in same skillet until slightly charred.',
      'Serve chicken and vegetables in warm tortillas with sour cream and salsa.',
    ],
  },

  98: { // BBQ Chicken
    servings: 4, prepTime: '5 min', cookTime: '30 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'chicken thighs or breasts' },
      { quantity: '1', unit: 'cup', name: 'BBQ sauce' },
      { quantity: '1', unit: 'tbsp', name: 'olive oil' },
      { quantity: '', unit: '', name: 'salt, pepper, garlic powder' },
    ],
    instructions: [
      'Season chicken with salt, pepper, and garlic powder.',
      'Grill or bake at 400°F 20–25 min, turning once.',
      'Brush generously with BBQ sauce the last 5 min of cooking.',
      'Rest 5 min before serving.',
    ],
  },

  99: { // Honey Garlic Chicken
    servings: 4, prepTime: '10 min', cookTime: '25 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'chicken thighs, bone-in skin-on' },
      { quantity: '3', unit: 'tbsp', name: 'honey' },
      { quantity: '3', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '4', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '1', unit: 'tbsp', name: 'butter' },
    ],
    instructions: [
      'Season chicken; sear skin-side down in an oven-safe skillet over medium-high 4 min.',
      'Flip; add butter, garlic, honey, and soy sauce to pan.',
      'Baste chicken; transfer skillet to 400°F oven for 20–25 min.',
      'Spoon pan sauce over chicken before serving.',
    ],
  },

  100: { // Lemon Pepper Chicken
    servings: 4, prepTime: '5 min', cookTime: '25 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'chicken breasts' },
      { quantity: '2', unit: 'tsp', name: 'lemon pepper seasoning' },
      { quantity: '1', unit: '', name: 'lemon, sliced' },
      { quantity: '2', unit: 'tbsp', name: 'butter' },
      { quantity: '', unit: '', name: 'salt, garlic powder' },
    ],
    instructions: [
      'Preheat oven to 400°F. Season chicken with lemon pepper, garlic powder, and salt.',
      'Melt butter in an oven-safe skillet; sear chicken 3 min per side.',
      'Top with lemon slices; transfer to oven, bake 15–18 min until 165°F.',
      'Rest 5 min; spoon pan juices over before serving.',
    ],
  },

  101: { // Chicken Tikka Masala
    servings: 6, prepTime: '20 min', cookTime: '30 min',
    ingredients: [
      { quantity: '2', unit: 'lbs', name: 'chicken thighs, cubed' },
      { quantity: '1', unit: 'can', name: 'crushed tomatoes (15 oz)' },
      { quantity: '1', unit: 'cup', name: 'heavy cream or coconut milk' },
      { quantity: '2', unit: 'tbsp', name: 'tikka masala spice blend (or garam masala, cumin, paprika, turmeric, coriander)' },
      { quantity: '3', unit: 'cloves', name: 'Garlic' },
      { quantity: '1', unit: 'tsp', name: 'Fresh Ginger' },
      { quantity: '1', unit: '', name: 'onion, diced' },
      { quantity: '3', unit: 'cups', name: 'basmati rice for serving' },
    ],
    instructions: [
      'Cook onion, garlic, and ginger in oil; stir in spices, cook 1 min.',
      'Add tomatoes; simmer 10 min.',
      'Add chicken; cook 15 min until cooked through.',
      'Stir in cream; simmer 5 min. Serve over basmati rice with naan.',
    ],
  },

  102: { // Orange Chicken
    servings: 4, prepTime: '15 min', cookTime: '20 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'chicken thighs, cut into pieces' },
      { quantity: '½', unit: 'cup', name: 'orange juice' },
      { quantity: '3', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '2', unit: 'tbsp', name: 'brown sugar' },
      { quantity: '1', unit: 'tbsp', name: 'cornstarch' },
      { quantity: '1', unit: 'tsp', name: 'orange zest' },
      { quantity: '½', unit: 'cup', name: 'cornstarch for coating' },
    ],
    instructions: [
      'Coat chicken in cornstarch; fry in oil over medium-high until crispy, about 5 min. Remove.',
      'Whisk orange juice, soy sauce, brown sugar, 1 tbsp cornstarch, and orange zest.',
      'Pour into pan; cook until thickened, about 3 min.',
      'Toss chicken in sauce; serve over rice.',
    ],
  },

  103: { // Chicken Marsala
    servings: 4, prepTime: '15 min', cookTime: '20 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'chicken breasts, pounded thin' },
      { quantity: '½', unit: 'cup', name: 'Marsala wine' },
      { quantity: '1', unit: 'cup', name: 'chicken broth' },
      { quantity: '8', unit: 'oz', name: 'mushrooms, sliced' },
      { quantity: '3', unit: 'tbsp', name: 'butter' },
      { quantity: '½', unit: 'cup', name: 'flour for dredging' },
    ],
    instructions: [
      'Dredge chicken in flour; cook in butter over medium-high 3–4 min per side. Remove.',
      'Sauté mushrooms in same pan until golden.',
      'Add Marsala wine; let reduce 2 min. Add broth; simmer 5 min.',
      'Return chicken; simmer in sauce 5 min. Spoon sauce over chicken before serving.',
    ],
  },

  104: { // Chicken Burrito Bowl
    servings: 4, prepTime: '15 min', cookTime: '20 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'Chicken Breast' },
      { quantity: '1', unit: 'packet', name: 'taco or fajita seasoning' },
      { quantity: '2', unit: 'cups', name: 'cooked white or cilantro-lime rice' },
      { quantity: '1', unit: 'can', name: 'black beans, drained and warmed' },
      { quantity: '1', unit: 'cup', name: 'corn (fresh, frozen, or canned)' },
      { quantity: '', unit: '', name: 'salsa, guacamole, shredded cheese, sour cream' },
    ],
    instructions: [
      'Season chicken with taco seasoning; cook in a skillet until cooked through.',
      'Slice or shred chicken.',
      'Build bowls: rice base, then beans, corn, chicken.',
      'Top with salsa, guacamole, cheese, and sour cream.',
    ],
  },

  105: { // Chicken Quesadillas
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'chicken breast, cooked and shredded' },
      { quantity: '8', unit: '', name: 'Flour Tortillas' },
      { quantity: '2', unit: 'cups', name: 'shredded Mexican cheese blend' },
      { quantity: '', unit: '', name: 'salsa, sour cream, guacamole for serving' },
    ],
    instructions: [
      'Heat a skillet over medium.',
      'Lay a tortilla in pan; top one half with chicken and cheese.',
      'Fold over; cook 2–3 min per side until golden and cheese is melted.',
      'Slice into wedges; serve with salsa, sour cream, and guacamole.',
    ],
  },

  106: { // White Chicken Chili
    servings: 8, prepTime: '10 min', cookTime: '360 min',
    ingredients: [
      { quantity: '2', unit: 'lbs', name: 'Chicken Breast' },
      { quantity: '2', unit: 'cans', name: 'great northern or cannellini beans, drained' },
      { quantity: '2', unit: 'cans', name: 'diced green chiles (4 oz each)' },
      { quantity: '4', unit: 'cups', name: 'chicken broth' },
      { quantity: '1', unit: 'tsp', name: 'cumin and garlic powder' },
      { quantity: '8', unit: 'oz', name: 'cream cheese' },
      { quantity: '1', unit: 'cup', name: 'sour cream' },
    ],
    instructions: [
      'Add chicken, beans, chiles, broth, cumin, and garlic powder to slow cooker.',
      'Cook on Low 6 hours or High 3 hours.',
      'Shred chicken; stir in cream cheese and sour cream until smooth.',
      'Serve with shredded cheese, jalapeño, and tortilla chips.',
    ],
  },

  107: { // Chicken Tortilla Soup
    servings: 8, prepTime: '10 min', cookTime: '30 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'chicken breast, cooked and shredded' },
      { quantity: '1', unit: 'can', name: 'Rotel (diced tomatoes with green chiles)' },
      { quantity: '1', unit: 'can', name: 'black beans, drained' },
      { quantity: '1', unit: 'can', name: 'corn, drained' },
      { quantity: '4', unit: 'cups', name: 'chicken broth' },
      { quantity: '1', unit: 'packet', name: 'taco seasoning' },
    ],
    instructions: [
      'Combine all ingredients in a large pot.',
      'Bring to boil; reduce heat and simmer 20 min.',
      'Adjust seasoning with salt and pepper.',
      'Serve topped with tortilla strips, sour cream, shredded cheese, and avocado.',
    ],
  },

  108: { // Chicken Piccata
    servings: 4, prepTime: '10 min', cookTime: '20 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'chicken breasts, pounded thin' },
      { quantity: '½', unit: 'cup', name: 'flour for dredging' },
      { quantity: '½', unit: 'cup', name: 'dry white wine or chicken broth' },
      { quantity: '¼', unit: 'cup', name: 'Lemon Juice' },
      { quantity: '2', unit: 'tbsp', name: 'capers, drained' },
      { quantity: '3', unit: 'tbsp', name: 'butter' },
    ],
    instructions: [
      'Dredge chicken in flour; cook in butter and olive oil 3–4 min per side. Remove.',
      'Deglaze pan with wine; let reduce 1 min.',
      'Add lemon juice and capers; swirl in remaining butter.',
      'Return chicken; spoon sauce over. Serve with pasta or mashed potatoes.',
    ],
  },

  109: { // Chicken Shawarma
    servings: 4, prepTime: '15 min', cookTime: '25 min',
    ingredients: [
      { quantity: '2', unit: 'lbs', name: 'chicken thighs' },
      { quantity: '2', unit: 'tsp', name: 'cumin, paprika, turmeric, garlic powder, coriander' },
      { quantity: '3', unit: 'tbsp', name: 'lemon juice and olive oil' },
      { quantity: '4', unit: '', name: 'pita breads' },
      { quantity: '', unit: '', name: 'tzatziki, diced tomato, cucumber, red onion' },
    ],
    instructions: [
      'Toss chicken with spices, lemon juice, and olive oil; marinate 30 min.',
      'Grill or bake at 425°F for 20–25 min until cooked through.',
      'Slice thin.',
      'Serve in pita with tzatziki, tomato, cucumber, and onion.',
    ],
  },

  110: { // Bruschetta Chicken
    servings: 4, prepTime: '15 min', cookTime: '20 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'chicken breasts, pounded thin' },
      { quantity: '3', unit: '', name: 'tomatoes, diced' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '¼', unit: 'cup', name: 'fresh basil, chopped' },
      { quantity: '4', unit: 'slices', name: 'Mozzarella Cheese' },
      { quantity: '2', unit: 'tbsp', name: 'balsamic glaze' },
    ],
    instructions: [
      'Season chicken; grill or pan-sear 5–6 min per side until cooked through.',
      'Mix tomatoes, garlic, basil, olive oil, salt, and pepper to make bruschetta.',
      'Top each chicken breast with mozzarella; broil 2 min to melt.',
      'Spoon bruschetta over chicken; drizzle with balsamic glaze.',
    ],
  },

  111: { // Chicken Stuffed Shells
    servings: 6, prepTime: '25 min', cookTime: '35 min',
    ingredients: [
      { quantity: '20', unit: '', name: 'jumbo pasta shells, cooked' },
      { quantity: '2', unit: 'cups', name: 'cooked chicken, shredded' },
      { quantity: '15', unit: 'oz', name: 'Ricotta Cheese' },
      { quantity: '2', unit: 'cups', name: 'Mozzarella Cheese' },
      { quantity: '1', unit: 'jar', name: 'alfredo or marinara sauce' },
      { quantity: '1', unit: '', name: 'egg' },
    ],
    instructions: [
      'Preheat oven to 375°F. Mix chicken, ricotta, egg, and 1 cup mozzarella.',
      'Spread half the sauce in a baking dish.',
      'Fill shells with chicken mixture; arrange over sauce.',
      'Top with remaining sauce and mozzarella. Bake 30 min.',
    ],
  },

  112: { // Chicken Cobbler
    servings: 8, prepTime: '10 min', cookTime: '55 min',
    ingredients: [
      { quantity: '1', unit: 'rotisserie', name: 'chicken, shredded (about 3 cups)' },
      { quantity: '2', unit: 'cups', name: 'frozen mixed vegetables' },
      { quantity: '1', unit: 'can', name: 'cream of chicken soup' },
      { quantity: '2', unit: 'cups', name: 'chicken broth' },
      { quantity: '½', unit: 'stick', name: 'butter, melted' },
      { quantity: '1', unit: 'box', name: 'Red Lobster Cheddar Bay Biscuit mix (plus seasoning packet)' },
      { quantity: '1', unit: 'cup', name: 'Milk' },
    ],
    instructions: [
      'Preheat oven to 375°F. Pour melted butter into a 9x13 baking dish.',
      'Mix chicken, vegetables, cream of chicken, and broth; pour over butter — do NOT stir.',
      'Mix biscuit dough (biscuit mix + milk); pour over the top — do NOT stir.',
      'Bake 45–55 min until biscuit top is golden and center is set. Sprinkle seasoning packet over top at the end.',
    ],
  },

  113: { // General Tso's Chicken
    servings: 4, prepTime: '20 min', cookTime: '20 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'chicken thighs, cut into pieces' },
      { quantity: '½', unit: 'cup', name: 'cornstarch for coating' },
      { quantity: '3', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '2', unit: 'tbsp', name: 'hoisin sauce' },
      { quantity: '2', unit: 'tbsp', name: 'brown sugar' },
      { quantity: '1', unit: 'tbsp', name: 'rice vinegar' },
      { quantity: '1', unit: 'tsp', name: 'sesame oil and red pepper flakes' },
    ],
    instructions: [
      'Coat chicken in cornstarch; fry in batches over medium-high until crispy and cooked, about 5 min per batch.',
      'Whisk together soy sauce, hoisin, brown sugar, vinegar, and sesame oil.',
      'In a clean pan, toast garlic and red pepper; add sauce, bring to simmer.',
      'Toss chicken in sauce; serve over rice with steamed broccoli.',
    ],
  },

  114: { // Chicken Divan
    servings: 6, prepTime: '15 min', cookTime: '30 min',
    ingredients: [
      { quantity: '2', unit: 'cups', name: 'cooked chicken, diced or shredded' },
      { quantity: '4', unit: 'cups', name: 'broccoli florets, steamed' },
      { quantity: '1', unit: 'can', name: 'cream of chicken soup' },
      { quantity: '½', unit: 'cup', name: 'mayonnaise' },
      { quantity: '½', unit: 'cup', name: 'sour cream' },
      { quantity: '1.5', unit: 'cups', name: 'Cheddar Cheese' },
      { quantity: '½', unit: 'cup', name: 'breadcrumbs' },
    ],
    instructions: [
      'Preheat oven to 350°F.',
      'Mix soup, mayo, sour cream, and 1 cup cheese.',
      'Layer broccoli in a greased baking dish; top with chicken, then sauce mixture.',
      'Mix remaining cheese with breadcrumbs; sprinkle over top. Bake 25–30 min until bubbly.',
    ],
  },

  116: { // Caprese Chicken
    servings: 4, prepTime: '10 min', cookTime: '20 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'chicken breasts' },
      { quantity: '4', unit: 'slices', name: 'Mozzarella Cheese' },
      { quantity: '2', unit: '', name: 'tomatoes, sliced' },
      { quantity: '¼', unit: 'cup', name: 'fresh basil leaves' },
      { quantity: '2', unit: 'tbsp', name: 'balsamic glaze' },
      { quantity: '', unit: '', name: 'salt, pepper, olive oil' },
    ],
    instructions: [
      'Season chicken; cook in olive oil over medium-high 5–6 min per side.',
      'Top each breast with tomato slice and mozzarella; cover and cook 2 min until cheese melts.',
      'Transfer to a plate; top with fresh basil.',
      'Drizzle with balsamic glaze before serving.',
    ],
  },

  117: { // Chicken Caesar Wrap
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'chicken breast, cooked and sliced' },
      { quantity: '4', unit: '', name: 'Flour Tortillas' },
      { quantity: '3', unit: 'cups', name: 'Romaine Lettuce' },
      { quantity: '½', unit: 'cup', name: 'Caesar dressing' },
      { quantity: '½', unit: 'cup', name: 'shaved parmesan' },
      { quantity: '½', unit: 'cup', name: 'croutons, crushed (optional)' },
    ],
    instructions: [
      'Warm tortillas.',
      'Toss romaine with Caesar dressing and parmesan.',
      'Layer chicken and salad mixture onto each tortilla.',
      'Fold in sides; roll up tightly. Cut in half.',
    ],
  },

  118: { // Chicken Ziti
    servings: 6, prepTime: '15 min', cookTime: '35 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'chicken breast, cubed' },
      { quantity: '12', unit: 'oz', name: 'ziti pasta' },
      { quantity: '1', unit: 'jar', name: 'marinara or pink vodka sauce' },
      { quantity: '1', unit: 'cup', name: 'ricotta (optional)' },
      { quantity: '2', unit: 'cups', name: 'Mozzarella Cheese' },
    ],
    instructions: [
      'Preheat oven to 375°F. Cook ziti; drain. Brown chicken; season.',
      'Toss ziti with chicken, sauce, and ricotta if using.',
      'Transfer to greased baking dish; top with mozzarella.',
      'Bake 25 min until cheese is bubbly and golden.',
    ],
  },

  // ── PORK ───────────────────────────────────────────────────────────────────

  48: { // Pork Stir Fry
    servings: 4, prepTime: '15 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'pork tenderloin, sliced thin' },
      { quantity: '4', unit: 'cups', name: 'mixed vegetables (broccoli, snap peas, bell pepper)' },
      { quantity: '3', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '2', unit: 'tbsp', name: 'oyster sauce' },
      { quantity: '1', unit: 'tbsp', name: 'sesame oil' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '3', unit: 'cups', name: 'cooked rice' },
    ],
    instructions: [
      'Stir together soy sauce, oyster sauce, and sesame oil.',
      'Cook pork in a hot wok or skillet in batches; remove.',
      'Stir-fry vegetables and garlic 3–4 min until crisp-tender.',
      'Return pork; pour sauce over, toss 1 min. Serve over rice.',
    ],
  },

  49: { // Pork Roast
    servings: 8, prepTime: '15 min', cookTime: '480 min',
    ingredients: [
      { quantity: '3', unit: 'lbs', name: 'pork shoulder or loin roast' },
      { quantity: '4', unit: '', name: 'potatoes, quartered' },
      { quantity: '3', unit: '', name: 'carrots, cut into chunks' },
      { quantity: '1', unit: '', name: 'onion, quartered' },
      { quantity: '1', unit: 'cup', name: 'chicken broth' },
      { quantity: '1', unit: 'packet', name: 'onion soup mix' },
    ],
    instructions: [
      'Season pork roast generously with salt and pepper.',
      'Place in slow cooker; scatter vegetables around.',
      'Pour broth over; sprinkle onion soup mix on top.',
      'Cook on Low 8 hours; rest before slicing or pulling.',
    ],
  },

  50: { // Balsamic Pork
    servings: 6, prepTime: '10 min', cookTime: '360 min',
    ingredients: [
      { quantity: '2', unit: 'lbs', name: 'pork tenderloin' },
      { quantity: '½', unit: 'cup', name: 'balsamic vinegar' },
      { quantity: '3', unit: 'tbsp', name: 'honey' },
      { quantity: '4', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '1', unit: 'tbsp', name: 'rosemary (fresh or dried)' },
    ],
    instructions: [
      'Whisk balsamic, honey, garlic, and rosemary.',
      'Place pork in slow cooker; pour sauce over.',
      'Cook on Low 6 hours.',
      'Rest pork; slice and spoon cooking juices over. Serve with roasted vegetables or mashed potatoes.',
    ],
  },

  51: { // Pulled Pork
    servings: 10, prepTime: '10 min', cookTime: '480 min',
    ingredients: [
      { quantity: '4', unit: 'lbs', name: 'pork shoulder (bone-in)' },
      { quantity: '1', unit: 'cup', name: 'BBQ sauce (plus more for serving)' },
      { quantity: '2', unit: 'tbsp', name: 'brown sugar, paprika, garlic powder, onion powder' },
      { quantity: '1', unit: 'tbsp', name: 'salt, black pepper, cumin' },
      { quantity: '10', unit: '', name: 'hamburger buns' },
    ],
    instructions: [
      'Mix dry rub (brown sugar, paprika, garlic, onion powder, salt, pepper, cumin); coat pork.',
      'Place in slow cooker; cook on Low 8–10 hours until fork-tender.',
      'Shred pork in the juices; stir in BBQ sauce.',
      'Pile onto buns; top with coleslaw.',
    ],
  },

  53: { // Pork Cutlets
    servings: 4, prepTime: '15 min', cookTime: '15 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'pork loin chops, pounded thin' },
      { quantity: '1', unit: 'cup', name: 'Italian breadcrumbs' },
      { quantity: '2', unit: '', name: 'eggs, beaten' },
      { quantity: '½', unit: 'cup', name: 'flour' },
      { quantity: '3', unit: 'tbsp', name: 'vegetable oil' },
      { quantity: '', unit: '', name: 'salt, pepper' },
    ],
    instructions: [
      'Season pork; dredge in flour, dip in egg, coat in breadcrumbs.',
      'Pan-fry in oil over medium-high 3–4 min per side until golden and cooked through.',
      'Drain on paper towels.',
      'Serve with lemon wedges and a side salad or mashed potatoes.',
    ],
  },

  54: { // BLT
    servings: 4, prepTime: '10 min', cookTime: '10 min',
    ingredients: [
      { quantity: '12', unit: 'slices', name: 'Bacon' },
      { quantity: '8', unit: 'slices', name: 'white or sourdough bread, toasted' },
      { quantity: '2', unit: '', name: 'tomatoes, sliced' },
      { quantity: '4', unit: 'leaves', name: 'romaine or iceberg lettuce' },
      { quantity: '4', unit: 'tbsp', name: 'mayonnaise' },
    ],
    instructions: [
      'Cook bacon until crispy; drain on paper towels.',
      'Toast bread.',
      'Spread mayo on both slices; layer lettuce, tomato, and bacon.',
      'Press together; cut diagonally.',
    ],
  },

  55: { // Smoked Pork Chops
    servings: 4, prepTime: '5 min', cookTime: '15 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'pre-smoked pork chops' },
      { quantity: '2', unit: 'tbsp', name: 'butter' },
      { quantity: '3', unit: 'cloves', name: 'garlic, smashed' },
      { quantity: '1', unit: 'tbsp', name: 'brown sugar' },
      { quantity: '', unit: '', name: 'salt, black pepper' },
    ],
    instructions: [
      'Pat chops dry; season lightly with salt and pepper.',
      'Melt butter in a skillet over medium-high; add garlic.',
      'Sear chops 3 min per side, basting with butter.',
      'Add brown sugar last minute; let caramelize. Serve with roasted vegetables.',
    ],
  },

  119: { // Baby Back Ribs
    servings: 4, prepTime: '15 min', cookTime: '180 min',
    ingredients: [
      { quantity: '2', unit: 'racks', name: 'baby back ribs' },
      { quantity: '2', unit: 'tbsp', name: 'brown sugar' },
      { quantity: '1', unit: 'tbsp', name: 'smoked paprika' },
      { quantity: '1', unit: 'tsp', name: 'garlic powder, onion powder, cumin' },
      { quantity: '1', unit: 'tsp', name: 'salt and black pepper' },
      { quantity: '1', unit: 'cup', name: 'BBQ sauce' },
    ],
    instructions: [
      'Remove membrane from back of ribs. Mix dry rub; coat ribs generously.',
      'Wrap racks in foil; bake at 275°F for 2.5 hours.',
      'Unwrap; brush with BBQ sauce. Grill or broil 5–10 min until caramelized.',
      'Rest 10 min; slice between bones.',
    ],
  },

  120: { // Pork Tenderloin
    servings: 4, prepTime: '10 min', cookTime: '25 min',
    ingredients: [
      { quantity: '2', unit: 'lbs', name: 'pork tenderloin' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '2', unit: 'tbsp', name: 'olive oil' },
      { quantity: '1', unit: 'tsp', name: 'dried rosemary and thyme' },
      { quantity: '', unit: '', name: 'salt and black pepper' },
    ],
    instructions: [
      'Preheat oven to 425°F. Rub tenderloin with olive oil, garlic, herbs, salt, and pepper.',
      'Sear in an oven-safe skillet over high heat, 2 min per side.',
      'Transfer to oven; roast 20–25 min until internal temp is 145°F.',
      'Tent with foil, rest 10 min before slicing.',
    ],
  },

  121: { // Pork Carnitas
    servings: 10, prepTime: '10 min', cookTime: '480 min',
    ingredients: [
      { quantity: '4', unit: 'lbs', name: 'pork shoulder, cut into large chunks' },
      { quantity: '1', unit: '', name: 'orange, juiced' },
      { quantity: '1', unit: '', name: 'lime, juiced' },
      { quantity: '1', unit: 'tsp', name: 'cumin, chili powder, garlic powder, oregano' },
      { quantity: '1', unit: 'tsp', name: 'salt' },
      { quantity: '16', unit: '', name: 'corn tortillas for serving' },
    ],
    instructions: [
      'Season pork with cumin, chili powder, garlic powder, oregano, and salt.',
      'Add to slow cooker with orange and lime juice; cook Low 8 hours.',
      'Shred pork; spread on a sheet pan, pour some cooking liquid over.',
      'Broil 5–7 min until edges are crispy. Serve in tortillas.',
    ],
  },

  122: { // Ham and Bean Soup
    servings: 8, prepTime: '10 min', cookTime: '60 min',
    ingredients: [
      { quantity: '2', unit: 'cups', name: 'diced ham (or 1 ham hock)' },
      { quantity: '2', unit: 'cans', name: 'Great Northern or navy beans, drained' },
      { quantity: '6', unit: 'cups', name: 'chicken broth' },
      { quantity: '3', unit: 'stalks', name: 'celery, sliced' },
      { quantity: '2', unit: '', name: 'carrots, sliced' },
      { quantity: '1', unit: '', name: 'onion, diced' },
    ],
    instructions: [
      'Sauté onion, celery, and carrots in a large pot until softened.',
      'Add ham, beans, and broth; bring to boil.',
      'Reduce heat; simmer 45 min. Lightly mash some beans to thicken.',
      'Season with salt and pepper.',
    ],
  },

  123: { // Pork Fried Rice
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'pork (leftover or cooked tenderloin/shoulder), diced' },
      { quantity: '3', unit: 'cups', name: 'cooked white rice (day-old preferred)' },
      { quantity: '1', unit: 'cup', name: 'frozen peas and carrots' },
      { quantity: '3', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '2', unit: '', name: 'eggs, beaten' },
      { quantity: '2', unit: 'tbsp', name: 'sesame oil' },
    ],
    instructions: [
      'Heat oil in a large skillet or wok over high. Add pork; cook 2 min.',
      'Push to side; scramble eggs.',
      'Add rice and frozen vegetables; stir-fry 3–4 min.',
      'Add soy sauce and sesame oil; toss to combine.',
    ],
  },

  124: { // Sausage and Peppers
    servings: 6, prepTime: '10 min', cookTime: '25 min',
    ingredients: [
      { quantity: '6', unit: 'links', name: 'Italian sausage (sweet or hot)' },
      { quantity: '3', unit: '', name: 'bell peppers, sliced' },
      { quantity: '1', unit: '', name: 'large onion, sliced' },
      { quantity: '1', unit: 'jar', name: 'marinara sauce (optional for sub version)' },
      { quantity: '6', unit: '', name: 'hoagie rolls or pasta for serving' },
    ],
    instructions: [
      'Brown sausage in a large skillet; slice into rounds or keep whole. Remove.',
      'Cook peppers and onion in same pan until softened and slightly charred.',
      'Return sausage; add marinara if making subs, or skip for a simple skillet.',
      'Serve in hoagie rolls or over pasta.',
    ],
  },

  125: { // Kielbasa and Cabbage
    servings: 6, prepTime: '10 min', cookTime: '25 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'kielbasa, sliced into rounds' },
      { quantity: '½', unit: '', name: 'head of cabbage, chopped' },
      { quantity: '1', unit: '', name: 'onion, sliced' },
      { quantity: '2', unit: 'tbsp', name: 'butter' },
      { quantity: '1', unit: 'tbsp', name: 'apple cider vinegar' },
      { quantity: '', unit: '', name: 'salt, pepper, caraway seeds (optional)' },
    ],
    instructions: [
      'Brown kielbasa in butter in a large skillet; remove.',
      'Add onion; cook until softened. Add cabbage; cook 10 min until wilted.',
      'Return kielbasa; stir in vinegar and caraway seeds.',
      'Season with salt and pepper; cook 5 more min.',
    ],
  },

  126: { // Ham and Cheese Sliders
    servings: 12, prepTime: '15 min', cookTime: '20 min',
    ingredients: [
      { quantity: '12', unit: '', name: 'Hawaiian rolls' },
      { quantity: '12', unit: 'slices', name: 'deli ham' },
      { quantity: '12', unit: 'slices', name: 'Swiss Cheese' },
      { quantity: '4', unit: 'tbsp', name: 'butter, melted' },
      { quantity: '1', unit: 'tbsp', name: 'Dijon mustard and honey' },
      { quantity: '1', unit: 'tsp', name: 'Worcestershire sauce and poppy seeds' },
    ],
    instructions: [
      'Preheat oven to 350°F. Slice rolls in half horizontally keeping them connected.',
      'Layer ham and cheese on bottom half; replace top.',
      'Mix butter, Dijon, honey, Worcestershire, and poppy seeds; brush over rolls.',
      'Cover with foil; bake 15 min. Uncover last 5 min until tops are golden.',
    ],
  },

  127: { // Sausage and Potato Skillet
    servings: 4, prepTime: '10 min', cookTime: '25 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'smoked sausage or kielbasa, sliced' },
      { quantity: '4', unit: '', name: 'potatoes, diced small' },
      { quantity: '1', unit: '', name: 'bell pepper, diced' },
      { quantity: '1', unit: '', name: 'onion, diced' },
      { quantity: '2', unit: 'tbsp', name: 'olive oil' },
      { quantity: '', unit: '', name: 'garlic powder, paprika, salt, pepper' },
    ],
    instructions: [
      'Cook potatoes in oil in a large skillet over medium-high until browned, about 10 min.',
      'Add bell pepper and onion; cook 5 min.',
      'Add sausage; cook until browned through, about 8 min.',
      'Season with garlic powder, paprika, salt, and pepper.',
    ],
  },

  128: { // Pork Al Pastor
    servings: 8, prepTime: '20 min', cookTime: '360 min',
    ingredients: [
      { quantity: '3', unit: 'lbs', name: 'pork shoulder, sliced thin or cubed' },
      { quantity: '3', unit: '', name: 'dried guajillo chiles, soaked and blended' },
      { quantity: '1', unit: 'can', name: 'pineapple chunks with juice' },
      { quantity: '3', unit: 'cloves', name: 'garlic' },
      { quantity: '1', unit: 'tsp', name: 'cumin, oregano, achiote paste (if available)' },
      { quantity: '16', unit: '', name: 'corn tortillas' },
    ],
    instructions: [
      'Blend chiles, garlic, pineapple juice, cumin, oregano, and achiote into a marinade.',
      'Marinate pork overnight (or at least 2 hours).',
      'Cook in slow cooker Low 6 hours OR sear on a hot grill/skillet until charred.',
      'Serve in tortillas with pineapple chunks, cilantro, and diced onion.',
    ],
  },

  129: { // Pork and Sauerkraut
    servings: 6, prepTime: '5 min', cookTime: '480 min',
    ingredients: [
      { quantity: '3', unit: 'lbs', name: 'pork loin or shoulder' },
      { quantity: '1', unit: 'bag', name: 'sauerkraut (32 oz), undrained' },
      { quantity: '2', unit: '', name: 'apples, peeled and sliced' },
      { quantity: '2', unit: 'tbsp', name: 'brown sugar' },
      { quantity: '1', unit: 'tsp', name: 'caraway seeds (optional)' },
    ],
    instructions: [
      'Place pork in slow cooker.',
      'Pour sauerkraut over; add apples, brown sugar, and caraway seeds.',
      'Cook on Low 8 hours until pork is very tender.',
      'Serve with mashed potatoes or dumplings.',
    ],
  },

  130: { // Pork Chop Casserole
    servings: 4, prepTime: '10 min', cookTime: '60 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'bone-in pork chops' },
      { quantity: '4', unit: '', name: 'potatoes, sliced thin' },
      { quantity: '1', unit: 'can', name: 'cream of mushroom soup' },
      { quantity: '½', unit: 'cup', name: 'chicken broth or milk' },
      { quantity: '1', unit: '', name: 'onion, sliced' },
      { quantity: '', unit: '', name: 'salt, pepper, garlic powder' },
    ],
    instructions: [
      'Preheat oven to 350°F. Layer potatoes and onion in a greased baking dish; season.',
      'Whisk cream of mushroom and broth; pour half over potatoes.',
      'Nestle pork chops on top; pour remaining sauce over.',
      'Cover with foil; bake 50–60 min until pork is cooked through and potatoes are tender.',
    ],
  },

  131: { // Bacon and Egg Fried Rice
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '6', unit: 'slices', name: 'bacon, chopped' },
      { quantity: '3', unit: 'cups', name: 'cooked white rice (day-old preferred)' },
      { quantity: '4', unit: '', name: 'eggs, beaten' },
      { quantity: '1', unit: 'cup', name: 'frozen peas' },
      { quantity: '3', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '3', unit: '', name: 'green onions, sliced' },
    ],
    instructions: [
      'Cook bacon in a large skillet until crispy; remove, leave 2 tbsp drippings.',
      'Scramble eggs in drippings; push to sides.',
      'Add rice and peas; stir-fry 3–4 min.',
      'Add soy sauce and bacon; toss. Garnish with green onions.',
    ],
  },

  132: { // Sausage Gravy Bake
    servings: 6, prepTime: '15 min', cookTime: '35 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'breakfast sausage' },
      { quantity: '3', unit: 'tbsp', name: 'all-purpose flour' },
      { quantity: '2.5', unit: 'cups', name: 'Milk' },
      { quantity: '1', unit: 'can', name: 'refrigerated biscuit dough (8 count)' },
      { quantity: '', unit: '', name: 'salt, black pepper' },
    ],
    instructions: [
      'Preheat oven to 375°F. Brown sausage in an oven-safe skillet; do not drain.',
      'Sprinkle flour over sausage; stir 1 min. Gradually whisk in milk; simmer until thickened.',
      'Season with salt and plenty of black pepper.',
      'Place biscuits on top of gravy; bake 20–25 min until biscuits are golden.',
    ],
  },

  133: { // Pork Schnitzel
    servings: 4, prepTime: '20 min', cookTime: '15 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'pork loin chops, pounded to ¼-inch thick' },
      { quantity: '1', unit: 'cup', name: 'fine breadcrumbs' },
      { quantity: '2', unit: '', name: 'eggs, beaten' },
      { quantity: '½', unit: 'cup', name: 'flour' },
      { quantity: '4', unit: 'tbsp', name: 'neutral oil (plus butter)' },
      { quantity: '1', unit: '', name: 'lemon, cut into wedges' },
    ],
    instructions: [
      'Season pork; dredge in flour, dip in egg, press firmly into breadcrumbs.',
      'Heat oil and a tablespoon of butter in a large skillet over medium-high.',
      'Fry schnitzels 2–3 min per side until deep golden and cooked through.',
      'Drain on paper towels; serve immediately with lemon wedges and a green salad.',
    ],
  },

  // ── SEAFOOD ────────────────────────────────────────────────────────────────

  58: { // Fish Sandwiches
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'cod or tilapia fillets' },
      { quantity: '1', unit: 'cup', name: 'seasoned breadcrumbs or panko' },
      { quantity: '2', unit: '', name: 'eggs, beaten' },
      { quantity: '4', unit: '', name: 'sandwich buns' },
      { quantity: '4', unit: 'tbsp', name: 'tartar sauce' },
      { quantity: '', unit: '', name: 'lettuce, tomato' },
    ],
    instructions: [
      'Dip fish in egg then breadcrumbs; pan-fry in oil over medium-high 3–4 min per side.',
      'Or bake at 400°F 15 min, flipping once.',
      'Toast buns; spread tartar sauce.',
      'Layer fish with lettuce and tomato.',
    ],
  },

  59: { // Fish Dinner
    servings: 4, prepTime: '5 min', cookTime: '15 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'white fish fillets (cod, tilapia, or mahi)' },
      { quantity: '3', unit: 'tbsp', name: 'butter, melted' },
      { quantity: '2', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '1', unit: '', name: 'lemon, juiced and sliced' },
      { quantity: '', unit: '', name: 'salt, pepper, paprika, fresh parsley' },
    ],
    instructions: [
      'Preheat oven to 400°F.',
      'Place fish in a baking dish; season with salt, pepper, and paprika.',
      'Mix butter and garlic; drizzle over fish. Lay lemon slices on top.',
      'Bake 12–15 min until fish flakes easily. Garnish with parsley.',
    ],
  },

  134: { // Shrimp Tacos
    servings: 4, prepTime: '15 min', cookTime: '10 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'shrimp, peeled and deveined' },
      { quantity: '1', unit: 'tsp', name: 'chili powder, cumin, garlic powder' },
      { quantity: '8', unit: '', name: 'corn tortillas' },
      { quantity: '1', unit: 'cup', name: 'coleslaw mix' },
      { quantity: '¼', unit: 'cup', name: 'sour cream + 1 tsp lime juice (lime crema)' },
      { quantity: '1', unit: '', name: 'avocado, sliced' },
    ],
    instructions: [
      'Season shrimp with chili powder, cumin, garlic powder, salt.',
      'Cook in a hot skillet with a little oil 2–3 min per side.',
      'Warm tortillas; layer with coleslaw, shrimp, and avocado.',
      'Drizzle with lime crema.',
    ],
  },

  135: { // Shrimp Fried Rice
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'shrimp, peeled and deveined' },
      { quantity: '3', unit: 'cups', name: 'cooked white rice (day-old preferred)' },
      { quantity: '1', unit: 'cup', name: 'frozen peas and carrots' },
      { quantity: '3', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '2', unit: '', name: 'eggs, beaten' },
      { quantity: '2', unit: 'tbsp', name: 'sesame oil' },
    ],
    instructions: [
      'Cook shrimp in a hot wok or skillet 2 min per side; remove.',
      'Scramble eggs in same pan; push aside.',
      'Add rice and vegetables; stir-fry 3–4 min.',
      'Add soy sauce, sesame oil, and shrimp; toss together.',
    ],
  },

  136: { // Shrimp Scampi
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'large shrimp, peeled and deveined' },
      { quantity: '12', unit: 'oz', name: 'linguine or spaghetti' },
      { quantity: '5', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '½', unit: 'cup', name: 'dry white wine or chicken broth' },
      { quantity: '4', unit: 'tbsp', name: 'butter' },
      { quantity: '3', unit: 'tbsp', name: 'Lemon Juice' },
      { quantity: '¼', unit: 'cup', name: 'fresh parsley, chopped' },
    ],
    instructions: [
      'Cook pasta; reserve ½ cup pasta water, drain.',
      'Sauté garlic in butter 1 min; add shrimp, cook 2 min per side, remove.',
      'Add wine; reduce 2 min. Add lemon juice and pasta water.',
      'Toss with pasta; return shrimp. Garnish with parsley and parmesan.',
    ],
  },

  137: { // Salmon Dinner
    servings: 4, prepTime: '5 min', cookTime: '15 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'salmon fillets (6 oz each)' },
      { quantity: '3', unit: 'tbsp', name: 'butter' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '1', unit: '', name: 'lemon, juiced and sliced' },
      { quantity: '', unit: '', name: 'salt, pepper, dill or parsley' },
    ],
    instructions: [
      'Season salmon with salt, pepper, and dill.',
      'Pan-sear skin-side up in butter over medium-high 4 min.',
      'Flip; add garlic, baste with butter, cook 3–4 more min.',
      'Squeeze lemon over; serve with roasted vegetables or rice.',
    ],
  },

  138: { // Tuna Noodle Casserole
    servings: 6, prepTime: '15 min', cookTime: '30 min',
    ingredients: [
      { quantity: '2', unit: 'cans', name: 'tuna in water, drained (5 oz each)' },
      { quantity: '12', unit: 'oz', name: 'egg noodles, cooked' },
      { quantity: '1', unit: 'can', name: 'cream of mushroom soup' },
      { quantity: '1', unit: 'cup', name: 'frozen peas' },
      { quantity: '1', unit: 'cup', name: 'Milk' },
      { quantity: '1', unit: 'cup', name: 'Cheddar Cheese' },
      { quantity: '½', unit: 'cup', name: 'breadcrumbs' },
    ],
    instructions: [
      'Preheat oven to 375°F. Mix soup and milk; stir in tuna, noodles, peas, and half the cheese.',
      'Transfer to greased baking dish; top with remaining cheese and breadcrumbs.',
      'Bake 25–30 min until bubbly and topping is golden.',
    ],
  },

  139: { // Fish and Chips
    servings: 4, prepTime: '15 min', cookTime: '25 min',
    ingredients: [
      { quantity: '1.5', unit: 'lbs', name: 'cod fillets' },
      { quantity: '1', unit: 'cup', name: 'all-purpose flour' },
      { quantity: '1', unit: 'cup', name: 'cold beer or sparkling water' },
      { quantity: '1', unit: 'tsp', name: 'baking powder' },
      { quantity: '1', unit: 'bag', name: 'frozen french fries (or 4 potatoes, oven-roasted)' },
      { quantity: '', unit: '', name: 'salt, malt vinegar, tartar sauce' },
    ],
    instructions: [
      'Cook fries per package or roast potatoes at 425°F until crispy.',
      'Whisk flour, baking powder, and beer into a batter; season with salt.',
      'Dip fish in batter; fry in 375°F oil 4–5 min until golden and cooked through.',
      'Drain on paper towels; serve with fries, malt vinegar, and tartar sauce.',
    ],
  },

  140: { // Clam Chowder
    servings: 6, prepTime: '15 min', cookTime: '30 min',
    ingredients: [
      { quantity: '3', unit: 'cans', name: 'minced clams with juice (6.5 oz each)' },
      { quantity: '3', unit: '', name: 'potatoes, diced' },
      { quantity: '4', unit: 'slices', name: 'bacon, chopped' },
      { quantity: '1', unit: '', name: 'onion, diced' },
      { quantity: '2', unit: 'cups', name: 'heavy cream' },
      { quantity: '2', unit: 'tbsp', name: 'flour' },
    ],
    instructions: [
      'Cook bacon in a pot; remove, leave drippings. Sauté onion until soft.',
      'Whisk flour into onion; gradually add clam juice and cream.',
      'Add potatoes; simmer 15 min until tender.',
      'Stir in clams and bacon; heat through. Season generously. Serve in bread bowls.',
    ],
  },

  141: { // Crab Cakes
    servings: 4, prepTime: '20 min', cookTime: '10 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'lump crab meat' },
      { quantity: '¼', unit: 'cup', name: 'breadcrumbs' },
      { quantity: '1', unit: '', name: 'egg' },
      { quantity: '2', unit: 'tbsp', name: 'mayonnaise' },
      { quantity: '1', unit: 'tsp', name: 'Old Bay seasoning, Dijon mustard, Worcestershire' },
      { quantity: '', unit: '', name: 'tartar sauce and lemon for serving' },
    ],
    instructions: [
      'Gently mix crab, breadcrumbs, egg, mayo, and seasonings; do not over-mix.',
      'Form 8 patties; refrigerate 30 min to firm up.',
      'Pan-fry in butter over medium-high 3–4 min per side until golden.',
      'Serve with tartar sauce and lemon.',
    ],
  },

  157: { // Lobster Rolls
    servings: 4, prepTime: '15 min', cookTime: '10 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'cooked lobster meat, roughly chopped' },
      { quantity: '3', unit: 'tbsp', name: 'mayonnaise' },
      { quantity: '1', unit: 'stalk', name: 'celery, minced' },
      { quantity: '1', unit: 'tbsp', name: 'Lemon Juice' },
      { quantity: '4', unit: '', name: 'top-split hot dog buns' },
      { quantity: '2', unit: 'tbsp', name: 'butter (for toasting buns)' },
    ],
    instructions: [
      'Mix lobster with mayo, celery, lemon juice, salt, and pepper.',
      'Butter outsides of buns; toast in a skillet until golden.',
      'Fill buns generously with lobster salad.',
      'Serve immediately with chips.',
    ],
  },

  // ── VEGETARIAN ────────────────────────────────────────────────────────────

  144: { // Veggie Stir Fry
    servings: 4, prepTime: '15 min', cookTime: '15 min',
    ingredients: [
      { quantity: '5', unit: 'cups', name: 'mixed vegetables (broccoli, snap peas, bell peppers, mushrooms, carrots)' },
      { quantity: '1', unit: 'block', name: 'firm tofu, cubed and pressed (optional)' },
      { quantity: '3', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '2', unit: 'tbsp', name: 'hoisin sauce' },
      { quantity: '1', unit: 'tbsp', name: 'sesame oil' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '3', unit: 'cups', name: 'cooked rice' },
    ],
    instructions: [
      'Stir together soy sauce, hoisin, and sesame oil.',
      'If using tofu, crisp in a hot skillet first; remove.',
      'Stir-fry vegetables and garlic in high heat 4–5 min until crisp-tender.',
      'Return tofu if using; pour sauce over, toss 1 min. Serve over rice.',
    ],
  },

  145: { // Pasta Primavera
    servings: 4, prepTime: '15 min', cookTime: '20 min',
    ingredients: [
      { quantity: '12', unit: 'oz', name: 'pasta (penne or rigatoni)' },
      { quantity: '4', unit: 'cups', name: 'mixed vegetables (zucchini, bell pepper, cherry tomatoes, asparagus)' },
      { quantity: '4', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '¼', unit: 'cup', name: 'olive oil' },
      { quantity: '½', unit: 'cup', name: 'grated parmesan' },
      { quantity: '¼', unit: 'cup', name: 'fresh basil' },
    ],
    instructions: [
      'Cook pasta; reserve ½ cup pasta water, drain.',
      'Sauté garlic in olive oil; add vegetables, cook 6–8 min until tender.',
      'Toss with pasta, adding pasta water to loosen.',
      'Finish with parmesan and fresh basil.',
    ],
  },

  146: { // Black Bean Tacos
    servings: 4, prepTime: '10 min', cookTime: '10 min',
    ingredients: [
      { quantity: '2', unit: 'cans', name: 'black beans, drained' },
      { quantity: '1', unit: 'tsp', name: 'cumin, chili powder, garlic powder' },
      { quantity: '8', unit: '', name: 'corn tortillas, warmed' },
      { quantity: '1', unit: '', name: 'avocado, sliced' },
      { quantity: '1', unit: 'cup', name: 'salsa or pico de gallo' },
      { quantity: '½', unit: 'cup', name: 'shredded cheese or cotija' },
    ],
    instructions: [
      'Warm beans in a skillet with cumin, chili powder, garlic powder, and a splash of water; mash slightly.',
      'Warm tortillas.',
      'Fill tortillas with beans; top with avocado, salsa, and cheese.',
      'Finish with fresh cilantro and lime juice.',
    ],
  },

  147: { // Vegetable Curry
    servings: 6, prepTime: '15 min', cookTime: '25 min',
    ingredients: [
      { quantity: '4', unit: 'cups', name: 'mixed vegetables (chickpeas, potatoes, cauliflower, peas)' },
      { quantity: '1', unit: 'can', name: 'coconut milk (14 oz)' },
      { quantity: '1', unit: 'can', name: 'diced tomatoes' },
      { quantity: '2', unit: 'tbsp', name: 'red or yellow curry paste' },
      { quantity: '1', unit: '', name: 'onion, diced' },
      { quantity: '3', unit: 'cloves', name: 'Garlic' },
      { quantity: '1', unit: 'tsp', name: 'Fresh Ginger' },
      { quantity: '3', unit: 'cups', name: 'basmati rice for serving' },
    ],
    instructions: [
      'Sauté onion, garlic, and ginger in oil; stir in curry paste, cook 2 min.',
      'Add tomatoes and coconut milk; bring to a simmer.',
      'Add vegetables; cook 15–20 min until tender.',
      'Serve over basmati rice with naan.',
    ],
  },

  148: { // Eggplant Parmesan
    servings: 6, prepTime: '30 min', cookTime: '40 min',
    ingredients: [
      { quantity: '2', unit: '', name: 'large eggplants, sliced ½-inch rounds' },
      { quantity: '2', unit: 'cups', name: 'Italian breadcrumbs' },
      { quantity: '3', unit: '', name: 'eggs, beaten' },
      { quantity: '1', unit: 'jar', name: 'marinara sauce' },
      { quantity: '2', unit: 'cups', name: 'Mozzarella Cheese' },
      { quantity: '½', unit: 'cup', name: 'grated parmesan' },
    ],
    instructions: [
      'Salt eggplant slices; let sit 30 min, then pat dry. Dip in egg, coat in breadcrumbs.',
      'Pan-fry or bake at 400°F until golden on both sides.',
      'Layer in a baking dish: marinara, eggplant, mozzarella. Repeat; top with parmesan.',
      'Bake at 375°F for 25 min until bubbly.',
    ],
  },

  156: { // Stuffed Peppers (Vegetarian)
    servings: 6, prepTime: '20 min', cookTime: '40 min',
    ingredients: [
      { quantity: '6', unit: '', name: 'bell peppers, tops cut off and seeded' },
      { quantity: '1.5', unit: 'cups', name: 'cooked rice' },
      { quantity: '1', unit: 'can', name: 'black beans, drained' },
      { quantity: '1', unit: 'cup', name: 'corn (frozen or canned)' },
      { quantity: '1', unit: 'cup', name: 'salsa or diced tomatoes' },
      { quantity: '1.5', unit: 'cups', name: 'shredded Mexican cheese' },
    ],
    instructions: [
      'Preheat oven to 375°F.',
      'Mix rice, beans, corn, salsa, and 1 cup cheese.',
      'Stand peppers upright in a baking dish; fill with mixture; top with remaining cheese.',
      'Add ¼ cup water to dish; cover with foil, bake 30 min. Uncover last 10 min.',
    ],
  },

  161: { // Spaghetti Squash Marinara
    servings: 4, prepTime: '10 min', cookTime: '45 min',
    ingredients: [
      { quantity: '1', unit: '', name: 'large spaghetti squash' },
      { quantity: '1', unit: 'jar', name: 'marinara sauce' },
      { quantity: '½', unit: 'cup', name: 'grated parmesan' },
      { quantity: '2', unit: 'tbsp', name: 'olive oil' },
      { quantity: '', unit: '', name: 'salt, pepper, fresh basil' },
    ],
    instructions: [
      'Halve squash; scoop seeds, drizzle with olive oil, season, place cut-side down on a baking sheet.',
      'Roast at 400°F for 40 min until tender.',
      'Scrape flesh with a fork to form "spaghetti" strands.',
      'Top with warmed marinara and parmesan.',
    ],
  },

  165: { // Cauliflower Fried Rice
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1', unit: 'head', name: 'cauliflower, grated or processed into "rice"' },
      { quantity: '1', unit: 'cup', name: 'frozen peas and carrots' },
      { quantity: '3', unit: '', name: 'eggs, beaten' },
      { quantity: '3', unit: 'tbsp', name: 'soy sauce' },
      { quantity: '2', unit: 'tbsp', name: 'sesame oil' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
    ],
    instructions: [
      'Sauté garlic in sesame oil over medium-high.',
      'Add cauliflower rice; cook 5 min until softened and lightly browned.',
      'Push to sides; scramble eggs in center.',
      'Add peas and carrots; stir in soy sauce. Toss everything together.',
    ],
  },

  // ── OTHER ──────────────────────────────────────────────────────────────────

  60: { // Pancakes
    servings: 4, prepTime: '5 min', cookTime: '15 min',
    ingredients: [
      { quantity: '1.5', unit: 'cups', name: 'all-purpose flour' },
      { quantity: '1', unit: 'tbsp', name: 'sugar' },
      { quantity: '1', unit: 'tbsp', name: 'baking powder' },
      { quantity: '1', unit: 'cup', name: 'Milk' },
      { quantity: '1', unit: '', name: 'egg' },
      { quantity: '2', unit: 'tbsp', name: 'melted butter' },
      { quantity: '', unit: '', name: 'maple syrup for serving' },
    ],
    instructions: [
      'Whisk dry ingredients together in a bowl.',
      'Add milk, egg, and melted butter; stir until just combined (lumps are okay).',
      'Pour ¼ cup batter onto a greased griddle over medium heat; cook until bubbles form, then flip.',
      'Serve with butter and maple syrup.',
    ],
  },

  61: { // Biscuits and Gravy
    servings: 6, prepTime: '10 min', cookTime: '20 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'breakfast pork sausage' },
      { quantity: '3', unit: 'tbsp', name: 'all-purpose flour' },
      { quantity: '2.5', unit: 'cups', name: 'Milk' },
      { quantity: '1', unit: 'can', name: 'refrigerated biscuits (8 count) or homemade' },
      { quantity: '', unit: '', name: 'salt and plenty of black pepper' },
    ],
    instructions: [
      'Bake or cook biscuits per package directions.',
      'Brown sausage in a skillet; do not drain.',
      'Sprinkle flour over sausage; stir 1 min. Gradually whisk in milk.',
      'Simmer, stirring, until thick. Season with salt and lots of pepper. Spoon over split biscuits.',
    ],
  },

  62: { // French Toast
    servings: 4, prepTime: '5 min', cookTime: '15 min',
    ingredients: [
      { quantity: '8', unit: 'slices', name: 'thick bread (Texas toast or brioche)' },
      { quantity: '3', unit: '', name: 'eggs' },
      { quantity: '½', unit: 'cup', name: 'Milk' },
      { quantity: '1', unit: 'tsp', name: 'vanilla extract' },
      { quantity: '½', unit: 'tsp', name: 'cinnamon' },
      { quantity: '2', unit: 'tbsp', name: 'butter' },
    ],
    instructions: [
      'Whisk eggs, milk, vanilla, and cinnamon in a shallow bowl.',
      'Dip bread slices in egg mixture, coating both sides.',
      'Cook in buttered skillet or griddle over medium 2–3 min per side until golden.',
      'Serve with maple syrup and powdered sugar.',
    ],
  },

  63: { // Eggs and Ham
    servings: 4, prepTime: '5 min', cookTime: '10 min',
    ingredients: [
      { quantity: '8', unit: '', name: 'eggs' },
      { quantity: '4', unit: 'slices', name: 'ham steak or 8 slices deli ham' },
      { quantity: '2', unit: 'tbsp', name: 'butter' },
      { quantity: '', unit: '', name: 'salt, pepper, toast for serving' },
    ],
    instructions: [
      'Warm ham slices in a skillet over medium; set aside.',
      'Melt butter in same skillet; crack eggs in.',
      'Cook sunny-side up, over-easy, or scrambled to preference.',
      'Serve eggs alongside ham with buttered toast.',
    ],
  },

  67: { // Turkey Dinner
    servings: 10, prepTime: '30 min', cookTime: '200 min',
    ingredients: [
      { quantity: '1', unit: '', name: 'whole turkey (12–14 lbs)' },
      { quantity: '1', unit: 'stick', name: 'butter, softened' },
      { quantity: '4', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '1', unit: 'tbsp', name: 'fresh thyme, rosemary, and sage' },
      { quantity: '', unit: '', name: 'salt and black pepper' },
      { quantity: '', unit: '', name: 'pan drippings for gravy' },
    ],
    instructions: [
      'Preheat oven to 325°F. Pat turkey dry; mix butter with garlic and herbs.',
      'Rub butter under and over skin; season generously with salt and pepper.',
      'Roast breast-side up, about 15 min per pound, until thigh reaches 165°F.',
      'Rest 30 min before carving. Use pan drippings for gravy.',
    ],
  },

  68: { // Ham Dinner
    servings: 10, prepTime: '10 min', cookTime: '150 min',
    ingredients: [
      { quantity: '1', unit: '', name: 'bone-in spiral ham (8–10 lbs)' },
      { quantity: '½', unit: 'cup', name: 'brown sugar' },
      { quantity: '¼', unit: 'cup', name: 'honey' },
      { quantity: '2', unit: 'tbsp', name: 'Dijon mustard' },
      { quantity: '¼', unit: 'tsp', name: 'cinnamon and cloves' },
    ],
    instructions: [
      'Preheat oven to 325°F. Place ham cut-side down in a roasting pan; cover with foil.',
      'Bake 15 min per pound.',
      'Mix brown sugar, honey, Dijon, and spices into a glaze.',
      'Brush glaze over ham every 20 min during last hour; uncover for final 20 min.',
    ],
  },

  142: { // Mac and Cheese
    servings: 6, prepTime: '10 min', cookTime: '20 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'elbow macaroni' },
      { quantity: '3', unit: 'cups', name: 'Cheddar Cheese' },
      { quantity: '2', unit: 'cups', name: 'Milk' },
      { quantity: '3', unit: 'tbsp', name: 'butter' },
      { quantity: '3', unit: 'tbsp', name: 'all-purpose flour' },
      { quantity: '½', unit: 'tsp', name: 'mustard powder, garlic powder, salt' },
    ],
    instructions: [
      'Cook macaroni; drain.',
      'Melt butter in pot; whisk in flour, cook 1 min. Gradually whisk in milk; simmer until thickened.',
      'Remove from heat; stir in cheddar until smooth. Add seasonings.',
      'Fold in macaroni. Serve as-is or pour into a baking dish and broil with breadcrumb topping.',
    ],
  },

  143: { // Grilled Cheese and Tomato Soup
    servings: 4, prepTime: '5 min', cookTime: '15 min',
    ingredients: [
      { quantity: '8', unit: 'slices', name: 'white or sourdough bread' },
      { quantity: '4', unit: 'tbsp', name: 'butter, softened' },
      { quantity: '8', unit: 'slices', name: 'American cheese (or cheddar)' },
      { quantity: '2', unit: 'cans', name: 'tomato soup (10 oz each)' },
      { quantity: '1', unit: 'cup', name: 'milk or cream (for soup)' },
    ],
    instructions: [
      'Heat tomato soup with milk per can directions; keep warm.',
      'Butter one side of each bread slice.',
      'Build sandwiches butter-side out with 2 slices cheese each.',
      'Grill in a skillet over medium, pressing lightly, 2–3 min per side until golden. Serve with soup for dipping.',
    ],
  },

  149: { // Waffles
    servings: 4, prepTime: '10 min', cookTime: '20 min',
    ingredients: [
      { quantity: '2', unit: 'cups', name: 'all-purpose flour' },
      { quantity: '2', unit: 'tsp', name: 'baking powder' },
      { quantity: '1', unit: 'tbsp', name: 'sugar' },
      { quantity: '1.5', unit: 'cups', name: 'Milk' },
      { quantity: '2', unit: '', name: 'eggs, separated' },
      { quantity: '½', unit: 'cup', name: 'melted butter' },
    ],
    instructions: [
      'Whisk dry ingredients. Mix milk, egg yolks, and butter; combine with dry.',
      'Beat egg whites to stiff peaks; fold into batter.',
      'Pour batter into preheated, greased waffle iron; cook until golden and crisp.',
      'Serve with maple syrup, butter, and fresh berries.',
    ],
  },

  150: { // Breakfast Burritos
    servings: 4, prepTime: '10 min', cookTime: '15 min',
    ingredients: [
      { quantity: '8', unit: '', name: 'eggs' },
      { quantity: '½', unit: 'lb', name: 'breakfast sausage or bacon, cooked and crumbled' },
      { quantity: '1', unit: 'cup', name: 'Cheddar Cheese' },
      { quantity: '4', unit: '', name: 'Flour Tortillas' },
      { quantity: '¼', unit: 'cup', name: 'salsa' },
      { quantity: '', unit: '', name: 'salt, pepper, hot sauce' },
    ],
    instructions: [
      'Scramble eggs in a buttered skillet; season with salt and pepper.',
      'Warm tortillas.',
      'Layer eggs, sausage, cheese, and salsa on each tortilla.',
      'Fold in sides; roll up tightly.',
    ],
  },

  151: { // Omelets
    servings: 1, prepTime: '5 min', cookTime: '5 min',
    ingredients: [
      { quantity: '3', unit: '', name: 'eggs' },
      { quantity: '1', unit: 'tbsp', name: 'butter' },
      { quantity: '¼', unit: 'cup', name: 'Cheddar Cheese' },
      { quantity: '¼', unit: 'cup', name: 'fillings: diced ham, mushrooms, onion, bell pepper' },
      { quantity: '', unit: '', name: 'salt and pepper' },
    ],
    instructions: [
      'Whisk eggs with salt and pepper.',
      'Melt butter in an 8-inch skillet over medium-high; pour in eggs.',
      'As edges set, lift and tilt pan to let runny egg flow underneath.',
      'When almost set, add fillings and cheese to one half; fold over. Slide onto plate.',
    ],
  },

  152: { // Quiche
    servings: 8, prepTime: '20 min', cookTime: '45 min',
    ingredients: [
      { quantity: '1', unit: '', name: 'pie crust (store-bought, 9-inch)' },
      { quantity: '4', unit: '', name: 'eggs' },
      { quantity: '1.5', unit: 'cups', name: 'heavy cream or half-and-half' },
      { quantity: '1', unit: 'cup', name: 'shredded Swiss or cheddar' },
      { quantity: '½', unit: 'cup', name: 'cooked bacon or ham, diced' },
      { quantity: '1', unit: 'cup', name: 'fresh spinach or diced veggies (optional)' },
    ],
    instructions: [
      'Preheat oven to 375°F. Blind-bake crust 10 min.',
      'Whisk eggs with cream, salt, and pepper.',
      'Layer cheese, bacon, and vegetables in crust; pour egg mixture over.',
      'Bake 35–40 min until set and lightly golden. Rest 10 min before slicing.',
    ],
  },

  153: { // Nachos
    servings: 6, prepTime: '10 min', cookTime: '10 min',
    ingredients: [
      { quantity: '1', unit: 'bag', name: 'tortilla chips' },
      { quantity: '2', unit: 'cups', name: 'shredded Mexican cheese blend' },
      { quantity: '1', unit: 'can', name: 'black beans, drained (optional)' },
      { quantity: '1', unit: 'can', name: 'Jalapeños' },
      { quantity: '', unit: '', name: 'sour cream, salsa, guacamole for topping' },
    ],
    instructions: [
      'Preheat oven to 375°F.',
      'Spread chips in a single layer on a large baking sheet.',
      'Top with beans, jalapeños, and cheese.',
      'Bake 8–10 min until cheese is melted. Top with sour cream, salsa, and guacamole.',
    ],
  },

  154: { // Street Corn Quesadillas
    servings: 4, prepTime: '15 min', cookTime: '15 min',
    ingredients: [
      { quantity: '2', unit: 'cups', name: 'corn (fresh, frozen, or grilled)' },
      { quantity: '¼', unit: 'cup', name: 'cotija cheese, crumbled' },
      { quantity: '2', unit: 'tbsp', name: 'chipotle mayo (mayo + chipotle in adobo)' },
      { quantity: '½', unit: 'tsp', name: 'chili powder and smoked paprika' },
      { quantity: '8', unit: '', name: 'Flour Tortillas' },
      { quantity: '1.5', unit: 'cups', name: 'shredded Monterey Jack' },
    ],
    instructions: [
      'Char corn in a skillet or under broiler; mix with cotija, chili powder, and paprika.',
      'Spread chipotle mayo on tortilla; top half with corn mixture and Monterey Jack.',
      'Fold; cook in a buttered skillet 2–3 min per side until golden.',
      'Slice; serve with lime wedges.',
    ],
  },

  155: { // Bean and Cheese Burritos
    servings: 4, prepTime: '5 min', cookTime: '10 min',
    ingredients: [
      { quantity: '1', unit: 'can', name: 'refried beans (16 oz)' },
      { quantity: '4', unit: '', name: 'Flour Tortillas' },
      { quantity: '1.5', unit: 'cups', name: 'Cheddar Cheese' },
      { quantity: '½', unit: 'cup', name: 'salsa' },
    ],
    instructions: [
      'Warm refried beans.',
      'Microwave or warm tortillas.',
      'Spread beans down the center; add cheese and a spoonful of salsa.',
      'Fold in sides; roll up. Serve with extra salsa and sour cream.',
    ],
  },

  158: { // Cobb Salad
    servings: 4, prepTime: '20 min', cookTime: '0 min',
    ingredients: [
      { quantity: '1', unit: 'head', name: 'romaine lettuce, chopped' },
      { quantity: '2', unit: 'cups', name: 'cooked chicken breast, diced' },
      { quantity: '4', unit: 'slices', name: 'bacon, cooked and crumbled' },
      { quantity: '2', unit: '', name: 'hard-boiled eggs, sliced' },
      { quantity: '1', unit: '', name: 'avocado, diced' },
      { quantity: '1', unit: 'cup', name: 'cherry tomatoes, halved' },
      { quantity: '½', unit: 'cup', name: 'blue cheese crumbles' },
    ],
    instructions: [
      'Arrange romaine in a large bowl or platter.',
      'Arrange chicken, bacon, eggs, avocado, tomatoes, and blue cheese in neat rows on top.',
      'Serve with blue cheese or ranch dressing on the side.',
    ],
  },

  160: { // Hotdogs and Fries
    servings: 4, prepTime: '5 min', cookTime: '20 min',
    ingredients: [
      { quantity: '8', unit: '', name: 'hot dogs' },
      { quantity: '8', unit: '', name: 'hot dog buns' },
      { quantity: '1', unit: 'bag', name: 'frozen french fries' },
      { quantity: '', unit: '', name: 'ketchup, mustard, relish, onion for topping' },
    ],
    instructions: [
      'Bake frozen fries per package directions.',
      'Grill, boil, or pan-fry hot dogs until heated through.',
      'Toast buns if desired.',
      'Serve with desired toppings and fries on the side.',
    ],
  },

  163: { // Meatball Subs
    servings: 4, prepTime: '15 min', cookTime: '25 min',
    ingredients: [
      { quantity: '20', unit: '', name: 'meatballs (frozen or homemade)' },
      { quantity: '1', unit: 'jar', name: 'marinara sauce' },
      { quantity: '4', unit: '', name: 'hoagie rolls' },
      { quantity: '4', unit: 'slices', name: 'provolone or mozzarella' },
      { quantity: '½', unit: 'cup', name: 'grated parmesan' },
    ],
    instructions: [
      'Simmer meatballs in marinara sauce 15–20 min until heated through.',
      'Split rolls; pile 4–5 meatballs with sauce into each.',
      'Top with provolone and parmesan.',
      'Broil 3 min until cheese is bubbly.',
    ],
  },

  164: { // Fettuccine Alfredo
    servings: 4, prepTime: '5 min', cookTime: '20 min',
    ingredients: [
      { quantity: '1', unit: 'lb', name: 'fettuccine' },
      { quantity: '1.5', unit: 'cups', name: 'heavy cream' },
      { quantity: '1', unit: 'cup', name: 'freshly grated parmesan' },
      { quantity: '4', unit: 'tbsp', name: 'butter' },
      { quantity: '3', unit: 'cloves', name: 'garlic, minced' },
      { quantity: '', unit: '', name: 'salt, white pepper, fresh parsley' },
    ],
    instructions: [
      'Cook fettuccine; reserve 1 cup pasta water, drain.',
      'Melt butter over medium; sauté garlic 1 min.',
      'Add cream; simmer 5 min until slightly thickened.',
      'Remove from heat; stir in parmesan. Toss with pasta, adding pasta water to adjust consistency.',
    ],
  },

  168: { // Loaded Baked Potatoes
    servings: 4, prepTime: '5 min', cookTime: '60 min',
    ingredients: [
      { quantity: '4', unit: '', name: 'large russet potatoes' },
      { quantity: '2', unit: 'tbsp', name: 'olive oil or butter' },
      { quantity: '8', unit: 'slices', name: 'bacon, cooked and crumbled' },
      { quantity: '1', unit: 'cup', name: 'Cheddar Cheese' },
      { quantity: '½', unit: 'cup', name: 'sour cream' },
      { quantity: '3', unit: '', name: 'green onions, sliced' },
    ],
    instructions: [
      'Scrub potatoes; rub with oil and salt. Pierce several times with a fork.',
      'Bake at 400°F for 55–60 min until tender.',
      'Cut open and fluff inside with a fork.',
      'Load with cheddar, sour cream, bacon, and green onions.',
    ],
  },

};
