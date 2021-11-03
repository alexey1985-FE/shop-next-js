import React, { useContext, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
	AppBar,
	Container,
	CssBaseline,
	Link,
	Toolbar,
	Typography,
	createTheme,
	Switch,
	Button,
	Menu,
	MenuItem,
} from '@material-ui/core';
import useStyles from '../utils/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { Badge } from '@material-ui/core';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

function Layout({ description, children, title }) {
	const router = useRouter();
	const { state, dispatch } = useContext(Store);
	const { darkMode, cart, userInfo } = state;
	const classes = useStyles();
	const theme = createTheme({
		typography: {
			h1: {
				fontSize: '1.6rem',
				fontWeight: 400,
				margin: '1rem 0',
			},
			h2: {
				fontSize: '1.4rem',
				fontWeight: 400,
				margin: '1rem 0',
			},
		},
		palette: {
			type: darkMode ? 'dark' : 'light',
			primary: {
				main: '#f0c000',
			},
			secondary: {
				main: '#208080',
			},
		},
	});

	const changeDarkModeTheme = () => {
		dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
		const newDarkMode = !darkMode;
		Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
	};

	const [anchorEl, setAnchoeEl] = useState(null);
	const loginClickHandler = e => {
		setAnchoeEl(e.currentTarget);
	};
	const loginMenuCloseHandler = (e, redirect) => {
		setAnchoeEl(null);
		if (redirect) {
			router.push(redirect);
		}
	};
	const logoutClickHandler = () => {
		setAnchoeEl(null);
		dispatch({ type: 'USER_LOGOUT' });
		Cookies.remove('userInfo');
		Cookies.remove('cartItems');
		Cookies.remove('shippingAddress');
		router.push('/');
	};

	return (
		<div>
			<Head>
				<title>{title ? `${title} - Next JS Shop` : 'Next JS Shop'}</title>
				{description && <meta name="description" content={description}></meta>}
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AppBar position="static" className={classes.navbar}>
					<Toolbar>
						<NextLink href="/" passHref>
							<Link>
								<Typography className={classes.brand}>next shop</Typography>
							</Link>
						</NextLink>
						<div className={classes.grow}></div>
						<div>
							<Switch checked={darkMode} onChange={changeDarkModeTheme} />
							<NextLink href="/cart" passHref>
								<Link>
									{cart.cartItems.length > 0 ? (
										<Badge color="secondary" badgeContent={cart.cartItems.length}>
											Cart
										</Badge>
									) : (
										'Cart'
									)}
								</Link>
							</NextLink>
							{userInfo ? (
								<>
									<Button
										id="basic-button"
										aria-controls="basic-menu"
										aria-haspopup="true"
										aria-expanded={open ? 'true' : undefined}
										onClick={loginClickHandler}
										className={classes.navbarButton}
									>
										{userInfo.name}
									</Button>
									<Menu
										id="basic-menu"
										anchorEl={anchorEl}
										open={Boolean(anchorEl)}
										onClose={loginMenuCloseHandler}
										MenuListProps={{
											'aria-labelledby': 'basic-button',
										}}
									>
										<MenuItem onClick={e => loginMenuCloseHandler(e, '/profile')}>Profile</MenuItem>
										<MenuItem onClick={e => loginMenuCloseHandler(e, '/order-history')}>
											Order History
										</MenuItem>
										<MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
									</Menu>
								</>
							) : (
								<NextLink href="/login" passHref>
									<Link>Login</Link>
								</NextLink>
							)}
						</div>
					</Toolbar>
				</AppBar>
				<Container className={classes.main}>{children}</Container>
				<footer className={classes.footer}>
					<h3>All rights reserved. Alexey Yevkov.</h3>
				</footer>
			</ThemeProvider>
		</div>
	);
}

export default dynamic(() => Promise.resolve(Layout), { ssr: false });
