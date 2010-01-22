// ==UserScript==
// @name           Analytics
// @namespace      Google
// @description    Social numbers for Google Analytics in Top Content section of the analytics
// @include        https://www.google.com/analytics/reporting/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.js
// ==/UserScript==

function myjob() {
	$('#f_column_5').after("<th class=\"goog-control goog-control-hover\" id=\"f_column_6\" style=\"-moz-user-select: none;\"> <div class=\"column_header\">Tweets</div> </th>");
	$('#f_column_6').after("<th class=\"goog-control goog-control-hover\" id=\"f_column_7\" style=\"-moz-user-select: none;\"> <div class=\"column_header\">Diggs</div> </th>");
	$('#f_column_7').after("<th class=\"goog-control goog-control-hover\" id=\"f_column_8\" style=\"-moz-user-select: none;\"> <div class=\"column_header\">Reddit</div> </th>");
	$('#f_column_8').after("<th class=\"goog-control goog-control-hover\" id=\"f_column_9\" style=\"-moz-user-select: none;\"> <div class=\"column_header\">Facebook</div> </th>");

	$.each($("tbody[id^='f_tbody'] .text a[target='GA_LINKER']"), function(i, val) {
		$(val).parent().parent().parent().parent().append("<td id=\"f_cell_" + (i+1) + "_6\"></td>");
		GM_xmlhttpRequest({
			method: 'GET',
			url: ("http://otter.topsy.com/stats.json?url=" + encodeURIComponent(val.href)),
			onerror: function(response) {
				GM_log(response.responseText);
			},
			onload: function (response) {
				k = eval("(" + response.responseText + ")");
				$("#f_cell_" + (i+1) + "_6").html(k.response.all);
			}
		});
		
		$(val).parent().parent().parent().parent().append("<td id=\"f_cell_" + (i+1) + "_7\"></td>");
		var btn= document.createElement("iframe");
		btn.setAttribute("src", "http://digg.com/tools/diggthis.php?u="+escape(val.href)+"&s=compact");
		btn.setAttribute("style", "height:15.5px; width:120px;");
		btn.setAttribute("frameborder", "0");
		btn.setAttribute("scrolling", "no");
		$("#f_cell_" + (i+1) + "_7").html(btn);
		

		$(val).parent().parent().parent().parent().append("<td id=\"f_cell_" + (i+1) + "_8\"></td>");
		GM_xmlhttpRequest({
			method: 'GET',
			url: "http://www.reddit.com/api/info.json?url=" + encodeURIComponent(val.href),
			onload: function(response1) {
				var data = eval("(" + response1.responseText + ")").data.children[0];
				$("#f_cell_" + (i+1) + "_8").html(data == null ? 0 : (data.data.score + " ("+data.data.ups + "," + data.data.downs+")"));
			}
		});
		
		$(val).parent().parent().parent().parent().append("<td id=\"f_cell_" + (i+1) + "_9\"></td>");
		GM_xmlhttpRequest({
			method: 'GET',
			url: "http://api.facebook.com/restserver.php?v=1.0&method=fql.query&query=select%20url%2C%20share_count%20from%20link_stat%20where%20url%20in%20(%27" + encodeURIComponent(val.href) + "%27)&format=json",
			onload:function(response) {
				var data = eval("(" + response.responseText + ")");
				$("#f_cell_" + (i+1) + "_9").html(data[0].share_count);
			}
		})
	});
}

myjob();
// var xmldoc = new DOMParser().parseFromString(response1.responseText,"text/xml").childNodes[0];
// GM_log($(xmldoc).find("item")[0]);
// GM_log(k1.data.children[0].score);