const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'recipes.db');
const db = new sqlite3.Database(dbPath);

console.log('🖼️ Обновляем изображения рецептов...');

// Бесплатные изображения с Unsplash
const recipeImages = {
  4: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', // Курица с рисом
  5: 'https://images.unsplash.com/photo-1593618998160-52769759b8d7?w=400&h=300&fit=crop', // Омлет
  6: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop'  // Греческий салат
};

// Обновляем изображения для каждого рецепта
Object.keys(recipeImages).forEach(recipeId => {
  db.run(
    'UPDATE recipes SET image = ? WHERE id = ?',
    [recipeImages[recipeId], recipeId],
    function(err) {
      if (err) {
        console.error(`❌ Ошибка обновления рецепта ${recipeId}:`, err);
      } else {
        console.log(`✅ Обновлен рецепт ${recipeId}`);
      }
    }
  );
});

// Проверяем результат
db.all('SELECT id, name, image FROM recipes', (err, rows) => {
  if (err) {
    console.error('❌ Ошибка проверки:', err);
  } else {
    console.log('📊 Результаты обновления:');
    rows.forEach(row => {
      console.log(`   ${row.id}. ${row.name} - ${row.image}`);
    });
  }
  db.close();
});