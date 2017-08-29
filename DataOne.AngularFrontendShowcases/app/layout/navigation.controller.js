(function () {
    angular.module('app').controller('NavigationController', NavigationController);

    NavigationController.$inject = ['$document', '$location', '$scope', '$state', 'OwnUser'];

    function NavigationController($document, $location, $scope, $state, OwnUser) {
        $scope.currentPage = $state.current.name;
        $scope.isNavCollapsed = true;
        $scope.removeParams = removeParams;
        $scope.toggleFramework = toggleFramework;

        $document.ready(function () {
            activateFramework();
        });

        function activateFramework() {
            if (!sessionStorage.getItem('UiFramework')) {
                sessionStorage.setItem('UiFramework', 'material');
                toggleFramework();
            }
            else {
                setStyle(sessionStorage.getItem('UiFramework'));
            }
        }
        
        function removeParams() {
            var params = $location.search();
            if (!params.name || params.name == OwnUser) {
                return;
            }
            $location.search('name', '');
            $state.reload();
        }

        function setStyle(framework) {
            switch (framework) {
                case 'material':
                    stylesToDisable = document.getElementsByClassName('bootstrap-stylesheet');
                    stylesToEnable = document.getElementsByClassName('material-stylesheet');
                    break;
                case 'bootstrap':
                    stylesToDisable = document.getElementsByClassName('material-stylesheet');
                    stylesToEnable = document.getElementsByClassName('bootstrap-stylesheet');
                    break;
            }
            for (var i = 0; i < stylesToEnable.length; i++) {
                stylesToEnable[i].disabled = false;
            }
            for (var i = 0; i < stylesToDisable.length; i++) {
                stylesToDisable[i].disabled = true;
            }
        }

        function toggleFramework() {
            switch (sessionStorage.getItem('UiFramework')) {
                case 'material':
                    sessionStorage.setItem('UiFramework', 'bootstrap');
                    setStyle('bootstrap')
                    break;
                case 'bootstrap':
                    sessionStorage.setItem('UiFramework', 'material');
                    setStyle('material');
                    break;
            }
            $state.reload();
        }
    }
})();