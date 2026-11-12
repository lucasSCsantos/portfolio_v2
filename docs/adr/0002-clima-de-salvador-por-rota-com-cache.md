# Clima de Salvador por route handler com cache compartilhado

O modo `ao vivo` da Cena precisa do clima e do mar de Salvador. Os dados vêm da Open-Meteo (Forecast e Marine API, sem chave), mas o navegador nunca as chama: ele pede a `GET /api/cena`, uma route handler que busca as duas, normaliza e devolve só o que a Cena usa (nascer e pôr do sol, nuvens, chuva, vento, altura da onda).

Decisões difíceis de reverter, e o porquê:

- **Rota própria, não chamada direta do cliente.** O cache de 20 min é compartilhado por todos os visitantes, a carga na Open-Meteo cai a poucas chamadas por hora (importante porque IPs de hospedagem compartilham limite) e o formato da fonte fica escondido atrás do nosso contrato. Trocar de fonte muda a rota, não o front.
- **Só é chamada no modo `ao vivo`.** `dia` e `noite` nunca pedem nada.
- **Falha não derruba a Cena.** Se qualquer API falhar, a rota responde erro com cache curto (1 min); o céu continua pela hora, sem nuvens nem chuva e com ondas calmas. `waveHeight` pode vir `null` (ponto costeiro): usa-se só o vento.
- **Licença aceita como risco.** O plano gratuito é só para uso não comercial e um portfólio que divulga serviços fica numa zona cinzenta. Aceitamos (site pessoal, sem anúncios nem assinatura, tráfego muito abaixo dos limites) e damos atribuição CC BY 4.0 no Rodapé enquanto o seletor existir. Se isso mudar, o plano pago ou outra fonte entram só na rota.
