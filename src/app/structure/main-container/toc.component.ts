import {
	AfterViewInit,
	Component,
	ElementRef,
	OnDestroy,
	ViewChild,
	effect,
	inject,
	signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
	styleUrl: './main-container.scss',
})
export class TocComponent implements AfterViewInit, OnDestroy {
	private router = inject(Router);

	headings = signal<HeadingNode[]>([]);
	activeId = signal<string | null>(null);

	private readonly OFFSET_TOP = 80; // adjust to match your layout
	private observer: IntersectionObserver | null = null;
	private lastScrollTop = 0;

	private routerEvents = toSignal(this.router.events, { initialValue: null });

	@ViewChild('tocScroll', { static: false })
	tocScrollRef?: ElementRef<HTMLElement>;

	constructor() {
		// Re-init TOC on route change and reset TOC scroll
		effect(() => {
			this.routerEvents();
			setTimeout(() => {
				this.resetTocScroll();        // left sidebar TOC
				this.resetPrintAreaScroll();  // ⬅️ right side content page
				this.initToc();
			}, 300);
		});
	}

	ngAfterViewInit(): void {
		this.initToc();
	}

	ngOnDestroy(): void {
		this.cleanupObserver();
	}

	private cleanupObserver(): void {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
	}

	private resetTocScroll(): void {
		if (this.tocScrollRef?.nativeElement) {
			this.tocScrollRef.nativeElement.scrollTop = 0;
		}
	}

	private initToc(): void {
		const root = document.querySelector('.doc-content') as HTMLElement | null;

		this.cleanupObserver();

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
		this.activeId.set(tree[0]?.id ?? null);

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

		const scrollContainer = document.querySelector('.printArea') as HTMLElement | null;
		if (!scrollContainer) return;

		const rect = el.getBoundingClientRect();
		const containerRect = scrollContainer.getBoundingClientRect();
		const relativeTop = rect.top - containerRect.top;
		const targetScroll = scrollContainer.scrollTop + relativeTop - this.OFFSET_TOP;

		scrollContainer.scrollTo({
			top: targetScroll,
			behavior: 'smooth',
		});
	}

	private initIntersectionObserver(nodeList: HTMLElement[]): void {
		this.cleanupObserver();

		const scrollContainer = document.querySelector('.printArea') as HTMLElement | null;
		const container = scrollContainer ?? document.documentElement;

		// Track scroll direction
		container.addEventListener(
			'scroll',
			() => {
				const currentTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
				this.lastScrollTop = currentTop;
			},
			{ passive: true }
		);

		const observer = new IntersectionObserver(
			(entries) => {
				const currentTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
				const scrollingDown = currentTop >= this.lastScrollTop;
				this.lastScrollTop = currentTop;

				let bestId: string | null = null;
				let bestDist = Infinity;

				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;

					const target = entry.target as HTMLElement;
					const rect = entry.boundingClientRect;
					const dist = Math.abs(rect.top - this.OFFSET_TOP);

					if (dist < bestDist) {
						bestDist = dist;
						bestId = target.id;
					}
				});

				if (!bestId) {
					if (scrollingDown) {
						let lastAbove: any | null = null;

						nodeList.forEach((h) => {
							const rect = h.getBoundingClientRect();
							if (rect.top <= this.OFFSET_TOP) {
								if (!lastAbove || rect.top > lastAbove.top) {
									lastAbove = { id: h.id, top: rect.top };
								}
							}
						});

						bestId = lastAbove?.id ?? this.activeId();
					} else {
						let firstBelow: any | null = null;

						nodeList.forEach((h) => {
							const rect = h.getBoundingClientRect();
							if (rect.top > this.OFFSET_TOP) {
								if (!firstBelow || rect.top < firstBelow.top) {
									firstBelow = { id: h.id, top: rect.top };
								}
							}
						});

						bestId = firstBelow?.id ?? this.activeId();
					}
				}

				if (bestId && bestId !== this.activeId()) {
					this.activeId.set(bestId);
					this.scrollTocToActive();
				}
			},
			{
				root: scrollContainer ?? null,              // 👈 use printArea when available
				rootMargin: `-${this.OFFSET_TOP}px 0px -60% 0px`,
				threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
			}
		);

		nodeList.forEach((h) => observer.observe(h));
		this.observer = observer;
	}


	private scrollTocToActive(): void {
		if (!this.tocScrollRef?.nativeElement) return;

		const container = this.tocScrollRef.nativeElement;
		const activeId = this.activeId();
		if (!activeId) return;

		const activeLink = container.querySelector<HTMLAnchorElement>(
			`a[data-id="${activeId}"]`
		);
		if (!activeLink) return;

		const linkRect = activeLink.getBoundingClientRect();
		const contRect = container.getBoundingClientRect();

		// ensure active link is visible inside TOC container
		if (linkRect.top < contRect.top) {
			container.scrollTop += linkRect.top - contRect.top - 10;
		} else if (linkRect.bottom > contRect.bottom) {
			container.scrollTop += linkRect.bottom - contRect.bottom + 10;
		}
	}

	private resetPrintAreaScroll(): void {
		const scrollContainer = document.querySelector('.printArea') as HTMLElement | null;
		if (scrollContainer) {
			scrollContainer.scrollTop = 0;
		}
	}
}
