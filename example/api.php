<?php
$res = array(
	'response' => 'error: bad request'
);

if (isset($_POST['recatcha'])) {
	require_once "../php-sdk/recatcha_sdk.php";
	$server_addr = "127.0.0.1";
	$server_port = 8899;
	$recatcha_client = new Recatcha\MuchEnterprise\SDK\RecatchaClient($server_addr, $server_port);
	$data = preg_replace('#^data:image/\w+;base64,#i', '', $_POST['recatcha']);
	$res['response'] = $recatcha_client->send($data);
}


echo json_encode($res);

