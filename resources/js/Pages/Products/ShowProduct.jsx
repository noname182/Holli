import Layout from '@/Layouts/MainLayout';
import Showcontent from './Showcontent';

export default function ShowProduct({ product }) {
 return (
    <Layout title={product.name}>
        <Showcontent product={product}/>
    </Layout>
 );    
}
