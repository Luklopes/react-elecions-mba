import { useEffect, useState } from 'react'
import { _apiGetCandidates, apiGetCities, apiGetElection, apiGetYear } from './api/api'
import { ClipLoader } from 'react-spinners'

export default function App() {
  const [loadingPage, setLoadingPage] = useState(true)
  const [loadingElection, setLoadingElection] = useState(true)
  const [cities, setCities] = useState([])
  const [years, setYear] = useState([])
  const [currentElection, setCurrentElection] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)

  useEffect(() => {
    async function getBackendCities() {
      const cities = await apiGetCities()
      setCities(cities)
      setSelectedCity(cities[0].id)
      setLoadingPage(false)
      const year = await apiGetYear()
      console.log(year)
      console.log("certo", year[0]["2003"][46])
      const ultimoElemento = year[0]["2003"][year[0]["2003"].length - 1];
      console.log("ultimoElemento", ultimoElemento)
      setYear(ultimoElemento)
      console.log(year["2003"])
    }

    getBackendCities()
  }, [])

  useEffect(() => {
    if (!selectedCity) {
      return
    }

    async function getBackendElection() {
      setLoadingElection(true)
      const election = await apiGetElection(selectedCity)
      setCurrentElection(election)
      setLoadingElection(false)
    }

    getBackendElection()
  }, [selectedCity])

  const  classificacao  = years
  console.log("classificacao", classificacao);
  console.log("classificacao partidas", classificacao.partidas[0]);
  // console.log("classificacao times", classificacao.partidas[0].time);
  // console.log("classificacao map", classificacao.partidas.map((item) => (item.time)));


  // classificacao.sort((a, b) => {
  //   if (a.total_pontos > b.total_pontos) {
  //     return -1;
  //   } else if (a.total_pontos < b.total_pontos) {
  //     return 1;
  //   } else {
  //     if (a.saldo_gols > b.saldo_gols) {
  //       return -1;
  //     } else if (a.saldo_gols < b.saldo_gols) {
  //       return 1;
  //     } else {
  //       return 0;
  //     }
  //   }
  // });

  if (loadingPage) {
    return (
      <div className="text-center mt-4">
        <ClipLoader />
      </div>
    )
  }

  let mainJsx = (
    <div className="text-center mt-4">
      <ClipLoader />
    </div>
  )

  
  return (
    <table>
    <thead>
      <tr>
        <th>Posição</th>
        <th>Time</th>
        <th>Jogos</th>
        <th>Pontos</th>
        <th>Vitórias</th>
        <th>Empates</th>
        <th>Derrotas</th>
        <th>Gols marcados</th>
        <th>Gols sofridos</th>
        <th>Saldo de gols</th>
      </tr>
    </thead>
    <tbody>
      {classificacao.map((item, index) => (
        <tr key={item.time}>
          <td>{index + 1}</td>
          <td>{item.time}</td>
          <td>{item.pontuacao.total_jogos}</td>
          <td>{item.pontuacao.total_pontos}</td>
          <td>{item.pontuacao.total_vitorias}</td>
          <td>{item.pontuacao.total_empates}</td>
          <td>{item.pontuacao.total_derrotas}</td>
          <td>{item.pontuacao.total_gols_marcados}</td>
          <td>{item.pontuacao.total_gols_sofridos}</td>
          <td>{item.pontuacao.saldo_gols}</td>
        </tr>
      ))}
    </tbody>
  </table>
  )
}
