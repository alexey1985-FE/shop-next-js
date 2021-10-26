import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
	navbar: {
		backgroundColor: '#203040',
		'& a': {
			color: '#ffffff',
			marginLeft: 10,
		},
	},
	main: {
		minHeight: '80vh',
	},
	brand: {
		fontWeight: 'bold',
		fontSize: '1.5rem',
	},
	grow: {
		flexGrow: 1,
	},
	footer: {
		textAlign: 'center',
	},
	section: {
		marginTop: 10,
		marginBottom: 10,
	},
	form: {
		maxWidth: 800,
		margin: '0 auto',
	},
	navbarButton: {
		color: '#ffffff',
		textTransform: 'initial',
	},
});

export default useStyles;