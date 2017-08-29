(function () {
    'use strict';

    angular.module('app').controller('CreateProfileController', CreateProfileController);

    CreateProfileController.$inject = ['$location', 'notifications', 'profilesFactory', '$scope', '$state'];

    function CreateProfileController($location, notifications, profilesFactory, $scope, $state) {
        $scope.copyTerms = copyTerms;
        $scope.createProfile = createProfile;
        $scope.isDatepickerOpen = false;
        $scope.isSpeedDialOpen = false;
        $scope.isValidBirthday = true;
        $scope.minDate = new Date(1900, 0, 2);
        $scope.newProfile = {};
        $scope.printTerms = printTerms;
        $scope.saveTerms = saveTerms;
        $scope.termsOpen = true;
        $scope.today = new Date();
        $scope.validateBirthday = validateBirthday;

        $scope.dateOptions = { // TODO
            maxDate: $scope.today,
            minDate: $scope.minDate,
            startingDay: 1,
            datepickerMode: 'year',
            showWeeks: false
        }

        function copyTerms() {
            var terms = document.getElementById('termsOfAgreement');
            var wasSuccessful = false;

            try {
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(terms);
                selection.removeAllRanges();
                selection.addRange(range);
                wasSuccessful = document.execCommand('copy');
                selection.removeAllRanges();
            }
            finally {
                if (wasSuccessful) {
                    showToast('Nutzungsbedingungen kopiert!', 'info');
                    return;
                }
                showToast('Fehler beim Kopieren!', 'warning');
            }
        }

        function createProfile() {
            if ($scope.createForm.$valid) {
                if ($scope.newProfile.username.indexOf(';') >= 0) {
                    showToast('Im Namen darf kein ; enthalten sein!', 'danger');
                    $scope.createForm.username.$touched = true;
                    return;
                }
                profilesFactory.createProfile($scope.newProfile).then(function (success) {
                    goToNewProfile(true);
                    console.debug(success);
                }, function (error) {
                    goToNewProfile(false, error);
                    console.error(error);
                });
            }
            else {
                $scope.createForm.username.$touched = true;
                $scope.createForm.realName.$touched = true;
                $scope.createForm.terms.$touched = true;
                setTimeout(function () {
                    document.getElementById('s4-workspace').scrollTop = 0;
                }, 1);
            }
        }

        function goToNewProfile(wasSuccessful, message) {
            if (wasSuccessful) {
                $state.go('user', { name: $scope.newProfile.username });
            }
            else {
                $scope.createForm.username.$touched = true;
                if (message != 'Der Benutzer existiert bereits!') {
                    message = 'Benutzer konnte nicht angelegt werden!';
                }
                else {
                    $scope.newProfile.username = '';
                }
                showToast(message, 'danger');
            }
        }

        function printTerms() {
            var head = document.getElementsByTagName('head')[0];
            var newStyle = document.createElement('style');
            newStyle.setAttribute('type', 'text/css');
            newStyle.setAttribute('media', 'print');
            newStyle.setAttribute('id', 'printTermsStyle');
            newStyle.appendChild(document.createTextNode(
                '@media print {' +
                    'body * { ' +
                    '    visibility: hidden;' +
                    '}' +
                    '#termsOfAgreement, #termsOfAgreement * {' +
                    '    visibility: visible;' +
                    '}                       ' +
                    '#termsOfAgreement {     ' +
                    '    position: absolute; ' +
                    '    left: 0;            ' +
                    '    top: 0;             ' +
                    '    width: 100%;        ' +
                    '    height: 100%;       ' +
                    '    overflow: visible;  ' +
                    '}                       ' +
                '}'));

            if (!document.getElementById('printTermsStyle')) {
                head.appendChild(newStyle);
            }
            window.print();
            head.removeChild(newStyle);
        }

        function saveTerms() {
            var terms = document.getElementById('termsOfAgreement');
            var text = '';

            for (var i = 0; i < terms.childElementCount; i++) {
                text += terms.children[i].innerText + '\r\n\r\n';
            }

            var textToSaveAsBlob = new Blob([text], { type: "text/plain" });
            var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
            var fileNameToSaveAs = 'TermsOfAgreement.txt';

            var browserName = navigator.appName;
            if (browserName == 'Microsoft Internet Explorer') {
                window.navigator.msSaveBlob(textToSaveAsBlob, fileNameToSaveAs);
            }
            else {
                var downloadLink = document.createElement("a");
                downloadLink.download = fileNameToSaveAs;
                downloadLink.innerHTML = "Download File";
                downloadLink.href = textToSaveAsURL;
                downloadLink.onclick = destroyClickedElement;
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
                downloadLink.click();
            }

            function destroyClickedElement(event) {
                document.body.removeChild(event.target);
            }
        }

        function showToast(text, kind) {
            notifications[sessionStorage.getItem('UiFramework')].showMessage(text, kind);
        }

        function validateBirthday() {
            try {
                if (!$scope.newProfile.birthday) {
                    return true;
                }
                var dateParts = toGermanDate($scope.newProfile.birthday).split('.');
                var date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

                if (date.getTime() < $scope.minDate.getTime() || date.getTime() > $scope.today.getTime()) {
                    $scope.isValidBirthday = false;
                    return;
                }
            }
            catch (e) {
                $scope.isValidBirthday = true;
                console.error('error during validation');
                return;
            }
            $scope.isValidBirthday = true;
        }

        function toGermanDate(date) {
            if (date) {
                return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
            }
            return null;
        }
    }
})();