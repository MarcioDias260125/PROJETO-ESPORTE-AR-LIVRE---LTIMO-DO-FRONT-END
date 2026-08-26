import { Injectable } from '@angular/core';
import { Atleta } from '../models/Atleta';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AtletaService {

    constructor(private http: HttpClient) { }

    listarAtletas(): Observable<Atleta[]> {
       // const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta`

        const urlApi = `http://127.0.0.1:8000/pessoa/`
        
        return this.http.get<Atleta[]>(urlApi)
    }

    listarAtleta(idAtleta: number): Observable<Atleta> {
        const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta/${idAtleta}`
        return this.http.get<Atleta>(urlApi)
    }

    salvarAtleta(atleta: Atleta): Observable<Atleta> {
        const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta`
        return this.http.post<Atleta>(urlApi, atleta)
    }

    excluirAtleta(idAtleta: number): Observable<Atleta> {
        const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta/${idAtleta}`
        return this.http.delete<Atleta>(urlApi)
    }

    alterarAtleta(atleta: Atleta): Observable<Atleta> {
        const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/atleta/${atleta.id}`

        return this.http.put<Atleta>(urlApi, atleta)
    }

    //CALCULO IDADE
    //aaaa-MM-dd
    calcularIdade(data_nascimento: string): number{
        const dt_nascimento = new Date(data_nascimento + "T00:00:00")
        const hoje = new Date()

        let idade = hoje.getFullYear() - dt_nascimento.getFullYear() 
        const resp_calc_mes = hoje.getMonth() -dt_nascimento.getMonth()

        if(resp_calc_mes < 0 || (resp_calc_mes === 0 && hoje.getDate() < dt_nascimento.getDate())){
            idade--
        }
        
        return idade
    }


    /*
    //DECLARANDO ARRAY atletas
    private atletas: Atleta[] = []

    //DECLARAÇÃO DAS FUNÇÕES DE MANIPULAÇÃO DO ARRAY
    //ADICIONANDO ELEMNTO
    adicionarAtleta(atleta: Atleta){
        //ARRRRRMMMMMENNGUE PARA GERAR ID
        atleta.id = this.atletas.length + 1
        this.atletas.push(atleta)
    }

    //LISTAR ELEMENTOS
    listarAtletas(){
        console.table(this.atletas)

        return this.atletas
    }

    //REMOVER ELEMENTO
    removerElemento(idAtleta: number){
        this.atletas = this.atletas.filter(elem=>elem.id !== idAtleta)
    }

    //REMOVER ELEMENTO2
    removerElemento2(atleta: Atleta){
        let posArray = this.atletas.findIndex(elem=>elem.id !== atleta.id)
        this.atletas.splice(1,posArray)
    }

    //ALTERANDO ELEMENTO DO ARRAY
    alterarElemento(atleta: Atleta){
        let posArray = this.atletas.findIndex(elem=>elem.id !== atleta.id)
        this.atletas[posArray] = atleta
    }*/


}