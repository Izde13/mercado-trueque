import { useParams } from "react-router-dom";
export default function ProductDetailPage(){
  const { id } = useParams();
  return (
    <section style={{padding:24}}>
      <h1>Detalle del producto #{id}</h1>
    </section>
  );
}