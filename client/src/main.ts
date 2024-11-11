import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.core.css";

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
