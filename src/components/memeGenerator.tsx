import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './memeStyle.scss';

interface Meme {
  id: string;
  url: string;
}

const API_URL = 'https://api.imgflip.com/get_memes';

const MemeGenerator = () => {
  const [meme, setMeme] = useState<Meme | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  function refreshPage(){
    window.location.reload();
    } 

  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        const memes = response.data.data.memes;
        const randomIndex = Math.floor(Math.random() * memes.length);
        const randomMeme = memes[randomIndex];
        setMeme(randomMeme);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const generateMeme = async (): Promise<void> => {
    try {
      const response = await axios.post('https://api.imgflip.com/caption_image', null, {
        params: {
          template_id: meme?.id,
          username: 'lcentury',
          password: 'lcen0706',
          text0: topText,
          text1: bottomText,
        },
      });
      const imageUrl = response.data.data.url;
      const newMeme = { id: meme.id, url: imageUrl };
      setMeme(newMeme);
      setTopText('');
      setBottomText('');
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    generateMeme();
  };

  return (
    <div className="MemeGenerator">
      {meme ? (
        <form onSubmit={handleSubmit}>
          <img src={meme.url} alt={meme.id} />
          <input
            type="text"
            value={topText}
            onChange={event => setTopText(event.target.value)}
            placeholder="Top text"
          />
          <input
            type="text"
            value={bottomText}
            onChange={event => setBottomText(event.target.value)}
            placeholder="Bottom text"
          />
          <div className="btn-row">
              <button type="submit">Generate</button>
              <button onClick={refreshPage}>Get New Meme</button>
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MemeGenerator;
