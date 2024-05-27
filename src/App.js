import './App.css';
import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Card, CardContent } from '@mui/material';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData, prettyPrintStat } from './utils';
import 'leaflet/dist/leaflet.css';

function App() {
	const [ countries, setCountries ] = useState([]);
	const [ country, setCountry ] = useState('worldwide');
	const [ countryInfo, setCountryInfo ] = useState({});
	const [ tableData, setTableData ] = useState([]);
	const [ mapCenter, setMapCenter ] = useState({ lat: 34.80746, lng: -40.4796 });
	const [ mapZoom, setMapZoom ] = useState(3);
	const [ mapCountries, SetMapCountries ] = useState([]);
	const [ casesType, setCasesType ] = useState('cases');

	useEffect(() => {
		fetch('https://disease.sh/v3/covid-19/all').then((response) => response.json()).then((data) => {
			setCountryInfo(data);
		});
	}, []);

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch('https://disease.sh/v3/covid-19/countries').then((response) => response.json()).then((data) => {
				const countries = data.map((country) => ({
					name: country.country,
					value: country.countryInfo.iso2
				}));

				const sortedData = sortData(data);
				setTableData(sortedData);
				SetMapCountries(data);
				setCountries(countries);
			});
		};

		getCountriesData();
	}, []);

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;

		const url =
			countryCode === 'worldwide'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url).then((response) => response.json()).then((data) => {
			setCountry(countryCode);
			setCountryInfo(data);
			setMapCenter(
				countryCode === 'worldwide'
					? { lat: 34.80746, lng: -40.4796 }
					: [ data.countryInfo.lat, data.countryInfo.long ]
			);
			setMapZoom(countryCode === 'worldwide' ? 2.5 : 4);
		});
	};

	return (
		<div className="app">
			<div className="app_left">
				<div className="app_header">
					<h1>COVID 19 TRACKER</h1>
					<FormControl className="app_dropdown">
						<Select variant="outlined" onChange={onCountryChange} value={country}>
							<MenuItem value="worldwide" disabled>
								<strong>The selection glitches sometimes.</strong>
							</MenuItem>
							<MenuItem value="worldwide" disabled>
								<strong>If it doesn't work, try again</strong>
							</MenuItem>
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country) => <MenuItem value={country.value}>{country.name}</MenuItem>)}
						</Select>
					</FormControl>
				</div>

				<div className="app_stats">
					<InfoBox
						title="Coronavirus Cases"
						isRed
						cases={prettyPrintStat(countryInfo.todayCases)}
						total={prettyPrintStat(countryInfo.cases)}
						onClick={(e) => setCasesType('cases')}
						active={casesType === 'cases'}
					/>
					<InfoBox
						title="Deaths"
						isBlack
						cases={prettyPrintStat(countryInfo.todayDeaths)}
						total={prettyPrintStat(countryInfo.deaths)}
						onClick={(e) => setCasesType('deaths')}
						active={casesType === 'deaths'}
					/>
					<InfoBox
						title="Recovered"
						cases={prettyPrintStat(countryInfo.todayRecovered)}
						total={prettyPrintStat(countryInfo.recovered)}
						onClick={(e) => setCasesType('recovered')}
						active={casesType === 'recovered'}
					/>
				</div>

				<Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
			</div>

			<Card className="app_right">
				<CardContent>
					<h3>New Cases by country</h3>
					<Table countries={tableData} />
					<h3>Worldwide new {casesType}</h3>
					<LineGraph className="app_graph" casesType={casesType} />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
