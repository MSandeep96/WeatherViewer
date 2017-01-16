jQuery(function($){

	var degre='°';
	var appid="4872749c32f138daf93f7d4f8644f85e";
	var celcius=true;


	var tempScales=['Desert','City','Fire','Snow'];

	var icons=['fa-sun-o','fa-moon-o','fa-umbrella','fa-cloud','fa-snowflake-o'];

	// Make call to api.openweathermap.org/data/2.5/weather?lat=35&lon=139
	function getLocation(){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(generateLink);
		}else{
			$('.temp_details').html("Location not supported");
		}
	}

	function generateLink(pos){
		var lat=pos.coords.latitude;
		var long=pos.coords.longitude;
		var fetchWeatherUrl='http://api.openweathermap.org/data/2.5/weather?';
		fetchWeatherUrl+='APPID='+appid;
		fetchWeatherUrl+='&lat='+lat;
		fetchWeatherUrl+='&lon='+long;
		fetchWeatherUrl+='&units=metric';
		fetchWeather(fetchWeatherUrl);
	}


	function fetchWeather(fetchWeatherUrl){
		fetch(fetchWeatherUrl)
			.then(function(response){
				return response.json();
			}).then(function(json){
				setElements(json);
			});
	}


	function setElements(weather){
		console.log(weather);
		$('.city_details').html(weather.name+','+weather.sys.country+'');
		$('.temp_details').html('Temperature : '+weather.main.temp+' '+degre+'C');
		$('.speed_details').html('Speed : '+weather.wind.speed+' knots');
		$('.weat_desc').html(weather.weather[0].description);
		setWeatherIcon(weather.weather[0].main,weather.sys);
	}

	function setWeatherIcon(condition,sys){
		var icon='<i class="fa ';
		if(condition=='Rain'||condition=='Drizzle'||condition=='Thunderstorm'){
			icon+=icons[2];
		}else if(condition=='Snow'){
			icon+=icons[4];
		}else if(condition=='Clouds'){
			icon+=icons[3];
		}else{
			var millis=(new Date()).getTime();
			if(millis>sys.sunset || millis<sys.sunrise){
				icon+=icons[1];
			}else{
				icon+=icons[0];
			}
		}

		icon+='"></i>';
		$('.weat_icon').html(icon);
	}

	getLocation();
});