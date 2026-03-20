import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div 
      class="skeleton-loader" 
      [style.width]="width" 
      [style.height]="height" 
      [style.borderRadius]="borderRadius"
    ></div>
  `,
  styles: [`
    .skeleton-loader {
      background: linear-gradient(
        90deg,
        rgba(226, 232, 240, 0.5) 25%,
        rgba(203, 213, 225, 0.8) 50%,
        rgba(226, 232, 240, 0.5) 75%
      );
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      display: inline-block;
    }

    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '20px';
  @Input() borderRadius: string = '4px';
}
