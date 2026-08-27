import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Atleta } from '../models/Atleta';

@Injectable({
  providedIn: 'root',
})
export class AtletaService {
  //DECLARAÇÃO CONSTRUTOR
  constructor(private http: HttpClient) { }

  //ADICIONAR NA API
  adicionarAtleta(atleta: Atleta): Observable<Atleta> {
    //const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta`
    const urlApi = `http://127.0.0.1:8000/pessoa/`

    return this.http.post<Atleta>(urlApi, atleta)
  }

  //LISTAR ATLETAS NA API
  listarAtletas(): Observable<Atleta[]> {
    // const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta`

    const urlApi = `http://127.0.0.1:8000/pessoa/`

    return this.http.get<Atleta[]>(urlApi)
  }

  //LISTAR ATLETA
  listarAtleta(idAtleta: number): Observable<Atleta> {
    //const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta/${idAtleta}`
    const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta/${idAtleta}`

    return this.http.get<Atleta>(urlApi)
  }

  //EXCLUIR NA API
  exluirAtleta(atleta: Atleta): Observable<Atleta> {
    const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta/${atleta.id}`
    //const urlApi = `http://127.0.0.1:8000/pessoa/${atleta.id}`

    return this.http.delete<Atleta>(urlApi)
  }

  //ALTERAR NA API
  alterarAtleta(atleta: Atleta): Observable<Atleta> {
    const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta/${atleta.id}`

    //const urlApi = `http://127.0.0.1:8000/pessoa/${atleta.id}`

    return this.http.put<Atleta>(urlApi, atleta)
  }

  //ALTERAR NA API
  alterarAtleta2(idAtleta: number, atleta: Atleta): Observable<Atleta> {
    const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta/${idAtleta}`

    return this.http.put<Atleta>(urlApi, atleta)
  }

  //CALCULAR A IDADE
  //aaaa-MMM-dd - 2026-08-24
  calcularIdade(data_nascimento: string): number {
    const dt_nascimento = new Date(data_nascimento + "T00:00:00")
    const hoje = new Date()

    let idade = hoje.getFullYear() - dt_nascimento.getFullYear()
    const resp_calc_mes = hoje.getMonth() - dt_nascimento.getMonth()

    if (resp_calc_mes < 0 || (resp_calc_mes === 0 && hoje.getDate() < dt_nascimento.getDate())) {
      idade--
    }

    return idade
  }

  //CALCULO IMC
  calcularIMC(atleta: Atleta) {
    return atleta.peso / (atleta.altura * atleta.altura)
  }

  //SITUAÇÃO IMC
  situacaoIMC(imc: number) {
    let situacao = ''

    if (imc <= 18.5) {
      situacao = 'Abaixo do Peso'
    } else if (imc <= 24.9) {
      situacao = 'Normal'
    } else if (imc <= 29.9) {
      situacao = 'Sobrepeso'
    } else if (imc <= 34.9) {
      situacao = 'Obesidade I'
    } else if (imc <= 39.9) {
      situacao = 'Obesidade II (Severa)'
    } else {
      situacao = 'Obesidade III (Mórbida)'
    }

    return situacao
  }

  /*
  private atletas: Pessoa[] = []

  adicionar(pessoa: Pessoa) {
    //ARRRRMENGUEEEE PARA GERAR O ID
    pessoa.id = this.atletas.length + 1
    
    this.atletas.push(pessoa)
  }

  listar() {
    console.table(this.atletas)
    return this.atletas
  }

  private localizarAtleta(idAtleta: number){
    return this.atletas.findIndex(elem => elem.id === idAtleta)
  }

  remover(posicaoArray: number){
    this.atletas.splice(1,posicaoArray)
  }

  remover2(pessoa: Pessoa){
    this.atletas = this.atletas.filter(elem => elem.id !== pessoa.id)
  }

  alterar(pessoa : Pessoa){
    let posArray = this.localizarAtleta(pessoa.id)

    if(posArray >=0){
      this.atletas[posArray] = pessoa
    }

  }*/

}