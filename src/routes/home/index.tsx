import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getForecast } from '../../services/weather';
import style from './style.css';

const Home: FunctionalComponent = () => {
    const [forecast, setForecast] = useState({
        temperature: '-',
        dawn: '-',
        dusk: '-',
    });

    useEffect(() => {
        getForecast({ temperatureUnit: 'F' }).then(forecast => {
            const { data, error } = forecast;
            if (error) {
                setForecast({
                    temperature: '-',
                    dawn: '-',
                    dusk: '-',
                });
            } else if (data) {
                setForecast({
                    temperature: `${data.currentWeather.temperature} ${data.temperatureUnit}`,
                    dawn: data.daily[0].dawn.toLocaleTimeString(),
                    dusk: data.daily[0].dusk.toLocaleTimeString(),
                });
            }
        });
    }, []);

    return (
        <div class={style.home}>
            <h1>Home</h1>
            <p>{forecast.temperature}</p>
            <p>Dawn: {forecast.dawn}</p>
            <p>Dusk: {forecast.dusk}</p>
        </div>
    );
};

export default Home;
