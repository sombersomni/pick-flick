import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { VisualRating } from '../components/Rating.jsx';
import { images } from '../config/moviedb.json';
import  { MOVIEDB_KEY } from '../env.json';
import Chip from '@material-ui/core/Chip';

const MovieHeader = styled.header`
    display: flex;
    flex-direction: row;
    background: url(${props => props.url});
    background-size: cover;
    background-position-x: center;
    background-position-y: top;
    width: 100vw;
    height: 200px;
`;

const TitleSection = styled.section`
    display: flex;
    flex-direction: ${props => props.mobile ? 'column' : 'row' };
    align-items: flex-start;
    width: 100vw;
`;

const TitleInfo = styled.div`
    display: flex;
    flex-direction: ${props => props.mobile ? 'row' : 'column'};
    justify-content: ${props => props.mobile ? 'space-between' : 'center'};
    align-items: center;
    min-width: ${props => props.mobile ? '100vw' : '200px'};
    padding: 25px;
    margin-bottom: -20px;
    border-bottom: 2px solid #CCC;
`;

const Tagline = styled.h5`
    margin-top: -10px;
`;

const InfoSection = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-cotent: center;
    width: 100%;
    margin-top: 25px;
`;

const Overview = styled.div`
    text-align: justify;
    padding: 25px;
    margin-bottom: -20px;
    &:first-letter {
        font-size: 2em;
    }
`;

const Genres = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

export default function MoviePage({match, mobile}) {
    const [movie, setMovie] = useState({});
    const [cast, setCast] = useState([]);
    const [crew, setCrew] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [similar, setSimilar] = useState([]);
    console.log(mobile, 'mobile');
    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/movie/${match.params.id}?api_key=${MOVIEDB_KEY}`)
        .then(res => {
            const { data, status } = res;
            if(status === 200) {
                console.log(data);
                const { id } = data;
                setMovie(data);
                return axios.get(`https://api.themoviedb.org/3/movie/${match.params.id}/credits?api_key=${MOVIEDB_KEY}`)
            }
        })
        .then(res => {
            const { data, status } = res;
            if(status === 200) {
                console.log(data);
                const { cast, crew } = data;
                setCrew(crew);
                setCast(cast);
                return axios.get(`https://api.themoviedb.org/3/movie/${match.params.id}/recommendations?api_key=${MOVIEDB_KEY}`)
            }
        })
        .then(res => {
            const { data, status } = res;
            if(status === 200) {
                const { results } = data;
                console.log(data);
                setRecommendations(results);
                return axios.get(`https://api.themoviedb.org/3/movie/${match.params.id}/similar?api_key=${MOVIEDB_KEY}`)
            }
        })
        .then(res => {
            const { data, status } = res;
            if(status === 200) {
                const { results } = data;
                console.log(data);
                setSimilar(results);
            }
        })
        .catch(err => {
            console.log(err.message);
        })
    }, [])
    const { backdrop_path, genres, title, vote_average, tagline, overview, release_date} = movie;
    const date = release_date ? new Date(release_date) : null;
    return (
        <div>
            {Object.keys(movie).length > 0 ? 
            (<React.Fragment>
                <MovieHeader url={`https://image.tmdb.org/t/p/${images.backdrop_sizes[2]}/${backdrop_path}`}>
                </MovieHeader>
                <TitleSection mobile={mobile}>
                    <TitleInfo mobile={mobile}>
                        <div>
                            <h1>{title}</h1>
                            <Tagline>{tagline}</Tagline>
                        </div>
                        {vote_average === 0 ? 'N/A' : <VisualRating rating={vote_average} />}
                    </TitleInfo>
                    <InfoSection>
                        <h5 style={{ marginBottom: -20 }}>overview</h5>
                        <Overview>{overview}</Overview>
                        <h5>Release date: {date ? date.toLocaleDateString('en-US') : ''} </h5>
                        <Genres>
                            {genres.map(genre => 
                                <Chip 
                                    key={genre.id} 
                                    size="small" 
                                    style={{ width: 100, margin: 5}}
                                    label={genre.name}/>)}
                        </Genres>
                    </InfoSection>
                </TitleSection>
            </React.Fragment>) : null }
        </div>
    )
}