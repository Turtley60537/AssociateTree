//絶対パスと親の絶対パスで識別
//親の絶対パスは同じ階層、同系列の要素配列を取得するのに必要

//もしかしたらセレクタの属性値前方一致取り出しの方法ならparentpathいらないかも
//↑前方一致取り出しだと、その子孫をすべて取ってきてしまうので不可能

// attributeの設定は完了したから、次は、branchの設定

// branchの移動に関して
// branchにparentPathとchildPathの情報を与えれやればうまくいくのでは

// pathをattributeで取得できないからdivでやろうとしたら、失敗して
// もう一度attributeで試して見たらうまくいった。不思議

//まだ、コードが煩雑だけれど、木構造が完成した

$(function(){
	let selectedPath = "-1";

	//初期nodeの設定
	let setFirstNode = function(){
		let $node = $(".node").eq(0);
		$node.attr("path", "0");
		$node.attr("parentpath", "-1");

		$node.on("click touchend", function(){
			let $oldSelectedNode = $('.node[path='+selectedPath+']');
			$oldSelectedNode.css("background-color", "gray");
			$oldSelectedNode.children('textarea').css("background-color", "gray");
			selectedPath = "0";
			let $thisNode = $(this);
			$thisNode.css("background-color", "#505050");
			$thisNode.children('textarea').css("background-color", "#505050");
		});

		$node.draggable({
			drag: function(){
				let $thisNode = $(this);
				$toChildBranch = $('path[parentpath='+$thisNode.attr('path')+']');
				$toChildBranch.each(function(index){
					let $childNode = $('.node[path='+$(this).attr('childpath')+']');
					$(this).attr("d", "M "+ $thisNode.offset().left +" "+ $thisNode.offset().top +" L "+ $childNode.offset().left +" "+ $childNode.offset().top);

				});
			},
			stop: function(){
				let $thisNode = $(this);
				$toChildBranch = $('path[parentpath='+$thisNode.attr('path')+']');
				$toChildBranch.each(function(index){
					let $childNode = $('.node[path='+$(this).attr('childpath')+']');
					$(this).attr("d", "M "+ $thisNode.offset().left +" "+ $thisNode.offset().top +" L "+ $childNode.offset().left +" "+ $childNode.offset().top);

				});
			}
		});
	}
	setFirstNode();


	//nodeの追加処理
	$(".addnode").on("mousedown", function(){
		// let clone = $(".node").eq(0).clone();
		let clone = $("<div></div>");
		clone.addClass("node");
		clone.append($("<textarea></textarea>"));
		clone.css("position", "absolute");
		// clone.css("top", Math.random()*600+"px");
		// clone.css("left", Math.random()*1000+"px");

		//メモ　選択状態によって、hierarchyとelementnumの値を変更
		if(selectedPath==="-1"){
			//階層0に新たに追加
			let $sameHierNodes = $('.node[parentpath=-1]');
			clone.attr("path", $sameHierNodes.length);
			clone.attr("parentpath", "-1");
		} else {
			$selectedNode = $('.node[path='+selectedPath+']');
			clone.css("top", $selectedNode.offset().top+(Math.floor( Math.random() * (200 + 1 - (-200)) + (-200)))+"px");
			clone.css("left", $selectedNode.offset().left+(Math.floor( Math.random() * (200 + 1 - (-200)) + (-200)))+"px");

			//選択状態に合致するparent情報を持つ要素を取得
			if( $(".node[parentpath="+selectedPath+"]").length>0 ){
				let $sameHierNodes = $('.node[parentpath='+selectedPath+']');
				clone.attr("path", selectedPath+"_"+$sameHierNodes.length);
			} else {
				clone.attr("path", selectedPath+"_"+0);
			}
			clone.attr("parentpath", selectedPath);
		}

		clone.on("click touchend", function(){
			// 元の選択nodeの選択状態を解除
			$oldSelectedNode = $('.node[path='+ selectedPath +']');
			$oldSelectedNode.css("background-color", "gray");
			$oldSelectedNode.children('textarea').css("background-color", "gray");
			selectedPath = clone.attr("path");
			clone.css("background-color", "#505050");
			clone.children('textarea').css("background-color", "#505050");
		});

		clone.draggable({
			drag: function(){

				let $node = $('.node');
				let $thisNode = $(this);
				if($thisNode.attr('parentpath')!=='-1'){
					// 親nodeとのbranchを移動
					let $parentNode = $('.node[path='+$thisNode.attr('parentpath')+']');
					let $toParentBranch = $('path[childpath='+$thisNode.attr('path')+']');
					$toParentBranch.attr("d", "M "+ $parentNode.offset().left +" "+ $parentNode.offset().top +" L "+ $thisNode.offset().left +" "+ $thisNode.offset().top);
				}
				// 子nodeとのbranchを移動
				let $toChildBranches = $('path[parentpath='+$thisNode.attr('path')+']');
				$toChildBranches.each(function(index){
					let $childNode = $(".node[path="+$(this).attr('childpath')+']');
					$(this).attr("d", "M "+ $thisNode.offset().left +" "+ $thisNode.offset().top +" L "+ $childNode.offset().left +" "+ $childNode.offset().top);
				});
			},
			stop: function(){
				let $node = $('.node');
				let $thisNode = $(this);
				if($thisNode.attr('parentpath')!=='-1'){
					// 親nodeとのbranchを移動
					let $parentNode = $('.node[path='+$thisNode.attr('parentpath')+']');
					let $toParentBranch = $('path[childpath='+$thisNode.attr('path')+']');
					$toParentBranch.attr("d", "M "+ $parentNode.offset().left +" "+ $parentNode.offset().top +" L "+ $thisNode.offset().left +" "+ $thisNode.offset().top);
				}
				// 子nodeとのbranchを移動
				let $toChildBranches = $('path[parentpath='+$thisNode.attr('path')+']');
				$toChildBranches.each(function(index){
					let $childNode = $(".node[path="+$(this).attr('childpath')+']');
					$(this).attr("d", "M "+ $thisNode.offset().left +" "+ $thisNode.offset().top +" L "+ $childNode.offset().left +" "+ $childNode.offset().top);
				});
			}
		});
		clone.appendTo(".nodecontainer");


		let newBranch = document.createElementNS("http://www.w3.org/2000/svg", "path");
		newBranch.setAttribute("stroke", "black");
		newBranch.setAttribute("stroke-width", "2");
		newBranch.setAttribute("fill", "none");
		newBranch.setAttribute("className", "branch");

		if(selectedPath==="-1"){
			//0階層のnodeはbranchが要らないか
		} else {
			let $parentNode = $('.node[path='+selectedPath+']');
			let $newNode    = $('.node[parentpath='+selectedPath+']').last();

			newBranch.setAttribute("parentpath", selectedPath);
			newBranch.setAttribute("childpath", $newNode.attr("path"));

			newBranch.setAttribute("d", "M "+ $parentNode.offset().left +" "+ $parentNode.offset().top+" L "+ $newNode.offset().left +" "+ $newNode.offset().top);
			$(".branchcontainer").append(newBranch);
		}
	});


	// node以外をクリック時に全ての選択を解除
	$(document).on('click touchend', function(event){
		if(!$(event.target).closest(".node").length && !$(event.target).closest(".addnode").length){
			$oldSelectedNode = $('.node[path='+ selectedPath +']');
			$oldSelectedNode.css("background-color", "gray");
			$oldSelectedNode.children('textarea').css("background-color", "gray");
			selectedPath = "-1";
		}
	})
});