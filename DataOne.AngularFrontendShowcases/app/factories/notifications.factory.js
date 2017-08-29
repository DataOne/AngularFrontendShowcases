(function () {
    'use strict';

    angular.module('app').factory('notifications', notifications);

    notifications.$inject = ['$mdDialog', '$mdToast', '$uibModal'];

    function notifications($mdDialog, $mdToast, $uibModal) {
        var material = {
            showMessage: showMaterialToast,
            showConfirm: showMaterialConfirm,
            showPrompt: showMaterialPrompt
        };

        var bootstrap = {
            showMessage: showBootstrapToast,
            showConfirm: showBootstrapConfirm,
            showPrompt: showBootstrapPrompt
        }

        return {
            material: material,
            bootstrap: bootstrap
        };

        function showMaterialToast(text) {
            var toast = $mdToast.show($mdToast.simple()
                .textContent(text)
                .action('x')
                .hideDelay(1500)
                .position('top right'));
        }

        function showMaterialConfirm(title, text, confirmText, cancelText, confirmCallback, cancelCallback) {
            var confirm = $mdDialog.confirm();
            confirm.title(title);
            confirm.textContent(text);
            confirm.ok(confirmText);
            confirm.cancel(cancelText);
            confirm.clickOutsideToClose(true);

            $mdDialog.show(confirm).then(confirmCallback, cancelCallback);
        }

        function showMaterialPrompt(title, text, placeholder, confirmText, cancelText, confirmCallback, cancelCallback) {
            var prompt = $mdDialog.prompt();
            prompt.title(title);
            prompt.textContent(text);
            prompt.placeholder(placeholder);
            prompt.ok(confirmText);
            prompt.cancel(cancelText);

            $mdDialog.show(prompt).then(function (result) {
                confirmCallback(result);
            },
            cancelCallback);
        }

        function showBootstrapToast(text, kind) {
            var toastId = 'uib-toast';
            var toast = document.getElementById(toastId);

            if (toast) {
                clearTimeout(toast.timeoutId);
                hideToast(toast);
            }
            else {
                toast = document.createElement('div');
                toast.id = toastId;
                toast.setAttribute('uib-alert', '');

                var toastText = document.createElement('span');
                toastText.id = 'uib-toast-text';
                toastText.innerText = text;
                toast.appendChild(toastText);

                var close = document.createElement('button');
                close.className = 'close';
                close.innerText = 'x';
                close.style.minWidth = '0';
                close.addEventListener('click', function () {
                    clearTimeout(toast.timeoutId);
                    hideToast(toast);
                });
                toast.appendChild(close);

                document.body.appendChild(toast);
            }
            toast.className = 'alert alert-' + kind;

            document.getElementById('uib-toast-text').innerText = text;

            setTimeout(function () {
                toast.style.opacity = '1';
                toast.style.visibility = 'visible';
                toast.style.marginTop = '0';
            }, 250);

            toast.timeoutId = setTimeout(function () { hideToast(toast); }, 2700);

            function hideToast(t) {
                t.style.opacity = '0';
                toast.style.visibility = 'hidden';
                t.style.marginTop = '-100px';
            }
        }

        function showBootstrapConfirm(title, text, confirmText, cancelText, confirmCallback, cancelCallback) {
            var modelInstance = $uibModal.open({
                templateUrl: '../factories/notifications.bootstrap.confirm.html',
                controller: 'ConfirmController',
                resolve: {
                    items: function () {
                        return {
                            title: title,
                            text: text,
                            confirmText: confirmText,
                            cancelText: cancelText
                        }
                    }
                }
            });
            modelInstance.result.then(confirmCallback, cancelCallback);
        }

        function showBootstrapPrompt(title, text, placeholder, confirmText, cancelText, confirmCallback, cancelCallback) {
            var modelInstance = $uibModal.open({
                templateUrl: '../factories/notifications.bootstrap.prompt.html',
                controller: 'ConfirmController',
                resolve: {
                    items: function () {
                        return {
                            title: title,
                            text: text,
                            placeholder: placeholder,
                            confirmText: confirmText,
                            cancelText: cancelText
                        }
                    }
                }
            });
            modelInstance.result.then(confirmCallback, cancelCallback);
        }
    }
})();