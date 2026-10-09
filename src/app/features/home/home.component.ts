import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

type SectionPageData = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data as Partial<SectionPageData>
  });

  protected readonly eyebrow = computed(() => this.routeData().eyebrow ?? 'Smart Order Management');
  protected readonly title = computed(() => this.routeData().title ?? 'Painel');
  protected readonly description = computed(
    () => this.routeData().description ?? 'Escolha uma tela no menu lateral para começar.'
  );
}
