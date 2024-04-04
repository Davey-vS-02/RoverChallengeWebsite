import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { CalculatorComponent } from './calculator/calculator.component';

export const routes: Routes = [
    { path: 'calculator', component: CalculatorComponent },
    { path: 'home-page', component: HomePageComponent },
    { path: '', redirectTo: 'home-page', pathMatch: 'full' },
];
