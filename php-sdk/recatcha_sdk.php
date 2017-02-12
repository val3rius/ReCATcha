<?php
namespace Recatcha\MuchEnterprise\SDK;

class RecatchaClient
{
	
	private $socket;
	private $addr;
	private $port;

	public function __construct($host, $port)
	{
		$this->addr = $host;
		$this->port = $port;
		$this->socket = \socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

		if ($this->socket === false) {
			$errorcode = \socket_last_error();
			$errormsg = \socket_strerror($errorcode);
			die("could not establish socket: [$errorcode] $errormsg");
		}

	}

	public function send($payload)
	{	
		\socket_connect($this->socket, $this->addr, $this->port);
		\socket_write($this->socket, $payload, strlen($payload)) or die("Could not send data");
		$errorcode = \socket_last_error();
		$errormsg = \socket_strerror($errorcode);

		$read=\socket_read($this->socket,1024);
		\socket_close($this->socket);
	    return $read;	
	}
}

