import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      @for (n of notifications(); track n.id) {
        <div 
          class="notification-toast"
          [class]="n.type"
          (click)="remove(n.id)"
        >
          <div class="icon">
            @if (n.type === 'success') { ✓ }
            @else if (n.type === 'error') { ✕ }
            @else { ℹ }
          </div>
          <div class="message">{{ n.message }}</div>
          <button class="close-btn">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }

    .notification-toast {
      pointer-events: all;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px;
      min-width: 320px;
      max-width: 450px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;
      animation: toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      transition: all 0.3s ease;
    }

    .notification-toast:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    }

    .icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-weight: 800;
      font-size: 14px;
      flex-shrink: 0;
    }

    .message {
      flex: 1;
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 16px;
    }

    /* Types */
    .success {
      border-left: 5px solid #22c55e;
    }
    .success .icon { background: #dcfce7; color: #166534; }

    .error {
      border-left: 5px solid #ef4444;
    }
    .error .icon { background: #fee2e2; color: #b91c1c; }

    .info {
      border-left: 5px solid #0f265c;
    }
    .info .icon { background: #e0e7ff; color: #0f265c; }

    @keyframes toastIn {
      from { transform: translateX(100%) scale(0.9); opacity: 0; }
      to { transform: translateX(0) scale(1); opacity: 1; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {
  private readonly service = inject(NotificationService);
  readonly notifications = this.service.notifications;

  remove(id: string): void {
    this.service.remove(id);
  }
}
