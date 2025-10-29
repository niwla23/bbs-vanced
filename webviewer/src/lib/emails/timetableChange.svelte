<script lang="ts">
	import type { TimetableDay } from 'bbs-parser/src/types';
	import type { ProcessedChange } from '@/routes/api/background/changesCheck/+server';
	import { Button, Container, Head, Hr, Html, Img, Preview, Section, Text } from 'svelte-email';

	export let changesSummary: string;
	export let changes: ProcessedChange[];

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
	<Preview preview="Stundenplanänderung {changesSummary}" />
	<Section style={main}>
		<Container style={container}>
			{#each changes as changeDay}
				<Text style={{ marginTop: '32px', fontWeight: '800', fontSize: '20px' }}>
					<b>{changeDay.formattedDate}</b>
				</Text>

				<Text style={paragraph}>neuer Stundenplan:</Text>

				{#each changeDay.newData as [hours, slot]}
					{#each slot as lesson}
						<Text style={{ paddingLeft: '32px', margin: '0px' }}>
							<b>{hours.join('/')}</b>
							: {@html lesson.subject} - {@html lesson.teacher} @ {@html lesson.room}
						</Text>
					{/each}
					<Text />
				{/each}

				<Text style={paragraph}>alter Stundenplan:</Text>

				{#each changeDay.oldData as [hours, slot]}
					{#each slot as lesson}
						<Text style={{ paddingLeft: '32px', margin: '0px' }}>
							<b>{hours.join('/')}</b>
							: {@html lesson.subject} - {@html lesson.teacher} @ {@html lesson.room}
						</Text>
					{/each}
					<Text />
				{/each}
			{/each}
			<Hr style={hr} />
			<Text style={footer}>BBS Vanced by Lea Lohrie</Text>
			<Text style={footer}>
				Du kannst diese Emails in den Einstellungen der BBS Vanced App deaktivieren.
			</Text>
		</Container>
	</Section>
</Html>
