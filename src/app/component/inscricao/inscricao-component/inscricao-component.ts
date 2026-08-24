import { Component, ChangeDetectorRef, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


// ARQUIVOS COM QUEM ESTE COMPONENTE SE CONECTA

// SERVICES (fazem as chamadas HTTP para a API):
import { AtletaService } from '../../../service/atleta-service';
// -> src/app/service/atleta-service.ts
//    Usado aqui só para BUSCAR (GET) os atletas já cadastrados
//    e popular o <select> "Atleta Cadastrado".

import { CorridaService } from '../../../service/corrida/corrida-service';
// -> src/app/service/corrida/corrida-service.ts
//    Usado aqui só para BUSCAR (GET) as corridas já cadastradas
//    e popular o <select> "Corrida Escolhida".

import { InscricaoService } from '../../../service/inscricao/inscricao-service';
// -> src/app/service/inscricao/inscricao-service.ts
//    Usado para SALVAR (POST) a inscrição quando o usuário clica
//    em "Finalizar e Ir para Pagamento".

// MODELS (moldes/tipos dos dados, sem lógica nenhuma):
import { Atleta } from '../../../models/Atleta';
// -> src/app/models/Atleta.ts (já existia no projeto)

import { Corrida } from '../../../models/Corrida';
// -> src/app/models/Corrida.ts (já existia no projeto)

import { Inscricao } from '../../../models/Inscricao';
// -> src/app/models/Inscricao.ts (novo, criado junto com esta tela)

// ============================================================
// COMPONENTE: InscricaoComponent
// ============================================================
// Esse componente monta a tela "Inscrição na Corrida" (o mesmo
// layout do print que você me mandou). Ele:
//
//  1) Ao abrir a tela, busca na API a lista de atletas e a lista
//     de corridas já cadastradas (reaproveitando o AtletaService
//     e o CorridaService que você já tinha).
//
//  2) Deixa o usuário escolher um atleta de duas formas: pelo
//     <select> "Atleta Cadastrado" OU digitando o CPF no campo
//     "Ou Buscar por CPF" (os dois campos ficam sincronizados).
//
//  3) Deixa o usuário escolher a corrida. Assim que a corrida é
//     escolhida, os "rádios" de distância (5km/10km/25km) são
//     habilitados/desabilitados de acordo com o que aquela
//     corrida realmente oferece (campos distancia5km,
//     distancia10km, distancia25km do model Corrida).
//
//  4) Calcula o valor da inscrição automaticamente, de acordo
//     com a distância escolhida (tabela de preços fixa aqui no
//     componente).
//
//  5) Só libera o botão "Finalizar e Ir para Pagamento" quando
//     todos os campos obrigatórios estiverem preenchidos e o
//     usuário tiver marcado o aceite do regulamento.
//
//  6) Ao confirmar, monta um objeto Inscricao e envia para a API
//     através do InscricaoService.
// ============================================================
@Component({
  selector: 'app-inscricao-component',
  imports: [FormsModule], // precisamos do FormsModule por causa do [(ngModel)]
  templateUrl: './inscricao-component.html',
  styleUrl: './inscricao-component.css',
})
export class InscricaoComponent {

  // --------------------------------------------------------
  // LISTAS vindas da API, usadas para popular os <select>.
  // Usamos "signal" (mesmo padrão do AtletaListaComponent e do
  // CorridaListaComponent) para o Angular atualizar a tela
  // automaticamente quando os dados chegam.
  // --------------------------------------------------------
  listaAtletas = signal<Atleta[]>([])
  listaCorridas = signal<Corrida[]>([])

  // --------------------------------------------------------
  // CAMPOS DO FORMULÁRIO
  // Cada um desses atributos está "amarrado" a um campo do HTML
  // através do [(ngModel)]. Ou seja: quando o usuário digita ou
  // seleciona algo na tela, o valor aqui muda sozinho (e
  // vice-versa).
  // --------------------------------------------------------
  idAtletaSelecionado = 0        // id escolhido no <select> de atletas (0 = nenhum)
  cpfBusca = ''                  // texto digitado no campo "Ou Buscar por CPF"
  idCorridaSelecionada = 0       // id escolhido no <select> de corridas (0 = nenhuma)
  distanciaEscolhida = ''        // '5km' | '10km' | '25km'
  tamanhoCamiseta = ''           // PP, P, M, G, GG, XG
  categoriaEscolhida = ''        // Ex: "Geral Masculino / 30-39 anos"
  aceiteTermos = false           // checkbox "Li e aceito os termos..."

  // --------------------------------------------------------
  // Guardamos aqui o OBJETO COMPLETO do atleta e da corrida
  // selecionados (não só o id), porque vamos precisar do nome,
  // sexo, descrição, distâncias disponíveis, etc. em vários
  // lugares da tela (ex: montar as opções de categoria, saber
  // quais distâncias habilitar).
  // --------------------------------------------------------
  atletaSelecionado: Atleta | null = null
  corridaSelecionada: Corrida | null = null

  // --------------------------------------------------------
  // TABELA DE PREÇOS por distância.
  // Hoje está "fixa" aqui no componente; no futuro isso poderia
  // vir da própria Corrida cadastrada na API.
  // --------------------------------------------------------
  tabelaPrecos: { [distancia: string]: number } = {
    '5km': 49.90,
    '10km': 69.90,
    '25km': 89.90
  }

  // Injetamos os dois serviços que já existiam (atleta e corrida)
  // e o novo serviço de inscrição, além do Router (para poder
  // redirecionar o usuário depois de confirmar) e do
  // ChangeDetectorRef (mesmo recurso usado no AtletaComponent
  // para forçar a tela a se atualizar após uma resposta da API).
  constructor(
    private atletaService: AtletaService,
    private corridaService: CorridaService,
    private inscricaoService: InscricaoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  // ============================================================
  // ngOnInit()
  // ============================================================
  // O Angular chama esse método SOZINHO, automaticamente, assim
  // que a tela de Inscrição é aberta pela primeira vez (é um
  // "ciclo de vida" padrão de todo componente Angular).
  // Aqui a gente só dispara as duas buscas iniciais.
  // Não se conecta direto com nenhum arquivo — só chama os dois
  // métodos abaixo (carregarAtletas e carregarCorridas).
  // ============================================================
  ngOnInit() {
    this.carregarAtletas()
    this.carregarCorridas()
  }

  // ============================================================
  // carregarAtletas()
  // ============================================================
  // CONECTA COM: src/app/service/atleta-service.ts
  //   -> chama atletaService.listarAtletas(), que faz um GET na
  //      API do mockapi.io e devolve a lista de atletas.
  //
  // O QUE FAZ:
  //   1. Pede a lista de atletas pro AtletaService.
  //   2. Quando a resposta chega ("next"), ordena por nome e
  //      guarda no signal listaAtletas (usado no HTML pra montar
  //      as <option> do <select> "Atleta Cadastrado").
  //   3. this.cdr.detectChanges() força o Angular a repintar a
  //      tela na hora (mesmo padrão já usado no AtletaComponent).
  //   4. Se der erro (API fora do ar, sem internet, etc.), só
  //      registra no console — não trava a tela.
  // ============================================================
  carregarAtletas() {
    this.atletaService.listarAtletas()
      .subscribe({
        next: (dados) => {
          // ordena por nome, igual já era feito na lista de atletas
          this.listaAtletas.set([...dados].sort((a, b) => a.nome.localeCompare(b.nome)))
          this.cdr.detectChanges()
        },
        error: (msgErro) => {
          console.log('Erro ao carregar a lista de atletas ', msgErro)
        }
      })
  }

  // ============================================================
  // carregarCorridas()
  // ============================================================
  // CONECTA COM: src/app/service/corrida/corrida-service.ts
  //   -> chama corridaService.listarCorridas(), que faz um GET
  //      na API do mockapi.io e devolve a lista de corridas.
  //
  // O QUE FAZ: mesma ideia de carregarAtletas() acima, mas para
  // preencher o <select> "Corrida Escolhida".
  // ============================================================
  carregarCorridas() {
    this.corridaService.listarCorridas()
      .subscribe({
        next: (dados) => {
          this.listaCorridas.set([...dados])
          this.cdr.detectChanges()
        },
        error: (msgErro) => {
          console.log('Erro ao carregar a lista de corridas ', msgErro)
        }
      })
  }

  // ============================================================
  // selecionarAtletaPeloSelect()
  // ============================================================
  // CHAMADO POR: inscricao-component.html
  //   -> evento (change) do <select id="atleta">.
  //
  // CONECTA COM: nenhum arquivo novo — só usa a lista que
  //   carregarAtletas() já trouxe do AtletaService e guardou no
  //   signal listaAtletas.
  //
  // O QUE FAZ:
  //   1. Pega o id que o usuário escolheu no <select>
  //      (idAtletaSelecionado) e procura o atleta correspondente
  //      dentro da lista já carregada.
  //   2. Guarda o objeto inteiro em atletaSelecionado (vamos
  //      precisar do nome e do sexo dele mais na frente).
  //   3. Preenche o campo "Ou Buscar por CPF" sozinho, para os
  //      dois campos ficarem sincronizados.
  //   4. Zera a categoria escolhida antes, pois ela depende do
  //      sexo do atleta (que pode ter mudado).
  // ============================================================
  selecionarAtletaPeloSelect() {
    // Comparamos como TEXTO (String(...)) dos dois lados, e não como
    // número. Isso porque a API (mockapi.io) pode devolver o "id" ora
    // como número, ora como texto, dependendo de como o recurso foi
    // configurado no painel do mockapi. Se comparássemos com === direto
    // (ex: atleta.id === Number(idSelecionado)), um "3" (texto) nunca
    // seria igual a 3 (número) e o atleta nunca seria encontrado.
    const encontrado = this.listaAtletas()
      .find(atleta => String(atleta.id) === String(this.idAtletaSelecionado))

    this.atletaSelecionado = encontrado ?? null
    this.cpfBusca = encontrado ? String(encontrado.cpf) : ''

    // como o atleta mudou, a categoria selecionada anteriormente
    // (que depende do sexo do atleta) não faz mais sentido
    this.categoriaEscolhida = ''
  }

  // ============================================================
  // buscarAtletaPorCpf()
  // ============================================================
  // CHAMADO POR: inscricao-component.html
  //   -> evento (input) do <input id="cpf"> (dispara a cada
  //      tecla digitada).
  //
  // CONECTA COM: nenhum arquivo novo — também usa a lista que já
  //   está em memória (listaAtletas), vinda do AtletaService.
  //   Não faz uma nova chamada à API a cada letra digitada (isso
  //   seria lento); só filtra o que já foi carregado.
  //
  // O QUE FAZ:
  //   1. Limpa o CPF digitado, deixando só os números
  //      (replace(/\D/g, '') remove pontos e traços).
  //   2. Se o campo estiver vazio, desmarca o atleta selecionado.
  //   3. Procura, na lista já carregada, um atleta cujo CPF
  //      (também sem pontuação) seja igual ao digitado.
  //   4. Se achar, seleciona esse atleta automaticamente — como
  //      se o usuário tivesse escolhido pelo <select> "Atleta
  //      Cadastrado".
  // ============================================================
  buscarAtletaPorCpf() {
    const cpfDigitado = this.cpfBusca.replace(/\D/g, '') // remove tudo que não é número

    if (!cpfDigitado) {
      this.atletaSelecionado = null
      this.idAtletaSelecionado = 0
      return
    }

    const encontrado = this.listaAtletas()
      .find(atleta => String(atleta.cpf).replace(/\D/g, '') === cpfDigitado)

    if (encontrado) {
      this.atletaSelecionado = encontrado
      this.idAtletaSelecionado = encontrado.id
      this.categoriaEscolhida = ''
    } else {
      this.atletaSelecionado = null
      this.idAtletaSelecionado = 0
    }
  }

  // ============================================================
  // selecionarCorrida()
  // ============================================================
  // CHAMADO POR: inscricao-component.html
  //   -> evento (change) do <select id="corrida">.
  //
  // CONECTA COM: nenhum arquivo novo — usa a lista já carregada
  //   por carregarCorridas() (originada do CorridaService).
  //
  // O QUE FAZ:
  //   1. Localiza, na lista já carregada, a corrida cujo id bate
  //      com o que foi escolhido no <select>.
  //   2. Guarda o objeto Corrida inteiro em corridaSelecionada
  //      (precisamos dos campos distancia5km/10km/25km dele).
  //   3. Zera a distância escolhida anteriormente, porque a nova
  //      corrida pode não oferecer aquela mesma distância.
  // ============================================================
  selecionarCorrida() {
    // MESMA CORREÇÃO explicada em selecionarAtletaPeloSelect() acima:
    // comparar como String dos dois lados, e não com === Number(...).
    // Este era exatamente o bug que fazia os rádios de distância
    // ficarem sempre desabilitados: como a comparação nunca batia,
    // corridaSelecionada ficava null, e distanciaDisponivel() sempre
    // retornava false pras três distâncias.
    const encontrada = this.listaCorridas()
      .find(corrida => String(corrida.id) === String(this.idCorridaSelecionada))

    this.corridaSelecionada = encontrada ?? null
    this.distanciaEscolhida = '' // reseta, pois a corrida mudou
  }

  // ============================================================
  // distanciaDisponivel(distancia)
  // ============================================================
  // CHAMADO POR: inscricao-component.html
  //   -> [disabled]="!distanciaDisponivel('5km')" (e o mesmo para
  //      '10km' e '25km') em cada <input type="radio">.
  //
  // CONECTA COM: src/app/models/Corrida.ts
  //   -> lê os campos booleanos distancia5km, distancia10km e
  //      distancia25km do objeto corridaSelecionada (que já
  //      existiam no model Corrida, usados na tela de cadastro
  //      de corrida).
  //
  // O QUE FAZ: devolve true/false dizendo se a corrida
  //   selecionada oferece aquela distância específica. Se nenhuma
  //   corrida foi escolhida ainda, devolve false pra tudo (todos
  //   os rádios ficam desabilitados).
  // ============================================================
  distanciaDisponivel(distancia: string): boolean {
    if (!this.corridaSelecionada) return false

    if (distancia === '5km') return this.corridaSelecionada.distancia5km
    if (distancia === '10km') return this.corridaSelecionada.distancia10km
    if (distancia === '25km') return this.corridaSelecionada.distancia25km

    return false
  }

  // ============================================================
  // get valorInscricao()  [GETTER]
  // ============================================================
  // USADO POR: inscricao-component.html
  //   -> {{ valorInscricao.toFixed(2)... }} na caixa "Valor da
  //      Inscrição" e também dentro deste mesmo arquivo, na
  //      função finalizarInscricao() (pra montar o objeto
  //      Inscricao antes de enviar pro InscricaoService).
  //
  // CONECTA COM: nenhum arquivo externo — só lê o atributo
  //   tabelaPrecos declarado aqui em cima, neste componente.
  //
  // O QUE FAZ: um "getter" se comporta como uma propriedade
  //   comum no HTML (não precisa escrever "()"), mas na verdade
  //   roda esse código toda vez que é lido. Aqui, ele devolve o
  //   preço da distância atualmente escolhida (ou 0, se nenhuma
  //   distância foi marcada ainda). Assim o valor na tela sempre
  //   se atualiza sozinho quando o usuário troca de distância.
  // ============================================================
  get valorInscricao(): number {
    return this.distanciaEscolhida ? this.tabelaPrecos[this.distanciaEscolhida] : 0
  }

  // ============================================================
  // get opcoesCategoria()  [GETTER]
  // ============================================================
  // USADO POR: inscricao-component.html
  //   -> @for (opcao of opcoesCategoria; ...) dentro do
  //      <select id="categoria">, para montar as <option>.
  //
  // CONECTA COM: src/app/models/Atleta.ts
  //   -> lê o campo "sexo" do objeto atletaSelecionado (que veio
  //      do AtletaService lá em carregarAtletas()).
  //
  // O QUE FAZ: monta a lista de opções de categoria/faixa etária
  //   de acordo com o sexo do atleta escolhido (Masculino,
  //   Feminino ou Livre). Se ainda não tem atleta selecionado,
  //   devolve uma lista vazia — e o HTML usa isso para manter o
  //   <select> de categoria desabilitado até um atleta ser
  //   escolhido.
  // ============================================================
  get opcoesCategoria(): string[] {
    if (!this.atletaSelecionado) return []

    const genero = this.atletaSelecionado.sexo === 'M'
      ? 'Masculino'
      : this.atletaSelecionado.sexo === 'F'
        ? 'Feminino'
        : 'Livre'

    return [
      `Geral ${genero} / 18-29 anos`,
      `Geral ${genero} / 30-39 anos`,
      `Geral ${genero} / 40-49 anos`,
      `Geral ${genero} / 50+ anos`
    ]
  }

  // ============================================================
  // formularioValido()
  // ============================================================
  // USADO POR: inscricao-component.html
  //   -> [disabled]="!formularioValido()" no <button id="btnFinalizar">
  //   TAMBÉM USADO POR: este mesmo arquivo, dentro de
  //   finalizarInscricao(), como segunda checagem de segurança.
  //
  // CONECTA COM: nenhum arquivo externo — só lê os campos do
  //   próprio formulário (os atributos deste componente).
  //
  // O QUE FAZ: devolve true somente se TODOS os campos
  //   obrigatórios estiverem preenchidos (atleta, corrida,
  //   distância, camiseta, categoria) E o checkbox de aceite do
  //   regulamento estiver marcado. Enquanto for false, o botão
  //   de finalizar fica desabilitado na tela.
  // ============================================================
  formularioValido(): boolean {
    return this.idAtletaSelecionado > 0 &&
      this.idCorridaSelecionada > 0 &&
      this.distanciaEscolhida !== '' &&
      this.tamanhoCamiseta !== '' &&
      this.categoriaEscolhida !== '' &&
      this.aceiteTermos === true
  }

  // ============================================================
  // finalizarInscricao()
  // ============================================================
  // CHAMADO POR: inscricao-component.html
  //   -> (ngSubmit) do <form id="form-inscricao">, disparado ao
  //      clicar no botão "Finalizar e Ir para Pagamento".
  //
  // CONECTA COM:
  //   - src/app/models/Inscricao.ts
  //       -> cria um "new Inscricao()" e preenche cada campo dele.
  //   - src/app/service/inscricao/inscricao-service.ts
  //       -> chama inscricaoService.salvarInscricao(novaInscricao),
  //          que faz o POST de verdade para a API (mockapi.io).
  //
  // O QUE FAZ:
  //   1. Confere de novo se o formulário está válido (nunca confie
  //      só no [disabled] do botão no HTML).
  //   2. Monta um objeto Inscricao novo, copiando os dados do
  //      atleta/corrida selecionados e das escolhas do usuário.
  //   3. Envia esse objeto para a API através do InscricaoService.
  //   4. Se der certo ("next"): mostra um alerta de confirmação
  //      e limpa o formulário (chamando limparFormulario()).
  //   5. Se der erro ("error"): mostra um alerta avisando que não
  //      foi possível concluir.
  // ============================================================
  finalizarInscricao() {
    // trava de segurança: mesmo com o botão desabilitado no HTML,
    // validamos de novo aqui dentro (nunca confie só na tela)
    if (!this.formularioValido() || !this.atletaSelecionado || !this.corridaSelecionada) {
      alert('Preencha todos os campos e aceite o regulamento antes de continuar.')
      return
    }

    const novaInscricao = new Inscricao()
    novaInscricao.idAtleta = this.atletaSelecionado.id
    novaInscricao.nomeAtleta = this.atletaSelecionado.nome
    novaInscricao.idCorrida = this.corridaSelecionada.id
    novaInscricao.descricaoCorrida = this.corridaSelecionada.descricao_corrida
    novaInscricao.distancia = this.distanciaEscolhida
    novaInscricao.tamanhoCamiseta = this.tamanhoCamiseta
    novaInscricao.categoria = this.categoriaEscolhida
    novaInscricao.valorInscricao = this.valorInscricao
    novaInscricao.aceiteTermos = this.aceiteTermos

    this.inscricaoService.salvarInscricao(novaInscricao)
      .subscribe({
        next: (resposta) => {
          console.log('Inscrição salva com sucesso ', resposta)

          alert(
            `Inscrição confirmada para ${novaInscricao.nomeAtleta}!\n` +
            `Corrida: ${novaInscricao.descricaoCorrida} (${novaInscricao.distancia})\n` +
            `Valor: R$ ${novaInscricao.valorInscricao.toFixed(2).replace('.', ',')}\n\n` +
            `Redirecionando para o pagamento...`
          )

          this.limparFormulario()

          // aqui é onde, futuramente, entraria o redirecionamento
          // de verdade para a tela/gateway de pagamento, ex:
          // this.router.navigate(['/pagamento', resposta.id])
        },
        error: (msgErro) => {
          console.log('Erro ao salvar a inscrição ', msgErro)
          alert('Não foi possível concluir a inscrição. Tente novamente em instantes.')
        }
      })
  }

  // ============================================================
  // limparFormulario()
  // ============================================================
  // CHAMADO POR: este mesmo arquivo, dentro de
  //   finalizarInscricao(), logo após o POST dar certo.
  //
  // CONECTA COM: nenhum arquivo externo — só reseta os atributos
  //   deste próprio componente para os valores iniciais.
  //
  // O QUE FAZ: zera todos os campos do formulário (atleta,
  //   corrida, distância, camiseta, categoria, checkbox) para
  //   deixar a tela pronta para uma nova inscrição, sem precisar
  //   recarregar a página.
  // ============================================================
  limparFormulario() {
    this.idAtletaSelecionado = 0
    this.cpfBusca = ''
    this.idCorridaSelecionada = 0
    this.distanciaEscolhida = ''
    this.tamanhoCamiseta = ''
    this.categoriaEscolhida = ''
    this.aceiteTermos = false
    this.atletaSelecionado = null
    this.corridaSelecionada = null
  }
}
