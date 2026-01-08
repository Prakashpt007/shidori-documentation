import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: "", redirectTo: "home", pathMatch: "full" },

	{
		path: "",
		loadComponent: () => import('./structure/main-container/main-container').then(c => c.MainContainer),
		children: [
			{ path: "home", loadComponent: () => import('./views/home/home').then(c => c.Home), data: { title: "Shidori – Detailed Summary" } },
			{ path: "database", loadComponent: () => import('./views/database/database').then(c => c.Database), data: { title: "Database" } },

			{ path: "user-journey", loadComponent: () => import('./views/home/user-journey/user-journey').then(c => c.UserJourney), data: { title: "User / Customer Journey" } },
			{ path: "modules", loadComponent: () => import('./views/module-architecture/module-architecture').then(c => c.ModuleArchitecture), data: { title: "Modules" } },
			{ path: "api-response", loadComponent: () => import('./views/development-api-response/development-api-response').then(c => c.DevelopmentApiResponse), data: { title: "Development API & response" } },
		]
	},
	// {
	// 	path: "**",
	// 	loadComponent: () => import('./core/error/error-404/error-404.component').then(c => c.Error404Component), data: { title: "Error 404 Page" }
	// }
];
