import { CommonModule } from '@angular/common';
import { Component, effect, signal, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

interface HeadingNode {
	id: string;
	text: string;
	level: number;
	children: HeadingNode[];
}

@Component({
	selector: 'app-toc',
	standalone: true,
	imports: [CommonModule],
	templateUrl: 'toc.component.html',
	styleUrl: './main-container.scss'
})
export class TocComponent implements OnDestroy {
	private router = inject(Router);

	headings = signal<HeadingNode[]>([]);
	activeId = signal<string | null>(null);

	private readonly OFFSET_TOP = 25;

	private routerEvents = toSignal(
		this.router.events,
		{ initialValue: null }
	);

	constructor() {
		effect(() => {
			this.routerEvents();
			setTimeout(() => this.initToc(), 300);
		});
	}

	ngAfterViewInit() {
		this.initToc();
	}

	ngOnDestroy() {
		const existing = (this as any).observer;
		if (existing) existing.disconnect();
	}

	private initToc() {
		const root = document.querySelector('.doc-content') as HTMLElement | null;

		const existing = (this as any).observer as IntersectionObserver | undefined;
		if (existing) {
			existing.disconnect();
			(this as any).observer = null;
		}

		// ❌ No container → clear and hide TOC
		if (!root) {
			this.headings.set([]);
			this.activeId.set(null);
			return;
		}

		const nodeList = root.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6');
		if (nodeList.length === 0) {
			this.headings.set([]);
			this.activeId.set(null);
			return;
		}

		const flat: HeadingNode[] = [];

		nodeList.forEach((el, index) => {
			const level = parseInt(el.tagName.substring(1), 10) || 1;

			if (!el.id) {
				el.id = this.slugify(el.textContent || 'heading') + '-' + (index + 1);
			}

			flat.push({
				id: el.id,
				text: el.textContent?.trim() || 'Heading',
				level,
				children: [],
			});
		});

		const tree = this.buildHierarchy(flat);
		this.headings.set(tree);
		this.activeId.set(tree[0]?.id ?? null); // optional: default to first

		this.initIntersectionObserver(Array.from(nodeList));
	}

	private buildHierarchy(list: HeadingNode[]): HeadingNode[] {
		const root: HeadingNode[] = [];
		const stack: HeadingNode[] = [];

		list.forEach((node) => {
			while (stack.length && stack[stack.length - 1].level >= node.level) {
				stack.pop();
			}

			if (!stack.length) {
				root.push(node);
			} else {
				stack[stack.length - 1].children.push(node);
			}

			stack.push(node);
		});

		return root;
	}

	private slugify(text: string): string {
		return text
			.toLowerCase()
			.trim()
			.replace(/[\s]+/g, '-')
			.replace(/[^\w-]/g, '');
	}

	scrollTo(id: string): void {
		const el = document.getElementById(id);
		if (!el) return;

		// ✅ Target YOUR scroll container
		const scrollContainer = document.querySelector('.printArea') as HTMLElement;
		if (!scrollContainer) return;

		const rect = el.getBoundingClientRect();
		const containerRect = scrollContainer.getBoundingClientRect();

		// Calculate relative to container
		const relativeTop = rect.top - containerRect.top;
		const targetScroll = scrollContainer.scrollTop + relativeTop - this.OFFSET_TOP;

		scrollContainer.scrollTo({
			top: targetScroll,
			behavior: 'smooth'
		});
	}


	private initIntersectionObserver(nodeList: HTMLElement[]) {
		const existing = (this as any).observer;
		if (existing) existing.disconnect();


		console.log(`-${this.OFFSET_TOP}px 0px -50% 0px`);


		const observer = new IntersectionObserver(
			(entries) => {
				let activeId: string | null = null;

				// Primary: heading top within 0-80px range
				entries.forEach(entry => {
					const target = entry.target as HTMLElement;
					const rect = target.getBoundingClientRect();

					if (rect.top >= 0 && rect.top <= this.OFFSET_TOP) {
						activeId = target.id;
						return;
					}
				});

				// Fallback: closest heading just below 80px
				if (!activeId) {
					let closestId: string | null = null;
					let minDist = Infinity;

					entries.forEach(entry => {
						const target = entry.target as HTMLElement;
						const rect = entry.boundingClientRect;
						const dist = Math.abs(rect.top - this.OFFSET_TOP);
						if (rect.top > this.OFFSET_TOP && dist < minDist) {
							minDist = dist;
							closestId = target.id;
						}
					});
					activeId = closestId;
				}

				this.activeId.set(activeId);
			},
			{
				root: null,
				rootMargin: `-${this.OFFSET_TOP}px 0px -50% 0px`,
				threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0]
			}
		);

		nodeList.forEach(h => observer.observe(h));
		(this as any).observer = observer;
	}
}
