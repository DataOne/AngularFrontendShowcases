(function () {
    'use strict';

    angular.module('app').config(dateFormatter);

    dateFormatter.$inject = ['$mdDateLocaleProvider'];

    function dateFormatter($mdDateLocaleProvider) {
        $mdDateLocaleProvider.months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        $mdDateLocaleProvider.shortMonths = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
        $mdDateLocaleProvider.days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
        $mdDateLocaleProvider.shortDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

        $mdDateLocaleProvider.parseDate = function (dateString) {
            var dateParts = dateString.split('.');
            var date = new Date(dateParts[2], dateParts[1]-1, dateParts[0]);
            return date;
        }

        $mdDateLocaleProvider.formatDate = function (date) {
            return date && date.getDate() ? date.toLocaleDateString('de') : '';
        }

        // aria-labels
        $mdDateLocaleProvider.weekNumberFormatter = function (weekNumber) {
            return 'Woche ' + weekNumber;
        }

        $mdDateLocaleProvider.msgCalendar = 'Kalender';
        $mdDateLocaleProvider.msgOpenCalendar = 'Kalender öffnen';
    }
})();