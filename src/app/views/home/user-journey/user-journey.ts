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
}