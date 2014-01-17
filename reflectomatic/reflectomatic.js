var searchterm;
var searchpage=1;
var a;
var reflecting;
var lasturl;
var loaded = false;
var nativeWidth;

function reflectImage(url) {
	image = new Image();
	loaded = false;
	image.src = url;
	lasturl = url;
	
	$('imageresult').innerHTML = '';
	
	image.onload = function() {
		if (!loaded) {
			height = 80/this.height;
			if (height > 0.5) {
				height = 0.5;
			}
			
			nativeWidth = this.width;
			nativeHeight = this.height;
			
			$('popacity').value = 33;
			$('pheight').value = Math.round(height*100);
			$('pwidth').value = this.width;
			
			$('imagehtml').innerHTML = '<strong>Add to webpage</strong><br />Install <a href="http://cow.neondragon.net/stuff/reflection/">reflection.js</a> and then you can add this reflection to your webpage using the following code:<br /><span class="code">&lt;img src="'+image.src+'" class="reflect rheight'+$('pheight').value+' ropacity33" width="'+this.width+'" /&gt;</span><br /><br /><strong><a href="http://cow.neondragon.net/stuff/reflection/reflectomatic/?url='+encodeURIComponent(image.src)+'">Link to this</a></strong>';
	
			Reflection.add(this, { height: height, opacity: 1/3 });
			a.display(3);
			loaded = true;
		}
	}
	
	$('reflectproperties').style.display = 'block';
	$('imageresult').appendChild(image);
	$('imagehtml').style.paddingBottom = '30px';
	
	if ((document.all || window.opera) && image.complete) {
		image.onload();
	}
	
	return false;
}

function adjustReflection() {
	$('imageresult').innerHTML='';
	loaded=false;
	
	image = new Image();
	image.src = lasturl;
	
	image.onload = function() {
		if (!loaded) {
			if (this.height > 80) {
				height = 80/this.height;
			} else {
				height = 1;
			} 
			
			if (!$('pwidth').value) {
				$('pwidth').value = nativeWidth;
			}
			
			opacity = $('popacity').value/100;
			height = $('pheight').value/100;
			image.width = $('pwidth').value;
			image.height = $('pwidth').value/nativeWidth * nativeHeight;
			
			$('imagehtml').innerHTML = '<strong>Add to webpage</strong><br />Install <a href="http://cow.neondragon.net/stuff/reflection/">reflection.js</a> and then you can add this reflection to your webpage using the following code:<br /><span class="code">&lt;img src="'+image.src+'" class="reflect rheight'+$('pheight').value+' ropacity'+$('popacity').value+'" width="'+this.width+'" /&gt;</span><br /><br /><strong><a href="http://cow.neondragon.net/stuff/reflection/reflectomatic/?url='+encodeURIComponent(image.src)+'&amp;height='+encodeURIComponent($('pheight').value)+'&amp;opacity='+encodeURIComponent($('popacity').value)+'&amp;width='+encodeURIComponent($('pwidth').value)+'">Link to this</a></strong>';
	
			Reflection.add(this, { height: height, opacity: opacity });
			a.display(0);
			a.display(3);
			loaded = true;
		}
	}
	
	$('reflectproperties').style.display = 'block';
	$('imageresult').appendChild(image);
	$('imagehtml').style.paddingBottom = '30px';
	
	if ((document.all || window.opera) && image.complete) {
		image.onload();
	}
}

function reflectFromURL(url) {
	if (url.substring(0,4) != "http") {
		url = "http://"+url;
	}
	
	reflectImage(url);
}

function getYahooImages(jsonData) {
	imageresults = '<p>Image search results '+((searchpage-1)*10+1)+' to '+((searchpage)*10+1)+' for <strong>'+searchterm.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</strong> - <a href="javascript:searchImages(\''+searchterm.replace(/\'/g,'\\\'')+'\', '+(searchpage+1)+')">Next &raquo;</a></p><table><tr>';
	for (i=0;i<10;i++) {
		j = new Image();
		j.src=jsonData.ResultSet.Result[i].Thumbnail.Url;
		
		if (i==5) {
			imageresults += '</tr><tr>';
		}
		
		imageresults += '<td><a href="#" onclick="javascript:reflectImage(\''+jsonData.ResultSet.Result[i].ClickUrl+'\');return false;"><img src="'+jsonData.ResultSet.Result[i].Thumbnail.Url+'" alt="'+escape(jsonData.ResultSet.Result[i].Title)+'" onload="Reflection.add(this, {height: 1/3, opacity: 1/3})" /></a></td>';
	}
	imageresults += '</tr></table><p>Click on the image to load it into reflect-o-matic.</p>';
	
	document.getElementById('searchresults').innerHTML = imageresults;
	document.getElementById('searchresults').style.visibility = 'visible';
}

function searchImages(term,page) {
	$('searchresults').style.height = '500px';
	
	a.previous=0;
	a.display(1);
	
	document.getElementById('imagesearch').value = term;
	
	if (page) {
		start = 10*(page-1)+1;
		searchpage = page;
	} else {
		start = 1;
		searchpage=1;
	}
	
	// The web service call
	var req  = 'http://search.yahooapis.com/ImageSearchService/V1/imageSearch?appid=JwTGwmPV34F1OcZJEFEBrMNqkeWfrGdg7ReMlrBu8CCXBYvMOW_dj.DiK3XLyEWGFA--&query='+encodeURIComponent(term)+'&start='+start+'&output=json&callback=getYahooImages';
	searchterm = term;
	
	// Create a new request object
	bObj = new JSONscriptRequest(req); 
	// Build the dynamic script tag
	bObj.buildScriptTag(); 
	// Add the script tag to the page
	bObj.addScriptTag();
}