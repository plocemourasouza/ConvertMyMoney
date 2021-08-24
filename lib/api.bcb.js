const axios = require('axios')

const getUrl = date =>
  `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${date}'&$top=100&$format=json&$select=cotacaoCompra`

const getCotacaoAPI = url => axios.get(url)
const extractCotacao = res => res.data.value[0].cotacaoCompra

const getToday = () => {
  const today = new Date()

  //Para atender o padrão da API do BCB deve-se realizar os seguintes tratamentos.
  const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate()
  const mon = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1
  const year = today.getFullYear()

  const dataHoje = mon + '-' + day + '-' + year

  return dataHoje
}

const getCotacao =
  ({ getToday, getUrl, getCotacaoAPI, extractCotacao }) =>
  async () => {
    try {
      const today = getToday()
      const url = getUrl(today)
      const res = await getCotacaoAPI(url)
      const cotacao = extractCotacao(res)
      return cotacao
    } catch (err) {
      return ''
    }
  }

module.exports = {
  getCotacaoAPI,
  getCotacao: getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao }),
  extractCotacao,
  getUrl,
  getToday,
  pure: {
    getCotacao
  }
}
