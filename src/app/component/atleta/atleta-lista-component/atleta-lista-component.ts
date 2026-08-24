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
export class AtletaListaComponent {

  //DECLARAÇÃO ARRAY DO TIPO PESSOA
  //listaAtletas: Atleta[] = []
  listaAtletas = signal<Atleta[]>([])

  //DECLARAÇÃO CONSTRUTOR
  constructor(private router: Router, private http: AtletaService) { }

  //EXECUTAR INSTRUÇÕES AO CARREGAR CRIAR O COMPONENTE
  ngOnInit() {
    this.listarAtletas()
  }

  //LISTAR OS ATLETAS
  listarAtletas() {
    this.http.listarAtletas()
      .subscribe({
        next: (dados) => {
          //this.listaAtletas = [...dados].sort((a, b) => a.nome.localeCompare(b.nome))
          this.listaAtletas.set([...dados].sort((a, b) => a.nome.localeCompare(b.nome)))
        },
        error: (msgErro) => {
          console.log("Erro ao cadastrar  o atleta ", msgErro)
        }

      })

  }

  //Calculadora feita para ter a idade exata do Atleta conforme a data que ele escolher no Calendário, tudo de maneira automática.

  calcularIdade(dataNs: string): number | string {
    // O "if" é a verificação de Segurança - se a data de nasciment estiver vazia,
    // a funçõa não vai executar o cálculo.
    if (!dataNs) return '-' 

    // Convertendo a string para data:
    // O dataNs chega no formato yyyy-mm-dd, e o "new Date()"
    // transforma em um objeto de daa que o Js consegue entender.

    const nascimento = new Date (dataNs)
    const hoje = new Date() //a data considerada é a nativa do dispositivo onde está sendo executado.


    // O let idade faz o cálculo inicial (aproximado)
    let idade = hoje.getFullYear () - nascimento.getFullYear() 

    // Nesta etapa é feita a verificação da data
    const mes = hoje.getMonth() - nascimento.getMonth()

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade --
    }

    return idade

    // O ideal é colocar essa Lógica no service. Esse comando roda em qualquer TypeS.,
    //Porém, por conta da semântica e organização, é melhor no service.
  }

  //EXCLUIR ATLETA
  excluirAtleta(atleta: Atleta){
    if(confirm(`Deseja excluir ${atleta.nome} da competição? `)){
      this.http.exluirAtleta(atleta)
      .subscribe({
        next:(dados)=>{
           this.listaAtletas.update(elem =>
            elem.filter(a => a.id !== atleta.id)
          );
          
          console.log('Atleta excluído com Sucesso ', dados)
        },
        error: (msgErro) => {
          console.log("Erro ao Excluir  o atleta ", msgErro)
        }
      })

    }
    
    this.ngOnInit()
  }

  //ALTERAR DADOS
  buscarPessoa(idAtleta: Atleta){
    this.router.navigate(['/cadastroatleta', idAtleta])
  }

  
}//FIM COMPONENT AtletaListaComponent
