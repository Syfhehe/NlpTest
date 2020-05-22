define([ "jquery", "common/confirm_modal", ], function($, ConfirmModal) {
	$(function() {
		$(document).ready(function() {
			var deleteItems = function(body, url) {
				var modal = new ConfirmModal({
					title : "Confirm",
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
			
			var updateSettings = function(body, url) {
				var modal = new ConfirmModal({
					title : "Confirm",
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
				url = contextPath + '/sensitivities/' + $(this).attr('id');
				body = "是否确定要删除该该敏感词?";
				deleteItems(body, url);
			});	
			
			$('#thresholdSubmitBtn').on("click", function() {
				var url, body;
				url = contextPath + '/threshold/' + $('#thresholdValue').val();
				body = "是否确定要更新累计敏感值?";
				updateSettings(body, url);
			});	
			
			$('#visitTimesSubmitBtn').on("click", function() {
				var url, body;
				url = contextPath + '/visitTimes/' + $('#visitTimesValue').val();
				body = "是否确定要更新一小时访问次数上限设置?";
				updateSettings(body, url);
			});	

		});
	});
});