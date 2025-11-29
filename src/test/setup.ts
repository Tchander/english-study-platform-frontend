import { config } from '@vue/test-utils';
import { createPinia } from 'pinia';

// Глобальная конфигурация для тестов
const pinia = createPinia();

config.global.plugins = [pinia];
