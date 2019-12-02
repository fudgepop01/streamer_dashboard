<script>
	import io from 'socket.io-client';

	const socket = io();

	let messages = [];
	socket.on("ChatMessage", (msg) => {
		messages = [...messages, msg];
		console.log(messages);
	})
</script>

<style>
</style>
