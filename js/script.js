
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var street = $('#street').val();
    var city   = $('#city').val();
    var src = 'https://maps.googleapis.com/maps/api/streetview?size=800x400&location="' + street + ',' + city;
    var nytimesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="+city+"&api-key=07aaafa9eae96a0f7f5830c10978c112:12:70995210"

    $body.append('<img class="bgimg" src='+src+'>');
    $greeting.text(city+'?, really???');
    $.getJSON(nytimesURL, function( data ) {

        var articles = [];

        for(var i = 0; i< (data.response.docs).length;i++) {
            var headline = data.response.docs[i].headline.main;
            var leadParagraph = data.response.docs[i].lead_paragraph;
            if(headline && leadParagraph){
                articles.push( "<li class='article'>" + "<h3>" + headline + "</h3>" + "<p>"+leadParagraph +"</p>"+ "</li>" );
            }
        }


        $( "<ul/>", {
            "class": "article",
            html: articles.join( "" )
        }).appendTo( '#nytimes-articles' );
    }).error(function() {
        $nytElem.text("Can't get articles right now...Sorry")
    });

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Can't get to wiki right now...Sorry")

    },8000);

    var wikiURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search="+city+"&format=json&callback=?";
    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        success: function (data) {
            console.log(data[1] );
            var articleList = data[1];
            for(var i=0;i<articleList.length;i++) {
                articleString = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleString;
                $wikiElem.append('<li><a href="'+url+'">'+articleString+'</a></li>');
            }
            clearTimeout(wikiRequestTimeout);
        }
    });
        return false;
}

$('#form-container').submit(loadData);

 //loadData();
