import React, { useState, useEffect } from 'react';
import './RecitePage.css';

const RecitePage = () => {
    const [dictionaries, setDictionaries] = useState([
        { id: 1, name: 'English-Chinese' },
        { id: 2, name: 'Business Terms' },
        // Add more dictionaries as needed
    ]);

    const [selectedDictionary, setSelectedDictionary] = useState(1);
    const [words, setWords] = useState([
        { word: 'Hello', pronunciation: 'həˈləʊ', verbFeature: 'greeting', translation: '你好' },
        { word: 'Goodbye', pronunciation: 'ɡʊdˈbaɪ', verbFeature: 'farewell', translation: '再见' },
        { word: 'Thank you', pronunciation: 'θæŋk juː', verbFeature: 'gratitude', translation: '谢谢' },
        // Add more words as needed
    ]);

    const [currentWord, setCurrentWord] = useState(null);
    const [timeLeft, setTimeLeft] = useState(5);
    const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {
        if (words.length > 0) {
            getRandomWord();
        }
    }, [words]);

    useEffect(() => {
        let timer;
        if (timerActive && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0) {
            handlePass();
        }
        return () => clearTimeout(timer);
    }, [timerActive, timeLeft]);

    const getRandomWord = () => {
        const randomIndex = Math.floor(Math.random() * words.length);
        setCurrentWord(words[randomIndex]);
        setTimeLeft(5);
        setTimerActive(true);
    };

    const handleDictionaryChange = (e) => {
        setSelectedDictionary(Number(e.target.value));
        // Here you would typically fetch words for the selected dictionary
        // For now, we'll just reset the current word
        getRandomWord();
    };

    const handlePass = () => {
        getRandomWord();
    };

    const handleNotRemember = () => {
        // Here you could implement logic to mark the word for review
        console.log(`Marked "${currentWord.word}" for review`);
        getRandomWord();
    };

    return (
        <div className="recite-page">
            <div className="dictionary-select">
                <select value={selectedDictionary} onChange={handleDictionaryChange}>
                    {dictionaries.map(dict => (
                        <option key={dict.id} value={dict.id}>{dict.name}</option>
                    ))}
                </select>
            </div>
            {currentWord && (
                <div className="recite-card">
                    <div className="timer-bar" style={{ width: `${(timeLeft / 5) * 100}%` }}></div>
                    <h2 className="recite-word">{currentWord.word}</h2>
                    <p className="recite-pronunciation">{currentWord.pronunciation}</p>
                    <p className="recite-verb-feature">{currentWord.verbFeature}</p>
                    <div className="recite-buttons">
                        <button onClick={handleNotRemember}>&lt; Not Remember</button>
                        <button onClick={handlePass}>Pass &gt;</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecitePage;