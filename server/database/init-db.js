const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'recipes.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Создаем базу данных Munch...');

// Создаем таблицу рецептов
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT,
    cooking_time INTEGER,
    difficulty TEXT,
    instructions TEXT,
    ingredients TEXT,
    tags TEXT,
    category TEXT
  )`);

  // Очищаем старые данные
  db.run(`DELETE FROM recipes`);

  // Добавляем рецепты
  const insert = db.prepare(`INSERT INTO recipes 
    (name, image, cooking_time, difficulty, instructions, ingredients, tags, category) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

  const recipes = [
    {
      name: "Курица с рисом в томатно-сметанном соусе",
      image: "https://www.russianfood.com/dycontent/images_upl/321/sm_320689.jpg",
      cooking_time: 30,
      difficulty: "легко",
      instructions: JSON.stringify([
        "Нарезать курицу кубиками",
        "Обжарить курицу до золотистой корочки",
        "Добавить рис и обжарить 2 минуты", 
        "Залить водой, добавить помидоры и сметану",
        "Тушить 20 минут до готовности риса"
      ]),
      ingredients: JSON.stringify([
        { name: "курица", amount: "500г" },
        { name: "рис", amount: "200г" },
        { name: "помидоры", amount: "2 шт" },
        { name: "сметана", amount: "200г" },
        { name: "лук", amount: "1 шт" },
        { name: "соль", amount: "по вкусу" }
      ]),
      tags: JSON.stringify(["основное блюдо", "курица", "ужин"]),
      category: "основные блюда"
    },
    {
      name: "Омлет с овощами",
      image: "https://www.russianfood.com/dycontent/images_upl/353/sm_352326.jpg",
      cooking_time: 15,
      difficulty: "легко", 
      instructions: JSON.stringify([
        "Взбить яйца с солью",
        "Нарезать овощи мелкими кубиками",
        "Обжарить овощи 5 минут",
        "Залить яйцами и жарить под крышкой 10 минут"
      ]),
      ingredients: JSON.stringify([
        { name: "яйца", amount: "4 шт" },
        { name: "помидоры", amount: "1 шт" },
        { name: "болгарский перец", amount: "1 шт" },
        { name: "лук", amount: "0.5 шт" },
        { name: "соль", amount: "по вкусу" },
        { name: "масло растительное", amount: "2 ст.л." }
      ]),
      tags: JSON.stringify(["завтрак", "омлет", "быстро"]),
      category: "завтраки"
    },
    {
      name: "Салат Греческий",
      image: "https://www.russianfood.com/dycontent/images_upl/136/sm_135553.jpg",
      cooking_time: 10,
      difficulty: "легко",
      instructions: JSON.stringify([
        "Нарезать овощи крупными кусками",
        "Добавить маслины и сыр фета",
        "Заправить оливковым маслом и специями"
      ]),
      ingredients: JSON.stringify([
        { name: "помидоры", amount: "2 шт" },
        { name: "огурцы", amount: "1 шт" },
        { name: "болгарский перец", amount: "1 шт" },
        { name: "красный лук", amount: "0.5 шт" },
        { name: "сыр фета", amount: "100г" },
        { name: "маслины", amount: "50г" },
        { name: "оливковое масло", amount: "2 ст.л." }
      ]),
      tags: JSON.stringify(["салат", "легкий", "средиземноморский"]),
      category: "салаты"
    },
    {
      name: "Паста Карбонара",
      image: "https://www.russianfood.com/dycontent/images_upl/418/sm_417108.jpg",
      cooking_time: 20,
      difficulty: "средне",
      instructions: JSON.stringify([
        "Сварить пасту аль денте",
        "Обжарить бекон до хрустящей корочки",
        "Взбить яйца с сыром пармезан",
        "Смешать пасту с беконом и яичной смесью"
      ]),
      ingredients: JSON.stringify([
        { name: "спагетти", amount: "200г" },
        { name: "бекон", amount: "150г" },
        { name: "яйца", amount: "2 шт" },
        { name: "пармезан", amount: "50г" },
        { name: "чеснок", amount: "2 зубчика" },
        { name: "соль", amount: "по вкусу" }
      ]),
      tags: JSON.stringify(["паста", "итальянская", "ужин"]),
      category: "основные блюда"
    }
  ];

  recipes.forEach(recipe => {
    insert.run(
      recipe.name,
      recipe.image,
      recipe.cooking_time,
      recipe.difficulty,
      recipe.instructions,
      recipe.ingredients,
      recipe.tags,
      recipe.category
    );
  });

  insert.finalize();
  
  console.log('✅ База рецептов Munch создана!');
  console.log('📊 Добавлено рецептов:', recipes.length);
  
  // Проверяем что добавилось
  db.all("SELECT COUNT(*) as count FROM recipes", (err, row) => {
    if (err) console.error(err);
    else console.log('✅ В базе рецептов:', row[0].count, 'записей');
    db.close();
  });
});