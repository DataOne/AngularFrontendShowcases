(function () {
    'use strict';

    angular.module('app').controller('ConfirmController', confirmController);

    confirmController.$inject = ['$scope', '$uibModalInstance', 'items'];

    function confirmController($scope, $uibModalInstance, items) {
        $scope.title = items.title,
        $scope.text = items.text,
        $scope.placeholder = items.placeholder;
        $scope.confirmText = items.confirmText,
        $scope.cancelText = items.cancelText,
        $scope.result = '';

        $scope.confirm = $uibModalInstance.close;
        $scope.cancel = $uibModalInstance.dismiss;
    }
})();
