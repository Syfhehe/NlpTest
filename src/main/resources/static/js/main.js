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

			var clearItems = function(body, url) {
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
				url = contextPath + '/file/' + $(this).attr('id');
				body = "是否确定要删除该文件?";
				deleteItems(body, url);
			});

			$('a.clearButton').on("click", function() {
				var url, body;
				url = contextPath + '/sensitiveValue/' + $(this).attr('id');
				body = "是否确定清空历史敏感值?";
				clearItems(body, url);
			});

			$('#fileDetailModal').on('hide.bs.modal', function() {
				window.location.reload();
			})

		});
	});
});