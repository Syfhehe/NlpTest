define(["jquery", "common/bootstrap_modal", "common/confirm_modal"],
function($, BootstrapModal, ConfirmModal) {
    $(function() {
        $(document).ready(function() {
            $(window).bind('resize',
            function() {
                window.location.reload();
            });

            var deleteItems = function(selectedItems) {
                if (selectedItems) {
                    var modal = new ConfirmModal({
                        title: "提示",
                        body: "确定删除该用户？",
                        onConfirm: function() {
                            $.ajax({
                                type: "DELETE",
                                url: contextPath + '/configuration/users/' + selectedItems,
                                success: function(data, textStatus, jqXHR) {
                                	 window.location.reload();
                                },
                                error: function(data, textStatus, errorThrown) {
                                    console.log(data.responseText);
                                }
                            });
                        }
                    });
                    modal.show();
                }
            };

            var resetPassword = function(selectedItems) {
                if (selectedItems) {
                    var modal = new ConfirmModal({
                        title: "提示",
                        body: "确定重置密码为123456？",
                        onConfirm: function() {
                            $.ajax({
                                type: "PUT",
                                url: contextPath + '/configuration/password?userId=' + selectedItems,
                                success: function(data, textStatus, jqXHR) {
                                    console.log(data);
                                    var result = JSON.parse(data);
                                    if (result.status === "200") {
                                        window.location.reload();
                                    }

                                },
                                error: function(data, textStatus, errorThrown) {
                                    console.log(data.responseText);
                                }
                            });
                        }
                    });
                    modal.show();
                }
            };

            $(".modal").on('hidden.bs.modal',
            function(e) {
                $(this).removeData();
            });

            $('a#resetPasswordButton').on("click",
            function() {
                console.log("Reset Password");
                resetPassword(this.getAttribute("userId"));
            });

            $('a#deleteUserButton').on("click",
            function() {
                console.log("Reset Password");
                deleteItems(this.getAttribute("userId"));
            });
            
            var initRoleforUserConfiguration = function () {
                $("#selectedRole").select2({
                  placeholder: "",
                  width: '100%',
                  allowClear: true,
                  multiple: false,
                });
            }

        });
    });
});