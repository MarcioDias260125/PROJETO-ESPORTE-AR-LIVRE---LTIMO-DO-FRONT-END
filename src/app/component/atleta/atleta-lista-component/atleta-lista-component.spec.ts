import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtletaListaComponent } from './atleta-lista-component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Atleta } from '../../../models/Atleta';

describe('AtletaListaComponent', () => {
  
  let service : AtletaListaComponent
  let httpMock : HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        AtletaListaComponent,
        provideHttpClient,
        provideHttpClientTesting
      ]
    }).compileComponents();

    service = TestBed.inject(AtletaListaComponent)

    httpMock = TestBed.inject(HttpTestingController)
  });

  it ('Resultado esperado é calcular corretamente a idade', () => {
    const resultado = service.calcularIdade('2004-08-31')
    expect(resultado).toBe(21);
  });

  it('Resultado esperado a lista de atletas',() =>{
    const atletas : Atleta [] = [{
      "nome": "Rute",
      "cpf" : 78945612300,
      "sexo" : "",
      "cep" : 49001456,
      "rua_logradouro" : "Rua Capela",
      "bairro" : "Centro",
      "cidade" : "Aracaju",
      "uf" : "SE",
      "dataNs" : "1980-02-12",
      "id" : 1,
    },
    {
      "nome": "Maria",
      "cpf" : 909090323,
      "sexo" : "",
      "cep" : 49090273,
      "rua_logradouro" : "Rua Arauá",
      "bairro" : "Centro",
      "cidade" : "Aracaju",
      "uf" : "SE",
      "dataNs" : "1985-02-12",
      "id" : 2,
    }]

   service.listarAtletas().subscribe(result => {
    expect(result).toEqual(atletas)
   })

    const requisicao = httpMock.expectOne('https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta')

    expect(requisicao.request.method).toBe('GET')

    requisicao.flush(atletas)
  })

  it ('Resultado esperado adicionar atleta', () => {
    const atleta : Atleta ={
      "nome": "José",
      "cpf" : 12345609876,
      "sexo" : "",
      "cep" : 49090275,
      "rua_logradouro" : "Rua Itaporanga",
      "bairro" : "Centro",
      "cidade" : "Aracaju",
      "uf" : "SE",
      "dataNs" : "1985-02-15",
      "id" : 3,

    }

    service.alterarAtleta(atleta).subscribe(result =>{
      expect(result).toEqual(atleta)
    })
    
    const requisicao = httpMock.expectOne('https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta/3')

    expect(requisicao.request.method).toBe('POST')

    requisicao.flush(atleta)
  })

});


