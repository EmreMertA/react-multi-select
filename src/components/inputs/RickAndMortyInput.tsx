import { useEffect, useState } from 'react';
import MultiSelectAutocomplete from './MultiSelectAutocomplete';
import axios from 'axios';
import qs from 'query-string';
import { Caracter } from '../../types/Caracter';
import useDebounce from '../../hooks/useDebounce';

interface SelectedOption extends Caracter {
  boldName: string;
  episodes: number;
}

const RickAndMortyInput = () => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState<Caracter[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const debouncedSearch = useDebounce(inputValue, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  //Api' ye Debounced olarak istek atma
  useEffect(() => {
    if (debouncedSearch === '') {
      setOptions([]);
      return;
    }
    setIsLoading(true);
    setError('');

    const fetchData = async () => {
      /* istek için parametleri ayalama */
      let query = {
        name: debouncedSearch,
      };
      const url = qs.stringifyUrl(
        {
          url: 'https://rickandmortyapi.com/api/character/',
          query: query,
        },
        { skipNull: true }
      );
      axios
        .get(url)
        .then((response) => {
          setOptions(response.data.results);
        })
        .catch((error) => {
          setError(error.message);
          console.log(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchData();
  }, [debouncedSearch]);

  //Reusable Option stilini oluşturma
  const optionBody = (option: SelectedOption) => (
    <div
      key={option.id}
      className={`option  cursor-pointer gap-3 rounded flex flex-row p-2 m-1`}
    >
      <input
        type='checkbox'
        checked={selectedOptions.some(
          (selectedOption) => selectedOption.id === option.id
        )}
        readOnly={true}
        className='mr-2 focus:outline-none '
      />
      <img src={option.image} width={50} className='rounded-lg' alt='' />
      <div>
        <h1>{option.boldName}</h1>
        <span>{option.episodes} Episodes</span>
      </div>
    </div>
  );
  /* Burada gerekli yerleri doldurduktan sonra MultiSelectAutocomplete componentinden 
extend ederek reusable bir selective auto complete componenti elde ediyorum */
  return (
    <MultiSelectAutocomplete
      optionBody={optionBody}
      data={options}
      inputValue={inputValue}
      handleInputChange={handleInputChange}
      selectedOptions={selectedOptions}
      setSelectedOptions={setSelectedOptions}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default RickAndMortyInput;
