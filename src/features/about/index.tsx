import { ModuleWrapper } from "@components/module-wrapper";
import { useRequestContext } from "@providers/request-provider";
import { Alert, Badge } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { Download, Heart, Coffee, Laptop, Github } from "lucide-react";
import { generalizeDependencies } from "@utils/general-helper";
import {
  MainContainer,
  SubContainer,
  TileContainer,
  TerminalContainer,
  CardContainer,
  UserContainer,
} from "@components/container";
import { TabularGridContainer } from "@components/tabular-grid";
import { TitleContainer } from "@components/title";
import { BannerBadge, TechStackType, TechStackTypeTag, VersionDetails } from "types";
import {
  TechStack,
  Storage,
  ExternalResources,
  CLI,
  Contributors,
  SystemStatus,
} from "./siteConfigInfo";

export const AboutModule = () => {
  const [gitRepoData, setGitRepoData] = useState(null); // remove - unnecessary
  const [latestVersion, setLatestVersion] = useState<VersionDetails | null>(null);
  const [currentVersion, setCurrentVersion] = useState<VersionDetails | null>(null);
  const [versionFetchError, setVersionFetchError] = useState<string | null>(null);
  const [prjDependencies, setPrjDependencies] = useState<Record<string, TechStackType>>(
    generalizeDependencies(APP_DEPENDENCIES, TechStack)
  );
  const [systemInfoCards, setSystemInfoCards] = useState<Array<[string, TechStackType]> | null>(
    null
  );
  const [leadCMSbadges, setLeadCMSbadges] = useState<BannerBadge[] | null>(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [updateIndicator, setUpdateIndicator] = useState(false);
  const [preLoading, setPreLoading] = useState(true);
  const [versionValidated, setVersionValidated] = useState(false);

  // const selfHostedBadge = LeadCMSbadges.find((mt) => mt.label === "Self-Hosted") || null;
  // const versionValidated = useRef(false)

  const { client } = useRequestContext();

  const operationHold = (ms: number) =>
    new Promise<void>((resolve) => window.setTimeout(() => resolve(), ms));

  // banner related badges
  useEffect(() => {
    if (systemInfoCards) {
      const website =
        systemInfoCards?.find(
          (tcstktype: [string, TechStackType]): tcstktype is [string, TechStackType] =>
            tcstktype[0] === "site"
        ) || null;
      const siteVersion = website
        ? website[1].segment_i?.tags?.find((tag) => tag.label === "version")?.value
        : "unknown";

      const badges = [
        {
          label: "Stable",
          variant: "outline",
          attr: "banner-transparent-green",
        },
        {
          label: siteVersion,
          variant: "outline",
          attr: "banner-transparent-blue",
        },
        {
          label: "MIT License",
          variant: "outline",
          attr: "banner-transparent-red",
        },
        {
          label: "Self-Hosted",
          variant: "outline",
          attr: "banner-transparent-orange",
        },
      ];

      setLeadCMSbadges(badges);
    }
  }, [systemInfoCards]);

  // for system info card trio
  useEffect(() => {
    if (prjDependencies) {
      const systemStack = { ...prjDependencies };

      try {
        if (currentVersion?.version) {
          systemStack.site.segment_i.tags = [
            { label: "version", value: `v${currentVersion?.version}`, attr: "primary" },
          ];
          systemStack.admin.segment_i.tags = [
            { label: "version", value: `v${currentVersion?.version}`, attr: "primary" },
          ];
        }

        if (latestVersion?.version) {
          systemStack.site.segment_i.tags = [
            // ...systemStack.site.segment_i.tags,
            {
              label: "latest-version",
              value: `v${latestVersion?.version}`,
              attr: "secondary",
              ext: "available",
            },
          ];
          systemStack.site.segment_i.tags = [
            // ...systemStack.admin.segment_i.tags,
            {
              label: "latest-version",
              value: `v${latestVersion?.version}`,
              attr: "secondary",
              ext: "available",
            },
          ];
        }
      } catch (e) {
        console.log(e);
      }

      setPreLoading(false);
      setSystemInfoCards(Object.entries(systemStack));
    }
  }, [prjDependencies]);

  ///////////////// temp hook ///////////////////////
  useEffect(() => {
    // const versionValidator = async () => {
    if (currentVersion && gitRepoData && !versionValidated) {
      // Storage.server.deployment === "On-Premises"
      // await operationHold(5000);

      const curVsn = parseFloat(currentVersion.version);
      // const lstVsn = parseFloat(latestVersion.version);
      const lstVsn = parseFloat(gitRepoData["iPv4"] || "unknown"); // temp

      setVersionValidated(true);

      // console.log(curVsn, lstVsn);
      if (curVsn < lstVsn) {
        setUpdateIndicator(curVsn < lstVsn);
        console.log("initial uf");
      }
    }
    // };

    // versionValidator();
  }, [currentVersion, gitRepoData]);

  useEffect(() => {
    const getDockerHostVersion = async () => {
      // fetch(`https://api.github.com/repos/LeadCMS/leadcms.admin/releases`)
      // fetch("https://api.github.com/repos/LeadCMS/leadcms.admin")
      fetch("http://localhost:8080/api/version") // mock fetch
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setGitRepoData(data);
            // setLatestVersion({
            //   version: data?.version,
            //   updatedOn: (data?.latestUpdate) ? data.latestUpdate : new Date().toISOString()
            // });
          } else {
            setVersionFetchError(null);
          }
        })
        .catch((err) => setVersionFetchError(err.message));
    };

    const getCurrentVersion = async () => {
      const { data } = await client.api.versionList();

      // setCurrentVersion({
      //   version: data?.version,
      //   updatedOn: (data?.latestUpdate) ? data.latestUpdate : new Date().toISOString()
      // });
    };

    const getLatestVersion = async () => {
      await operationHold(5000);

      await getDockerHostVersion();
    };

    getCurrentVersion();
    getLatestVersion();
  }, []);

  return (
    <ModuleWrapper breadcrumbs={[]} currentBreadcrumb={"About"}>
      <MainContainer
        cmpID="about_section"
        styleObj={{
          cmpTag: "container",
          cmpStyles: ["main-container", "about-section-container"],
        }}
        cmpFontSize={18}
      >
        <div className="mock-data-fetch-container">
          <p className="content">
            <span className="label">Attribute: </span>&nbsp;
            {preLoading ? (
              <span className="loading-animation">&nbsp;</span>
            ) : (
              <span className="fetched-data">- result | update available -</span>
            )}
          </p>
        </div>

        <SubContainer
          cmpID="banner_area"
          styleObj={{
            cmpTag: "container",
            cmpStyles: [
              "sub-container",
              "banner-container",
              updateIndicator ? "" : "no-update-indicator",
            ],
          }}
          cmpFontSize={16}
        >
          <TileContainer
            styleObj={{
              cmpTag: "container",
              cmpStyles: ["logo-container"],
            }}
            cmpFontSize={16}
          >
            <img src="/images/logo.png" alt="LeadCMS.ai Logo" className="brand-logo" />
            <p className="brand-name">LeadCMS.ai</p>
            <p className="brand-moto">The Open-Source Sales Automation & CMS for SaaS</p>
          </TileContainer>
          <TileContainer
            styleObj={{
              cmpTag: "container",
              cmpStyles: ["badge-container"],
            }}
            cmpFontSize={10}
          >
            {leadCMSbadges
              ?.filter((mt) => mt.label !== "Self-Hosted")
              .map((mt, _key) => (
                <span key={`0${_key}`} className={`badge ${mt?.attr}`}>
                  {mt.label}
                </span>
              ))}
          </TileContainer>
        </SubContainer>

        {updateIndicator && (
          <SubContainer
            cmpID="update_indicator"
            styleObj={{
              cmpTag: "container",
              cmpStyles: ["sub-container", "alert-container"],
            }}
            cmpFontSize={16}
          >
            <Alert className="alert-panel normal">
              <h5 className="alert-title">
                <>
                  <Download />
                  &nbsp;
                </>
                <span>New version available:&nbsp;v{latestVersion?.version}</span>
              </h5>
              <p className="alert-context">
                Update your on-premises deployment using Docker Compose:
              </p>
              <TerminalContainer
                styleObj={{
                  cmpTag: "container",
                  cmpStyles: ["terminal-container"],
                }}
                cliObj={CLI}
              />
            </Alert>
          </SubContainer>
        )}

        <SubContainer
          styleObj={{
            cmpTag: "container",
            cmpStyles: [
              "sub-container",
              "system-details-container",
              updateIndicator ? "" : "no-update-indicator",
            ],
          }}
        >
          <>
            {systemInfoCards?.map(([segmentKey, segment]: [string, TechStackType]) => (
              <CardContainer
                key={segmentKey}
                styleObj={{
                  cmpTag: `card card-${segmentKey}`,
                  cmpStyles: ["system-details-card"],
                }}
                cHeader={segment?.segment_i || null}
                cBody={segment?.segment_ii || null}
                cFooter={segment?.segment_iii || null}
              />
            ))}
          </>
        </SubContainer>

        <TabularGridContainer
          styleObj={{
            cmpTag: "tabular-segment",
            cmpStyles: ["product-stack-segment"],
          }}
          gridObj={SystemStatus}
          tableName={"Product-Stack"}
        />

        <TitleContainer
          styleObj={{
            cmpTag: "title-bar",
            cmpStyles: ["resources-title-bar"],
          }}
          rootElementAlt={"h2"}
          context="Resources"
          expanders={true}
          dividable={true}
        />

        <SubContainer
          cmpID="resources"
          styleObj={{
            cmpTag: "container",
            cmpStyles: [
              "sub-container",
              "resources-container",
              ExternalResources.length >= 2 ? "over-two-items" : "",
            ],
          }}
          cmpFontSize={16}
        >
          <>
            {ExternalResources.map((link, linkKey) => (
              <TileContainer
                key={linkKey}
                styleObj={{
                  cmpTag: "container",
                  cmpStyles: ["tile-container", "resource-container"],
                }}
                cmpFontSize={16}
              >
                <a
                  href={link.url}
                  target="_blank"
                  className="resource-link"
                  rel="noopener noreferrer"
                >
                  <span className="icon">{link.icon}</span>
                  <h4 className="domain">{link.name}</h4>
                </a>
              </TileContainer>
            ))}
          </>
        </SubContainer>

        <TitleContainer
          styleObj={{
            cmpTag: "title-bar",
            cmpStyles: ["contributors-title-bar"],
          }}
          rootElementAlt={"h2"}
          context="Development Team"
          expanders={true}
          dividable={true}
        />

        <SubContainer
          styleObj={{
            cmpTag: "container",
            cmpStyles: [
              "sub-container",
              "contributors-container",
              Contributors.length >= 2 ? "over-two-items" : "",
            ],
          }}
        >
          <>
            {Contributors.map((member, memberKey) => (
              <UserContainer
                key={memberKey}
                styleObj={{
                  cmpTag: "user-card",
                  cmpStyles: ["contributor-user-card"],
                }}
                cmpFontSize={14}
                memberObj={member}
              />
            ))}
          </>
        </SubContainer>

        <TitleContainer
          cmpID="footer"
          styleObj={{
            cmpTag: "title-bar",
            cmpStyles: ["footer-title-bar"],
          }}
          rootElementAlt={"p"}
          context=""
        >
          <div className="footer-panel">
            <p className="from">
              Made with <Heart /> by our LeadCMS-Devs <Laptop />
            </p>
            <div className="sub-actions">
              <button className="sub-act-btn support">
                <Coffee />
                &nbsp;Support the Project
              </button>
              <button className="sub-act-btn review">
                <Github />
                &nbsp;Star us on GitHub
              </button>
            </div>
          </div>
        </TitleContainer>
      </MainContainer>
    </ModuleWrapper>
  );
};
