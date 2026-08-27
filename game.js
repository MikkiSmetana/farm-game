// Главная логика игры

class FarmGame {
    constructor() {
        this.coins = GAME_CONFIG.initialCoins;
        this.gems = GAME_CONFIG.initialGems;
        this.field = new Array(GAME_CONFIG.fieldSize).fill(null);
        this.animals = [];
        this.decorations = [];
        this.ownedSkins = {};
        this.activeSkins = {};
        this.selectedCell = null;
        this.init();
    }

    init() {
        this.loadGame();
        this.setupEventListeners();
        this.renderField();
        this.renderCrops();
        this.renderAnimalsShop();
        this.renderDecorations();
        this.startAutoSave();
        this.updateDisplay();
        this.startAnimalCollection();
    }

    setupEventListeners() {
        // Вкладки
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Поле ферма
        document.getElementById('field').addEventListener('click', (e) => {
            if (e.target.classList.contains('field-cell')) {
                this.selectCell(parseInt(e.target.dataset.index));
            }
        });

        // Закрытие модальных окон
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    renderField() {
        const field = document.getElementById('field');
        field.innerHTML = '';
        field.style.gridTemplateColumns = `repeat(3, 1fr)`;

        for (let i = 0; i < GAME_CONFIG.fieldSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'field-cell';
            cell.dataset.index = i;

            if (this.field[i]) {
                const crop = this.field[i];
                const cropData = GAME_DATA.crops.find(c => c.id === crop.cropId);
                const progress = (Date.now() - crop.plantedAt) / cropData.growTime * 100;

                if (progress >= 100) {
                    cell.innerHTML = `
                        <div class="crop-ready">
                            <span class="crop-emoji">${cropData.emoji}</span>
                            <button class="btn-collect" onclick="game.collectCrop(${i})">Собрать</button>
                        </div>
                    `;
                    cell.style.backgroundColor = '#90EE90';
                } else {
                    cell.innerHTML = `
                        <div class="crop-growing">
                            <span class="crop-emoji">${cropData.emoji}</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                        </div>
                    `;
                    cell.style.backgroundColor = '#FFE4B5';
                }
            } else {
                cell.innerHTML = '<span class="empty-cell">+</span>';
                cell.style.backgroundColor = '#D4A574';
            }

            field.appendChild(cell);
        }
    }

    renderCrops() {
        const grid = document.getElementById('cropsGrid');
        grid.innerHTML = '';

        GAME_DATA.crops.forEach(crop => {
            const card = document.createElement('div');
            card.className = 'crop-card';
            card.innerHTML = `
                <div class="crop-icon">${crop.emoji}</div>
                <h3>${crop.name}</h3>
                <p>⏱️ ${(crop.growTime / 1000).toFixed(0)}сек</p>
                <p>💰 ${crop.coins} монет</p>
                <button class="btn-primary" onclick="game.showCropModal('${crop.id}')">Посадить</button>
            `;
            grid.appendChild(card);
        });
    }

    showCropModal(cropId) {
        const emptyCell = this.field.findIndex(c => c === null);
        if (emptyCell === -1) {
            alert('Нет свободного места на поле!');
            return;
        }
        this.selectedCrop = cropId;
        this.selectedCell = emptyCell;
        this.plantCrop(cropId, emptyCell);
    }

    plantCrop(cropId, cellIndex) {
        const cropData = GAME_DATA.crops.find(c => c.id === cropId);
        this.field[cellIndex] = {
            cropId: cropId,
            plantedAt: Date.now(),
        };
        this.renderField();
        this.saveGame();
    }

    collectCrop(cellIndex) {
        const crop = this.field[cellIndex];
        if (!crop) return;

        const cropData = GAME_DATA.crops.find(c => c.id === crop.cropId);
        const elapsedTime = Date.now() - crop.plantedAt;

        if (elapsedTime >= cropData.growTime) {
            this.coins += cropData.coins;
            this.field[cellIndex] = null;
            this.updateDisplay();
            this.renderField();
            this.saveGame();
            this.showNotification(`+${cropData.coins} 💰`);
        }
    }

    renderAnimalsShop() {
        const shop = document.getElementById('animalsShop');
        shop.innerHTML = '';

        GAME_DATA.animals.forEach(animal => {
            const card = document.createElement('div');
            card.className = 'animal-card';
            card.innerHTML = `
                <div class="animal-icon">${animal.emoji}</div>
                <h3>${animal.name}</h3>
                <p>💰 ${animal.cost} монет</p>
                <p>📊 Доход: ${animal.income}/сек</p>
                <button class="btn-primary" onclick="game.buyAnimal('${animal.id}')">Купить</button>
            `;
            shop.appendChild(card);
        });
    }

    buyAnimal(animalId) {
        const animalData = GAME_DATA.animals.find(a => a.id === animalId);
        if (this.coins >= animalData.cost) {
            this.coins -= animalData.cost;
            this.animals.push({
                id: Math.random(),
                type: animalId,
                lastCollected: Date.now(),
                skin: null,
            });
            this.updateDisplay();
            this.renderAnimalsDisplay();
            this.saveGame();
            this.showNotification(`Куплено ${animalData.name}! 🎉`);
        } else {
            alert('Недостаточно монет!');
        }
    }

    renderAnimalsDisplay() {
        const display = document.getElementById('animalsDisplay');
        display.innerHTML = '';

        if (this.animals.length === 0) {
            display.innerHTML = '<p class="empty-message">У вас нет животных</p>';
            return;
        }

        this.animals.forEach((animal, index) => {
            const animalData = GAME_DATA.animals.find(a => a.id === animal.type);
            const card = document.createElement('div');
            card.className = 'animal-display-card';

            const emoji = animal.skin ? 
                GAME_DATA.shopItems.find(item => item.id === animal.skin).emoji : 
                animalData.emoji;

            card.innerHTML = `
                <div class="animal-display-icon">${emoji}</div>
                <h4>${animalData.name}</h4>
                <p>📊 Доход: ${animalData.income} 💰</p>
                <button class="btn-secondary" onclick="game.collectAnimal(${index})">Собрать</button>
                <button class="btn-secondary" onclick="game.showSkinModal(${index})">🎨 Скин</button>
            `;
            display.appendChild(card);
        });
    }

    collectAnimal(index) {
        const animal = this.animals[index];
        const animalData = GAME_DATA.animals.find(a => a.id === animal.type);
        const timeSinceCollection = Date.now() - animal.lastCollected;
        const income = Math.floor(timeSinceCollection / 1000) * animalData.income;

        if (income > 0) {
            this.coins += income;
            animal.lastCollected = Date.now();
            this.updateDisplay();
            this.saveGame();
            this.showNotification(`+${income} 💰`);
        }
    }

    startAnimalCollection() {
        setInterval(() => {
            this.animals.forEach((animal, index) => {
                const animalData = GAME_DATA.animals.find(a => a.id === animal.type);
                const timeSinceCollection = Date.now() - animal.lastCollected;
                if (timeSinceCollection >= animalData.collectTime) {
                    this.collectAnimal(index);
                }
            });
        }, 1000);
    }

    renderDecorations() {
        const shop = document.getElementById('decorationsShop');
        shop.innerHTML = '';

        GAME_DATA.decorations.forEach(deco => {
            const card = document.createElement('div');
            card.className = 'decoration-card';
            card.innerHTML = `
                <div class="decoration-icon">${deco.emoji}</div>
                <h4>${deco.name}</h4>
                <p>💎 ${deco.gems}</p>
                <button class="btn-primary" onclick="game.buyDecoration('${deco.id}')">Купить</button>
            `;
            shop.appendChild(card);
        });

        this.renderPlacedDecorations();
    }

    buyDecoration(decoId) {
        const decoData = GAME_DATA.decorations.find(d => d.id === decoId);
        if (this.gems >= decoData.gems) {
            this.gems -= decoData.gems;
            this.decorations.push(decoId);
            this.updateDisplay();
            this.renderDecorations();
            this.saveGame();
            this.showNotification(`Получено ${decoData.name}! ✨`);
        } else {
            alert('Недостаточно кристаллов!');
        }
    }

    renderPlacedDecorations() {
        const placed = document.getElementById('placedDecorations');
        placed.innerHTML = '<h3>Ваша коллекция декораций:</h3>';

        if (this.decorations.length === 0) {
            placed.innerHTML += '<p class="empty-message">Нет декораций</p>';
            return;
        }

        const decoGrid = document.createElement('div');
        decoGrid.className = 'decorations-grid';

        this.decorations.forEach((decoId) => {
            const decoData = GAME_DATA.decorations.find(d => d.id === decoId);
            const item = document.createElement('div');
            item.className = 'decoration-item';
            item.innerHTML = `
                <span class="deco-emoji">${decoData.emoji}</span>
                <p>${decoData.name}</p>
            `;
            decoGrid.appendChild(item);
        });

        placed.appendChild(decoGrid);
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        if (tabName === 'farm') this.renderField();
        if (tabName === 'animals') this.renderAnimalsDisplay();
        if (tabName === 'decorations') this.renderDecorations();
    }

    updateDisplay() {
        document.getElementById('coins').textContent = this.coins;
        document.getElementById('gems').textContent = this.gems;
    }

    showNotification(message) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = message;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
    }

