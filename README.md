# Análise Histórica de Desempenho: Bahia vs Sport (1987-2022)

Este repositório contém uma análise comparativa de desempenho entre os clubes **Bahia** e **Sport Recife** entre os anos de **1987 e 2022**. O estudo considera diversas competições e conquistas dos dois clubes, com o objetivo de entender quem teve o melhor desempenho ano a ano e no acumulado.

> 📅 **Período analisado**: 1987 a 2022
> 🔗 **Nota**: 2022 foi o último ano antes da transformação do Bahia em SAF (Sociedade Anônima do Futebol).

## Critérios de Pontuação

A pontuação atribuída a cada clube em cada ano seguiu a seguinte lógica:

> 🧮 **Os pesos de pontuação foram definidos com auxílio do ChatGPT**, com o objetivo de garantir uma abordagem imparcial, balanceada e baseada em lógica competitiva, considerando o impacto esportivo de cada feito.

### 📌 Torneios de Liga (Pontos Corridos)
- **Campeão**: 120 pontos  
- **Vice**: 95  
- **3º**: 70  
- **4º**: 60  
- **Top 6**: 50  
- **Top 8**: 40  
- **Top 10**: 30  
- **Top 14**: 20  
- **Abaixo na tabela**: 10  
- **Rebaixado**: -200

*Para a Série B, todos os promovidos exceto o campeão ganham 70 pontos.*

### ⚔️ Torneios de Mata-Mata  
*(Copa do Brasil, Copa do Nordeste, Libertadores, etc.)*  
- **Campeão**: 120  
- **Vice**: 95  
- **Semi**: 65  
- **Quartas**: 40  
- **Oitavas**: 30  
- **Terceira fase**: 20  
- **Eliminado na 1ª ou 2ª fase**: 10

*Estadual só pontua na final e Copa do Nordeste a partir das Semis.*

### Pesos por competição

| Competição        | Peso |
| ----------------- | ---- |
| Estadual          | 1    |
| Copa do Nordeste  | 2    |
| Copa dos Campeões | 3    |
| Série C           | 0.5  |
| Série B           | 2    |
| Série A           | 5    |
| Copa do Brasil    | 4    |
| Sul-Americana     | 4    |
| Libertadores      | 7    |

## Objetivos do Projeto

* Visualizar e comparar o desempenho dos dois clubes ano a ano.
* Calcular um placar acumulado com base nos critérios estabelecidos.
* Identificar padrões, evoluções ou declínios ao longo do tempo.
* Oferecer uma base objetiva para debates entre torcedores e entusiastas do futebol nordestino.
* O principal objetivo do projeto foi para ganhar uma discussão.

## Como Executar

Você pode acessar ao [site](https://rober122pst.github.io/bahia-vs-sport-da/site/) ou seguir os passos a seguir:

1. Clone este repositório:

   ```bash
   git clone https://github.com/rober122pst/bahia-vs-sport-da.git
   ```
2. Abra o notebook `SportVsBahia.ipynb` em seu ambiente Jupyter preferido.
3. Execute as células para gerar as visualizações e placares.

## Requisitos

* Python 3.x
* Bibliotecas utilizadas:

  * pandas
  * matplotlib / seaborn (para gráficos)
  * jGoogle Colab (ou jupyter)

## Fontes de Dados

As informações sobre os desempenhos dos clubes foram obtidas a partir das seguintes fontes:
* [ogol.com.br](https://www.ogol.com.br/)
* [ge.globo.com](https://ge.globo.com/)
* [pt.wikipedia.org](https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal)

## Observações Finais

Este projeto é uma análise quantitativa com base em critérios definidos previamente. Apesar de haver um certo grau de subjetividade na escolha dos pesos de pontuação, o objetivo é fomentar uma discussão saudável e divertida sobre os maiores clubes do Nordeste. Dito isso, Sport Recife maior clube do nordeste.

