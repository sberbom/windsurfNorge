import React, { useEffect, useState } from 'react';
import {getAllSpots} from '../api-service';
import { Button } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import Header from '../components/header';
import Map from '../components/map';
import Title from '../components/title';
import CardCarousel from '../components/cardCarousel'
import '../styles/home.css';

function Home() {
    const [spots, setSpots] = useState([])

    document.title = `Windsurf Norge`
    
    useEffect(() => {
        const fetchData = async () => {
            const allSpots = await getAllSpots();
            setSpots(allSpots);
        }
        fetchData();
    }, [])

    return(
        <div>
            <Header
                title="Windsurf Norge"
                buttonText="Se spots"
                buttonLink="/allSpots"
            />
            <Title title="Populære steder å windsurfe" />
            <CardCarousel
                spots={spots}
            />
            <div className="home-center-button">
                <Link to="/allSpots"><Button>Se alle steder å windsurfe</Button></Link>
            </div>
            <div className="home-map-container">
                <Map spots={spots}/>
            </div>
        </div>
    )
}

export default withRouter(Home);