import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AtletaService } from '../../../service/atleta-service';
import { Atleta } from '../../../models/Atleta';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-atleta-component',
  imports: [FormsModule],
  templateUrl: './atleta-component.html',
  styleUrl: './atleta-component.css',
})
export class AtletaComponent {


  //DELCARAÇÃO DOS ATRIBUTOS DO COMPONENTE
  id = 0
  nome = ''
  cpf = 0
  data_nascimento = ''
  sexo = ''
  cep = 0
  rua_logradouro = ''
  bairro = ''
  cidade = ''
  uf = ''
  peso = 0
  altura = 0

  editar = false
  idAtleta = 0
  
  //DECLARAÇÃO DO CONSTRUTOR  
  constructor(
    private atletaService: AtletaService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

  //DECLARAÇÃO DE FUNÇÕES
  exibeDados() {
    console.log(this.nome, this.cpf, this.sexo, this.rua_logradouro, this.bairro, this.cidade, this.uf)
  }

  ngOnInit() {
    this.idAtleta = Number(this.route.snapshot.paramMap.get('id'))

    if (this.idAtleta > 0) {
      this.editar = true
      this.carregaCampo(this.idAtleta)
    }
  }

  carregaCampo(idAtleta: number) {
    this.atletaService.listarAtleta(idAtleta)
      .subscribe({
        next: (objAtleta) => {
          this.id = objAtleta.id
          this.nome = objAtleta.nome
          this.cpf = objAtleta.cpf
          this.peso = objAtleta.peso
          this.altura = objAtleta.altura
          this.data_nascimento = objAtleta.data_nascimento
          this.sexo = objAtleta.sexo
          this.cep = objAtleta.cep
          this.rua_logradouro = objAtleta.rua_logradouro
          this.bairro = objAtleta.bairro
          this.cidade = objAtleta.cidade
          this.uf = objAtleta.uf

          //PARA DETECTAR ALTERAÇÃO NO COMPENENT
          this.cdr.detectChanges()

        }, error: (msgErro) => {
          console.log("Erro ao Listar  o atleta ", msgErro)
        }
      })
  }

  enviaDadosAtleta() {
    const objAtleta = new Atleta()
    objAtleta.nome = this.nome
    objAtleta.cpf = this.cpf
    objAtleta.peso = this.peso
    objAtleta.altura = this.altura
    objAtleta.data_nascimento = this.data_nascimento
    objAtleta.sexo = this.sexo
    objAtleta.cep = this.cep
    objAtleta.rua_logradouro = this.rua_logradouro
    objAtleta.bairro = this.bairro
    objAtleta.cidade = this.cidade
    objAtleta.uf = this.uf
    

    if (!this.editar) {
      this.atletaService.adicionarAtleta(objAtleta)
        .subscribe({
          next: (resposta) => {
            console.log(resposta)
          },
          error: (msgErro) => {
            console.log("Erro ao cadastrar  o atleta ", msgErro)
          }
        })
    } else {
      objAtleta.id = this.idAtleta

      this.atletaService.alterarAtleta(objAtleta)
        .subscribe({
          next: (resposta) => {
            console.log(objAtleta)

            console.log(resposta)
          },
          error: (msgErro) => {
            console.log("Erro ao alterar  o atleta ", msgErro)
          }
        })

    }

    this.limparAtributos()

  }

  listaAtleta(idAtleta: number) {
    this.atletaService.listarAtleta(idAtleta)
      .subscribe({
        next: (dados) => {
          console.table(dados)
        },
        error: (msgErro) => {
          console.log("Erro ao listar atletas ", msgErro)
        }
      })
  }

  limparAtributos() {
    this.nome = ''
    this.cpf = 0
    this.peso = 0
    this.altura = 0
    this.data_nascimento = ''
    this.sexo = ''
    this.cep = 0
    this.rua_logradouro = ''
    this.bairro = ''
    this.cidade = ''
    this.uf = ''
  }



}