<?php

$res = "";
if (isset($_POST['recatcha'])) { 
	require_once "../php-sdk/recatcha_sdk.php";
	$server_addr = "127.0.0.1";
	$server_port = 8899;
	$recatcha_client = new Recatcha\MuchEnterprise\SDK\RecatchaClient($server_addr, $server_port);
	$data = preg_replace('#^data:image/\w+;base64,#i', '', $_POST['recatcha']);
	$res = $recatcha_client->send($data);
}
?>
<!doctype html>
<html>
	<head>
	<style type="text/css">
	.msg {
		display: block;
		margin: 100px auto;
		font-size: 1.3rem;
		text-align: center;
		font-family: sans-serif;
	}
	form {
		max-width: 300px;
		margin: 100px auto;
	}
	form input[type=text] {
		padding: 10px;
		margin: 15px 15px 0;
		border: 1px solid #ccc;
		border-radius: 3px;
	}
	form input[type=submit] {
		padding: 15px;
		margin: 0 15px
	}
	</style>
	</head>
	<body>
		
		<?php if ($res !== "") : ?>
		<p class="msg">
			<?php if ($res === "not_cat"): ?>
			<span style="color:#00ff00">Success! You are not a cat.</span>
			<?php else: ?>
			<span style="color:#ff0000">Cats are not welcome. :(</span>
			<?php endif; ?>
		</p>
		<?php endif; ?>
		<form action="/" method="post" class="form">
			<h2>Form example with reCATcha</h2>
			<input type="text" name="field" placeholder="Some text input...">
			<div id="recatcha"></div>
		<input type="submit" value="Send form thing">
		</form>

	<script src="recatcha.js"></script>
	<script type="text/javascript">
	recatcha.init({
		URL: "/api.php"
	})
	</script>
	</body>
</html>
