import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDocs = ({ spec }) => (
  <SwaggerUI spec={spec} />
);

export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/docs`);
  const spec = await res.json();

  return {
    props: {
      spec,
    },
  };
}

export default ApiDocs;