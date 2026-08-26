import { Component, signal } from '@angular/core';
import { AtletaService } from '../../../service/atleta-service';
import { Atleta } from '../../../models/Atleta';
import { Router } from '@angular/router';

@Component({
  selector: 'app-atleta-lista-component',
  imports: [],
  templateUrl: './atleta-lista-component.html',
  styleUrl: './atleta-lista-component.css',
})
export class AtletaListComponent {

  //listaAtletas: Atleta[] = []
  listaAtletas = signal<Atleta[]>([]);

  constructor(
      private listaService: AtletaService,
      private router: Router,
      private cdr: ChangeDetectorRef
    ) { }

  ngOnInit(){
    this.listar()
  }
  
  listar() {
    this.listaService.listarAtletas()
    .subscribe({
      next: (dadosAtletas) => {
        //this.listaAtletas = [...dadosAtletas].sort((a, b) => a.nome.localeCompare(b.nome))
        this.listaAtletas.set([...dadosAtletas].sort((a, b) => a.nome.localeCompare(b.nome)))

        this.cdr.detectChanges()
        },
        error: (msgErro) => {
          console.log("Erro ao listar Atletas ", msgErro)
        }
      })

  }

  excluir(id: number) {
    if (confirm("Deseja Excluir o Atleta?")) {
      this.listaService.excluirAtleta(id)
        .subscribe({
          next: (resposta) => {
            console.log("Excluído com Sucesso!!! ", resposta)
            this.listar()
          },
          error: (msgErro) => {
            console.log("Erro ao listar Atletas ", msgErro)
          }
        })
    }
  }

  calcIdade(data_nascimento: string){
    return this.listaService.calcularIdade(data_nascimento)
  }

  carregaDadosAtletaForm(atleta: Atleta) {
    this.router.navigate(['/cadastroAtleta', atleta.id])
  }

}