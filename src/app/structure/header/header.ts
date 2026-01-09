import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [RouterModule],
	templateUrl: './header.html',
	styleUrl: './header.scss'
})
export class Header {

	pageTitle!: string | null;
	private router = inject(Router);
	private titleService = inject(Title);
	destroy$ = new Subject<void>();
	base_title = "Shidori";

	constructor() {
		// NAVIGATION END + SET PAGE TITLE
		this.router.events
			.pipe(
				filter(event => event instanceof NavigationEnd),
				map(() => {
					let route: ActivatedRoute = this.router.routerState.root;
					while (route.firstChild) {
						route = route.firstChild;
					}
					return route.snapshot.data['title'] || '';
				}),
				takeUntil(this.destroy$)
			)
			.subscribe((title: string) => {
				this.pageTitle = title;



				if (title) {
					this.titleService.setTitle(`${title} - ${this.base_title}`);
				}
			});
	}
}
