import React,{useState,useEffect} from 'react';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {MenuItem,FormControl,Select,Card,CardContent} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData,prettyPrintStat} from "./util"
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import numeral from "numeral";


const App = () => {
const[countries,setcountries]=useState([]);
const[country,setCountry]=useState("worldwide");
const[countryInfo,setCountryInfo]=useState({});
const[tableData,setTableData]=useState([]);
const[casesType,setCasesType]=useState("cases");
const[mapCenter,setmapCenter]=useState({lat: 34.80746, lng: -40.4796});
const[mapZoom,setmapZoom]=useState(3)
const[mapCountries, setMapCountries]=useState([]);

useEffect(() =>{      /*this useffect is used to show the worldwide cases initially*/
	fetch("https://corona.lmao.ninja/v3/covid-19/all")
	.then((response) => response.json())
	.then((data) =>{
		setCountryInfo(data);
	});
}, []);

useEffect(() =>{
const getCountriesData= async () =>{
await fetch("https://corona.lmao.ninja/v3/covid-19/countries")
.then((response) => response.json())
.then((data) => {

const countries = data.map((country) => ({
name: country.country,
value: country.countryInfo.iso2,
}));

const sortedData=sortData(data);
setTableData(sortedData);
setMapCountries(data);
setcountries(countries);
});
};

getCountriesData();
}, []);
const onCountryChange = async (event) => {
 const countryCode = event.target.value


const url=
countryCode==="worldwide"?"https://corona.lmao.ninja/v3/covid-19/all"
:`https://corona.lmao.ninja/v3/covid-19/countries/${countryCode}`;

await fetch(url)
.then(response =>response.json())
.then(data =>{

setCountry(countryCode);

setCountryInfo(data);

setmapCenter([data.countryInfo.lat,data.countryInfo.long]);
setmapZoom(4);
})


}

return(
<>
<div className="app">
	<div className="app_left">
		<div className="app_header">
			<h1>Covid 19 Tracker</h1>
			<FormControl className="app_dropdown">
				<Select
					variant="outlined"
					value={country}
					onChange={onCountryChange} >
					<MenuItem value="worldwide">Worldwide</MenuItem>
					{countries.map((country) =>
					<MenuItem value={country.value} > {country.name} </MenuItem>	)}
				</Select>
			</FormControl>
		</div>
		<div className="app_stats">
		<InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
		<Map casesType={casesType}
		countries={mapCountries}
		center={mapCenter}
		zoom={mapZoom}
		/>
	</div>
	<Card className="app_right">
	<CardContent>
     <h2>Live Cases by Country</h2>
     <Table countries={tableData} />
      <h3>Worldwide new {casesType}</h3>
	 <LineGraph casesType={casesType} />
       
	</CardContent>
	</Card>

</div>
	</>
	);
	};
	
	export default App