import { ComponentFixture, TestBed } from '@angular/core/testing';
// provideRouter configura um Router de teste "vazio" (sem rotas reais),
// suficiente para satisfazer o que RouterLink precisa injetar internamente.
import { provideRouter } from '@angular/router';

import { MenuComponent } from './menu-component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],

      // O MenuComponent importa RouterLink (usado no template para os
      // links do menu). A diretiva RouterLink injeta ActivatedRoute nos
      // bastidores para funcionar. Sem um Router configurado no TestBed,
      // isso quebrava com:
      //   NG0201: No provider found for `ActivatedRoute`
      //
      // Diferente do AtletaComponent/CorridaComponent (que usam
      // ActivatedRoute diretamente no código), aqui não precisamos
      // controlar o valor de nenhum parâmetro de rota — só precisamos
      // que o Router exista. Por isso basta provideRouter([]) em vez de
      // mockar o ActivatedRoute manualmente.
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});