# Apontamento de Escopo: Integração RSS
Conforme a solicitação do usuário em 04/03/2026, a programação do consumo vivo em APIs de provedores externos (ex: Notícias de Jornais Locais, endpoints RSS2JSON) **DEVE SER RETIRADA** desta etapa.

**Estratégia Adotada:**
1. A estrutura da Home (Eventos/Notícias) usará uma matriz Javascript constante (JSON MOCK).
2. O Design da parte das notícias servirá como "esqueleto" e será focado em tipografia, carregamento visual, preenchimento de imagem `alt` e comportamento interativo.
3. Não importar bibliotecas de fetch para o RSS, nem fazer requisições cross-origin até a ordem de implantação final por parte do usuário.
