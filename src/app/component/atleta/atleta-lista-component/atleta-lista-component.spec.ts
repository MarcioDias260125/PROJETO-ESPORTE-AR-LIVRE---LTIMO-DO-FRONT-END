import { TestBed } from '@angular/core/testing';

import { AtletaService } from '../../../service/atleta-service';
import { provideHttpClient } from '@angular/common/http';

import { Atleta } from '../../../models/Atleta';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('AtletaListaComponent', () => {

  let service: AtletaService
  let httpMock: HttpTestingController

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        AtletaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    service = TestBed.inject(AtletaService)

    httpMock = TestBed.inject(HttpTestingController)

  });

  it('Resultado esperado é calcular corretamente a idade', () => {
    const resultado = service.calcularIdade('1976-02-28')
    expect(resultado).toBe(50);
  });

  it('Resultado esperado a lista de atletas', () => {
    const atletas: Atleta[] = [
      {
      "nome": "Rute",
      "cpf": 78945612300,
      "sexo": "",
      "cep": 49001456,
      "rua_logradouro": "Rua Capela",
      "bairro": "Centro",
      "cidade": "Aracaju",
      "uf": "SE",
      "data_nascimento": "1980-02-12",
      "id": 1
    },
    {
      "nome": "Maria",
      "cpf": 78945612300,
      "sexo": "",
      "cep": 49001456,
      "rua_logradouro": "Rua Capela",
      "bairro": "Centro",
      "cidade": "Aracaju",
      "uf": "SE",
      "data_nascimento": "1980-02-12",
      "id": 2
    }]

    service.listarAtletas().subscribe(result => {
      expect(result).toEqual(atletas)
    })

    const requisicao = httpMock.expectOne('https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta')

    expect(requisicao.request.method).toBe('GET')

    requisicao.flush(atletas)
  })

  it('Resultado esperado adicionar atleta', () => {
    const atleta : Atleta ={
      "nome": "Chicó",
      "cpf": 12345678910,
      "sexo": "",
      "cep": 49001456,
      "rua_logradouro": "Rua Capela",
      "bairro": "Centro",
      "cidade": "Aracaju",
      "uf": "SE",
      "data_nascimento": "1980-02-12",
      "id": 3
    }

    service.adicionarAtleta(atleta).subscribe(result =>{
       expect(result).toEqual(atleta)
    })

    const requisicao = httpMock.expectOne('https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta')

    expect(requisicao.request.method).toBe('POST')

    requisicao.flush(atleta)
    
  })

  it('Resultado esperado alterar atleta', () => {
    const atleta : Atleta ={
      "nome": "Joservaldo",
      "cpf": 12345678910,
      "sexo": "",
      "cep": 49001456,
      "rua_logradouro": "Av. sei das quantas",
      "bairro": "Centro",
      "cidade": "Aracaju",
      "uf": "SE",
      "data_nascimento": "1980-02-12",
      "id": 3
    }

    service.alterarAtleta(atleta).subscribe(result =>{
       expect(result).toEqual(atleta)
    })

    const requisicao = httpMock.expectOne('https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta/3')

    expect(requisicao.request.method).toBe('PUT')

    requisicao.flush(atleta)
    
  })

  it('Resultado esperado exclusão do atleta', () => {
    const atleta : Atleta ={
      "nome": "Joservaldo",
      "cpf": 12345678910,
      "sexo": "",
      "cep": 49001456,
      "rua_logradouro": "Av. sei das quantas",
      "bairro": "Centro",
      "cidade": "Aracaju",
      "uf": "SE",
      "data_nascimento": "1980-02-12",
      "id": 3
    }

    service.exluirAtleta(atleta).subscribe(result =>{
       expect(result).toEqual(atleta)
    })

    const requisicao = httpMock.expectOne('https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta/3')

    expect(requisicao.request.method).toBe('DELETE')

    requisicao.flush(atleta)
    
  })



});