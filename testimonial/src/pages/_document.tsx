// pages/_document.tsx
import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import React from 'react';
import { revalidate, FlushedChunks, flushChunks } from '@module-federation/nextjs-mf/utils';

// Extend props to include chunks
interface MyDocumentProps extends DocumentInitialProps {
  chunks: any;
}

class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<MyDocumentProps> {
    const { req, res } = ctx;

    if (process.env.NODE_ENV === 'development' && req?.url && res) {
      if (!req.url.includes('_next')) {
        await revalidate().then((shouldReload: boolean) => {
          if (shouldReload) {
            res.writeHead(302, { Location: req.url });
            res.end();
          }
        });
      }
    } else if (res) {
      res.on('finish', () => {
        revalidate();
      });
    }

    const initialProps = await Document.getInitialProps(ctx);
    const chunks = await flushChunks();

    return {
      ...initialProps,
      chunks,
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="robots" content="noindex" />
          <FlushedChunks chunks={this.props.chunks} />
        </Head>
        <body className="bg-background-grey">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
