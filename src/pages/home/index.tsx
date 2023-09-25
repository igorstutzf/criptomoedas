import { FormEvent, useEffect, useState } from 'react'
import styles from './home.module.css'
import { BiSearch } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom'

//https://coinlib.io/api/v1/coinlist?key=67f9141787211428


interface CoinProps {
  name: string;
  delta_24h: string;
  price: string;
  symbol: string;
  volume_24h: string;
  market_cap: string;
  formatedPrice: string;
  formatedMarket: string;
  numberDelta: number;
}

interface DataProps{
  coins: CoinProps[];
}

export function Home(){
  const [coins, setCoins] = useState<CoinProps[]>([])
  const [inputValue, setInputValue] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    function getData(){
      fetch('https://sujeitoprogramador.com/api-cripto/?key=1bee22926e96c248')
      .then(response => response.json())
      .then((data: DataProps) => {
        let coinsData = data.coins.slice(0, 15); 
          console.log(coinsData)
        let price = Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }); 

        const formatResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.price)),
            formatedMarket: price.format(Number(item.market_cap)),
            numberDelta: parseFloat(item.delta_24h.replace(",", "."))
          }

          return formated;
        })

        setCoins(formatResult)
      })

    }


    getData();

  }, [])


  function handleSearch(e: FormEvent){
    e.preventDefault();
    if(inputValue === "") return;

    navigate(`/detail/${inputValue}`)
  
  }

  return(
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSearch}>
        <input
          placeholder="Digite o símbolo da moeda: BTC..."
          value={inputValue}
          onChange={ (e) => setInputValue(e.target.value) }
        />
        <button type="submit">
          <BiSearch size={30} color="#FFF" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coins.map( coin => (
            <tr key={coin.name} className={styles.tr}>
              <td className={styles.tdLabel} data-label="Moeda">
                <Link className={styles.link} to={`/detail/${coin.symbol}`}>
                  <span>{coin.name}</span> | {coin.symbol}
                </Link>
              </td>
              <td className={styles.tdLabel}  data-label="Mercado">
               {coin.formatedMarket}
              </td>
              <td className={styles.tdLabel} data-label="Preço">
                {coin.formatedPrice}
              </td>
              <td className={coin.numberDelta >= 0 ? styles.tdProfit : styles.tdLoss}  data-label="Volume">
                <span>{coin.delta_24h}</span>
              </td>
  
            </tr>
          ))}
        </tbody>

      </table>


    </main>
  )
}