<template>
	<div id="app">
		<IToast></IToast>
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
	</div>
</template>

<script>
	export default {
		name: 'App',
		components: {

		}
	}
</script>

<style>

</style>
