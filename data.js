// Данные всех предметов игры

const GAME_DATA = {
    crops: [
        { id: 'wheat', name: 'Пшеница', emoji: '🌾', growTime: 10000, coins: 50, water: 2 },
        { id: 'corn', name: 'Кукуруза', emoji: '🌽', growTime: 15000, coins: 80, water: 3 },
        { id: 'tomato', name: 'Помидор', emoji: '🍅', growTime: 12000, coins: 60, water: 2 },
        { id: 'carrot', name: 'Морковь', emoji: '🥕', growTime: 8000, coins: 40, water: 1 },
        { id: 'apple', name: 'Яблоко', emoji: '🍎', growTime: 20000, coins: 100, water: 2 },
        { id: 'pumpkin', name: 'Тыква', emoji: '🎃', growTime: 25000, coins: 150, water: 4 },
    ],

    animals: [
        { id: 'chicken', name: 'Курица', emoji: '🐔', cost: 100, income: 20, collectTime: 8000 },
        { id: 'cow', name: 'Корова', emoji: '🐄', cost: 250, income: 50, collectTime: 15000 },
        { id: 'pig', name: 'Свинья', emoji: '🐷', cost: 150, income: 35, collectTime: 12000 },
        { id: 'sheep', name: 'Овца', emoji: '🐑', cost: 120, income: 25, collectTime: 10000 },
        { id: 'duck', name: 'Утка', emoji: '🦆', cost: 90, income: 15, collectTime: 7000 },
        { id: 'horse', name: 'Лошадь', emoji: '🐴', cost: 400, income: 80, collectTime: 20000 },
    ],

    shopItems: [
        // Инструменты
        { id: 'gem-pack-1', name: 'Мини пакет кристаллов', emoji: '💎', price: 4.99, gems: 50, category: 'gems' },
        { id: 'gem-pack-2', name: 'Стандартный пакет кристаллов', emoji: '💎', price: 9.99, gems: 120, category: 'gems' },
        { id: 'gem-pack-3', name: 'Большой пакет кристаллов', emoji: '💎', price: 19.99, gems: 300, category: 'gems' },
        { id: 'gem-pack-4', name: 'Мега пакет кристаллов', emoji: '💎', price: 49.99, gems: 800, category: 'gems' },
        
        // Косметические скины для животных
        { id: 'chicken-gold', name: 'Золотая курица', emoji: '🐔✨', price: 2.99, gems: 30, category: 'skins' },
        { id: 'cow-pink', name: 'Розовая корова', emoji: '🐄💖', price: 3.99, gems: 40, category: 'skins' },
        { id: 'pig-rainbow', name: 'Радужная свинья', emoji: '🐷🌈', price: 4.99, gems: 50, category: 'skins' },
        { id: 'sheep-cloud', name: 'Облачная овца', emoji: '🐑☁️', price: 3.99, gems: 40, category: 'skins' },
        { id: 'duck-royal', name: 'Королевская утка', emoji: '🦆👑', price: 4.99, gems: 50, category: 'skins' },
        { id: 'horse-unicorn', name: 'Единорог', emoji: '🦄', price: 5.99, gems: 60, category: 'skins' },
    ],

    decorations: [
        // Деревья
        { id: 'tree-oak', name: 'Дуб', emoji: '🌳', gems: 50, category: 'trees' },
        { id: 'tree-pine', name: 'Ель', emoji: '🌲', gems: 40, category: 'trees' },
        { id: 'tree-palm', name: 'Пальма', emoji: '🌴', gems: 60, category: 'trees' },
        
        // Цветы
        { id: 'flower-rose', name: 'Роза', emoji: '🌹', gems: 20, category: 'flowers' },
        { id: 'flower-tulip', name: 'Тюльпан', emoji: '🌷', gems: 20, category: 'flowers' },
        { id: 'flower-sunflower', name: 'Подсолнух', emoji: '🌻', gems: 25, category: 'flowers' },
        
        // Специальные
        { id: 'fountain', name: 'Фонтан', emoji: '⛲', gems: 100, category: 'special' },
        { id: 'bridge', name: 'Мост', emoji: '🌉', gems: 150, category: 'special' },
        { id: 'lamp', name: 'Фонарь', emoji: '🏮', gems: 30, category: 'special' },
        { id: 'bench', name: 'Скамейка', emoji: '🪑', gems: 25, category: 'special' },
    ],

    buildings: [
        { id: 'barn', name: 'Сарай', emoji: '🏚️', cost: 500, bonus: 'animals' },
        { id: 'greenhouse', name: 'Теплица', emoji: '🌱', cost: 300, bonus: 'crops' },
        { id: 'mill', name: 'Мельница', emoji: '🏭', cost: 400, bonus: 'production' },
    ]
};

// Константы игры
const GAME_CONFIG = {
    fieldSize: 9, // 3x3 сетка
    maxAnimals: 20,
    autosaveInterval: 5000, // Сохранять каждые 5 секунд
    initialCoins: 200,
    initialGems: 0,
};

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GAME_DATA, GAME_CONFIG };
}
