jQuery(function($){

	var degre='°';
	var appid="4872749c32f138daf93f7d4f8644f85e";
	var celcius=true;

	var temp=NaN;

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
		console.log("URL= "+fetchWeatherUrl);
		fetchWeather(fetchWeatherUrl);
	}


	function fetchWeather(fetchWeatherUrl){
		fetch(fetchWeatherUrl)
		.then(function(response){
			return response.json();
		}).then(function(json){
			setElements(json);
			showHideItems();
		});
	}

	function showHideItems(){
		$('.loadin').hide();
		$('.unit_tog').show();
	}


	function setElements(weather){
		temp=weather.main.temp;
		$('.city_details').html(weather.name+','+weather.sys.country+'');
		setTemp();
		$('.speed_details').html('Speed : '+weather.wind.speed+' knots');
		$('.weat_desc').html(weather.weather[0].description);
		setWeatherIcon(weather.weather[0].main,weather.sys);
		$("body").css("background",'linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.4)),url("'+getQueryUrl(weather)+'")');
	}

	function getQueryUrl(wejson){
		var queryUrl="https://source.unsplash.com/";
		queryUrl+=$(window).width()+"x"+$(window).height()+"/?";
		var temp=wejson.main.temp;
		if(temp>40){
			queryUrl+=tempScales[0];
		}else if(temp>20){
			queryUrl+=tempScales[1];
		}else if(temp>0){
			queryUrl+=tempScales[2];
		}else{
			queryUrl+=tempScales[3];
		}
		if(wejson.weather[0].main=="Clear"){
			var millis=(new Date()).getTime();
			if(wejson.sys.sunrise<millis && millis<wejson.sys.sunset){
				queryUrl+=",Night";
			}
		}else{
			queryUrl+=","+wejson.weather[0].main;
		}
		console.log(queryUrl);
		return queryUrl;
	}

	function setTemp(){
		$('.temp_details').html('Temperature : '+temp+' '+degre);
		if(celcius){
			$('.temp_details').append('C');
		}else{
			$('.temp_details').append('F');
		}
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
			if(millis>sys.sunset && millis<sys.sunrise){
				icon+=icons[1];
			}else{
				icon+=icons[0];
			}
		}

		icon+='"></i>';
		$('.weat_icon').html(icon);
	}

	function convertToFar(){
		temp=temp*1.8+32;
		temp= +temp.toFixed(2);
		celcius=false;
		setTemp();
	}

	function convertToCel(){
		temp=(temp-32)/1.8;
		temp= +temp.toFixed(2);
		celcius=true;
		setTemp();
	}

	$('#uni_to').change(function(){
		if(celcius){
			convertToFar();
		}else{
			convertToCel();
		}
	});

	getLocation();
});