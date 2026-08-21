// ============================================================
// MODEL: Inscricao
// ============================================================
// Esse "model" é só uma classe simples (igual Atleta.ts e Corrida.ts)
// que descreve quais informações uma INSCRIÇÃO precisa ter.
//
// Uma inscrição "liga" um Atleta (já cadastrado) a uma Corrida
// (já cadastrada), junto com as escolhas que o atleta faz no
// momento da inscrição: distância, tamanho da camiseta, categoria
// e o valor que ele vai pagar.
// ============================================================
export class Inscricao {

    id: number = 0

    // Dados do atleta que está se inscrevendo.
    // Guardamos o id (para relacionar com o cadastro do atleta) e
    // também o nome, só para facilitar a exibição em listas/telas
    // sem precisar buscar o atleta de novo na API.
    idAtleta: number = 0
    nomeAtleta: string = ''

    // Dados da corrida escolhida (mesma lógica do atleta acima).
    idCorrida: number = 0
    descricaoCorrida: string = ''

    // Distância que o atleta escolheu correr nessa prova.
    // Só pode ser uma das distâncias que a corrida oferece:
    // '5km' | '10km' | '25km'
    distancia: string = ''

    // Tamanho da camiseta do kit de corrida: PP, P, M, G, GG, XG
    tamanhoCamiseta: string = ''

    // Categoria / faixa etária em que o atleta vai competir.
    // Ex: "Geral Masculino / 30-39 anos"
    categoria: string = ''

    // Valor cobrado pela inscrição, calculado automaticamente
    // de acordo com a distância escolhida (ver tabela de preços
    // dentro do InscricaoComponent).
    valorInscricao: number = 0

    // Confirmação de que o atleta leu e aceitou o regulamento
    // da prova e a declaração de saúde (checkbox obrigatório).
    aceiteTermos: boolean = false
}
