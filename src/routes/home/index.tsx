import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getForecast } from '../../services/weather';
import style from './style.css';

const Home: FunctionalComponent = () => {
    const [temperature, setTemperature] = useState('-');

    useEffect(() => {
        getForecast().then(forecast => {
            console.log(forecast);
            const { data, error } = forecast;
            if (error) {
                setTemperature('-');

            } else if (data) {
                setTemperature(`${data.currentWeather.temperature} ${data.unit}`);
            }
        });
    }, []);

    return (
        <div class={style.home}>
            <h1>Home</h1>
            <p>{temperature}</p>
            <p>This is the Home component.</p>
        </div>
    );
};

export default Home;
