<script lang="ts">
	import type { TimetableDay } from 'bbs-parser/src/types';
	import { Button, Container, Head, Hr, Html, Img, Preview, Section, Text } from 'svelte-email';

	export let formattedDate: Date;
	export let oldData: TimetableDay;
	export let newData: TimetableDay;

	const fontFamily =
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif';

	const main = {
		backgroundColor: '#ffffff'
	};

	const container = {
		margin: '0 auto',
		padding: '20px 0 48px'
	};

	const paragraph = {
		fontFamily,
		fontSize: '16px',
		lineHeight: '26px'
	};
	const hr = {
		borderColor: '#cccccc',
		margin: '20px 0'
	};

	const footer = {
		fontFamily,
		color: '#8898aa',
		fontSize: '12px'
	};
</script>

<Html lang="en">
	<Head />
	<Preview preview="Stundenplanänderung {formattedDate}" />
	<Section style={main}>
		<Container style={container}>
			<Text style={paragraph}>
				Dein Stundenplan für <b>{formattedDate}</b>
				wurde geändert.
			</Text>

			<Text style={{ fontWeight: '800', fontSize: '20px' }}>neuer Stundenplan:</Text>

			{#each newData as [hours, slot]}
				{#each slot as lesson}
					<Text style={{ paddingLeft: '32px', margin: '0px' }}>
						<b>{hours.join('/')}</b>
						: {lesson.subject} - {lesson.teacher} @ {lesson.room}
					</Text>
				{/each}
				<Text />
			{/each}

			<Text style={{ marginTop: '32px', fontWeight: '800', fontSize: '20px' }}>
				alter Stundenplan:
			</Text>

			{#each oldData as [hours, slot]}
				{#each slot as lesson}
					<Text style={{ paddingLeft: '32px', margin: '0px' }}>
						<b>{hours.join('/')}</b>
						: {lesson.subject} - {lesson.teacher} @ {lesson.room}
					</Text>
				{/each}
				<Text />
			{/each}
			<Hr style={hr} />
			<Text style={footer}>BBS Vanced by Alwin Lohrie</Text>
			<Text style={footer}>
				Du kannst diese Emails in den Einstellungen der BBS Vanced App deaktivieren.
			</Text>
		</Container>
	</Section>
</Html>
