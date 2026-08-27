// Утилиты для аналитики и отслеживания событий

class GameAnalytics {
    constructor() {
        this.events = [];
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Логирование события
    logEvent(eventName, eventData = {}) {
        const event = {
            sessionId: this.sessionId,
            eventName: eventName,
            timestamp: Date.now(),
            data: eventData,
        };

        this.events.push(event);
        console.log(`[ANALYTICS] ${eventName}:`, eventData);
    }

    // События игры
    logCropPlanted(cropId) {
        this.logEvent('crop_planted', { cropId });
    }

    logCropHarvested(cropId, coins) {
        this.logEvent('crop_harvested', { cropId, coins });
    }

    logAnimalBought(animalId, cost) {
        this.logEvent('animal_bought', { animalId, cost });
    }

    logAnimalCollected(animalId, coins) {
        this.logEvent('animal_collected', { animalId, coins });
    }

    logItemPurchased(itemId, price, gems) {
        this.logEvent('item_purchased', { itemId, price, gems });
    }

    logDecorationBought(decoId, gems) {
        this.logEvent('decoration_bought', { decoId, gems });
    }

    // Получить отчет
    getReport() {
        return {
            sessionId: this.sessionId,
            totalEvents: this.events.length,
            playtime: Date.now() - this.startTime,
            events: this.events,
        };
    }

    // Сохранить отчет локально
    saveReport() {
        const report = this.getReport();
        localStorage.setItem(`report_${this.sessionId}`, JSON.stringify(report));
        console.log('Report saved:', report);
    }
}

// Инициализация аналитики
let analytics;
document.addEventListener('DOMContentLoaded', () => {
    analytics = new GameAnalytics();
    
    // Сохраняем отчет перед закрытием страницы
    window.addEventListener('beforeunload', () => {
        if (analytics) analytics.saveReport();
    });
});
