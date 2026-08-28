import { ComponentFixture, TestBed } from '@angular/core/testing';
// Importamos ActivatedRoute (para poder sobrescrever o provider) e
// convertToParamMap (helper do Angular que transforma um objeto simples
// em um ParamMap válido, o mesmo tipo que route.snapshot.paramMap espera)
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { AtletaComponent } from './atleta-component';

describe('AtletaComponent', () => {
  let component: AtletaComponent;
  let fixture: ComponentFixture<AtletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtletaComponent],

      // O AtletaComponent injeta ActivatedRoute no construtor e usa
      // this.route.snapshot.paramMap.get('id') dentro do ngOnInit().
      // Como o TestBed não tem um Router de verdade rodando, o Angular
      // não encontra nenhum provider para ActivatedRoute e o teste
      // quebrava com o erro:
      //   NG0201: No provider found for `ActivatedRoute`
      //
      // A solução é fornecer manualmente um "fake" ActivatedRoute via
      // useValue, entregando só a parte da API que o componente realmente
      // usa (snapshot.paramMap.get(...)).
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              // convertToParamMap({}) cria um ParamMap vazio.
              // Assim, route.snapshot.paramMap.get('id') retorna null,
              // Number(null) vira 0, e o componente entende que não há
              // id de edição (editar = false). Isso evita que o
              // ngOnInit dispare carregaCampo() -> atletaService.listarAtleta(),
              // que faria uma chamada HTTP real e quebraria o teste
              // (já que aqui não configuramos HttpClientTesting).
              paramMap: convertToParamMap({})
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AtletaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});