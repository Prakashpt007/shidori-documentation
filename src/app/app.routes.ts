import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: "", redirectTo: "home", pathMatch: "full" },

	{
		path: "",
		loadComponent: () => import('./structure/main-container/main-container').then(c => c.MainContainer),
		children: [
			{ path: "home", loadComponent: () => import('./views/home/home').then(c => c.Home), data: { title: "Home Page" } },
		]
	},
	// {
	// 	path: "**",
	// 	loadComponent: () => import('./core/error/error-404/error-404.component').then(c => c.Error404Component), data: { title: "Error 404 Page" }
	// }
];
