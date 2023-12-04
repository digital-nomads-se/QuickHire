import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDocs = ({ spec }) => (
  <SwaggerUI spec={spec} />
);

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/docs');
  const spec = await res.json();

  return {
    props: {
      spec,
    },
  };
}

export default ApiDocs;