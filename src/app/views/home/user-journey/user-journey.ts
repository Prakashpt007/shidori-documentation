import { CommonModule, ViewportScroller } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';

interface HeadingNode {
  id: string;
  text: string;
  level: number;   // 1..6 for h1..h6
  children: HeadingNode[];
}

@Component({
  selector: 'app-user-journey',
  imports: [CommonModule],
  templateUrl: './user-journey.html',
  styleUrl: './user-journey.scss',
})
export class UserJourney {
  // signals
  headings = signal<HeadingNode[]>([]);
  activeId = signal<string | null>(null);

  ngAfterViewInit(): void {
    // one tick so DOM is ready and avoid NG0100
    setTimeout(() => {
      const root = document.querySelector('.doc-content') as HTMLElement | null;
      if (!root) {
        console.error('No .doc-content found');
        return;
      }

      const nodeList = root.querySelectorAll<HTMLElement>(
        'h1, h2, h3, h4, h5, h6'
      );

      // console.log('TOTAL HEADINGS:', nodeList.length);

      const flat: HeadingNode[] = [];

      nodeList.forEach((el, index) => {
        // console.log('HEAD', index, el.tagName, el.textContent);

        const level = parseInt(el.tagName.substring(1), 10) || 1;

        if (!el.id) {
          el.id =
            this.slugify(el.textContent || 'heading') + '-' + (index + 1);
        }

        flat.push({
          id: el.id,
          text: el.textContent?.trim() || 'Heading',
          level,
          children: [],
        });
      });

      // console.log('AFTER IDS:', Array.from(nodeList).map((h) => h.id));

      const tree = this.buildHierarchy(flat);
      this.headings.set(tree); // ✅ signal update

      this.initIntersectionObserver(nodeList);
    }, 0);
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

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  // scrollTo(id: string): void {
  //   const el = document.getElementById(id);
  //   if (!el) return;

  //   const scrollContainer = document.scrollingElement || document.documentElement;
  //   const rect = el.getBoundingClientRect();
  //   const current = scrollContainer.scrollTop;
  //   const offset = 20; // px

  //   scrollContainer.scrollTo({
  //     top: current + rect.top - offset,
  //     behavior: 'smooth',
  //     block: 'start',
  //   });
  // }



  private initIntersectionObserver(
    nodeList: NodeListOf<HTMLElement>
  ): void {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop
          );

        if (visible.length) {
          const first = visible[0].target as HTMLElement;
          this.activeId.set(first.id); // ✅ signal update
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    nodeList.forEach((h) => observer.observe(h));
  }
}