    saveGame() {
        const gameState = {
            coins: this.coins,
            gems: this.gems,
            field: this.field,
            animals: this.animals,
            decorations: this.decorations,
            ownedSkins: this.ownedSkins,
            activeSkins: this.activeSkins,
        };
        localStorage.setItem('farmGameState', JSON.stringify(gameState));
    }

    loadGame() {
        const saved = localStorage.getItem('farmGameState');
        if (saved) {
            const state = JSON.parse(saved);
            this.coins = state.coins || GAME_CONFIG.initialCoins;
            this.gems = state.gems || GAME_CONFIG.initialGems;
            this.field = state.field || new Array(GAME_CONFIG.fieldSize).fill(null);
            this.animals = state.animals || [];
            this.decorations = state.decorations || [];
            this.ownedSkins = state.ownedSkins || {};
            this.activeSkins = state.activeSkins || {};
        }
    }

    startAutoSave() {
        setInterval(() => this.saveGame(), GAME_CONFIG.autosaveInterval);
    }

    showSkinModal(animalIndex) {
        // Заглушка для функции скинов
        alert('Функция скинов будет скоро доступна!');
    }

    selectCell(index) {
        this.showCropModal('wheat'); // По умолчанию пшеница
    }
}

// Запуск игры
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new FarmGame();
});
