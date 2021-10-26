import {
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Grid,
	Typography,
} from '@material-ui/core';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import db from '../utils/db';
import Product from '../models/Product';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import { useContext } from 'react';
import { Store } from '../utils/Store';

function Home(props) {
	const { products } = props;
	const router = useRouter();
	const { state, dispatch } = useContext(Store);

	const addToCartHandler = async product => {
		const existItem = state.cart.cartItems.find(item => item._id === product._id);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${product._id}`);
		if (data.countInStock < quantity) {
			alert('Sorry. Product is out of stock');
			return;
		}
		dispatch({ type: 'ADD_CART_ITEM', payload: { ...product, quantity } });
		router.push('/cart');
	};

	return (
		<Layout>
			<h1>Products</h1>
			<Grid container spacing={3}>
				{products.map(product => (
					<Grid item md={4} key={product.name}>
						<Card>
							<NextLink href={`/product/${product.slug}`} passHref>
								<CardActionArea>
									<CardMedia component="img" image={product.image} title={product.name}></CardMedia>
									<CardContent>
										<Typography>
											<strong>{product.name}</strong>
										</Typography>
									</CardContent>
								</CardActionArea>
							</NextLink>
							<CardActions>
								<Typography>
									<strong>${product.price}</strong>
								</Typography>
								<Button size="small" color="primary" onClick={() => addToCartHandler(product)}>
									Add to cart
								</Button>
							</CardActions>
						</Card>
					</Grid>
				))}
			</Grid>
		</Layout>
	);
}

export async function getServerSideProps() {
	await db.connect();
	const products = await Product.find({}).lean();
	await db.disconnect();

	return {
		props: { products: products.map(db.convertDocToObj) },
	};
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });
