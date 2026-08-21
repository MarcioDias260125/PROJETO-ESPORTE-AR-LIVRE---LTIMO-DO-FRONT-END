import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Corrida } from '../../../models/Corrida';
import { CorridaService } from '../../../service/corrida/corrida-service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-corrida-component',
  imports: [FormsModule],
  templateUrl: './corrida-component.html',
  styleUrl: './corrida-component.css',
})
export class CorridaComponent {
  //DEFININDO OS ATRIBUTOS DO COMPONENTE CorridaComponent
  id = 0
  descricao_corrida = ''
  data_corrida = ''
  distancia5km = false
  distancia10km = false
  distancia25km = false

  idCorrida = 0
  editar = false

  constructor(
    private corridaService: CorridaService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit() {
    this.idCorrida = Number(this.activeRoute.snapshot.paramMap.get('id'))

    if (this.idCorrida > 0) {
      this.editar = true
      this.carregaDados(this.idCorrida)
    }

  }

  //FUNÇÃO PARA CADASTRAR E ALTERAR
  dadosFormulario() {
    const corrida = new Corrida()
    corrida.descricao_corrida = this.descricao_corrida
    corrida.data_corrida = this.data_corrida
    corrida.distancia5km = this.distancia5km
    corrida.distancia10km = this.distancia10km
    corrida.distancia25km = this.distancia25km

    if (this.editar) {
      corrida.id = this.idCorrida
      
      this.corridaService.alterarCorrida(corrida)
        .subscribe({
          next: (respostaAPI) => {
            return respostaAPI
          },
          error: (msgErro) => {
            return msgErro
          }
        })

    } else {
      this.corridaService.salvarCorrida(corrida)
        .subscribe({
          next: (respostaAPI) => {
            return respostaAPI
          },
          error: (msgErro) => {
            return msgErro
          }
        })
    }

    this.limparAtributos()

  }

  carregaDados(idCorrida: number) {
    this.corridaService.listarCorrida(idCorrida)
      .subscribe({
        next: (dadosCorrida) => {
          this.descricao_corrida = dadosCorrida.descricao_corrida
          this.data_corrida = dadosCorrida.data_corrida
          this.distancia5km = dadosCorrida.distancia5km
          this.distancia10km = dadosCorrida.distancia10km
          this.distancia25km = dadosCorrida.distancia25km

          this.cdr.detectChanges()
        },
        error: (msgErro) => {
          return msgErro
        }
      })
  }

  //LIMPAR OS ATRIBUTOS
  limparAtributos() {
    this.descricao_corrida = ''
    this.data_corrida = ''
    this.distancia5km = false
    this.distancia10km = false
    this.distancia25km = false
  }

}
