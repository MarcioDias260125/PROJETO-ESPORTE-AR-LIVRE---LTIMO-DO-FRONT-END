import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscricao } from '../../models/Inscricao';

// ============================================================
// SERVICE: InscricaoService
// ============================================================
// Segue exatamente o mesmo padrão do AtletaService e do
// CorridaService: é uma classe "@Injectable" (pode ser injetada
// no construtor de qualquer componente) que usa o HttpClient do
// Angular para fazer requisições HTTP (GET, POST...) para a API.
// ============================================================
@Injectable({
  providedIn: 'root', // disponível para toda a aplicação, sem precisar declarar em nenhum módulo
})
export class InscricaoService {

  // O Angular injeta automaticamente uma instância do HttpClient aqui
  constructor(private http: HttpClient) { }

  // ------------------------------------------------------------
  // ATENÇÃO / IMPORTANTE:
  // O AtletaService e o CorridaService usam o mesmo projeto no
  // mockapi.io (https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/...)
  // com os recursos "atleta" e "corrida" já criados no painel do mockapi.
  //
  // Para as chamadas abaixo funcionarem de verdade, você precisa
  // entrar em https://mockapi.io, abrir esse mesmo projeto e criar
  // um NOVO recurso chamado "inscricao" (mesma ideia dos outros
  // dois), com os campos: idAtleta, nomeAtleta, idCorrida,
  // descricaoCorrida, distancia, tamanhoCamiseta, categoria,
  // valorInscricao, aceiteTermos.
  //
  // Enquanto esse recurso não existir, a chamada POST vai retornar
  // erro 404 (é só a API "de mentira" que ainda não tem essa rota).
  // ------------------------------------------------------------

  // ============================================================
  // salvarInscricao(inscricao)
  // ============================================================
  // CHAMADO POR:
  //   src/app/component/inscricao/inscricao-component/inscricao-component.ts
  //   -> dentro da função finalizarInscricao(), quando o usuário
  //      clica em "Finalizar e Ir para Pagamento".
  //
  // CONECTA COM:
  //   - src/app/models/Inscricao.ts (o tipo/formato do objeto
  //     que é recebido e enviado).
  //   - API externa (mockapi.io) — faz um HTTP POST de verdade,
  //     mandando o objeto "inscricao" como corpo da requisição.
  //
  // O QUE FAZ: envia a inscrição (atleta + corrida + distância +
  //   camiseta + categoria + valor) para ser salva na API. Devolve
  //   um Observable que o componente escuta (.subscribe) para
  //   saber se deu certo (next) ou errado (error).
  // ============================================================
  salvarInscricao(inscricao: Inscricao): Observable<Inscricao> {
    const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/inscricao`

    return this.http.post<Inscricao>(urlApi, inscricao)
  }

  // ============================================================
  // listarInscricoes()
  // ============================================================
  // CHAMADO POR: ninguém ainda — função pronta para uso futuro
  //   (por exemplo, se você criar uma tela "Minhas Inscrições" ou
  //   um relatório de inscritos por corrida).
  //
  // CONECTA COM:
  //   - src/app/models/Inscricao.ts (formato de cada item da lista).
  //   - API externa (mockapi.io) — faz um HTTP GET, trazendo
  //     todas as inscrições já salvas.
  // ============================================================
  listarInscricoes(): Observable<Inscricao[]> {
    const urlApi = `https://6a7f6d923183f5fd884b1a61.mockapi.io/esportearlivre/inscricao`

    return this.http.get<Inscricao[]>(urlApi)
  }
}
