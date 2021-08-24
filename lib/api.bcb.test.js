const apiBCB = require('./api.bcb')
const axios = require('axios')

jest.mock('axios')

test('getCotacaoAPI', () => {
  const res = {
    data: {
      value: [{ cotacaoVenda: 3.9 }]
    }
  }
  axios.get.mockResolvedValue(res)
  apiBCB.getCotacaoAPI('url').then(resp => {
    expect(resp).toEqual(res)
    expect(axios.get.mock.calls[0][0]).toBe('url')
  })
})

test('extractCotacao', () => {
  const cotacao = apiBCB.extractCotacao({
    data: {
      value: [{ cotacaoCompra: 3.9 }]
    }
  })
  expect(cotacao).toBe(3.9)
})

describe('getToday', () => {
  const RealDate = Date

  function mockDate(date) {
    global.Date = class extends RealDate {
      constructor() {
        return new RealDate(date)
      }
    }
  }

  afterEach(() => {
    global.date = RealDate
  })

  test('getToday', () => {
    mockDate('2019-01-01T12:00:00z')
    const today = apiBCB.getToday()
    expect(today).toBe('01-01-2019')
  })
})

test('getURL', () => {
  const url = apiBCB.getUrl('MINHA-DATA')
  expect(url).toBe(
    "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='MINHA-DATA'&$top=100&$format=json&$select=cotacaoCompra"
  )
})

test('getCotacao', () => {
  const res = {
    data: {
      value: [{ cotacaoVenda: 3.9 }]
    }
  }

  const getToday = jest.fn()
  getToday.mockReturnValue('01-01-2019')

  const getUrl = jest.fn()
  getUrl.mockReturnValue('url')

  const getCotacaoAPI = jest.fn()
  getCotacaoAPI.mockResolvedValue(res)

  const extractCotacao = jest.fn()
  extractCotacao.mockReturnValue(3.9)

  apiBCB.pure
    .getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao })()
    .then(res => {
      expect(res).toBe(3.9)
    })
})

test('getCotacao', () => {
  const res = {}

  const getToday = jest.fn()
  getToday.mockReturnValue('01-01-2019')

  const getUrl = jest.fn()
  getUrl.mockReturnValue('url')

  const getCotacaoAPI = jest.fn()
  getCotacaoAPI.mockReturnValue(Promise.reject('err'))

  const extractCotacao = jest.fn()
  extractCotacao.mockReturnValue(3.9)

  apiBCB.pure
    .getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao })()
    .then(res => {
      expect(res).toBe('')
    })
})