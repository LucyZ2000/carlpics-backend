import Header from '../components/Header';
import Grid from '../components/Grid';
import '../css/root.css';

const Home = ({data}) => {
  return (
    <>
      <Header />
      <Grid images={data} />
    </>
  );
}

export default Home;
