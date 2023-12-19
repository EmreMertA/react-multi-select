import Container from './components/Container';
import RickAndMortyInput from './components/inputs/RickAndMortyInput';

const App = () => {
  console.log("rerenders")
  return (
    <Container>
      <RickAndMortyInput />
    </Container>
  );
};

export default App;
