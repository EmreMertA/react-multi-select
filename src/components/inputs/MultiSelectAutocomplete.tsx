import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectAutocompleteProps {
  optionBody: (option: any) => React.ReactNode;
  data: any[];
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedOptions: any[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<any[]>>;
  isLoading?: boolean;
  error?: string;
}

// Search inputta yazılan değer ile gelen optionları karşılaştırıp, yazılan değer ile eşleşen kısmı bold yapmak için
const formatOption = (option: any, inputValue: string) => {
  const index = option.name.toLowerCase().indexOf(inputValue.toLowerCase());
  if (index === -1) {
    return {
      ...option,
      boldName: option.name,
    };
  }

  const boldName = (
    <>
      {option.name.substring(0, index)}
      <strong>{option.name.substring(index, index + inputValue.length)}</strong>
      {option.name.substring(index + inputValue.length)}
    </>
  );

  return {
    ...option,
    boldName: boldName,
  };
};

const MultiSelectAutocomplete: React.FC<MultiSelectAutocompleteProps> = ({
  optionBody: OptionBody,
  data,
  inputValue,
  handleInputChange,
  selectedOptions,
  setSelectedOptions,
  isLoading,
  error,
}) => {
  const [isOptionVisible, setIsOptionVisible] = useState<boolean>(true);
  const [activeItem, setActiveItem] = useState<number>(-1);
  const optionContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* Optionları formatlama */
  const options = data.map((option) => {
    return formatOption(option, inputValue);
  });

  /* Option silme */
  const handleRemoveOption = (id: number) => {
    const updatedOptions = selectedOptions.filter((item) => item.id !== id);
    setSelectedOptions(updatedOptions);
  };

  /* Option seçme */
  const handleOptionClick = (option: any) => {
    const isOptionAlreadySelected = selectedOptions.some(
      (selectedOption) => selectedOption.id === option.id
    );

    if (!isOptionAlreadySelected) {
      const newSelectedOption = {
        ...option,
        name: option.name,
      };

      setSelectedOptions([...selectedOptions, newSelectedOption]);
    } else {
      const updatedOptions = selectedOptions.filter(
        (item) => item.id !== option.id
      );
      setSelectedOptions(updatedOptions);
    }
  };

  /* Herhangi bir şey seçildiğinde scroll kayması için */
  useEffect(() => {
    if (optionContainerRef.current) {
      optionContainerRef.current.scrollLeft =
        optionContainerRef.current.scrollWidth;
    }
  }, [selectedOptions]);

  /* keyboard navigation */
  useEffect(() => {
    const keyDownHandler = (event: any) => {
      if (event.key === 'ArrowDown') {
        setActiveItem((prev) => Math.min(prev + 1, options.length - 1));
      } else if (event.key === 'ArrowUp') {
        setActiveItem((prev) => Math.max(prev - 1, 0));
      } else if (event.key === 'Tab') {
        setActiveItem((prev) => Math.min(prev + 1, options.length - 1));
      } else if (event.key === 'Enter') {
        if (activeItem >= 0 && activeItem < options.length) {
          handleOptionClick(options[activeItem]);
        }
      }
    };

    document.addEventListener('keydown', keyDownHandler);
    const handleFocus = () => {
      console.log('focus');
    };

    if (inputRef.current) {
      inputRef.current.addEventListener('focus', handleFocus);
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('focus', handleFocus);
      }
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [options, inputValue]);

  return (
    <div className='max-w-[400px] w-full p-4 mx-auto border-transparent focus:outline-none '>
      <div className='flex flex-row border h-12 justify-between items-center px-1 rounded-md border-slate-400'>
        <div className='flex flex-row h-full gap-2 w-full  pr-2 '>
          {selectedOptions.length > 0 && (
            <div
              ref={optionContainerRef}
              className='overflow-x-auto thin-scrollbar  h-full flex flex-row max-w-[150px] w-full justify-start p-2  gap-2'
            >
              {/* seçilen optionlar burada listelenip inputun yanına ekleniyor */}
              {selectedOptions.map((selectedOption) => (
                <div
                  key={selectedOption.id}
                  className='border flex flex-row bg-gray-200 h-full  rounded-md justify-center px-1 items-center whitespace-nowrap text-xs cursor-pointer'
                >
                  <span>{selectedOption.name}</span>
                  <button
                    onClick={() => handleRemoveOption(selectedOption.id)}
                    className='ml-2 bg-slate-500 rounded-sm text-white focus:outline-none'
                  >
                    <svg
                      className='w-4 '
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M6 18L18 6M6 6l12 12'
                      ></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            ref={inputRef}
            type='text'
            className=' w-full focus:outline-none  rounded '
            placeholder='Type to search...'
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
        <button
          disabled={inputValue === ''}
          className='focus:outline-none'
          onClick={() => setIsOptionVisible((prev) => !prev)}
        >
          ↓
        </button>
      </div>
      {/* Option' ların listelendiği yer */}
      {isLoading ? (
        <div>Loading..</div>
      ) : (
        isOptionVisible &&
        options.length > 1 && (
          <div className='flex flex-col mt-2 w-full border border-slate-400 rounded-md overflow-y-auto max-h-[400px]'>
            {options?.map((item, i) => (
              <div
                key={item.id}
                onClick={() => handleOptionClick(item)}
                className={i === activeItem ? 'bg-blue-200' : 'bg-white'}
              >
                {OptionBody(item)}
                <hr />
              </div>
            ))}
          </div>
        )
      )}
      {error && <span className='text-red-500'>{error}</span>}
    </div>
  );
};

export default MultiSelectAutocomplete;
