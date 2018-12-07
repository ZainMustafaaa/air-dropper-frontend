import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

export const appRoutes: Routes = [
    { 
        path: 'test', 
        component: AppComponent,
    },
    { 
        path: '', 
        component: AppComponent, 
    }
];
