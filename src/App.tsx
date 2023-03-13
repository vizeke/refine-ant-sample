import React from 'react';

import { Refine, GitHubBanner } from '@pankod/refine-core';
import { notificationProvider, Layout, ReadyPage, ErrorComponent } from '@pankod/refine-antd';
import '@pankod/refine-antd/dist/reset.css';

import routerProvider from '@pankod/refine-react-router-v6';
import { AntdInferencer } from '@pankod/refine-inferencer/antd';
import { dataProvider } from 'rest-data-provider';

function App() {
  return (
    <>
      <GitHubBanner />

      <Refine
        notificationProvider={notificationProvider}
        Layout={Layout}
        ReadyPage={ReadyPage}
        catchAll={<ErrorComponent />}
        routerProvider={routerProvider}
        dataProvider={dataProvider('https://api.fake-rest.refine.dev')}
        resources={[
          {
            name: 'products',
            list: AntdInferencer,
            show: AntdInferencer,
            create: AntdInferencer,
            edit: AntdInferencer
          }
        ]}
      />
    </>
  );
}

export default App;
