import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { setupMockAutoLogin } from './app/core/mocks/mock-auth.data';

setupMockAutoLogin();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
