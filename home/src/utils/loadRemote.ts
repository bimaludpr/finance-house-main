import dynamic from 'next/dynamic';
import React from 'react';

export function loadRemote(remoteName: string) {
  return dynamic(() => import(remoteName), {
    ssr: false,
    loading: () => React.createElement('div', null, 'Loading...')
  });
} 