define([ "jquery", "common/confirm_modal", ], function($, ConfirmModal) {
	$(function() {
		$(document).ready(function() {
			var deleteItems = function(body, url) {
				var modal = new ConfirmModal({
					title : "提示",
					body : body,
					onConfirm : function() {
						$.ajax({
							type : "DELETE",
							url : url,
							success : function(data, textStatus, jqXHR) {
								console.log(data);
								var result = JSON.parse(data);
								if (result.status === "200") {
									window.location.reload();
								}
							},
							error : function(data, textStatus, errorThrown) {
								console.log(data.responseText);
							}
						});
					}
				});
				modal.show();
			};

			var clearItems = function(body, url) {
				var modal = new ConfirmModal({
					title : "提示",
					body : body,
					onConfirm : function() {
						$.ajax({
							type : "PUT",
							url : url,
							success : function(data, textStatus, jqXHR) {
								console.log(data);
								var result = JSON.parse(data);
								if (result.status === "200") {
									window.location.reload();
								}
							},
							error : function(data, textStatus, errorThrown) {
								console.log(data.responseText);
							}
						});
					}
				});
				modal.show();
			};

			$('a.deleteButton').on("click", function() {
				var url, body;
				url = contextPath + '/file/' + $(this).attr('id');
				body = "是否确定要删除该文件?";
				deleteItems(body, url);
			});

			$('a.clearButton').on("click", function() {
				var url, body;
				url = contextPath + '/sensitiveValue/' + $(this).attr('id')+'/userName/'+$(this).attr('value');
				body = "是否确定清空历史敏感值?";
				clearItems(body, url);
			});

			$('#fileDetailModal').on('hide.bs.modal', function() {
				window.location.reload();
			})
			
			$('#searchFileButton').on("click", function() {
				var url, body;
				url = contextPath + '/file/' + $('#fileNameInput').val();
				$.ajax({
					type : "GET",
					url : url,
					success : function(data, textStatus, jqXHR) {
						console.log(data);	
						var result = JSON.parse(data);
						var tableLength = $("#fileTable tbody tr").length;
						var arr = result.result.split(',');
						for(var i = 1; i<=tableLength;i++){
							var value = document.querySelector("body > div.container > div:nth-child(2) > table > tbody > tr:nth-child("+i+") > td:nth-child(2)").textContent;
							if(arr.indexOf(value) ==-1){
								$("#fileTable tr:eq("+i+")").attr("hidden","hidden");
							}else{
								$("#fileTable tr:eq("+i+")").removeAttr("hidden");
							}
						}
						
					},
					error : function(data, textStatus, errorThrown) {
						console.log(data.responseText);
					}
				});
			});

		});
	});
});