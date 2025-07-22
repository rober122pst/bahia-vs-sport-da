# Análise Histórica de Desempenho: Bahia vs Sport (1987-2022)

Este repositório contém uma análise comparativa de desempenho entre os clubes **Bahia** e **Sport Recife** entre os anos de **1987 e 2022**. O estudo considera diversas competições e conquistas dos dois clubes, com o objetivo de entender quem teve o melhor desempenho ano a ano e no acumulado.

> 📅 **Período analisado**: 1987 a 2022
> 🔗 **Nota**: 2022 foi o último ano antes da transformação do Bahia em SAF (Sociedade Anônima do Futebol).

## Critérios de Pontuação

A pontuação atribuída a cada clube em cada ano seguiu a seguinte lógica:

> 🧮 **Os pesos de pontuação foram definidos com auxílio do ChatGPT**, com o objetivo de garantir uma abordagem imparcial, balanceada e baseada em lógica competitiva, considerando o impacto esportivo de cada feito.

### Competições Nacionais

* **Título Nacional (Série A ou Copa do Brasil)**: +10 pontos
* **Vice Nacional**: +8 pontos
* **Top 4 Nacional**: +6 pontos
* **Top 10 da Série A**: +5 pontos
* **Participar da Série A**: +2 pontos
* **Acesso (subiu de divisão)**: +4 pontos
* **Rebaixamento**: -4 pontos
* **Rebaixamento na Série B**: -6 pontos

### Competições Regionais

* **Título da Copa do Nordeste**: +4 pontos
* **Vice da Copa do Nordeste**: +3 pontos
* **Semifinal da Copa do Nordeste**: +2 pontos
* **Título Estadual**: +3 pontos
* **Vice Estadual**: +1 ponto

### Competições Internacionais

* **Participou da Libertadores**: +3 pontos

* **Chegou às Oitavas**: +5 pontos

* **Chegou às Quartas**: +6 pontos

* **Participou da Sul-Americana**: +1 ponto

* **Chegou às Oitavas da Sula**: +2 pontos

* **Chegou às Quartas da Sula**: +3 pontos

### Bonificações Especiais

* **Campanha superior no Brasileirão (mesma divisão)**: +2 pontos  *(Não cumulativa com Top 10, Top 4, Vice ou Título, mas cumulativa com participação)*
* **Campanha próxima, mas superior no Brasileirão (mesma divisão)**: +1 ponto
* **Campanha superior na Copa do Brasil**: +1 ponto

## Objetivos do Projeto

* Visualizar e comparar o desempenho dos dois clubes ano a ano.
* Calcular um placar acumulado com base nos critérios estabelecidos.
* Identificar padrões, evoluções ou declínios ao longo do tempo.
* Oferecer uma base objetiva para debates entre torcedores e entusiastas do futebol nordestino.

## Estrutura do Repositório

* `SportVsBahia.ipynb`: Notebook principal contendo toda a lógica de cálculo, análise e visualizações dos dados.
* `SportVSBahia.py`: Mesma coisa que o notebook, porém em .py para quem preferir.
* `sportVSbahia.yaml`: Arquivo com todas as temporadas de 1987 a 2022, contendo:

  * Pontuação total de cada clube no ano
  * Pontuação separada por competição
  * Breve comentário explicando a justificativa da pontuação
* `README.md`: Este arquivo de explicação geral do projeto.

## Como Executar

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/SportVsBahia.git
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
