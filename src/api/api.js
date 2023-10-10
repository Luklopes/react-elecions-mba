import axiosModule from 'axios'

const axios = axiosModule.create({ baseURL: 'http://localhost:3046' })

let CACHE_CITIES = []
let CACHE_CANDIDATES = []
let CACHE_YEAR = []
const CACHE_ELECTIONS = {}

async function _apiGetCandidates() {
  const { data: candidates } = await axios.get('/candidates')
  return candidates
}

async function apiGetCities() {
  const { data: cities } = await axios.get('/cities')
  return cities.sort((a, b) => a.name.localeCompare(b.name))
}

async function apiGetYear() {
  const { data: year } = await axios.get('/year')
  console.log("year", year)
  return year
}

async function apiGetElection(cityId) {
  // const allCities = await apiGetCities()
  // const allCandidates = await _apiGetCandidates()
  let allCities = []
  let allCandidates = []
  let allYears= []

  if (CACHE_CITIES.length > 0) {
    console.log('Obtendo cities do cache')
    allCities = CACHE_CITIES
  } else {
    console.log('Obtendo cities do backend')
    allCities = await apiGetCities()
    CACHE_CITIES = allCities
  }

  if (CACHE_CANDIDATES.length > 0) {
    console.log('Obtendo candidates do cache')
    allCandidates = CACHE_CANDIDATES
  } else {
    console.log('Obtendo candidates do backend')
    allCandidates = await _apiGetCandidates()
    CACHE_CANDIDATES = allCandidates
  }
  if (CACHE_YEAR.length > 0) {
    console.log('Obtendo candidates do cache')
    allYears = CACHE_CANDIDATES
  } else {
    console.log('Obtendo years do backend')
    allYears = await apiGetYear()
    CACHE_CANDIDATES = allYears
  }

  // const [allCities, allCandidates] = await Promise.all([
  //   apiGetCities(),
  //   _apiGetCandidates(),
  // ])

  if (CACHE_ELECTIONS[cityId]) {
    return CACHE_ELECTIONS[cityId]
  }

  const currentCity = allCities.find(city => city.id === cityId)

  const { data: election } = await axios.get(`/election?cityId=${cityId}`)

  const preData = {
    city: currentCity,
    election: [...election.sort((a, b) => b.votes - a.votes)].map(
      electionItem => {
        const currentCandidate = allCandidates.find(
          candidate => candidate.id === electionItem.candidateId
        )
        return { ...electionItem, candidate: currentCandidate }
      }
    ),
  }

  const finalData = {
    city: { ...preData.city },

    election: preData.election.map((electionItem, index) => {
      const { id, votes, candidate } = electionItem
      const { name, username } = candidate
      const percent = (votes / preData.city.presence) * 100
      const elected = index === 0

      return {
        id,
        votes,
        percent,
        elected,
        candidate: { name, username },
      }
    }),
  }

  CACHE_ELECTIONS[cityId] = finalData

  console.log(CACHE_ELECTIONS)
  console.log(CACHE_YEAR)

  return finalData
}

export { apiGetCities, apiGetElection, apiGetYear }
