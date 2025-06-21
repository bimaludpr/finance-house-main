import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div>
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    </div>
  );
};

// Disable automatic static optimization
export const getServerSideProps = async () => {
  return {
    props: {}
  };
};

export default Error; 