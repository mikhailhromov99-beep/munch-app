const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Статика для изображений
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Подключаем базу данных
const dbPath = path.join(__dirname, 'database', 'recipes.db');
const db = new sqlite3.Database(dbPath);

// Главная страница API
app.get('/', (req, res) => {
  res.json({ 
    message: '🍽️ Munch API работает!',
    endpoints: {
      recipes: '/api/recipes',
      recipeDetail: '/api/recipes/:id', 
      categories: '/api/categories'
    }
  });
});

// API: Получить все рецепты
app.get('/api/recipes', (req, res) => {
  const { category, difficulty, search } = req.query;
  
  let query = 'SELECT * FROM recipes WHERE 1=1';
  const params = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (difficulty && difficulty !== 'all') {
    query += ' AND difficulty = ?';
    params.push(difficulty);
  }

  if (search) {
    query += ' AND (name LIKE ? OR tags LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  query += ' ORDER BY name';

  console.log('📥 Запрос рецептов:', query, params);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('❌ Ошибка базы данных:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Парсим JSON поля
    const recipes = rows.map(recipe => ({
      ...recipe,
      instructions: JSON.parse(recipe.instructions),
      ingredients: JSON.parse(recipe.ingredients),
      tags: JSON.parse(recipe.tags)
    }));
    
    console.log('✅ Отправлено рецептов:', recipes.length);
    res.json(recipes);
  });
});

// API: Получить рецепт по ID
app.get('/api/recipes/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM recipes WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Рецепт не найден' });
    }
    
    const recipe = {
      ...row,
      instructions: JSON.parse(row.instructions),
      ingredients: JSON.parse(row.ingredients),
      tags: JSON.parse(row.tags)
    };
    
    res.json(recipe);
  });
});

// API: Получить категории
app.get('/api/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM recipes ORDER BY category', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const categories = rows.map(row => row.category);
    res.json(categories);
  });
});

app.listen(PORT, () => {
  console.log(`🍽️ Munch API сервер запущен на http://localhost:${PORT}`);
  console.log(`📚 Доступно API:`);
  console.log(`   GET / - информация API`);
  console.log(`   GET /api/recipes - все рецепты`);
  console.log(`   GET /api/recipes/:id - рецепт по ID`);
  console.log(`   GET /api/categories - категории`);
});