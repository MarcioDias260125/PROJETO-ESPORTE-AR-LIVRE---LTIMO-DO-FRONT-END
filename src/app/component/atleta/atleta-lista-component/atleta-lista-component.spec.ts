import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { AtletaService } from '../../../service/atleta-service';
import { Atleta } from '../../../models/Atleta';


describe('AtletaService', () => {

  let service: AtletaService;
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AtletaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AtletaService);

    httpMock = TestBed.inject(HttpTestingController)
  });

  it('deve calcular a idade corretamente', () => {
    const resultado = service.calcularIdade('1976-05-05');

    expect(resultado).toBe(50);
  });

  it('Deve retornar os atletas', () => {

    const atletasMock: Atleta[] = [
      {
        "nome": "João",
        "cpf": 12345678910,
        "sexo": "M",
        "cep": 49123123,
        "bairro": "Centro",
        "cidade": "Aracaju",
        "uf": "Se",
        "dataNs": "2000-02-25",
        "id": 1,
        "rua_logradouro": "Rua Sei lá das quantas"
      },
      {
        "nome": "Maria",
        "cpf": 11122233302,
        "sexo": "F",
        "cep": 49123123,
        "bairro": "Centro",
        "cidade": "Aracaju",
        "uf": "Se",
        "dataNs": "2010-02-20",
        "id": 2,
        "rua_logradouro": "Rua Sei lá das quantas"
      }
    ]

    service.listarAtletas().subscribe(atletas => {
      expect(atletas.length).toBe(2)
      expect(atletas[0].nome).toBe('João')
      expect(atletas[1].nome).toBe('Maria')
    })

    //const request = httpMock.expectOne('http://localhost:3000/atletas')

    const request = httpMock.expectOne('https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta')

    expect(request.request.method).toEqual('GET')

    request.flush(atletasMock)

  })

  // POST
  it('deve adicionar uma pessoa', () => {

    const atleta: Atleta = {
      "nome": "Maria Flor",
      "cpf": 12345678910,
      "sexo": "M",
      "cep": 49123123,
      "bairro": "Centro",
      "cidade": "Aracaju",
      "uf": "Se",
      "dataNs": "2000-02-25",
      "id": 3,
      "rua_logradouro": "Rua Sei lá das quantas"
    }


    service.salvarAtleta(atleta).subscribe(atletas => {

      expect(atletas).toEqual(atletas);

    });


    const request = httpMock.expectOne(
      'https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta'
    );


    expect(request.request.method).toEqual('POST');

    expect(request.request.body).toEqual(atleta);

    request.flush(atleta);

  });


  // PUT
  it('deve editar um atleta', () => {

    const atleta: Atleta = {
      "nome": "João Souza",
      "cpf": 12345678910,
      "sexo": "M",
      "cep": 49123123,
      "bairro": "Centro",
      "cidade": "Aracaju",
      "uf": "Se",
      "dataNs": "2000-02-25",
      "id": 1,
      "rua_logradouro": "Rua Sei lá das quantas"
    }


    service.alterarAtleta(atleta).subscribe(atletas => {

      expect(atletas).toEqual(atleta);

    });


    const request = httpMock.expectOne(
      'https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta/1'
    );


    expect(request.request.method).toBe('PUT');

    expect(request.request.body).toEqual(atleta);


    request.flush(atleta);

  });


  // DELETE
  it('deve excluir um atleta', () => {

    service.excluirAtleta(1).subscribe();


    const request = httpMock.expectOne(
      'https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta/1'
    );


    expect(request.request.method).toBe('DELETE');


    request.flush(null);

  });

});
