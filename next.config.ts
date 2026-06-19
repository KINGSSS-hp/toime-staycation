import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: ["antd", "@ant-design/icons", "@ant-design/nextjs-registry"],
};

export default withNextIntl(nextConfig);
