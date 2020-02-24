// XMLHttpRequest 오브젝트 생성
var lo_result    = new Array;
var ls_url_query = location.search; // url에서 ? 부터의 문자열
var lo_array1    = new Array; // & 로 분리시킨 값이 들어갈배열
var lo_array2    = new Array; // = 로 분리시킨 값이 들어갈배열
var i = 0;

ls_url_query = ls_url_query.slice(1); // 첫문자 ?는 자르고
lo_array1 = ls_url_query.split("&");    // & 배열로 나눈다.

for(i=0; i< lo_array1.length; i++) {
	lo_array2 = lo_array1[i].split("=");    // = 배열나누기
	lo_result[lo_array2[0]] = lo_array2[1]; // 결과를 lo_result에 저장
}

function createHttpRequest() {
	if(window.ActiveXObject){
		//Win e4,e5,e6용
		try {
			return new ActiveXObject("Msxml2.XMLHTTP") ;
		} catch (e) {
			try {
				return new ActiveXObject("Microsoft.XMLHTTP") ;
			} catch (e2) {
				return null ;
			}
		}
	} else if(window.XMLHttpRequest){
		//Win Mac Linux m1,f1,o8 Mac s1 Linux k3용
		return new XMLHttpRequest() ;
	} else {
		return null ;
	}
}

function sendRequest(url) {
	var oj = createHttpRequest();
	oj.open("GET",url,false )
	oj.send(null);

	var xmlDoc = oj.responseXML;
	var nodes = xmlDoc.getElementsByTagName("GuideMenu")[0].getElementsByTagName("Depth1");

	var xmlObjTopDiv = document.getElementById("Guide_TopWrap_Menu");
	var xmlObjLeftDiv = document.getElementById("Guide_Left");
	for ( var i=0; i<nodes.length; i++ ) {
		var Depth1title = nodes.item(i).getElementsByTagName("title")[0].firstChild.nodeValue;
		var Depth1menulink = nodes.item(i).getElementsByTagName("menulink")[0].firstChild.nodeValue;
		var Depth1menuid = nodes.item(i).getElementsByTagName("menuid")[0].firstChild.nodeValue;

		var objTopMenuLink = document.createElement("a");
		objTopMenuLink.href = Depth1menulink;
		objTopMenuLink.innerHTML = Depth1title;
		if ( Depth1menuid == lo_result["depth1"] ) { objTopMenuLink.className = "current"; }
		console.log(Depth1menuid);

		xmlObjTopDiv.appendChild(objTopMenuLink);

		var objLeftMenu = document.createElement("ul");
		//xmlObjLeftDiv.appendChild(objLeftMenu);
		objTopMenuLink.after(objLeftMenu);

		if ( Depth1menuid == lo_result["depth1"] ) {
			// var objLeftMenudt = document.createElement("dt");
			// objLeftMenudt.innerHTML = Depth1title;
			// objLeftMenu.appendChild(objLeftMenudt);

			var nodesub = nodes.item(i).getElementsByTagName("Depth2");

			if ( nodesub.length > 0 ) {
				for ( var j=0; j<nodesub.length; j++ ) {
					var Depth2title = nodesub.item(j).getElementsByTagName("title")[0].firstChild.nodeValue;
					var Depth2menulink = nodesub.item(j).getElementsByTagName("menulink")[0].firstChild.nodeValue;
					var Depth2menuid = nodesub.item(j).getElementsByTagName("menuid")[0].firstChild.nodeValue;

					var objLeftMenudd = document.createElement("li");
					objLeftMenu.appendChild(objLeftMenudd);

					var objLeftMenuddLink = document.createElement("a");
					objLeftMenuddLink.href = Depth2menulink;
					objLeftMenuddLink.innerHTML = Depth2title;
					if ( Depth2menuid == lo_result["depth2"] ) { objLeftMenuddLink.className = "current"; }
					objLeftMenudd.appendChild(objLeftMenuddLink);
				}
			}
		}
	}
}

function sendContentRequest(url) {
	//console.log('tt')
	var oj = createHttpRequest();
	oj.open("GET",url,false )
	oj.send(null);

	var xmlDoc = oj.responseXML;

	objH1Box = document.getElementById("Guide_Content_Title");

	var nodes = xmlDoc.getElementsByTagName("GuideMenu")[0].getElementsByTagName("Depth1");
	var Depth1title = nodes.item(lo_result["depth1"]-1).getElementsByTagName("title")[0].firstChild.nodeValue;
	//var objH1Title = document.createElement("span");
	//objH1Box.innerHTML = Depth1title;
	//objH1Box.appendChild(objH1Title);

	if ( lo_result["depth2"] != undefined ) {
		var nodesub = nodes.item(lo_result["depth1"]-1).getElementsByTagName("Depth2");
		var Depth2title = nodesub.item(lo_result["depth2"] - 1).getElementsByTagName("title")[0].firstChild.nodeValue;
		var objH2Title = document.createElement("span");
		objH2Title.innerHTML = Depth2title;
		objH1Box.appendChild(objH2Title);

		if ( lo_result["depth3"] != undefined ) {
			var Depth3Div = document.createElement("div");
			Depth3Div.className = "Guide_Content_Depth3_Menu";
			objH1Box.appendChild(Depth3Div);

			var Depth3Ul = document.createElement("ul");
			Depth3Div.appendChild(Depth3Ul);

			var nodeDepth3 = nodesub.item(lo_result["depth2"] - 1).getElementsByTagName("Depth3");
			for ( var i=0; i<nodeDepth3.length; i++ ) {
				var Depth3title = nodeDepth3.item(i).getElementsByTagName("title")[0].firstChild.nodeValue;
				var Depth3menulink = nodeDepth3.item(i).getElementsByTagName("menulink")[0].firstChild.nodeValue;
				var Depth3menuid = nodeDepth3.item(i).getElementsByTagName("menuid")[0].firstChild.nodeValue;

				var Depth3Li = document.createElement("li");
				if ( Depth3menuid == lo_result["depth3"] ) { Depth3Li.className = "current"; }
				Depth3Ul.appendChild(Depth3Li);

				var Depth3Link = document.createElement("a");
				Depth3Link.innerHTML = Depth3title;
				Depth3Link.href = Depth3menulink;
				Depth3Li.appendChild(Depth3Link);
			}
		}
	}

}
