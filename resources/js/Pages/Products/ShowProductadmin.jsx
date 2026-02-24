import Layout from '../Admin/Layouts/MainLayoutadmin';
import Showcontentadmin from './Showcontentadmin';

export default function ShowProduct({ product }) {
 return (
    <Layout title={product.name}>
        <Showcontentadmin product={product}/>
    </Layout>
 );    
}
