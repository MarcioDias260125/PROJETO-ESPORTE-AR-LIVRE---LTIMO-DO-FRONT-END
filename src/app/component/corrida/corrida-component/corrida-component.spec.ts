import { ComponentFixture, TestBed } from '@angular/core/testing';
// Importamos ActivatedRoute (para poder sobrescrever o provider) e
// convertToParamMap (helper do Angular que transforma um objeto simples
// em um ParamMap válido, o mesmo tipo que activeRoute.snapshot.paramMap espera)
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { CorridaComponent } from './corrida-component';

describe('CorridaComponent', () => {
  let component: CorridaComponent;
  let fixture: ComponentFixture<CorridaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorridaComponent],

      // O CorridaComponent injeta ActivatedRoute no construtor e usa
      // this.activeRoute.snapshot.paramMap.get('id') dentro do ngOnInit().
      // Sem um Router configurado no TestBed, o Angular não encontra
      // nenhum provider para ActivatedRoute e o teste quebrava com:
      //   NG0201: No provider found for `ActivatedRoute`
      //
      // Por isso fornecemos manualmente um "fake" ActivatedRoute via
      // useValue, com só a parte da API que o componente realmente usa
      // (snapshot.paramMap.get(...)).
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              // convertToParamMap({}) cria um ParamMap vazio.
              // Assim, activeRoute.snapshot.paramMap.get('id') retorna null,
              // Number(null) vira 0, e o componente entende que não há
              // id de edição (editar = false). Isso evita que o
              // ngOnInit dispare carregaDados() -> corridaService.listarCorrida(),
              // que faria uma chamada HTTP real e quebraria o teste
              // (já que aqui não configuramos HttpClientTesting).
              paramMap: convertToParamMap({})
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CorridaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});