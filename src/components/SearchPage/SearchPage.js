import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';

const SearchPage = () => {
    const navigate = useNavigate();
    const { isLoggedIn, userEmail } = useAuth();
    const [searchWord, setSearchWord] = useState('');
    const [definedWord, setDefinedWord] = useState('');
    const [definedNote, setDefinedNote] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [showLinks, setShowLinks] = useState(false);
    const [searchedWords, setSearchedWords] = useState([]);
    const [userDictionary, setUserDictionary] = useState(new Set());
    const [dictionaryOption, setDictionaryOption] = useState('English-Chinese');
    const [notebookOption, setNotebookOption] = useState('Notebook1');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            console.error('No token found, please log in.');
        }
    }, [navigate]);

    const handleInputSubmit = (event) => {
        event.preventDefault();
        const newEntry = { word: definedWord, note: definedNote };
        setSearchedWords((prevWords) =>
            prevWords.map((entry) =>
                entry.word === definedWord ? { ...entry, note: definedNote } : entry
            )
        );
        setDefinedWord('');
        setDefinedNote('');
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`https://cp.dhytv.com/v1/dicts/word/${searchWord}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server Error:', errorData.message || 'Failed to fetch word data');
                throw new Error(errorData.message || 'Failed to fetch word data');
            }
            const resultData = await response.json();
            console.log(resultData);

            setSearchResult(resultData);
            setSearchedWords((prevWords) => [
                ...prevWords,
                {
                    word: searchWord,
                    translation: resultData.data.translation,
                    phonetic: resultData.data.phonetic,  // Added phonetic information
                    note: '', // Initialize with empty note
                },
            ]);
        } catch (error) {
            console.error('Error fetching word data:', error);
            setSearchResult(null);
        }
    };

    const handleNoteChange = (word, newNote) => {
        setSearchedWords((prevWords) =>
            prevWords.map((entry) =>
                entry.word === word ? { ...entry, note: newNote } : entry
            )
        );
    };

    const toggleDictionary = (word) => {
        setUserDictionary((prevDictionary) => {
            const newDictionary = new Set(prevDictionary);
            if (newDictionary.has(word)) {
                newDictionary.delete(word);
            } else {
                newDictionary.add(word);
            }
            return newDictionary;
        });
    };

    const handleDictionaryChange = (event) => {
        setDictionaryOption(event.target.value);
    };

    const handleNotebookChange = (e) => {
        setNotebookOption(e.target.value);
    };

    return (
        <div className="search-page">
            <div className="search-page__filters">
                <div className="search-page__language-box search-page__box">
                    <h2 className="search-page__box-title">Language</h2>
                    <select
                        className="search-page__select"
                        value={dictionaryOption}
                        onChange={handleDictionaryChange}
                    >
                        <option value="English-Chinese">English-Chinese</option>
                        <option value="Chinese-English">Chinese-English</option>
                    </select>
                </div>
                <div className="search-page__notebook-box search-page__box">
                    <h2 className="search-page__box-title">MyNoteBook</h2>
                    <select
                        className="search-page__select"
                        value={notebookOption}
                        onChange={handleNotebookChange}
                    >
                        <option value="Notebook1">Notebook1</option>
                        <option value="Notebook2">Notebook2</option>
                    </select>
                </div>
            </div>

            <div className="search-page__content">
                <div className="search-page__left-panel search-page__box">
                    <h2 className="search-page__box-title">Word Search</h2>
                    <form className="search-page__form" onSubmit={handleSearchSubmit}>
                        <input
                            className="search-page__input"
                            type="text"
                            placeholder="Enter a word to search"
                            value={searchWord}
                            onChange={(e) => setSearchWord(e.target.value)}
                        />
                        <button className="search-page__button" type="submit">Search</button>
                    </form>
                    {searchResult && searchResult.data && (
                        <div className="search-page__result-box">
                            <div className="word-button-group">
                                <p><strong>Word:</strong> {searchResult.data.word}</p>
                                <button
                                    className="audio-icon-button"
                                    onClick={() =>
                                        document
                                            .getElementById(`audio-${searchResult.data.word}`)
                                            .play()
                                    }
                                    style={{
                                        padding: '0px',
                                        marginLeft: '2px',
                                        cursor: 'pointer',
                                        border: 'none',
                                        background: 'none',
                                    }}
                                >
                                    🔊
                                </button>
                                <audio
                                    id={`audio-${searchResult.data.word}`}
                                    src={`https://dict.youdao.com/dictvoice?audio=${searchResult.data.word}`}
                                />
                            </div>

                            <div className="translation">
                                <strong>Translation:</strong> : {searchResult.data.translation}
                            </div>

                            <p>
                                <strong>Phonetic:</strong> {searchResult.data.phonetic}
                            </p>
                        </div>
                    )}
                </div>

                <div className="search-page__right-panel search-page__box">
                    <h2 className="search-page__box-title">Today's Search</h2>
                    <div className="search-page__words-container">
                        {searchedWords.map(({ word, translation, phonetic, note }, index) => (
                            <div className="search-page__word-card" key={index}>
                                <div className="word-button-group">
                                    <p><strong>Word:</strong> {word}</p>
                                    <button
                                        className="audio-icon-button"
                                        onClick={() =>
                                            document
                                                .getElementById(`audio-${word}`)
                                                .play()
                                        }
                                        style={{
                                            padding: '0px',
                                            marginLeft: '2px',
                                            cursor: 'pointer',
                                            border: 'none',
                                            background: 'none',
                                        }}
                                    >
                                        🔊
                                    </button>
                                    <audio
                                        id={`audio-${word}`}
                                        src={`https://dict.youdao.com/dictvoice?audio=${word}`}
                                    />
                                </div>
                                <div className="translation">
                                    <strong>Translation:</strong> {translation}
                                </div>


                                <div className="notes">
                                    <strong>Note:</strong>
                                    <textarea
                                        id="note"
                                        placeholder="Add a note"
                                        value={note}
                                        onChange={(e) => handleNoteChange(word, e.target.value)}
                                        rows="3" // Specifies the number of rows to display by default
                                        style={{
                                            width: '100%', // Optional: makes the textarea take full width of its container
                                            resize: 'vertical' // Allows users to resize vertically only
                                        }}
                                    />
                                </div>
                                <button
                                    className="dictionary-star"
                                    onClick={() => toggleDictionary(word)}
                                    style={{
                                        color: userDictionary.has(word) ? 'gold' : 'gray',
                                    }}
                                >
                                    ★
                                </button>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
