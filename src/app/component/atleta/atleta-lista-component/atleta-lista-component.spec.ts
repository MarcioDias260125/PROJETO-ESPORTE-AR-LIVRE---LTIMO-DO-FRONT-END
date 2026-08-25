import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtletaListaComponent } from './atleta-lista-component';
import { provideHttpClient } from '@angular/common/http';

describe('AtletaListaComponent', () => {
  
  let service : AtletaListaComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        AtletaListaComponent,
        provideHttpClient
      ]
    }).compileComponents();

    service = TestBed.inject(AtletaListaComponent)
  });

  it ('Resultado esperado é calcular corretamente a idade', () => {
    const resultado = service.calcularIdade('2004-08-31')
    expect(resultado).toBe(21);
  });
});


