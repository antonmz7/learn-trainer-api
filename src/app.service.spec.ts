import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    // Сервис — обычный класс, нет никаких зависимостей.
    // Создаём напрямую через new, без testing module — так проще.
    service = new AppService();
  });

  describe('getHealth', () => {
    it('возвращает статус ok', () => {
      const result = service.getHealth();
      expect(result.status).toBe('ok');
    });

    it('возвращает версию из package.json', () => {
      const result = service.getHealth();

      expect(result.version).toBe('0.0.1');
    });

    it('возвращает uptime как число секунд', () => {
      const result = service.getHealth();
      expect(typeof result.uptime).toBe('number');
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });

    it('uptime растёт со временем', async () => {
      const first = service.getHealth().uptime;

      await new Promise((resolve) => setTimeout(resolve, 1100));

      const second = service.getHealth().uptime;

      expect(second).toBeGreaterThan(first);
    });
  });
});
