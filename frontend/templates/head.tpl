<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://www.facebook.com/2008/fbml">
	<head data-locale="{#locale#}">

		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<meta name="google-signin-client_id" content="{$GOOGLECLIENTID}">

		<title>{$htmlTitle} &ndash; omegaUp</title>

		<script type="text/javascript" src="/third_party/js/jquery.js?ver=198b3f"></script>

		<script type="text/javascript" src="/js/omegaup/omegaup.js?ver=5c773b"></script>
		<script type="text/javascript" src="/js/omegaup/api.js?ver=61105d"></script>
		<script type="text/javascript" src="/js/omegaup/ui.js?ver=7f4a99"></script>
		<script type="text/javascript" src="/js/omegaup/lang.{#locale#}.js?ver=f0fb05,396746,75317a,a6cdb8"></script>

		<script type="text/javascript" src="/third_party/js/sugar.js?ver=171bac"></script>
		<script type="text/javascript" src="/third_party/js/highstock.js?ver=6e7575"></script>
		<script type="text/javascript" src="/js/omegaup-graph.js?ver=12891c"></script>
		<script type="text/javascript" src="/js/langtools.js?ver=adeec4"></script>

		<!-- Bootstrap from CDN -->
		<!-- Latest compiled and minified CSS -->

		<link rel="stylesheet" href="/third_party/css/bootstrap.min.css">

		<!-- Latest compiled and minified JavaScript -->

		<script src="/third_party/js/bootstrap.min.js?ver=176563"></script>

		<!-- Bootstrap table plugin from https://github.com/wenzhixin/bootstrap-table/releases -->
		<script src="/third_party/js/bootstrap-table.min.js?ver=711245"></script>
		<link rel="stylesheet" href="/third_party/css/bootstrap-table.min.css">

		<!-- Bootstrap select plugin from https://github.com/silviomoreto/bootstrap-select -->
		<link rel="stylesheet" href="/third_party/css/bootstrap-select.min.css">
		<script type="text/javascript" src="/third_party/js/bootstrap-select.min.js?ver=cf5db5"></script>
		<!-- Bootstrap datepicker plugin from http://www.eyecon.ro/bootstrap-datepicker/ -->
		<link rel="stylesheet" href="/third_party/css/bootstrap-datepicker.css">
		<script type="text/javascript" src="/third_party/js/bootstrap-datepicker.js?ver=bf3a56"></script>
		<!-- typeahead plugin from https://github.com/twitter/typeahead.js -->
		<script type="text/javascript" src="/third_party/js/typeahead.jquery.js?ver=2e4977"></script>
		<!-- Bootstrap datetimepicker plugin from http://www.malot.fr/bootstrap-datetimepicker/demo.php -->
		<link rel="stylesheet" href="/third_party/css/bootstrap-datetimepicker.css">
		<script type="text/javascript" src="/third_party/js/bootstrap-datetimepicker.min.js?ver=a0cafb"></script>

		<!-- from arena -->
		<link rel="shortcut icon" href="/favicon.ico" />
		<link rel="stylesheet" type="text/css" href="/css/style.css">
		<link rel="stylesheet" type="text/css" href="/css/common.css">

{if isset($LOAD_MATHJAX) && $LOAD_MATHJAX}
	<script type="text/javascript" src="/js/mathjax-config.js?ver=37494e"></script>
	<script type="text/javascript" src="/third_party/js/mathjax/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
{/if}
{if isset($LOAD_PAGEDOWN) && $LOAD_PAGEDOWN}
	<script type="text/javascript" src="/third_party/js/pagedown/Markdown.Converter.js?ver=e445ec"></script>
	<script type="text/javascript" src="/third_party/js/pagedown/Markdown.Sanitizer.js?ver=25306e"></script>
	<script type="text/javascript" src="/third_party/js/pagedown/Markdown.Editor.js?ver=e0132d"></script>
	<link rel="stylesheet" type="text/css" href="/third_party/js/pagedown/demo/browser/demo.css" />
{/if}
		<script type="text/javascript" src="/js/head.sugar_locale.js?ver=0cb37f"></script>
	</head>
	<body>

		<div id="wrapper">
{if isset($navbarSection)}
{include file='common.navbar.tpl' navbarSection=$navbarSection}
{else}
{include file='common.navbar.tpl'}
{/if}
