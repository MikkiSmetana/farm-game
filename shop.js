// Логика магазина и покупок

class Shop {
    constructor(game) {
        this.game = game;
        this.init();
    }

    init() {
        this.renderShop();
        this.setupPaymentSystem();
    }

    renderShop() {
        const shopGrid = document.getElementById('shopGrid');
        shopGrid.innerHTML = '';

        GAME_DATA.shopItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'shop-item-card';
            
            let description = '';
            if (item.category === 'gems') {
                description = `Получить ${item.gems} кристаллов`;
            } else if (item.category === 'skins') {
                description = `Косметический скин для животного`;
            }

            card.innerHTML = `
                <div class="shop-item-icon">${item.emoji}</div>
                <h3>${item.name}</h3>
                <p class="shop-description">${description}</p>
                <div class="shop-item-price">
                    <span class="price-amount">$${item.price.toFixed(2)}</span>
                </div>
                <button class="btn-buy-real-money" onclick="shop.buyWithRealMoney('${item.id}')">
                    Купить
                </button>
                <p class="shop-info">💳 Реальные деньги</p>
            `;
            shopGrid.appendChild(card);
        });
    }

    setupPaymentSystem() {
        // Симуляция платёжной системы
        // В реальной игре здесь была бы интеграция с Stripe, PayPal и т.д.
        window.shop = this;
    }

    buyWithRealMoney(itemId) {
        const item = GAME_DATA.shopItems.find(i => i.id === itemId);
        
        // Симуляция платежа
        this.simulatePayment(item);
    }

    simulatePayment(item) {
        // В реальной игре здесь запрос к платёжной системе
        const confirmation = confirm(
            `Купить "${item.name}" за $${item.price.toFixed(2)}?\n\n` +
            `Вы получите: ${item.gems} 💎`
        );

        if (confirmation) {
            this.completePayment(item);
        }
    }

    completePayment(item) {
        // Добавляем кристаллы игроку
        this.game.gems += item.gems;
        this.game.updateDisplay();
        this.game.saveGame();

        // Отображаем уведомление
        this.game.showNotification(`✅ Спасибо! Получено ${item.gems} 💎`);

        // В реальной игре здесь была бы отправка данных на сервер
        this.logTransaction(item);
    }

    logTransaction(item) {
        console.log(`[PAYMENT] Item: ${item.name}, Price: $${item.price}, Gems: ${item.gems}`);
        
        // Здесь можно отправить данные на сервер для отслеживания продаж
        // fetch('/api/log-transaction', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         itemId: item.id,
        //         price: item.price,
        //         gems: item.gems,
        //         timestamp: new Date().toISOString()
        //     })
        // });
    }

    // Покупка декораций за кристаллы (в игре)
    buyDecorationWithGems(decoId) {
        const deco = GAME_DATA.decorations.find(d => d.id === decoId);
        
        if (this.game.gems >= deco.gems) {
            this.game.gems -= deco.gems;
            this.game.decorations.push(decoId);
            this.game.updateDisplay();
            this.game.renderDecorations();
            this.game.saveGame();
            this.game.showNotification(`✨ Получено: ${deco.name}`);
        } else {
            alert(`Недостаточно кристаллов! Нужно: ${deco.gems}, у вас: ${this.game.gems}`);
        }
    }

    // Покупка скинов за кристаллы
    buySkinWithGems(skinId, animalIndex) {
        const skin = GAME_DATA.shopItems.find(i => i.id === skinId);
        
        if (this.game.gems >= skin.gems) {
            this.game.gems -= skin.gems;
            this.game.animals[animalIndex].skin = skinId;
            this.game.updateDisplay();
            this.game.renderAnimalsDisplay();
            this.game.saveGame();
            this.game.showNotification(`✨ Скин куплен: ${skin.name}`);
        } else {
            alert(`Недостаточно кристаллов! Нужно: ${skin.gems}, у вас: ${this.game.gems}`);
        }
    }
}

// Инициализация магазина когда загружена игра
document.addEventListener('DOMContentLoaded', () => {
    // Магазин будет инициализирован после загрузки игры
    setTimeout(() => {
        if (typeof game !== 'undefined') {
            window.shop = new Shop(game);
        }
    }, 100);
});
