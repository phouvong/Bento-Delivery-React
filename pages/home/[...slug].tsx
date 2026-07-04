import CssBaseline from "@mui/material/CssBaseline";
import type { GetServerSideProps, NextPage } from "next";
import Router from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setConfigData } from "redux/slices/configData";
import { processMetadata } from "utils/fetchPageMetaData";
import {
  findModuleTypeByParam,
  resolveSectionMeta,
} from "utils/sectionMetaResolver";
import {
  isValidModuleKey,
  isValidSectionId,
  type ModuleKey,
} from "utils/sectionRegistry";
import {
  checkMaintenanceMode,
  getCommonServerSideProps,
} from "utils/serverSidePropsHelper";
import useGetLandingPage from "../../src/api-manage/hooks/react-query/useGetLandingPage";
import MainLayoutImport from "../../src/components/layout/MainLayout";
import ModuleWiseLayoutImport from "../../src/components/module-wise-layout";
import ZoneGuardImport from "../../src/components/route-guard/ZoneGuard";
import SEOImport from "../../src/components/seo";

const SEO: any = SEOImport;
const MainLayout: any = MainLayoutImport;
const ModuleWiseLayout: any = ModuleWiseLayoutImport;
const ZoneGuard: any = ZoneGuardImport;

type HomeSectionPageProps = {
  configData: any;
  metaData: any;
  routeSection: string | null;
};

const HomeSectionPage: NextPage<HomeSectionPageProps> & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
} = ({ configData, metaData, routeSection }) => {
  const dispatch = useDispatch();
  const { data: dataLanding } = useGetLandingPage();

  const metadata = processMetadata(metaData, {
    title: `Home - ${configData?.business_name ?? ""}`,
    description: metaData?.description || "",
    image: `${metaData?.image || configData?.logo_full_url || ""}`,
    robotsMeta: metaData?.robotsMeta || "",
  });

  useEffect(() => {
    if (configData) {
      if (Array.isArray(configData) && configData.length === 0) {
        Router.push("/404");
      } else if (checkMaintenanceMode(configData)) {
        Router.push("/maintainance");
      } else {
        dispatch(setConfigData(configData));
      }
    }
  }, [configData, dispatch]);

  return (
    <>
      <CssBaseline />
      {configData && (
        <SEO
          title={metadata.title}
          description={metadata.description}
          image={metadata.image}
          robotsMeta={metadata.robotsMeta}
          configData={configData}
        />
      )}
      <MainLayout configData={configData} landingPageData={dataLanding}>
        <ModuleWiseLayout
          configData={configData}
          landingPageData={dataLanding}
          routeSection={routeSection ?? undefined}
        />
      </MainLayout>
    </>
  );
};

export default HomeSectionPage;

HomeSectionPage.getLayout = (page) => <ZoneGuard>{page}</ZoneGuard>;

export const getServerSideProps: GetServerSideProps<
  HomeSectionPageProps
> = async (context) => {
  const { params, query, req } = context;
  const language = (req as any)?.cookies?.languageSetting || "en";

  const slugParam = params?.slug;
  const slugSegments: string[] = Array.isArray(slugParam)
    ? slugParam
    : typeof slugParam === "string"
    ? [slugParam]
    : [];

  const moduleParam = typeof query.module === "string" ? query.module : "";

  if (!moduleParam || slugSegments.length === 0) {
    return { notFound: true };
  }

  let moduleType = await findModuleTypeByParam(moduleParam, language);
  if (!isValidModuleKey(moduleType) && isValidModuleKey(moduleParam)) {
    moduleType = moduleParam;
  }
  if (!isValidModuleKey(moduleType)) {
    return { notFound: true };
  }
  const moduleKey: ModuleKey = moduleType;

  const baseProps = await getCommonServerSideProps(context, "home_page");
  const configData = (baseProps as any).props?.configData ?? null;

  if (slugSegments.length !== 1) {
    return { notFound: true };
  }

  const sectionId = slugSegments[0];
  if (!isValidSectionId(moduleKey, sectionId)) {
    return { notFound: true };
  }

  const resolvedMeta = await resolveSectionMeta(
    moduleKey,
    sectionId,
    language,
    configData
  );

  return {
    props: {
      configData,
      metaData: resolvedMeta,
      routeSection: sectionId,
    },
  };
};
