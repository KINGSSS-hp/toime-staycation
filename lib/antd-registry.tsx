"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";

const theme = {
  token: {
    colorPrimary: "#8B5E3C",
    colorSuccess: "#4A7C59",
    colorBgBase: "#FAF8F4",
    colorTextBase: "#2D2016",
    borderRadius: 8,
    fontFamily: "'Be Vietnam Pro', sans-serif",
  },
};

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={theme} locale={viVN}>
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
