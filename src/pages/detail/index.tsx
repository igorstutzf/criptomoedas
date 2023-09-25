import { useState, useEffect } from 'react'
import styles from './detail.module.css'
import { useParams, useNavigate, Link } from 'react-router-dom';

interface CoinProp {
  symbol: string;
  name: string;
  price: string;
  market_cap: string;
  total_volume_24h: string;
  low_24h: string;
  high_24h: string;
  delta_24h: string;
  formatedPrice: string;
  formatedMarket: string;
  formatedLowprice: string;
  formatedHighprice: string;
  numberDelta: number;
  error?: string;
}

export function Detail() {
  const { cripto } = useParams();
  const [detail, setDetail] = useState<CoinProp | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      fetch(`https://sujeitoprogramador.com/api-cripto/coin/?key=1bee22926e96c248&symbol=${cripto}`)
        .then(response => response.json())
        .then((data: CoinProp) => {
          if (data.error) {
            setError('Moeda não encontrada');
          } else {
            let price = Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            });

            const resultData = {
              ...data,
              formatedPrice: price.format(Number(data.price)),
              formatedMarket: price.format(Number(data.market_cap)),
              formatedLowprice: price.format(Number(data.low_24h)),
              formatedHighprice: price.format(Number(data.high_24h)),
              numberDelta: parseFloat(data.delta_24h.replace(",", ".")),
            }

            setDetail(resultData);
          }
          setLoading(false);
        })
        .catch((error) => {
          setError('Erro ao buscar os dados da moeda.');
          setLoading(false);
        });
    }

    getData();
  }, [cripto])

  if (loading) {
    return (
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando informações...</h4>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h4 className={styles.center}>{error}</h4>
        <div className={styles.linkdiv}>
          <Link className={styles.link} to={"/"}>
            Voltar
          </Link>
        </div>
      </div>
    )
  }

  if (!detail) {
    return null; // Evita renderizar caso detail seja null
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{detail.name}</h1>
      <p className={styles.center}>{detail.symbol}</p>

      <section className={styles.content}>
        <p><strong>Preço:</strong> {detail.formatedPrice}</p>
        <p><strong>Maior preço 24h:</strong> {detail.formatedHighprice}</p>
        <p><strong>Menor preço 24h:</strong> {detail.formatedLowprice}</p>
        <p>
          <strong>Delta 24h:</strong>
          <span className={detail.numberDelta && detail.numberDelta >= 0 ? styles.profit : styles.loss}>
            {detail.delta_24h}
          </span>
        </p>
        <p><strong>Valor mercado:</strong> {detail.formatedMarket}</p><br />
        <div className={styles.linkdiv}>
          <Link className={styles.link} to={"/"}>
            <span>Voltar</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
