<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../../scripts/angular.min.js"></script>
    <script type="text/javascript" src="../../scripts/angular-locale_de-de.js"></script>
    <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->

    <%-- angular material --%>
    <link rel="stylesheet" type="text/css" href="../content/styles/Material/material-custom.css" class="material-stylesheet" />
    <link rel="stylesheet" href="../content/styles/Material/angular-material.min.css" class="material-stylesheet" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic" />

    <%-- bootstrap ui --%>
    <link rel="stylesheet" type="text/css" href="../content/styles/Bootstrap/bootstrap.min.css" class="bootstrap-stylesheet" />
    <link rel="stylesheet" type="text/css" href="../content/styles/Bootstrap/bootstrap-custom.css" class="bootstrap-stylesheet" />
    <link rel="stylesheet" type="text/css" href="../content/styles/Bootstrap/bootstrap-theme.min.css" class="bootstrap-stylesheet" />
    

    <link rel="stylesheet" type="text/css" href="../content/styles/sharepoint-override.css"/>

    <script src="../../scripts/angular-animate.min.js"></script>
    <script src="../../scripts/angular-aria.min.js"></script>
    <script src="../../scripts/angular-messages.min.js"></script>

    <script src="../../scripts/angular-material.min.js"></script>
    <script src="../../scripts/ui-bootstrap-tpls-2.5.0.min.js"></script>

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../../scripts/angular-ui.router.min.js"></script>
    <script type="text/javascript" src="../app.module.js"></script>
    <script type="text/javascript" src="../app.config.js"></script>
    <script type="text/javascript" src="../app.module.variables.js"></script>
    <script type="text/javascript" src="../factories/profiles.factory.js"></script>
    <script type="text/javascript" src="../factories/notifications.bootstrap.confirm.controller.js"></script>
    <script type="text/javascript" src="../factories/notifications.factory.js"></script>
    <script type="text/javascript" src="../app.routes.js"></script>
    <script type="text/javascript" src="./navigation.controller.js"></script>
    <script type="text/javascript" src="../allProfiles/allProfiles.controller.js"></script>
    <script type="text/javascript" src="../createProfile/createProfile.controller.js"></script>
    <script type="text/javascript" src="../oneProfile/oneProfile.controller.js"></script>
    <script type="text/javascript" src="../init.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Angular Frontend Showcases
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

    <div ng-app="app">
        <ui-view></ui-view>
    </div>

</asp:Content>
